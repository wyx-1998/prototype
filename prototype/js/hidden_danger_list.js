(function () {
    const template = `
        <div class="scroll-container hidden-danger-list-scroll-container">
            <div class="hidden-danger-list-page">
                <section class="hidden-danger-context-tabs">
                    <button class="context-tab-chip">隐患排查库 <i class="ph ph-x"></i></button>
                    <button class="context-tab-chip active">隐患治理 <i class="ph ph-x"></i></button>
                </section>

                <section class="hidden-danger-level-tabs">
                    <button class="level-tab active">一般隐患</button>
                    <button class="level-tab">较大隐患</button>
                    <button class="level-tab">重大隐患</button>
                </section>

                <section class="hidden-danger-filter-card">
                    <div class="filter-toolbar-grid">
                        <div class="filter-item">
                            <label>隐患编号</label>
                            <input class="filter-input" type="text" placeholder="请输入内容">
                        </div>
                        <div class="filter-item">
                            <label>状态</label>
                            <div class="multi-select-display">
                                <div class="multi-select-tags">
                                    <span class="select-tag">待整改 <i class="ph ph-x"></i></span>
                                    <span class="select-tag-count">+ 1</span>
                                </div>
                                <i class="ph ph-caret-down multi-select-arrow"></i>
                            </div>
                        </div>
                        <div class="filter-item">
                            <label>隐患描述</label>
                            <input class="filter-input" type="text" placeholder="请输入内容">
                        </div>
                        <div class="filter-actions">
                            <button class="query-action"><i class="ph ph-magnifying-glass"></i> 查询</button>
                            <button class="reset-action"><i class="ph ph-arrow-counter-clockwise"></i> 重置</button>
                            <button class="expand-action">展开 <i class="ph ph-caret-down"></i></button>
                        </div>
                    </div>
                </section>

                <section class="hidden-danger-table-card">
                    <div class="hidden-danger-table-wrap">
                        <table class="hidden-danger-table">
                            <thead>
                                <tr>
                                    <th class="col-id">隐患编号</th>
                                    <th class="col-desc">隐患描述</th>
                                    <th class="col-status">状态</th>
                                    <th class="col-handler">下一步处理部门/人 <i class="ph ph-funnel-simple table-filter-icon"></i></th>
                                    <th class="col-location">地点</th>
                                    <th class="col-dept">整改部门</th>
                                    <th class="col-person">整改人</th>
                                    <th class="col-date">整改期限</th>
                                    <th class="col-complete-date">实际整改完成日期</th>
                                    <th class="col-accept-dept">验收部门</th>
                                    <th class="col-accept-person">验收人</th>
                                    <th class="col-actions">操作 <i class="ph ph-funnel-simple table-filter-icon"></i></th>
                                </tr>
                                <tr class="filter-row">
                                    <th><div class="table-filter-box"><input class="table-filter-input" type="text"></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-input" type="text"></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-input" type="text"></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-input active" type="text"><i class="ph ph-funnel-simple table-filter-icon"></i></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-input" type="text"></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-input" type="text"></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-input" type="text"></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-date" type="text" placeholder="年 / 月 / 日"><i class="ph ph-calendar table-filter-icon"></i></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-date" type="text" placeholder="年 / 月 / 日"><i class="ph ph-calendar table-filter-icon"></i></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-input" type="text"></div></th>
                                    <th><div class="table-filter-box"><input class="table-filter-input" type="text"></div></th>
                                    <th style="text-align:center;">点</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>YH-20260420-0003</td>
                                    <td><span class="link-text">跃欣光伏220kV跃霞线N21#塔A相隐患</span></td>
                                    <td><span class="status-pill"><i class="ph ph-clock"></i>待整改</span></td>
                                    <td>跃欣光伏站(马高越)</td>
                                    <td>跃欣光伏220kV</td>
                                    <td>跃欣光伏站</td>
                                    <td>马高越</td>
                                    <td>2026-05-30</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <div class="table-actions-group">
                                            <button class="table-action-icon view" title="查看"><i class="ph ph-eye"></i></button>
                                            <button class="table-action-icon edit" title="编辑"><i class="ph ph-wrench"></i></button>
                                            <button class="table-action-icon copy" title="复制"><i class="ph ph-copy"></i></button>
                                            <button class="table-action-icon assign" title="指派"><i class="ph ph-user-circle-plus"></i></button>
                                            <button class="table-action-icon warn" title="催办"><i class="ph ph-clock-countdown"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>YH-20260420-0002</td>
                                    <td><span class="link-text">220kV跃霞线N11（直线耐张塔）隐患</span></td>
                                    <td><span class="status-pill"><i class="ph ph-clock"></i>待整改</span></td>
                                    <td>跃欣光伏站(马高越)</td>
                                    <td>220kV跃霞线N1</td>
                                    <td>跃欣光伏站</td>
                                    <td>马高越</td>
                                    <td>2026-05-30</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <div class="table-actions-group">
                                            <button class="table-action-icon view" title="查看"><i class="ph ph-eye"></i></button>
                                            <button class="table-action-icon edit" title="编辑"><i class="ph ph-wrench"></i></button>
                                            <button class="table-action-icon copy" title="复制"><i class="ph ph-copy"></i></button>
                                            <button class="table-action-icon assign" title="指派"><i class="ph ph-user-circle-plus"></i></button>
                                            <button class="table-action-icon warn" title="催办"><i class="ph ph-clock-countdown"></i></button>
                                        </div>
                                    </td>
                                </tr>
                                <tr>
                                    <td>YH-20260420-0001</td>
                                    <td><span class="link-text">N13#塔C相跳线绝缘子固定螺栓隐患</span></td>
                                    <td><span class="status-pill"><i class="ph ph-clock"></i>待整改</span></td>
                                    <td>跃欣光伏站(马高越)</td>
                                    <td>跃欣光伏220kV</td>
                                    <td>跃欣光伏站</td>
                                    <td>马高越</td>
                                    <td>2026-05-30</td>
                                    <td></td>
                                    <td></td>
                                    <td></td>
                                    <td>
                                        <div class="table-actions-group">
                                            <button class="table-action-icon view" title="查看"><i class="ph ph-eye"></i></button>
                                            <button class="table-action-icon edit" title="编辑"><i class="ph ph-wrench"></i></button>
                                            <button class="table-action-icon copy" title="复制"><i class="ph ph-copy"></i></button>
                                            <button class="table-action-icon assign" title="指派"><i class="ph ph-user-circle-plus"></i></button>
                                            <button class="table-action-icon warn" title="催办"><i class="ph ph-clock-countdown"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="hidden-danger-table-footer">
                        <span>共 3 条</span>
                        <select class="pagination-size">
                            <option>20条/页</option>
                        </select>
                        <button class="pagination-arrow-btn"><i class="ph ph-caret-left"></i></button>
                        <button class="pagination-page-btn">1</button>
                        <button class="pagination-arrow-btn"><i class="ph ph-caret-right"></i></button>
                        <span>前往</span>
                        <input class="pagination-jump-input" type="text" value="1">
                        <span>页</span>
                        <div class="pagination-tools">
                            <button class="pagination-tool-btn"><i class="ph ph-arrow-clockwise"></i></button>
                            <button class="pagination-tool-btn"><i class="ph ph-magnifying-glass"></i></button>
                            <button class="pagination-tool-btn"><i class="ph ph-sliders-horizontal"></i></button>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    `;

    const cleanupFns = [];

    function bindTabEvents(root) {
        const levelTabs = root.querySelectorAll('.level-tab');
        levelTabs.forEach(function (tab) {
            const handler = function () {
                levelTabs.forEach(function (item) {
                    item.classList.remove('active');
                });
                tab.classList.add('active');
            };
            tab.addEventListener('click', handler);
            cleanupFns.push(function () {
                tab.removeEventListener('click', handler);
            });
        });

        const contextTabs = root.querySelectorAll('.context-tab-chip');
        contextTabs.forEach(function (tab) {
            const handler = function () {
                contextTabs.forEach(function (item) {
                    item.classList.remove('active');
                });
                tab.classList.add('active');
            };
            tab.addEventListener('click', handler);
            cleanupFns.push(function () {
                tab.removeEventListener('click', handler);
            });
        });
    }

    window.HiddenDangerListPage = {
        mount: function (container) {
            container.innerHTML = template;
            bindTabEvents(container);
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
