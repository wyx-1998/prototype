(function () {
    const template = `
        <div class="scroll-container workbench-home-scroll-container">
            <div class="workbench-home-page">
                <div class="workbench-switch-tabs">
                    <button class="workbench-switch-tab active">预设工作台</button>
                    <button class="workbench-switch-tab"><i class="ph ph-dots-nine"></i> 管理工作台</button>
                </div>

                <div class="workbench-grid">
                    <section class="workbench-card">
                        <div class="workbench-card-header">
                            <div class="workbench-card-title">我的审批</div>
                        </div>
                        <div class="workbench-card-body">
                            <div class="workbench-icon-grid">
                                <div class="workbench-icon-item">
                                    <div class="workbench-icon-visual blue">
                                        <i class="ph-fill ph-user-circle"></i>
                                        <span class="workbench-icon-badge">3</span>
                                    </div>
                                    <span>我的待办</span>
                                </div>
                                <div class="workbench-icon-item">
                                    <div class="workbench-icon-visual blue">
                                        <i class="ph-fill ph-user-check"></i>
                                    </div>
                                    <span>我的已办</span>
                                </div>
                                <div class="workbench-icon-item">
                                    <div class="workbench-icon-visual blue">
                                        <i class="ph-fill ph-book-open"></i>
                                    </div>
                                    <span>我的待阅</span>
                                </div>
                                <div class="workbench-icon-item">
                                    <div class="workbench-icon-visual blue">
                                        <i class="ph-fill ph-book-open-text"></i>
                                    </div>
                                    <span>我的已阅</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="workbench-card">
                        <div class="workbench-card-header">
                            <div class="workbench-card-title">我的任务</div>
                        </div>
                        <div class="workbench-card-body">
                            <div class="workbench-icon-grid task-grid">
                                <div class="workbench-icon-item">
                                    <div class="workbench-icon-visual orange">
                                        <i class="ph-fill ph-briefcase"></i>
                                    </div>
                                    <span>待办任务</span>
                                </div>
                                <div class="workbench-icon-item">
                                    <div class="workbench-icon-visual orange">
                                        <i class="ph-fill ph-bell-simple"></i>
                                    </div>
                                    <span>业务提醒</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section class="workbench-card">
                        <div class="workbench-card-header">
                            <div class="workbench-card-title-wrap">
                                <span class="workbench-card-title">常用应用</span>
                                <i class="ph ph-squares-four"></i>
                            </div>
                            <a class="workbench-more-link" href="javascript:void(0)">更多&gt;&gt;</a>
                        </div>
                        <div class="workbench-card-body">
                            <div class="workbench-icon-grid app-grid">
                                <div class="workbench-app-card">
                                    <i class="ph-fill ph-chat-text"></i>
                                    <span>用户权限</span>
                                </div>
                                <div class="workbench-app-card">
                                    <i class="ph-fill ph-chat-text"></i>
                                    <span>运营管理</span>
                                </div>
                                <div class="workbench-app-card">
                                    <i class="ph-fill ph-chat-text"></i>
                                    <span>安全业务台账</span>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>

                <div class="workbench-grid workbench-grid-two">
                    <section class="workbench-card workbench-panel-card tall">
                        <div class="workbench-card-header">
                            <div class="workbench-card-title">要闻</div>
                            <a class="workbench-more-link" href="javascript:void(0)">更多&gt;&gt;</a>
                        </div>
                        <div class="workbench-card-body">
                            <div class="workbench-panel-empty">暂无内容</div>
                        </div>
                    </section>

                    <section class="workbench-card workbench-panel-card tall">
                        <div class="workbench-card-header">
                            <div class="workbench-card-title">通知发文</div>
                            <a class="workbench-more-link" href="javascript:void(0)">更多&gt;&gt;</a>
                        </div>
                        <div class="workbench-card-body">
                            <div class="workbench-panel-empty">暂无内容</div>
                        </div>
                    </section>
                </div>

                <div class="workbench-grid workbench-grid-three">
                    <section class="workbench-card workbench-panel-card">
                        <div class="workbench-card-header">
                            <div class="workbench-card-title">工作动态</div>
                            <a class="workbench-more-link" href="javascript:void(0)">更多&gt;&gt;</a>
                        </div>
                        <div class="workbench-card-body">
                            <div class="workbench-panel-empty">暂无内容</div>
                        </div>
                    </section>

                    <section class="workbench-card workbench-panel-card">
                        <div class="workbench-card-header">
                            <div class="workbench-card-title">良好实践</div>
                            <a class="workbench-more-link" href="javascript:void(0)">更多&gt;&gt;</a>
                        </div>
                        <div class="workbench-card-body">
                            <div class="workbench-panel-empty">暂无内容</div>
                        </div>
                    </section>

                    <section class="workbench-card workbench-panel-card">
                        <div class="workbench-card-header">
                            <div class="workbench-card-title">公示专栏</div>
                            <a class="workbench-more-link" href="javascript:void(0)">更多&gt;&gt;</a>
                        </div>
                        <div class="workbench-card-body">
                            <div class="workbench-panel-empty">暂无内容</div>
                        </div>
                    </section>
                </div>

                <section class="workbench-links-card">
                    <div class="workbench-links-header">
                        <div class="workbench-links-title">友情链接</div>
                    </div>
                    <div class="workbench-links-body">
                        <div class="workbench-links-group">
                            <span class="workbench-links-group-label">政府机构:</span>
                            <a href="javascript:void(0)">应急管理部</a>
                            <a href="javascript:void(0)">安全生产政务网</a>
                            <a href="javascript:void(0)">消防救援局</a>
                            <a href="javascript:void(0)">应急管理部证书查询</a>
                            <a href="javascript:void(0)">住房城乡建设部官网</a>
                            <a href="javascript:void(0)">市场监管总局官网</a>
                        </div>
                        <div class="workbench-links-group">
                            <span class="workbench-links-group-label">国企央企:</span>
                            <a href="javascript:void(0)">国投集团官网</a>
                        </div>
                    </div>
                </section>

                <div class="workbench-push-toast" id="workbenchPushToast">
                    <button class="workbench-push-close" type="button" aria-label="关闭提醒">
                        <i class="ph ph-x"></i>
                    </button>
                    <div class="workbench-push-toast-head">
                        <div class="workbench-push-toast-icon">
                            <i class="ph-fill ph-sparkle"></i>
                        </div>
                        <div class="workbench-push-toast-title">AI工作提醒</div>
                    </div>
                    <div class="workbench-push-toast-text">您好，你有一条AI推送的工作注意事项。</div>
                    <div class="workbench-push-toast-actions">
                        <button class="workbench-push-view-btn" type="button">查看</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const cleanupFns = [];
    const timerIds = [];

    function addCleanup(fn) {
        cleanupFns.push(fn);
    }

    function addTimer(timerId) {
        timerIds.push(timerId);
    }

    function clearTimers() {
        while (timerIds.length) {
            clearTimeout(timerIds.pop());
        }
    }

    function bindTabEvents(root) {
        const tabs = root.querySelectorAll('.workbench-switch-tab');
        tabs.forEach(function (tab) {
            const handler = function () {
                tabs.forEach(function (item) {
                    item.classList.remove('active');
                });
                tab.classList.add('active');
            };
            tab.addEventListener('click', handler);
            addCleanup(function () {
                tab.removeEventListener('click', handler);
            });
        });
    }

    function hideToast(root) {
        const toast = root.querySelector('#workbenchPushToast');
        if (!toast) {
            return;
        }
        toast.classList.remove('visible');
        const removeTimer = setTimeout(function () {
            toast.classList.add('dismissed');
        }, 220);
        addTimer(removeTimer);
    }

    function openAIPush(root) {
        hideToast(root);
        if (!window.AIAssistant) {
            return;
        }

        window.AIAssistant.toggleAI(true);

        const pushTimer = setTimeout(function () {
            const chatBody = document.getElementById('aiChatBody');
            if (chatBody) {
                chatBody.innerHTML = '';
            }

            const reply = window.AIAssistant.resolveSceneReply('', [], null, {
                intent: 'daily_push'
            });
            if (reply) {
                window.AIAssistant.runSceneReply(reply);
            }
        }, 320);
        addTimer(pushTimer);
    }

    function bindToastEvents(root) {
        const toast = root.querySelector('#workbenchPushToast');
        if (!toast) {
            return;
        }

        const showTimer = setTimeout(function () {
            toast.classList.add('visible');
        }, 700);
        addTimer(showTimer);

        const closeBtn = toast.querySelector('.workbench-push-close');
        const viewBtn = toast.querySelector('.workbench-push-view-btn');

        if (closeBtn) {
            const closeHandler = function () {
                hideToast(root);
            };
            closeBtn.addEventListener('click', closeHandler);
            addCleanup(function () {
                closeBtn.removeEventListener('click', closeHandler);
            });
        }

        if (viewBtn) {
            const viewHandler = function () {
                openAIPush(root);
            };
            viewBtn.addEventListener('click', viewHandler);
            addCleanup(function () {
                viewBtn.removeEventListener('click', viewHandler);
            });
        }
    }

    window.WorkbenchHomePage = {
        mount: function (container) {
            container.innerHTML = template;
            bindTabEvents(container);
            bindToastEvents(container);
            return {
                assistantConfig: {
                    sceneId: 'workbench_push',
                    resetConversation: false
                }
            };
        },
        unmount: function () {
            clearTimers();
            while (cleanupFns.length) {
                const dispose = cleanupFns.pop();
                dispose();
            }
        }
    };
})();
