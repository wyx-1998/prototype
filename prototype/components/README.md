# AI 助手组件使用文档

## 🎯 架构说明

AI 助手现在是一个**真正可复用的组件**，所有页面共享同一套代码。

### 核心理念
- ✅ **统一维护**：只需修改 `components/` 中的文件，所有页面自动生效
- ✅ **一致体验**：所有页面的 AI 助手功能完全一致
- ✅ **职责分离**：组件负责 AI 功能，页面脚本负责业务逻辑

### 文件结构

```
components/
├── ai-assistant.css           # AI 助手样式（共享）
├── ai-assistant.js            # AI 助手逻辑（共享）
├── ai-assistant-template.html # HTML 模板
└── README.md                  # 使用文档（本文件）

页面文件：
├── ai-assistant-demo.html     # 组件演示页面（测试和开发）
├── hidden_danger.html         # 隐患排查页面（业务页面）
└── js/hidden_danger.js        # 页面特定功能（粒子特效、弹窗等）
```

---

## 🚀 快速开始

### 1. 引入组件文件

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <!-- Phosphor Icons（必需）-->
    <script src="https://unpkg.com/@phosphor-icons/web"></script>

    <!-- AI 助手组件样式 -->
    <link rel="stylesheet" href="components/ai-assistant.css">
</head>
<body>
    <!-- 您的页面内容 -->

    <!-- 复制 AI 助手 HTML 模板（见下方） -->

    <!-- AI 助手组件脚本 -->
    <script src="components/ai-assistant.js"></script>

    <!-- 初始化 -->
    <script>
        AIAssistant.init({
            userName: '张三',
            welcomeMessage: '您好，{userName}！我是您的AI助手',
            onInsertToForm: function(selectedResults) {
                // 自定义业务逻辑
            }
        });
    </script>
</body>
</html>
```

### 2. 复制 HTML 模板

从 `ai-assistant-template.html` 或 `ai-assistant-demo.html` 复制以下结构：

```html
<!-- AI 助手侧边栏 -->
<aside class="ai-sidebar" id="aiSidebar">
    <!-- 完整结构见模板文件 -->
</aside>

<!-- 浮动按钮 -->
<div class="ai-floating-btn" onclick="toggleAI()">
    <img src="pic/AI助手@2x.svg" alt="AI">
</div>

<!-- 文件上传 input -->
<input type="file" id="aiFileInput" style="display: none;" ... />
```

---

## 📝 配置选项

```javascript
AIAssistant.init({
    // 必填
    userName: string,              // 用户名

    // 可选
    welcomeMessage: string,        // 欢迎消息（支持 {userName} 占位符）
    apiEndpoint: string,           // API 地址

    // 回调函数
    onAnalysisComplete: function(results) {},      // 分析完成
    onInsertToForm: function(selectedResults) {},  // 插入表单（重要）
    onError: function(error) {},                   // 错误处理
    onMessageSent: function(message) {}            // 消息发送
});
```

---

## 🔧 公共方法

### 基础操作

```javascript
// 切换显示/隐藏
AIAssistant.toggleAI(forceState);

// 开始新对话
AIAssistant.startNewConversation();

// 发送消息
AIAssistant.sendMessage();
```

### 消息操作

```javascript
// 添加用户消息
AIAssistant.addUserMessage(text, images, isHazardRequest);

// 添加 AI 消息
AIAssistant.addAIMessage(content, showActions);

// 模拟 AI 分析
AIAssistant.simulateAIAnalysis();
```

### 历史对话

```javascript
// 切换历史面板
AIAssistant.toggleHistoryPanel();

