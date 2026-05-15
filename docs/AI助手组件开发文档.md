# AI 助手组件开发文档

> 国投集团智能安全生产管理系统 - AI 助手组件技术规范
>
> 版本：v1.0
> 更新日期：2026-03-06

---

## 1. 功能需求

### 1.1 核心功能模块

#### 1.1.1 智能对话

**功能描述**

提供基于 AI 的智能对话能力，支持用户与 AI 助手进行自然语言交互，获取安全生产相关的咨询和建议。

**功能要点**

- **文本消息收发**
  - 支持多行文本输入
  - 支持 Markdown 格式渲染（可选）
  - 消息字数限制：单条最多 2000 字符
  - 支持 Shift+Enter 换行，Enter 发送

- **流式响应处理**
  - 支持 SSE（Server-Sent Events）流式响应
  - 逐字/逐句渲染 AI 回复
  - 显示打字动画效果
  - 支持中断生成（Stop 按钮）

- **消息历史管理**
  - 本地存储对话历史
  - 支持对话上下文关联
  - 自动保存对话记录
  - 支持清空当前对话

**技术要求**

- 使用 WebSocket 或 SSE 实现实时通信
- 消息队列管理，确保消息顺序
- 异常重连机制
- 消息发送失败重试（最多 3 次）

---

#### 1.1.2 隐患识别分析

**功能描述**

通过上传现场图片，AI 自动识别图片中的安全隐患，并提供详细的分析结果和整改建议。

**功能要点**

- **图片上传与预览**
  - 支持多图上传（最多 5 张）
  - 支持格式：JPG、PNG、GIF、SVG、WebP
  - 单张图片大小限制：10MB
  - 图片预览缩略图展示
  - 支持删除已上传图片

- **AI 分析处理**
  - 调用后端 AI 分析接口
  - 显示分析进度提示
  - 支持分析过程中断
  - 分析超时处理（60 秒）

- **结果卡片展示与选择**
  - 卡片式展示每个隐患
  - 包含：隐患名称、描述、整改建议、风险等级
  - 支持多选隐患结果
  - 风险等级颜色标识（高/中/低）

- **表单数据插入**
  - 选中隐患后可插入到业务表单
  - 通过回调函数 `onInsertToForm` 传递数据
  - 支持批量插入

**数据格式**

```javascript
// 分析结果数据结构
{
  id: "hazard_001",
  name: "未佩戴安全帽",
  description: "现场作业人员在高处作业时未按规定佩戴安全帽",
  suggestion: "1. 立即要求作业人员佩戴安全帽\n2. 加强安全教育培训\n3. 设置现场安全监督员",
  level: "high", // high | medium | low
  location: "图片左上角区域",
  confidence: 0.95
}
```

---

#### 1.1.3 证照识别

**功能描述**

识别企业资质证照和人员资质证照，自动提取证照中的结构化信息。

**功能要点**

- **企业资质证照识别**
  - 营业执照
  - 安全生产许可证
  - 资质证书
  - 提取：企业名称、统一社会信用代码、法人、有效期等

- **人员资质证照识别**
  - 特种作业操作证
  - 安全培训合格证
  - 职业资格证书
  - 提取：姓名、证件号、工种、有效期等

- **结构化数据提取**
  - OCR 文字识别
  - 关键字段提取
  - 有效期校验
  - 证照真伪验证（可选）

**数据格式**

```javascript
// 企业证照识别结果
{
  type: "business_license",
  data: {
    companyName: "XX建筑工程有限公司",
    creditCode: "91110000XXXXXXXXXX",
    legalPerson: "张三",
    validFrom: "2020-01-01",
    validTo: "2030-01-01",
    address: "北京市朝阳区XX路XX号"
  },
  confidence: 0.98
}

// 人员证照识别结果
{
  type: "special_operation_certificate",
  data: {
    name: "李四",
    idNumber: "110101199001011234",
    certificateNumber: "T110101202300001",
    workType: "高处作业",
    validFrom: "2023-01-01",
    validTo: "2029-01-01",
    issuingAuthority: "北京市应急管理局"
  },
  confidence: 0.96
}
```

---

#### 1.1.4 智能问数

**功能描述**

通过自然语言查询企业安全生产数据，AI 自动生成查询语句并返回可视化结果。

**功能要点**

- **自然语言查询**
  - 支持口语化查询表达
  - 自动理解查询意图
  - 支持时间范围、条件筛选
  - 示例：「最近一个月的隐患整改率是多少？」

- **数据可视化展示**
  - 表格展示
  - 图表展示（柱状图、折线图、饼图）
  - 数据导出（Excel、CSV）

- **查询历史**
  - 保存常用查询
  - 快速重复查询

---

#### 1.1.5 课件生成

**功能描述**

根据用户输入的培训主题，AI 自动生成安全培训课件内容。

**功能要点**

- **主题输入**
  - 支持自定义培训主题
  - 提供常用主题模板
  - 支持关键词提示

- **课件内容生成**
  - 自动生成课件大纲
  - 生成详细内容（文字、图片建议）
  - 包含案例分析
  - 包含考核题目

- **下载/预览功能**
  - 在线预览课件
  - 导出 PPT 格式
  - 导出 PDF 格式
  - 导出 Word 格式

**生成内容结构**

```javascript
{
  title: "高处作业安全培训",
  outline: [
    { chapter: 1, title: "高处作业定义与分类", duration: "10分钟" },
    { chapter: 2, title: "高处作业危险因素", duration: "15分钟" },
    { chapter: 3, title: "安全防护措施", duration: "20分钟" },
    { chapter: 4, title: "案例分析", duration: "15分钟" }
  ],
  content: [
    {
      chapter: 1,
      sections: [
        {
          title: "什么是高处作业",
          content: "...",
          images: ["建议配图：高处作业示意图"]
        }
      ]
    }
  ],
  quiz: [
    {
      question: "高处作业是指在距坠落基准面多少米以上的作业？",
      options: ["A. 1米", "B. 2米", "C. 3米", "D. 5米"],
      answer: "B"
    }
  ]
}
```

---

### 1.2 辅助功能

#### 1.2.1 历史对话

**功能要点**

- **对话列表展示**
  - 按时间倒序排列
  - 分组显示：今天、昨天、7天内、更早
  - 显示对话标题（取首条消息前 20 字）
  - 显示最后更新时间
- **搜索与过滤**
  - 实时搜索（防抖 300ms）
  - 搜索范围：对话标题
  - 高亮匹配关键词
  - 无结果提示
- **对话切换与加载**
  - 点击加载历史对话
  - 保留当前对话状态
  - 切换动画效果
  - 加载失败提示
- **对话管理**
  - 编辑单条对话标题
  - 删除单条对话
  - 导出对话记录（可选）

---

#### 1.2.2 文件管理

**功能要点**

- **多文件上传**
  - 支持同时上传多个文件
  - 拖拽上传（可选）
  - 点击上传

- **文件类型校验**
  - 支持格式：`.jpg, .jpeg, .png, .gif, .svg, .webp, .doc, .docx, .xls, .xlsx, .pdf, .txt, .csv,.zip,.rar`
  - 不支持格式提示
  - 文件大小校验（单个 10MB）

- **文件预览**
  - 图片类型：缩略图预览
  - 文档类型：文件名 + 图标
  - 文件大小显示
  - 上传预加载
  - 删除按钮

---

#### 1.2.3 技能选择

**功能要点**

- **技能面板**
  - 点击技能图标展开
  - 向上弹出式面板
  - 点击外部区域关闭

- **快捷技能触发**
  - 隐患识别分析
  - 企业资质证照识别
  - 人员资质证照识别
  - 智能问数
  - 课件生成

- **技能图标与文案**
  - 每个技能配有专属图标
  - 简洁的功能描述
  - Hover 高亮效果

---

#### 1.2.4 语音输入

**功能要点**

- **语音识别**
  - 调用浏览器 Web Speech API
  - 实时语音转文字
  - 支持中文识别

- **文本转换**
  - 自动填充到输入框
  - 支持追加模式
  - 识别错误重试

**技术实现**

