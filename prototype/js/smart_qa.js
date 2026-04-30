(function () {
    const template = `
        <div class="scroll-container smart-qa-scroll-container">
            <div class="smart-qa-page">
                <div class="smart-qa-status-tabs">
                    <button class="status-tab active">审批中 <span class="tab-badge">1</span></button>
                    <button class="status-tab">待提交</button>
                    <button class="status-tab">待签字 <span class="tab-badge">1</span></button>
                    <button class="status-tab">草稿</button>
                    <button class="status-tab">审批完成</button>
                    <button class="status-tab">已作废</button>
                </div>

                <section class="smart-qa-filter-card">
                    <div class="filter-toolbar">
                        <div class="toolbar-actions-left">
                            <button class="toolbar-btn toolbar-btn-primary"><i class="ph ph-plus-square"></i> 新建</button>
                            <button class="toolbar-btn toolbar-btn-primary"><i class="ph ph-copy"></i> 复制</button>
                            <button class="toolbar-btn">关联开票</button>
                        </div>
                    </div>

                    <div class="filter-form-grid">
                        <div class="filter-field field-wide">
                            <label>申请部门/单位</label>
                            <div class="select-display">
                                <span>请选择（可多选）</span>
                                <i class="ph ph-caret-down"></i>
                            </div>
                        </div>
                        <div class="filter-field">
                            <label>级联选择</label>
                            <div class="select-display">
                                <span>请选择</span>
                                <i class="ph ph-caret-down"></i>
                            </div>
                        </div>
                        <div class="filter-field">
                            <label>申请人</label>
                            <div class="input-display">请输入内容</div>
                        </div>
                        <div class="filter-field field-type">
                            <label>作业票类型</label>
                            <div class="select-display">
                                <span>请选择</span>
                                <i class="ph ph-caret-down"></i>
                            </div>
                        </div>
                        <div class="filter-actions">
                            <button class="query-btn"><i class="ph ph-magnifying-glass"></i> 查询</button>
                            <button class="reset-btn"><i class="ph ph-arrow-counter-clockwise"></i> 重置</button>
                            <button class="expand-btn">展开 <i class="ph ph-caret-down"></i></button>
                        </div>
                    </div>

                    <div class="extra-filter-row">
                        <label class="checkbox-display">
                            <input type="checkbox">
                            <span>显示禁用部门</span>
                        </label>
                    </div>
                </section>

                <section class="smart-qa-table-card">
                    <div class="table-wrap">
                        <table class="ticket-table">
                            <thead>
                                <tr>
                                    <th class="col-check"><input type="checkbox"></th>
                                    <th>作业票编号</th>
                                    <th>作业票类型</th>
                                    <th>风险等级</th>
                                    <th>作业内容</th>
                                    <th>作业地点</th>
                                    <th>作业区域</th>
                                    <th>计划作业时间</th>
                                    <th>作业人数</th>
                                    <th>作业票状态</th>
                                    <th>项目负责人</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td class="col-check"><input type="checkbox"></td>
                                    <td class="ticket-code">ZYPJ-20260428-001</td>
                                    <td>动火作业</td>
                                    <td><span class="risk-tag">一般风险</span></td>
                                    <td>振动器底板开裂</td>
                                    <td>27皮带</td>
                                    <td>二线调配库</td>
                                    <td>2026-04-28 14:25至2026-04-29 18:00</td>
                                    <td>1</td>
                                    <td><span class="status-chip">审批中</span></td>
                                    <td>吕建(生产技术部)</td>
                                    <td>
                                        <div class="table-actions">
                                            <button class="icon-btn" title="下载"><i class="ph ph-download-simple"></i></button>
                                            <span class="icon-btn icon-btn-static" title="查看"><i class="ph ph-eye"></i></span>
                                            <button class="icon-btn" title="复制"><i class="ph ph-copy"></i></button>
                                            <button class="icon-btn" title="删除"><i class="ph ph-trash"></i></button>
                                        </div>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

            </div>
        </div>
    `;

    const cleanupFns = [];

    function bindSmartQAPageEvents(root) {
        const tabs = root.querySelectorAll('.status-tab');
        tabs.forEach(function (tab) {
            const handler = function () {
                tabs.forEach(function (item) {
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

    window.EntryPage = {
        mount: function (container) {
            const cards = window.AppConfig.pages.filter(function (page) {
                return !page.hiddenInSidebar;
            }).map(function (page) {
                return [
                    '<div class="entry-card" onclick="AppShell.navigateToPageById(\'' + page.id + '\')">',
                    '   <div class="entry-card-icon"><i class="ph ' + page.icon + '"></i></div>',
                    '   <div class="entry-card-title">' + page.label + '</div>',
                    '   <div class="entry-card-desc">进入 ' + page.label + ' 演示页面。</div>',
                    '</div>'
                ].join('');
            }).join('');

            container.innerHTML = [
                '<div class="scroll-container">',
                '    <div class="entry-page">',
                '        <div class="form-card">',
                '            <div class="card-header">',
                '                <h3>演示页面</h3>',
                '                <i class="ph ph-caret-up"></i>',
                '            </div>',
                '            <div class="entry-card-grid" style="padding: 24px;">' + cards + '</div>',
                '        </div>',
                '    </div>',
                '</div>'
            ].join('');
            return {
                assistantConfig: {
                    sceneId: 'smart_qa'
                }
            };
        },
        unmount: function () {
        }
    };

    window.SmartQAPage = {
        mount: function (container) {
            container.innerHTML = template;
            bindSmartQAPageEvents(container);
            return {
                assistantConfig: {
                    sceneId: 'smart_qa'
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
