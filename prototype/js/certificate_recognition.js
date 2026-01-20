/**
 * 相关方证照识别页面 - AI助手对话交互逻辑
 * 实现功能:
 * 1. AI助手侧边栏的展开/收起
 * 2. 消息发送和接收
 * 3. 证照文件上传和预览
 * 4. AI证照识别模拟
 * 5. 将识别结果插入表单
 */

// ==================== 全局状态 ====================
const chatState = {
    pendingImages: [], // 待发送的图片
    isAnalyzing: false, // AI是否正在分析
    analysisResults: null, // 当前分析结果
    uploadedFiles: [], // 已上传的文件
    recognitionType: null, // 识别类型: 'certificate' 或 'personnel'
    personnelResults: null // 人员证件识别结果
};

// 暴露给Vue组件使用
window.chatState = chatState;

// ==================== 粒子特效 ====================

/**
 * 创建粒子特效 - 从元素位置发射粒子飞向屏幕右下角
 * @param {HTMLElement} sourceElement - 触发特效的元素
 */
function createParticleEffect(sourceElement) {
    const rect = sourceElement.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    // 目标位置:屏幕右下角(AI浮动按钮位置)
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

// 暴露给Vue组件使用
window.createParticleEffect = createParticleEffect;

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
    // 清空聊天记录,只保留欢迎语
    chatBody.innerHTML = `
        <div class="chat-message ai">
            <div class="message-content">
                <p class="chat-text">您好,张三!我是您的安全生产AI助手,请向我提问吧</p>
            </div>
        </div>
    `;
    // 清空待发送图片
    chatState.pendingImages = [];
    chatState.analysisResults = null;
    updateImagePreview();
    // 清空输入框
    const textarea = document.getElementById('aiInputTextarea');
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
 * 开始AI识别(从弹窗触发 - 企业资质附件)
 */
function startRecognition() {
    closeModal();

    // 展开AI侧边栏
    const sidebar = document.getElementById('aiSidebar');
    const floatingBtn = document.querySelector('.ai-floating-btn');
    sidebar.classList.add('active');
    floatingBtn.classList.add('hidden');

    // 获取用户实际上传的文件
    let uploadedFiles = [];

    // 从Element Plus上传组件获取文件
    if (chatState.uploadedFiles && chatState.uploadedFiles.length > 0) {
        uploadedFiles = chatState.uploadedFiles;
    }

    // 设置识别类型为企业证照
    chatState.recognitionType = 'certificate';

    // 自动发送消息进行企业证照识别
    setTimeout(() => {
        addUserMessage('请帮我识别这些企业资质证照文件中的信息', uploadedFiles, true);
        simulateAIAnalysis();
    }, 300);
}

// ==================== 消息处理 ====================

/**
 * 智能判断识别类型
 * @param {string} text - 用户输入的文字
 * @returns {string} 识别类型: 'personnel'(人员证件), 'certificate'(企业证照), 'unknown'(未知)
 */
function detectRecognitionType(text) {
    if (!text) return 'unknown';
    
    // 人员证件识别关键词
    const personnelKeywords = ['人员证件', '人员信息', '人员', '证件', '工作证', '身份证'];
    
    // 企业证照识别关键词
    const certificateKeywords = ['企业资质', '营业执照', '企业', '公司', '资质'];
    
    // 检查是否包含人员相关关键词
    const isPersonnel = personnelKeywords.some(keyword => text.includes(keyword));
    
    // 检查是否包含企业相关关键词
    const isCertificate = certificateKeywords.some(keyword => text.includes(keyword));
    
    // 如果两者都匹配，根据优先级判断（人员优先）
    if (isPersonnel && isCertificate) {
        // 检查更具体的关键词
        if (text.includes('人员证件') || text.includes('人员信息')) {
            return 'personnel';
        }
        if (text.includes('企业资质') || text.includes('营业执照')) {
            return 'certificate';
        }
        // 默认人员优先
        return 'personnel';
    }
    
    if (isPersonnel) return 'personnel';
    if (isCertificate) return 'certificate';
    
    // 如果都不匹配，检查是否是通用识别请求
    if (text.includes('识别') || text.includes('证照')) {
        // 根据当前识别类型状态判断
        if (chatState.recognitionType) {
            return chatState.recognitionType;
        }
        // 默认为证照识别
        return 'certificate';
    }
    
    return 'unknown';
}

/**
 * 发送消息
 */
function sendMessage() {
    const textarea = document.getElementById('aiInputTextarea');
    const text = textarea.value.trim();
    const hasImages = chatState.pendingImages.length > 0;

    if (!text && !hasImages) return;

    // 智能判断识别类型
    const recognitionType = detectRecognitionType(text);
    const isRecognitionRequest = recognitionType !== 'unknown';

    // 添加用户消息
    addUserMessage(text, [...chatState.pendingImages], isRecognitionRequest);

    // 清空输入
    textarea.value = '';
    chatState.pendingImages = [];
    updateImagePreview();

    // 如果是识别请求且有图片
    if (isRecognitionRequest && hasImages) {
        console.log('检测到识别类型:', recognitionType);
        
        if (recognitionType === 'personnel') {
            // 人员证件识别
            chatState.recognitionType = 'personnel';
            simulatePersonnelRecognition();
        } else if (recognitionType === 'certificate') {
            // 企业证照识别
            chatState.recognitionType = 'certificate';
            simulateAIAnalysis();
        } else {
            // 默认企业证照识别
            chatState.recognitionType = 'certificate';
            simulateAIAnalysis();
        }
    } else {
        // 普通回复
        setTimeout(() => {
            addAIMessage('收到您的消息,有什么可以帮助您的吗?');
        }, 500);
    }
}

/**
 * 添加用户消息到聊天区域
 * @param {string} text - 文本内容
 * @param {Array} images - 图片URL数组
 * @param {boolean} isCertificateRequest - 是否是证照识别请求
 */
function addUserMessage(text, images = [], isCertificateRequest = false) {
    const chatBody = document.getElementById('aiChatBody');

    // 创建用户消息容器
    const messageDiv = document.createElement('div');
    messageDiv.className = 'chat-message user';

    let contentHTML = '<div class="message-content">';

    // 如果有图片,添加图片展示区
    if (images.length > 0) {
        contentHTML += '<div class="user-images-scroll">';
        images.forEach(img => {
            const imgSrc = typeof img === 'string' ? img : img.url || img;
            contentHTML += `<img src="${imgSrc}" alt="上传文件" onclick="previewFullImage('${imgSrc}')">`;
        });
        contentHTML += '</div>';
    }

    // 添加文本内容
    if (text) {
        contentHTML += '<div class="user-text-bubble">';
        if (isCertificateRequest) {
            // 根据识别类型显示对应的Skill标签
            let skillLabel = '证照识别';
            const recognitionType = detectRecognitionType(text);
            
            if (recognitionType === 'personnel') {
                skillLabel = '人员证件识别';
            } else if (recognitionType === 'certificate') {
                skillLabel = '企业证照识别';
            }
            
            contentHTML += `<span class="skill-tag">${skillLabel}</span> `;
        }
        contentHTML += text;
        contentHTML += '</div>';
    }

    contentHTML += '</div>';
    messageDiv.innerHTML = contentHTML;

    chatBody.appendChild(messageDiv);
    scrollToBottom();
}

// 暴露给Vue组件使用
window.addUserMessage = addUserMessage;

/**
 * 添加AI消息到聊天区域
 * @param {string} content - HTML内容
 * @param {boolean} showActions - 是否显示操作按钮,默认true
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
 * 附件上传(对话框内)
 */
function attachFile() {
    handleChatImageUpload();
}

/**
 * 图片上传(对话框内)
 */
function attachImage() {
    handleChatImageUpload();
}

/**
 * 处理图片上传(对话框内)
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
    chatState.recognitionType = 'certificate'; // 标记为证照识别

    // 显示加载动画
    addAIMessage('<div class="analyzing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span> 正在识别中...</div>');

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

// 暴露给Vue组件使用
window.simulateAIAnalysis = simulateAIAnalysis;

/**
 * 显示分析结果
 */
function showAnalysisResults() {
    // 模拟的证照识别结果数据
    chatState.analysisResults = {
        creditCode: '91330122MADMNPJ3XJ',
        companyName: '杭州涵杰劳务有限公司',
        establishDate: '2024-05-30',
        legalPerson: '章望群',
        registeredCapital: '500',
        companyType: '有限责任公司(自然人独资)',
        registrationAuthority: '桐庐县市场监督管理局',
        registrationDate: '2024-05-30',
        address: '浙江省杭州市桐庐县瑶琳镇后浦村大庙',
        businessScope: '一般项目:劳务服务(不含劳务派遣),装卸搬运;包装服务;城市绿化管理;园林绿化工程施工;物业管理;人力资源服务(不含职业中介活动、劳务派遭服务)(除依法须经批准的项目外,凭营业执照依法自主开展经营活动)。'
    };

    // 构建结果展示HTML
    let resultHTML = '<div class="analysis-results">';
    resultHTML += '<div class="ai-card">';
    resultHTML += '<h4>✨ 企业营业执照识别结果</h4>';
    resultHTML += `<p><strong>统一社会信用代码:</strong> ${chatState.analysisResults.creditCode}</p>`;
    resultHTML += `<p><strong>企业名称:</strong> ${chatState.analysisResults.companyName}</p>`;
    resultHTML += `<p><strong>成立日期:</strong> ${chatState.analysisResults.establishDate}</p>`;
    resultHTML += `<p><strong>法定代表人:</strong> ${chatState.analysisResults.legalPerson}</p>`;
    resultHTML += `<p><strong>注册资本(万元):</strong> ${chatState.analysisResults.registeredCapital}</p>`;
    resultHTML += `<p><strong>类型:</strong> ${chatState.analysisResults.companyType}</p>`;
    resultHTML += `<p><strong>登记机关:</strong> ${chatState.analysisResults.registrationAuthority}</p>`;
    resultHTML += `<p><strong>登记时间:</strong> ${chatState.analysisResults.registrationDate}</p>`;
    resultHTML += `<p><strong>住所:</strong> ${chatState.analysisResults.address}</p>`;
    resultHTML += `<p><strong>经营范围:</strong> ${chatState.analysisResults.businessScope}</p>`;
    resultHTML += `
        <button class="btn btn-primary insert-btn" onclick="insertToForm()">
            <i class="ph ph-file-arrow-down"></i> 插入资质基本信息
        </button>
    `;
    resultHTML += '</div>';
    resultHTML += '</div>';

    addAIMessage(resultHTML);
}

/**
 * 将识别结果插入到表单
 */
function insertToForm() {
    if (!chatState.analysisResults) {
        ElementPlus.ElMessage.warning('没有可插入的识别结果');
        return;
    }

    const result = chatState.analysisResults;

    // 获取表单字段并填充
    const creditCode = document.getElementById('creditCode');
    const companyName = document.getElementById('companyName');
    const establishDate = document.getElementById('establishDate');
    const legalPerson = document.getElementById('legalPerson');
    const registeredCapital = document.getElementById('registeredCapital');
    const companyType = document.getElementById('companyType');
    const registrationAuthority = document.getElementById('registrationAuthority');
    const registrationDate = document.getElementById('registrationDate');
    const address = document.getElementById('address');
    const businessScope = document.getElementById('businessScope');

    // 填充数据
    if (creditCode) creditCode.value = result.creditCode;
    if (companyName) companyName.value = result.companyName;
    if (establishDate) establishDate.value = result.establishDate;
    if (legalPerson) legalPerson.value = result.legalPerson;
    if (registeredCapital) registeredCapital.value = result.registeredCapital;
    if (companyType) companyType.value = result.companyType;
    if (registrationAuthority) registrationAuthority.value = result.registrationAuthority;
    if (registrationDate) registrationDate.value = result.registrationDate;
    if (address) address.value = result.address;
    if (businessScope) {
        businessScope.value = result.businessScope;
        // 更新字数统计
        updateCharCount();
    }

    ElementPlus.ElMessage.success('已成功插入资质基本信息');
    
    // 可选:关闭AI侧边栏
    // toggleAI();
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

/**
 * 更新字符计数
 */
function updateCharCount() {
    const businessScope = document.getElementById('businessScope');
    const charCounter = document.getElementById('charCounter');
    
    if (businessScope && charCounter) {
        const length = businessScope.value.length;
        charCounter.textContent = `${length}/200`;
        
        // 如果超过限制,显示警告颜色
        if (length > 200) {
            charCounter.style.color = '#ff4d4f';
        } else {
            charCounter.style.color = '#999';
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
            ElementPlus.ElMessage.success('感谢您的反馈!');
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
            ElementPlus.ElMessage.info('感谢您的反馈,我们会继续改进');
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
                ElementPlus.ElMessage.success('内容已复制,可粘贴转发');
            });
        }
    }
}

