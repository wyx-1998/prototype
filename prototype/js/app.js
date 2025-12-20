// App Router and Layout Manager

document.addEventListener('DOMContentLoaded', () => {
    console.log("Prototype App v3.0 Loaded - with Demo Scenarios");
    // Navigation Handling
    const navItems = document.querySelectorAll('.nav-item[data-target]');
    const mainContent = document.getElementById('main-content');

    // State
    let currentView = 'dashboard';

    // Router Function
    function renderView(viewName) {
        // Update Nav UI
        navItems.forEach(item => {
            if (item.getAttribute('data-target') === viewName) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });

        // Render Content
        switch (viewName) {
            case 'dashboard':
                mainContent.innerHTML = getDashboardHTML();
                break;
            case 'chat':
                mainContent.innerHTML = getChatHTML();
                setupChatInteractions(); // Re-attach listeners
                break;
            case 'ledger':
                mainContent.innerHTML = getLedgerHTML();
                break;
            case 'creator':
                mainContent.innerHTML = getCreatorHTML();
                break;
            case 'stats':
                mainContent.innerHTML = getStatsHTML(); // Placeholder
                break;
            default:
                mainContent.innerHTML = getDashboardHTML();
        }
    }

    // Event Listeners for Nav
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            const target = item.getAttribute('data-target');
            currentView = target;
            renderView(target);
        });
    });

    // Initial Render
    renderView('dashboard');

    // --- View Templates ---

    // --- View Templates & Logic ---

    function getDashboardHTML() {
        return `
            <div class="dashboard-hero">
                <div class="hero-greeting">下午好，张三</div>
                <div class="hero-subtitle">今天想处理什么工作？</div>
                <div class="omni-box">
                    <i class="ph ph-sparkle" style="color:var(--primary-color); font-size:1.2rem"></i>
                    <input type="text" class="omni-input" placeholder="向 AI 提问，或搜索知识库..." onkeypress="if(event.key==='Enter') document.querySelector('[data-target=chat]').click()">
                    <button class="icon-btn" style="color:var(--primary-color)"><i class="ph ph-arrow-right"></i></button>
                </div>
            </div>

            <div class="launchpad-grid">
                <div class="launch-card" onclick="document.querySelector('[data-target=chat]').click()">
                    <div class="launch-icon" style="background:#e6f4ff; color:#1677ff">
                        <i class="ph ph-chat-circle-text"></i>
                    </div>
                    <div class="launch-title">智能对话助手</div>
                    <div class="launch-desc">
                        多模态交互，支持法规查询、隐患分析与写作辅助。
                    </div>
                </div>
                <div class="launch-card" onclick="document.querySelector('[data-target=creator]').click()">
                    <div class="launch-icon" style="background:#f6ffed; color:#52c41a">
                         <i class="ph ph-file-text"></i>
                    </div>
                    <div class="launch-title">内容创作中心</div>
                    <div class="launch-desc">
                        基于文档的沉浸式编辑器，内置 AI 润色与续写工具。
                    </div>
                </div>
                <div class="launch-card" onclick="document.querySelector('[data-target=ledger]').click()">
                    <div class="launch-icon" style="background:#fff7e6; color:#faad14">
                        <i class="ph ph-table"></i>
                    </div>
                    <div class="launch-title">全维数据台账</div>
                    <div class="launch-desc">
                        隐患、检查、题库等多维数据管理与快速检索。
                    </div>
                </div>
            </div>

            <div class="recent-section">
            <div class="section-title" style="margin-bottom:1rem; font-size:1rem; color:#666">历史对话 (History)</div>
            <div class="file-list-item" onclick="document.querySelector('[data-target=chat]').click()">
                <i class="ph ph-chat-circle" style="margin-right:1rem; color:var(--primary-color); font-size:1.5rem"></i>
                <div style="flex:1">
                    <div style="font-weight:500; margin-bottom:0.25rem">隐患整改通知书起草</div>
                    <div style="font-size:0.75rem; color:#999">昨天 16:20 · 包含 3 条生成记录</div>
                </div>
                <button class="icon-btn"><i class="ph ph-caret-right"></i></button>
            </div>
            <div class="file-list-item" onclick="document.querySelector('[data-target=chat]').click()">
                <i class="ph ph-chat-circle" style="margin-right:1rem; color:var(--primary-color); font-size:1.5rem"></i>
                 <div style="flex:1">
                    <div style="font-weight:500; margin-bottom:0.25rem">临时用电规范查询</div>
                    <div style="font-size:0.75rem; color:#999">前天 09:15 · 引用了《GB50194》</div>
                </div>
                <button class="icon-btn"><i class="ph ph-caret-right"></i></button>
            </div>
        </div>
    `;
    }

    function getChatHTML() {
        return `
            <div class="chat-layout">
                <div class="chat-history">
                    <div class="brand" style="padding:1.5rem; border-bottom:1px solid #f0f0f0">
                        <div class="logo-icon"><i class="ph ph-robot"></i></div>
                        <div class="brand-text">安全助手</div>
                    </div>
                    <div class="history-list">
                        <div class="history-header" style="padding-left:0.5rem">历史对话</div>
                        <div class="history-group">
                            <div class="history-label">今天</div>
                            <div class="history-item"><i class="ph ph-chat-circle"></i> 隐患整改通知书起草</div>
                            <div class="history-item"><i class="ph ph-chat-circle"></i> 临时用电规范查询</div>
                        </div>
                        <div class="history-group">
                            <div class="history-label">昨天</div>
                            <div class="history-item"><i class="ph ph-chat-circle"></i> 动火作业审批流程</div>
                            <div class="history-item"><i class="ph ph-chat-circle"></i> 灭火器检查记录分析</div>
                        </div>
                    </div>
                </div>
                <div class="chat-main">
                    <div class="chat-header">
                        <div style="font-weight:600">智能对话 (Smart Chat)</div>
                        <div style="font-size:0.875rem">
                            <a href="embedded_demo.html" target="_blank" style="color:var(--primary-color); text-decoration:none">
                                <i class="ph ph-arrow-square-out"></i> 打开嵌入式演示
                            </a>
                        </div>
                    </div>
                    <div id="chat-messages-container" class="chat-messages">
                        <div class="message ai">
                            <div class="message-avatar"><i class="ph ph-robot"></i></div>
                            <div class="message-content">
                                <p>您好！我是您的安全生产AI助手。全能型业务伙伴，支持以下场景演示：</p>
                                <div style="margin-top:1rem; display:flex; gap:0.5rem; flex-wrap:wrap">
                                    <button class="btn-secondary" onclick="sendQuickMsg('查询《安全生产法》关于教育培训的规定')">
                                        <i class="ph ph-magnifying-glass"></i> 法规查询
                                    </button>
                                    <button class="btn-secondary" onclick="sendQuickMsg('这张照片里的配电箱有什么隐患？')">
                                        <i class="ph ph-warning"></i> 隐患辨识
                                    </button>
                                    <button class="btn-secondary" onclick="sendQuickMsg('帮我写一份年度安全培训计划大纲')">
                                        <i class="ph ph-pen-nib"></i> 公文写作
                                    </button>
                                    <button class="btn-secondary" onclick="sendQuickMsg('批量分析今日现场巡检照片并生成报告')">
                                        <i class="ph ph-images"></i> 批量巡检
                                    </button>
                                    <button class="btn-secondary" onclick="sendQuickMsg('分析本月隐患分布趋势')">
                                        <i class="ph ph-chart-bar"></i> 数据洞察
                                    </button>
                                    <button class="btn-secondary" onclick="sendQuickMsg('审核承包商资质文件')">
                                        <i class="ph ph-seal-check"></i> 资质审核
                                    </button>
                                      <button class="btn-secondary" onclick="sendQuickMsg('批量上传人员证件生成花名册')">
                                        <i class="ph ph-identification-card"></i> 人员建档
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="chat-input-area">
                        <div class="input-wrapper">
                            <textarea class="chat-input" placeholder="输入消息..." rows="1"></textarea>
                            <div class="input-actions">
                                <div class="input-tools">
                                    <button class="icon-btn"><i class="ph ph-link"></i></button>
                                    <button class="icon-btn"><i class="ph ph-image"></i></button>
                                    <button class="icon-btn"><i class="ph ph-microphone"></i></button>
                                </div>
                                <button id="send-msg-btn" class="send-btn">
                                    <i class="ph ph-paper-plane-right"></i> 发送
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // --- Content Creator Logic ---
    let currentDocName = '';

    function getCreatorHTML() {
        // Default to File Dashboard
        return `
            <div id="creator-container" class="creator-layout" style="background:var(--bg-color); display:block; padding:2rem; overflow-y:auto">
                ${getCreatorDashboardContent()}
            </div>
        `;
    }

    function getCreatorDashboardContent() {
        return `
             <div style="max-width:1000px; margin:0 auto">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; gap:1rem">
                    <h2 style="font-size:1.5rem; font-weight:600; white-space:nowrap">创作中心</h2>
                    
                    <div style="flex:1; max-width:400px; position:relative">
                        <i class="ph ph-magnifying-glass" style="position:absolute; left:10px; top:50%; transform:translateY(-50%); color:#999"></i>
                        <input type="text" placeholder="搜索文档或文件夹..." style="width:100%; padding:0.5rem 1rem 0.5rem 2.2rem; border-radius:8px; border:1px solid #d9d9d9; outline:none">
                    </div>

                    <div style="display:flex; gap:0.5rem">
                         <button class="btn-secondary" onclick="alert('新建文件夹功能演示')"><i class="ph ph-folder-plus"></i> 新建文件夹</button>
                         <button class="send-btn" onclick="openDoc('未命名文档')"><i class="ph ph-plus"></i> 新建文档</button>
                    </div>
                </div>
                
                <div style="margin-bottom:2rem">
                    <div class="section-title">我的文件夹</div>
                    <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:1rem">
                        <div class="launch-card" style="height:auto; align-items:center; flex-direction:row; padding:1rem" onclick="openFolder('培训教材')">
                             <i class="ph ph-folder" style="font-size:1.5rem; color:#ffd666; margin-right:0.5rem"></i>
                             <div style="font-weight:500">培训教材</div>
                        </div>
                        <div class="launch-card" style="height:auto; align-items:center; flex-direction:row; padding:1rem" onclick="openFolder('安全月报')">
                             <i class="ph ph-folder" style="font-size:1.5rem; color:#ffd666; margin-right:0.5rem"></i>
                             <div style="font-weight:500">安全月报</div>
                        </div>
                        <div class="launch-card" style="height:auto; align-items:center; flex-direction:row; padding:1rem" onclick="openFolder('应急预案')">
                             <i class="ph ph-folder" style="font-size:1.5rem; color:#ffd666; margin-right:0.5rem"></i>
                             <div style="font-weight:500">应急预案</div>
                        </div>
                    </div>
                </div>

                <div class="section-title">我的文档 (My Works)</div>
                <div class="launchpad-grid" style="padding:0; gap:1.5rem; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
                    <div class="launch-card" style="height:auto; min-height:180px; align-items:flex-start" onclick="openDoc('2025年度全员安全生产培训教材')">
                         <div class="launch-icon" style="background:#fff1f0; color:#ff4d4f; width:40px; height:40px; font-size:1.2rem; margin-bottom:1rem">
                            <i class="ph ph-file-pdf"></i>
                        </div>
                        <div class="launch-title" style="font-size:1rem">2025年度全员安全生产培训教材</div>
                        <div class="launch-desc" style="font-size:0.75rem; margin-top:auto">
                            2小时前 编辑 <br>
                            状态: <span style="color:#52c41a">已完成</span>
                        </div>
                    </div>

                    <div class="launch-card" style="height:auto; min-height:180px; align-items:flex-start" onclick="openDoc('12月安全隐患整改通知书')">
                         <div class="launch-icon" style="background:#e6f4ff; color:#1677ff; width:40px; height:40px; font-size:1.2rem; margin-bottom:1rem">
                            <i class="ph ph-file-doc"></i>
                        </div>
                        <div class="launch-title" style="font-size:1rem">12月安全隐患整改通知书</div>
                        <div class="launch-desc" style="font-size:0.75rem; margin-top:auto">
                            昨天 14:30 编辑 <br>
                            状态: <span style="color:#faad14">草稿</span>
                        </div>
                    </div>

                    <div class="launch-card" style="height:auto; min-height:180px; align-items:flex-start; border:1px dashed #d9d9d9; background:#fafafa; justify-content:center; align-items:center" onclick="openDoc('未命名文档')">
                         <div style="font-size:2rem; color:#d9d9d9; margin-bottom:0.5rem">
                            <i class="ph ph-plus"></i>
                        </div>
                        <div style="color:#999; font-weight:500">新建文档</div>
                    </div>
                </div>
             </div>
        `;
    }

    // Mock Folder Data
    const folderData = {
        '培训教材': [
            { title: '2025新员工入职培训PPT', type: 'ppt', status: '已归档' },
            { title: '特种作业人员考核试卷', type: 'exam', status: '进行中' },
            { title: '消防器材使用手册v2.0', type: 'pdf', status: '已发布' }
        ],
        '安全月报': [
            { title: '2024年11月安全生产月报', type: 'doc', status: '已归档' },
            { title: '2024年12月安全隐患汇总', type: 'xls', status: '编制中' },
            { title: '近期事故案例分析', type: 'ppt', status: '草稿' }
        ],
        '应急预案': [
            { title: '综合应急预案_2025版', type: 'doc', status: '审核中' },
            { title: '触电事故现场处置方案', type: 'doc', status: '已发布' },
            { title: '火灾逃生演练记录表', type: 'xls', status: '已归档' }
        ]
    };

    window.openFolder = (folderName) => {
        const container = document.getElementById('creator-container');
        if (container) {
            container.innerHTML = getCreatorFolderContent(folderName);
            container.scrollTop = 0;
        }
    };

    function getCreatorFolderContent(folderName) {
        const files = folderData[folderName] || [];
        const fileCards = files.map(file => `
            <div class="launch-card" style="height:auto; min-height:150px; align-items:flex-start" onclick="openDoc('${file.title}')">
                <div class="launch-icon" style="background:#f0f5ff; color:#2f54eb; width:36px; height:36px; font-size:1.1rem; margin-bottom:0.8rem">
                    <i class="ph ph-file-text"></i>
                </div>
                <div class="launch-title" style="font-size:0.95rem">${file.title}</div>
                <div class="launch-desc" style="font-size:0.75rem; margin-top:auto">
                    类型: ${file.type.toUpperCase()} <br>
                    状态: ${file.status}
                </div>
            </div>
        `).join('');

        return `
            <div style="max-width:1000px; margin:0 auto">
                <div style="margin-bottom:2rem; display:flex; align-items:center;">
                    <button class="icon-btn" onclick="backToCreatorDashboard()" style="margin-right:1rem; background:#fff; border:1px solid #ddd; width:32px; height:32px">
                        <i class="ph ph-caret-left"></i>
                    </button>
                    <h2 style="font-size:1.5rem; font-weight:600;">${folderName}</h2>
                </div>
                
                <div class="section-title">文件列表 (${files.length})</div>
                <div class="launchpad-grid" style="padding:0; gap:1rem; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));">
                    ${fileCards}
                     <div class="launch-card" style="height:auto; min-height:150px; align-items:center; justify-content:center; border:1px dashed #d9d9d9; background:#fafafa" onclick="openDoc('新建${folderName}文档')">
                         <i class="ph ph-plus" style="font-size:1.5rem; color:#ccc; margin-bottom:0.5rem"></i>
                         <div style="color:#999">新建文件</div>
                    </div>
                </div>
            </div>
        `;
    }

    function getMockDocContent(title) {
        if (title.includes("计划") || title.includes("大纲")) {
            return `
                <h2>1. 编制目的</h2>
                <p>为进一步加强公司安全生产管理，提高全员安全素质，预防和减少生产安全事故，依据《安全生产法》及相关规定，制定本年度培训计划。</p>
                <br>
                <h2>2. 培训对象与学时</h2>
                <p><strong>2.1 新员工：</strong> 岗前安全培训时间不得少于 24 学时。</p>
                <p><strong>2.2 特种作业人员：</strong> 必须经专门的安全技术培训并考核合格，取得其《特种作业操作证》。</p>
                <br>
                <h2>3. 培训内容</h2>
                <h3>3.1 公司级（一级）教育</h3>
                <p>国家安全生产法律法规、公司安全规章制度、典型事故案例分析。</p>
                <h3>3.2 车间级（二级）教育</h3>
                <p>本车间作业特点、危险因素、应急处置方案。</p>
                <br>
                <h2>4. 考核方式</h2>
                <p>采用笔试与实操相结合的方式，80分以上为合格。</p>
            `;
        } else if (title.includes("教材") || title.includes("知识")) {
            return `
                <div style="background:#f9f9f9; padding:1rem; border-left:4px solid var(--primary-color); margin-bottom:1rem">
                    <strong>摘要：</strong> 本教材旨在普及基础安全知识，适用于全员年度再培训。
                </div>
                <h2>第一章 安全生产基础概念</h2>
                <p>安全生产是指在生产经营活动中，为了避免造成人员伤害和财产损失，而采取并执行的各种安全技术和管理措施。</p>
                <br>
                <h2>第二章 常见危险作业安全要求</h2>
                <h3>2.1 动火作业</h3>
                <p>动火作业前必须办理审批手续，清理现场易燃物，并配备灭火器材。</p>
                <h3>2.2 高处作业</h3>
                <p>凡在坠落高度基准面 2m 以上（含 2m）有可能坠落的高处进行作业，称为高处作业。必须佩戴安全带。</p>
                <br>
                <h2>第三章 事故应急与自救</h2>
                <p>发生事故后，应立即启动应急预案，优先抢救人员...</p>
            `;
        } else if (title.includes("通知书") || title.includes("整改")) {
            return `
                <p><strong>致：A生产车间</strong></p>
                <p>经 2024年12月19日 现场安全检查，发现你部门存在以下安全隐患，现责令限期整改。</p>
                <hr>
                <h3>一、 隐患内容</h3>
                <p>1. 3号配电箱箱门未关闭，且缺失警示标识。</p>
                <p>2. 消防通道堆放杂物（纸箱），堵塞疏散路线。</p>
                <br>
                <h3>二、 整改要求</h3>
                <p>1. 立即清理消防通道杂物，确保畅通。</p>
                <p>2. 修复配电箱门锁，并补贴"当心触电"警示标识。</p>
                <br>
                <h3>三、 整改期限</h3>
                <p>请于 <strong>2024年12月21日</strong> 前完成整改，并提交整改反馈单。</p>
                <br>
                <div style="margin-top:2rem; display:flex; justify-content:space-between">
                    <span>检查人：张三</span>
                    <span>签收人：___________</span>
                </div>
            `;
        } else if (title.includes("试卷") || title.includes("考试")) {
            return `
                <div style="text-align:center; padding-bottom:1rem; border-bottom:1px dashed #ccc; margin-bottom:1rem">
                    <p>考试时间：60分钟  总分：100分</p>
                    <p>姓名：__________  部门：__________</p>
                </div>
                <h2>一、单选题（每题5分，共50分）</h2>
                <p>1. 我国安全生产方针是（ ）。</p>
                <p>A. 安全第一，预防为主，综合治理</p>
                <p>B. 质量第一，兼顾安全</p>
                <p>C. 安全至上</p>
                <br>
                <p>2. 灭火器压力表指针指示在（ ）区域代表压力正常。</p>
                <p>A. 红色区   B. 黄色区   C. 绿色区</p>
                <br>
                <h2>二、判断题（每题5分，共50分）</h2>
                <p>1. 从业人员有权拒绝违章指挥和强令冒险作业。（ √ ）</p>
                <p>2. 发生火灾时，应乘坐电梯迅速逃生。（ × ）</p>
            `;
        } else if (title.includes("月报") || title.includes("汇报")) {
            return `
                <div style="text-align:center; color:#666; margin-bottom:1rem">报告月份：2024年12月 | 编制部门：安全环保部</div>
                <h2>一、本月安全生产综述</h2>
                <p>本月全厂安全形势总体平稳，无重伤及以上事故发生。全月累计安全生产 31 天。</p>
                <br>
                <h2>二、隐患排查治理情况</h2>
                <p>本月共组织综合检查 4 次，专项检查 2 次。</p>
                <ul>
                    <li>发现隐患总数：45 项</li>
                    <li>已整改：44 项</li>
                    <li>整改率：97.8%</li>
                </ul>
                <br>
                <h2>三、下月重点工作计划</h2>
                <p>1. 开展春节前安全大检查。</p>
                <p>2. 完成年度安全责任状签订工作。</p>
            `;
        } else if (title.includes("预案")) {
            return `
                <div style="background:#fff1f0; border:1px solid #ffa39e; padding:1rem; border-radius:4px; margin-bottom:1rem; color:#d9363e">
                    <strong>⚠️ 注意：</strong> 本预案适用于公司内部火灾、触电等突发事故的应急处置。
                </div>
                <h2>1. 总则</h2>
                <p>为建立健全突发事故应急机制，提高公司处置突发事件的能力，最大程度地预防和减少突发事件及其造成的损害，保障员工生命安全，制定本预案。</p>
                <br>
                <h2>2. 组织机构与职责</h2>
                <h3>2.1 应急指挥部</h3>
                <p>总指挥：总经理</p>
                <p>副总指挥：安全总监、生产副总</p>
                <br>
                <h2>3. 应急响应流程</h2>
                <p><strong>3.1 报警与接警</strong></p>
                <p>事故发生后，第一发现人应立即向应急指挥部报告，并拨打内线电话 8888。</p>
                <p><strong>3.2 紧急疏散</strong></p>
                <p>听到警报后，所有人员应立即停止工作，沿疏散通道撤离至紧急集合点。</p>
            `;
        } else {
            return `
                <h2>1. 核心概述</h2>
                <p>为贯彻落实"安全第一、预防为主"的方针，提高全员安全意识...</p>
                <br>
                <h2>2. 详细规定</h2>
                <p>根据《中华人民共和国安全生产法》（2021修正版）第25条规定...</p>
                <h3>2.1 责任制</h3>
                <p>各级管理人员应当履行...</p>
                <h3>2.2 流程图</h3>
                <p>[此处插入流程图表]</p>
                <br>
                <h2>3. 附录参考</h2>
                <p>附录A：相关表格模板</p>
            `;
        }
    }

    function getCreatorEditorContent(docTitle) {
        // Dynamic Buttons based on context
        let actionButtonsHTML = "";

        if (docTitle.includes("试卷")) {
            actionButtonsHTML = `
                <div class="sidebar-action-btn" onclick="alert('即将导入题库...')">
                    <i class="ph ph-exam" style="color:#faad14"></i>
                    <div class="btn-title">导入题库</div>
                    <div class="btn-desc">提取知识点转习题</div>
                </div>
                <div class="sidebar-action-btn" onclick="alert('已推送至业务系统')">
                    <i class="ph ph-cloud-arrow-up" style="color:#1677ff"></i>
                    <div class="btn-title">导入业务系统</div>
                    <div class="btn-desc">同步至培训平台</div>
                </div>
            `;
        } else if (docTitle.includes("培训") || docTitle.includes("教材")) {
            actionButtonsHTML = `
                <div class="sidebar-action-btn" onclick="alert('正在解析并导入知识库...')">
                    <i class="ph ph-books" style="color:#52c41a"></i>
                    <div class="btn-title">导入知识库</div>
                    <div class="btn-desc">更新企业知识库</div>
                </div>
                <div class="sidebar-action-btn" onclick="alert('已推送至业务系统')">
                    <i class="ph ph-cloud-arrow-up" style="color:#1677ff"></i>
                    <div class="btn-title">导入业务系统</div>
                    <div class="btn-desc">同步至培训平台</div>
                </div>
            `;
        } else if (docTitle.includes("法规") || docTitle.includes("制度") || docTitle.includes("通知")) {
            actionButtonsHTML = `
                <div class="sidebar-action-btn" onclick="alert('正在解析并导入知识库...')">
                    <i class="ph ph-books" style="color:#52c41a"></i>
                    <div class="btn-title">导入知识库</div>
                    <div class="btn-desc">更新法规数据库</div>
                </div>
                <div class="sidebar-action-btn" onclick="alert('已推送至业务系统')">
                    <i class="ph ph-cloud-arrow-up" style="color:#1677ff"></i>
                    <div class="btn-title">导入业务系统</div>
                    <div class="btn-desc">同步至公文系统</div>
                </div>
            `;
        } else {
            actionButtonsHTML = `
                <div class="sidebar-action-btn" onclick="alert('已发送邮件')">
                    <i class="ph ph-envelope-simple" style="color:#ff4d4f"></i>
                    <div class="btn-title">邮件发送</div>
                    <div class="btn-desc">分发给相关人员</div>
                </div>
                <div class="sidebar-action-btn" onclick="alert('已推送至业务系统')">
                    <i class="ph ph-cloud-arrow-up" style="color:#1677ff"></i>
                    <div class="btn-title">导入业务系统</div>
                    <div class="btn-desc">同步至办公OA</div>
                </div>
            `;
        }

        return `
            <div class="creator-layout">
                <!-- Left Sidebar: Feature Actions -->
                <div class="structure-sidebar">
                    <div class="structure-header">
                        <button class="icon-btn" onclick="backToCreatorDashboard()" style="margin-right:0.5rem"><i class="ph ph-caret-left"></i></button>
                        <span>文档处理</span>
                    </div>
                    <div class="sidebar-action-group" style="padding:1rem; overflow-y:auto">
                        ${actionButtonsHTML}
                        <div class="sidebar-action-btn" onclick="alert('版本已保存')">
                            <i class="ph ph-floppy-disk"></i>
                            <div class="btn-title">保存版本</div>
                            <div class="btn-desc">创建当前快照</div>
                        </div>
                    </div>
                </div>

                <!-- Center: Editor with Floating TOC -->
                <div class="editor-area" style="position:relative">
                    
                    <!-- Floating TOC -->
                    <div class="floating-toc">
                        <div class="floating-toc-title">章节导航</div>
                        <div class="toc-item active" style="font-size:0.8rem">1. 核心概述</div>
                        <div class="toc-item" style="font-size:0.8rem">2. 详细规定</div>
                        <div class="toc-item" style="font-size:0.8rem; padding-left:1rem">2.1 责任制</div>
                        <div class="toc-item" style="font-size:0.8rem; padding-left:1rem">2.2 流程图</div>
                        <div class="toc-item" style="font-size:0.8rem">3. 附录参考</div>
                    </div>

                    <div class="editor-toolbar">
                        <button class="icon-btn">H1</button>
                        <button class="icon-btn">H2</button>
                        <div style="width:1px; height:20px; background:#eee; margin:0 0.5rem"></div>
                        <button class="icon-btn"><i class="ph ph-text-b"></i></button>
                        <button class="icon-btn"><i class="ph ph-text-i"></i></button>
                        <div style="flex:1"></div>
                        <span style="font-size:0.875rem; color:#999; margin-right:1rem">已保存</span>
                    </div>
                    <div class="doc-wrapper">
                <div class="doc-page" contenteditable="true">
                            <h1 style="text-align:center; margin-bottom:2rem">${docTitle}</h1>
                            ${getMockDocContent(docTitle)}
                        </div>
                    </div>
                </div>

                <!-- Right Sidebar: AI Assistant -->
                <div class="ai-sidebar">
                    <div class="structure-header" style="border-left:none; justify-content:space-between">
                        <span>AI 辅助</span>
                        <i class="ph ph-sparkle" style="color:var(--primary-color)"></i>
                    </div>
                    <div style="padding:1rem">
                        <div class="ai-action-card" style="margin-top:0">
                            <div class="card-title">✨ 润色优化</div>
                            <p style="font-size:0.875rem; color:#666; margin-bottom:0.5rem">选中文字太口语化？尝试转换为专业公文风格。</p>
                            <button class="action-btn-sm primary" style="width:100%; justify-content:center">一键润色</button>
                        </div>
                        
                        <div class="ai-action-card">
                            <div class="card-title">📝 续写建议</div>
                            <p style="font-size:0.875rem; color:#666; margin-bottom:0.5rem">根据当前"法律法规"章节，建议补充《刑法》相关条款。</p>
                            <button class="action-btn-sm" style="width:100%; justify-content:center">生成内容</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Global Creator Navigation
    window.openDoc = (title) => {
        let container = document.getElementById('creator-container');
        if (!container) {
            // Switch to Creator View if not active
            document.querySelector('[data-target=creator]').click();
            container = document.getElementById('creator-container');
        }

        if (container) {
            container.innerHTML = getCreatorEditorContent(title);
            // Reset layout styles for flex editing
            container.style.display = 'flex';
            container.style.padding = '0';
        }
    };

    window.backToCreatorDashboard = () => {
        const container = document.getElementById('creator-container');
        if (container) {
            container.innerHTML = getCreatorDashboardContent();
            container.style.display = 'block';
            container.style.padding = '2rem';
        }
    };

    // --- Stats Module ---
    function getStatsHTML() {
        return `
            <div style="padding:2rem; text-align:center; color:#999">
                <i class="ph ph-chart-pie-slice" style="font-size:4rem; margin-bottom:1rem"></i>
                <h2>统计分析模块</h2>
                <p>建设中...</p>
            </div>
        `;
    }

    // --- Chat Logic with Scenarios ---
    function setupChatInteractions() {
        const btn = document.getElementById('send-msg-btn');
        const container = document.getElementById('chat-messages-container');
        const input = document.querySelector('.chat-input');

        // Helper for Quick Chips
        window.sendQuickMsg = (msg) => {
            if (input) {
                input.value = msg;
                document.getElementById('send-msg-btn').click();
            }
        };

        if (btn && input) {
            const sendMessage = () => {
                const text = input.value.trim();
                container.scrollTop = container.scrollHeight;
                if (!text) return;

                // User Message
                const userMsg = document.createElement('div');
                userMsg.className = 'message user';
                userMsg.innerHTML = `
                    <div class="message-avatar"><i class="ph ph-user"></i></div>
                    <div class="message-content">${text}</div>
                `;
                container.appendChild(userMsg);
                input.value = '';
                container.scrollTop = container.scrollHeight;

                // Thinking Indicator
                const thinkingMsg = document.createElement('div');
                thinkingMsg.className = 'message ai thinking';
                thinkingMsg.innerHTML = `
                    <div class="message-avatar"><i class="ph ph-robot"></i></div>
                    <div class="message-content">
                        <div class="thinking-indicator">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <span>正在思考...</span>
                        </div>
                    </div>
                `;
                container.appendChild(thinkingMsg);
                container.scrollTop = container.scrollHeight;

                // Helper: Mock System Upload Message
                const appendSystemMsg = (sysText) => {
                    const sysDiv = document.createElement('div');
                    sysDiv.style.textAlign = 'center';
                    sysDiv.style.margin = '1rem 0';
                    sysDiv.style.fontSize = '0.75rem';
                    sysDiv.style.color = '#999';
                    sysDiv.innerHTML = `<i class="ph ph-file-arrow-up"></i> ${sysText}`;
                    container.appendChild(sysDiv);
                    container.scrollTop = container.scrollHeight;
                };

                if (text.includes("资质") || text.includes("审核") || text.includes("承包商")) {
                    appendSystemMsg("系统：已上传 XX建筑公司 的营业执照、安全许可证等5份文件");
                    responseText = "✅ **AI 智能核验完成**\n\n**核验报告**：\n- ✅ 合格项：营业执照、资质证书（有效）\n- ⚠️ 需关注：安全员证件即将到期（2025年1月）\n- ❌ 不合格：缺少安全管理制度文件";
                    cardHTML = `
                        <div style="margin-top:1rem">
                             <div class="audit-progress-container">
                                <div class="audit-progress-bar" id="audit-bar-${Date.now()}" style="width:0%"></div>
                            </div>
                            <div class="ai-action-card">
                                <div class="card-title">📑 资质审核报告</div>
                                <div class="card-actions">
                                    <button class="action-btn-sm primary" onclick="alert('已保存至档案')">保存档案</button>
                                    <button class="action-btn-sm" onclick="alert('协议已生成')">生成安全协议</button>
                                </div>
                            </div>
                        </div>`;
                    // Hacky animation trigger
                    setTimeout(() => {
                        const bars = document.querySelectorAll('.audit-progress-bar');
                        if (bars.length > 0) bars[bars.length - 1].style.width = '100%';
                    }, 1000);

                } else if (text.includes("人员") || text.includes("建档") || text.includes("花名册")) {
                    appendSystemMsg("系统：已批量上传 10 张人员证件照片（身份证、特种作业证）");
                    responseText = "已批量识别证件信息。提取结果如下：\n- 身份证：10人 (全部有效)\n- 特种作业证：8人 (2人即将复审)\n\n已自动为您生成人员花名册预览：";
                    cardHTML = `
                        <div style="margin-top:1rem">
                            <div class="ai-action-card">
                                <div class="card-title">📋 人员信息提取</div>
                                <table class="ocr-table">
                                    <tr><th>姓名</th><th>工种</th><th>有效期</th></tr>
                                    <tr><td>张伟</td><td>电工</td><td>2026-08</td></tr>
                                    <tr><td>李强</td><td>焊工</td><td style="color:var(--error-color)">2024-12</td></tr>
                                    <tr><td>王军</td><td>架子工</td><td>2025-06</td></tr>
                                </table>
                                <div class="card-actions" style="margin-top:0.5rem">
                                    <button class="action-btn-sm primary" onclick="handleAction('view_ledger')">存入台账</button>
                                    <button class="action-btn-sm" onclick="alert('Excel 已导出')">导出花名册(Excel)</button>
                                </div>
                            </div>
                        </div>`;
                } else if (text.includes("批量") || text.includes("巡检") || text.includes("报告")) {
                    appendSystemMsg("系统：已上传 5 张现场巡检照片");
                    responseText = "正在进行批量识别...\n\n**分析结果**：\n- 照片1：✅ 通道畅通\n- 照片2：⚠️ 灭火器压力不足\n- 照片3：✅ 设备正常\n- 照片4：❌ 堆放杂物\n- 照片5：✅ 标识清晰\n\n已为您汇总生成今日巡检简报。";
                    cardHTML = `
                        <div style="margin-top:1rem">
                            <div class="ai-action-card">
                                <div class="card-title">📊 报告生成</div>
                                <div style="font-size:0.875rem; color:#666; margin-bottom:0.5rem">
                                    《每日安全巡检简报.pdf》已生成。
                                </div>
                                <div class="card-actions">
                                    <button class="action-btn-sm primary" onclick="alert('预览报告')">预览报告</button>
                                    <button class="action-btn-sm" onclick="alert('已分发给相关负责人')">一键分发</button>
                                </div>
                            </div>
                        </div>`;
                } else if (text.includes("趋势") || text.includes("统计") || text.includes("分析")) {
                    responseText = "根据本月台账数据，共发现隐患 45 起，主要集中在 A 车间。";
                    cardHTML = `
                        <div style="margin-top:1rem">
                            <div class="ai-action-card">
                                <div class="card-title">📈 数据洞察</div>
                                <div class="mock-chart-container">
                                    <div class="mock-bar" style="height:30%"><span>C车间</span></div>
                                    <div class="mock-bar" style="height:50%; background:#ffd666"><span>B车间</span></div>
                                    <div class="mock-bar" style="height:80%; background:#ff7875"><span>A车间</span></div>
                                    <div class="mock-bar" style="height:40%"><span>D车间</span></div>
                                </div>
                                <div class="card-actions">
                                    <button class="action-btn-sm primary" onclick="alert('导出详细分析报告')">导出详细报告</button>
                                </div>
                            </div>
                        </div>`;
                } else if (text.includes("法规") || text.includes("查询") || text.includes("规定")) {
                    responseText = "已为您检索到《安全生产法》（2021修正版）中关于教育培训的相关规定。\n\n**第二十八条**\n生产经营单位应当对从业人员进行安全生产教育和培训，保证从业人员具备必要的安全生产知识，熟悉有关的安全生产规章制度和安全操作规程，掌握本岗位的安全操作技能，了解事故应急处理措施，知悉自身在安全生产方面的权利和义务。";
                    cardHTML = `
                        <div style="margin-top:1rem">
                            <div class="citation-source">
                                <i class="ph ph-book-bookmark"></i> 来源：安全生产法 (2021修正).pdf (第28条)
                            </div>
                            <div class="ai-action-card">
                                <div class="card-title">📖 法规应用</div>
                                <div style="font-size:0.875rem; color:#666; margin-bottom:0.5rem">
                                    相关的培训记录表模板已就绪。
                                </div>
                                <div class="card-actions">
                                    <button class="action-btn-sm primary" onclick="handleAction('insert_doc')">插入条款到文档</button>
                                </div>
                            </div>
                        </div>`;
                } else if (text.includes("写") || text.includes("计划") || text.includes("大纲")) {
                    responseText = "好的，已为您生成《2025年度安全培训计划》大纲。内容涵盖：\n1. 编制目的\n2. 培训对象与学时\n3. 培训内容（三级教育、专项培训）\n4. 考核方式\n\n您可以在创作中心进一步完善细节。";
                    cardHTML = `
                         <div style="margin-top:1rem">
                            <div class="ai-action-card">
                                <div class="card-title">✍️ 写作助手</div>
                                <div style="font-size:0.875rem; color:#666; margin-bottom:0.5rem">
                                    已生成文档草稿，点击下方按钮开始编辑。
                                </div>
                                <div class="card-actions">
                                    <button class="action-btn-sm primary" onclick="openDoc('2025年度安全培训计划')">创建并编辑文档</button>
                                </div>
                            </div>
                        </div>`;
                } else if (text.includes("隐患") || text.includes("照片") || text.includes("配电箱")) {
                    responseText = "通过图像识别分析，识别结果：\n\n**未关闭箱门 (风险等级：中)**\n\n建议依照《用电安全导则》立即整改。";
                    cardHTML = `
                        <div style="margin-top:1rem">
                            <div class="citation-source"><i class="ph ph-warning-circle"></i> 识别结果：一般隐患</div>
                            <div class="ai-action-card">
                                <div class="card-title">🚨 隐患处置</div>
                                <div class="card-actions">
                                    <button class="action-btn-sm primary" onclick="handleAction('view_ledger')">查看类似隐患记录</button>
                                    <button class="action-btn-sm" onclick="alert('通知书已生成')">生成整改通知书</button>
                                    <button class="action-btn-sm" onclick="alert('已推送至业务系统')">导入业务系统</button>
                                </div>
                            </div>
                        </div>`;
                } else {
                    // Default Fallback
                    responseText = "好的，我收到了。作为一个安全生产AI助手，我可以协助您进行法规查询、隐患辨识、数据分析（如“隐患趋势”）或公文写作。请点击上方的快捷按钮试试看！";
                    cardHTML = "";
                }

                // Streaming AI Response Simulation
                setTimeout(() => {
                    thinkingMsg.remove();

                    const aiMsg = document.createElement('div');
                    aiMsg.className = 'message ai';
                    const contentDiv = document.createElement('div');
                    contentDiv.className = 'message-content';
                    aiMsg.innerHTML = `<div class="message-avatar"><i class="ph ph-robot"></i></div>`;
                    aiMsg.appendChild(contentDiv);
                    container.appendChild(aiMsg);

                    let i = 0;
                    const interval = setInterval(() => {
                        contentDiv.innerText += responseText.charAt(i);
                        container.scrollTop = container.scrollHeight;
                        i++;
                        if (i > responseText.length - 1) {
                            clearInterval(interval);
                            if (cardHTML) {
                                contentDiv.insertAdjacentHTML('beforeend', cardHTML);
                                container.scrollTop = container.scrollHeight;
                            }
                        }
                    }, 20);
                }, 800);
            };

            btn.addEventListener('click', sendMessage);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                }
            });
        }
    }

    // Global Action Handler for Chat Buttons
    window.handleAction = (actionType) => {
        if (actionType === 'insert_doc') {
            // Simulate switching to Creator and Inserting
            document.querySelector('[data-target=creator]').click();
            setTimeout(() => {
                const docPage = document.querySelector('.doc-page');
                if (docPage) {
                    const newContent = `
                        <br>
                        <h3>3.3 最新隐患整改通知</h3>
                        <p><strong>隐患描述：</strong>A车间配电箱未上锁。</p>
                        <p><strong>整改要求：</strong>立即购买并在下班前安装专用挂锁。</p>
                        <br>
                     `;
                    docPage.insertAdjacentHTML('beforeend', newContent);
                    alert('已自动将"整改内容"插入到文档末尾！');
                }
            }, 300);
        } else if (actionType === 'view_ledger') {
            document.querySelector('[data-target=ledger]').click();
            // Optional: simulate filtering
            setTimeout(() => {
                document.querySelector('input[placeholder*="搜索"]').value = "配电箱";
                alert('已跳转台账并自动筛选相关记录');
            }, 300);
        }
    };

    function getLedgerHTML() {
        // Tab switching logic for v2 (Sub-Sidebar)
        window.switchLedgerTab = (tabName) => {
            document.querySelectorAll('.sub-nav-item').forEach(el => el.classList.remove('active'));
            document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

            // Swap Content
            const thead = document.querySelector('thead tr');
            const tbody = document.querySelector('tbody');

            if (tabName === 'hazards') {
                thead.innerHTML = `<th>序号</th><th>编号</th><th>隐患快照</th><th>标题</th><th>区域</th><th>整改人</th><th>状态</th><th>操作</th>`;
                tbody.innerHTML = `
                    <tr><td>1</td><td>HZ001</td><td><div style="width:40px;height:30px;background:#eee;border-radius:4px"></div></td><td>A车间配电箱未上锁</td><td>A车间</td><td>李四</td><td><span class="badge badge-serious">严重</span></td><td><button class="icon-btn"><i class="ph ph-caret-right"></i></button></td></tr>
                    <tr><td>2</td><td>HZ002</td><td><div style="width:40px;height:30px;background:#eee;border-radius:4px"></div></td><td>仓库通道堆放杂物</td><td>仓库</td><td>王五</td><td><span class="badge badge-moderate">中等</span></td><td><button class="icon-btn"><i class="ph ph-caret-right"></i></button></td></tr>
                `;
            } else if (tabName === 'checks') {
                thead.innerHTML = `<th>序号</th><th>检查单号</th><th>检查类型</th><th>执行人</th><th>问题数</th><th>完成时间</th><th>状态</th><th>操作</th>`;
                tbody.innerHTML = `
                    <tr><td>1</td><td>JC1001</td><td>综合月度检查</td><td>张三</td><td>2</td><td>2024-12-01</td><td><span class="badge" style="background:#f6ffed; color:#52c41a">已完成</span></td><td><button class="icon-btn"><i class="ph ph-caret-right"></i></button></td></tr>
                    <tr><td>2</td><td>JC1002</td><td>消防专项检查</td><td>赵六</td><td>0</td><td>2024-12-05</td><td><span class="badge" style="background:#f6ffed; color:#52c41a">已完成</span></td><td><button class="icon-btn"><i class="ph ph-caret-right"></i></button></td></tr>
                `;
            } else if (tabName === 'questions') {
                thead.innerHTML = `<th>序号</th><th>题目</th><th>题型</th><th>难度</th><th>知识点</th><th>使用次数</th><th>操作</th>`;
                tbody.innerHTML = `
                    <tr><td>1</td><td>灭火器压力表指针在什么区域代表正常？</td><td>单选</td><td><span style="color:#16a34a">简单</span></td><td>消防基础</td><td>125</td><td><button class="icon-btn"><i class="ph ph-pencil"></i></button></td></tr>
                    <tr><td>2</td><td>高处作业必须佩戴的安全防护用品是？</td><td>多选</td><td><span style="color:#d97706">中等</span></td><td>高处作业</td><td>89</td><td><button class="icon-btn"><i class="ph ph-pencil"></i></button></td></tr>
                `;
            }
            else {
                thead.innerHTML = `<th>提示</th>`;
                tbody.innerHTML = `<tr><td style="text-align:center; color:#999; padding:2rem">该分类数据暂未接入演示数据</td></tr>`;
            }
        };

        return `
            <div class="ledger-layout">
                <div class="sub-sidebar">
                    <div style="padding:1rem 1.5rem; font-weight:600; font-size:1rem; border-bottom:1px solid #f0f0f0; margin-bottom:0.5rem">台账分类</div>
                    <div class="sub-nav-item active" data-tab="hazards" onclick="switchLedgerTab('hazards')">
                        <span>隐患台账</span>
                        <span style="background:#e6f4ff; color:#1677ff; padding:2px 6px; border-radius:10px; font-size:0.7em">12</span>
                    </div>
                    <div class="sub-nav-item" data-tab="checks" onclick="switchLedgerTab('checks')">
                        <span>检查记录</span>
                    </div>
                    <div class="sub-nav-item" data-tab="questions" onclick="switchLedgerTab('questions')">
                        <span>题库管理</span>
                        <span style="background:#f0f0f0; color:#666; padding:2px 6px; border-radius:10px; font-size:0.7em">856</span>
                    </div>
                    <div class="sub-nav-item" data-tab="trainings" onclick="switchLedgerTab('trainings')">
                        <span>培训材料</span>
                    </div>
                    <div class="sub-nav-item" data-tab="parties" onclick="switchLedgerTab('parties')">
                        <span>相关方档案</span>
                    </div>
                </div>

                <div class="ledger-content">
                    <div class="ledger-header">
                        <div class="ledger-tools" style="width:100%; justify-content:space-between">
                             <div style="position:relative">
                                <i class="ph ph-magnifying-glass" style="position:absolute; left:10px; top:10px; color:#999"></i>
                                <input type="text" placeholder="搜索..." style="padding:0.5rem 1rem 0.5rem 2.5rem; border-radius:6px; border:1px solid #d9d9d9; width:300px">
                            </div>
                            <div style="display:flex; gap:10px">
                                <button class="btn-secondary"><i class="ph ph-funnel"></i> 筛选</button>
                                <button class="btn-secondary"><i class="ph ph-export"></i> 导出</button>
                                <button class="send-btn" style="padding:0.5rem 1rem"><i class="ph ph-plus"></i> 新增</button>
                            </div>
                        </div>
                    </div>
                    <div class="table-wrapper">
                        <table>
                            <thead>
                                <tr>
                                    <th>序号</th>
                                    <th>编号</th>
                                    <th>隐患快照</th>
                                    <th>标题</th>
                                    <th>区域</th>
                                    <th>整改人</th>
                                    <th>状态</th>
                                    <th>操作</th>
                                </tr>
                            </thead>
                            <tbody>
                                <!-- Initial Data: Hazards -->
                                <tr><td>1</td><td>HZ001</td><td><div style="width:40px;height:30px;background:#eee;border-radius:4px"></div></td><td>A车间配电箱未上锁</td><td>A车间</td><td>李四</td><td><span class="badge badge-serious">严重</span></td><td><button class="icon-btn"><i class="ph ph-caret-right"></i></button></td></tr>
                                <tr><td>2</td><td>HZ002</td><td><div style="width:40px;height:30px;background:#eee;border-radius:4px"></div></td><td>仓库通道堆放杂物</td><td>仓库</td><td>王五</td><td><span class="badge badge-moderate">中等</span></td><td><button class="icon-btn"><i class="ph ph-caret-right"></i></button></td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        `;
    }

    function getCreatorHTML_IGNORED() {
        return `
            <div class="creator-layout">
                <div class="structure-sidebar">
                    <div class="structure-header">
                        <span>我的文件</span>
                        <i class="ph ph-plus" style="margin-left:auto; cursor:pointer"></i>
                    </div>
                    <div class="structure-content" style="border-bottom:1px solid #eee; height:150px; flex:none">
                        <div class="toc-item active"><i class="ph ph-file-ppt"></i> 2025年度培训教材</div>
                        <div class="toc-item"><i class="ph ph-file-doc"></i> 12月安全月报</div>
                        <div class="toc-item"><i class="ph ph-file-text"></i> 临时整改通知</div>
                    </div>
                    <div class="structure-header" style="background:#fcfcfc">
                        <span>大纲导航</span>
                    </div>
                    <div class="structure-content">
                        <div class="toc-item active">1. 课程介绍</div>
                        <div class="toc-item">2. 法律法规解读</div>
                        <div class="toc-item">3. 典型事故案例</div>
                        <div class="toc-item" style="padding-left:1.5rem">3.1 高处坠落</div>
                        <div class="toc-item" style="padding-left:1.5rem">3.2 触电事故</div>
                        <div class="toc-item">4. 应急处置</div>
                    </div>
                </div>
                <div class="editor-area">
                    <div class="editor-toolbar">
                        <select style="border:none; background:transparent; font-weight:500"><option>正文</option><option>标题1</option></select>
                        <div style="width:1px; height:20px; background:#f0f0f0; margin:0 0.5rem"></div>
                        <button class="icon-btn"><i class="ph ph-text-b"></i></button>
                        <button class="icon-btn"><i class="ph ph-text-i"></i></button>
                        <button class="icon-btn"><i class="ph ph-list-bullets"></i></button>
                        <div style="flex:1"></div>
                        <span style="font-size:0.8rem; color:#999; margin-right:10px">已保存</span>
                    </div>
                    <div class="doc-wrapper">
                        <div class="doc-page" contenteditable="true">
                            <h1 style="text-align:center; margin-bottom:2rem">2025年度全员安全生产培训教材</h1>
                            <p><strong>主讲人：</strong> 安全部</p>
                            <p><strong>日期：</strong> 2025年12月</p>
                            <br>
                            <h2>1. 课程介绍</h2>
                            <p>为了贯彻落实"安全第一、预防为主、综合治理"的方针，提高全员安全意识...</p>
                            <br>
                            <h2>2. 法律法规解读</h2>
                            <p>新版《安全生产法》重点强调了全员安全生产责任制...</p>
                        </div>
                    </div>
                </div>
                <div class="ai-sidebar">
                    <div class="chat-header">
                        <span class="chat-title" style="font-size:1rem"><i class="ph ph-magic-wand"></i> 创作助手</span>
                    </div>
                     <div style="flex:1; padding:1.5rem; background:#f9fafb;">
                        <div style="font-size:0.875rem; font-weight:600; margin-bottom:0.5rem">为您推荐</div>
                        <div style="display:flex; flex-direction:column; gap:0.5rem">
                            <button class="btn-secondary" style="justify-content:flex-start; font-size:0.8rem">✨ 润色当前段落</button>
                            <button class="btn-secondary" style="justify-content:flex-start; font-size:0.8rem">📝 续写"事故案例"章节</button>
                            <button class="btn-secondary" style="justify-content:flex-start; font-size:0.8rem">🔍 查找相关法规条款</button>
                        </div>
                    </div>
                    <div class="chat-input-area" style="padding:1rem; border-top:1px solid #eee">
                        <div class="input-wrapper">
                            <textarea class="chat-input" style="min-height:40px; font-size:0.9rem" placeholder="告诉助手你想写什么..."></textarea>
                            <div style="text-align:right">
                                <button class="send-btn" style="padding:0.25rem 0.5rem; font-size:0.8rem">发送</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    function getStatsHTML() {
        return `
            <div style="text-align:center; padding-top:4rem; color:#999">
                <i class="ph ph-chart-line-up" style="font-size:4rem; margin-bottom:1rem; display:block; opacity:0.5"></i>
                <h2>数据分析看板</h2>
                <p>此处集成 ECharts 或类似图表库</p>
            </div>
        `;
    }
});
