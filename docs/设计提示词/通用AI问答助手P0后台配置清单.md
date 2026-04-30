# 通用 AI 问答助手 P0 后台配置清单

## 一、产品定位

当前产品不是单一场景的流程型 AI，而是一个嵌入现有 B 端业务系统中的**通用 AI 问答助手**。

它的核心形态是：
- 基于自然语言进行问答交互
- 可根据业务需求挂载多个 Skills
- 不同 Skill 可以调用不同执行逻辑
- 部分 Skill 可以结合知识库进行 RAG 检索
- 回答结果可根据协议进行二次渲染

因此，P0 后台配置重点不是复杂工作流编排，而是围绕以下 5 类核心对象展开：

1. 助手本身
2. 模型
3. Skills
4. 知识库 / RAG
5. 输出渲染协议

此外，为了保证上线后可排查、可运营，P0 还需要具备基础的日志与审计能力。

---

## 二、P0 必做配置模块

建议 P0 先建设以下 6 个后台配置模块：

1. 助手配置
2. 模型配置
3. Skill 配置
4. 知识库配置
5. 输出渲染协议配置
6. 日志与审计

其中优先级最高的是：
- Skill 配置
- 知识库配置
- 输出渲染协议配置

因为产品的核心差异化，本质上在于：
**助手如何路由到业务 Skill，Skill 能查什么，最终结果怎么展示。**

---

## 三、字段清单

# 1. 助手配置

用于定义 AI 助手本身的基础信息、交互方式、Prompt 约束以及能力绑定关系。

## 1.1 基础信息

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| assistantId | 助手ID | 是 | 系统生成 |
| assistantName | 助手名称 | 是 | 前台展示名称 |
| assistantCode | 助手编码 | 是 | 唯一标识 |
| assistantDesc | 助手描述 | 否 | 后台说明 |
| status | 是否启用 | 是 | 启用/停用 |
| icon | 图标 | 否 | 前端展示 |
| sort | 排序 | 否 | 多助手场景使用 |

## 1.2 交互配置

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| welcomeMessage | 欢迎语 | 否 | 首屏文案 |
| suggestedQuestions | 推荐问题 | 否 | 可配置多个 |
| toneStyle | 回复风格 | 否 | 专业/简洁/友好/结构化 |
| answerLanguage | 回复语言 | 否 | 中文/英文/跟随用户 |

## 1.3 Prompt 配置

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| systemPrompt | 系统提示词 | 是 | 核心行为约束 |
| promptVersion | Prompt版本 | 否 | 便于审计 |
| guardrailRule | 回答约束 | 否 | 如禁止编造、无依据需说明 |

## 1.4 可用能力绑定

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| modelConfigId | 绑定模型配置 | 是 | 一个助手至少一个模型 |
| skillIds | 可用 Skills | 否 | 绑定可调用能力 |
| knowledgeScopeId | 默认知识范围 | 否 | 助手级默认 RAG 范围 |

---

# 2. 模型配置

用于定义助手底层使用的模型及其调用参数。

## 2.1 模型基础

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| modelConfigId | 模型配置ID | 是 | 系统生成 |
| configName | 配置名称 | 是 | 如“默认问答模型” |
| provider | 模型供应商 | 是 | OpenAI / Anthropic / 阿里等 |
| modelName | 模型名称 | 是 | 具体版本 |
| endpoint | 接口地址 | 否 | 私有化场景需要 |
| apiKeyRef | 密钥引用 | 否 | 建议只存引用 |
| status | 是否启用 | 是 | 启用/停用 |

## 2.2 推理参数

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| temperature | 温度 | 否 | 控制发散性 |
| maxTokens | 最大输出长度 | 否 | |
| topP | topP | 否 | P0 可选 |
| timeoutSeconds | 超时时间 | 是 | |
| retryCount | 重试次数 | 是 | |
| streamEnabled | 是否流式输出 | 是 | 一般建议支持 |

## 2.3 路由能力

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| fallbackModelId | 兜底模型 | 否 | P0 可选 |
| supportedScenario | 适用场景 | 否 | 问答/总结/抽取/分析 |