// ==================== 人员证件识别 ====================

/**
 * 模拟人员证件AI分析过程
 */
function simulatePersonnelRecognition() {
    chatState.isAnalyzing = true;
    chatState.recognitionType = 'personnel';

    // 显示加载动画
    addAIMessage('<div class="analyzing-indicator"><span class="dot"></span><span class="dot"></span><span class="dot"></span> 正在识别人员证件信息...</div>');

    // 模拟分析时间 2-3秒
    setTimeout(() => {
        // 移除加载动画
        const analyzing = document.querySelector('.analyzing-indicator');
        if (analyzing) {
            analyzing.closest('.chat-message').remove();
        }

        // 显示人员分析结果
        showPersonnelAnalysisResults();
        chatState.isAnalyzing = false;
    }, 2500);
}

// 暴露给Vue组件使用
window.simulatePersonnelRecognition = simulatePersonnelRecognition;

/**
 * 显示人员证件分析结果
 */
function showPersonnelAnalysisResults() {
    // 模拟的人员证件识别结果数据
    chatState.personnelResults = {
        avatar: 'https://ui-avatars.com/api/?name=张小平&background=3366CC&color=fff',
        name: '张小平',
        gender: '男',
        personnelType: '安全生产管理人员',
        industryType: '一般类',
        certNumber: '330721196609671234',
        workUnit: '金华市婺城区金诚装卸服务部',
        initialDate: '2025-04-29',
        validPeriod: '2025-04-29至2028-04-28',
        trainingOrg: '杭州衡信安全科技有限公司'
    };

    // 构建结果展示HTML
    let resultHTML = '<div class="analysis-results">';
    resultHTML += '<div class="ai-card">';
    resultHTML += '<h4>👤 人员证件识别结果</h4>';
    
    // 显示头像
    resultHTML += '<div style="text-align: center; margin: 16px 0;">';
    resultHTML += `<img src="${chatState.personnelResults.avatar}" alt="人员照片" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #3366CC;">`;
    resultHTML += '</div>';
    
    resultHTML += `<p><strong>姓名:</strong> ${chatState.personnelResults.name}</p>`;
    resultHTML += `<p><strong>性别:</strong> ${chatState.personnelResults.gender}</p>`;
    resultHTML += `<p><strong>人员类型:</strong> ${chatState.personnelResults.personnelType}</p>`;
    resultHTML += `<p><strong>行业类型:</strong> ${chatState.personnelResults.industryType}</p>`;
    resultHTML += `<p><strong>证号:</strong> ${chatState.personnelResults.certNumber}</p>`;
    resultHTML += `<p><strong>工作单位:</strong> ${chatState.personnelResults.workUnit}</p>`;
    resultHTML += `<p><strong>初领日期:</strong> ${chatState.personnelResults.initialDate}</p>`;
    resultHTML += `<p><strong>有效日期:</strong> ${chatState.personnelResults.validPeriod}</p>`;
    resultHTML += `<p><strong>培训机构:</strong> ${chatState.personnelResults.trainingOrg}</p>`;
    resultHTML += `
        <button class="btn btn-primary insert-btn" onclick="insertToPersonnelList()">
            <i class="ph ph-user-plus"></i> 插入人员清单
        </button>
    `;
    resultHTML += '</div>';
    resultHTML += '</div>';

    addAIMessage(resultHTML);
}