```javascript
// 使用 Web Speech API
const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'zh-CN';
recognition.continuous = false;
recognition.interimResults = false;

recognition.onresult = (event) => {
  const transcript = event.results[0][0].transcript;
  // 填充到输入框
};
```

---

## 2. 交互设计详细说明

### 2.1 整体交互架构

#### 2.1.1 组件布局结构

**布局组成**

```
页面容器
├── 主内容区域（业务页面内容）
├── AI 浮动按钮（固定定位，右下角）
└── AI 侧边栏（固定定位，右侧）
    ├── 头部区域
    │   ├── 对话标题
    │   ├── 免责声明链接
    │   └── 控制按钮组（新对话、历史、全屏、关闭）
    ├── 聊天区域
    │   ├── 欢迎消息
    │   ├── 消息列表（滚动容器）
    │   └── 分析结果卡片（可选）
    ├── 历史对话面板（覆盖层）
    │   ├── 返回按钮
    │   ├── 搜索框
    │   └── 对话列表
    └── 输入区域
        ├── 文本输入框（多行）
        └── 控制栏
            ├── 工具栏（附件、技能）
            └── 操作按钮（语音、发送）
```

**定位与尺寸**

- **浮动按钮**
  - 位置：`position: fixed; right: 24px; bottom: 24px;`
  - 尺寸：`width: 56px; height: 56px;`
  - 层级：`z-index: 999;`

- **AI 侧边栏**
  - 位置：`position: fixed; right: 0; top: 0;`
  - 尺寸：`width: 420px; height: 100vh;`（桌面端）
  - 尺寸：`width: 100vw; height: 100vh;`（移动端）
  - 层级：`z-index: 1000;`
  - 初始状态：`transform: translateX(100%);`
  - 展开状态：`transform: translateX(0);`

---

#### 2.1.2 状态管理

**组件状态定义**

```javascript
const state = {
  // UI 状态
  isOpen: false,              // 侧边栏是否展开
  isHistoryOpen: false,       // 历史面板是否展开
  isFullscreen: false,        // 是否全屏模式
  isLoading: false,           // 是否加载中

  // 对话状态
  currentConversationId: null,  // 当前对话 ID
  conversations: [],            // 历史对话列表
  messages: [],                 // 当前对话消息列表

  // 输入状态
  inputText: '',                // 输入框文本
  uploadedFiles: [],            // 已上传文件列表
  selectedSkill: null,          // 选中的技能

  // 分析状态
  analysisResults: [],          // 分析结果列表
  selectedResults: [],          // 选中的结果

  // 错误状态
  error: null                   // 错误信息
};
```

**状态转换流程**

```
初始状态（关闭）
  ↓ [点击浮动按钮/调用 toggleAI()]
展开状态（对话模式）
  ↓ [点击历史按钮]
展开状态（历史模式）
  ↓ [点击返回]
展开状态（对话模式）
  ↓ [点击关闭按钮]
初始状态（关闭）
```

---

#### 2.1.3 响应式适配

**断点定义**

- 桌面端：`>= 1024px`
- 平板端：`768px - 1023px`
- 移动端：`< 768px`

**适配规则**

| 屏幕尺寸 | 侧边栏宽度 | 浮动按钮位置 | 输入框高度 |
|---------|-----------|-------------|-----------|
| 桌面端   | 420px     | 右下 24px   | 自适应     |
| 平板端   | 360px     | 右下 20px   | 自适应     |
| 移动端   | 100%      | 右下 16px   | 固定 120px |

**移动端特殊处理**

- 侧边栏全屏展示
- 添加遮罩层（半透明黑色背景）
- 禁用页面滚动（展开时）
- 虚拟键盘弹出时调整布局

```css
/* 移动端适配 */
@media (max-width: 768px) {
  .ai-sidebar {
    width: 100vw;
  }

  .ai-sidebar.active::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
  }

  body.ai-open {
    overflow: hidden;
  }
}
```

---

### 2.2 AI 助手唤起与关闭

#### 2.2.1 触发方式

**方式一：浮动按钮点击**

```javascript
// HTML
<div class="ai-floating-btn" onclick="AIAssistant.toggleAI()">
  <img src="pic/AI助手@2x.svg" alt="AI">
</div>

// 交互行为
1. 用户点击浮动按钮
2. 按钮缩放动画（scale: 0.9 → 1）
3. 侧边栏从右侧滑入
4. 浮动按钮隐藏（opacity: 0）
5. 输入框自动聚焦
```

**方式二：页面按钮调用**

```javascript
// 页面中的任意按钮
<button onclick="AIAssistant.toggleAI()">打开 AI 助手</button>

// 支持传参控制行为
AIAssistant.toggleAI(true);  // 强制打开
AIAssistant.toggleAI(false); // 强制关闭
```

**方式三：键盘快捷键（可选）**

```javascript
// 监听 Ctrl/Cmd + K
document.addEventListener('keydown', (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
    e.preventDefault();
    AIAssistant.toggleAI();
  }
});
```

---

#### 2.2.2 动画效果

**打开动画**

```css
/* 侧边栏滑入 */
.ai-sidebar {
  transform: translateX(100%);
  transition: transform 0.3s ease-out;
}

.ai-sidebar.active {
  transform: translateX(0);
}

/* 浮动按钮淡出 */
.ai-floating-btn {
  opacity: 1;
  transition: opacity 0.3s ease;
}

.ai-floating-btn.hidden {
  opacity: 0;
  pointer-events: none;
}
```

**关闭动画**

```css
/* 侧边栏滑出 */
.ai-sidebar.closing {
  transform: translateX(100%);
  transition: transform 0.3s ease-in;
}

/* 浮动按钮淡入 */
.ai-floating-btn.show {
  opacity: 1;
}
```

**动画时序**

```
打开流程：
0ms    - 开始动画
0-300ms - 侧边栏滑入 + 浮动按钮淡出
300ms  - 动画完成，输入框聚焦

关闭流程：
0ms    - 开始动画
0-300ms - 侧边栏滑出 + 浮动按钮淡入
300ms  - 动画完成，移除 active 类
```

---

#### 2.2.3 关闭交互

**关闭触发方式**

1. 点击头部关闭按钮（×）
2. 点击遮罩层（仅移动端）
3. 按 ESC 键
4. 调用 `AIAssistant.toggleAI(false)`

**关闭前确认（可选）**

```javascript
// 如果有未发送的输入内容，弹出确认
if (state.inputText.trim() !== '') {
  const confirmed = confirm('您有未发送的内容，确定要关闭吗？');
  if (!confirmed) return;
}
```

---

### 2.3 对话交互流程

#### 2.3.1 消息发送

**触发条件**

- 点击发送按钮
- 按 Enter 键（Shift+Enter 换行）
- 调用 `AIAssistant.sendMessage()`

**前置校验**

```javascript
// 校验逻辑
function validateBeforeSend() {
  const text = inputTextarea.value.trim();
  const files = state.uploadedFiles;

  // 1. 文本和文件不能同时为空
  if (text === '' && files.length === 0) {
    showToast('请输入内容或上传文件');
    return false;
  }

  // 2. 文本长度限制
  if (text.length > 2000) {
    showToast('输入内容不能超过 2000 字符');
    return false;
  }

  // 3. 文件数量限制
  if (files.length > 5) {
    showToast('最多只能上传 5 个文件');
    return false;
  }

  // 4. 文件大小限制
  const oversizedFile = files.find(f => f.size > 10 * 1024 * 1024);
  if (oversizedFile) {
    showToast(`文件 ${oversizedFile.name} 超过 10MB 限制`);
    return false;
  }

  return true;
}
```

**发送流程**