---

# 3. Skill 配置

Skill 配置是 P0 最关键的模块，用于定义助手可调用的业务能力。

建议拆成四部分：
- 基础信息
- 触发控制
- 执行配置
- 输出配置

## 3.1 Skill 基础信息

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| skillId | Skill ID | 是 | 系统生成 |
| skillName | Skill 名称 | 是 | 前后台展示 |
| skillCode | Skill 编码 | 是 | 唯一标识 |
| skillDesc | Skill 描述 | 否 | 说明用途 |
| status | 是否启用 | 是 | 启用/停用 |
| icon | Skill 图标 | 否 | 前端展示 |
| groupName | 分组 | 否 | 如“查询类”“分析类” |
| sort | 排序 | 否 | |

## 3.2 触发控制

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| triggerMode | 触发方式 | 是 | manual / auto / both |
| manualEntryVisible | 是否展示手动入口 | 否 | 前端是否展示按钮/入口 |
| routeCondition | 路由条件 | 否 | 自动触发条件描述 |
| priority | 优先级 | 否 | 多个 Skill 命中时使用 |
| conflictStrategy | 冲突处理策略 | 否 | 优先级最高 / 允许多 Skill / 人工选择 |

## 3.3 执行配置

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| executeType | 执行类型 | 是 | prompt / api / workflow / function |
| executorRef | 执行器引用 | 是 | Skill 对应后端服务或逻辑标识 |
| timeoutSeconds | 超时时间 | 否 | |
| retryCount | 重试次数 | 否 | |
| fallbackStrategy | 失败策略 | 否 | 失败提示 / 降级普通回答 |
| contextPolicy | 上下文策略 | 否 | 是否带历史对话、最近 N 轮 |

## 3.4 RAG 配置

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| ragEnabled | 是否开启 RAG | 是 | true / false |
| ragScopeType | RAG 范围类型 | 是 | inherit / custom / disabled |
| knowledgeBaseIds | 知识库范围 | 否 | custom 时使用 |
| tagFilters | 标签过滤 | 否 | |
| topK | 召回数 | 否 | |
| rerankEnabled | 是否重排 | 否 | P0 可选 |
| citationEnabled | 是否返回引用 | 否 | 建议做 |

## 3.5 输出配置

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| outputMode | 输出模式 | 是 | text / markdown / structured |
| outputProtocolId | 输出协议ID | 否 | structured 时必填 |
| defaultRenderType | 默认渲染类型 | 否 | text / table / card / list |
| allowStreaming | 是否允许流式输出 | 否 | |
| postProcessEnabled | 是否启用后处理 | 否 | 如格式纠正、字段补齐 |

## 3.6 权限配置

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| tenantScope | 适用租户 | 否 | 多租户场景 |
| roleScope | 适用角色 | 否 | 哪些角色可用 |
| deptScope | 适用部门 | 否 | |
| assistantIds | 可挂载助手 | 是 | 哪些助手能使用该 Skill |

---

# 4. 知识库 / RAG 配置

知识库配置需要独立存在，不建议混在 Skill 管理中。Skill 只负责约束如何使用知识库，而不负责管理知识库本身。

## 4.1 知识库基础

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| knowledgeBaseId | 知识库ID | 是 | 系统生成 |
| knowledgeBaseName | 知识库名称 | 是 | |
| knowledgeBaseCode | 知识库编码 | 是 | 唯一标识 |
| knowledgeBaseDesc | 知识库描述 | 否 | |
| status | 是否启用 | 是 | |
| sourceType | 数据源类型 | 是 | 文件 / API / 数据库 / 第三方 |
| updateMode | 更新方式 | 否 | 手动 / 自动 |

## 4.2 检索配置

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| recallTopK | 默认召回数 | 否 | |
| rerankEnabled | 是否开启重排 | 否 | |
| chunkStrategy | 切片策略 | 否 | P0 可简化 |
| citationEnabled | 是否支持引用 | 否 | |