// 搜索历史
AIAssistant.searchHistory(keyword);
```

---

## 💡 使用示例

### 示例 1：ai-assistant-demo.html（演示页面）

```javascript
AIAssistant.init({
    userName: '张三',
    welcomeMessage: '您好，{userName}！我是您的安全生产AI助手，请向我提问吧',
    onAnalysisComplete: function (results) {
        console.log('AI 分析完成，共识别出', results.length, '个隐患');
    },
    onInsertToForm: function (selectedResults) {
        alert('已选择 ' + selectedResults.length + ' 个隐患分析结果');
        console.log('选中的分析结果：', selectedResults);
    }
});
```

### 示例 2：hidden_danger.html（业务页面）

```javascript
AIAssistant.init({
    userName: '张三',
    welcomeMessage: '您好，{userName}！我是您的安全生产AI助手，请向我提问吧',
    onInsertToForm: function (selectedResults) {
        // 将分析结果插入到表单
        const descriptions = [];
        const measures = [];

        selectedResults.forEach(result => {
            descriptions.push(`【${result.name}】${result.description}`);
            measures.push(`【${result.name}】${result.measure}`);
        });

        // 填充表单字段
        document.querySelector('#description').value = descriptions.join('\n\n');
        document.querySelector('#measure').value = measures.join('\n\n');

        ElementPlus.ElMessage.success('已成功插入到问题登记表');
    }
});
```

### 示例 3：从外部触发 AI 识别

```javascript
// 在页面特定脚本中（如 hidden_danger.js）
function startRecognition() {
    // 获取上传的图片
    const images = getUploadedImages();

    // 打开 AI 助手
    AIAssistant.toggleAI(true);

    // 发送消息并触发分析
    AIAssistant.addUserMessage('请识别这些照片中的安全隐患', images, true);
    AIAssistant.simulateAIAnalysis();
}
```

---

## 🎨 样式自定义

通过 CSS 变量自定义主题：

```css
:root {
    --ai-primary-blue: #3b71ca;  /* 主色调 */
    --ai-text-dark: #333;         /* 深色文字 */
    --ai-text-gray: #666;         /* 灰色文字 */
    --ai-border-color: #ddd;      /* 边框颜色 */
    --ai-bg-light: #f5f7fa;       /* 浅色背景 */
}
```

---

## 🔄 工作流程

### 开发和测试
1. 在 **ai-assistant-demo.html** 中测试和修改 AI 助手功能
2. 修改 `components/ai-assistant.js` 或 `components/ai-assistant.css`
3. 刷新页面查看效果

### 自动应用
- 修改会自动应用到所有使用该组件的页面
- ✅ ai-assistant-demo.html
- ✅ hidden_danger.html
- ✅ 未来的其他页面

### 页面特定功能
- 在页面自己的 JS 文件中实现（如 `js/hidden_danger.js`）
- 只包含页面特定的业务逻辑
- 不要重复实现 AI 助手功能

---

## ⚠️ 注意事项

### 1. 不要修改页面脚本中的 AI 功能
❌ **错误做法**：在 `hidden_danger.js` 中重新实现对话、历史记录等功能
✅ **正确做法**：所有 AI 功能都在 `components/ai-assistant.js` 中

### 2. 保持 HTML 结构一致
- 侧边栏、浮动按钮、文件上传 input 的结构要与组件匹配
- 不要随意修改 class 名称和 id
- 参考 `ai-assistant-template.html`

### 3. 使用回调函数处理业务逻辑
- 不要直接修改组件代码
- 通过 `onInsertToForm` 等回调函数实现业务需求

### 4. 图标和资源路径
- 确保 Phosphor Icons 已引入
- 浮动按钮图标路径：`pic/AI助手@2x.svg`

---

## 📦 数据结构

### 分析结果对象

```javascript
{
    id: number,              // 索引
    name: string,            // 隐患名称
    description: string,     // 问题描述
    measure: string,         // 整改措施
    regulation: string       // 法规依据（可选）
}
```

---

## 🌐 浏览器兼容性

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

---

## 📚 完整示例

查看以下文件获取完整示例：
- `ai-assistant-demo.html` - 组件演示和测试
- `hidden_danger.html` - 业务页面集成示例
- `js/hidden_danger.js` - 页面特定功能示例

---

## 🎯 总结

### 你现在可以：
- ✅ 在 **ai-assistant-demo.html** 中测试和修改 AI 助手
- ✅ 修改会自动应用到所有页面
- ✅ 每个页面只需关注自己的业务逻辑
- ✅ 组件化、可维护、易扩展

### 修改 AI 助手功能：
**只需修改这两个文件：**
```
components/ai-assistant.js
components/ai-assistant.css
```

所有使用该组件的页面都会自动更新！

---

## 📄 许可证

MIT License