```javascript
async function sendMessage() {
  // 1. 校验
  if (!validateBeforeSend()) return;

  // 2. 禁用输入
  inputTextarea.disabled = true;
  sendButton.disabled = true;

  // 3. 获取输入内容
  const text = inputTextarea.value.trim();
  const files = [...state.uploadedFiles];

  // 4. 清空输入框和文件列表
  inputTextarea.value = '';
  state.uploadedFiles = [];
  renderFileList();

  // 5. 添加用户消息到界面
  const userMessage = {
    id: generateId(),
    type: 'user',
    content: text,
    files: files,
    timestamp: Date.now(),
    status: 'sending'
  };
  addMessageToUI(userMessage);

  // 6. 显示 AI 思考动画
  showAIThinking();

  try {
    // 7. 调用 API
    const response = await callAIAPI(text, files);

    // 8. 更新用户消息状态
    userMessage.status = 'sent';
    updateMessageStatus(userMessage.id, 'sent');

    // 9. 流式渲染 AI 响应
    await streamAIResponse(response);

  } catch (error) {
    // 10. 错误处理
    userMessage.status = 'error';
    updateMessageStatus(userMessage.id, 'error');
    showErrorMessage(error.message);
  } finally {
    // 11. 恢复输入状态
    hideAIThinking();
    inputTextarea.disabled = false;
    sendButton.disabled = false;
    inputTextarea.focus();
  }
}
```

**键盘事件处理**

```javascript
inputTextarea.addEventListener('keydown', (e) => {
  // Enter 发送，Shift+Enter 换行
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
```

---

#### 2.3.2 消息展示

**消息布局**

```html
<!-- 用户消息 -->
<div class="chat-message user">
  <div class="message-content">
    <p class="chat-text">这是用户发送的消息</p>
    <div class="message-files">
      <img src="..." class="file-thumbnail">
    </div>
    <span class="message-time">14:30</span>
  </div>
</div>

<!-- AI 消息 -->
<div class="chat-message ai">
  <div class="message-content">
    <p class="chat-text">这是 AI 的回复</p>
    <span class="message-time">14:30</span>
  </div>
</div>
```

**样式规范**

```css
/* 用户消息 */
.chat-message.user {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.chat-message.user .message-content {
  background: #667eea;
  color: white;
  border-radius: 12px 12px 4px 12px;
  padding: 12px 16px;
  max-width: 70%;
}

/* AI 消息 */
.chat-message.ai {
  display: flex;
  justify-content: flex-start;
  margin-bottom: 16px;
}

.chat-message.ai .message-content {
  background: #f3f4f6;
  color: #1f2937;
  border-radius: 12px 12px 12px 4px;
  padding: 12px 16px;
  max-width: 70%;
}

/* 时间戳 */
.message-time {
  font-size: 11px;
  opacity: 0.6;
  margin-top: 4px;
  display: block;
}
```

**自动滚动**

```javascript
// 添加消息后自动滚动到底部
function scrollToBottom() {
  const chatBody = document.getElementById('aiChatBody');
  chatBody.scrollTo({
    top: chatBody.scrollHeight,
    behavior: 'smooth'
  });
}

// 在添加消息后调用
addMessageToUI(message);
scrollToBottom();
```

---

#### 2.3.3 输入框交互

**自动聚焦**

```javascript
// 打开助手时自动聚焦
function openAI() {
  sidebar.classList.add('active');
  setTimeout(() => {
    inputTextarea.focus();
  }, 300); // 等待动画完成
}
```

**自动高度调整**

```javascript
// 根据内容自动调整高度
inputTextarea.addEventListener('input', function() {
  this.style.height = 'auto';
  this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});
```

**占位符文本**

```html
<textarea placeholder="请输入您的问题..."></textarea>
```

**字符计数（可选）**

```javascript
// 显示字符计数
inputTextarea.addEventListener('input', function() {
  const count = this.value.length;
  const limit = 2000;
  charCounter.textContent = `${count}/${limit}`;

  if (count > limit) {
    charCounter.classList.add('error');
  } else {
    charCounter.classList.remove('error');
  }
});
```

---

### 2.4 文件上传交互

#### 2.4.1 上传触发

**点击上传**

```javascript
// 点击附件图标触发文件选择
document.querySelector('.ph-paperclip').addEventListener('click', () => {
  document.getElementById('aiFileInput').click();
});

// 文件选择后处理
document.getElementById('aiFileInput').addEventListener('change', (e) => {
  const files = Array.from(e.target.files);
  handleFileUpload(files);
  e.target.value = ''; // 清空 input，允许重复选择同一文件
});
```

**拖拽上传（可选）**

```javascript
const inputArea = document.querySelector('.ai-input-area');

// 阻止默认拖拽行为
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  inputArea.addEventListener(eventName, (e) => {
    e.preventDefault();
    e.stopPropagation();
  });
});

// 拖拽进入时高亮
inputArea.addEventListener('dragenter', () => {
  inputArea.classList.add('drag-over');
});

inputArea.addEventListener('dragleave', () => {
  inputArea.classList.remove('drag-over');
});

// 拖拽释放时处理文件
inputArea.addEventListener('drop', (e) => {
  inputArea.classList.remove('drag-over');
  const files = Array.from(e.dataTransfer.files);
  handleFileUpload(files);
});
```

---

#### 2.4.2 文件校验

**校验逻辑**

```javascript
function handleFileUpload(files) {
  const allowedTypes = [
    'image/jpeg', 'image/png', 'image/gif', 'image/svg+xml', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ];

  const maxSize = 10 * 1024 * 1024; // 10MB
  const maxCount = 5;

  for (const file of files) {
    // 1. 检查文件数量
    if (state.uploadedFiles.length >= maxCount) {
      showToast(`最多只能上传 ${maxCount} 个文件`);
      break;
    }

    // 2. 检查文件类型
    if (!allowedTypes.includes(file.type)) {
      showToast(`不支持的文件类型：${file.name}`);
      continue;
    }

    // 3. 检查文件大小
    if (file.size > maxSize) {
      showToast(`文件 ${file.name} 超过 10MB 限制`);
      continue;
    }

    // 4. 添加到列表
    state.uploadedFiles.push({
      id: generateId(),
      file: file,
      name: file.name,
      size: file.size,
      type: file.type,
      preview: null
    });

    // 5. 生成预览（图片类型）
    if (file.type.startsWith('image/')) {
      generatePreview(file, state.uploadedFiles[state.uploadedFiles.length - 1]);
    }
  }

  // 6. 渲染文件列表
  renderFileList();
}
```

---

#### 2.4.3 上传反馈

**文件列表展示**

```html
<div class="uploaded-files-list">
  <!-- 图片文件 -->
  <div class="file-item">
    <img src="..." class="file-preview">
    <div class="file-info">
      <span class="file-name">image.jpg</span>
      <span class="file-size">2.5 MB</span>
    </div>
    <i class="ph ph-x file-remove" onclick="removeFile('file-id')"></i>
  </div>

  <!-- 文档文件 -->
  <div class="file-item">
    <i class="ph ph-file-pdf file-icon"></i>
    <div class="file-info">
      <span class="file-name">document.pdf</span>
      <span class="file-size">1.2 MB</span>
    </div>
    <i class="ph ph-x file-remove" onclick="removeFile('file-id')"></i>
  </div>
</div>
```

**样式**

```css
.uploaded-files-list {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f3f4f6;
  border-radius: 8px;
  font-size: 13px;
}

.file-preview {
  width: 40px;
  height: 40px;
  object-fit: cover;
  border-radius: 4px;
}

.file-icon {
  font-size: 32px;
  color: #6b7280;
}

.file-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.file-name {
  font-weight: 500;
  color: #1f2937;
}

.file-size {
  font-size: 11px;
  color: #6b7280;
}

.file-remove {
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s;
}

.file-remove:hover {
  color: #ef4444;
}
```

**删除文件**

```javascript
function removeFile(fileId) {
  state.uploadedFiles = state.uploadedFiles.filter(f => f.id !== fileId);
  renderFileList();
}
```

---

#### 2.4.4 错误处理

**错误提示方式**

```javascript
function showToast(message, type = 'error') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
```

**Toast 样式**

```css
.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%) translateY(-100px);
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  opacity: 0;
  transition: all 0.3s ease;
  z-index: 9999;
}

.toast.show {
  transform: translateX(-50%) translateY(0);
  opacity: 1;
}

.toast-error {
  background: #ef4444;
  color: white;
}

.toast-success {
  background: #10b981;
  color: white;
}
```

