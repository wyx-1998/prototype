(function () {
    const routeDetails = {
        route_1: {
            label: '智能巡检路线1',
            points: [
                '脱硫塔北侧平台：核查动火票延期状态与临边隔离。',
                '石膏浆液管廊转角：核查高处作业票与现场交叉作业隔离。',
                '吸收塔检修吊篮点：核查外委个体防护与吊篮下方警示。'
            ]
        },
        route_2: {
            label: '智能巡检路线2',
            points: [
                '脱硫循环泵平台：核查检维修票与平台作业秩序。',
                '烟道检修平台：核查动火票、消防器材可达性。',
                '烟囱外部巡检步道：核查巡检确认单与步道防护状态。'
            ]
        }
    };

    const template = `
        <div class="scroll-container intelligent-inspection-scroll-container">
            <div class="intelligent-inspection-page">
                <section class="intelligent-inspection-toolbar">
                    <div class="intelligent-inspection-toolbar-title">智能巡检</div>
                </section>

                <section class="intelligent-inspection-scene">
                    <img class="intelligent-inspection-scene-image" src="images/intelligent_inspection_scene.png" alt="智能巡检场景">
                    <div class="intelligent-inspection-scene-badge"><i class="ph ph-video-camera"></i> 监控设备<span class="intelligent-inspection-route-tag" id="inspectionCurrentRoute">待开始</span></div>
                    <div class="intelligent-inspection-route-actions intelligent-inspection-route-actions-overlay">
                        <button class="intelligent-inspection-route-btn" type="button" data-route-id="route_1"><i class="ph ph-path"></i> 智能巡检路线1</button>
                        <button class="intelligent-inspection-route-btn secondary" type="button" data-route-id="route_2"><i class="ph ph-path"></i> 智能巡检路线2</button>
                    </div>
                </section>
            </div>

            <div class="intelligent-inspection-dialog-mask" id="inspectionConfirmDialog" hidden>
                <div class="intelligent-inspection-dialog" role="dialog" aria-modal="true" aria-labelledby="inspectionDialogTitle">
                    <div class="intelligent-inspection-dialog-title" id="inspectionDialogTitle">开始智能巡检</div>
                    <div class="intelligent-inspection-dialog-text">是否现在开始智能巡检，巡检时间约10分钟。</div>
                    <div class="intelligent-inspection-dialog-route-name" id="inspectionDialogRouteName"></div>
                    <div class="intelligent-inspection-dialog-points-title">本次巡检点位说明</div>
                    <ul class="intelligent-inspection-dialog-points" id="inspectionDialogPoints"></ul>
                    <div class="intelligent-inspection-dialog-actions">
                        <button class="intelligent-inspection-dialog-btn" type="button" data-action="cancel">取消</button>
                        <button class="intelligent-inspection-dialog-btn primary" type="button" data-action="confirm">确认开始</button>
                    </div>
                </div>
            </div>
        </div>
    `;

    const cleanupFns = [];
    const state = {
        selectedRouteId: ''
    };

    function addCleanup(fn) {
        cleanupFns.push(fn);
    }

    function disposeAll() {
        while (cleanupFns.length) {
            const dispose = cleanupFns.pop();
            dispose();
        }
    }

    function showElement(element) {
        if (element) {
            element.hidden = false;
        }
    }

    function hideElement(element) {
        if (element) {
            element.hidden = true;
        }
    }

    function getCurrentRouteDetail() {
        return routeDetails[state.selectedRouteId] || routeDetails.route_1;
    }

    function updateRouteTag(root) {
        const routeTag = root.querySelector('#inspectionCurrentRoute');
        if (!routeTag) {
            return;
        }
        if (!state.selectedRouteId) {
            routeTag.textContent = '待开始';
            return;
        }
        routeTag.textContent = getCurrentRouteDetail().label;
    }

    function renderDialogRoute(root) {
        const routeName = root.querySelector('#inspectionDialogRouteName');
        const pointsRoot = root.querySelector('#inspectionDialogPoints');
        if (!routeName || !pointsRoot) {
            return;
        }
        const detail = getCurrentRouteDetail();
        routeName.textContent = detail.label;
        pointsRoot.innerHTML = '';
        detail.points.forEach(function (point) {
            const item = document.createElement('li');
            item.textContent = point;
            pointsRoot.appendChild(item);
        });
    }

    function startInspection() {
        if (!window.AIAssistant || typeof window.AIAssistant.submitSceneRequest !== 'function') {
            return;
        }
        if (typeof window.AIAssistant.toggleAI === 'function') {
            window.AIAssistant.toggleAI(true);
        }
        setTimeout(function () {
            window.AIAssistant.submitSceneRequest({
                text: '智能巡检路线',
                suppressHazardTag: true,
                extras: {
                    intent: 'start_inspection',
                    routeId: state.selectedRouteId || 'route_1'
                }
            });
        }, 260);
    }

    function bindEvents(root) {
        const dialog = root.querySelector('#inspectionConfirmDialog');
        const routeButtons = root.querySelectorAll('.intelligent-inspection-route-btn');
        routeButtons.forEach(function (button) {
            const handler = function () {
                state.selectedRouteId = button.dataset.routeId || 'route_1';
                updateRouteTag(root);
                renderDialogRoute(root);
                showElement(dialog);
            };
            button.addEventListener('click', handler);
            addCleanup(function () {
                button.removeEventListener('click', handler);
            });
        });

        if (dialog) {
            const cancelButton = dialog.querySelector('[data-action="cancel"]');
            const confirmButton = dialog.querySelector('[data-action="confirm"]');

            if (cancelButton) {
                const cancelHandler = function () {
                    hideElement(dialog);
                };
                cancelButton.addEventListener('click', cancelHandler);
                addCleanup(function () {
                    cancelButton.removeEventListener('click', cancelHandler);
                });
            }

            if (confirmButton) {
                const confirmHandler = function () {
                    hideElement(dialog);
                    startInspection();
                };
                confirmButton.addEventListener('click', confirmHandler);
                addCleanup(function () {
                    confirmButton.removeEventListener('click', confirmHandler);
                });
            }

            const maskHandler = function (event) {
                if (event.target === dialog) {
                    hideElement(dialog);
                }
            };
            dialog.addEventListener('click', maskHandler);
            addCleanup(function () {
                dialog.removeEventListener('click', maskHandler);
            });
        }
    }

    window.IntelligentInspectionPage = {
        mount: function (container) {
            container.innerHTML = template;
            state.selectedRouteId = '';
            bindEvents(container);
            updateRouteTag(container);
            renderDialogRoute(container);
            return {
                assistantConfig: {
                    sceneId: 'intelligent_inspection',
                    resetConversation: true
                }
            };
        },
        unmount: function () {
            disposeAll();
        }
    };
})();
