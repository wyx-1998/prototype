🤖 Chatbot UI 设计规范

一、色彩系统

1.1 主色调
- 品牌主色: `#3366CC`
- 点击色: `#2149A6`
- 悬浮色: `#5784D9`
- 浅色背景: `#E6F0FF`

1.2 功能色彩
成功色
- 常规: `#30BE13`
- 点击色: `#1B9908`
- 悬浮色: `#54CC39`
- 浅色背景: `#ECFEE6`

警告色
- 常规: `#FAD000`
- 点击色: `#D4A900`
- 悬浮色: `#FFE030`
- 浅色背景: `#FFFDE6`

错误色
- 常规: `#F33E3E`
- 点击色: `#CC292E`
- 悬浮色: `#FF6966`
- 浅色背景: `#FFF3F2`

1.3 文字色阶
- 强调/正文标题: `#151B26`
- 次强调/正文标题: `#5C5F66`
- 次要信息: `#84868C`
- 置灰信息: `#B8BABF`

1.4 中性色系
- 描边/分割线: `#F2F2F4`
- 最底层背景色: `#F7F7F9`
- 卡片背景色: `#FFFFFF`

---

二、字体与字号系统

2.1 字体

```css
font-family: "微软雅黑", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
```

2.2 字号与行高
一级标题
- 字号: 24px
- 行高: 32px
- 段落行高: 36px
- 颜色: `#151B26`

二级标题、大号按钮、导航组件
- 字号: 18px
- 行高: 26px
- 段落行高: 28px
- 颜色: `#5C5F66`

三级标题、正文内容
- 字号: 16px
- 行高: 24px
- 段落行高: 28px
- 颜色: `#5C5F66`

辅助文字、占位符、徽标、标签、说明文字
- 字号: 14px
- 行高: 22px
- 段落行高: 24px
- 颜色: `#84868C`

---

三、圆角与阴影规范

3.1 圆角规范

等级	值	使用场景	
R2	2px	小号尺寸组件：高度24px的按钮、选择器、输入框、搜索框等	
R3	4px	常规尺寸组件：按钮、选择器、输入框、气泡等	
R4	6px	对话框、页面容器卡片等	

3.2 阴影规范

等级	参数	使用场景	
L1	`0 0 0 0` `#070C14` 12%	导航、下拉菜单、文字提示、气泡卡片	
L2	`0 2px 8px` `#070C14` 12%	时间面板、日期面板	
L3	`0 4px 12px` `#070C14` 12%	模态弹窗（复合弹窗、消息对话框、抽屉）	

---

四、布局规范

4.1 画布尺寸
- 桌面端: 1200px 最大宽度，居中显示
- 移动端: 100% 自适应宽度
- 背景色: `#F7F7F9`

4.2 间距系统 (8px网格)
- xs: 4px
- sm: 8px
- md: 16px
- lg: 24px
- xl: 32px
- 2xl: 48px

---

五、核心组件设计

5.1 头部导航栏

```css
/* 视觉样式 */
背景: #3366CC
高度: 64px
文字颜色: #FFFFFF
阴影: L1 (0 0 0 0 #070C14 12%)

/* 内容区域 */
- 左侧: Chatbot 名称/Logo (20px 白色加粗字)
- 右侧: 设置、历史记录图标 (24px, 透明度60%的白色，hover时100%)
```

5.2 消息气泡
用户消息 (右对齐)
- 背景: `#3366CC`
- 文字: `#FFFFFF` (字号16px，行高24px)
- 圆角: R3 (4px) 右上角为0
- 位置: 右侧对齐
- 阴影: L1

机器人消息 (左对齐)
- 背景: `#FFFFFF`
- 文字: `#151B26` (字号16px，行高24px)
- 边框: 1px solid `#F2F2F4`
- 圆角: R3 (4px) 左上角为0
- 阴影: L1

消息元信息
- 时间戳: 14px `#B8BABF`, 置于气泡下方 4px
- 已读状态: 12px 小圆点 + 文字 `#84868C`

5.3 输入区域

```css
/* 容器 */
背景: #FFFFFF
高度: 80px
边框: 1px solid #F2F2F4 (focus时变为 #3366CC)
圆角: R3 (4px)
内边距: 8px 16px

/* 输入框 */
字体: 微软雅黑 16px
文字颜色: #151B26
占位符颜色: #B8BABF

/* 发送按钮 */
背景: #3366CC (启用) 或 #E6F0FF (禁用)
图标: 白色箭头
尺寸: 40px × 40px
圆角: R3 (4px)
```

5.4 快速回复按钮
- 样式: outlined 按钮
- 边框: 1px solid `#3366CC`
- 文字: `#3366CC` (字号16px)
- 内边距: 10px 20px
- 圆角: R3 (4px)
- Hover: 背景变为 `#E6F0FF`

5.5 加载动画
- 机器人输入中: 三个跳动圆点
  - 圆点大小: 8px
  - 颜色: `#84868C`
  - 动画: 0.5s 间隔上下跳动

---

六、交互状态

6.1 按钮状态

状态	背景色	文字色	边框色	圆角	
Default	`#3366CC`	`#FFFFFF`	无	R3	
Hover	`#5784D9`	`#FFFFFF`	无	R3	
Click	`#2149A6`	`#FFFFFF`	无	R3	
Disabled	`#E6F0FF`	`#B8BABF`	无	R3	

6.2 输入框状态
- 默认: 边框 `#F2F2F4`，圆角 R3
- 聚焦: 边框 `#3366CC` + 外发光 `0 0 0 3px rgba(51, 102, 204, 0.1)`
- 错误: 边框 `#F33E3E` + 错误提示文字 14px `#F33E3E`

---

七、响应式断点

```css
/* 移动端优化 */
@media (max-width: 768px) {
  .message-bubble {
    max-width: 85%;  /* 消息气泡更宽 */
  }
  
  .header {
    height: 56px;  /* 导航栏略低 */
  }
  
  .input-area {
    height: 70px;
  }
}
```

---

八、动效规范

8.1 过渡动画
- 消息出现: `fadeInUp` 0.3s ease-out
- 按钮交互: `background-color` 0.2s ease
- 页面切换: `slideIn` 0.25s ease-in-out

8.2 关键帧示例

```css
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

九、设计模式示例

欢迎界面
- 居中卡片布局，圆角 R4 (6px)，阴影 L2
- Logo: 64px × 64px，填充主色 `#3366CC`
- 标题: 24px 粗体 `#151B26`
- 描述文字: 16px 次强调色 `#5C5F66`
- 快速回复按钮组: 横向排列，间距 8px

错误提示弹窗
- 背景: `#FFF3F2`
- 边框: 1px solid `#F33E3E`
- 圆角: R4 (6px)
- 阴影: L3
- 文字: `#F33E3E`
- 图标: `#F33E3E`

---

十、设计资源输出

推荐工具: Figma, Sketch, Adobe XD

组件库结构:

```
Chatbot Design System
├── Colors (样式库)
├── Typography (文字样式)
├── Icons (24px/16px 图标集)
├── Border Radius (圆角样式)
├── Shadows (阴影样式)
└── Components
    ├── Header
    ├── Message Bubble
    ├── Input Area
    ├── Quick Reply
    └── Loading State
```