---

### 2.5 技能选择交互

#### 2.5.1 面板展开

**触发方式**

```javascript
// 点击技能按钮展开/收起面板
document.getElementById('skillsBtn').addEventListener('click', (e) => {
  e.stopPropagation();
  const panel = document.getElementById('aiSkillsPanel');
  panel.classList.toggle('active');
});

// 点击外部区域关闭面板
document.addEventListener('click', (e) => {
  const panel = document.getElementById('aiSkillsPanel');
  const btn = document.getElementById('skillsBtn');

  if (!panel.contains(e.target) && e.target !== btn) {
    panel.classList.remove('active');
  }
});
```

**面板样式**

```css
.ai-skills-panel {
  position: absolute;
  bottom: 100%;
  left: 0;
  margin-bottom: 8px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  padding: 8px;
  min-width: 240px;
  opacity: 0;
  transform: translateY(10px);
  pointer-events: none;
  transition: all 0.2s ease;
  z-index: 10;
}

.ai-skills-panel.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}
```

---

#### 2.5.2 技能选择反馈

**选项交互**

```javascript
// 技能选项点击事件
document.querySelectorAll('.skills-option').forEach(option => {
  option.addEventListener('click', function() {
    const skillId = this.dataset.skillId;
    const skillName = this.querySelector('span').textContent;

    // 1. 关闭面板
    document.getElementById('aiSkillsPanel').classList.remove('active');

    // 2. 记录选中的技能
    state.selectedSkill = skillId;

    // 3. 可选：自动填充提示文本
    const prompts = {
      'hazard_analysis': '请帮我分析图片中的安全隐患',
      'enterprise_certificate': '请识别企业资质证照',
      'personnel_certificate': '请识别人员资质证照',
      'smart_qa': '我想查询',
      'courseware_generation': '请帮我生成培训课件，主题是：'
    };

    if (prompts[skillId]) {
      inputTextarea.value = prompts[skillId];
      inputTextarea.focus();

      // 如果是需要上传文件的技能，自动打开文件选择
      if (['hazard_analysis', 'enterprise_certificate', 'personnel_certificate'].includes(skillId)) {
        setTimeout(() => {
          document.getElementById('aiFileInput').click();
        }, 100);
      }
    }

    // 4. 显示提示
    showToast(`已选择：${skillName}`, 'success');
  });
});
```

**Hover 效果**

```css
.skills-option {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.2s;
}

.skills-option:hover {
  background: #f3f4f6;
}

.skills-option i {
  font-size: 20px;
  color: #667eea;
}

.skills-option span {
  font-size: 14px;
  color: #1f2937;
}
```

---

#### 2.5.3 技能图标与文案

**技能列表配置**

```javascript
const skills = [
  {
    id: 'hazard_analysis',
    icon: 'ph-warning',
    name: '隐患识别分析',
    description: '上传现场图片，AI 识别安全隐患'
  },
  {
    id: 'enterprise_certificate',
    icon: 'ph-building',
    name: '企业资质证照识别',
    description: '识别营业执照、许可证等'
  },
  {
    id: 'personnel_certificate',
    icon: 'ph-identification-card',
    name: '人员资质证照识别',
    description: '识别特种作业证、培训证等'
  },
  {
    id: 'smart_qa',
    icon: 'ph-chats-circle',
    name: '智能问数',
    description: '自然语言查询数据'
  },
  {
    id: 'courseware_generation',
    icon: 'ph-presentation',
    name: '课件生成',
    description: '自动生成培训课件'
  }
];
```

---

### 2.6 AI 分析结果交互

#### 2.6.1 加载状态

**思考动画**

```html
<div class="ai-thinking">
  <div class="thinking-dots">
    <span></span>
    <span></span>
    <span></span>
  </div>
  <p>AI 正在分析中...</p>
</div>
```

**动画样式**

```css
.ai-thinking {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: #f3f4f6;
  border-radius: 12px;
  margin-bottom: 16px;
}

.thinking-dots {
  display: flex;
  gap: 4px;
}

.thinking-dots span {
  width: 8px;
  height: 8px;
  background: #667eea;
  border-radius: 50%;
  animation: thinking 1.4s infinite;
}

.thinking-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes thinking {
  0%, 60%, 100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  30% {
    transform: translateY(-10px);
    opacity: 1;
  }
}
```

---

#### 2.6.2 结果卡片展示

**卡片布局**

```html
<div class="analysis-results">
  <div class="results-header">
    <h4>识别到 3 个安全隐患</h4>
    <div class="results-actions">
      <button class="btn-select-all">全选</button>
      <button class="btn-insert" disabled>插入到表单</button>
    </div>
  </div>

  <div class="results-list">
    <!-- 单个结果卡片 -->
    <div class="result-card" data-result-id="hazard_001">
      <div class="result-checkbox">
        <input type="checkbox" id="result_001">
      </div>
      <div class="result-content">
        <div class="result-header">
          <h5 class="result-name">未佩戴安全帽</h5>
          <span class="result-level level-high">高风险</span>
        </div>
        <p class="result-description">
          现场作业人员在高处作业时未按规定佩戴安全帽，存在高空坠物伤害风险。
        </p>
        <div class="result-suggestion">
          <strong>整改建议：</strong>
          <ol>
            <li>立即要求作业人员佩戴安全帽</li>
            <li>加强安全教育培训</li>
            <li>设置现场安全监督员</li>
          </ol>
        </div>
        <div class="result-meta">
          <span>位置：图片左上角区域</span>
          <span>置信度：95%</span>
        </div>
      </div>
    </div>
  </div>
</div>
```

**卡片样式**

```css
.analysis-results {
  margin: 16px 0;
}

.results-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.results-header h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.results-actions {
  display: flex;
  gap: 8px;
}

.results-actions button {
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 13px;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-select-all {
  background: #f3f4f6;
  color: #1f2937;
}

.btn-select-all:hover {
  background: #e5e7eb;
}

.btn-insert {
  background: #667eea;
  color: white;
}

.btn-insert:disabled {
  background: #d1d5db;
  cursor: not-allowed;
}

.result-card {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  margin-bottom: 12px;
  transition: all 0.2s;
}

.result-card:hover {
  border-color: #667eea;
  box-shadow: 0 2px 8px rgba(102, 126, 234, 0.1);
}

.result-checkbox {
  padding-top: 2px;
}

.result-checkbox input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
}

.result-content {
  flex: 1;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.result-name {
  font-size: 15px;
  font-weight: 600;
  color: #1f2937;
}

.result-level {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
}

.level-high {
  background: #fee2e2;
  color: #dc2626;
}

.level-medium {
  background: #fef3c7;
  color: #d97706;
}

.level-low {
  background: #dbeafe;
  color: #2563eb;
}

.result-description {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.6;
  margin-bottom: 12px;
}

.result-suggestion {
  background: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 8px;
}

.result-suggestion strong {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  color: #1f2937;
}

.result-suggestion ol {
  margin-left: 20px;
  font-size: 13px;
  color: #4b5563;
  line-height: 1.6;
}

.result-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #6b7280;
}
```

---

#### 2.6.3 结果选择

**选择逻辑**

```javascript
// 单个结果选择
document.querySelectorAll('.result-card input[type="checkbox"]').forEach(checkbox => {
  checkbox.addEventListener('change', function() {
    const resultId = this.closest('.result-card').dataset.resultId;

    if (this.checked) {
      state.selectedResults.push(resultId);
    } else {
      state.selectedResults = state.selectedResults.filter(id => id !== resultId);
    }

    updateInsertButton();
  });
});

// 全选/取消全选
document.querySelector('.btn-select-all').addEventListener('click', function() {
  const checkboxes = document.querySelectorAll('.result-card input[type="checkbox"]');
  const allChecked = Array.from(checkboxes).every(cb => cb.checked);

  checkboxes.forEach(cb => {
    cb.checked = !allChecked;
  });

  if (allChecked) {
    state.selectedResults = [];
    this.textContent = '全选';
  } else {
    state.selectedResults = Array.from(checkboxes).map(cb =>
      cb.closest('.result-card').dataset.resultId
    );
    this.textContent = '取消全选';
  }

  updateInsertButton();
});

// 更新插入按钮状态
function updateInsertButton() {
  const btn = document.querySelector('.btn-insert');
  btn.disabled = state.selectedResults.length === 0;
  btn.textContent = state.selectedResults.length > 0
    ? `插入 ${state.selectedResults.length} 个结果`
    : '插入到表单';
}
```

