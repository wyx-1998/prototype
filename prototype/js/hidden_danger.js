/**
 * 隐患排查页面 - 页面特定功能
 * 实现功能：
 * 1. 粒子特效
 * 2. AI识别弹窗控制
 * 3. 与 Element Plus 上传组件的集成
 * 4. 页面导航
 *
 * 注意：AI 助手的核心功能由 components/ai-assistant.js 提供
 */

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
    if (typeof AIAssistant !== 'undefined') {
        AIAssistant.toggleAI(true);
    }

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
        if (typeof AIAssistant !== 'undefined' && uploadedImages.length > 0) {
            AIAssistant.addUserMessage('请帮我识别这些照片中的安全隐患', uploadedImages, true);
            AIAssistant.simulateAIAnalysis();
        }
    }, 300);
}

// ==================== 页面导航 ====================

/**
 * 页面导航函数
 */
function navigateToPage(page) {
    window.location.href = page;
}

// ==================== 初始化 ====================

document.addEventListener('DOMContentLoaded', function () {
    console.log('隐患排查页面特定功能初始化完成');
});

// 暴露函数到全局
window.createParticleEffect = createParticleEffect;
window.closeModal = closeModal;
window.startRecognition = startRecognition;
window.navigateToPage = navigateToPage;
