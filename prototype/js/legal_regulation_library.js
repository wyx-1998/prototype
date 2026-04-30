(function () {
    const interpretationResultUrl = '../cailiao/安全标准解读样例/7fc39e3f_GB_T+33579-2017.html';
    const interpretationMessageName = 'GBT+33579-2017';
    const cleanupFns = [];
    const timerIds = [];
    const state = window.LegalRegulationLibraryState || {
        selectedFileName: 'GBT+33579-2017.pdf',
        selectedDocumentName: 'GBT+33579-2017',
        showInterpretationPrompt: false
    };

    window.LegalRegulationLibraryState = state;

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

    function disposeAll() {
        clearTimers();
        while (cleanupFns.length) {
            const dispose = cleanupFns.pop();
            dispose();
        }
    }

    function getDocumentName(fileName) {
        if (!fileName) {
            return interpretationMessageName;
        }
        return fileName.replace(/\.[^.]+$/, '') || interpretationMessageName;
    }

    function escapeHtml(value) {
        return String(value || '')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function openInterpretationResult() {
        window.open(interpretationResultUrl, '_blank');
    }

    function renderLibraryTableRows() {
        return [
            {
                name: '中华人民共和国安全生产法',
                code: '主席令第88号',
                publishDate: '2021-06-10',
                executeDate: '2021-09-01',
                publisher: '人大常委会',
                level: '法律',
                category: '安全生产类',
                validity: '现行有效',
                putawayDate: '2025-09-01',
                owner: '张三'
            },
            {
                name: '生产安全事故应急条例',
                code: '国务院令第708号',
                publishDate: '2019-02-17',
                executeDate: '2019-04-01',
                publisher: '国务院',
                level: '行政法规',
                category: '应急管理类',
                validity: '现行有效',
                putawayDate: '2025-09-01',
                owner: '张三'
            },
            {
                name: '危险化学品企业特殊作业安全规范',
                code: 'GB 30871-2022',
                publishDate: '2022-10-12',
                executeDate: '2023-04-01',
                publisher: '国家市场监督管理总局',
                level: '国家标准',
                category: '特种设备管理',
                validity: '现行有效',
                putawayDate: '2025-09-01',
                owner: '张三'
            }
        ].map(function (item) {
            return [
                '<tr>',
                '    <td><input type="checkbox"></td>',
                '    <td><a class="library-link" href="javascript:void(0)">' + item.name + '</a></td>',
                '    <td>' + item.code + '</td>',
                '    <td>' + item.publishDate + '</td>',
                '    <td>' + item.executeDate + '</td>',
                '    <td>' + item.publisher + '</td>',
                '    <td>' + item.level + '</td>',
                '    <td>' + item.category + '</td>',
                '    <td>' + item.validity + '</td>',
                '    <td>' + item.putawayDate + '</td>',
                '    <td>' + item.owner + '</td>',
                '    <td class="sticky-action">',
                '        <div class="library-action-group">',
                '            <button class="library-action-btn view" type="button" title="查看"><i class="ph ph-eye"></i></button>',
                '            <button class="library-action-btn download" type="button" title="下载"><i class="ph ph-download-simple"></i></button>',
                '            <button class="library-action-btn star" type="button" title="收藏"><i class="ph ph-star"></i></button>',
                '        </div>',
                '    </td>',
                '</tr>'
            ].join('');
        }).join('');
    }

    function getListTemplate() {
        return `
            <div class="scroll-container legal-library-scroll-container">
                <div class="legal-library-page">
                    <section class="legal-library-status-tabs">
                        <button class="legal-status-tab active">已上架</button>
                        <button class="legal-status-tab">已下架</button>
                        <button class="legal-status-tab">草稿</button>
                    </section>

                    <section class="legal-library-panel">
                        <aside class="legal-library-tree">
                            <div class="legal-library-tree-root"><i class="ph ph-caret-down"></i> 法律法规标准</div>
                            <div class="legal-library-tree-item active"><i class="ph ph-file-text"></i> 安全生产</div>
                            <div class="legal-library-tree-item"><i class="ph ph-file-text"></i> 职业卫生</div>
                            <div class="legal-library-tree-item"><i class="ph ph-file-text"></i> 特种设备管理</div>
                            <div class="legal-library-tree-item"><i class="ph ph-file-text"></i> 环保管理</div>
                            <div class="legal-library-tree-item"><i class="ph ph-file-text"></i> 其他</div>
                        </aside>

                        <div class="legal-library-content">
                            <div class="legal-library-toolbar">
                                <div class="legal-library-toolbar-main">
                                    <button class="library-primary-btn" id="legalLibraryCreateBtn" type="button"><i class="ph ph-file-plus"></i> 新建</button>
                                    <input id="legalUploadInput" class="legal-upload-input" type="file" accept=".pdf,.doc,.docx,.png,.jpg,.jpeg">
                                    <button class="library-secondary-btn" type="button"><i class="ph ph-upload-simple"></i> 导出</button>
                                    <button class="library-danger-btn" type="button"><i class="ph ph-file-x"></i> 批量下架</button>
                                    <button class="library-category-btn" type="button">类别设置</button>
                                </div>
                            </div>

                            <div class="legal-library-filter-bar">
                                <div class="legal-library-filter-fields">
                                    <div class="legal-filter-item wide">
                                        <label>关键字检索</label>
                                        <input type="text" placeholder="搜索名录/条款内容等关键字">
                                    </div>
                                    <div class="legal-filter-item date-range">
                                        <label>上架日期</label>
                                        <input type="text" value="" placeholder="请选择日期">
                                        <span>至</span>
                                        <input type="text" value="" placeholder="请选择日期">
                                    </div>
                                    <div class="legal-filter-item level">
                                        <label>效力能级</label>
                                        <select>
                                            <option>请选择</option>
                                            <option>法律</option>
                                            <option>行政法规</option>
                                            <option>国家标准</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="legal-filter-actions">
                                    <button class="library-search-btn" type="button"><i class="ph ph-magnifying-glass"></i> 查询</button>
                                    <button class="library-reset-btn" type="button"><i class="ph ph-arrow-counter-clockwise"></i> 重置</button>
                                    <button class="library-expand-btn" type="button">展开 <i class="ph ph-caret-down"></i></button>
                                </div>
                            </div>

                            <div class="legal-library-table-wrap">
                                <table class="legal-library-table">
                                    <thead>
                                        <tr>
                                            <th class="col-check"><input type="checkbox"></th>
                                            <th class="col-name">文件名称</th>
                                            <th class="col-code">文号/标准号</th>
                                            <th class="col-date">公布日期</th>
                                            <th class="col-date">施行日期</th>
                                            <th class="col-publisher">发布单位</th>
                                            <th class="col-level">效力级别</th>
                                            <th class="col-category">类别</th>
                                            <th class="col-validity">时效性</th>
                                            <th class="col-date">上架日期</th>
                                            <th class="col-owner">维护人</th>
                                            <th class="col-actions sticky-action">操作</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        ${renderLibraryTableRows()}
                                    </tbody>
                                </table>
                            </div>

                            <div class="legal-library-pagination">
                                <span>共 50 条</span>
                                <span>每页</span>
                                <select>
                                    <option>10</option>
                                </select>
                                <span>条</span>
                                <button type="button"><i class="ph ph-caret-left"></i></button>
                                <button type="button" class="active">1</button>
                                <button type="button">2</button>
                                <button type="button">3</button>
                                <button type="button">4</button>
                                <button type="button">5</button>
                                <span>...</span>
                                <button type="button">100</button>
                                <button type="button"><i class="ph ph-caret-right"></i></button>
                                <span>前往</span>
                                <input type="text" value="5">
                                <span>页</span>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        `;
    }

    function getDetailTemplate() {
        const fileName = escapeHtml(state.selectedFileName);
        const documentName = escapeHtml(state.selectedDocumentName);
        return `
            <div class="scroll-container legal-library-scroll-container">
                <div class="legal-library-detail-page">
                    <section class="legal-detail-card">
                        <div class="legal-detail-section-header">
                            <div class="legal-detail-section-title">基本信息</div>
                            <i class="ph ph-caret-down"></i>
                        </div>
                        <div class="legal-detail-form-grid">
                            <div class="legal-form-item required">
                                <label>文件名称</label>
                                <input type="text" value="${documentName}" placeholder="请输入内容">
                            </div>
                            <div class="legal-form-item required">
                                <label>文号/标准号</label>
                                <input type="text" value="GBT+33579-2017" placeholder="请输入内容">
                            </div>
                            <div class="legal-form-item required">
                                <label>效力能级</label>
                                <select>
                                    <option>请选择</option>
                                    <option selected>国家标准</option>
                                    <option>法律</option>
                                    <option>行政法规</option>
                                </select>
                            </div>
                            <div class="legal-form-item required">
                                <label>类别</label>
                                <select>
                                    <option>请选择</option>
                                    <option selected>安全生产</option>
                                    <option>职业卫生</option>
                                </select>
                            </div>
                            <div class="legal-form-item required">
                                <label>发布单位</label>
                                <input type="text" value="国家质量监督检验检疫总局" placeholder="请输入内容">
                            </div>
                            <div class="legal-form-item">
                                <label>发布地区</label>
                                <select>
                                    <option selected></option>
                                    <option>上海</option>
                                    <option>北京</option>
                                    <option>全国</option>
                                </select>
                            </div>
                            <div class="legal-form-item required">
                                <label>公布日期</label>
                                <input type="text" value="2017-05-12">
                            </div>
                            <div class="legal-form-item required">
                                <label>施行日期</label>
                                <input type="text" value="2017-12-01">
                            </div>
                            <div class="legal-form-item required">
                                <label>时效性</label>
                                <select>
                                    <option selected>现行有效</option>
                                    <option>已失效</option>
                                </select>
                            </div>
                            <div class="legal-form-item full-width textarea-item">
                                <label>备注</label>
                                <textarea placeholder="请输入内容"></textarea>
                                <div class="legal-textarea-count">0/500</div>
                            </div>
                        </div>
                    </section>

                    <section class="legal-detail-card">
                        <div class="legal-detail-upload-title required">附件上传</div>
                        <div class="legal-detail-attachment-wrap">
                            <table class="legal-detail-attachment-table">
                                <thead>
                                    <tr>
                                        <th class="col-index">序号</th>
                                        <th>附件名称</th>
                                        <th class="col-uploader">上传人</th>
                                        <th class="col-upload-time">上传时间</th>
                                        <th class="col-attachment-actions"><button class="legal-add-attachment" type="button">+添加附件</button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>1</td>
                                        <td><a class="library-link" href="javascript:void(0)">${fileName}</a></td>
                                        <td>张三</td>
                                        <td>2025-01-01 08:00:00</td>
                                        <td>
                                            <div class="library-action-group large-gap">
                                                <button class="library-action-btn view" type="button" title="查看"><i class="ph ph-eye"></i></button>
                                                <button class="library-action-btn download" type="button" title="下载"><i class="ph ph-download-simple"></i></button>
                                                <button class="library-action-btn delete" type="button" title="删除"><i class="ph ph-trash"></i></button>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div class="legal-upload-limit"><i class="ph-fill ph-warning-circle"></i> 文件大小不超过20M；</div>
                    </section>

                    <div class="legal-detail-footer-actions">
                        <button class="library-dialog-secondary-btn" id="legalDetailCloseBtn" type="button"><i class="ph ph-x-circle"></i> 关闭</button>
                        <button class="library-primary-btn" type="button"><i class="ph ph-floppy-disk"></i> 保存</button>
                        <button class="library-primary-btn" type="button"><i class="ph ph-note-pencil"></i> 保存并上架</button>
                    </div>
                </div>

                <div class="legal-dialog-mask" id="legalInterpretationDialog" hidden>
                    <div class="legal-dialog legal-confirm-dialog">
                        <div class="legal-dialog-header">
                            <div class="legal-dialog-title">智能文件解读</div>
                            <button class="legal-dialog-close" type="button" data-close-interpretation><i class="ph ph-x"></i></button>
                        </div>
                        <div class="legal-dialog-body interpretation-copy">
                            <div>识别到一份新的法律法规，是否需要智能文件解读。</div>
                            <div>文件解读预计需要5-10分钟，解读完毕后会将解读结果通过待办任务的方式推送给您。</div>
                        </div>
                        <div class="legal-dialog-footer">
                            <button class="library-dialog-secondary-btn" type="button" data-close-interpretation>暂不解读</button>
                            <button class="library-primary-btn" id="legalInterpretationStartBtn" type="button">文件智能解读</button>
                        </div>
                    </div>
                </div>

                <div class="legal-library-toast" id="legalInterpretationToast">
                    <button class="legal-library-toast-close" type="button" aria-label="关闭提醒"><i class="ph ph-x"></i></button>
                    <div class="legal-library-toast-head">
                        <div class="legal-library-toast-icon"><i class="ph-fill ph-file-text"></i></div>
                        <div class="legal-library-toast-title">待办任务</div>
                    </div>
                    <div class="legal-library-toast-text">${interpretationMessageName}文件已解读完毕，请查看解读详情。</div>
                    <div class="legal-library-toast-actions">
                        <button class="library-primary-btn small" id="legalInterpretationViewBtn" type="button">查看</button>
                    </div>
                </div>
            </div>
        `;
    }

    function showElement(element) {
        if (!element) {
            return;
        }
        element.hidden = false;
    }

    function hideElement(element) {
        if (!element) {
            return;
        }
        element.hidden = true;
    }

    function hideToast(root) {
        const toast = root.querySelector('#legalInterpretationToast');
        if (!toast) {
            return;
        }
        toast.classList.remove('visible');
        const timerId = setTimeout(function () {
            toast.classList.add('dismissed');
        }, 220);
        addTimer(timerId);
    }

    function showToast(root) {
        const toast = root.querySelector('#legalInterpretationToast');
        if (!toast) {
            return;
        }
        toast.classList.remove('dismissed');
        const timerId = setTimeout(function () {
            toast.classList.add('visible');
        }, 160);
        addTimer(timerId);
    }

    function bindStatusTabs(root) {
        const tabs = root.querySelectorAll('.legal-status-tab');
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

    function bindTreeItems(root) {
        const items = root.querySelectorAll('.legal-library-tree-item');
        items.forEach(function (item) {
            const handler = function () {
                items.forEach(function (node) {
                    node.classList.remove('active');
                });
                item.classList.add('active');
            };
            item.addEventListener('click', handler);
            addCleanup(function () {
                item.removeEventListener('click', handler);
            });
        });
    }

    function bindUploadDialog(root) {
        const createBtn = root.querySelector('#legalLibraryCreateBtn');
        const input = root.querySelector('#legalUploadInput');

        if (createBtn && input) {
            const openHandler = function () {
                input.click();
            };
            createBtn.addEventListener('click', openHandler);
            addCleanup(function () {
                createBtn.removeEventListener('click', openHandler);
            });
        }

        if (input) {
            const changeHandler = function () {
                const currentFile = input.files && input.files[0] ? input.files[0] : null;
                if (!currentFile) {
                    return;
                }
                state.selectedFileName = currentFile.name;
                state.selectedDocumentName = getDocumentName(state.selectedFileName);
                state.showInterpretationPrompt = true;
                window.AppShell.navigateToPageById('legal_regulation_library_detail');
            };
            input.addEventListener('change', changeHandler);
            addCleanup(function () {
                input.removeEventListener('change', changeHandler);
            });
        }
    }

    function bindDetailActions(root) {
        const closeBtn = root.querySelector('#legalDetailCloseBtn');
        const interpretationDialog = root.querySelector('#legalInterpretationDialog');
        const closeTriggers = root.querySelectorAll('[data-close-interpretation]');
        const startBtn = root.querySelector('#legalInterpretationStartBtn');
        const viewBtn = root.querySelector('#legalInterpretationViewBtn');
        const toastCloseBtn = root.querySelector('.legal-library-toast-close');

        if (closeBtn) {
            const closeHandler = function () {
                window.AppShell.navigateToPageById('legal_regulation_library');
            };
            closeBtn.addEventListener('click', closeHandler);
            addCleanup(function () {
                closeBtn.removeEventListener('click', closeHandler);
            });
        }

        closeTriggers.forEach(function (trigger) {
            const closeInterpretationHandler = function () {
                hideElement(interpretationDialog);
                state.showInterpretationPrompt = false;
            };
            trigger.addEventListener('click', closeInterpretationHandler);
            addCleanup(function () {
                trigger.removeEventListener('click', closeInterpretationHandler);
            });
        });

        if (startBtn) {
            const startHandler = function () {
                hideElement(interpretationDialog);
                state.showInterpretationPrompt = false;
                const timerId = setTimeout(function () {
                    showToast(root);
                }, 600);
                addTimer(timerId);
            };
            startBtn.addEventListener('click', startHandler);
            addCleanup(function () {
                startBtn.removeEventListener('click', startHandler);
            });
        }

        if (viewBtn) {
            const viewHandler = function () {
                hideToast(root);
                openInterpretationResult();
            };
            viewBtn.addEventListener('click', viewHandler);
            addCleanup(function () {
                viewBtn.removeEventListener('click', viewHandler);
            });
        }

        if (toastCloseBtn) {
            const toastCloseHandler = function () {
                hideToast(root);
            };
            toastCloseBtn.addEventListener('click', toastCloseHandler);
            addCleanup(function () {
                toastCloseBtn.removeEventListener('click', toastCloseHandler);
            });
        }

        if (state.showInterpretationPrompt && interpretationDialog) {
            const timerId = setTimeout(function () {
                showElement(interpretationDialog);
            }, 240);
            addTimer(timerId);
        }
    }

    window.LegalRegulationLibraryPage = {
        mount: function (container) {
            disposeAll();
            container.innerHTML = getListTemplate();
            bindStatusTabs(container);
            bindTreeItems(container);
            bindUploadDialog(container);
            return {
                assistantConfig: {
                    sceneId: 'standard_file_interpretation',
                    resetConversation: true
                }
            };
        },
        unmount: function () {
            disposeAll();
        }
    };

    window.LegalRegulationLibraryDetailPage = {
        mount: function (container) {
            disposeAll();
            container.innerHTML = getDetailTemplate();
            bindDetailActions(container);
            return {
                assistantConfig: {
                    sceneId: 'standard_file_interpretation',
                    resetConversation: true
                }
            };
        },
        unmount: function () {
            disposeAll();
        }
    };
})();