---

#### 2.6.4 插入操作

**插入流程**

```javascript
document.querySelector('.btn-insert').addEventListener('click', function() {
  // 1. 获取选中的结果数据
  const selectedData = state.analysisResults.filter(result =>
    state.selectedResults.includes(result.id)
  );

  // 2. 调用回调函数
  if (typeof config.onInsertToForm === 'function') {
    config.onInsertToForm(selectedData);
  }

  // 3. 显示成功提示
  showToast(`已插入 ${selectedData.length} 个隐患分析结果`, 'success');

  // 4. 清空选择（可选）
  state.selectedResults = [];
  document.querySelectorAll('.result-card input[type="checkbox"]').forEach(cb => {
    cb.checked = false;
  });
  updateInsertButton();

  // 5. 可选：关闭 AI 助手
  // AIAssistant.toggleAI(false);
});
```

---

### 2.7 历史对话交互

#### 2.7.1 面板切换

**切换动画**

```javascript
// 打开历史面板
function openHistoryPanel() {
  const historyPanel = document.getElementById('historyPanel');
  historyPanel.classList.add('active');
  state.isHistoryOpen = true;

  // 加载历史对话列表
  loadHistoryList();
}

// 关闭历史面板
function closeHistoryPanel() {
  const historyPanel = document.getElementById('historyPanel');
  historyPanel.classList.remove('active');
  state.isHistoryOpen = false;
}

// 点击历史按钮
document.querySelector('.ph-clock-counter-clockwise').addEventListener('click', () => {
  if (state.isHistoryOpen) {
    closeHistoryPanel();
  } else {
    openHistoryPanel();
  }
});

// 点击返回按钮
document.querySelector('.history-back-btn').addEventListener('click', closeHistoryPanel);
```

**面板样式**

```css
.history-panel {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  background: white;
  transform: translateX(100%);
  transition: transform 0.3s ease;
  z-index: 10;
  display: flex;
  flex-direction: column;
}

.history-panel.active {
  transform: translateX(0);
}
```

---

#### 2.7.2 对话列表

**列表渲染**

```javascript
function loadHistoryList() {
  const conversations = getConversationsFromStorage();
  const grouped = groupConversationsByTime(conversations);

  const listHTML = Object.entries(grouped).map(([group, items]) => `
    <div class="history-group">
      <div class="history-group-title">${group}</div>
      ${items.map(conv => `
        <div class="history-item" data-conversation-id="${conv.id}">
          <div class="history-item-content">
            <div class="history-item-title">${conv.title}</div>
            <div class="history-item-time">${formatTime(conv.updatedAt)}</div>
          </div>
          <i class="ph ph-trash history-item-delete" data-conversation-id="${conv.id}"></i>
        </div>
      `).join('')}
    </div>
  `).join('');

  document.getElementById('historyList').innerHTML = listHTML;

  // 绑定事件
  bindHistoryEvents();
}

// 按时间分组
function groupConversationsByTime(conversations) {
  const now = Date.now();
  const oneDay = 24 * 60 * 60 * 1000;
  const sevenDays = 7 * oneDay;

  const groups = {
    '今天': [],
    '昨天': [],
    '7天内': [],
    '更早': []
  };

  conversations.forEach(conv => {
    const diff = now - conv.updatedAt;

    if (diff < oneDay) {
      groups['今天'].push(conv);
    } else if (diff < 2 * oneDay) {
      groups['昨天'].push(conv);
    } else if (diff < sevenDays) {
      groups['7天内'].push(conv);
    } else {
      groups['更早'].push(conv);
    }
  });

  // 移除空分组
  Object.keys(groups).forEach(key => {
    if (groups[key].length === 0) {
      delete groups[key];
    }
  });

  return groups;
}
```

**列表样式**

```css
.history-group {
  margin-bottom: 24px;
}

.history-group-title {
  font-size: 13px;
  font-weight: 600;
  color: #6b7280;
  padding: 8px 16px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.history-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  cursor: pointer;
  transition: background 0.2s;
}

.history-item:hover {
  background: #f9fafb;
}

.history-item-content {
  flex: 1;
  min-width: 0;
}

.history-item-title {
  font-size: 14px;
  color: #1f2937;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  margin-bottom: 4px;
}

.history-item-time {
  font-size: 12px;
  color: #9ca3af;
}

.history-item-delete {
  opacity: 0;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  padding: 4px;
}

.history-item:hover .history-item-delete {
  opacity: 1;
}

.history-item-delete:hover {
  color: #ef4444;
}
```

---

#### 2.7.3 搜索功能

**搜索实现**

```javascript
let searchTimeout;

document.getElementById('historySearch').addEventListener('input', function(e) {
  const keyword = e.target.value.trim();

  // 防抖
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    searchHistory(keyword);
  }, 300);
});

function searchHistory(keyword) {
  const conversations = getConversationsFromStorage();

  if (!keyword) {
    // 无关键词，显示全部
    loadHistoryList();
    return;
  }

  // 搜索匹配
  const filtered = conversations.filter(conv => {
    // 搜索标题
    if (conv.title.toLowerCase().includes(keyword.toLowerCase())) {
      return true;
    }

    // 搜索消息内容
    return conv.messages.some(msg =>
      msg.content.toLowerCase().includes(keyword.toLowerCase())
    );
  });

  // 渲染结果
  renderSearchResults(filtered, keyword);
}

function renderSearchResults(results, keyword) {
  if (results.length === 0) {
    document.getElementById('historyList').innerHTML = `
      <div class="history-empty">
        <i class="ph ph-magnifying-glass"></i>
        <p>未找到相关对话</p>
      </div>
    `;
    return;
  }

  // 高亮关键词
  const listHTML = results.map(conv => {
    const highlightedTitle = highlightKeyword(conv.title, keyword);
    return `
      <div class="history-item" data-conversation-id="${conv.id}">
        <div class="history-item-content">
          <div class="history-item-title">${highlightedTitle}</div>
          <div class="history-item-time">${formatTime(conv.updatedAt)}</div>
        </div>
        <i class="ph ph-trash history-item-delete" data-conversation-id="${conv.id}"></i>
      </div>
    `;
  }).join('');

  document.getElementById('historyList').innerHTML = listHTML;
  bindHistoryEvents();
}

function highlightKeyword(text, keyword) {
  const regex = new RegExp(`(${keyword})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
}
```

**搜索框样式**

```css
.history-search {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
}

.history-search input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.history-search input:focus {
  border-color: #667eea;
}

mark {
  background: #fef3c7;
  color: #92400e;
  padding: 2px 4px;
  border-radius: 2px;
}
```

---

#### 2.7.4 对话操作

**加载对话**

```javascript
function bindHistoryEvents() {
  // 点击加载对话
  document.querySelectorAll('.history-item').forEach(item => {
    item.addEventListener('click', function(e) {
      // 如果点击的是删除按钮，不触发加载
      if (e.target.classList.contains('history-item-delete')) {
        return;
      }

      const conversationId = this.dataset.conversationId;
      loadConversation(conversationId);
    });
  });

  // 删除对话
  document.querySelectorAll('.history-item-delete').forEach(btn => {
    btn.addEventListener('click', function(e) {
      e.stopPropagation();
      const conversationId = this.dataset.conversationId;
      deleteConversation(conversationId);
    });
  });
}

function loadConversation(conversationId) {
  const conversation = getConversationById(conversationId);

  if (!conversation) {
    showToast('对话不存在', 'error');
    return;
  }

  // 1. 设置当前对话
  state.currentConversationId = conversationId;
  state.messages = conversation.messages;

  // 2. 更新标题
  document.getElementById('aiConversationTitle').textContent = conversation.title;

  // 3. 渲染消息列表
  renderMessages(conversation.messages);

  // 4. 关闭历史面板
  closeHistoryPanel();

  // 5. 滚动到底部
  scrollToBottom();
}

