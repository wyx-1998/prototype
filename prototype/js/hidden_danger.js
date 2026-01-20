/**
 * 隐患排查页面 - AI助手对话交互逻辑
 * 实现功能：
 * 1. AI助手侧边栏的展开/收起
 * 2. 消息发送和接收
 * 3. 图片上传和预览
 * 4. AI分析模拟
 * 5. 隐患分析卡片交互
 * 6. 将分析结果插入表单
 */

// ==================== 全局状态 ====================
const chatState = {
    pendingImages: [], // 待发送的图片
    selectedCards: new Set(), // 已选中的分析卡片索引
    isAnalyzing: false, // AI是否正在分析
    analysisResults: [] // 当前分析结果
};

// ==================== 粒子特效 ====================

/**
 * 创建粒子特效 - 从元素位置发射粒子飞向屏幕右下角
 * @param {HTMLElement} sourceElement - 触发特效的元素
 */
function createParticleEffect(sourceElement) {
    const rect = sourceElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // 目标位置：屏幕右下角（AI浮动按钮位置）
    const endX = window.innerWidth - 40;
    const endY = window.innerHeight - 40;

    // 创建粒子容器
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

    // 粒子数量和颜色
    const particleCount = 20;
    const colors = ['#8B5CF6', '#3B82F6', '#A78BFA', '#60A5FA', '#C4B5FD'];

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        const size = Math.random() * 8 + 4; // 4-12px
        const color = colors[Math.floor(Math.random() * colors.length)];
        const delay = i * 30; // 错开发射时间

        // 随机偏移量
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

        // 动画
        setTimeout(() => {
            particle.style.transition = `all ${0.6 + Math.random() * 0.3}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
            particle.style.left = `${endX + offsetX}px`;
            particle.style.top = `${endY + offsetY}px`;
            particle.style.opacity = '0';
            particle.style.transform = `translate(-50%, -50%) scale(0.3)`;
        }, delay);
    }

    // 清理容器
    setTimeout(() => {
        container.remove();
    }, 1200);
}

// ==================== AI侧边栏控制 ====================

/**
 * 切换AI助手侧边栏的显示/隐藏
 */
function toggleAI() {
    const sidebar = document.getElementById('aiSidebar');
    const floatingBtn = document.querySelector('.ai-floating-btn');

    if (sidebar.classList.contains('active')) {
        // 收起侧边栏
        sidebar.classList.remove('active');
        floatingBtn.classList.remove('hidden');
    } else {
        // 展开侧边栏
        sidebar.classList.add('active');
        floatingBtn.classList.add('hidden');
        scrollToBottom();
    }
}

/**
 * 开始新对话
 */
function startNewConversation() {
    const chatBody = document.getElementById('aiChatBody');
    // 清空聊天记录，只保留欢迎语
    chatBody.innerHTML = `
        <div class="chat-message ai">
            <div class="message-content">
                <p class="chat-text">您好，管理员！我是您的安全生产AI助手</p>
            </div>
        </div>
    `;
    // 清空待发送图片
    chatState.pendingImages = [];
    chatState.selectedCards.clear();
    chatState.analysisResults = [];
    updateImagePreview();
    // 清空输入框
    const textarea = document.querySelector('.ai-input-area textarea');
    if (textarea) textarea.value = '';
}

// ==================== 弹窗控制 ====================

/**
 * 关闭AI识别弹窗
 */
function closeModal() {
    const modal = document.getElementById('aiModal');
    if (modal) modal.style.display = 'none';
}

/**
 * 开始AI识别（从弹窗触发）
 */
function startRecognition() {
    closeModal();

    // 展开AI侧边栏
    const sidebar = document.getElementById('aiSidebar');
    const floatingBtn = document.querySelector('.ai-floating-btn');
    sidebar.classList.add('active');
    floatingBtn.classList.add('hidden');

    // 获取用户实际上传的照片
    let uploadedImages = [];

    // 从Element Plus上传组件获取图片
    const uploadListItems = document.querySelectorAll('#photoUploadApp .el-upload-list__item');
    uploadListItems.forEach(item => {
        const img = item.querySelector('img');
        if (img && img.src) {
            uploadedImages.push(img.src);
        }
    });

    // 如果没有获取到图片，尝试从预览区域获取
    if (uploadedImages.length === 0) {
        const previewImages = document.querySelectorAll('.el-upload-list--picture-card .el-upload-list__item-thumbnail');
        previewImages.forEach(img => {
            if (img.src) {
                uploadedImages.push(img.src);
            }
        });
    }

    // 自动发送消息进行隐患识别
    setTimeout(() => {
        addUserMessage('识别图中存在的隐患和整改建议', uploadedImages, true);
        simulateAIAnalysis();
    }, 300);
}

// ==================== 消息处理 ====================

/**
 * 发送消息
 */
function sendMessage() {
    const textarea = document.querySelector('.ai-input-area textarea');
    const text = textarea.value.trim();
    const hasImages = chatState.pendingImages.length > 0;

    if (!text && !hasImages) return;

    // 检查是否是隐患识别请求
    const isHazardRequest = text.includes('隐患') || text.includes('识别') || text.includes('照片');

    // 添加用户消息
    addUserMessage(text, [...chatState.pendingImages], isHazardRequest);

    // 清空输入
    textarea.value = '';
    chatState.pendingImages = [];
    updateImagePreview();

    // 如果是隐患识别请求且有图片，模拟AI分析
    if (isHazardRequest && hasImages) {
        simulateAIAnalysis();
    } else {
        // 普通回复
        setTimeout(() => {
            addAIMessage('收到您的消息，有什么可以帮助您的吗？');
        }, 500);
    }
}

/**
 * 添加用户消息到聊天区域
 * @param {string} text - 文本内容
 * @param {Array} images - 图片URL数组
 * @param {boolean} isHazardRequest - 是否是隐患识别请求
 */
function addUserMessage(text, images = [], isHazardRequest = false) {
    const chatBody = document.getElementById('aiChatBody');

    // 创建用户消息容器
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';

    let contentHTML = '<div class="message-content">';

    // 如果有图片，添加图片展示区
    if (images.length > 0) {
        contentHTML += '<div class="user-images-scroll">';
        images.forEach(img => {
            const imgSrc = typeof img === 'string' ? img : img.url || img;
            contentHTML += `<img src="${imgSrc}" alt="上传图片" onclick="previewFullImage('${imgSrc}')">`;
        });
        contentHTML += '</div>';
    }

    // 添加文本内容
    if (text) {
        contentHTML += '<div class="user-text-bubble">';
        if (isHazardRequest) {
            contentHTML += '<span class="skill-tag">隐患识别</span> ';
        }
        contentHTML += text;
        contentHTML += '</div>';
    }

    contentHTML += '</div>';
    messageDiv.innerHTML = contentHTML;

    chatBody.appendChild(messageDiv);
    scrollToBottom();
}

/**
 * 添加AI消息到聊天区域
 * @param {string} content - HTML内容
 * @param {boolean} showActions - 是否显示操作按钮，默认true
 */
function addAIMessage(content, showActions = true) {
    const chatBody = document.getElementById('aiChatBody');

    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message ai';

    // 生成唯一ID用于操作
    const msgId = 'ai-msg-' + Date.now();

    let actionsHTML = '';
    if (showActions && !content.includes('analyzing-indicator')) {
        actionsHTML = `
            <div class="message-actions">
                <span class="action-btn" onclick="playAudio('${msgId}')" title="语音播放">
                    <i class="ph ph-speaker-high"></i>
                </span>
                <span class="action-btn" onclick="copyMessage('${msgId}')" title="复制">
                    <i class="ph ph-copy"></i>
                </span>
                <span class="action-btn" onclick="likeMessage('${msgId}')" title="点赞">
                    <i class="ph ph-thumbs-up"></i>
                </span>
                <span class="action-btn" onclick="dislikeMessage('${msgId}')" title="踩">
                    <i class="ph ph-thumbs-down"></i>
                </span>
                <span class="action-btn" onclick="shareMessage('${msgId}')" title="转发">
                    <i class="ph ph-share-network"></i>
                </span>
            </div>
        `;
    }

    messageDiv.innerHTML = `
        <div class="message-content" id="${msgId}">
            ${content}
        </div>
        ${actionsHTML}
    `;

    chatBody.appendChild(messageDiv);
    scrollToBottom();
}

// ==================== 图片处理 ====================

/**
 * 处理图片上传（对话框内）
 */
function handleChatImageUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/jpeg,image/png';
    input.multiple = true;

    input.onchange = (e) => {
        const files = Array.from(e.target.files);
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (readerEvent) => {
                if (chatState.pendingImages.length < 5) {
                    chatState.pendingImages.push({
                        url: readerEvent.target.result,
                        name: file.name
                    });
                    updateImagePreview();
                }
            };
            reader.readAsDataURL(file);
        });
    };

    input.click();
}

/**
 * 更新图片预览区域
 */
function updateImagePreview() {
    let previewArea = document.querySelector('.chat-image-preview');

    if (chatState.pendingImages.length === 0) {
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

    previewArea.innerHTML = chatState.pendingImages.map((img, index) => `
        <div class="preview-image-item">
            <img src="${img.url}" alt="${img.name}" onclick="previewFullImage('${img.url}')">
            <span class="remove-preview" onclick="removePreviewImage(${index})">
                <i class="ph ph-x"></i>
            </span>
        </div>
    `).join('');
}

/**
 * 移除待发送的预览图片
 * @param {number} index - 图片索引
 */
function removePreviewImage(index) {
    chatState.pendingImages.splice(index, 1);
    updateImagePreview();
}

/**
 * 全屏预览图片
 * @param {string} src - 图片URL
 */
function previewFullImage(src) {
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
    overlay.onclick = (e) => {
        if (e.target === overlay) overlay.remove();
    };
    document.body.appendChild(overlay);
}

// ==================== AI分析 ====================

/**
 * 模拟AI分析过程
 */
function simulateAIAnalysis() {
    chatState.isAnalyzing = true;

    // 显示加载动画
    addAIMessage('<div class="analyzing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span> 正在分析中...</div>');

    // 模拟分析时间 2-3秒
    setTimeout(() => {
        // 移除加载动画
        const analyzing = document.querySelector('.analyzing-indicator');
        if (analyzing) {
            analyzing.closest('.chat-message').remove();
        }

        // 显示分析结果
        showAnalysisResults();
        chatState.isAnalyzing = false;
    }, 2500);
}

/**
 * 显示分析结果
 */
function showAnalysisResults() {
    // 模拟的分析结果数据
    chatState.analysisResults = [
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

    // 构建卡片HTML - 添加总起文字
    let cardsHTML = '<div class="analysis-results">';
    cardsHTML += '<p class="chat-text analysis-intro">这张图片显示了一些电线和管道的布局，可能存在一些安全隐患。以下是一些可能的隐患：</p>';

    chatState.analysisResults.forEach((result, index) => {
        cardsHTML += `
            <div class="hazard-card" data-index="${index}" onclick="toggleCardSelection(${index})">
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
        <button class="btn btn-primary insert-btn" onclick="event.stopPropagation(); insertToForm()">
            <i class="ph ph-file-arrow-down"></i> 插入问题登记表
        </button>
    </div>`;

    addAIMessage(cardsHTML);
}

/**
 * 切换卡片选中状态
 * @param {number} index - 卡片索引
 */
function toggleCardSelection(index) {
    const card = document.querySelector(`.hazard-card[data-index="${index}"]`);
    const checkbox = card.querySelector('.card-checkbox i');

    if (chatState.selectedCards.has(index)) {
        chatState.selectedCards.delete(index);
        card.classList.remove('selected');
        checkbox.className = 'ph ph-square';
    } else {
        chatState.selectedCards.add(index);
        card.classList.add('selected');
        checkbox.className = 'ph ph-check-square';
    }
}

/**
 * 将选中的分析结果插入到表单
 */
function insertToForm() {
    if (chatState.selectedCards.size === 0) {
        ElementPlus.ElMessage.warning('请先选择要插入的隐患分析结果');
        return;
    }

    // 收集选中的内容
    const descriptions = [];
    const measures = [];

    chatState.selectedCards.forEach(index => {
        const result = chatState.analysisResults[index];
        if (result) {
            descriptions.push(`【${result.name}】${result.description}`);
            // 只插入整改措施，不插入法规依据
            measures.push(`【${result.name}】${result.measure}`);
        }
    });

    // 获取表单字段
    const descTextarea = document.querySelector('.form-group.full-width .textarea-wrapper textarea');
    const measureTextarea = document.querySelectorAll('.form-group.full-width .textarea-wrapper textarea')[1];

    // 插入内容
    if (descTextarea) {
        descTextarea.value = descriptions.join('\n\n');
        // 更新字数统计
        const charCount = descTextarea.parentElement.querySelector('.char-count');
        if (charCount) charCount.textContent = `${descTextarea.value.length}/200`;
    }

    if (measureTextarea) {
        measureTextarea.value = measures.join('\n\n');
        // 更新字数统计
        const charCount = measureTextarea.parentElement.querySelector('.char-count');
        if (charCount) charCount.textContent = `${measureTextarea.value.length}/200`;
    }

    ElementPlus.ElMessage.success('已成功插入到问题登记表');
}

// ==================== 辅助函数 ====================

/**
 * 滚动聊天区域到底部
 */
function scrollToBottom() {
    const chatBody = document.getElementById('aiChatBody');
    if (chatBody) {
        setTimeout(() => {
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 50);
    }
}

/**
 * 处理Enter键发送
 * @param {KeyboardEvent} event - 键盘事件
 */
function handleEnterKey(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

/**
 * 处理滚动时的标题栏阴影
 */
function handleChatScroll() {
    const chatBody = document.getElementById('aiChatBody');
    const header = document.querySelector('.ai-header');

    if (chatBody && header) {
        if (chatBody.scrollTop > 10) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
}

// ==================== 消息操作按钮 ====================

/**
 * 语音播放
 * @param {string} msgId - 消息ID
 */
function playAudio(msgId) {
    const msg = document.getElementById(msgId);
    if (msg) {
        const text = msg.innerText;
        // 使用Web Speech API进行语音播放
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = 'zh-CN';
            speechSynthesis.speak(utterance);
            ElementPlus.ElMessage.success('开始语音播放');
        } else {
            ElementPlus.ElMessage.warning('您的浏览器不支持语音播放');
        }
    }
}

/**
 * 复制消息内容
 * @param {string} msgId - 消息ID
 */
function copyMessage(msgId) {
    const msg = document.getElementById(msgId);
    if (msg) {
        const text = msg.innerText;
        navigator.clipboard.writeText(text).then(() => {
            ElementPlus.ElMessage.success('已复制到剪贴板');
        }).catch(() => {
            ElementPlus.ElMessage.error('复制失败');
        });
    }
}

/**
 * 点赞消息
 * @param {string} msgId - 消息ID
 */
function likeMessage(msgId) {
    const btn = document.querySelector(`#${msgId}`).parentElement.querySelector('.ph-thumbs-up');
    if (btn) {
        btn.classList.toggle('ph-fill');
        if (btn.classList.contains('ph-fill')) {
            btn.style.color = 'var(--primary-blue)';
            ElementPlus.ElMessage.success('感谢您的反馈！');
        } else {
            btn.style.color = '';
        }
    }
}

/**
 * 踩消息
 * @param {string} msgId - 消息ID
 */
function dislikeMessage(msgId) {
    const btn = document.querySelector(`#${msgId}`).parentElement.querySelector('.ph-thumbs-down');
    if (btn) {
        btn.classList.toggle('ph-fill');
        if (btn.classList.contains('ph-fill')) {
            btn.style.color = '#ff4d4f';
            ElementPlus.ElMessage.info('感谢您的反馈，我们会继续改进');
        } else {
            btn.style.color = '';
        }
    }
}

/**
 * 转发消息
 * @param {string} msgId - 消息ID
 */
function shareMessage(msgId) {
    const msg = document.getElementById(msgId);
    if (msg) {
        const text = msg.innerText;
        // 模拟转发功能
        if (navigator.share) {
            navigator.share({
                title: 'AI助手分析结果',
                text: text
            });
        } else {
            // 复制到剪贴板作为替代
            navigator.clipboard.writeText(text).then(() => {
                ElementPlus.ElMessage.success('内容已复制，可粘贴转发');
            });
        }
    }
}

/**
 * 重新生成消息
 * @param {string} msgId - 消息ID
 */
function regenerateMessage(msgId) {
    ElementPlus.ElMessage.info('正在重新生成...');
    // 模拟重新生成
    setTimeout(() => {
        ElementPlus.ElMessage.success('已重新生成');
    }, 1000);
}

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', function () {
    // 绑定发送按钮点击事件
    const sendBtn = document.querySelector('.btn-send');
    if (sendBtn) {
        sendBtn.onclick = sendMessage;
    }

    // 绑定输入框Enter键事件
    const textarea = document.querySelector('.ai-input-area textarea');
    if (textarea) {
        textarea.onkeydown = handleEnterKey;
    }

    // 绑定图片上传按钮
    const imageBtn = document.querySelector('.input-toolbar .ph-image');
    if (imageBtn) {
        imageBtn.onclick = handleChatImageUpload;
        imageBtn.style.cursor = 'pointer';
    }

    // 绑定附件上传按钮 (暂时同图片上传)
    const attachBtn = document.querySelector('.input-toolbar .ph-paperclip');
    if (attachBtn) {
        attachBtn.onclick = handleChatImageUpload;
        attachBtn.style.cursor = 'pointer';
    }

    // 绑定新对话按钮
    const newChatBtn = document.querySelector('.ai-controls .ph-chat-circle-plus');
    if (newChatBtn) {
        newChatBtn.onclick = startNewConversation;
        newChatBtn.style.cursor = 'pointer';
    }

    // 绑定滚动事件
    const chatBody = document.getElementById('aiChatBody');
    if (chatBody) {
        chatBody.onscroll = handleChatScroll;
    }

    console.log('AI助手交互初始化完成');
});