## 4.3 权限范围

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| tenantScope | 租户范围 | 否 | |
| roleScope | 角色范围 | 否 | |
| deptScope | 部门范围 | 否 | |
| tagList | 标签列表 | 否 | 给 Skill 过滤用 |

## 4.4 助手默认绑定

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| assistantIds | 绑定助手 | 否 | 哪些助手默认可查 |
| defaultForAssistant | 是否为助手默认知识域 | 否 | |

---

# 5. 输出渲染协议配置

“二次渲染指令”建议单独做成输出渲染协议配置，而不是直接做成 Skill 中的一段自由文本。

这样做的好处是：
- 渲染规则统一管理
- Skill 与前端组件解耦
- 便于版本控制
- 便于前后端联调

## 5.1 协议基础

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| outputProtocolId | 协议ID | 是 | 系统生成 |
| protocolName | 协议名称 | 是 | |
| protocolCode | 协议编码 | 是 | 唯一标识 |
| renderType | 渲染类型 | 是 | text / markdown / table / card / chart / action_list |
| status | 是否启用 | 是 | |
| version | 协议版本 | 是 | v1 / v2 |

## 5.2 协议定义

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| instructionTemplate | 输出指令模板 | 否 | 给模型的结构化约束 |
| outputSchema | 输出结构定义 | 否 | JSON schema 或字段结构 |
| renderComponent | 对应前端组件 | 是 | 前端如何渲染 |
| sampleData | 示例数据 | 否 | 联调用 |
| safetyRule | 安全规则 | 否 | 富文本、链接、脚本过滤 |

## 5.3 绑定关系

| 字段名 | 含义 | 必填 | 备注 |
|---|---|---:|---|
| bindSkillIds | 绑定 Skills | 否 | 哪些 Skill 可用 |
| bindAssistantIds | 绑定助手 | 否 | 某些协议可做助手级默认 |

---

# 6. 日志与审计

这是 P0 必须具备的能力，否则上线后无法排查问题，也无法支持运营优化。

## 6.1 对话日志

| 字段名 | 含义 |
|---|---|
| conversationId | 会话ID |
| userId | 用户ID |
| assistantId | 助手ID |
| question | 用户问题 |
| answer | 助手回答 |
| finalRenderType | 最终渲染类型 |
| createdAt | 时间 |

## 6.2 执行日志

| 字段名 | 含义 |
|---|---|
| requestId | 请求ID |
| modelName | 实际调用模型 |
| hitSkill | 命中的 Skill |
| hitKnowledgeBases | 命中的知识库 |
| latency | 耗时 |
| tokenUsage | Token 消耗 |
| status | 成功/失败 |
| errorMessage | 错误信息 |

## 6.3 配置变更日志

| 字段名 | 含义 |
|---|---|
| configType | 配置类型 |
| configId | 配置对象ID |
| operator | 操作人 |
| changeType | 新增/修改/启停 |
| changeContent | 变更内容 |
| changedAt | 变更时间 |

---

## 四、P0 后台页面建议

建议 P0 先落这 6 个后台页面：

1. 助手配置
2. 模型配置
3. Skill 配置
4. 知识库配置
5. 输出渲染协议配置
6. 日志审计

其中最关键的页面是：
- Skill 配置页
- 知识库配置页
- 输出渲染协议配置页

因为真正决定产品体验差异化的，是以下三件事：
1. 用户提问后是否能正确命中业务 Skill
2. Skill 是否能在正确范围内调用知识和能力
3. Skill 的返回结果是否能以合适形式展示给用户

---

## 五、产品设计结论

对于当前这个通用 AI 问答助手，P0 不需要做过重的工作流编排后台，而应优先保障以下能力：

- 助手可配置
- 模型可切换
- Skill 可管理
- 知识范围可约束
- 输出渲染可管理
- 过程可追踪、可审计

可以用一句话概括为：

**P0 的目标不是“把 AI 做复杂”，而是“把助手能力的边界、调用规则和展示方式配置清楚”。**