function deleteConversation(conversationId) {
  if (!confirm('确定要删除这条对话吗？')) {
    return;
  }

  // 1. 从存储中删除
  let conversations = getConversationsFromStorage();
  conversations = conversations.filter(conv => conv.id !== conversationId);
  saveConversationsToStorage(conversations);

  // 2. 如果删除的是当前对话，清空界面
  if (state.currentConversationId === conversationId) {
    startNewConversation();
  }

  // 3. 重新加载列表
  loadHistoryList();

  showToast('对话已删除', 'success');
}
```

---

### 2.8 特殊场景处理

#### 2.8.1 错误提示

**错误类型**

```javascript
const errorMessages = {
  'network_error': '网络连接失败，请检查网络设置',
  'api_error': '抱歉，服务暂时不可用，请稍后重试',
  'timeout_error': '请求超时，请重试',
  'file_upload_error': '文件上传失败，请重试',
  'invalid_input': '输入内容不符合要求',
  'auth_error': '身份验证失败，请重新登录'
};

function showErrorMessage(errorType, customMessage) {
  const message = customMessage || errorMessages[errorType] || '发生未知错误';

  // 在聊天区域显示错误消息
  const errorHTML = `
    <div class="chat-message error">
      <div class="message-content">
        <i class="ph ph-warning-circle"></i>
        <p class="chat-text">${message}</p>
        <button class="btn-retry" onclick="retryLastMessage()">重试</button>
      </div>
    </div>
  `;

  document.getElementById('aiChatBody').insertAdjacentHTML('beforeend', errorHTML);
  scrollToBottom();
}
```

**错误样式**

```css
.chat-message.error .message-content {
  background: #fef2f2;
  border: 1px solid #fecaca;
  color: #991b1b;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-message.error i {
  font-size: 20px;
  color: #dc2626;
}

.btn-retry {
  align-self: flex-start;
  padding: 6px 12px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 13px;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-retry:hover {
  background: #b91c1c;
}
```

---

#### 2.8.2 空状态

**无历史对话**

```html
<div class="history-empty">
  <i class="ph ph-chat-circle-dots"></i>
  <p>暂无历史对话</p>
  <span>开始一段新对话吧</span>
</div>
```

**空状态样式**

```css
.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
}

.history-empty i {
  font-size: 64px;
  color: #d1d5db;
  margin-bottom: 16px;
}

.history-empty p {
  font-size: 16px;
  font-weight: 500;
  color: #6b7280;
  margin-bottom: 8px;
}

