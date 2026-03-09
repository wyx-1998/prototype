/**
 * AI Assistant Component - JavaScript Logic
 * 独立的 AI 助手组件脚本文件
 * 使用命名空间避免全局污染
 */

(function () {
    'use strict';

    // ==================== 全局命名空间 ====================
    window.AIAssistant = {
        // 配置选项
        config: {
            userName: '张三',
            welcomeMessage: '您好，{userName}！我是您的安全生产AI助手，请向我提问吧',
            sidebarWidth: 400,
            onAnalysisComplete: null, // 分析完成回调
            onInsertToForm: null // 插入表单回调
        },

        // 状态管理
        state: {
            pendingImages: [],
            selectedCards: new Set(),
            isAnalyzing: false,
            analysisResults: [],
            selectedSkill: null, // 当前选中的技能
            audioPlaying: {}, // 记录正在播放的音频状态 {msgId: utterance}
            currentConversationId: null, // 当前对话ID
            conversations: [] // 所有对话列表
        },

        // 技能名称映射
        skillNames: {
            'hazard_analysis': '隐患识别分析',
            'enterprise_certificate': '企业资质证照识别',
            'personnel_certificate': '人员资质证照识别',
            'smart_qa': '智能问数',
            'courseware_generation': '课件生成'
        },

        // 初始化函数
        init: function (options) {
            // 合并配置
            Object.assign(this.config, options || {});

            // 加载历史对话
            this.loadConversations();

            // 绑定事件
            this.bindEvents();

            // 设置欢迎语
            this.setWelcomeMessage();

            console.log('AI助手组件初始化完成');
        },

        // ==================== 事件绑定 ====================
        bindEvents: function () {
            const self = this;

            // 发送按钮
            const sendBtn = document.querySelector('.btn-send');
            if (sendBtn) {
                sendBtn.onclick = function () { self.sendMessage(); };
            }

            // 输入框Enter键
            const textarea = document.querySelector('.ai-input-area textarea');
            if (textarea) {
                textarea.onkeydown = function (e) { self.handleEnterKey(e); };
                // 监听输入变化，更新发送按钮状态
                textarea.addEventListener('input', function () {
                    self.updateSendButtonState();
                });
            }

            // 初始化按钮状态
            this.updateSendButtonState();

            // 上传按钮（图片和附件）
            const uploadBtn = document.querySelector('.input-toolbar .ph-paperclip');
            if (uploadBtn) {
                uploadBtn.onclick = function () { self.handleFileUpload(); };
                uploadBtn.style.cursor = 'pointer';
            }

            // Skills 技能选择按钮
            const skillsBtn = document.getElementById('skillsBtn');
            if (skillsBtn) {
                skillsBtn.onclick = function (e) {
                    e.stopPropagation();
                    self.toggleSkillsPanel();
                };
                skillsBtn.style.cursor = 'pointer';
            }

            // 新对话按钮（编辑图标）
            const newChatBtn = document.querySelector('.ai-controls .ph-note-pencil');
            if (newChatBtn) {
                newChatBtn.onclick = function () { self.startNewConversation(); };
                newChatBtn.style.cursor = 'pointer';
            }

            // 历史对话按钮
            const historyBtn = document.querySelector('.ai-controls .ph-clock-counter-clockwise');
            if (historyBtn) {
                historyBtn.onclick = function () { self.toggleHistoryPanel(); };
                historyBtn.style.cursor = 'pointer';
            }

            // 历史对话返回按钮
            const historyBackBtn = document.querySelector('.history-back-btn');
            if (historyBackBtn) {
                historyBackBtn.onclick = function () { self.toggleHistoryPanel(); };
                historyBackBtn.style.cursor = 'pointer';
            }

            // 滚动事件
            const chatBody = document.getElementById('aiChatBody');
            if (chatBody) {
                chatBody.onscroll = function () { self.handleChatScroll(); };
            }

            // Skills 面板选项绑定
            const skillsOptions = document.querySelectorAll('.skills-option');
            skillsOptions.forEach(option => {
                option.onclick = function () { self.selectSkill(this.dataset.skillId); };
            });

            // 点击其他区域关闭 skills 面板
            document.addEventListener('click', function (e) {
                const panel = document.getElementById('aiSkillsPanel');
                const skillsBtn = document.getElementById('skillsBtn');
                if (panel && !panel.contains(e.target) && e.target !== skillsBtn) {
                    panel.classList.remove('active');
                }
            });
        },

        // ==================== AI 侧边栏控制 ====================
        toggleAI: function (forceState) {
            const sidebar = document.getElementById('aiSidebar');
            const floatingBtn = document.querySelector('.ai-floating-btn');

            // 如果指定了强制状态
            if (typeof forceState === 'boolean') {
                if (forceState) {
                    sidebar.classList.add('active');
                    floatingBtn.classList.add('hidden');

                    // 确保历史面板是关闭的，显示主对话界面
                    const historyPanel = document.getElementById('historyPanel');
                    if (historyPanel && historyPanel.classList.contains('active')) {
                        historyPanel.classList.remove('active');
                    }

                    // 开始新对话
                    this.startNewConversation();
                    this.scrollToBottom();
                } else {
                    sidebar.classList.remove('active');
                    floatingBtn.classList.remove('hidden');
                }
                return;
            }

            // 切换状态
            if (sidebar.classList.contains('active')) {
                sidebar.classList.remove('active');
                floatingBtn.classList.remove('hidden');
            } else {
                sidebar.classList.add('active');
                floatingBtn.classList.add('hidden');

                // 确保历史面板是关闭的，显示主对话界面
                const historyPanel = document.getElementById('historyPanel');
                if (historyPanel && historyPanel.classList.contains('active')) {
                    historyPanel.classList.remove('active');
                }

                // 开始新对话
                this.startNewConversation();
                this.scrollToBottom();
            }
        },

        startNewConversation: function () {
            const chatBody = document.getElementById('aiChatBody');
            chatBody.innerHTML = `
                <div class="chat-message ai">
                    <div class="message-content">
                        <p class="chat-text">${this.config.welcomeMessage.replace('{userName}', this.config.userName)}</p>
                    </div>
                </div>
            `;
            this.state.pendingImages = [];
            this.state.selectedCards.clear();
            this.state.analysisResults = [];
            this.updateImagePreview();

            const textarea = document.querySelector('.ai-input-area textarea');
            if (textarea) textarea.value = '';

            this.updateSendButtonState();
        },

        setWelcomeMessage: function () {
            const welcomeMsg = document.querySelector('.chat-message.ai .chat-text');
            if (welcomeMsg) {
                welcomeMsg.textContent = this.config.welcomeMessage.replace('{userName}', this.config.userName);
            }
        },

        // ==================== 消息处理 ====================
        sendMessage: function () {
            const textarea = document.querySelector('.ai-input-area textarea');
            const text = textarea.value.trim();
            const hasImages = this.state.pendingImages.length > 0;
            const selectedSkill = this.state.selectedSkill;

            if (!text && !hasImages) return;

            const isHazardRequest = text.includes('隐患') || text.includes('识别') || text.includes('照片') || text.includes('分析');

            this.addUserMessage(text, [...this.state.pendingImages], isHazardRequest, selectedSkill);

            textarea.value = '';
            this.state.pendingImages = [];
            this.state.selectedSkill = null;  // 清除技能选择
            this.updateImagePreview();
            this.updateSkillTag();  // 移除标签显示
            this.updateSendButtonState(); // 更新按钮状态

            // 自动保存对话
            setTimeout(() => {
                this.saveCurrentConversation();
            }, 500);

            if (isHazardRequest && hasImages) {
                this.simulateAIAnalysis();
            } else {
                setTimeout(() => {
                    // 生成建议
                    const suggestions = this.generateSuggestions(text);
                    this.addAIMessage('收到您的消息，有什么可以帮助您的吗？', true, suggestions);
                    // AI回复后也保存
                    setTimeout(() => {
                        this.saveCurrentConversation();
                    }, 500);
                }, 500);
            }
        },

        addUserMessage: function (text, attachments, isHazardRequest, skillId) {
            const chatBody = document.getElementById('aiChatBody');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message user';

            let contentHTML = '<div class="message-content">';

            // 分离图片和文件
            const images = attachments.filter(a => a.isImage || (typeof a === 'string') || (a.type && a.type.startsWith('image/')));
            const files = attachments.filter(a => !a.isImage && typeof a !== 'string' && !(a.type && a.type.startsWith('image/')));

            if (images.length > 0) {
                contentHTML += '<div class="user-images-scroll">';
                images.forEach(img => {
                    const imgSrc = typeof img === 'string' ? img : img.url || img;
                    contentHTML += `<img src="${imgSrc}" alt="上传图片" onclick="AIAssistant.previewFullImage('${imgSrc}')">`;
                });
                contentHTML += '</div>';
            }

            if (files.length > 0) {
                contentHTML += '<div class="user-files-list">';
                files.forEach(file => {
                    const iconInfo = this.getFileIcon(file.name);
                    contentHTML += `
                        <div class="file-card-bubble">
                            <div class="file-icon" style="color: ${iconInfo.color}">
                                <i class="ph ${iconInfo.icon}"></i>
                            </div>
                            <div class="file-info">
                                <div class="file-name" title="${file.name}">${file.name}</div>
                                <div class="file-size">${file.size || ''}</div>
                            </div>
                        </div>
                     `;
                });
                contentHTML += '</div>';
            }

            if (text) {
                contentHTML += '<div class="user-text-bubble">';

                // 如果有技能标签，在文本左侧显示
                if (skillId && this.skillNames[skillId]) {
                    const skillName = this.skillNames[skillId];
                    contentHTML += `<span class="skill-tag-message">${skillName}</span>`;
                } else if (isHazardRequest) {
                    // 保留原有的隐患识别逻辑作为后备
                    contentHTML += '<span class="skill-tag">隐患识别</span> ';
                }

                contentHTML += text;
                contentHTML += '</div>';
            }

            contentHTML += '</div>';
            messageDiv.innerHTML = contentHTML;

            chatBody.appendChild(messageDiv);
            this.scrollToBottom();
        },

        addAIMessage: function (content, showActions, suggestions) {
            showActions = showActions !== false;
            const chatBody = document.getElementById('aiChatBody');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message ai';

            const msgId = 'ai-msg-' + Date.now();
            const timestamp = this.formatTimestamp(new Date());

            // 创建消息容器
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.id = msgId;
            messageDiv.appendChild(contentDiv);

            chatBody.appendChild(messageDiv);
            this.scrollToBottom();

            // 使用流式输出
            this.typeWriter(content, contentDiv, () => {
                // 打字完成后添加操作按钮和建议
                if (showActions && !content.includes('analyzing-indicator')) {
                    const actionsDiv = document.createElement('div');
                    actionsDiv.innerHTML = `
                        <div class="message-timestamp">${timestamp}</div>
                        <div class="message-actions">
                            <span class="action-btn" data-msg-id="${msgId}" onclick="AIAssistant.toggleAudioPlay('${msgId}')" title="语音播放">
                                <i class="ph ph-speaker-high"></i>
                            </span>
                            <span class="action-btn" onclick="AIAssistant.copyMessage('${msgId}')" title="复制">
                                <i class="ph ph-copy"></i>
                            </span>
                            <span class="action-btn" onclick="AIAssistant.likeMessage('${msgId}')" title="点赞">
                                <i class="ph ph-thumbs-up"></i>
                            </span>
                            <span class="action-btn" onclick="AIAssistant.dislikeMessage('${msgId}')" title="踩">
                                <i class="ph ph-thumbs-down"></i>
                            </span>
                            <span class="action-btn" onclick="AIAssistant.regenerateMessage('${msgId}')" title="重新生成">
                                <i class="ph ph-arrow-clockwise"></i>
                            </span>
                        </div>
                    `;
                    messageDiv.appendChild(actionsDiv.firstElementChild);
                    messageDiv.appendChild(actionsDiv.lastElementChild);
                }

                // 添加建议操作
                if (suggestions && suggestions.length > 0) {
                    const suggestionsDiv = document.createElement('div');
                    suggestionsDiv.className = 'message-suggestions';
                    suggestions.forEach((suggestion) => {
                        const escapedText = suggestion.replace(/'/g, "\\'");
                        const suggestionItem = document.createElement('div');
                        suggestionItem.className = 'suggestion-item';
                        suggestionItem.onclick = () => this.selectSuggestion(escapedText);
                        suggestionItem.innerHTML = `
                            <span>${suggestion}</span>
                            <i class="ph ph-arrow-right"></i>
                        `;
                        suggestionsDiv.appendChild(suggestionItem);
                    });
                    messageDiv.appendChild(suggestionsDiv);
                }

                this.scrollToBottom();
            });
        },

        // 添加AI消息（带转换功能）：先流式输出纯文本，完成后转换为富文本
        addAIMessageWithTransform: function (plainText, htmlGenerator, suggestions) {
            const chatBody = document.getElementById('aiChatBody');
            const messageDiv = document.createElement('div');
            messageDiv.className = 'chat-message ai';

            const msgId = 'ai-msg-' + Date.now();
            const timestamp = this.formatTimestamp(new Date());

            // 创建消息容器
            const contentDiv = document.createElement('div');
            contentDiv.className = 'message-content';
            contentDiv.id = msgId;
            messageDiv.appendChild(contentDiv);

            chatBody.appendChild(messageDiv);
            this.scrollToBottom();

            // 第一阶段：流式输出纯文本
            this.typeText(plainText, contentDiv, () => {
                // 第二阶段：纯文本输出完成后，转换为富文本HTML
                setTimeout(() => {
                    // 清空内容
                    contentDiv.innerHTML = '';

                    // 渲染富文本HTML
                    const richHTML = htmlGenerator();
                    contentDiv.innerHTML = richHTML;

                    // 添加操作按钮
                    const actionsDiv = document.createElement('div');
                    actionsDiv.innerHTML = `
                        <div class="message-timestamp">${timestamp}</div>
                        <div class="message-actions">
                            <span class="action-btn" data-msg-id="${msgId}" onclick="AIAssistant.toggleAudioPlay('${msgId}')" title="语音播放">
                                <i class="ph ph-speaker-high"></i>
                            </span>
                            <span class="action-btn" onclick="AIAssistant.copyMessage('${msgId}')" title="复制">
                                <i class="ph ph-copy"></i>
                            </span>
                            <span class="action-btn" onclick="AIAssistant.likeMessage('${msgId}')" title="点赞">
                                <i class="ph ph-thumbs-up"></i>
                            </span>
                            <span class="action-btn" onclick="AIAssistant.dislikeMessage('${msgId}')" title="踩">
                                <i class="ph ph-thumbs-down"></i>
                            </span>
                            <span class="action-btn" onclick="AIAssistant.regenerateMessage('${msgId}')" title="重新生成">
                                <i class="ph ph-arrow-clockwise"></i>
                            </span>
                        </div>
                    `;
                    messageDiv.appendChild(actionsDiv.firstElementChild);
                    messageDiv.appendChild(actionsDiv.lastElementChild);

                    // 添加建议操作
                    if (suggestions && suggestions.length > 0) {
                        const suggestionsDiv = document.createElement('div');
                        suggestionsDiv.className = 'message-suggestions';
                        suggestions.forEach((suggestion) => {
                            const escapedText = suggestion.replace(/'/g, "\\'");
                            const suggestionItem = document.createElement('div');
                            suggestionItem.className = 'suggestion-item';
                            suggestionItem.onclick = () => this.selectSuggestion(escapedText);
                            suggestionItem.innerHTML = `
                                <span>${suggestion}</span>
                                <i class="ph ph-arrow-right"></i>
                            `;
                            suggestionsDiv.appendChild(suggestionItem);
                        });
                        messageDiv.appendChild(suggestionsDiv);
                    }

                    this.scrollToBottom();
                }, 300); // 短暂延迟后开始转换
            });
        },

        // 打字机效果
        typeWriter: function (html, element, callback) {
            // 检查是否包含HTML标签
            if (html.includes('<')) {
                // 包含HTML的内容使用流式显示
                this.streamHTML(html, element, callback);
            } else {
                // 纯文本内容使用打字机效果
                this.typeText(html, element, callback);
            }
        },

        // 纯文本打字机效果
        typeText: function (text, element, callback) {
            let index = 0;
            const speed = 10; // 每个字符的延迟时间（毫秒）

            // 添加光标
            const cursor = document.createElement('span');
            cursor.className = 'typing-cursor';
            element.appendChild(cursor);

            const type = () => {
                if (index < text.length) {
                    // 在光标前插入文字
                    const textNode = document.createTextNode(text.charAt(index));
                    element.insertBefore(textNode, cursor);
                    index++;
                    this.scrollToBottom();
                    setTimeout(type, speed);
                } else {
                    // 打字完成，移除光标
                    cursor.remove();
                    if (callback) callback();
                }
            };

            type();
        },

        // HTML内容流式显示
        streamHTML: function (html, element, callback) {
            // 创建临时容器解析HTML
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = html;

            // 特殊处理：如果包含 analysis-results，先显示介绍文字，再逐个显示卡片
            const analysisResults = tempDiv.querySelector('.analysis-results');
            if (analysisResults) {
                this.streamAnalysisResults(analysisResults, element, callback);
                return;
            }

            // 获取所有子元素
            const children = Array.from(tempDiv.childNodes);
            let index = 0;

            const showNext = () => {
                if (index < children.length) {
                    const child = children[index];

                    // 克隆节点并添加到目标元素
                    const clonedChild = child.cloneNode(true);

                    // 如果是元素节点，添加动画类
                    if (clonedChild.nodeType === 1) {
                        clonedChild.classList.add('stream-item');
                    }

                    element.appendChild(clonedChild);
                    index++;
                    this.scrollToBottom();

                    // 设置延迟
                    const delay = 100;
                    setTimeout(showNext, delay);
                } else {
                    // 所有内容显示完成
                    if (callback) callback();
                }
            };

            showNext();
        },

        // 流式显示分析结果
        streamAnalysisResults: function (analysisResults, element, callback) {
            const intro = analysisResults.querySelector('.analysis-intro');
            const cards = analysisResults.querySelectorAll('.hazard-card');
            const batchActions = analysisResults.querySelector('.hazard-batch-actions');

            // 创建 analysis-results 容器
            const resultsContainer = document.createElement('div');
            resultsContainer.className = 'analysis-results';
            element.appendChild(resultsContainer);

            let step = 0;
            const self = this;

            const showNext = () => {
                if (step === 0) {
                    // 第一步：显示介绍文字（打字机效果）
                    if (intro) {
                        const introText = intro.textContent;
                        const introP = document.createElement('p');
                        introP.className = 'chat-text analysis-intro';
                        resultsContainer.appendChild(introP);
                        this.typeText(introText, introP, () => {
                            step++;
                            setTimeout(showNext, 300);
                        });
                    } else {
                        step++;
                        showNext();
                    }
                } else if (step <= cards.length) {
                    // 第二步：逐个显示卡片
                    const cardIndex = step - 1;
                    if (cards[cardIndex]) {
                        const card = cards[cardIndex].cloneNode(true);
                        card.classList.add('stream-item');

                        // 重新绑定点击事件 - 直接操作当前卡片元素
                        const index = parseInt(card.getAttribute('data-index'));
                        card.onclick = function(e) {
                            // 阻止事件冒泡
                            e.stopPropagation();

                            const checkbox = card.querySelector('.card-checkbox i');

                            if (self.state.selectedCards.has(index)) {
                                self.state.selectedCards.delete(index);
                                card.classList.remove('selected');
                                checkbox.className = 'ph ph-square';
                            } else {
                                self.state.selectedCards.add(index);
                                card.classList.add('selected');
                                checkbox.className = 'ph ph-check-square';
                            }
                        };

                        resultsContainer.appendChild(card);
                        this.scrollToBottom();
                    }
                    step++;
                    setTimeout(showNext, 200);
                } else if (step === cards.length + 1) {
                    // 第三步：显示按钮
                    if (batchActions) {
                        const actions = batchActions.cloneNode(true);
                        actions.classList.add('stream-item');

                        // 重新绑定按钮事件
                        const selectAllBtn = actions.querySelector('.hazard-batch-btn.secondary');
                        if (selectAllBtn) {
                            selectAllBtn.onclick = function(e) {
                                e.stopPropagation();
                                // 选择所有当前显示的卡片
                                const allCards = resultsContainer.querySelectorAll('.hazard-card');
                                allCards.forEach((card) => {
                                    const idx = parseInt(card.getAttribute('data-index'));
                                    const checkbox = card.querySelector('.card-checkbox i');
                                    self.state.selectedCards.add(idx);
                                    card.classList.add('selected');
                                    checkbox.className = 'ph ph-check-square';
                                });
                            };
                        }

                        const insertBtn = actions.querySelector('.hazard-batch-btn.primary');
                        if (insertBtn) {
                            insertBtn.onclick = function(e) {
                                e.stopPropagation();
                                self.insertToForm();
                            };
                        }

                        resultsContainer.appendChild(actions);
                        this.scrollToBottom();
                    }
                    step++;
                    setTimeout(showNext, 200);
                } else {
                    // 完成
                    if (callback) callback();
                }
            };

            showNext();
        },

        // ==================== 图片处理 ====================
        handleChatImageUpload: function () {
            const self = this;
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/jpeg,image/png';
            input.multiple = true;

            input.onchange = function (e) {
                const files = Array.from(e.target.files);
                files.forEach(file => {
                    const reader = new FileReader();
                    reader.onload = function (readerEvent) {
                        if (self.state.pendingImages.length < 5) {
                            const newItem = {
                                url: readerEvent.target.result,
                                name: file.name,
                                status: 'uploading',
                                progress: 0
                            };
                            self.state.pendingImages.push(newItem);
                            self.updateImagePreview();
                            self.updateSendButtonState();
                            // 模拟上传
                            self.simulateUpload(newItem);
                        }
                    };
                    reader.readAsDataURL(file);
                });
            };

            input.click();
        },

        updateImagePreview: function () {
            let previewArea = document.querySelector('.chat-image-preview');

            if (this.state.pendingImages.length === 0) {
                if (previewArea) previewArea.remove();
                return;
            }

            if (!previewArea) {
                previewArea = document.createElement('div');
                previewArea.className = 'chat-image-preview';
                const inputArea = document.querySelector('.ai-input-area');
                const textarea = inputArea.querySelector('textarea');
                inputArea.insertBefore(previewArea, textarea);
            }

            previewArea.innerHTML = this.state.pendingImages.map((img, index) => `
                <div class="preview-image-item">
                    <img src="${img.url}" alt="${img.name}" onclick="AIAssistant.previewFullImage('${img.url}')">
                    <span class="remove-preview" onclick="AIAssistant.removePreviewImage(${index})">
                        <i class="ph ph-x"></i>
                    </span>
                </div>
            `).join('');
        },

        removePreviewImage: function (index) {
            this.state.pendingImages.splice(index, 1);
            this.updateImagePreview();
            this.updateSendButtonState();
        },

        previewFullImage: function (src) {
            const overlay = document.createElement('div');
            overlay.className = 'image-preview-overlay';
            overlay.innerHTML = `
                <div class="preview-container">
                    <img src="${src}" alt="预览">
                    <span class="close-preview" onclick="this.parentElement.parentElement.remove()">
                        <i class="ph ph-x"></i>
                    </span>
                </div>
            `;
            overlay.onclick = function (e) {
                if (e.target === overlay) overlay.remove();
            };
            document.body.appendChild(overlay);
        },

        //  ==================== 文件上传（支持多种类型） ====================
        handleFileUpload: function () {
            const fileInput = document.getElementById('aiFileInput');
            if (fileInput) {
                fileInput.value = ''; // Clear value before click to allow re-selecting same file
                fileInput.click();

                const self = this;
                if (!fileInput.hasAttribute('data-bound')) {
                    fileInput.addEventListener('change', function (e) {
                        const files = Array.from(e.target.files);
                        files.forEach(file => {
                            if (self.state.pendingImages.length < 5) {
                                // 区分图片和其他文件
                                const isImage = file.type.startsWith('image/');

                                if (isImage) {
                                    const reader = new FileReader();
                                    reader.onload = function (readerEvent) {
                                        const newItem = {
                                            url: readerEvent.target.result,
                                            name: file.name,
                                            type: file.type,
                                            isImage: true,
                                            fileObj: file,
                                            status: 'uploading',
                                            progress: 0
                                        };
                                        self.state.pendingImages.push(newItem);
                                        self.updateImagePreview();
                                        self.updateSendButtonState();
                                        self.simulateUpload(newItem);
                                    };
                                    reader.readAsDataURL(file);
                                } else {
                                    // 非图片文件，直接存储文件信息
                                    const newItem = {
                                        url: null, // 非图片没有预览图
                                        name: file.name,
                                        type: file.type,
                                        isImage: false,
                                        fileObj: file,
                                        size: self.formatFileSize(file.size),
                                        status: 'uploading',
                                        progress: 0
                                    };
                                    self.state.pendingImages.push(newItem);
                                    self.updateImagePreview();
                                    self.updateSendButtonState();
                                    self.simulateUpload(newItem);
                                }
                            }
                        });
                        // 清空input，允许重复选择同一文件
                        e.target.value = '';
                    });
                    fileInput.setAttribute('data-bound', 'true');
                }
            }
        },

        formatFileSize: function (bytes) {
            if (bytes === 0) return '0 B';
            const k = 1024;
            const sizes = ['B', 'KB', 'MB', 'GB'];
            const i = Math.floor(Math.log(bytes) / Math.log(k));
            return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
        },

        getFileIcon: function (fileName) {
            const ext = fileName.split('.').pop().toLowerCase();
            let iconClass = 'ph-file';
            let color = '#666';

            if (['pdf'].includes(ext)) {
                iconClass = 'ph-file-pdf';
                color = '#ff4d4f';
            } else if (['doc', 'docx'].includes(ext)) {
                iconClass = 'ph-file-doc';
                color = '#1677ff';
            } else if (['xls', 'xlsx', 'csv'].includes(ext)) {
                iconClass = 'ph-file-xls';
                color = '#52c41a';
            } else if (['ppt', 'pptx'].includes(ext)) {
                iconClass = 'ph-file-ppt';
                color = '#faad14';
            } else if (['zip', 'rar', '7z'].includes(ext)) {
                iconClass = 'ph-file-archive';
                color = '#722ed1';
            } else if (['txt', 'md'].includes(ext)) {
                iconClass = 'ph-file-text';
                color = '#666';
            }

            return { icon: iconClass, color: color };
        },

        updateImagePreview: function () {
            let previewArea = document.querySelector('.chat-image-preview');

            if (this.state.pendingImages.length === 0) {
                if (previewArea) previewArea.remove();
                return;
            }

            if (!previewArea) {
                previewArea = document.createElement('div');
                previewArea.className = 'chat-image-preview';
                const inputArea = document.querySelector('.ai-input-area');
                const textarea = inputArea.querySelector('textarea');
                inputArea.insertBefore(previewArea, textarea);
            }

            previewArea.innerHTML = this.state.pendingImages.map((item, index) => {
                if (item.isImage) {
                    let overlayHTML = '';
                    if (item.status === 'uploading') {
                        overlayHTML = `
                            <div class="upload-overlay">
                                <div class="upload-ring-container">
                                    <div class="upload-progress-ring" style="--progress: ${item.progress}%"></div>
                                    <span class="upload-percentage">${item.progress}%</span>
                                </div>
                            </div>
                        `;
                    }

                    return `
                        <div class="preview-file-item image-type">
                            <img src="${item.url}" alt="${item.name}" onclick="AIAssistant.previewFullImage('${item.url}')">
                            ${overlayHTML}
                            <span class="remove-preview" onclick="AIAssistant.removePreviewImage(${index})">
                                <i class="ph ph-x"></i>
                            </span>
                        </div>
                    `;
                } else {
                    const iconInfo = this.getFileIcon(item.name);
                    let progressBarHTML = '';
                    let statusText = '';

                    if (item.status === 'uploading') {
                        progressBarHTML = `<div class="upload-progress-bar" style="width: ${item.progress}%"></div>`;
                        statusText = `<span class="file-status-text">上传中... ${item.progress}%</span>`;
                    }

                    return `
                        <div class="preview-file-item file-type">
                            ${progressBarHTML}
                            <div class="file-icon" style="color: ${iconInfo.color}">
                                <i class="ph ${iconInfo.icon}"></i>
                            </div>
                            <div class="file-info">
                                <span class="file-name" title="${item.name}">${item.name}</span>
                                <span class="file-size">${item.size}${statusText}</span>
                            </div>
                            <span class="remove-preview" onclick="AIAssistant.removePreviewImage(${index})">
                                <i class="ph ph-x"></i>
                            </span>
                        </div>
                    `;
                }
            }).join('');

        },

        // 更新发送按钮状态
        updateSendButtonState: function () {
            const sendBtn = document.querySelector('.btn-send');
            if (!sendBtn) return;

            const textarea = document.querySelector('.ai-input-area textarea');
            const hasText = textarea && textarea.value.trim().length > 0;
            const hasImages = this.state.pendingImages.length > 0;
            const isUploading = this.state.pendingImages.some(img => img.status === 'uploading');

            if ((hasText || hasImages) && !isUploading) {
                sendBtn.disabled = false;
                sendBtn.classList.remove('disabled');
            } else {
                sendBtn.disabled = true;
                sendBtn.classList.add('disabled');
            }
        },

        // 模拟上传过程
        simulateUpload: function (item) {
            const self = this;
            let progress = 0;

            // 随机生成一个上传时长，1-3秒之间
            const duration = 1000 + Math.random() * 2000;
            const interval = 50; // 每50ms更新一次
            const step = 100 / (duration / interval);

            const timer = setInterval(() => {
                progress += step;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(timer);
                    item.status = 'done';
                    item.progress = 100;
                    self.updateSendButtonState(); // 上传完成，更新按钮状态
                } else {
                    item.progress = Math.round(progress);
                }
                self.updateImagePreview(); // 更新UI
            }, interval);
        },

        // ==================== Skills 技能选择 ====================
        toggleSkillsPanel: function () {
            const panel = document.getElementById('aiSkillsPanel');
            if (panel) {
                const isActive = panel.classList.toggle('active');
                if (isActive) {
                    // 动态计算面板位置（固定定位，避免被 overflow:hidden 裁剪）
                    const btn = document.getElementById('skillsBtn');
                    if (btn) {
                        const btnRect = btn.getBoundingClientRect();
                        const panelHeight = panel.offsetHeight;
                        panel.style.left = (btnRect.left - 10) + 'px';
                        panel.style.top = (btnRect.top - panelHeight - 10) + 'px';
                    }
                }
            }
        },

        selectSkill: function (skillId) {
            const self = this;

            // 更新面板选中状态（单选）
            const options = document.querySelectorAll('.skills-option');
            options.forEach(opt => opt.classList.remove('selected'));

            const selectedOption = document.querySelector(`.skills-option[data-skill-id="${skillId}"]`);
            if (selectedOption) {
                selectedOption.classList.add('selected');
            }

            // 更新状态
            this.state.selectedSkill = skillId;

            // 在输入框上方显示标签
            this.updateSkillTag();

            // 关闭面板
            const panel = document.getElementById('aiSkillsPanel');
            if (panel) {
                panel.classList.remove('active');
            }
        },

        updateSkillTag: function () {
            const toolbar = document.querySelector('.input-toolbar');
            const skillsBtn = document.getElementById('skillsBtn'); // The plus button

            if (!toolbar || !skillsBtn) return;

            // 移除旧标签
            let existingTag = toolbar.querySelector('.skill-tag-common');
            if (existingTag) {
                existingTag.remove();
            }

            // 如果有选中的技能
            if (this.state.selectedSkill) {
                // 隐藏加号按钮
                skillsBtn.style.display = 'none';

                // 创建新标签
                const skillName = this.skillNames[this.state.selectedSkill];
                const tag = document.createElement('div');
                tag.className = 'skill-tag-common';
                tag.innerHTML = `
                    <span>${skillName}</span>
                    <i class="ph ph-x" onclick="event.stopPropagation(); AIAssistant.removeSkillTag()"></i>
                `;

                // 插入到加号按钮的位置（或者之后，因为加号隐藏了，视觉上是替换）
                toolbar.insertBefore(tag, skillsBtn.nextSibling);

                // 确保Skills面板关闭
                const panel = document.getElementById('aiSkillsPanel');
                if (panel) panel.classList.remove('active');

            } else {
                // 没有选中技能，显示加号按钮
                skillsBtn.style.display = 'block';
            }

            // 旧逻辑清除
            const inputArea = document.querySelector('.ai-input-area');
            let oldTagsContainer = inputArea.querySelector('.skill-tags-container');
            if (oldTagsContainer) {
                oldTagsContainer.remove();
            }
        },

        removeSkillTag: function () {
            this.state.selectedSkill = null;
            this.updateSkillTag();

            // 移除面板中的选中状态
            const options = document.querySelectorAll('.skills-option');
            options.forEach(opt => opt.classList.remove('selected'));
        },

        // ==================== AI 分析 ====================
        simulateAIAnalysis: function () {
            const self = this;
            this.state.isAnalyzing = true;

            this.addAIMessage('<div class="analyzing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span> 正在分析中...</div>');

            setTimeout(function () {
                const analyzing = document.querySelector('.analyzing-indicator');
                if (analyzing) {
                    analyzing.closest('.chat-message').remove();
                }

                self.showAnalysisResults();
                self.state.isAnalyzing = false;

                if (self.config.onAnalysisComplete) {
                    self.config.onAnalysisComplete(self.state.analysisResults);
                }
            }, 2500);
        },

        showAnalysisResults: function () {
            this.state.analysisResults = [
                {
                    id: 0,
                    name: '电线裸露',
                    description: '电线绝缘层破损或缺失，导致内部金属导线直接暴露在外。这种情况极易造成人员触电事故，尤其在潮湿环境或意外接触时风险更高，也可能引发短路和火灾。',
                    measure: '使用绝缘胶带或绝缘套管对裸露的电线进行包裹，确保电线完全绝缘。',
                    regulation: '《用电安全导则》GB/T 13869-2017 第5.2.1条规定"用电产品应处于完好状态，绝缘应无破损"，第6.2.1条明确要求"电气线路应具有足够的绝缘强度、机械强度和导电能力，其绝缘不应破损"。'
                },
                {
                    id: 1,
                    name: '管道损坏',
                    description: '管道表面出现裂缝、孔洞或严重锈蚀，可能导致液体或气体泄漏。这不仅会造成资源浪费，还可能引发地面湿滑、设备损坏，甚至产生有害气体或液体对环境和人员造成危害。',
                    measure: '检查所有管道，对损坏的部分进行更换或修复。',
                    regulation: '《中华人民共和国安全生产法》第三十六条规定"生产经营单位必须对安全设备进行经常性维护、保养，并定期检测，保证正常运转。维护、保养、检测应当作好记录，并由有关人员签字"。'
                },
                {
                    id: 2,
                    name: '电线固定不当',
                    description: '电线未使用专用固定件，处于悬空、拖拽或随意摆放状态。长期摩擦会导致绝缘层磨损，也可能被人员或设备意外拉扯，造成线路断开或短路。',
                    measure: '使用电线夹或扎带将电线固定在适当的位置，防止电线因移动而磨损。',
                    regulation: '《用电安全导则》GB/T 13869-2017 第6.3.1条规定"电气线路的敷设应稳固，连接应可靠，避免因振动、拉伸、弯曲等导致绝缘破损或接触不良"。'
                }
            ];

            // 第一阶段：生成纯文本内容用于流式输出
            let plainText = '这张图片显示了一些电线和管道的布局，可能存在一些安全隐患。以下是一些可能的隐患：\n\n';

            this.state.analysisResults.forEach((result, index) => {
                plainText += `${index + 1}. ${result.name}\n`;
                plainText += `问题描述：${result.description}\n`;
                plainText += `整改措施：${result.measure}\n`;
                plainText += `法规依据：${result.regulation}\n\n`;
            });

            // 第二阶段：生成富文本HTML（卡片格式）的函数
            const generateCardsHTML = () => {
                let cardsHTML = '<div class="analysis-results">';
                cardsHTML += '<p class="chat-text analysis-intro">这张图片显示了一些电线和管道的布局，可能存在一些安全隐患。以下是一些可能的隐患：</p>';

                this.state.analysisResults.forEach((result, index) => {
                    cardsHTML += `
                        <div class="hazard-card" data-index="${index}" onclick="AIAssistant.toggleCardSelection(${index})">
                            <div class="card-header-row">
                                <div class="card-checkbox">
                                    <i class="ph ph-square"></i>
                                </div>
                                <h4 class="card-title">${result.name}</h4>
                            </div>
                            <div class="card-field">
                                <span class="field-label">问题描述：</span>
                                <span class="field-value">${result.description}</span>
                            </div>
                            <div class="card-field">
                                <span class="field-label">整改措施：</span>
                                <span class="field-value">${result.measure}</span>
                            </div>
                            <div class="card-field">
                                <span class="field-label">法规依据：</span>
                                <span class="field-value">${result.regulation}</span>
                            </div>
                        </div>
                    `;
                });

                cardsHTML += `
                <div class="hazard-batch-actions">
                    <button class="hazard-batch-btn secondary" onclick="AIAssistant.selectAllHazards()">
                        <i class="ph ph-check-square"></i>
                        全部选择
                    </button>
                    <button class="hazard-batch-btn primary" onclick="event.stopPropagation(); AIAssistant.insertToForm()">
                        <i class="ph ph-file-arrow-down"></i>
                        插入问题登记表
                    </button>
                </div>
                `;
                cardsHTML += '</div>';
                return cardsHTML;
            };

            // 建议列表
            const suggestions = [
                '如何整改这些隐患？',
                '需要准备哪些整改材料？',
                '整改完成后如何验收？'
            ];

            // 先流式输出纯文本，完成后渲染成卡片格式
            this.addAIMessageWithTransform(plainText, generateCardsHTML, suggestions);
        },

        // ==================== 证照识别功能 ====================
        simulateCertificateRecognition: function () {
            const self = this;
            this.state.isAnalyzing = true;

            this.addAIMessage('<div class="analyzing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span> 正在识别中...</div>');

            setTimeout(function () {
                const analyzing = document.querySelector('.analyzing-indicator');
                if (analyzing) {
                    analyzing.closest('.chat-message').remove();
                }

                self.showCertificateResults();
                self.state.isAnalyzing = false;
            }, 2500);
        },

        showCertificateResults: function () {
            this.state.certificateResults = [
                {
                    id: 1,
                    type: '营业执照',
                    icon: '📄',
                    certificateNumber: '91110108MA01234567',
                    companyName: '北京XX安全科技有限公司',
                    legalPerson: '张三',
                    validFrom: '2020-01-01',
                    validTo: '2025-12-31',
                    issueAuthority: '北京市工商行政管理局',
                    confidence: 0.98
                },
                {
                    id: 2,
                    type: '安全生产许可证',
                    icon: '🛡️',
                    certificateNumber: '(京)JZ安许证字[2023]001234',
                    companyName: '北京XX安全科技有限公司',
                    validFrom: '2023-01-01',
                    validTo: '2026-12-31',
                    issueAuthority: '北京市应急管理局',
                    confidence: 0.95
                },
                {
                    id: 3,
                    type: '特种设备许可证',
                    icon: '⚙️',
                    certificateNumber: 'TS1234567890',
                    companyName: '北京XX安全科技有限公司',
                    validFrom: '2024-01-01',
                    validTo: '2027-12-31',
                    issueAuthority: '北京市市场监督管理局',
                    confidence: 0.92
                },
                {
                    id: 4,
                    type: '消防安全检查合格证',
                    icon: '🔥',
                    certificateNumber: 'XF20230001234',
                    companyName: '北京XX安全科技有限公司',
                    validFrom: '2023-06-01',
                    validTo: '2024-06-01',
                    issueAuthority: '北京市消防救援总队',
                    confidence: 0.89
                },
                {
                    id: 5,
                    type: '环境影响评价报告',
                    icon: '🌱',
                    certificateNumber: 'HJ2023-BJ-001234',
                    companyName: '北京XX安全科技有限公司',
                    validFrom: '2023-03-01',
                    validTo: '2028-03-01',
                    issueAuthority: '北京市生态环境局',
                    confidence: 0.87
                }
            ];

            this.state.selectedCertificates = new Set();

            let resultsHTML = '<div class="certificate-results">';
            resultsHTML += '<p class="chat-text analysis-intro">已成功识别上传的证照图片，共识别出 5 张证照。以下是识别结果，请审核后选择需要导入的记录：</p>';
            resultsHTML += '<div class="certificate-grid">';

            this.state.certificateResults.forEach((cert, index) => {
                resultsHTML += `
                    <div class="certificate-card hazard-card" data-cert-id="${cert.id}" onclick="AIAssistant.toggleCertificateSelection(${cert.id})">
                        <div class="card-header-row">
                            <div class="card-checkbox">
                                <i class="ph ph-square"></i>
                            </div>
                            <h4 class="card-title">${cert.type}</h4>
                        </div>
                        <div class="card-field">
                            <span class="field-label">证件号码：</span>
                            <span class="field-value">${cert.certificateNumber}</span>
                        </div>
                        <div class="card-field">
                            <span class="field-label">企业名称：</span>
                            <span class="field-value">${cert.companyName}</span>
                        </div>
                        ${cert.legalPerson ? `<div class="card-field">
                            <span class="field-label">法定代表人：</span>
                            <span class="field-value">${cert.legalPerson}</span>
                        </div>` : ''}
                        <div class="card-field">
                            <span class="field-label">有效期限：</span>
                            <span class="field-value">${cert.validFrom} 至 ${cert.validTo}</span>
                        </div>
                        <div class="card-field">
                            <span class="field-label">发证机关：</span>
                            <span class="field-value">${cert.issueAuthority}</span>
                        </div>
                    </div>
                `;
            });

            resultsHTML += '</div>';
            resultsHTML += `
                <div class="certificate-batch-actions">
                    <button class="certificate-batch-btn secondary" onclick="AIAssistant.selectAllCertificates()">
                        <i class="ph ph-check-square"></i>
                        全部选择
                    </button>
                    <button class="certificate-batch-btn primary" onclick="AIAssistant.importSelectedCertificates()" disabled id="importCertBtn">
                        <i class="ph ph-file-arrow-down"></i>
                        批量导入（0）
                    </button>
                </div>
            `;
            resultsHTML += '</div>';

            // 为证照识别添加建议
            const suggestions = [
                '如何更新即将过期的证照？',
                '证照到期提醒如何设置？',
                '如何查看历史证照记录？'
            ];

            this.addAIMessage(resultsHTML, true, suggestions);
        },

        toggleCertificateSelection: function (certId) {
            const card = document.querySelector(`.certificate-card[data-cert-id="${certId}"]`);
            const checkbox = card.querySelector('.card-checkbox i');

            if (this.state.selectedCertificates.has(certId)) {
                this.state.selectedCertificates.delete(certId);
                card.classList.remove('selected');
                checkbox.className = 'ph ph-square';
            } else {
                this.state.selectedCertificates.add(certId);
                card.classList.add('selected');
                checkbox.className = 'ph ph-check-square';
            }

            this.updateCertificateImportButton();
        },

        selectAllCertificates: function () {
            const allSelected = this.state.selectedCertificates.size === this.state.certificateResults.length;

            if (allSelected) {
                // 取消全选
                this.state.selectedCertificates.clear();
                document.querySelectorAll('.certificate-card').forEach(card => {
                    card.classList.remove('selected');
                    card.querySelector('.card-checkbox i').className = 'ph ph-square';
                });
            } else {
                // 全选
                this.state.certificateResults.forEach(cert => {
                    this.state.selectedCertificates.add(cert.id);
                });
                document.querySelectorAll('.certificate-card').forEach(card => {
                    card.classList.add('selected');
                    card.querySelector('.card-checkbox i').className = 'ph ph-check-square';
                });
            }

            this.updateCertificateImportButton();
        },

        updateCertificateImportButton: function () {
            const btn = document.getElementById('importCertBtn');
            if (btn) {
                const count = this.state.selectedCertificates.size;
                btn.disabled = count === 0;
                btn.innerHTML = `
                    <i class="ph ph-file-arrow-down"></i>
                    批量导入（${count}）
                `;
            }
        },

        importSelectedCertificates: function () {
            if (this.state.selectedCertificates.size === 0) {
                alert('请先选择需要导入的证照');
                return;
            }

            const selectedCerts = this.state.certificateResults.filter(cert =>
                this.state.selectedCertificates.has(cert.id)
            );

            // 模拟导入过程
            const certNames = selectedCerts.map(c => c.type).join('、');
            alert(`正在导入 ${selectedCerts.length} 张证照：\n${certNames}\n\n导入成功！`);

            // 清空选择
            this.state.selectedCertificates.clear();
            document.querySelectorAll('.certificate-card').forEach(card => {
                card.classList.remove('selected');
                card.querySelector('.card-checkbox i').className = 'ph ph-square';
            });
            this.updateCertificateImportButton();
        },

        // ==================== 培训课件生成功能 ====================
        simulateCoursewareGeneration: function () {
            const self = this;
            this.state.isAnalyzing = true;

            this.addAIMessage('<div class="analyzing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span> 正在生成课件大纲...</div>');

            setTimeout(function () {
                const analyzing = document.querySelector('.analyzing-indicator');
                if (analyzing) {
                    analyzing.closest('.chat-message').remove();
                }

                self.showCoursewareResults();
                self.state.isAnalyzing = false;
            }, 2500);
        },

        showCoursewareResults: function () {
            // 保存大纲数据
            this.state.coursewareOutline = {
                title: '高处作业安全培训',
                sections: [
                    {
                        title: '开场部分',
                        items: [
                            '封面页：突出产品定位"记住您、懂安全、伴您左右"',
                            '目录页：清晰展示课件结构'
                        ]
                    },
                    {
                        title: '问题与方案',
                        items: [
                            '行业挑战：四大核心痛点（数据碎片化、知识获取难、决策支撑弱、责任追溯难）',
                            '解决方案：双重记忆能力+四大核心特点',
                            '一天工作流：展示AI助手如何贯穿全天工作场景'
                        ]
                    },
                    {
                        title: '五大核心场景（采用统一的"问题→解决→结果"三段式结构）',
                        items: [
                            '场景一：智能隐患识别',
                            '场景二：智能培训助手',
                            '场景三：智能知识问答',
                            '场景四：智能问数',
                            '场景五：智能文档'
                        ]
                    },
                    {
                        title: '价值与合作',
                        items: [
                            '全场景协同：完整安全管理闭环',
                            '产品优势：五大核心优势',
                            '价值评估：效率提升+成本节约的数据',
                            '合作方式：三种部署模式'
                        ]
                    }
                ]
            };

            // 生成简洁的文字大纲
            let outlineText = `已为您生成《${this.state.coursewareOutline.title}》课件大纲，共包含${this.state.coursewareOutline.sections.length}个部分。以下是大纲概要：\n\n`;

            this.state.coursewareOutline.sections.forEach((section, index) => {
                outlineText += `${index + 1}. ${section.title}\n`;
                section.items.forEach(item => {
                    outlineText += `   • ${item}\n`;
                });
                if (index < this.state.coursewareOutline.sections.length - 1) {
                    outlineText += '\n';
                }
            });

            let resultsHTML = '<div class="courseware-outline-result">';
            resultsHTML += '<div class="outline-text">' + outlineText.replace(/\n/g, '<br>') + '</div>';

            resultsHTML += '<div class="outline-actions">';
            resultsHTML += '<button class="outline-view-btn" onclick="AIAssistant.showOutlineModal()">查看完整大纲</button>';
            resultsHTML += '<button class="outline-confirm-btn" onclick="AIAssistant.confirmOutline()">确认大纲，生成详细内容</button>';
            resultsHTML += '</div>';

            resultsHTML += '</div>';

            // 不添加建议，等用户确认后再显示
            this.addAIMessage(resultsHTML, true);
        },

        showOutlineModal: function () {
            // 生成完整大纲的HTML
            let modalHTML = '<div class="outline-modal-overlay" onclick="AIAssistant.closeOutlineModal()">';
            modalHTML += '<div class="outline-modal" onclick="event.stopPropagation()">';
            modalHTML += '<div class="outline-modal-header">';
            modalHTML += `<h3>${this.state.coursewareOutline.title} - 完整大纲</h3>`;
            modalHTML += '<i class="ph ph-x outline-modal-close" onclick="AIAssistant.closeOutlineModal()"></i>';
            modalHTML += '</div>';
            modalHTML += '<div class="outline-modal-content">';

            this.state.coursewareOutline.sections.forEach((section, index) => {
                modalHTML += `<div class="outline-section">`;
                modalHTML += `<div class="outline-section-title">${index + 1}. ${section.title}</div>`;
                modalHTML += '<ul class="outline-section-items">';
                section.items.forEach(item => {
                    modalHTML += `<li>${item}</li>`;
                });
                modalHTML += '</ul>';
                modalHTML += '</div>';
            });

            modalHTML += '</div>';
            modalHTML += '<div class="outline-modal-footer">';
            modalHTML += '<button class="outline-modal-btn" onclick="AIAssistant.closeOutlineModal()">关闭</button>';
            modalHTML += '</div>';
            modalHTML += '</div>';
            modalHTML += '</div>';

            // 添加到页面
            const modalContainer = document.createElement('div');
            modalContainer.id = 'outlineModalContainer';
            modalContainer.innerHTML = modalHTML;
            document.body.appendChild(modalContainer);
        },

        closeOutlineModal: function () {
            const modalContainer = document.getElementById('outlineModalContainer');
            if (modalContainer) {
                modalContainer.remove();
            }
        },

        confirmOutline: function () {
            // 用户确认大纲，开始生成详细内容
            this.addUserMessage('确认大纲，请生成详细内容', [], false);

            // 显示生成进度
            setTimeout(() => {
                this.generateDetailedContent();
            }, 500);
        },

        generateDetailedContent: function () {
            // 显示生成进度
            const progressHTML = `
                <div class="courseware-progress">
                    <div class="progress-text">正在生成详细内容... 第1部分/共4部分</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 25%"></div>
                    </div>
                    <div class="progress-percent">25%</div>
                </div>
            `;

            this.addAIMessage(progressHTML);

            // 模拟生成过程
            let progress = 25;
            const interval = setInterval(() => {
                progress += 25;
                const progressFill = document.querySelector('.progress-fill');
                const progressText = document.querySelector('.progress-text');
                const progressPercent = document.querySelector('.progress-percent');

                if (progressFill && progressText && progressPercent) {
                    progressFill.style.width = progress + '%';
                    progressText.textContent = `正在生成详细内容... 第${progress / 25}部分/共4部分`;
                    progressPercent.textContent = progress + '%';
                }

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        this.showDetailedContent();
                    }, 500);
                }
            }, 800);
        },

        showDetailedContent: function () {
            const detailHTML = `
                <div class="courseware-detail">
                    <div class="detail-title">课件详细内容已生成完成</div>
                    <div class="detail-summary">
                        已成功生成《高处作业安全培训》完整课件，包含4个主要部分，共计约50页内容。
                        课件内容涵盖了从问题分析到解决方案，再到具体场景应用的完整培训体系。
                    </div>
                    <div class="detail-sections">
                        <div class="detail-section-item">
                            <div class="section-number">1</div>
                            <div class="section-info">
                                <div class="section-name">开场部分</div>
                                <div class="section-desc">封面页、目录页，共2页</div>
                            </div>
                        </div>
                        <div class="detail-section-item">
                            <div class="section-number">2</div>
                            <div class="section-info">
                                <div class="section-name">问题与方案</div>
                                <div class="section-desc">行业挑战、解决方案、工作流展示，共8页</div>
                            </div>
                        </div>
                        <div class="detail-section-item">
                            <div class="section-number">3</div>
                            <div class="section-info">
                                <div class="section-name">五大核心场景</div>
                                <div class="section-desc">智能隐患识别、培训助手、知识问答等，共35页</div>
                            </div>
                        </div>
                        <div class="detail-section-item">
                            <div class="section-number">4</div>
                            <div class="section-info">
                                <div class="section-name">价值与合作</div>
                                <div class="section-desc">全场景协同、产品优势、价值评估，共5页</div>
                            </div>
                        </div>
                    </div>
                    <div class="detail-actions">
                        <button class="detail-action-btn primary" onclick="alert('导出为PPT功能')">
                            <i class="ph ph-file-ppt"></i>
                            导出为PPT
                        </button>
                        <button class="detail-action-btn secondary" onclick="alert('导出为Word功能')">
                            <i class="ph ph-file-doc"></i>
                            导出为Word
                        </button>
                        <button class="detail-action-btn secondary" onclick="alert('预览课件功能')">
                            <i class="ph ph-eye"></i>
                            预览课件
                        </button>
                    </div>
                </div>
            `;

            // 添加建议
            const suggestions = [
                '生成配套的培训试题',
                '制作培训签到表',
                '生成培训效果评估表'
            ];

            this.addAIMessage(detailHTML, true, suggestions);
        },

        toggleChapter: function (chapterId) {
            const chapter = this.state.coursewareResults.find(c => c.id === chapterId);
            if (!chapter) return;

            const chapterElement = document.querySelector(`.courseware-chapter[data-chapter-id="${chapterId}"]`);
            const sectionsElement = chapterElement.querySelector('.chapter-sections');
            const toggleIcon = chapterElement.querySelector('.chapter-toggle');

            chapter.expanded = !chapter.expanded;

            if (chapter.expanded) {
                sectionsElement.style.display = 'block';
                toggleIcon.className = 'ph ph-caret-down chapter-toggle';
            } else {
                sectionsElement.style.display = 'none';
                toggleIcon.className = 'ph ph-caret-right chapter-toggle';
            }
        },

        expandAllChapters: function () {
            const allExpanded = this.state.coursewareResults.every(c => c.expanded);

            this.state.coursewareResults.forEach((chapter, index) => {
                const chapterElement = document.querySelector(`.courseware-chapter[data-chapter-id="${chapter.id}"]`);
                const sectionsElement = chapterElement.querySelector('.chapter-sections');
                const toggleIcon = chapterElement.querySelector('.chapter-toggle');

                if (allExpanded) {
                    // 全部收起
                    chapter.expanded = false;
                    sectionsElement.style.display = 'none';
                    toggleIcon.className = 'ph ph-caret-right chapter-toggle';
                } else {
                    // 全部展开
                    chapter.expanded = true;
                    sectionsElement.style.display = 'block';
                    toggleIcon.className = 'ph ph-caret-down chapter-toggle';
                }
            });

            // 更新按钮文本
            const btn = event.target.closest('.courseware-action-btn');
            if (btn) {
                if (allExpanded) {
                    btn.innerHTML = '<i class="ph ph-arrows-out"></i> 展开全部';
                } else {
                    btn.innerHTML = '<i class="ph ph-arrows-in"></i> 收起全部';
                }
            }
        },

        editOutline: function () {
            alert('编辑大纲功能\n\n您可以在此调整章节顺序、修改标题或添加新章节。');
        },

        generateDetailedContent: function () {
            // 显示生成进度
            const progressHTML = `
                <div class="courseware-progress">
                    <div class="progress-text">正在生成详细内容... 第1章/共5章</div>
                    <div class="progress-bar">
                        <div class="progress-fill" style="width: 20%"></div>
                    </div>
                    <div class="progress-percent">20%</div>
                </div>
            `;

            this.addAIMessage(progressHTML);

            // 模拟生成过程
            let progress = 20;
            const interval = setInterval(() => {
                progress += 20;
                const progressFill = document.querySelector('.progress-fill');
                const progressText = document.querySelector('.progress-text');
                const progressPercent = document.querySelector('.progress-percent');

                if (progressFill && progressText && progressPercent) {
                    progressFill.style.width = progress + '%';
                    progressText.textContent = `正在生成详细内容... 第${progress / 20}章/共5章`;
                    progressPercent.textContent = progress + '%';
                }

                if (progress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        this.showDetailedChapter();
                    }, 500);
                }
            }, 800);
        },

        showDetailedChapter: function () {
            const detailHTML = `
                <div class="courseware-detail">
                    <div class="detail-chapter-title">
                        <i class="ph ph-book-open"></i>
                        第一章：高处作业基础知识
                    </div>
                    <div class="detail-section">
                        <div class="section-title">1.1 高处作业定义与分类</div>
                        <div class="section-content">
                            <p>高处作业是指在坠落高度基准面2米以上（含2米）有可能坠落的高处进行的作业。根据作业高度和作业条件，高处作业分为一级、二级、三级和特级高处作业。</p>
                        </div>
                        <div class="section-keypoints">
                            <div class="keypoints-title">【知识点】</div>
                            <ul>
                                <li>2米以上为高处作业</li>
                                <li>分为一级、二级、三级、特级</li>
                                <li>必须持证上岗</li>
                            </ul>
                        </div>
                        <div class="section-case">
                            <div class="case-title">【案例】</div>
                            <p>2023年某建筑工地高处坠落事故：作业人员在3层楼板边缘作业时，未系安全带不慎坠落，经抢救无效死亡。</p>
                        </div>
                    </div>
                    <div class="detail-actions">
                        <button class="detail-action-btn" onclick="alert('编辑章节功能')">
                            <i class="ph ph-pencil"></i>
                            编辑此章节
                        </button>
                        <button class="detail-action-btn" onclick="alert('插入图片功能')">
                            <i class="ph ph-image"></i>
                            插入图片
                        </button>
                        <button class="detail-action-btn" onclick="alert('添加视频功能')">
                            <i class="ph ph-video"></i>
                            添加视频
                        </button>
                    </div>
                </div>
            `;

            this.addAIMessage(detailHTML);
        },

        toggleCardSelection: function (index) {
            const card = document.querySelector(`.hazard-card[data-index="${index}"]`);
            const checkbox = card.querySelector('.card-checkbox i');

            if (this.state.selectedCards.has(index)) {
                this.state.selectedCards.delete(index);
                card.classList.remove('selected');
                checkbox.className = 'ph ph-square';
            } else {
                this.state.selectedCards.add(index);
                card.classList.add('selected');
                checkbox.className = 'ph ph-check-square';
            }
        },

        selectAllHazards: function () {
            const cards = document.querySelectorAll('.hazard-card');
            cards.forEach((card, index) => {
                const checkbox = card.querySelector('.card-checkbox i');
                this.state.selectedCards.add(index);
                card.classList.add('selected');
                checkbox.className = 'ph ph-check-square';
            });
        },

        insertToForm: function () {
            if (this.state.selectedCards.size === 0) {
                alert('请先选择要插入的隐患分析结果');
                return;
            }

            // 如果提供了自定义回调，使用自定义逻辑
            if (this.config.onInsertToForm) {
                const selectedResults = [];
                this.state.selectedCards.forEach(index => {
                    const result = this.state.analysisResults[index];
                    if (result) selectedResults.push(result);
                });
                this.config.onInsertToForm(selectedResults);
                return;
            }

            // 默认插入逻辑（示例）
            alert('已选择 ' + this.state.selectedCards.size + ' 个隐患，请在配置中提供 onInsertToForm 回调函数来处理插入逻辑');
        },

        // ==================== 粒子特效 ====================
        createParticleEffect: function (sourceElement) {
            const rect = sourceElement.getBoundingClientRect();
            const startX = rect.left + rect.width / 2;
            const startY = rect.top + rect.height / 2;

            const endX = window.innerWidth - 40;
            const endY = window.innerHeight - 40;

            const container = document.createElement('div');
            container.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 9999;
            `;
            document.body.appendChild(container);

            const particleCount = 20;
            const colors = ['#8B5CF6', '#3B82F6', '#A78BFA', '#60A5FA', '#C4B5FD'];

            for (let i = 0; i < particleCount; i++) {
                const particle = document.createElement('div');
                const size = Math.random() * 8 + 4;
                const color = colors[Math.floor(Math.random() * colors.length)];
                const delay = i * 30;

                const offsetX = (Math.random() - 0.5) * 60;
                const offsetY = (Math.random() - 0.5) * 60;

                particle.style.cssText = `
                    position: absolute;
                    left: ${startX}px;
                    top: ${startY}px;
                    width: ${size}px;
                    height: ${size}px;
                    background: ${color};
                    border-radius: 50%;
                    box-shadow: 0 0 ${size}px ${color};
                    opacity: 1;
                    transform: translate(-50%, -50%);
                `;

                container.appendChild(particle);

                setTimeout(() => {
                    particle.style.transition = `all ${0.6 + Math.random() * 0.3}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
                    particle.style.left = `${endX + offsetX}px`;
                    particle.style.top = `${endY + offsetY}px`;
                    particle.style.opacity = '0';
                    particle.style.transform = `translate(-50%, -50%) scale(0.3)`;
                }, delay);
            }

            setTimeout(() => {
                container.remove();
            }, 1200);
        },

        // ==================== 消息操作 ====================
        toggleAudioPlay: function (msgId) {
            const msg = document.getElementById(msgId);
            const btn = document.querySelector(`[data-msg-id="${msgId}"]`);

            if (!msg || !btn) return;

            // 如果正在播放,则暂停
            if (this.state.audioPlaying[msgId]) {
                speechSynthesis.cancel();
                delete this.state.audioPlaying[msgId];
                btn.classList.remove('playing');
                btn.querySelector('i').className = 'ph ph-speaker-high';
                return;
            }

            // 停止其他正在播放的音频
            Object.keys(this.state.audioPlaying).forEach(id => {
                const otherBtn = document.querySelector(`[data-msg-id="${id}"]`);
                if (otherBtn) {
                    otherBtn.classList.remove('playing');
                    otherBtn.querySelector('i').className = 'ph ph-speaker-high';
                }
            });
            speechSynthesis.cancel();
            this.state.audioPlaying = {};

            // 开始播放
            const text = msg.innerText;
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = 'zh-CN';

                utterance.onstart = () => {
                    btn.classList.add('playing');
                    btn.querySelector('i').className = 'ph ph-pause';
                };

                utterance.onend = () => {
                    btn.classList.remove('playing');
                    btn.querySelector('i').className = 'ph ph-speaker-high';
                    delete this.state.audioPlaying[msgId];
                };

                utterance.onerror = () => {
                    btn.classList.remove('playing');
                    btn.querySelector('i').className = 'ph ph-speaker-high';
                    delete this.state.audioPlaying[msgId];
                };

                this.state.audioPlaying[msgId] = utterance;
                speechSynthesis.speak(utterance);
            } else {
                alert('您的浏览器不支持语音播放');
            }
        },

        playAudio: function (msgId) {
            // 保留旧方法以兼容
            this.toggleAudioPlay(msgId);
        },

        copyMessage: function (msgId) {
            const msg = document.getElementById(msgId);
            if (msg) {
                const text = msg.innerText;
                navigator.clipboard.writeText(text).then(() => {
                    alert('已复制到剪贴板');
                }).catch(() => {
                    alert('复制失败');
                });
            }
        },

        likeMessage: function (msgId) {
            const btn = document.querySelector(`#${msgId}`).parentElement.querySelector('.ph-thumbs-up');
            if (btn) {
                btn.classList.toggle('ph-fill');
                if (btn.classList.contains('ph-fill')) {
                    btn.style.color = 'var(--ai-primary-blue)';
                    alert('感谢您的反馈！');
                } else {
                    btn.style.color = '';
                }
            }
        },

        dislikeMessage: function (msgId) {
            const btn = document.querySelector(`#${msgId}`).parentElement.querySelector('.ph-thumbs-down');
            if (btn) {
                btn.classList.toggle('ph-fill');
                if (btn.classList.contains('ph-fill')) {
                    btn.style.color = '#ff4d4f';
                    alert('感谢您的反馈，我们会继续改进');
                } else {
                    btn.style.color = '';
                }
            }
        },

        shareMessage: function (msgId) {
            const msg = document.getElementById(msgId);
            if (msg) {
                const text = msg.innerText;
                if (navigator.share) {
                    navigator.share({
                        title: 'AI助手分析结果',
                        text: text
                    });
                } else {
                    navigator.clipboard.writeText(text).then(() => {
                        alert('内容已复制，可粘贴转发');
                    });
                }
            }
        },

        regenerateMessage: function (msgId) {
            const messageElement = document.getElementById(msgId);
            if (!messageElement) return;

            const chatMessage = messageElement.closest('.chat-message');
            if (!chatMessage) return;

            // 移除旧的操作按钮和建议
            const oldTimestamp = chatMessage.querySelector('.message-timestamp');
            const oldActions = chatMessage.querySelector('.message-actions');
            const oldSuggestions = chatMessage.querySelector('.message-suggestions');
            if (oldTimestamp) oldTimestamp.remove();
            if (oldActions) oldActions.remove();
            if (oldSuggestions) oldSuggestions.remove();

            // 保存原始内容（用于提取上下文）
            const originalText = messageElement.textContent || messageElement.innerText;

            // 显示重新生成中的提示
            messageElement.innerHTML = '<div class="analyzing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span> 正在重新生成...</div>';

            // 模拟重新生成
            setTimeout(() => {
                // 清空消息元素
                messageElement.innerHTML = '';

                // 重新生成内容（这里可以根据实际需求调用API）
                const newContent = '收到您的消息，让我重新为您分析一下。有什么可以帮助您的吗？';

                // 使用流式输出重新显示
                this.typeText(newContent, messageElement, () => {
                    // 重新生成时间戳
                    const timestamp = this.formatTimestamp(new Date());
                    const timestampDiv = document.createElement('div');
                    timestampDiv.className = 'message-timestamp';
                    timestampDiv.textContent = timestamp;
                    chatMessage.appendChild(timestampDiv);

                    // 重新生成操作按钮
                    const actionsDiv = document.createElement('div');
                    actionsDiv.className = 'message-actions';
                    actionsDiv.innerHTML = `
                        <span class="action-btn" data-msg-id="${msgId}" onclick="AIAssistant.toggleAudioPlay('${msgId}')" title="语音播放">
                            <i class="ph ph-speaker-high"></i>
                        </span>
                        <span class="action-btn" onclick="AIAssistant.copyMessage('${msgId}')" title="复制">
                            <i class="ph ph-copy"></i>
                        </span>
                        <span class="action-btn" onclick="AIAssistant.likeMessage('${msgId}')" title="点赞">
                            <i class="ph ph-thumbs-up"></i>
                        </span>
                        <span class="action-btn" onclick="AIAssistant.dislikeMessage('${msgId}')" title="踩">
                            <i class="ph ph-thumbs-down"></i>
                        </span>
                        <span class="action-btn" onclick="AIAssistant.regenerateMessage('${msgId}')" title="重新生成">
                            <i class="ph ph-arrow-clockwise"></i>
                        </span>
                    `;
                    chatMessage.appendChild(actionsDiv);

                    // 重新生成建议
                    const suggestions = this.generateSuggestions(originalText);
                    if (suggestions && suggestions.length > 0) {
                        const suggestionsDiv = document.createElement('div');
                        suggestionsDiv.className = 'message-suggestions';
                        suggestions.forEach((suggestion) => {
                            const escapedText = suggestion.replace(/'/g, "\\'");
                            const suggestionItem = document.createElement('div');
                            suggestionItem.className = 'suggestion-item stream-item';
                            suggestionItem.onclick = () => this.selectSuggestion(escapedText);
                            suggestionItem.innerHTML = `
                                <span>${suggestion}</span>
                                <i class="ph ph-arrow-right"></i>
                            `;
                            suggestionsDiv.appendChild(suggestionItem);
                        });
                        chatMessage.appendChild(suggestionsDiv);
                    }

                    this.scrollToBottom();
                });
            }, 1000);
        },

        formatTimestamp: function (date) {
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const day = String(date.getDate()).padStart(2, '0');
            const hours = String(date.getHours()).padStart(2, '0');
            const minutes = String(date.getMinutes()).padStart(2, '0');
            return `${year}-${month}-${day} ${hours}:${minutes}`;
        },

        // 更新对话标题显示
        updateConversationTitle: function (title) {
            const titleEl = document.getElementById('aiConversationTitle');
            if (titleEl) {
                titleEl.textContent = title || '新对话';
            }
        },

        // 生成建议操作
        generateSuggestions: function (context) {
            // 根据上下文生成建议，这里提供一些默认建议
            const defaultSuggestions = [
                '如何进行安全隐患排查？',
                '企业需要哪些安全生产资质？',
                '如何制定应急预案？'
            ];

            // 可以根据不同的上下文返回不同的建议
            if (context && context.includes('隐患')) {
                return [
                    '如何整改这些隐患？',
                    '隐患整改需要多长时间？',
                    '如何预防类似隐患？'
                ];
            } else if (context && context.includes('资质')) {
                return [
                    '资质证照如何办理？',
                    '资质证照有效期是多久？',
                    '资质证照过期如何处理？'
                ];
            } else if (context && context.includes('培训')) {
                return [
                    '安全培训的内容有哪些？',
                    '培训频率是多久一次？',
                    '如何评估培训效果？'
                ];
            }

            return defaultSuggestions;
        },

        // 选择建议
        selectSuggestion: function (suggestionText) {
            const textarea = document.querySelector('.ai-input-area textarea');
            if (textarea) {
                textarea.value = suggestionText;
                this.updateSendButtonState();
                // 自动发送
                this.sendMessage();
            }
        },

        // ==================== 辅助函数 ====================
        scrollToBottom: function () {
            const chatBody = document.getElementById('aiChatBody');
            if (chatBody) {
                setTimeout(() => {
                    chatBody.scrollTop = chatBody.scrollHeight;
                }, 50);
            }
        },

        handleEnterKey: function (event) {
            if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                this.sendMessage();
            }
        },

        handleChatScroll: function () {
            const chatBody = document.getElementById('aiChatBody');
            const header = document.querySelector('.ai-header');

            if (chatBody && header) {
                if (chatBody.scrollTop > 10) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            }
        },

        // ==================== 历史对话功能 ====================
        // 加载历史对话
        loadConversations: function () {
            try {
                const data = localStorage.getItem('ai_conversations');
                if (data) {
                    const parsed = JSON.parse(data);
                    this.state.conversations = parsed.conversations || [];
                    this.state.currentConversationId = parsed.currentConversationId || null;

                    // 如果有当前对话，加载它
                    if (this.state.currentConversationId) {
                        this.loadConversation(this.state.currentConversationId);
                    } else {
                        // 没有当前对话，显示"新对话"
                        this.updateConversationTitle('新对话');
                    }
                }
            } catch (e) {
                console.error('加载历史对话失败:', e);
                this.state.conversations = [];
                this.updateConversationTitle('新对话');
            }
        },

        // 保存历史对话到 localStorage
        saveConversations: function () {
            try {
                const data = {
                    conversations: this.state.conversations,
                    currentConversationId: this.state.currentConversationId
                };
                localStorage.setItem('ai_conversations', JSON.stringify(data));
            } catch (e) {
                console.error('保存历史对话失败:', e);
            }
        },

        // 获取当前对话的消息
        getCurrentMessages: function () {
            const chatBody = document.getElementById('aiChatBody');
            if (!chatBody) return [];

            const messages = [];
            const messageElements = chatBody.querySelectorAll('.chat-message');

            messageElements.forEach(el => {
                const isAI = el.classList.contains('ai');
                const isUser = el.classList.contains('user');
                const contentEl = el.querySelector('.message-content, .user-text-bubble');

                if (contentEl) {
                    messages.push({
                        type: isAI ? 'ai' : 'user',
                        content: contentEl.innerHTML,
                        timestamp: new Date().toISOString()
                    });
                }
            });

            return messages;
        },

        // 保存当前对话
        saveCurrentConversation: function () {
            const messages = this.getCurrentMessages();
            if (messages.length === 0) return;

            // 检查是否有用户消息，如果没有用户消息则不保存
            const hasUserMessage = messages.some(m => m.type === 'user');
            if (!hasUserMessage) return;

            const now = new Date();
            const timestamp = this.formatTimestamp(now);

            if (this.state.currentConversationId) {
                // 更新现有对话
                const conv = this.state.conversations.find(c => c.id === this.state.currentConversationId);
                if (conv) {
                    conv.messages = messages;
                    conv.updatedAt = timestamp;
                    // 更新标题显示
                    this.updateConversationTitle(conv.title);
                }
            } else {
                // 创建新对话
                const title = this.generateConversationTitle(messages);
                const newConv = {
                    id: 'conv_' + Date.now(),
                    title: title,
                    createdAt: timestamp,
                    updatedAt: timestamp,
                    messages: messages
                };

                this.state.conversations.unshift(newConv);
                this.state.currentConversationId = newConv.id;

                // 立即更新标题显示
                this.updateConversationTitle(title);

                // 限制最多20条
                if (this.state.conversations.length > 20) {
                    this.state.conversations = this.state.conversations.slice(0, 20);
                }
            }

            this.saveConversations();
        },

        // 生成对话标题
        generateConversationTitle: function (messages) {
            // 找到第一条用户消息
            const firstUserMsg = messages.find(m => m.type === 'user');
            if (firstUserMsg) {
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = firstUserMsg.content;
                const text = tempDiv.textContent || tempDiv.innerText || '';
                const title = text.trim().substring(0, 20);
                return title || '新对话';
            }
            return '新对话 - ' + this.formatTimestamp(new Date());
        },

        // 加载指定对话
        loadConversation: function (conversationId) {
            const conv = this.state.conversations.find(c => c.id === conversationId);
            if (!conv) return;

            this.state.currentConversationId = conversationId;
            const chatBody = document.getElementById('aiChatBody');
            if (!chatBody) return;

            // 更新标题显示
            this.updateConversationTitle(conv.title);

            // 清空当前消息
            chatBody.innerHTML = '';

            // 加载历史消息
            conv.messages.forEach(msg => {
                const messageDiv = document.createElement('div');
                messageDiv.className = 'chat-message ' + msg.type;
                messageDiv.innerHTML = `<div class="message-content">${msg.content}</div>`;
                chatBody.appendChild(messageDiv);
            });

            this.scrollToBottom();
        },

        // 切换历史面板
        toggleHistoryPanel: function () {
            const panel = document.getElementById('historyPanel');
            if (!panel) return;

            const isActive = panel.classList.toggle('active');

            if (isActive) {
                // 保存当前对话
                this.saveCurrentConversation();
                // 渲染历史列表
                this.renderHistoryList();
            }
        },

        // 渲染历史列表
        renderHistoryList: function (filterText) {
            const listContainer = document.getElementById('historyList');
            if (!listContainer) return;

            let conversations = this.state.conversations;

            // 搜索过滤
            if (filterText) {
                conversations = conversations.filter(c =>
                    c.title.toLowerCase().includes(filterText.toLowerCase())
                );
            }

            if (conversations.length === 0) {
                listContainer.innerHTML = `
                    <div class="history-empty">
                        <i class="ph ph-chat-circle-dots"></i>
                        <p>${filterText ? '未找到匹配的对话' : '暂无历史对话'}</p>
                    </div>
                `;
                return;
            }

            listContainer.innerHTML = conversations.map(conv => `
                <div class="history-item" data-id="${conv.id}">
                    <div class="history-item-title" onclick="AIAssistant.selectConversation('${conv.id}')">${conv.title}</div>
                    <div class="history-item-actions">
                        <i class="ph ph-pencil-simple history-item-btn" onclick="event.stopPropagation(); AIAssistant.editConversationTitle('${conv.id}')" title="重命名"></i>
                        <i class="ph ph-trash history-item-btn delete" onclick="event.stopPropagation(); AIAssistant.deleteConversation('${conv.id}')" title="删除"></i>
                    </div>
                </div>
            `).join('');
        },

        // 搜索历史对话
        searchHistory: function (text) {
            this.renderHistoryList(text);
        },

        // 选择对话
        selectConversation: function (conversationId) {
            this.loadConversation(conversationId);
            this.toggleHistoryPanel();
        },

        // 编辑对话标题
        editConversationTitle: function (conversationId) {
            const conv = this.state.conversations.find(c => c.id === conversationId);
            if (!conv) return;

            const item = document.querySelector(`.history-item[data-id="${conversationId}"]`);
            if (!item) return;

            const titleEl = item.querySelector('.history-item-title');
            const currentTitle = conv.title;

            item.classList.add('editing');
            titleEl.innerHTML = `<input type="text" class="history-item-title-input" value="${currentTitle}" />`;

            const input = titleEl.querySelector('input');
            input.focus();
            input.select();

            const saveTitle = () => {
                const newTitle = input.value.trim();
                if (newTitle && newTitle !== currentTitle) {
                    conv.title = newTitle;
                    this.saveConversations();

                    // 如果是当前对话，更新 header 标题
                    if (this.state.currentConversationId === conversationId) {
                        this.updateConversationTitle(newTitle);
                    }
                }
                item.classList.remove('editing');
                this.renderHistoryList();
            };

            input.onblur = saveTitle;
            input.onkeydown = (e) => {
                if (e.key === 'Enter') {
                    saveTitle();
                } else if (e.key === 'Escape') {
                    item.classList.remove('editing');
                    this.renderHistoryList();
                }
            };
        },

        // 删除对话
        deleteConversation: function (conversationId) {
            if (!confirm('确定要删除这条对话吗？')) return;

            this.state.conversations = this.state.conversations.filter(c => c.id !== conversationId);

            // 如果删除的是当前对话，清空当前对话ID
            if (this.state.currentConversationId === conversationId) {
                this.state.currentConversationId = null;
            }

            this.saveConversations();
            this.renderHistoryList();
        },

        // 开始新对话（重写）
        startNewConversation: function () {
            // 保存当前对话
            this.saveCurrentConversation();

            // 清空当前对话ID
            this.state.currentConversationId = null;

            // 重置标题为"新对话"
            this.updateConversationTitle('新对话');

            // 清空聊天区域
            const chatBody = document.getElementById('aiChatBody');
            chatBody.innerHTML = `
                <div class="chat-message ai">
                    <div class="message-content">
                        <p class="chat-text">${this.config.welcomeMessage.replace('{userName}', this.config.userName)}</p>
                    </div>
                </div>
            `;

            // 清空输入和状态
            this.state.pendingImages = [];
            this.state.selectedCards.clear();
            this.state.analysisResults = [];
            this.updateImagePreview();

            const textarea = document.querySelector('.ai-input-area textarea');
            if (textarea) textarea.value = '';

            this.updateSendButtonState();
        }
    };

    // 暴露全局函数用于HTML onclick
    window.toggleAI = function () {
        window.AIAssistant.toggleAI();
    };

    window.closeModal = function () {
        const modal = document.getElementById('aiModal');
        if (modal) modal.style.display = 'none';
    };

})();
