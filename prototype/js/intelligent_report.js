(function () {
    const template = `
        <div class="scroll-container intelligent-report-scroll-container">
            <div class="intelligent-report-page">
                <div class="intelligent-report-header-card">
                    <div class="intelligent-report-header-text">
                        <div class="intelligent-report-title">智能问数与报告生成</div>
                        <div class="intelligent-report-subtitle">支持自然语言问数、风险分析、下钻追溯和报告生成演示。</div>
                    </div>
                    <button class="intelligent-report-entry-btn"><i class="ph ph-chart-line-up"></i> 开始演示</button>
                </div>

                <section class="intelligent-report-scene-card">
                    <div class="scene-card-header">
                        <div class="scene-card-title">建议演示问题</div>
                        <div class="scene-card-tip">点击问题可直接发送到 AI 助手</div>
                    </div>
                    <div class="report-question-grid">
                        <button class="report-question-item">近30天哪个厂区隐患数量最多？哪些隐患整改逾期？</button>
                        <button class="report-question-item">本月高风险作业主要集中在哪些班组？</button>
                        <button class="report-question-item">最近一季度重复发生最多的隐患类型是什么？</button>
                        <button class="report-question-item">本月外委作业相关问题主要集中在哪几个单位？</button>
                        <button class="report-question-item">基于以上分析，生成一份本月安全生产分析简报</button>
                        <button class="report-question-item">把这个结果整理成一份专项汇报材料</button>
                    </div>
                </section>

                <section class="intelligent-report-scene-card">
                    <div class="scene-card-header">
                        <div class="scene-card-title">演示能力</div>
                    </div>
                    <div class="capability-list">
                        <div class="capability-item"><i class="ph ph-chat-circle-text"></i><span>自然语言转数据查询</span></div>
                        <div class="capability-item"><i class="ph ph-database"></i><span>多源数据关联分析</span></div>
                        <div class="capability-item"><i class="ph ph-chart-bar"></i><span>指标自动计算与图表展示</span></div>
                        <div class="capability-item"><i class="ph ph-warning-circle"></i><span>风险分析与预警提示</span></div>
                        <div class="capability-item"><i class="ph ph-tree-structure"></i><span>结果下钻追溯</span></div>
                        <div class="capability-item"><i class="ph ph-file-text"></i><span>分析简报与汇报材料生成</span></div>
                    </div>
                </section>
            </div>
        </div>
    `;

    const cleanupFns = [];

    function submitDemoQuestion(text) {
        if (!window.AIAssistant || typeof window.AIAssistant.selectSuggestion !== 'function') {
            return;
        }
        if (typeof window.AIAssistant.toggleAI === 'function') {
            window.AIAssistant.toggleAI(true);
        }
        setTimeout(function () {
            window.AIAssistant.selectSuggestion(text);
        }, 180);
    }

    function bindEvents(root) {
        const quickQuestions = root.querySelectorAll('.report-question-item');
        quickQuestions.forEach(function (button) {
            const handler = function () {
                submitDemoQuestion(button.textContent.trim());
            };
            button.addEventListener('click', handler);
            cleanupFns.push(function () {
                button.removeEventListener('click', handler);
            });
        });

        const entryButton = root.querySelector('.intelligent-report-entry-btn');
        if (entryButton) {
            const handler = function () {
                submitDemoQuestion('近30天哪个厂区隐患数量最多？哪些隐患整改逾期？');
            };
            entryButton.addEventListener('click', handler);
            cleanupFns.push(function () {
                entryButton.removeEventListener('click', handler);
            });
        }
    }

    window.IntelligentReportPage = {
        mount: function (container) {
            container.innerHTML = template;
            bindEvents(container);
            return {
                assistantConfig: {
                    sceneId: 'intelligent_report'
                }
            };
        },
        unmount: function () {
            while (cleanupFns.length) {
                const dispose = cleanupFns.pop();
                dispose();
            }
        }
    };
})();