.history-empty span {
  font-size: 14px;
  color: #9ca3af;
}
```

---

#### 2.8.3 免责声明

**免责声明弹窗**

```javascript
function showDisclaimer() {
  const modal = document.createElement('div');
  modal.className = 'disclaimer-modal';
  modal.innerHTML = `
    <div class="disclaimer-content">
      <div class="disclaimer-header">
        <h3>AI 生成内容免责声明</h3>
        <i class="ph ph-x" onclick="this.closest('.disclaimer-modal').remove()"></i>
      </div>
      <div class="disclaimer-body">
        <p>本 AI 助手提供的内容仅供参考，不构成专业建议。</p>
        <ul>
          <li>AI 生成的内容可能存在错误或不准确之处</li>
          <li>隐患识别结果需要专业人员进一步确认</li>
          <li>证照识别结果仅供参考，请以官方核验为准</li>
          <li>重要决策请咨询专业人士</li>
        </ul>
        <p>使用本服务即表示您已了解并同意上述声明。</p>
      </div>
      <div class="disclaimer-footer">
        <button onclick="this.closest('.disclaimer-modal').remove()">我知道了</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
}

// 点击免责声明链接
document.querySelector('.ai-disclaimer').addEventListener('click', showDisclaimer);
```

**弹窗样式**

```css
.disclaimer-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.disclaimer-content {
  background: white;
  border-radius: 16px;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.disclaimer-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.disclaimer-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: #1f2937;
}

.disclaimer-header i {
  font-size: 24px;
  color: #6b7280;
  cursor: pointer;
}

.disclaimer-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.disclaimer-body p {
  font-size: 14px;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 16px;
}

.disclaimer-body ul {
  margin-left: 20px;
  margin-bottom: 16px;
}

.disclaimer-body li {
  font-size: 14px;
  line-height: 1.8;
  color: #4b5563;
}

.disclaimer-footer {
  padding: 16px 24px;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
}

.disclaimer-footer button {
  padding: 10px 24px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s;
}

.disclaimer-footer button:hover {
  background: #5568d3;
}
```

---


## 3. UI 视觉设计规范

### 3.1 设计原则

- **一致性**：保持组件在不同页面中的视觉和交互一致性
- **清晰性**：信息层级分明，重点突出
- **高效性**：减少用户操作步骤，提升效率
- **友好性**：提供清晰的反馈和引导
- **可访问性**：确保不同用户都能正常使用

---

### 3.2 色彩系统

#### 主色调

```css
/* 品牌色 */
--primary: #667eea;
--primary-hover: #5568d3;
--primary-active: #4c51bf;

/* 渐变辅助色 */
--secondary: #764ba2;
```

#### 功能色

```css
/* 成功 */
--success: #10b981;
--success-light: #d1fae5;

/* 警告 */
--warning: #f59e0b;
--warning-light: #fef3c7;

/* 错误 */
--error: #ef4444;
--error-light: #fee2e2;

/* 信息 */
--info: #3b82f6;
--info-light: #dbeafe;
```

#### 中性色

```css
/* 文字颜色 */
--text-primary: #1f2937;
--text-secondary: #6b7280;
--text-tertiary: #9ca3af;
--text-disabled: #d1d5db;

/* 边框颜色 */
--border-default: #e5e7eb;
--border-light: #f3f4f6;
--border-dark: #d1d5db;

/* 背景颜色 */
--bg-primary: #ffffff;
--bg-secondary: #f9fafb;
--bg-tertiary: #f3f4f6;
--bg-hover: #f3f4f6;
```

---

### 3.3 字体规范

#### 字体家族

```css
font-family: 'Inter', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

#### 字号体系

| 用途 | 字号 | 行高 | 字重 |
|-----|------|------|------|
| 大标题 | 20px | 1.2 | 600 |
| 标题 | 16px | 1.3 | 600 |
| 小标题 | 15px | 1.4 | 500 |
| 正文 | 14px | 1.5 | 400 |
| 辅助文字 | 13px | 1.5 | 400 |
| 说明文字 | 12px | 1.4 | 400 |
| 微小文字 | 11px | 1.3 | 400 |

---

### 3.4 图标系统

#### 图标库

使用 **Phosphor Icons**（https://phosphoricons.com/）

```html
<!-- 引入方式 -->
<script src="https://unpkg.com/@phosphor-icons/web"></script>

<!-- 使用方式 -->
<i class="ph ph-robot"></i>
```

#### 图标尺寸

| 场景 | 尺寸 |
|-----|------|
| 小图标 | 16px |
| 常规图标 | 20px |
| 大图标 | 24px |
| 特大图标 | 48-64px |

---

### 3.5 间距系统

#### 基础单位

基础间距单位：**4px**

#### 间距规范

| 名称 | 值 | 用途 |
|-----|-----|------|
| xs | 4px | 极小间距 |
| sm | 8px | 小间距 |
| md | 12px | 中等间距 |
| lg | 16px | 常规间距 |
| xl | 20px | 大间距 |
| 2xl | 24px | 较大间距 |
| 3xl | 32px | 特大间距 |

---

### 3.6 圆角规范

| 元素 | 圆角值 |
|-----|--------|
| 按钮 | 6-8px |
| 输入框 | 8px |
| 卡片 | 12px |
| 面板 | 12px |
| 消息气泡 | 12px |
| 浮动按钮 | 50% |

---

### 3.7 阴影规范

```css
/* 浮动按钮 */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

/* 侧边栏 */
box-shadow: -2px 0 8px rgba(0, 0, 0, 0.1);

/* 卡片 */
box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

/* 卡片 Hover */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

/* 弹窗 */
box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
```

---

### 3.8 动效规范

#### 过渡时间

- 快速：0.15s（按钮反馈）
- 标准：0.2s（Hover 效果）
- 常规：0.3s（面板展开）
- 慢速：0.5s（页面切换）

#### 缓动函数

- 标准：`ease`
- 进入：`ease-out`
- 退出：`ease-in`

---


## 4. 技术实现规范

### 4.1 组件架构

#### 4.1.1 文件结构

```
components/
├── ai-assistant.css      # 样式文件
├── ai-assistant.js       # 核心逻辑
└── README.md             # 使用文档
```

#### 4.1.2 核心对象

```javascript
const AIAssistant = {
  // 配置
  config: {},

  // 状态
  state: {
    isOpen: false,
    isHistoryOpen: false,
    currentConversationId: null,
    conversations: [],
    messages: [],
    uploadedFiles: [],
    selectedSkill: null,
    analysisResults: [],
    selectedResults: [],
    error: null
  },

  // 初始化
  init(options) {},

  // 公共方法
  toggleAI() {},
  addUserMessage(text, files) {},
  addAIMessage(text) {},
  toggleHistoryPanel() {},
  searchHistory(keyword) {},
  clearHistory() {},

  // 内部方法
  _sendMessage() {},
  _handleFileUpload() {},
  _renderMessages() {},
  _saveToStorage() {},
  _loadFromStorage() {}
};
```

---

### 4.2 API 接口定义

#### 4.2.1 初始化方法

```javascript
AIAssistant.init({
  // 必填参数
  userName: 'string',              // 用户名

  // 可选参数
  welcomeMessage: 'string',        // 欢迎消息（支持 {userName} 占位符）
  apiEndpoint: 'string',           // API 地址
  maxFileSize: 10 * 1024 * 1024,  // 文件大小限制（字节）
  maxFileCount: 5,                 // 文件数量限制
  allowedFileTypes: [],            // 允许的文件类型

  // 回调函数
  onAnalysisComplete: function(results) {},  // 分析完成回调
  onInsertToForm: function(selectedResults) {},  // 插入表单回调
  onError: function(error) {},     // 错误处理回调
  onMessageSent: function(message) {},  // 消息发送回调
  onConversationChange: function(conversationId) {}  // 对话切换回调
});
```

#### 4.2.2 公共方法

```javascript
// 切换显示/隐藏
AIAssistant.toggleAI(forceState?: boolean): void

// 添加用户消息
AIAssistant.addUserMessage(text: string, files?: File[], autoSend?: boolean): void

// 添加 AI 消息
AIAssistant.addAIMessage(text: string): void

// 切换历史面板
AIAssistant.toggleHistoryPanel(): void

// 搜索历史
AIAssistant.searchHistory(keyword: string): void

// 清空历史
AIAssistant.clearHistory(): void

// 开始新对话
AIAssistant.startNewConversation(): void

// 加载对话
AIAssistant.loadConversation(conversationId: string): void

// 删除对话
AIAssistant.deleteConversation(conversationId: string): void
```

#### 4.2.3 演示方法（可移除）

```javascript
// 模拟隐患分析
AIAssistant.simulateAIAnalysis(): void

// 模拟证照识别
AIAssistant.simulateCertificateRecognition(): void

// 模拟课件生成
AIAssistant.simulateCoursewareGeneration(): void
```

---

### 4.3 数据结构

#### 4.3.1 消息对象

```javascript
{
  id: string,                    // 唯一标识（UUID）
  type: 'user' | 'ai',           // 消息类型
  content: string,               // 文本内容
  files: Array<{                 // 附件列表
    id: string,
    name: string,
    size: number,
    type: string,
    url: string
  }>,
  timestamp: number,             // 时间戳（毫秒）
  status: 'sending' | 'sent' | 'error'  // 发送状态
}
```

#### 4.3.2 分析结果对象

```javascript
{
  id: string,                    // 唯一标识
  name: string,                  // 隐患名称
  description: string,           // 隐患描述
  suggestion: string,            // 整改建议
  level: 'high' | 'medium' | 'low',  // 风险等级
  location: string,              // 位置信息
  confidence: number,            // 置信度（0-1）
  selected: boolean              // 是否选中
}
```

#### 4.3.3 历史对话对象

```javascript
{
  id: string,                    // 对话 ID（UUID）
  title: string,                 // 对话标题（取首条消息前 20 字）
  messages: Array<Message>,      // 消息列表
  createdAt: number,             // 创建时间（毫秒）
  updatedAt: number              // 更新时间（毫秒）
}
```

#### 4.3.4 证照识别结果

```javascript
// 企业证照
{
  type: 'business_license' | 'safety_permit' | 'qualification',
  data: {
    companyName: string,
    creditCode: string,
    legalPerson: string,
    validFrom: string,
    validTo: string,
    address: string
  },
  confidence: number
}

// 人员证照
{
  type: 'special_operation' | 'training' | 'qualification',
  data: {
    name: string,
    idNumber: string,
    certificateNumber: string,
    workType: string,
    validFrom: string,
    validTo: string,
    issuingAuthority: string
  },
  confidence: number
}
```

---

### 4.4 状态管理

#### 4.4.1 本地存储

```javascript
// 存储键名
const STORAGE_KEYS = {
  CONVERSATIONS: 'ai_assistant_conversations',
  CURRENT_ID: 'ai_assistant_current_id',
  USER_SETTINGS: 'ai_assistant_settings'
};

// 保存对话
function saveConversation(conversation) {
  const conversations = getConversationsFromStorage();
  const index = conversations.findIndex(c => c.id === conversation.id);

  if (index >= 0) {
    conversations[index] = conversation;
  } else {
    conversations.unshift(conversation);
  }

  // 只保留最近 50 条
  if (conversations.length > 50) {
    conversations.length = 50;
  }

  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
}

// 获取对话列表
function getConversationsFromStorage() {
  const data = localStorage.getItem(STORAGE_KEYS.CONVERSATIONS);
  return data ? JSON.parse(data) : [];
}

// 删除对话
function deleteConversationFromStorage(conversationId) {
  let conversations = getConversationsFromStorage();
  conversations = conversations.filter(c => c.id !== conversationId);
  localStorage.setItem(STORAGE_KEYS.CONVERSATIONS, JSON.stringify(conversations));
}

// 清空所有对话
function clearAllConversations() {
  localStorage.removeItem(STORAGE_KEYS.CONVERSATIONS);
  localStorage.removeItem(STORAGE_KEYS.CURRENT_ID);
}
```

#### 4.4.2 状态更新

```javascript
// 更新状态并触发重渲染
function setState(updates) {
  Object.assign(AIAssistant.state, updates);

  // 触发相关更新
  if ('messages' in updates) {
    renderMessages();
  }

  if ('uploadedFiles' in updates) {
    renderFileList();
  }

  if ('analysisResults' in updates) {
    renderAnalysisResults();
  }

  // 保存到本地存储
  if ('messages' in updates || 'currentConversationId' in updates) {
    saveCurrentConversation();
  }
}
```

---

### 4.5 事件处理

#### 4.5.1 DOM 事件绑定

```javascript
function bindEvents() {
  // 发送按钮
  document.querySelector('.btn-send').addEventListener('click', sendMessage);

  // 输入框键盘事件
  document.querySelector('.ai-input-area textarea').addEventListener('keydown', handleKeyDown);

  // 文件上传
  document.querySelector('.ph-paperclip').addEventListener('click', () => {
    document.getElementById('aiFileInput').click();
  });

  document.getElementById('aiFileInput').addEventListener('change', handleFileSelect);

  // 技能选择
  document.getElementById('skillsBtn').addEventListener('click', toggleSkillsPanel);

  // 历史对话
  document.querySelector('.ph-clock-counter-clockwise').addEventListener('click', toggleHistoryPanel);

  // 关闭按钮
  document.querySelector('.ai-header .ph-x').addEventListener('click', () => {
    AIAssistant.toggleAI(false);
  });

  // 新对话
  document.querySelector('.ph-note-pencil').addEventListener('click', startNewConversation);

  // ESC 键关闭
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && AIAssistant.state.isOpen) {
      AIAssistant.toggleAI(false);
    }
  });
}
```

#### 4.5.2 自定义事件

```javascript
// 触发自定义事件
function dispatchCustomEvent(eventName, detail) {
  const event = new CustomEvent(`ai:${eventName}`, {
    detail: detail,
    bubbles: true
  });
  document.dispatchEvent(event);
}