/**
 * 根据身份证号计算年龄
 * @param {string} idCard - 身份证号
 * @returns {number} 年龄
 */
function calculateAge(idCard) {
    if (!idCard || idCard.length < 14) return 0;
    
    // 提取出生日期
    const year = parseInt(idCard.substr(6, 4));
    const month = parseInt(idCard.substr(10, 2));
    const day = parseInt(idCard.substr(12, 2));
    
    // 当前日期
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    const currentDay = today.getDate();
    
    // 计算年龄
    let age = currentYear - year;
    
    // 如果还没过生日，年龄减1
    if (currentMonth < month || (currentMonth === month && currentDay < day)) {
        age--;
    }
    
    return age;
}

/**
 * 根据有效日期校验证书状态
 * @param {string} validPeriod - 有效日期范围，格式：YYYY-MM-DD至YYYY-MM-DD
 * @returns {object} 包含证书状态和校验结果
 */
function validateCertStatus(validPeriod) {
    if (!validPeriod || !validPeriod.includes('至')) {
        return {
            certStatus: '未知',
            checkResult: '未知证书',
            status: '离场'
        };
    }
    
    // 提取结束日期
    const endDateStr = validPeriod.split('至')[1].trim();
    const endDate = new Date(endDateStr);
    const today = new Date();
    
    // 计算距离过期还有多少天
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    let certStatus = '正常';
    let checkResult = '';
    let status = '入场';
    
    if (diffDays < 0) {
        // 已过期
        certStatus = '已过期';
        status = '离场';
        checkResult = '证书已过期';
    } else if (diffDays <= 30) {
        // 30天内即将过期
        certStatus = '即将过期';
        status = '入场';
        checkResult = `${diffDays}天后过期`;
    } else {
        // 正常
        certStatus = '正常';
        status = '入场';
        checkResult = '证书有效';
    }
    
    return {
        certStatus,
        checkResult,
        status
    };
}

