(function () {
    const template = `
        <div class="scroll-container smart-qa-scroll-container">
            <div class="smart-qa-page">
                <section class="smart-qa-demo-hint-card" style="margin-top: 0;">
                    <div class="hint-header">
                        <i class="ph ph-file-text"></i>
                        <span>标准文件解读</span>
                    </div>
                    <div class="hint-list">
                        <div class="hint-item">先点击 AI 助手上传一份 PDF / Word / 扫描件。</div>
                        <div class="hint-item">输入：解读一下这份文件</div>
                        <div class="hint-item">系统展示思考过程、工具调用和可点击文件卡片。</div>
                        <div class="hint-item">点击卡片后打开标准文件解读结果页面。</div>
                    </div>
                </section>
            </div>
        </div>
    `;

    window.StandardFileInterpretationPage = {
        mount: function (container) {
            container.innerHTML = template;
            return {
                assistantConfig: {
                    sceneId: 'standard_file_interpretation',
                    resetConversation: true
                }
            };
        },
        unmount: function () {
        }
    };
})();