// 使用示例
dispatchCustomEvent('messageSent', { message });
dispatchCustomEvent('analysisComplete', { results });
dispatchCustomEvent('conversationChanged', { conversationId });

// 监听自定义事件
document.addEventListener('ai:messageSent', (e) => {
  console.log('Message sent:', e.detail.message);
});
```

---

### 4.6 性能优化

#### 4.6.1 防抖与节流

```javascript
// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 应用
const debouncedSearch = debounce(searchHistory, 300);
const throttledScroll = throttle(handleScroll, 100);
```

#### 4.6.2 虚拟滚动（可选）

```javascript
// 当历史对话列表超过 100 条时启用虚拟滚动
function renderVirtualList(items, container, itemHeight) {
  const visibleCount = Math.ceil(container.clientHeight / itemHeight);
  const bufferCount = 5;

  let scrollTop = container.scrollTop;
  let startIndex = Math.floor(scrollTop / itemHeight) - bufferCount;
  let endIndex = startIndex + visibleCount + bufferCount * 2;

  startIndex = Math.max(0, startIndex);
  endIndex = Math.min(items.length, endIndex);

  const visibleItems = items.slice(startIndex, endIndex);

  // 渲染可见项
  container.innerHTML = visibleItems.map((item, index) => {
    const actualIndex = startIndex + index;
    return renderHistoryItem(item, actualIndex * itemHeight);
  }).join('');
}
```

#### 4.6.3 懒加载

```javascript
// 图片懒加载
function lazyLoadImages() {
  const images = document.querySelectorAll('img[data-src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        imageObserver.unobserve(img);
      }
    });
  });

  images.forEach(img => imageObserver.observe(img));
}
```

---

### 4.7 兼容性要求

#### 4.7.1 浏览器支持

| 浏览器 | 最低版本 |
|--------|---------|
| Chrome | 90+ |
| Firefox | 88+ |
| Safari | 14+ |
| Edge | 90+ |

#### 4.7.2 移动端支持

| 平台 | 最低版本 |
|-----|---------|
| iOS Safari | 14+ |
| Android Chrome | 90+ |

#### 4.7.3 特性检测

```javascript
// 检测必要特性
function checkBrowserSupport() {
  const required = {
    localStorage: typeof Storage !== 'undefined',
    fetch: typeof fetch !== 'undefined',
    promise: typeof Promise !== 'undefined',
    customElements: 'customElements' in window
  };

  const unsupported = Object.keys(required).filter(key => !required[key]);

  if (unsupported.length > 0) {
    console.error('Browser does not support:', unsupported);
    return false;
  }

  return true;
}
```

#### 4.7.4 降级方案

```css
/* 不支持 backdrop-filter 时使用纯色背景 */
.ai-sidebar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
}

@supports not (backdrop-filter: blur(10px)) {
  .ai-sidebar {
    background: #ffffff;
  }
}

/* 不支持 CSS Grid 时使用 Flexbox */
.demo-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}

@supports not (display: grid) {
  .demo-cards {
    display: flex;
    flex-wrap: wrap;
  }

  .demo-card {
    flex: 1 1 280px;
  }
}
```

---

### 4.8 安全性考虑

#### 4.8.1 XSS 防护

```javascript
// HTML 转义
function escapeHTML(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// 使用时
function addMessage(text) {
  const escapedText = escapeHTML(text);
  messageElement.innerHTML = escapedText;
}
```

#### 4.8.2 文件上传安全

```javascript
// 文件类型白名单
const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/gif',
  'application/pdf',
  'text/plain'
];

// 文件验证
function validateFile(file) {
  // 1. 检查 MIME 类型
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('不支持的文件类型');
  }

  // 2. 检查文件扩展名
  const ext = file.name.split('.').pop().toLowerCase();
  const allowedExts = ['jpg', 'jpeg', 'png', 'gif', 'pdf', 'txt'];
  if (!allowedExts.includes(ext)) {
    throw new Error('不支持的文件扩展名');
  }

  // 3. 检查文件大小
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('文件大小超过限制');
  }

  return true;
}
```

#### 4.8.3 API 请求安全

```javascript
// 添加请求头
async function callAPI(endpoint, data) {
  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Requested-With': 'XMLHttpRequest',
      'Authorization': `Bearer ${getAuthToken()}`
    },
    body: JSON.stringify(data),
    credentials: 'same-origin'
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return response.json();
}
```

---

### 4.9 错误处理

#### 4.9.1 全局错误捕获

```javascript
// 捕获未处理的错误
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  showToast('发生错误，请刷新页面重试', 'error');
});

// 捕获未处理的 Promise 拒绝
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  showToast('操作失败，请重试', 'error');
});
```

#### 4.9.2 API 错误处理

```javascript
async function handleAPICall(apiFunc) {
  try {
    return await apiFunc();
  } catch (error) {
    if (error.name === 'NetworkError') {
      showErrorMessage('network_error');
    } else if (error.status === 401) {
      showErrorMessage('auth_error');
    } else if (error.status === 500) {
      showErrorMessage('api_error');
    } else {
      showErrorMessage('unknown_error', error.message);
    }

    // 触发错误回调
    if (typeof AIAssistant.config.onError === 'function') {
      AIAssistant.config.onError(error);
    }

    throw error;
  }
}
```

---

### 4.10 测试建议

#### 4.10.1 单元测试

```javascript
// 使用 Jest 进行单元测试
describe('AIAssistant', () => {
  test('should initialize with config', () => {
    AIAssistant.init({ userName: 'Test User' });
    expect(AIAssistant.config.userName).toBe('Test User');
  });

  test('should add user message', () => {
    AIAssistant.addUserMessage('Hello');
    expect(AIAssistant.state.messages.length).toBeGreaterThan(0);
  });

  test('should validate file upload', () => {
    const file = new File(['content'], 'test.jpg', { type: 'image/jpeg' });
    expect(validateFile(file)).toBe(true);
  });
});
```

#### 4.10.2 集成测试

- 测试完整的对话流程
- 测试文件上传流程
- 测试历史对话加载
- 测试错误处理

#### 4.10.3 E2E 测试

使用 Cypress 或 Playwright 进行端到端测试：

```javascript
// Cypress 示例
describe('AI Assistant E2E', () => {
  it('should open and close AI assistant', () => {
    cy.visit('/');
    cy.get('.ai-floating-btn').click();
    cy.get('.ai-sidebar').should('have.class', 'active');
    cy.get('.ai-header .ph-x').click();
    cy.get('.ai-sidebar').should('not.have.class', 'active');
  });

  it('should send a message', () => {
    cy.visit('/');
    cy.get('.ai-floating-btn').click();
    cy.get('.ai-input-area textarea').type('Hello AI');
    cy.get('.btn-send').click();
    cy.get('.chat-message.user').should('contain', 'Hello AI');
  });
});
```

---

## 总结

本文档详细描述了 AI 助手组件的功能需求、交互设计、UI 规范和技术实现方案。开发时请严格遵循本文档的规范，确保组件的一致性、可维护性和用户体验。

**关键要点：**

1. 组件采用独立、可复用的设计，易于集成到不同页面
2. 交互设计注重用户体验，提供清晰的反馈和引导
3. UI 设计遵循统一的视觉规范，保持品牌一致性
4. 技术实现考虑性能、安全性和兼容性
5. 提供完善的错误处理和降级方案

**后续工作：**

- 根据实际 API 接口调整数据结构
- 完善错误处理和边界情况
- 进行充分的测试和优化
- 编写详细的使用文档

