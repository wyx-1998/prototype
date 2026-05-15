(function () {
    function createSectionNode(title, targets, bodyElement, extraClass) {
        const container = document.createElement('div');
        container.className = 'smart-qa-answer-section' + (extraClass ? ' ' + extraClass : '');

        const titleDiv = document.createElement('div');
        titleDiv.className = 'smart-qa-answer-title';
        titleDiv.textContent = title;

        container.appendChild(titleDiv);
        container.appendChild(bodyElement);

        return { container: container, targets: targets };
    }

    function buildSmartQASections(data) {
        const sections = [];

        const conclusionText = document.createElement('div');
        conclusionText.className = 'smart-qa-answer-text';
        sections.push(createSectionNode('结论', [
            { element: conclusionText, text: data.conclusion }
        ], conclusionText));

        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'smart-qa-answer-steps';
        const stepTargets = data.steps.map(function (item, index) {
            const stepLine = document.createElement('div');
            stepLine.className = 'smart-qa-answer-step';
            stepsContainer.appendChild(stepLine);
            return { element: stepLine, text: (index + 1) + '. ' + item };
        });
        sections.push(createSectionNode('步骤', stepTargets, stepsContainer));

        const basisText = document.createElement('div');
        basisText.className = 'smart-qa-answer-text';
        sections.push(createSectionNode('依据', [
            { element: basisText, text: data.basis }
        ], basisText));

        const notesText = document.createElement('div');
        notesText.className = 'smart-qa-answer-text';
        sections.push(createSectionNode('注意事项', [
            { element: notesText, text: data.notes }
        ], notesText));

        return sections;
    }

    function typeTextNode(aiAssistant, element, text, done) {
        let index = 0;
        const cursor = document.createElement('span');
        cursor.className = 'typing-cursor';
        element.appendChild(cursor);

        const type = function () {
            if (index < text.length) {
                const textNode = document.createTextNode(text.charAt(index));
                element.insertBefore(textNode, cursor);
                index += 1;
                aiAssistant.scrollToBottom();
                setTimeout(type, 10);
            } else {
                cursor.remove();
                done();
            }
        };

        type();
    }

    function typeIntoTargets(aiAssistant, targets, targetIndex, done) {
        if (targetIndex >= targets.length) {
            done();
            return;
        }

        const current = targets[targetIndex];
        typeTextNode(aiAssistant, current.element, current.text, function () {
            typeIntoTargets(aiAssistant, targets, targetIndex + 1, done);
        });
    }

    function renderSmartQAContent(aiAssistant, contentDiv, messageDiv, reply, done) {
        contentDiv.className = 'message-content smart-qa-answer';
        const sections = buildSmartQASections(reply.data);
        let sectionIndex = 0;

        const renderNextSection = function () {
            if (sectionIndex >= sections.length) {
                aiAssistant.updateStructuredMessagePayload(messageDiv, {
                    answerHtml: contentDiv.innerHTML
                });
                if (done) done();
                return;
            }

            const section = sections[sectionIndex];
            contentDiv.appendChild(section.container);
            aiAssistant.scrollToBottom();

            typeIntoTargets(aiAssistant, section.targets, 0, function () {
                sectionIndex += 1;
                renderNextSection();
            });
        };

        renderNextSection();
    }

    function createPlainTextTarget(text, className) {
        const element = document.createElement('div');
        element.className = className || 'smart-qa-answer-text';
        return {
            element: element,
            target: { element: element, text: text }
        };
    }

    function buildChipsSection(chips) {
        const wrapper = document.createElement('div');
        wrapper.className = 'report-query-summary';
        chips.forEach(function (chip) {
            const chipNode = document.createElement('span');
            chipNode.className = 'report-query-chip';
            chipNode.textContent = chip;
            wrapper.appendChild(chipNode);
        });
        return createSectionNode('查询条件', [], wrapper, 'report-rich-section');
    }

    function buildKpiSection(metrics) {
        const wrapper = document.createElement('div');
        wrapper.className = 'report-kpi-grid';
        metrics.forEach(function (metric) {
            const card = document.createElement('div');
            card.className = 'report-kpi-card';
            card.innerHTML = [
                '<div class="report-kpi-label">' + metric.label + '</div>',
                '<div class="report-kpi-value">' + metric.value + '</div>',
                '<div class="report-kpi-note">' + metric.note + '</div>'
            ].join('');
            wrapper.appendChild(card);
        });
        return createSectionNode('核心指标', [], wrapper, 'report-rich-section');
    }

    function buildRankSection(title, items) {
        const wrapper = document.createElement('div');
        wrapper.className = 'report-rank-list';
        items.forEach(function (item) {
            const row = document.createElement('div');
            row.className = 'report-rank-item';
            row.innerHTML = [
                '<div class="report-rank-name">' + item.name + '</div>',
                '<div class="report-rank-bar-wrap"><div class="report-rank-bar" style="width:' + item.percent + '%"></div></div>',
                '<div class="report-rank-value">' + item.value + '</div>'
            ].join('');
            wrapper.appendChild(row);
        });
        return createSectionNode(title, [], wrapper, 'report-rich-section');
    }

    function buildTextListSection(title, items, numbered) {
        const wrapper = document.createElement('div');
        wrapper.className = numbered ? 'report-action-list' : 'report-text-list';
        const targets = items.map(function (item, index) {
            const row = document.createElement('div');
            row.className = numbered ? 'report-action-item' : 'report-text-item';
            wrapper.appendChild(row);
            return {
                element: row,
                text: numbered ? (index + 1) + '. ' + item : item
            };
        });
        return createSectionNode(title, targets, wrapper, 'report-rich-section');
    }

    function buildDetailTableSection(table) {
        const wrapper = document.createElement('div');
        wrapper.className = 'report-detail-table-wrap';
        const tableNode = document.createElement('table');
        tableNode.className = 'report-detail-table';
        const head = document.createElement('thead');
        const headRow = document.createElement('tr');
        table.columns.forEach(function (column) {
            const th = document.createElement('th');
            th.textContent = column;
            headRow.appendChild(th);
        });
        head.appendChild(headRow);
        tableNode.appendChild(head);

        const body = document.createElement('tbody');
        table.rows.forEach(function (rowData) {
            const tr = document.createElement('tr');
            rowData.forEach(function (value) {
                const td = document.createElement('td');
                td.textContent = value;
                tr.appendChild(td);
            });
            body.appendChild(tr);
        });
        tableNode.appendChild(body);
        wrapper.appendChild(tableNode);
        return createSectionNode(table.title, [], wrapper, 'report-rich-section');
    }

    function createReportWorkspacePayload(aiAssistant, report) {
        const conversation = aiAssistant && typeof aiAssistant.getCurrentMessages === 'function'
            ? aiAssistant.getCurrentMessages()
            : [];
        const lastUserMessage = conversation.slice().reverse().find(function (item) {
            return item && item.type === 'user';
        });
        const requestText = lastUserMessage && lastUserMessage.content
            ? String(lastUserMessage.content).replace(/<[^>]+>/g, '').trim()
            : '';

        return {
            title: report.title || '',
            requestText: requestText,
            routeName: report.routeName || '',
            summary: report.summary || '',
            inspectionPoints: Array.isArray(report.inspectionPoints) ? report.inspectionPoints : [],
            sections: Array.isArray(report.sections) ? report.sections : [],
            conversation: conversation,
            generatedAt: new Date().toISOString(),
            openPath: report.openPath || ''
        };
    }

    function buildReportSection(report, aiAssistant) {
        const wrapper = document.createElement('div');
        wrapper.className = 'report-report-card';
        const header = document.createElement('div');
        header.className = 'report-report-header';
        const title = document.createElement('div');
        title.className = 'report-report-title';
        title.textContent = report.title;
        header.appendChild(title);
        if (report.openPath) {
            const openReport = function () {
                const storageKey = 'report_workspace_payload:' + report.openPath;
                const payload = createReportWorkspacePayload(aiAssistant, report);
                try {
                    localStorage.setItem(storageKey, JSON.stringify(payload));
                } catch (error) {
                    console.warn('保存报告工作区数据失败:', error);
                }
                window.open(report.openPath, '_blank');
            };
            wrapper.style.cursor = 'pointer';
            wrapper.setAttribute('role', 'button');
            wrapper.tabIndex = 0;
            wrapper.addEventListener('click', openReport);
            wrapper.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openReport();
                }
            });
            const openButton = document.createElement('button');
            openButton.className = 'report-open-btn';
            openButton.innerHTML = '<i class="ph ph-arrows-out-simple"></i> 打开';
            openButton.addEventListener('click', function (event) {
                event.stopPropagation();
                openReport();
            });
            header.appendChild(openButton);
        }
        wrapper.appendChild(header);

        const targets = [];
        report.sections.forEach(function (item) {
            const section = document.createElement('div');
            section.className = 'report-report-section';
            const sectionTitle = document.createElement('div');
            sectionTitle.className = 'report-report-section-title';
            sectionTitle.textContent = item.title;
            const sectionText = document.createElement('div');
            sectionText.className = 'report-report-section-text';
            section.appendChild(sectionTitle);
            section.appendChild(sectionText);
            wrapper.appendChild(section);
            targets.push({ element: sectionText, text: item.text });
        });

        return createSectionNode('报告输出', targets, wrapper, 'report-rich-section');
    }

    function buildReportSections(data, aiAssistant) {
        const sections = [];
        if (data.reportOnly && data.report) {
            sections.push(buildReportSection(data.report, aiAssistant));
            return sections;
        }
        const summary = createPlainTextTarget(data.summary, 'smart-qa-answer-text');
        sections.push(createSectionNode('结论摘要', [summary.target], summary.element, 'report-rich-section'));
        sections.push(buildKpiSection(data.metrics));
        if (data.ranks && data.ranks.length) {
            data.ranks.forEach(function (rank) {
                sections.push(buildRankSection(rank.title, rank.items));
            });
        }
        if (data.insights && data.insights.length) {
            sections.push(buildTextListSection('风险分析', data.insights, true));
        }
        if (data.table) {
            sections.push(buildDetailTableSection(data.table));
        }
        if (data.actions && data.actions.length) {
            sections.push(buildTextListSection('建议动作', data.actions, true));
        }
        if (data.report) {
            sections.push(buildReportSection(data.report, aiAssistant));
        }
        return sections;
    }

    function renderIntelligentReportContent(aiAssistant, contentDiv, messageDiv, reply, done) {
        contentDiv.className = 'message-content smart-qa-answer';
        const sections = buildReportSections(reply.data, aiAssistant);
        let sectionIndex = 0;

        const renderNextSection = function () {
            if (sectionIndex >= sections.length) {
                aiAssistant.updateStructuredMessagePayload(messageDiv, {
                    answerHtml: contentDiv.innerHTML
                });
                if (done) done();
                return;
            }

            const section = sections[sectionIndex];
            contentDiv.appendChild(section.container);
            aiAssistant.scrollToBottom();

            if (!section.targets.length) {
                sectionIndex += 1;
                renderNextSection();
                return;
            }

            typeIntoTargets(aiAssistant, section.targets, 0, function () {
                sectionIndex += 1;
                renderNextSection();
            });
        };

        renderNextSection();
    }

    const enterpriseResult = {
        creditCode: '91330122MADMNPJ3XJ',
        companyName: '杭州涵杰劳务有限公司',
        establishDate: '2024-05-30',
        legalPerson: '章望群',
        registeredCapital: '500',
        companyType: '有限责任公司(自然人独资)',
        registrationAuthority: '桐庐县市场监督管理局',
        registrationDate: '2024-05-30',
        address: '浙江省杭州市桐庐县瑶琳镇后浦村大庙',
        businessScope: '一般项目:劳务服务(不含劳务派遣),装卸搬运;包装服务;城市绿化管理;园林绿化工程施工;物业管理;人力资源服务(不含职业中介活动、劳务派遣服务)(除依法须经批准的项目外,凭营业执照依法自主开展经营活动)。'
    };

    const personnelResult = {
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

    function buildEnterpriseAnswerHtml() {
        return [
            '<div class="analysis-results">',
            '  <div class="ai-card">',
            '      <h4>企业营业执照识别结果</h4>',
            '      <p><strong>统一社会信用代码:</strong> ' + enterpriseResult.creditCode + '</p>',
            '      <p><strong>企业名称:</strong> ' + enterpriseResult.companyName + '</p>',
            '      <p><strong>成立日期:</strong> ' + enterpriseResult.establishDate + '</p>',
            '      <p><strong>法定代表人:</strong> ' + enterpriseResult.legalPerson + '</p>',
            '      <p><strong>注册资本(万元):</strong> ' + enterpriseResult.registeredCapital + '</p>',
            '      <p><strong>类型:</strong> ' + enterpriseResult.companyType + '</p>',
            '      <p><strong>登记机关:</strong> ' + enterpriseResult.registrationAuthority + '</p>',
            '      <p><strong>登记时间:</strong> ' + enterpriseResult.registrationDate + '</p>',
            '      <p><strong>住所:</strong> ' + enterpriseResult.address + '</p>',
            '      <p><strong>经营范围:</strong> ' + enterpriseResult.businessScope + '</p>',
            '      <button class="btn btn-primary insert-btn" onclick="window.CertificateRecognitionPage.insertEnterpriseResult()">',
            '          <i class="ph ph-file-arrow-down"></i> 插入资质基本信息',
            '      </button>',
            '  </div>',
            '</div>'
        ].join('');
    }

    function buildPersonnelAnswerHtml() {
        return [
            '<div class="analysis-results">',
            '  <div class="ai-card">',
            '      <h4>人员证件识别结果</h4>',
            '      <div style="text-align:center; margin:16px 0;">',
            '          <img src="' + personnelResult.avatar + '" alt="人员照片" style="width:80px; height:80px; border-radius:50%; border:2px solid #3366CC;">',
            '      </div>',
            '      <p><strong>姓名:</strong> ' + personnelResult.name + '</p>',
            '      <p><strong>性别:</strong> ' + personnelResult.gender + '</p>',
            '      <p><strong>人员类型:</strong> ' + personnelResult.personnelType + '</p>',
            '      <p><strong>行业类型:</strong> ' + personnelResult.industryType + '</p>',
            '      <p><strong>证号:</strong> ' + personnelResult.certNumber + '</p>',
            '      <p><strong>工作单位:</strong> ' + personnelResult.workUnit + '</p>',
            '      <p><strong>初领日期:</strong> ' + personnelResult.initialDate + '</p>',
            '      <p><strong>有效日期:</strong> ' + personnelResult.validPeriod + '</p>',
            '      <p><strong>培训机构:</strong> ' + personnelResult.trainingOrg + '</p>',
            '      <button class="btn btn-primary insert-btn" onclick="window.CertificateRecognitionPage.insertPersonnelResult()">',
            '          <i class="ph ph-user-plus"></i> 插入人员清单',
            '      </button>',
            '  </div>',
            '</div>'
        ].join('');
    }

    function buildFileInterpretationAnswerHtml(fileMeta) {
        const fileName = fileMeta && fileMeta.name ? fileMeta.name : '标准文件';
        const reportName = fileName.replace(/\.[^.]+$/, '') + '_解读报告.html';
        return [
            '<div class="analysis-results file-interpretation-results">',
            '  <div class="file-interpretation-card" onclick="window.open(\'standard_file_interpretation_report.html\', \'_blank\')">',
            '      <div class="file-interpretation-card-icon">',
            '          <i class="ph ph-file-html"></i>',
            '      </div>',
            '      <div class="file-interpretation-card-info">',
            '          <div class="file-interpretation-card-title">' + reportName + '</div>',
            '          <div class="file-interpretation-card-desc">已生成标准文件解读报告，点击查看网页内容</div>',
            '      </div>',
            '      <div class="file-interpretation-card-action">',
            '          <span>查看</span>',
            '          <i class="ph ph-arrow-square-out"></i>',
            '      </div>',
            '  </div>',
            '</div>'
        ].join('');
    }

    function buildEmergencyPlanSections(data) {
        const sections = [];

        const summaryText = document.createElement('div');
        summaryText.className = 'smart-qa-answer-text';
        sections.push(createSectionNode('事故判断', [
            { element: summaryText, text: data.summary }
        ], summaryText));

        const stepsContainer = document.createElement('div');
        stepsContainer.className = 'smart-qa-answer-steps';
        const stepTargets = data.steps.map(function (item, index) {
            const stepLine = document.createElement('div');
            stepLine.className = 'smart-qa-answer-step';
            stepsContainer.appendChild(stepLine);
            return { element: stepLine, text: (index + 1) + '. ' + item };
        });
        sections.push(createSectionNode('第一时间处置步骤', stepTargets, stepsContainer));

        const rolesContainer = document.createElement('div');
        rolesContainer.className = 'smart-qa-answer-steps';
        const roleTargets = data.roles.map(function (item) {
            const row = document.createElement('div');
            row.className = 'smart-qa-answer-step';
            rolesContainer.appendChild(row);
            return { element: row, text: item.role + '：' + item.task };
        });
        sections.push(createSectionNode('岗位分工', roleTargets, rolesContainer));

        const coordinationContainer = document.createElement('div');
        coordinationContainer.className = 'smart-qa-answer-steps';
        const coordinationTargets = data.coordination.map(function (item, index) {
            const row = document.createElement('div');
            row.className = 'smart-qa-answer-step';
            coordinationContainer.appendChild(row);
            return { element: row, text: (index + 1) + '. ' + item };
        });
        sections.push(createSectionNode('联动与上报', coordinationTargets, coordinationContainer));

        const materialsContainer = document.createElement('div');
        materialsContainer.className = 'smart-qa-answer-steps';
        const materialTargets = data.materials.map(function (item) {
            const row = document.createElement('div');
            row.className = 'smart-qa-answer-step';
            materialsContainer.appendChild(row);
            return { element: row, text: item };
        });
        sections.push(createSectionNode('应急物资', materialTargets, materialsContainer));

        const notesText = document.createElement('div');
        notesText.className = 'smart-qa-answer-text';
        sections.push(createSectionNode('注意事项', [
            { element: notesText, text: data.notes }
        ], notesText));

        const basisText = document.createElement('div');
        basisText.className = 'smart-qa-answer-text';
        sections.push(createSectionNode('依据关联', [
            { element: basisText, text: data.basis }
        ], basisText));

        return sections;
    }

    function renderEmergencyPlanContent(aiAssistant, contentDiv, messageDiv, reply, done) {
        contentDiv.className = 'message-content smart-qa-answer';
        const sections = buildEmergencyPlanSections(reply.data);
        let sectionIndex = 0;

        const renderNextSection = function () {
            if (sectionIndex >= sections.length) {
                aiAssistant.updateStructuredMessagePayload(messageDiv, {
                    answerHtml: contentDiv.innerHTML
                });
                if (done) done();
                return;
            }

            const section = sections[sectionIndex];
            contentDiv.appendChild(section.container);
            aiAssistant.scrollToBottom();

            typeIntoTargets(aiAssistant, section.targets, 0, function () {
                sectionIndex += 1;
                renderNextSection();
            });
        };

        renderNextSection();
    }

    const smartQAReplies = [
        {
            keywords: ['有限空间作业前，现场安全确认要看哪些关键项？', '有限空间作业前现场安全确认要看哪些关键项', '有限空间作业前'],
            thinkingText: '我先判断用户是在询问有限空间作业前的关键确认项，这类问题需要按“作业许可前置条件 + 现场安全措施 + 过程控制”来组织回答。\n\n接着需要把高频关注点整理成几个客户最容易感知的检查项。\n\n最后按结论、步骤、依据和注意事项输出。',
            toolSummaries: [
                '调用制度规则匹配能力，定位有限空间作业相关审批、检测、监护要求。',
                '调用问答组织能力，按现场确认场景重组为可执行步骤。'
            ],
            data: {
                conclusion: '有限空间作业前，必须先完成“作业审批、气体检测、通风置换、监护到位、应急准备”五类关键确认。',
                steps: [
                    '核对作业票、作业人员资质、审批签字是否完整。',
                    '检查进入前气体检测是否合格，检测项目至少覆盖氧气、可燃气体、有毒有害气体。',
                    '确认通风、隔离、断能、警戒等措施已落实。',
                    '确认现场监护人在岗，通信联络和救援器材可立即使用。',
                    '作业过程中按要求复测，条件变化时立即停止作业。'
                ],
                basis: '有限空间作业管理制度、作业许可要求、进入前检测和监护规定。',
                notes: '检测合格不等于全过程安全，作业中仍需持续监护和动态复测。'
            },
            suggestions: [
                '外委动火作业发现监护不到位，现场第一步应该怎么处理？',
                '某类作业票审批不完整，是否允许开工？'
            ]
        },
        {
            keywords: ['外委动火作业发现监护不到位，现场第一步应该怎么处理？', '外委动火作业发现监护不到位现场第一步应该怎么处理', '监护不到位'],
            thinkingText: '这个问题属于现场处置步骤类问答，重点是先给出第一动作。\n\n用户问的是“第一步”，所以回答先给明确结论，再补充后续控制动作。\n\n同时点出外委作业不能弱化监护要求。',
            toolSummaries: [
                '调用动火作业处置规则，核对监护失效场景下的标准动作。',
                '调用处置步骤组织能力，压缩为现场可直接执行的顺序。'
            ],
            data: {
                conclusion: '第一步应立即叫停现场动火作业，先消除监护缺失状态，再决定是否恢复作业。',
                steps: [
                    '立即通知作业人员停止动火并保持现场受控。',
                    '核实监护人员是否脱岗、替岗不合规或根本未到位。',
                    '重新确认动火周边可燃物清理、消防器材、气体检测和隔离措施。',
                    '监护人员补位并复核条件后，由现场负责人判断是否恢复。'
                ],
                basis: '动火作业管理要求通常明确监护人必须全程在岗，监护失效时作业应中止。',
                notes: '外委单位作业也不能以赶工为由替代监护要求。'
            },
            suggestions: [
                '高处作业安全带佩戴有哪些强制要求？',
                '某类作业票审批不完整，是否允许开工？'
            ]
        },
        {
            keywords: ['高处作业安全带佩戴有哪些强制要求？', '高处作业安全带佩戴有哪些强制要求', '安全带佩戴'],
            thinkingText: '这里是防护用品使用规范类问题，客户最关注的是哪些动作绝对不能错。\n\n所以回答围绕高挂低用、可靠挂设和全过程使用几个强约束点展开。\n\n步骤部分保持短句，方便展示。',
            toolSummaries: [
                '调用高处作业规范要点，筛选与安全带佩戴直接相关的强制要求。',
                '调用答案格式化能力，整理成结论加步骤的展示形式。'
            ],
            data: {
                conclusion: '高处作业安全带必须做到“高挂低用、可靠挂设、一人一带、全过程使用”。',
                steps: [
                    '作业前检查安全带本体、连接件和挂点是否完好。',
                    '选择牢固可靠的挂设位置，优先高位挂设。',
                    '调整安全带松紧，保证贴身但不影响操作。',
                    '人员移动或换位时，先确认新的挂点，再解除原挂点。'
                ],
                basis: '高处作业安全管理规范、个体防护用品使用要求。',
                notes: '严禁低挂高用、挂在移动件上，或出现只挂不系、系而不紧的情况。'
            },
            suggestions: [
                '有限空间作业前，现场安全确认要看哪些关键项？',
                '某类作业票审批不完整，是否允许开工？'
            ]
        },
        {
            keywords: ['某类作业票审批不完整，是否允许开工？', '某类作业票审批不完整是否允许开工', '审批不完整'],
            thinkingText: '这是作业许可是否放行的判断问题，核心是先回答能不能开工。\n\n判断标准落在审批链是否完整、措施是否落实、现场是否完成确认这几个条件上。\n\n最后补一句不能用口头同意替代正式审批。',
            toolSummaries: [
                '调用作业许可校验规则，核对审批完整性与开工条件之间的关系。',
                '调用制度依据组织能力，生成简洁的判断结论和补充说明。'
            ],
            data: {
                conclusion: '不允许开工。作业票审批不完整，说明许可条件未闭合，不能进入正式作业状态。',
                steps: [
                    '先核对缺失的是审批签字、现场确认还是附属措施。',
                    '补齐审批链和现场复核记录。',
                    '再次确认作业风险、监护安排、人员资质和防护措施。',
                    '所有许可条件满足后，才能组织开工。'
                ],
                basis: '作业许可制度通常要求审批完整、措施落实、现场确认一致后方可开工。',
                notes: '票证流转完成前，不应以口头同意替代正式审批。'
            },
            suggestions: [
                '外委动火作业发现监护不到位，现场第一步应该怎么处理？',
                '高处作业安全带佩戴有哪些强制要求？'
            ]
        }
    ];

    const emergencyPlanReplies = [
        {
            keywords: ['脱硫区域突发有毒气体泄漏，现场应如何处置？', '脱硫区域突发有毒气体泄漏现场应如何处置', '有毒气体泄漏', '脱硫区域泄漏'],
            thinkingText: '我先识别这是脱硫区域有毒气体泄漏场景，重点是先控险、后处置，并防止无防护人员进入扩散区。\n\n接着联动泄漏源隔离、人员撤离、气体检测和应急抢险几个关键动作。\n\n最后按现场最容易执行的顺序输出处置指引。',
            toolSummaries: [
                '调用有毒气体泄漏预案规则，识别先期控险与撤离要求。',
                '调用应急处置编排能力，生成步骤、岗位分工和联动建议。'
            ],
            plan: {
                summary: '该场景属于有毒气体泄漏事故，第一优先级是隔离泄漏源、组织警戒撤离，并防止人员在未检测、未防护条件下靠近现场。',
                steps: [
                    '立即发出警示，停止周边作业，组织现场人员沿上风向撤离至安全区域。',
                    '第一时间切断相关设备或管线，隔离泄漏源，严禁盲目靠近处置。',
                    '设置警戒区，限制无关人员进入，并持续监测有毒气体浓度和扩散范围。',
                    '抢险人员佩戴空气呼吸器、防化用品后进入现场，实施堵漏、稀释、导排等措施。',
                    '确认浓度恢复至安全范围后，再安排现场复查、通风和恢复评估。'
                ],
                roles: [
                    { role: '现场负责人', task: '统一组织停工、撤离、警戒和对外联络，决定应急升级。' },
                    { role: '监护/巡检人员', task: '引导人员撤离，反馈泄漏位置、扩散方向和现场动态。' },
                    { role: '应急抢险组', task: '在专业防护条件下实施隔离、堵漏和检测。' }
                ],
                coordination: [
                    '通知中控、设备、电仪和消防应急力量同步到场。',
                    '按制度要求向值班领导、生产调度和安全管理部门报告。',
                    '如出现人员中毒或扩散失控，立即启动更高级别应急响应并联动医疗救护。'
                ],
                materials: ['空气呼吸器', '便携式气体检测仪', '防化服', '警戒带', '堵漏工具', '应急洗消物资'],
                notes: '未经检测确认前不得组织人员返回；抢险过程必须全程监测气体浓度，避免二次中毒。',
                basis: '有毒有害气体泄漏现场处置方案、危险化学品应急预案、脱硫区域专项应急卡。'
            },
            suggestions: ['高压设备异常停机并伴随人员轻伤，第一时间要采取哪些措施？', '某区域出现有限空间人员不适，当前的应急步骤和注意事项是什么？']
        },
        {
            keywords: ['高压设备异常停机并伴随人员轻伤，第一时间要采取哪些措施？', '高压设备异常停机并伴随人员轻伤第一时间要采取哪些措施', '高压设备异常停机', '人员轻伤'],
            thinkingText: '这里同时包含设备异常和人员受伤两个事件，现场处置顺序要先保人身安全，再做设备隔离和故障控制。\n\n我会把停电隔离、伤员救护、风险复核和上报协同放在同一条处置链路里。\n\n最后输出现场负责人能直接执行的预案。',
            toolSummaries: [
                '调用电气异常停机处置规则，识别停送电和隔离要求。',
                '调用现场救护流程，组织人员受伤场景的同步动作。'
            ],
            plan: {
                summary: '该场景属于高压设备异常事件并伴随人员轻伤，处置重点是先确保停电隔离和人员脱险，严禁在状态不明的设备附近盲目处置。',
                steps: [
                    '立即停止相关作业，确认设备停运状态并拉开隔离，防止误送电。',
                    '将轻伤人员转移至安全区域，进行止血、包扎等初步救护，必要时联系医务人员。',
                    '设置警戒，禁止无关人员靠近故障设备，核查是否存在余电、起火、冒烟等次生风险。',
                    '由专业电气人员按停送电制度开展验电、挂牌和故障排查。',
                    '待风险消除后，形成事件记录并组织恢复评估。'
                ],
                roles: [
                    { role: '现场负责人', task: '组织停工、隔离、救护和信息上报，控制现场秩序。' },
                    { role: '电气专业人员', task: '执行停送电、验电、挂牌和设备检查。' },
                    { role: '监护人员', task: '看护伤员和警戒区，防止他人误入。' }
                ],
                coordination: [
                    '通知电气专业、值班调度和安全管理人员到场。',
                    '按事件等级向车间、部门负责人和应急值班体系报告。',
                    '如伤情加重或设备伴随火情，立即升级联动医疗和消防力量。'
                ],
                materials: ['验电器', '绝缘手套', '警示牌', '急救箱', '担架', '对讲设备'],
                notes: '未完成验电和挂牌前，不得接触设备本体；对轻伤人员也应持续观察，防止迟发性不适。',
                basis: '高压电气设备停送电管理制度、触电和电气异常处置卡、现场急救管理要求。'
            },
            suggestions: ['外委作业现场发生火情，现场负责人和监护人员分别应该做什么？', '脱硫区域突发有毒气体泄漏，现场应如何处置？']
        },
        {
            keywords: ['外委作业现场发生火情，现场负责人和监护人员分别应该做什么？', '外委作业现场发生火情现场负责人和监护人员分别应该做什么', '外委作业火情', '现场发生火情'],
            thinkingText: '这是外委作业火情场景，客户会重点看“负责人”和“监护人员”是否分工明确。\n\n因此回答要先控火和停工，再分别给出两个岗位的动作清单。\n\n最后补上消防联动和上报要求。',
            toolSummaries: [
                '调用火情初起处置规则，识别停工、报警和初期灭火要求。',
                '调用岗位职责模板，拆分现场负责人和监护人员的动作。'
            ],
            plan: {
                summary: '该场景属于外委作业现场火情，第一时间要停工、报警、控火，并按现场负责人和监护人员职责分头处置。',
                steps: [
                    '立即停止全部作业，切断可燃源、气源和相关电源。',
                    '就近使用灭火器材控制初起火情，同时组织无关人员撤离。',
                    '确认火势是否可控，超出处置能力时立即撤离并等待消防力量。',
                    '封控现场，保护事故区域，为后续调查和复盘保留条件。'
                ],
                roles: [
                    { role: '现场负责人', task: '统一组织停工、报警、人员疏散和应急资源调配，决定是否升级响应。' },
                    { role: '监护人员', task: '第一时间示警、协助灭火、清点人员并持续监测周边风险。' },
                    { role: '外委单位带班人', task: '配合负责人组织本单位人员撤离并报告作业状态。' }
                ],
                coordination: [
                    '立即通知消防控制室、属地管理人员和安全管理部门。',
                    '同步核查动火票、监护记录和可燃物隔离状态。',
                    '出现伤员、复燃或蔓延趋势时，立即联动医疗和专职消防。'
                ],
                materials: ['干粉灭火器', '消防水带', '防火毯', '警戒带', '应急照明', '对讲机'],
                notes: '火情未确认彻底消除前，不得擅自恢复作业；外委人员撤离后应立即清点人数，防止有人滞留。',
                basis: '动火作业应急处置卡、消防应急预案、外委作业现场安全管理制度。'
            },
            suggestions: ['某区域出现有限空间人员不适，当前的应急步骤和注意事项是什么？', '高压设备异常停机并伴随人员轻伤，第一时间要采取哪些措施？']
        },
        {
            keywords: ['某区域出现有限空间人员不适，当前的应急步骤和注意事项是什么？', '某区域出现有限空间人员不适当前的应急步骤和注意事项是什么', '有限空间人员不适', '有限空间'],
            thinkingText: '有限空间人员不适场景的关键是防止盲目施救导致二次伤害。\n\n我会先把停止作业、外部救援、通风检测和受控救援排成前置动作。\n\n最后强调监护、呼吸防护和禁止冒险入内这几个注意事项。',
            toolSummaries: [
                '调用有限空间应急救援规则，识别禁止盲目入内施救的红线。',
                '调用救援步骤编排能力，生成现场可直接执行的应急指引。'
            ],
            plan: {
                summary: '该场景属于有限空间异常人员救援，必须坚持“先通风检测、先外部救援、后受控进入”，严禁无防护人员盲目下井施救。',
                steps: [
                    '立即停止有限空间作业，通知空间内人员撤离，无法自行撤离时启动救援。',
                    '现场监护人第一时间报警并组织外部救援准备，保持持续通风。',
                    '使用检测仪确认氧含量、可燃气体和有毒有害气体情况。',
                    '救援人员佩戴空气呼吸器、安全绳等装备后，按受控方案实施救援。',
                    '将不适人员转移至安全区域，开展现场急救并尽快送医。'
                ],
                roles: [
                    { role: '监护人员', task: '立即示警、呼叫支援、保持联络并禁止无关人员入内。' },
                    { role: '现场负责人', task: '启动受限空间应急处置流程，组织检测、通风和救援力量。' },
                    { role: '救援人员', task: '在呼吸防护和绳索保护条件下实施受控救援。' }
                ],
                coordination: [
                    '通知属地负责人、安全管理、医疗救护和专业救援力量。',
                    '同步调取作业票、检测记录和进入人员信息。',
                    '根据检测结果决定是否扩大警戒和升级响应。'
                ],
                materials: ['空气呼吸器', '便携式气体检测仪', '安全绳', '三脚架或提升装置', '急救箱', '担架'],
                notes: '任何人不得在未检测、未通风、未佩戴呼吸防护条件下进入有限空间；救援全过程都要保留监护和通信。',
                basis: '有限空间作业安全管理制度、受限空间救援预案、现场监护与检测要求。'
            },
            suggestions: ['脱硫区域突发有毒气体泄漏，现场应如何处置？', '外委作业现场发生火情，现场负责人和监护人员分别应该做什么？']
        }
    ];

    const intelligentReportReplies = {
        metric_query: {
            thinkingText: '我先从问题里提取时间范围“近30天”和分析对象“隐患、整改”。\n\n然后关联隐患台账与整改记录，分别统计厂区隐患数量和逾期整改情况。\n\n最后把高风险对象和逾期明细整理成便于演示的摘要。',
            toolSummaries: [
                '解析自然语言中的时间范围、统计对象和指标口径。',
                '关联隐患台账与整改记录样例数据，计算厂区分布和逾期数量。',
                '生成指标卡、排行结果和逾期明细。'
            ],
            data: {
                summary: '近30天隐患数量最多的是跃欣光伏厂区，共发现 18 项隐患；当前逾期整改 4 项，主要集中在输电线路和外委检修类问题。',
                metrics: [
                    { label: '隐患总数', value: '46', note: '较上期 +12%' },
                    { label: '逾期整改', value: '4', note: '较上期 +1 项' },
                    { label: '厂区数', value: '6', note: '已覆盖全部样例厂区' },
                    { label: '闭环率', value: '91%', note: '高于月度基准 3 个点' }
                ],
                ranks: [
                    {
                        title: '厂区隐患数量排行',
                        items: [
                            { name: '跃欣光伏厂区', value: '18', percent: 100 },
                            { name: '二线调配库', value: '11', percent: 61 },
                            { name: '输煤栈桥区域', value: '8', percent: 44 }
                        ]
                    }
                ],
                insights: [
                    '逾期整改问题中，3 项与输电线路缺陷治理有关，说明电气专业整改资源偏紧。',
                    '跃欣光伏厂区隐患高发且整改周期偏长，建议优先安排专项督办。',
                    '外委检修类问题占逾期整改的 50%，需要同步复核外委单位责任人到位情况。'
                ],
                table: {
                    title: '逾期整改明细',
                    columns: ['隐患编号', '厂区/区域', '隐患类型', '整改责任人', '整改期限'],
                    rows: [
                        ['YH-20260420-0003', '跃欣光伏厂区', '输电线路隐患', '马高越', '2026-05-30'],
                        ['YH-20260418-0008', '二线调配库', '临边防护缺失', '李建峰', '2026-05-26'],
                        ['YH-20260417-0012', '跃欣光伏厂区', '外委检修问题', '张海涛', '2026-05-25']
                    ]
                },
                actions: [
                    '对跃欣光伏厂区逾期整改事项设置周度催办。',
                    '对外委检修类问题补查责任单位和现场监护落实情况。',
                    '对输电线路治理安排专项资源，压缩整改周期。'
                ]
            },
            suggestions: [
                '本月高风险作业主要集中在哪些班组？',
                '展开看一下二线调配库的逾期整改明细。',
                '基于以上分析，生成一份本月安全生产分析简报'
            ],
            context: {
                type: 'metric_query',
                timeRange: '近30天',
                focusArea: '跃欣光伏厂区',
                detailArea: '二线调配库'
            }
        },
        risk_distribution: {
            thinkingText: '我先识别出问题是在看“本月高风险作业”的分布情况。\n\n然后按作业票样例数据对班组、区域和作业类型做汇总，找出最集中的几个对象。\n\n最后补充高风险环节和管理建议。',
            toolSummaries: [
                '解析时间范围、风险等级和分组维度。',
                '关联作业票与班组台账，计算高风险作业分布。',
                '输出集中班组排行和主要风险点。'
            ],
            data: {
                summary: '本月高风险作业主要集中在电仪检修班、输电运维班和外委检修协作班，三类班组合计占比达到 72%。',
                metrics: [
                    { label: '高风险作业票', value: '25', note: '较上月 +4 票' },
                    { label: '涉及班组', value: '9', note: '重点集中在 3 个班组' },
                    { label: '动火/高处占比', value: '68%', note: '仍是主要风险源' },
                    { label: '外委参与率', value: '36%', note: '外委作业占比较高' }
                ],
                ranks: [
                    {
                        title: '班组集中度排行',
                        items: [
                            { name: '电仪检修班', value: '9', percent: 100 },
                            { name: '输电运维班', value: '6', percent: 67 },
                            { name: '外委检修协作班', value: '3', percent: 33 }
                        ]
                    },
                    {
                        title: '高风险作业类型分布',
                        items: [
                            { name: '动火作业', value: '11', percent: 100 },
                            { name: '高处作业', value: '6', percent: 55 },
                            { name: '受限空间作业', value: '4', percent: 36 }
                        ]
                    }
                ],
                insights: [
                    '电仪检修班高风险作业频次最高，且动火和高处作业叠加出现。',
                    '输电运维班的高处作业集中在输电线路巡检和缺陷消除，建议强化交叉监护。',
                    '外委检修协作班虽然票数不多，但外委参与率高，需同步关注监护与培训。'
                ],
                actions: [
                    '对电仪检修班开展月度高风险作业复盘。',
                    '对输电运维班补充高处作业专项检查。',
                    '对外委协作班加强作业前安全交底和票证抽查。'
                ]
            },
            suggestions: [
                '最近一季度重复发生最多的隐患类型是什么？',
                '本月外委作业相关问题主要集中在哪几个单位？',
                '基于以上分析，生成一份本月安全生产分析简报'
            ],
            context: {
                type: 'risk_distribution',
                timeRange: '本月',
                focusArea: '电仪检修班'
            }
        },
        repeat_hazard: {
            thinkingText: '我先将问题识别为“最近一季度重复发生隐患类型排行”。\n\n接着按隐患类型做聚合，并回溯关联的班组和场景。\n\n最后输出重复问题、涉及班组和治理建议。',
            toolSummaries: [
                '解析时间范围和统计主题。',
                '对隐患类型样例数据做重复次数聚合。',
                '回溯关联班组与场景，形成治理建议。'
            ],
            data: {
                summary: '最近一季度重复发生最多的是临边防护缺失、临时用电不规范和输电线路附件松动三类问题，说明现场基础管控仍有反复。',
                metrics: [
                    { label: '重复隐患总数', value: '19', note: '占全部隐患 31%' },
                    { label: '高频类型', value: '3', note: '重复出现 3 次以上' },
                    { label: '涉及班组', value: '7', note: '集中在运维和检修班组' },
                    { label: '复发率', value: '41%', note: '高于样例基线 8 个点' }
                ],
                ranks: [
                    {
                        title: '重复隐患类型排行',
                        items: [
                            { name: '临边防护缺失', value: '6', percent: 100 },
                            { name: '临时用电不规范', value: '5', percent: 83 },
                            { name: '输电线路附件松动', value: '4', percent: 67 }
                        ]
                    }
                ],
                insights: [
                    '临边防护缺失在二线调配库和土建施工协作面反复出现，反映现场标准化执行不稳。',
                    '临时用电问题主要出现在检修现场和外委施工区域，建议加强作业前复核。',
                    '输电线路附件松动涉及输电运维班和外委线路班，建议纳入专项治理计划。'
                ],
                actions: [
                    '对高频重复隐患建立问题清单和责任追踪。',
                    '按班组开展针对性复盘，避免同类问题重复闭环失败。',
                    '将临边防护和临时用电纳入专项抽查主题。'
                ]
            },
            suggestions: [
                '本月外委作业相关问题主要集中在哪几个单位？',
                '把这个结果整理成一份专项汇报材料',
                '基于以上分析，生成一份本月安全生产分析简报'
            ],
            context: {
                type: 'repeat_hazard',
                timeRange: '最近一季度',
                focusArea: '临边防护缺失'
            }
        },
        contractor_focus: {
            thinkingText: '我先识别出用户在关注“本月外委作业相关问题”的单位分布。\n\n然后关联外委单位、作业票和问题记录，统计问题集中度。\n\n最后总结高风险单位和需要加强的管理动作。',
            toolSummaries: [
                '解析问题中的时间范围和对象范围。',
                '关联外委作业票、问题记录和责任单位样例数据。',
                '输出单位分布、典型问题和管理建议。'
            ],
            data: {
                summary: '本月外委作业相关问题主要集中在华安检修、金诚装卸和远东电气三个单位，问题类型以作业监护、临时用电和票证不规范为主。',
                metrics: [
                    { label: '外委问题数', value: '11', note: '占本月问题 24%' },
                    { label: '涉及单位', value: '5', note: '主要集中在 3 家单位' },
                    { label: '监护类问题', value: '4', note: '占外委问题 36%' },
                    { label: '票证类问题', value: '3', note: '仍需加强规范性' }
                ],
                ranks: [
                    {
                        title: '外委单位问题集中度',
                        items: [
                            { name: '华安检修', value: '4', percent: 100 },
                            { name: '金诚装卸', value: '3', percent: 75 },
                            { name: '远东电气', value: '2', percent: 50 }
                        ]
                    }
                ],
                insights: [
                    '华安检修的问题主要集中在作业监护不到位和现场票证复核不充分。',
                    '金诚装卸的问题偏向临时用电和人员培训记录缺失。',
                    '远东电气的问题虽然数量不多，但涉及高风险动火作业，需重点跟踪。'
                ],
                actions: [
                    '对高频外委单位开展专项约谈与复盘。',
                    '增加外委作业票证抽查频次。',
                    '对高风险外委作业强化双监护和开工前确认。'
                ]
            },
            suggestions: [
                '基于以上分析，生成一份本月安全生产分析简报',
                '把这个结果整理成一份专项汇报材料',
                '为什么外委作业问题会集中在这些单位？'
            ],
            context: {
                type: 'contractor_focus',
                timeRange: '本月',
                focusArea: '华安检修'
            }
        },
        monthly_report: {
            thinkingText: '我先汇总前面关于隐患、整改、高风险作业和外委问题的分析结果。\n\n然后按“月度简报”的结构组织成概览、风险、重点问题和治理建议四个部分。\n\n最后补充可继续扩展为专项汇报材料的方向。',
            toolSummaries: [
                '汇总近期问数结果，统一统计口径。',
                '生成月度简报结构化内容。',
                '补充风险判断和下阶段建议。'
            ],
            data: {
                summary: '已根据当前样例分析结果生成本月安全生产分析简报，重点结论是隐患高发厂区、逾期整改和外委高风险作业需同步关注。',
                reportOnly: true,
                metrics: [
                    { label: '本月隐患', value: '46', note: '跃欣光伏厂区最多' },
                    { label: '逾期整改', value: '4', note: '集中在输电线路问题' },
                    { label: '高风险作业票', value: '25', note: '电仪检修班最多' },
                    { label: '外委问题', value: '11', note: '华安检修最集中' }
                ],
                insights: [
                    '隐患高发厂区与整改逾期存在叠加，说明专项治理资源需前置。',
                    '高风险作业主要集中在检修和输电运维环节，需加强交叉作业风险控制。',
                    '外委作业问题呈单位集中分布，建议同步强化资质、培训与监护管理。'
                ],
                report: {
                    title: '4 月安全生产分析简报',
                    openPath: 'report_monthly.html',
                    sections: [
                        { title: '一、本期概览', text: '本月共发现隐患 46 项，闭环率 91%。跃欣光伏厂区隐患数量最高，当前逾期整改 4 项，主要集中在输电线路和外委检修问题。' },
                        { title: '二、重点风险', text: '高风险作业主要集中在电仪检修班、输电运维班和外委检修协作班，其中动火和高处作业占比最高。外委作业问题集中在华安检修、金诚装卸和远东电气。' },
                        { title: '三、典型问题', text: '重复发生较多的问题包括临边防护缺失、临时用电不规范和输电线路附件松动，说明现场基础管理与标准化执行仍有反复。' },
                        { title: '四、治理建议', text: '建议对高发厂区和高频班组开展专项复盘，对逾期整改建立周度催办机制，对高风险外委作业强化开工前确认和双监护要求。' }
                    ]
                },
                actions: [
                    '继续生成专项汇报材料。',
                    '对跃欣光伏厂区输出专项治理清单。',
                    '对外委单位输出专题分析。'
                ]
            },
            suggestions: [
                '把这个结果整理成一份专项汇报材料',
                '再补一段风险研判和下月治理建议。',
                '展开看一下二线调配库的逾期整改明细。'
            ],
            context: {
                type: 'monthly_report',
                timeRange: '本月',
                focusArea: '综合分析'
            }
        },
        special_report: {
            thinkingText: '我先基于前面的分析结果，判断用户需要的是“专项汇报材料”而不是简版月报。\n\n因此我补充风险研判、重点对象和跟踪事项，使输出更像正式汇报材料。\n\n最后保留后续可继续扩写的空间。',
            toolSummaries: [
                '继承前一轮分析口径，整理为专项汇报结构。',
                '补充风险研判、重点对象和跟踪事项。',
                '输出可继续扩写的汇报材料版本。'
            ],
            data: {
                summary: '已将当前问数结果整理为专项汇报材料，适合向管理层演示“从问到数、从数到材料”的闭环。',
                reportOnly: true,
                metrics: [
                    { label: '重点厂区', value: '1', note: '跃欣光伏厂区' },
                    { label: '重点班组', value: '3', note: '高风险作业最集中' },
                    { label: '重点外委单位', value: '3', note: '需专项督导' },
                    { label: '重点问题类型', value: '3', note: '重复发生较多' }
                ],
                insights: [
                    '从厂区维度看，跃欣光伏厂区同时承担隐患高发和整改逾期双重压力。',
                    '从作业维度看，高风险作业集中在检修和输电运维环节，现场动态风险高。',
                    '从外委维度看，单位集中度较高，建议纳入月度督导清单。'
                ],
                report: {
                    title: '安全生产专项汇报材料',
                    openPath: 'report_special.html',
                    sections: [
                        { title: '一、总体情况', text: '本期安全生产运行总体可控，但隐患高发厂区、逾期整改和高风险外委作业叠加出现，需要重点关注。' },
                        { title: '二、主要风险', text: '跃欣光伏厂区隐患数量居高，输电线路类问题整改周期偏长；电仪检修班、输电运维班和外委检修协作班高风险作业集中；外委问题集中在华安检修等单位。' },
                        { title: '三、重点对象', text: '建议将跃欣光伏厂区、电仪检修班和华安检修列为近期重点跟踪对象，并对临边防护、临时用电和输电线路缺陷治理开展专项排查。' },
                        { title: '四、下一步安排', text: '对逾期整改实施周度督办，对高风险作业开展班组级复盘，对外委单位实施资质、培训、票证和监护的联合检查。' }
                    ]
                },
                actions: [
                    '补一段风险研判和下月治理建议。',
                    '继续下钻到具体厂区或班组。',
                    '按外委单位拆出专题分析。'
                ]
            },
            suggestions: [
                '再补一段风险研判和下月治理建议。',
                '为什么外委作业问题会集中在这些单位？',
                '展开看一下二线调配库的逾期整改明细。'
            ],
            context: {
                type: 'special_report',
                timeRange: '本月',
                focusArea: '专项汇报'
            }
        },
        detail_follow_up: {
            thinkingText: '我先判断这是基于上一轮结果的下钻追问，重点是“展开看一下二线调配库的逾期整改明细”。\n\n因此保持上一轮统计口径不变，只聚焦到指定区域的整改明细。\n\n最后补一段原因判断，方便继续追问。',
            toolSummaries: [
                '复用上一轮分析上下文和统计口径。',
                '按指定区域过滤逾期整改明细。',
                '补充下钻结果与原因提示。'
            ],
            data: {
                summary: '二线调配库当前共有 2 项逾期整改，均与临边防护和临时用电基础管理有关，整改责任均落在检修协作面。',
                metrics: [
                    { label: '逾期项数', value: '2', note: '均已超过期限 3 天以上' },
                    { label: '责任班组', value: '2', note: '检修协作面较集中' },
                    { label: '主要问题', value: '2类', note: '临边防护 + 临时用电' },
                    { label: '平均逾期', value: '4天', note: '需尽快闭环' }
                ],
                table: {
                    title: '二线调配库逾期整改明细',
                    columns: ['隐患编号', '问题描述', '责任班组', '责任人', '整改期限'],
                    rows: [
                        ['YH-20260418-0008', '临边防护缺失，警示围栏未恢复', '检修协作一班', '李建峰', '2026-05-26'],
                        ['YH-20260415-0011', '临时配电箱接地线松脱', '检修协作二班', '王志强', '2026-05-27']
                    ]
                },
                insights: [
                    '两项问题都属于基础管理类问题，说明复工后的现场标准化恢复不到位。',
                    '责任班组较集中，适合直接安排现场复盘。'
                ],
                actions: [
                    '对二线调配库组织现场复核。',
                    '把同类基础管理问题纳入周度检查清单。'
                ]
            },
            suggestions: [
                '为什么这些问题会重复发生？',
                '基于以上分析，生成一份本月安全生产分析简报',
                '把这个结果整理成一份专项汇报材料'
            ],
            context: {
                type: 'detail_follow_up',
                timeRange: '近30天',
                focusArea: '二线调配库'
            }
        },
        advice_follow_up: {
            thinkingText: '我先识别出这是在上一轮结果基础上补充“风险研判和下月治理建议”。\n\n因此不再重复统计数据，而是直接给出判断和下一步动作。\n\n输出保持简洁，适合放进简报或汇报材料里。',
            toolSummaries: [
                '继承上一轮分析上下文。',
                '提炼风险趋势和治理优先级。',
                '补充下月治理建议文本。'
            ],
            data: {
                summary: '从当前样例分析结果看，下月需要重点防范隐患高发厂区与高风险外委作业叠加带来的治理压力。',
                metrics: [
                    { label: '重点厂区', value: '跃欣光伏', note: '隐患高发且逾期偏多' },
                    { label: '重点班组', value: '电仪检修班', note: '高风险作业最集中' },
                    { label: '重点单位', value: '华安检修', note: '外委问题最集中' },
                    { label: '重点问题', value: '3类', note: '重复发生较多' }
                ],
                insights: [
                    '若不提前投放整改资源，跃欣光伏厂区的输电线路治理可能继续拖长闭环周期。',
                    '高风险作业和外委作业存在叠加时，监护和票证失效概率会上升。',
                    '重复隐患多为基础管理问题，说明班组层面的标准化执行需要再压实。'
                ],
                actions: [
                    '对重点厂区建立月初专项排查清单。',
                    '对高风险班组实施周度复盘和抽查。',
                    '对重点外委单位开展票证、培训和监护联合检查。'
                ]
            },
            suggestions: [
                '把这个结果整理成一份专项汇报材料',
                '本月外委作业相关问题主要集中在哪几个单位？',
                '展开看一下二线调配库的逾期整改明细。'
            ],
            context: {
                type: 'advice_follow_up',
                timeRange: '本月',
                focusArea: '治理建议'
            }
        },
        reason_follow_up: {
            thinkingText: '我先判断用户是在追问原因，不是要新的统计结果。\n\n因此我沿用上一轮外委单位分布结果，从资质、培训、作业组织和现场监护几个角度解释。\n\n最后补上针对性的整改动作。',
            toolSummaries: [
                '继承外委单位分布分析上下文。',
                '从单位管理、现场执行和监护机制三个维度解释原因。',
                '补充针对性改进建议。'
            ],
            data: {
                summary: '外委作业问题之所以集中在这几家单位，核心原因是高风险作业承接量高、现场人员流动快，以及票证和监护执行稳定性不足。',
                metrics: [
                    { label: '高风险作业承接量', value: '高', note: '集中在 3 家单位' },
                    { label: '人员流动性', value: '偏高', note: '新进场人员较多' },
                    { label: '票证规范性', value: '偏弱', note: '抽查问题较集中' },
                    { label: '监护稳定性', value: '不足', note: '现场执行波动较大' }
                ],
                insights: [
                    '高风险作业承接量大，导致这几家单位暴露的问题数量也更高。',
                    '外委人员流动快，培训与交底覆盖不稳，容易出现基础问题反复发生。',
                    '票证和现场监护执行依赖带班人经验，稳定性不足。'
                ],
                actions: [
                    '对重点外委单位实行进场前集中培训。',
                    '对高风险外委作业提高票证抽查频次。',
                    '将现场监护到位情况纳入专项考核。'
                ]
            },
            suggestions: [
                '基于以上分析，生成一份本月安全生产分析简报',
                '把这个结果整理成一份专项汇报材料',
                '再补一段风险研判和下月治理建议。'
            ],
            context: {
                type: 'reason_follow_up',
                timeRange: '本月',
                focusArea: '外委单位原因'
            }
        }
    };

    function createReportReply(definition) {
        return {
            thinkingText: definition.thinkingText,
            toolSummaries: definition.toolSummaries,
            suggestions: definition.suggestions,
            data: definition.data,
            contextSnapshot: definition.context,
            renderContent: function (assistant, contentDiv, messageDiv, done) {
                renderIntelligentReportContent(assistant, contentDiv, messageDiv, this, done);
            }
        };
    }

    function parseReportIntent(context, state) {
        const normalized = context.normalizedText || '';
        const previousType = state.lastAnalysisContext && state.lastAnalysisContext.type ? state.lastAnalysisContext.type : '';

        if (normalized.includes('专项汇报材料') || normalized.includes('专项汇报')) {
            return 'special_report';
        }
        if (normalized.includes('分析简报') || normalized.includes('月报') || normalized.includes('简报')) {
            return 'monthly_report';
        }
        if (normalized.includes('补一段') || normalized.includes('下月治理建议') || normalized.includes('风险研判')) {
            return 'advice_follow_up';
        }
        if (normalized.includes('为什么') && previousType === 'contractor_focus') {
            return 'reason_follow_up';
        }
        if (normalized.includes('展开看') || normalized.includes('具体是哪些') || normalized.includes('明细')) {
            return 'detail_follow_up';
        }
        if (normalized.includes('外委') && normalized.includes('单位')) {
            return 'contractor_focus';
        }
        if (normalized.includes('重复发生') || normalized.includes('隐患类型')) {
            return 'repeat_hazard';
        }
        if (normalized.includes('高风险作业') || normalized.includes('班组')) {
            return 'risk_distribution';
        }
        if (normalized.includes('隐患数量') || normalized.includes('整改逾期') || normalized.includes('哪个厂区')) {
            return 'metric_query';
        }
        if (normalized.includes('为什么')) {
            return 'reason_follow_up';
        }
        return '';
    }

    const reportSceneState = {
        lastAnalysisContext: null
    };

    function renderWorkbenchPushList(aiAssistant, listElement, items, done) {
        let index = 0;

        const renderNext = function () {
            if (index >= items.length) {
                done();
                return;
            }

            const row = document.createElement('div');
            row.className = 'workbench-push-list-item';
            listElement.appendChild(row);
            aiAssistant.scrollToBottom();

            typeTextNode(aiAssistant, row, items[index], function () {
                index += 1;
                renderNext();
            });
        };

        renderNext();
    }

    function renderWorkbenchPushContent(aiAssistant, contentDiv, messageDiv, reply, done) {
        contentDiv.className = 'message-content';

        const root = document.createElement('div');
        root.className = 'workbench-push-card';
        contentDiv.appendChild(root);

        const summary = document.createElement('div');
        summary.className = 'workbench-push-summary';
        root.appendChild(summary);
        aiAssistant.scrollToBottom();

        typeTextNode(aiAssistant, summary, reply.data.summary, function () {
            const kpiGrid = document.createElement('div');
            kpiGrid.className = 'workbench-push-kpi-grid';
            root.appendChild(kpiGrid);

            reply.data.kpis.forEach(function (item) {
                const card = document.createElement('div');
                card.className = 'workbench-push-kpi';

                const label = document.createElement('div');
                label.className = 'workbench-push-kpi-label';
                label.textContent = item.label;

                const value = document.createElement('div');
                value.className = 'workbench-push-kpi-value' + (item.danger ? ' danger' : '');

                card.appendChild(label);
                card.appendChild(value);
                kpiGrid.appendChild(card);
            });
            aiAssistant.scrollToBottom();

            typeIntoTargets(aiAssistant, reply.data.kpis.map(function (item, index) {
                return {
                    element: kpiGrid.children[index].querySelector('.workbench-push-kpi-value'),
                    text: item.value
                };
            }), 0, function () {
                const todoSection = document.createElement('div');
                todoSection.className = 'workbench-push-section';
                todoSection.innerHTML = '<div class="workbench-push-section-title">今日工作清单</div><div class="workbench-push-list"></div>';
                root.appendChild(todoSection);

                const todoList = todoSection.querySelector('.workbench-push-list');
                aiAssistant.scrollToBottom();

                renderWorkbenchPushList(aiAssistant, todoList, reply.data.todoItems, function () {
                    const riskCard = document.createElement('div');
                    riskCard.className = 'workbench-push-risk-card';
                    riskCard.innerHTML = [
                        '<div class="workbench-push-risk-title"></div>',
                        '<div class="workbench-push-risk-block">',
                        '    <div class="workbench-push-risk-subtitle">作业内容注意事项</div>',
                        '    <div class="workbench-push-list workbench-push-notes-list"></div>',
                        '</div>',
                        '<div class="workbench-push-risk-block">',
                        '    <div class="workbench-push-risk-subtitle">常见风险</div>',
                        '    <div class="workbench-push-list workbench-push-risks-list"></div>',
                        '</div>'
                    ].join('');
                    root.appendChild(riskCard);

                    const riskTitle = riskCard.querySelector('.workbench-push-risk-title');
                    aiAssistant.scrollToBottom();

                    typeTextNode(aiAssistant, riskTitle, reply.data.riskTitle, function () {
                        const notesList = riskCard.querySelector('.workbench-push-notes-list');
                        aiAssistant.scrollToBottom();

                        renderWorkbenchPushList(aiAssistant, notesList, reply.data.notes, function () {
                            const risksList = riskCard.querySelector('.workbench-push-risks-list');
                            aiAssistant.scrollToBottom();

                            renderWorkbenchPushList(aiAssistant, risksList, reply.data.risks, function () {
                                aiAssistant.updateStructuredMessagePayload(messageDiv, {
                                    answerHtml: contentDiv.innerHTML
                                });
                                if (done) done();
                            });
                        });
                    });
                });
            });
        });
    }

    const workbenchPushReply = {
        data: {
            summary: '您好，张三。今日待处理工作已整理完成：当前有 3 条审批待办、2 条待办任务，其中 1 条作业票待开工，建议优先核查现场条件与风险管控措施。',
            kpis: [
                { label: '审批待办', value: '3' },
                { label: '待办任务', value: '2' },
                { label: '待开工作业票', value: '1', danger: true }
            ],
            todoItems: [
                '完成 3 条审批待办的节点确认，重点查看动火、受限空间和临时用电手续是否齐全。',
                '处理 2 条待办任务，优先跟进现场开工前安全交底与作业条件确认。',
                '其中 1 条作业票计划于今日 09:30 开工，建议开工前再次确认监护、隔离、检测、个体防护四类措施。'
            ],
            riskTitle: '待开工作业票：受限空间清淤作业',
            notes: [
                '开工前确认作业票、检测记录、监护人安排和应急器材到位。',
                '复核气体检测结果，保持连续通风，严格执行先检测、再进入、后作业。',
                '作业过程中保持对讲联络，禁止单人进入，交叉作业时同步核查能量隔离状态。'
            ],
            risks: [
                '有毒有害气体积聚、缺氧窒息。',
                '监护缺位导致异常处置不及时。',
                '临时用电、照明设备不合规引发触电或火灾。'
            ]
        },
        renderContent: function (assistant, contentDiv, messageDiv, done) {
            renderWorkbenchPushContent(assistant, contentDiv, messageDiv, this, done);
        }
    };

    const inspectionRoutes = {
        route_1: {
            routeId: 'route_1',
            routeName: '智能巡检路线1',
            summary: '本次巡检共覆盖 3 个重点点位，发现 2 处异常，涉及作业票执行偏差和现场防护缺失。',
            suggestions: ['继续查看巡检报告详情', '切换到智能巡检路线2再演示一次'],
            points: [
                {
                    name: '脱硫塔北侧平台',
                    camera: '摄像机画面显示平台通道畅通，作业人员 2 人在位，临边区域有物料临时堆放。',
                    permit: '关联动火作业票 JT-20260430-013，监护人已到位，但票面上的结束时间仍显示为 09:00，未按现场延期情况更新。',
                    hazard: '识别到一处临边警戒带缺失，平台边缘存在临时放置工具箱，可能影响人员通行。',
                    issues: ['作业票延期信息未同步更新', '平台临边警戒带缺失'],
                    status: '存在问题',
                    advice: '补录作业票延期审批信息，并立即恢复临边警戒隔离。'
                },
                {
                    name: '石膏浆液管廊转角',
                    camera: '摄像机巡检画面清晰，区域内无异常滞留人员，照明和通道状态正常。',
                    permit: '关联高处作业票 GZ-20260430-004，作业人员、监护人和防坠落措施信息完整。',
                    hazard: '未发现明显隐患，区域内材料摆放规范，交叉作业隔离到位。',
                    issues: [],
                    status: '正常',
                    advice: '保持当前作业组织方式，继续执行班中抽查。'
                },
                {
                    name: '吸收塔检修吊篮点',
                    camera: '画面显示吊篮下方设置了围栏，但现场有 1 名外委人员未佩戴护目镜。',
                    permit: '关联高处作业票 GZ-20260430-009，票证齐全，但个人防护抽查结果未填写。',
                    hazard: '识别到外委作业人员个体防护不到位，吊篮下方警示牌角度偏移。',
                    issues: ['外委人员未佩戴护目镜', '个体防护抽查记录缺失'],
                    status: '存在问题',
                    advice: '立即补齐个体防护，并在作业票中补录现场抽查记录。'
                }
            ]
        },
        route_2: {
            routeId: 'route_2',
            routeName: '智能巡检路线2',
            summary: '本次巡检共覆盖 3 个重点点位，整体状态平稳，仅发现 1 处轻微整改项。',
            suggestions: ['打开智能巡检报告查看详情', '返回巡检主页面重新选择路线'],
            points: [
                {
                    name: '脱硫循环泵平台',
                    camera: '摄像机画面显示平台区域无积水，作业人员佩戴防护完整，现场秩序正常。',
                    permit: '关联检维修作业票 JW-20260430-021，作业内容、监护人和危险点交底记录齐全。',
                    hazard: '未发现明显异常。',
                    issues: [],
                    status: '正常',
                    advice: '继续保持当前作业票执行质量。'
                },
                {
                    name: '烟道检修平台',
                    camera: '摄像机识别到平台一侧灭火器摆放被检修材料局部遮挡。',
                    permit: '关联动火作业票 DH-20260430-006，审批链完整，气体检测记录有效。',
                    hazard: '灭火器取用通道受阻，属于轻微整改项。',
                    issues: ['灭火器前方材料堆放影响快速取用'],
                    status: '存在问题',
                    advice: '移开遮挡物，确保消防器材前方 1 米范围畅通。'
                },
                {
                    name: '烟囱外部巡检步道',
                    camera: '巡检步道照明正常，护栏完整，未识别到人员违规停留。',
                    permit: '关联巡检作业确认单 XJ-20260430-002，责任人和巡检时段信息完整。',
                    hazard: '未发现异常。',
                    issues: [],
                    status: '正常',
                    advice: '保持当前巡检节奏。'
                }
            ]
        }
    };

    function buildInspectionReport(route) {
        const abnormalCount = route.points.filter(function (item) {
            return item.status !== '正常';
        }).length;
        return {
            title: '智能巡检报告',
            openPath: 'intelligent_inspection_report.html',
            routeName: route.routeName,
            summary: route.summary,
            abnormalCount: abnormalCount,
            sections: [
                { title: '巡检路线', text: route.routeName },
                { title: '巡检概览', text: route.summary },
                { title: '异常点位', text: abnormalCount ? ('共 ' + abnormalCount + ' 个点位存在问题，已生成问题清单和整改建议。') : '本次巡检点位均为正常状态。' }
            ],
            inspectionPoints: route.points.map(function (point, index) {
                return {
                    title: '点位' + (index + 1) + '：' + point.name,
                    camera: point.camera,
                    permit: point.permit,
                    hazard: point.hazard,
                    issues: point.issues,
                    status: point.status,
                    advice: point.advice
                };
            })
        };
    }

    function renderInspectionPoint(aiAssistant, root, point, index, done) {
        const card = document.createElement('div');
        const isNormal = point.status === '正常';
        card.className = 'smart-qa-answer-section report-rich-section';
        card.innerHTML = [
            '<div class="smart-qa-answer-title">点位' + (index + 1) + '：' + point.name + '</div>',
            '<div class="report-query-summary inspection-progress-summary">',
            '  <span class="report-query-chip inspection-progress-chip active">正在巡检</span>',
            '</div>',
            '<div class="report-text-list">',
            '  <div class="report-text-item"></div>',
            '  <div class="report-text-item"></div>',
            '  <div class="report-text-item"></div>',
            '</div>',
            '  <div class="report-action-list inspection-issue-list"></div>',
            '  <div class="report-query-summary inspection-status-summary" style="display:none;">',
            '      <span class="report-query-chip inspection-status-chip ' + (isNormal ? 'success' : 'danger') + '">状态：' + point.status + '</span>',
            '      <span class="report-query-chip inspection-complete-chip">✓ 已完成</span>',
            '  </div>',
            '</div>'
        ].join('');
        root.appendChild(card);
        aiAssistant.scrollToBottom();

        const items = card.querySelectorAll('.report-text-item');
        const issueList = card.querySelector('.inspection-issue-list');
        const progressChip = card.querySelector('.inspection-progress-chip');
        const statusSummary = card.querySelector('.inspection-status-summary');
        const targets = [
            { element: items[0], text: '摄像机巡检：' + point.camera },
            { element: items[1], text: '关联作业票检查：' + point.permit },
            { element: items[2], text: '隐患分析：' + point.hazard }
        ];

        typeIntoTargets(aiAssistant, targets, 0, function () {
            const finalizePoint = function () {
                if (progressChip) {
                    progressChip.classList.remove('active');
                    progressChip.classList.add('done');
                    progressChip.textContent = '点位巡检完成';
                }
                if (statusSummary) {
                    statusSummary.style.display = '';
                }
                if (done) done();
            };

            if (point.issues && point.issues.length) {
                point.issues.forEach(function (issue, issueIndex) {
                    const row = document.createElement('div');
                    row.className = 'report-action-item';
                    issueList.appendChild(row);
                    targets.push({ element: row, text: '问题' + (issueIndex + 1) + '：' + issue });
                });
                const advice = document.createElement('div');
                advice.className = 'report-action-item';
                issueList.appendChild(advice);
                targets.push({ element: advice, text: '处置建议：' + point.advice });
                typeIntoTargets(aiAssistant, targets.slice(3), 0, function () {
                    finalizePoint();
                });
                return;
            }

            const normalRow = document.createElement('div');
            normalRow.className = 'report-action-item';
            issueList.appendChild(normalRow);
            typeIntoTargets(aiAssistant, [
                { element: normalRow, text: '检查结论：正常。' }
            ], 0, function () {
                finalizePoint();
            });
        });
    }

    function renderInspectionContent(aiAssistant, contentDiv, messageDiv, reply, done) {
        contentDiv.className = 'message-content smart-qa-answer';
        const summary = document.createElement('div');
        summary.className = 'smart-qa-answer-section report-rich-section';
        summary.innerHTML = '<div class="smart-qa-answer-title">巡检任务</div><div class="smart-qa-answer-text"></div>';
        contentDiv.appendChild(summary);
        aiAssistant.scrollToBottom();

        const summaryText = summary.querySelector('.smart-qa-answer-text');
        typeTextNode(aiAssistant, summaryText, reply.data.summary, function () {
            let pointIndex = 0;
            const renderNextPoint = function () {
                if (pointIndex >= reply.data.points.length) {
                    const reportSection = buildReportSection(reply.data.report, aiAssistant);
                    contentDiv.appendChild(reportSection.container);
                    aiAssistant.scrollToBottom();
                    typeIntoTargets(aiAssistant, reportSection.targets, 0, function () {
                        aiAssistant.updateStructuredMessagePayload(messageDiv, {
                            answerHtml: contentDiv.innerHTML
                        });
                        if (done) done();
                    });
                    return;
                }

                renderInspectionPoint(aiAssistant, contentDiv, reply.data.points[pointIndex], pointIndex, function () {
                    pointIndex += 1;
                    renderNextPoint();
                });
            };

            renderNextPoint();
        });
    }

    const scenes = {
        hidden_danger: {
            id: 'hidden_danger',
            createRecognitionReply: function () {
                return {
                    render: function (assistant) {
                        assistant.simulateAIAnalysisWithThinking();
                    }
                };
            },
            resolveReply: function () {
                return null;
            }
        },
        certificate_recognition: {
            id: 'certificate_recognition',
            createEnterpriseReply: function () {
                if (window.CertificateRecognitionPage) {
                    window.CertificateRecognitionPage.setLatestEnterpriseResult(enterpriseResult);
                }
                return {
                    thinkingText: '我先识别上传文件的证照类型，再抽取统一社会信用代码、企业名称、法定代表人和有效字段。\n\n接着按表单字段顺序整理成可直接回填的结果。',
                    toolSummaries: [
                        '调用企业证照识别能力，提取营业执照关键字段。',
                        '调用字段映射能力，按页面表单顺序组织输出。'
                    ],
                    answerHtml: buildEnterpriseAnswerHtml(),
                    suggestions: ['还可以继续识别其他企业资质附件吗？']
                };
            },
            createPersonnelReply: function () {
                if (window.CertificateRecognitionPage) {
                    window.CertificateRecognitionPage.setLatestPersonnelResult(personnelResult);
                }
                return {
                    thinkingText: '我先识别人证图片中的姓名、证号、工种和有效期，再补齐入场清单需要的展示字段。\n\n最后整理为可直接插入人员清单的记录。',
                    toolSummaries: [
                        '调用人员证件识别能力，提取身份和资质字段。',
                        '调用入场清单映射能力，生成可插入记录。'
                    ],
                    answerHtml: buildPersonnelAnswerHtml(),
                    suggestions: ['继续识别下一张人员证件']
                };
            },
            resolveReply: function (context) {
                const text = context.text || '';
                const normalizedText = context.normalizedText || '';
                const extras = context.extras || {};
                const mode = extras.mode || '';

                if (mode === 'enterprise') {
                    return this.createEnterpriseReply();
                }
                if (mode === 'personnel') {
                    return this.createPersonnelReply();
                }
                if (text.includes('人员证件') || text.includes('人员信息') || normalizedText.includes('人员证件')) {
                    return this.createPersonnelReply();
                }
                if (text.includes('企业资质') || text.includes('营业执照') || text.includes('证照')) {
                    return this.createEnterpriseReply();
                }
                return null;
            }
        },
        smart_qa: {
            id: 'smart_qa',
            resolveReply: function (context) {
                const normalized = context.normalizedText || '';
                const matched = smartQAReplies.find(function (item) {
                    return item.keywords.some(function (keyword) {
                        return normalized.includes(keyword.replace(/\s+/g, ''));
                    });
                });

                if (!matched) {
                    return null;
                }

                return {
                    thinkingText: matched.thinkingText,
                    toolSummaries: matched.toolSummaries,
                    suggestions: matched.suggestions,
                    data: matched.data,
                    renderContent: function (assistant, contentDiv, messageDiv, done) {
                        renderSmartQAContent(assistant, contentDiv, messageDiv, matched, done);
                    }
                };
            }
        },
        workbench_push: {
            id: 'workbench_push',
            resolveReply: function (context) {
                const extras = context.extras || {};
                if (extras.intent === 'daily_push') {
                    return workbenchPushReply;
                }
                return null;
            }
        },
        intelligent_report: {
            id: 'intelligent_report',
            reset: function () {
                reportSceneState.lastAnalysisContext = null;
            },
            resolveReply: function (context) {
                const intent = parseReportIntent(context, reportSceneState);
                if (!intent || !intelligentReportReplies[intent]) {
                    return null;
                }
                const reply = createReportReply(intelligentReportReplies[intent]);
                reportSceneState.lastAnalysisContext = reply.contextSnapshot || null;
                return reply;
            }
        },
        intelligent_inspection: {
            id: 'intelligent_inspection',
            resolveReply: function (context) {
                const extras = context.extras || {};
                const text = context.text || '';
                const shouldStart = extras.intent === 'start_inspection' || text.includes('智能巡检路线');
                if (!shouldStart) {
                    return null;
                }
                const route = inspectionRoutes[extras.routeId] || inspectionRoutes.route_1;
                const report = buildInspectionReport(route);
                return {
                    thinkingText: '我先确认本次巡检路线和覆盖点位，再调取对应摄像机画面、关联作业票和隐患规则库。\n\n接着按点位逐一完成现场巡检、票证核验和隐患分析，并同步记录每个点位的结论。\n\n全部点位完成后，我会自动汇总生成智能巡检报告。',
                    toolSummaries: [
                        '调用智能巡检路线配置，确认巡检点位顺序。',
                        '调用摄像机巡检能力，分析点位现场画面。',
                        '调用作业票关联检查能力，核验现场票证执行情况。',
                        '调用隐患分析能力，生成问题清单和整改建议。'
                    ],
                    data: {
                        summary: route.routeName + '已启动，本次将依次完成 ' + route.points.length + ' 个点位的巡检任务。',
                        points: route.points,
                        report: report
                    },
                    renderContent: function (assistant, contentDiv, messageDiv, done) {
                        renderInspectionContent(assistant, contentDiv, messageDiv, this, done);
                    },
                    suggestions: route.suggestions,
                    thinkingStepDelay: 760,
                    toolStepDelay: 620,
                    finalDelayMs: 900
                };
            }
        },
        emergency_plan_generation: {
            id: 'emergency_plan_generation',
            resolveReply: function (context) {
                const normalized = context.normalizedText || '';
                const matched = emergencyPlanReplies.find(function (item) {
                    return item.keywords.some(function (keyword) {
                        return normalized.includes(keyword.replace(/\s+/g, ''));
                    });
                });

                if (!matched) {
                    return null;
                }

                return {
                    thinkingText: matched.thinkingText,
                    toolSummaries: matched.toolSummaries,
                    data: matched.plan,
                    renderContent: function (assistant, contentDiv, messageDiv, done) {
                        renderEmergencyPlanContent(assistant, contentDiv, messageDiv, { data: matched.plan }, done);
                    },
                    suggestions: matched.suggestions,
                    thinkingStepDelay: 520,
                    toolStepDelay: 420,
                    finalDelayMs: 700
                };
            }
        },
        standard_file_interpretation: {
            id: 'standard_file_interpretation',
            resolveReply: function (context) {
                const normalized = context.normalizedText || '';
                const attachments = Array.isArray(context.attachments) ? context.attachments : [];
                const hasFiles = attachments.some(function (item) {
                    return item && !item.isImage;
                });

                if (!hasFiles) {
                    return null;
                }

                if (!normalized.includes('解读') || !normalized.includes('文件')) {
                    return null;
                }

                const fileMeta = attachments.find(function (item) {
                    return item && !item.isImage;
                }) || null;

                return {
                    thinkingText: '我先读取上传文件的文档内容，确认标题、章节结构和关键条款范围。\n\n接着按标准解读场景提炼核心主题，判断这份文件主要关注的制度要求、适用对象和执行边界。\n\n然后把文档内容重组为适合阅读的解读报告结构，包括摘要、重点条款、适用场景和执行提示。\n\n最后生成网页化解读报告，并输出可点击的报告文件卡片。',
                    toolSummaries: [
                        '调用文档内容识别工具，提取标题、章节和关键段落。',
                        '调用条款解读工具，归纳重点要求与适用场景。',
                        '调用报告生成工具，组织为 HTML 解读报告页面。',
                        '调用结果发布能力，生成可点击的网页报告入口。'
                    ],
                    answerHtml: buildFileInterpretationAnswerHtml(fileMeta),
                    suggestions: ['这份文件重点变化是什么？', '帮我提炼适合班组宣贯的要点'],
                    thinkingElapsedLabel: '5m32s',
                    thinkingStepDelay: 520,
                    toolStepDelay: 420,
                    finalDelayMs: 700
                };
            }
        }
    };

    window.AIAssistantScenes = {
        getScene: function (sceneId) {
            return scenes[sceneId] || null;
        },
        getEnterpriseResult: function () {
            return enterpriseResult;
        },
        getPersonnelResult: function () {
            return personnelResult;
        }
    };
})();
