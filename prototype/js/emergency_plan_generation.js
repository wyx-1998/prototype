(function () {
    const demoQuestions = [
        '脱硫区域突发有毒气体泄漏，现场应如何处置？',
        '高压设备异常停机并伴随人员轻伤，第一时间要采取哪些措施？',
        '外委作业现场发生火情，现场负责人和监护人员分别应该做什么？',
        '某区域出现有限空间人员不适，当前的应急步骤和注意事项是什么？'
    ];

    const capabilities = [
        { icon: 'ph-shield-warning', label: '场景理解与风险分级' },
        { icon: 'ph-books', label: '预案法规制度联动' },
        { icon: 'ph-tree-structure', label: '处置步骤自动生成' },
        { icon: 'ph-users-three', label: '岗位分工与协同建议' },
        { icon: 'ph-first-aid-kit', label: '应急物资调用提示' },
        { icon: 'ph-paper-plane-tilt', label: '处置清单快速分发' }
    ];

    const template = `
        <div class="scroll-container emergency-plan-scroll-container">
            <div class="emergency-plan-page">
                <div class="emergency-plan-header-card">
                    <div class="emergency-plan-header-text">
                        <div class="emergency-plan-title">智能应急预案生成</div>
                        <div class="emergency-plan-subtitle">基于事故场景快速输出处置步骤、岗位分工、联动上报和注意事项。</div>
                    </div>
                    <button class="emergency-plan-entry-btn"><i class="ph ph-siren"></i> 开始演示</button>
                </div>

                <section class="emergency-plan-scene-card">
                    <div class="scene-card-header">
                        <div class="scene-card-title">建议演示问题</div>
                        <div class="scene-card-tip">点击问题可直接发送到 AI 助手</div>
                    </div>
                    <div class="emergency-plan-question-grid">
                        ${demoQuestions.map(function (question) {
                            return '<button class="emergency-plan-question-item">' + question + '</button>';
                        }).join('')}
                    </div>
                </section>

                <section class="emergency-plan-scene-card">
                    <div class="scene-card-header">
                        <div class="scene-card-title">演示能力</div>
                    </div>
                    <div class="emergency-plan-capability-list">
                        ${capabilities.map(function (item) {
                            return '<div class="emergency-plan-capability-item"><i class="ph ' + item.icon + '"></i><span>' + item.label + '</span></div>';
                        }).join('')}
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

    function renderMobileQuestionList(container) {
        if (!container) {
            return;
        }
        container.innerHTML = demoQuestions.map(function (question) {
            return '<button class="mobile-question-item">' + question + '</button>';
        }).join('');

        const quickQuestions = container.querySelectorAll('.mobile-question-item');
        quickQuestions.forEach(function (button) {
            const handler = function () {
                submitDemoQuestion(button.textContent.trim());
            };
            button.addEventListener('click', handler);
            cleanupFns.push(function () {
                button.removeEventListener('click', handler);
            });
        });
    }

    function bindEvents(root) {
        const quickQuestions = root.querySelectorAll('.emergency-plan-question-item');
        quickQuestions.forEach(function (button) {
            const handler = function () {
                submitDemoQuestion(button.textContent.trim());
            };
            button.addEventListener('click', handler);
            cleanupFns.push(function () {
                button.removeEventListener('click', handler);
            });
        });

        const entryButton = root.querySelector('.emergency-plan-entry-btn');
        if (entryButton) {
            const handler = function () {
                submitDemoQuestion(demoQuestions[0]);
            };
            entryButton.addEventListener('click', handler);
            cleanupFns.push(function () {
                entryButton.removeEventListener('click', handler);
            });
        }
    }

    window.EmergencyPlanGenerationPage = {
        mount: function (container) {
            container.innerHTML = template;
            bindEvents(container);
            return {
                assistantConfig: {
                    sceneId: 'emergency_plan_generation'
                }
            };
        },
        mountMobile: function (container) {
            renderMobileQuestionList(container);
        },
        unmount: function () {
            while (cleanupFns.length) {
                const dispose = cleanupFns.pop();
                dispose();
            }
        }
    };
})();
