#!/usr/bin/env python3
"""
qwen3-vl-4b 模型测试脚本
测试公司 H20 API 端点的视觉语言模型
"""

import requests
import json
import base64
import socket
import statistics
import time
from pathlib import Path
from urllib.parse import urlparse


class Qwen3VLTester:
    def __init__(self, api_url, api_key):
        self.api_url = api_url
        self.api_key = api_key
        self.headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

    @staticmethod
    def _format_seconds(value):
        """格式化秒输出"""
        if value is None:
            return "N/A"
        return f"{value:.3f} 秒"

    def _estimate_network_latency(self, attempts=3, timeout=3):
        """通过 TCP 建连估算网络延迟"""
        parsed = urlparse(self.api_url)
        host = parsed.hostname
        if not host:
            return None

        port = parsed.port or (443 if parsed.scheme == "https" else 80)
        samples = []

        for _ in range(attempts):
            start = time.perf_counter()
            sock = None
            try:
                sock = socket.create_connection((host, port), timeout=timeout)
                samples.append(time.perf_counter() - start)
            except OSError:
                continue
            finally:
                if sock is not None:
                    sock.close()

        if not samples:
            return None

        return statistics.median(samples)

    def _extract_stream_content(self, chunk):
        """兼容 OpenAI 风格流式响应内容提取，支持 reasoning_content（思考模式）"""
        choices = chunk.get("choices") or []
        if not choices:
            return "", ""

        choice = choices[0]
        delta = choice.get("delta") or {}

        # 提取 reasoning/reasoning_content（思考过程）
        reasoning = ""
        reasoning_val = delta.get("reasoning") or delta.get("reasoning_content")
        if isinstance(reasoning_val, str):
            reasoning = reasoning_val

        # 提取 content（最终回答）
        content = delta.get("content")
        result = ""
        if isinstance(content, str):
            result = content
        elif isinstance(content, list):
            texts = []
            for item in content:
                if isinstance(item, dict) and item.get("type") == "text":
                    texts.append(item.get("text", ""))
            result = "".join(texts)
        else:
            message = choice.get("message") or {}
            message_content = message.get("content")
            if isinstance(message_content, str):
                result = message_content

        return result, reasoning

    def _print_timing_breakdown(self, timings):
        """打印耗时明细"""
        print("\n⏱️  耗时明细:")
        print(f"  网络延迟（TCP 建连估算）: {self._format_seconds(timings.get('network_latency_seconds'))}")
        print(f"  HTTP 首包耗时: {self._format_seconds(timings.get('http_header_seconds'))}")
        print(f"  首 token 延迟: {self._format_seconds(timings.get('first_token_seconds'))}")
        print(f"  文本生成耗时: {self._format_seconds(timings.get('generation_seconds'))}")
        print(f"  模型推理时间（估算）: {self._format_seconds(timings.get('model_inference_seconds'))}")
        print(f"  请求总耗时: {self._format_seconds(timings.get('total_seconds'))}")
        print("  说明: 模型推理时间 = 首 token 延迟 - 估算网络往返 + 文本生成耗时，仅为客户端侧估算值")

    def _stream_chat_completion(self, payload, timeout):
        """使用流式响应获取更细粒度的时延数据"""
        stream_payload = dict(payload)
        stream_payload["stream"] = True

        network_latency_seconds = self._estimate_network_latency()
        request_start = time.perf_counter()
        response = requests.post(
            self.api_url,
            headers=self.headers,
            json=stream_payload,
            timeout=timeout,
            stream=True
        )
        header_received_at = time.perf_counter()
        response.raise_for_status()
        response.encoding = "utf-8"

        first_token_at = None
        completion_text = []
        reasoning_text = []
        usage = None
        finish_reason = None
        debug_count = 0

        for raw_line in response.iter_lines(decode_unicode=True):
            if not raw_line:
                continue

            line = raw_line.strip()
            if not line.startswith("data:"):
                continue

            data = line[5:].strip()
            if not data:
                continue
            if data == "[DONE]":
                break

            try:
                chunk = json.loads(data)
            except json.JSONDecodeError:
                continue

            # 调试：打印前5个chunk的原始数据
            if debug_count < 5:
                print(f"\n[DEBUG] chunk #{debug_count}: {json.dumps(chunk, ensure_ascii=False)[:500]}")
                debug_count += 1

            content_piece, reasoning_piece = self._extract_stream_content(chunk)
            if content_piece or reasoning_piece:
                if first_token_at is None:
                    first_token_at = time.perf_counter()
                if content_piece:
                    completion_text.append(content_piece)
                if reasoning_piece:
                    reasoning_text.append(reasoning_piece)

            if chunk.get("usage"):
                usage = chunk["usage"]

            choices = chunk.get("choices") or []
            if choices and choices[0].get("finish_reason"):
                finish_reason = choices[0]["finish_reason"]

        finished_at = time.perf_counter()
        first_token_seconds = (first_token_at - request_start) if first_token_at else None
        generation_seconds = (finished_at - first_token_at) if first_token_at else None
        total_seconds = finished_at - request_start
        http_header_seconds = header_received_at - request_start
        estimated_round_trip_seconds = (network_latency_seconds * 2) if network_latency_seconds is not None else None

        model_inference_seconds = None
        if first_token_seconds is not None and generation_seconds is not None:
            non_network_wait_seconds = first_token_seconds
            if estimated_round_trip_seconds is not None:
                non_network_wait_seconds = max(first_token_seconds - estimated_round_trip_seconds, 0)
            model_inference_seconds = non_network_wait_seconds + generation_seconds

        return {
            "status_code": response.status_code,
            "content": "".join(completion_text).strip(),
            "reasoning": "".join(reasoning_text).strip(),
            "usage": usage,
            "finish_reason": finish_reason,
            "timings": {
                "network_latency_seconds": network_latency_seconds,
                "http_header_seconds": http_header_seconds,
                "first_token_seconds": first_token_seconds,
                "generation_seconds": generation_seconds,
                "model_inference_seconds": model_inference_seconds,
                "total_seconds": total_seconds
            }
        }

    def encode_image(self, image_path):
        """将图像编码为 base64"""
        with open(image_path, "rb") as image_file:
            return base64.b64encode(image_file.read()).decode('utf-8')

    def test_text_only(self, prompt="你好，请介绍一下你自己。"):
        """测试纯文本对话"""
        print("\n" + "="*60)
        print("📝 纯文本对话测试")
        print("="*60)
        print(f"提示词: {prompt}")
        print("测试模型: qwen3-32b")

        payload = {
            "model": "qwen3.5-35b",
            "messages": [
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            "temperature": 0.7,
            "max_tokens": 1000
        }

        try:
            result = self._stream_chat_completion(payload, timeout=30)

            print(f"\n✓ 状态码: {result['status_code']}")
            if result.get('reasoning'):
                print(f"✓ 思考过程:")
                print(f"  {result['reasoning']}")
            print(f"✓ 响应内容:")
            print(f"  {result['content']}")
            self._print_timing_breakdown(result["timings"])
            if result.get("usage"):
                print(f"✓ Token 使用: {result['usage']}")

            return result
        except requests.exceptions.RequestException as e:
            print(f"\n✗ 请求失败: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"  响应内容: {e.response.text}")
            return None

    def test_image_understanding(self, image_path, prompt=None):
        """测试图像理解能力"""

        if prompt is None:
            # 从文件读取默认提示词
            prompt_file = Path(__file__).parent / "docs" / "原-人员资质识别 Prompt.md"
            if prompt_file.exists():
                prompt = prompt_file.read_text(encoding="utf-8")
            else:
                prompt = "请分析这张证书图片，提取所有可见的文字信息。"
                print(f"⚠️ 提示词文件不存在: {prompt_file}")

        print("\n" + "="*60)
        print("🖼️  图像理解测试")
        print("="*60)
        print(f"图片路径: {image_path}")
        print(f"提示词: {prompt}")
        print("测试模型: qwen3.5 35B")

        if not Path(image_path).exists():
            print(f"\n✗ 图片文件不存在: {image_path}")
            return None

        try:
            # 编码图像
            base64_image = self.encode_image(image_path)

            payload = {
                "model": "qwen3.5-35b",
                "messages": [
                    {
                        "role": "user",
                        "content": [
                            {
                                "type": "text",
                                "text": prompt
                            },
                            {
                                "type": "image_url",
                                "image_url": {
                                    "url": f"data:image/jpeg;base64,{base64_image}"
                                }
                            }
                        ]
                    }
                ],
                "temperature": 0.7,
                "max_tokens": 4096
            }

            result = self._stream_chat_completion(payload, timeout=600)

            print(f"\n✓ 状态码: {result['status_code']}")
            if result.get('reasoning'):
                print(f"✓ 思考过程:")
                print(f"  {result['reasoning']}")
            print(f"✓ 响应内容:")
            print(f"  {result['content']}")
            self._print_timing_breakdown(result["timings"])
            if result.get("usage"):
                print(f"✓ Token 使用: {result['usage']}")

            return result
        except requests.exceptions.RequestException as e:
            print(f"\n✗ 请求失败: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"  响应内容: {e.response.text}")
            return None
        except Exception as e:
            print(f"\n✗ 处理失败: {e}")
            return None

    def test_multi_turn_conversation(self):
        """测试多轮对话"""
        print("\n" + "="*60)
        print("测试 3: 多轮对话")
        print("="*60)

        messages = [
            {"role": "user", "content": "请记住这个数字：42"},
            {"role": "assistant", "content": "好的，我记住了数字 42。"},
            {"role": "user", "content": "我刚才让你记住的数字是多少？"}
        ]

        payload = {
            "model": "qwen3.5-35b",
            "messages": messages,
            "temperature": 0.7,
            "max_tokens": 500
        }

        try:
            result = self._stream_chat_completion(payload, timeout=30)

            print(f"\n✓ 状态码: {result['status_code']}")
            if result.get('reasoning'):
                print(f"✓ 思考过程:")
                print(f"  {result['reasoning']}")
            print(f"✓ 响应内容:")
            print(f"  {result['content']}")
            self._print_timing_breakdown(result["timings"])
            if result.get("usage"):
                print(f"✓ Token 使用: {result['usage']}")

            return result
        except requests.exceptions.RequestException as e:
            print(f"\n✗ 请求失败: {e}")
            if hasattr(e, 'response') and e.response is not None:
                print(f"  响应内容: {e.response.text}")
            return None


def show_menu():
    """显示测试菜单"""
    print("\n" + "="*60)
    print("请选择测试类型:")
    print("="*60)
    print("1. 测试文字对话")
    print("2. 测试图片理解")
    print("3. 退出")
    print("="*60)

    while True:
        choice = input("\n请输入选项 (1/2/3): ").strip()
        if choice in ['1', '2', '3']:
            return choice
        print("❌ 无效选项，请重新输入")


def main():
    # 配置信息
    API_URL = "http://172.20.1.91:3333/v1/chat/completions"
    API_KEY = "sk-uSG0FeQmu39ZlB998b408eFf22Fa4d52B3F21759F86828B8"
    
    # 固定的测试图片路径
    TEST_IMAGE_PATH = "/Users/qijiayi/Desktop/AI/大模型/pic/特种设备作业人员证书-齐强Q2行车司机2.jpg"
    print("="*60)
    print("Qwen 模型测试工具")
    print("="*60)
    print(f"API 端点: {API_URL}")
    print("文字模型: qwen3-32b")
    print("图片模型: qwen3-vl-4b")
    print(f"测试图片: {TEST_IMAGE_PATH}")

    # 创建测试器
    tester = Qwen3VLTester(API_URL, API_KEY)

    while True:
        choice = show_menu()

        if choice == '1':
            # 测试文字对话
            print("\n" + "="*60)
            print("📝 文字对话测试")
            print("="*60)
            user_input = input("请输入您的问题（直接回车使用默认问题）: ").strip()

            if not user_input:
                user_input = "你好，请用一句话介绍一下你自己。"
                print(f"使用默认问题: {user_input}")

            tester.test_text_only(user_input)

        elif choice == '2':
            # 测试图片理解
            print("\n" + "="*60)
            print("🖼️  图片理解测试")
            print("="*60)
            print(f"使用图片: {TEST_IMAGE_PATH}")

            # 检查图片是否存在
            if not Path(TEST_IMAGE_PATH).exists():
                print(f"\n❌ 错误: 图片文件不存在")
                print(f"   路径: {TEST_IMAGE_PATH}")
                continue

            user_prompt = input("请输入您的问题（直接回车使用默认证书分析提示词）: ").strip()

            if not user_prompt:
                user_prompt = None  # 使用默认提示词
                print("使用默认证书分析提示词")

            tester.test_image_understanding(TEST_IMAGE_PATH, user_prompt)

        elif choice == '3':
            print("\n👋 退出测试工具")
            break

    print("\n" + "="*60)
    print("测试完成")
    print("="*60)


if __name__ == "__main__":
    main()