/**
 * 将人员识别结果插入到人员清单
 */
function insertToPersonnelList() {
    if (!chatState.personnelResults) {
        ElementPlus.ElMessage.warning('没有可插入的识别结果');
        return;
    }

    const result = chatState.personnelResults;
    
    // 根据证号计算年龄
    const age = calculateAge(result.certNumber);
    
    // 根据有效日期校验证书状态
    const validation = validateCertStatus(result.validPeriod);
    
    // 提取性别（从身份证号）
    let gender = result.gender;
    if (!gender && result.certNumber && result.certNumber.length >= 17) {
        const genderCode = parseInt(result.certNumber.substr(16, 1));
        gender = genderCode % 2 === 0 ? '女' : '男';
    }
    
    // 构建人员信息对象
    const personnelInfo = {
        avatar: result.avatar || `https://ui-avatars.com/api/?name=${result.name}&background=3366CC&color=fff`,
        name: result.name || '',
        gender: gender || '',
        phone: result.phone || '', // 证件中可能没有电话
        age: age,
        certStatus: validation.certStatus,
        certCheckResult: `${result.personnelType || ''}`,
        status: validation.status,
        safetyTraining: '未完成' // 默认未完成，需要后续确认
    };
    
    // 调用全局实例的添加方法
    if (window.personnelTableInstance && typeof window.personnelTableInstance.addPersonnel === 'function') {
        window.personnelTableInstance.addPersonnel(personnelInfo);
    } else {
        ElementPlus.ElMessage.error('人员清单未正确初始化');
    }
    
    // 可选：关闭AI侧边栏
    // toggleAI();
}

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', function () {
    // 绑定输入框Enter键事件
    const textarea = document.getElementById('aiInputTextarea');
    if (textarea) {
        textarea.onkeydown = handleEnterKey;
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

    // 绑定字符计数事件
    const businessScope = document.getElementById('businessScope');
    if (businessScope) {
        businessScope.oninput = updateCharCount;
    }

    console.log('证照识别AI助手交互初始化完成');
});

