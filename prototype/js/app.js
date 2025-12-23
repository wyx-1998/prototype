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
        // Default to Creator Dashboard (New Design)
        return `
            <div id="creator-container" class="creator-layout" style="background:var(--bg-color); display:block; padding:2rem; overflow-y:auto">
                ${getCreatorDashboardContentNew()}
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

    // 全局变量存储当前文档类型
    let currentDocType = "";

    function getMockDocContent(title) {
        // 根据currentDocType变量确定文档类型
        if (currentDocType === "Type-1") {
            // Type-1: 培训课件 (Courseware) - PPT画布 - 移除卡片概念，直接在画布上展示内容
            return `
                <div style="margin-bottom:2rem; padding:2rem; background:white; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); box-sizing:border-box;">
                    <h2 style="text-align:center; color:#1677ff; margin-bottom:1.5rem">第一页：课程介绍</h2>
                    <div style="display:flex; flex-direction:column; gap:1.5rem">
                        <div>
                            <h3 style="color:#1677ff; margin:0.5rem 0">课程目标</h3>
                            <ul style="margin:0.5rem 0; padding-left:1.5rem; line-height:1.5">
                                <li>了解安全生产的基本概念和重要性</li>
                                <li>掌握常见安全隐患的识别方法</li>
                                <li>熟悉应急处置流程和自救互救技能</li>
                                <li>提升全员安全责任意识</li>
                            </ul>
                        </div>
                        <div>
                            <h3 style="color:#1677ff; margin:0.5rem 0">课程大纲</h3>
                            <ol style="margin:0.5rem 0; padding-left:1.5rem; line-height:1.5">
                                <li>安全生产法律法规解读</li>
                                <li>典型事故案例分析</li>
                                <li>现场隐患排查要点</li>
                                <li>个人防护用品使用</li>
                                <li>应急救援基础知识</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div style="margin-bottom:2rem; padding:2rem; background:white; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.05); box-sizing:border-box;">
                    <h2 style="text-align:center; color:#1677ff; margin-bottom:1.5rem">第二页：法律法规解读</h2>
                    <div style="display:flex; flex-direction:column; gap:1.5rem">
                        <div>
                            <h3 style="color:#1677ff; margin:0.5rem 0">《安全生产法》核心条款</h3>
                            <p style="margin:0.5rem 0; line-height:1.5">根据《中华人民共和国安全生产法》（2021修正版）第25条规定：</p>
                            <blockquote style="margin:0.5rem 0; padding:0.75rem 1rem; border-left:4px solid #1677ff; background:#f0f8ff; border-radius:0 8px 8px 0">
                                <p style="margin:0; font-style:italic">生产经营单位的安全生产管理机构以及安全生产管理人员应当恪尽职守，依法履行职责。</p>
                            </blockquote>
                        </div>
                        <div>
                            <h3 style="color:#1677ff; margin:0.5rem 0">企业责任与义务</h3>
                            <ul style="margin:0.5rem 0; padding-left:1.5rem; line-height:1.5">
                                <li>建立健全全员安全生产责任制</li>
                                <li>制定并实施安全生产规章制度</li>
                                <li>组织开展安全生产教育和培训</li>
                                <li>定期排查治理生产安全事故隐患</li>
                            </ul>
                        </div>
                    </div>
                </div>
            `;
        } else if (currentDocType === "Type-2") {
            // Type-2: 标准公文 - 长文档画布 - 扩展长度
            return `
                <div style="box-sizing:border-box; max-width:100%; overflow-x:hidden">
                    <h1 style="text-align:center; margin-bottom:2rem">安全生产管理制度</h1>
                    
                    <h2>1. 编制目的</h2>
                    <p>为进一步加强公司安全生产管理，提高全员安全素质，预防和减少生产安全事故，保障员工生命财产安全，促进公司健康发展，特制定本制度。</p>
                    
                    <h2>2. 适用范围</h2>
                    <p>本制度适用于公司所有部门、岗位和员工，包括正式员工、临时工、实习生等各类人员。</p>
                    
                    <h2>3. 培训对象与学时</h2>
                    <p><strong>3.1 新员工：</strong>岗前安全培训不少于24学时，包括公司级、部门级、班组级三级教育。</p>
                    <p><strong>3.2 在职员工：</strong>每年再培训时间不少于8学时。</p>
                    <p><strong>3.3 特种作业人员：</strong>必须持证上岗，并按规定进行复审培训。</p>
                    
                    <h2>4. 培训内容</h2>
                    <h3>4.1 公司级教育</h3>
                    <p>主要内容包括：国家安全生产方针政策、法律法规；公司安全生产规章制度；典型事故案例分析等。</p>
                    
                    <h3>4.2 部门级教育</h3>
                    <p>主要内容包括：本部门生产工艺特点、危险因素；安全操作规程；应急处置措施等。</p>
                    
                    <h3>4.3 班组级教育</h3>
                    <p>主要内容包括：岗位安全操作规程；岗位之间衔接配合的安全事项；有关事故案例等。</p>
                    
                    <h2>5. 安全生产投入</h2>
                    <h3>5.1 资金保障</h3>
                    <p>公司每年提取安全生产费用不低于营业收入的2%，专门用于完善和改进安全生产条件。安全生产费用实行专户核算，按规定范围使用，不得挪作他用。</p>
                    
                    <h3>5.2 使用范围</h3>
                    <ul>
                        <li>安全设施设备的维护保养</li>
                        <li>劳动防护用品配备</li>
                        <li>安全生产宣传教育培训</li>
                        <li>应急救援器材和设备配备</li>
                        <li>重大危险源监控系统建设</li>
                        <li>安全生产检查评价支出</li>
                        <li>事故隐患整改支出</li>
                    </ul>
                    
                    <h2>6. 安全教育培训</h2>
                    <h3>6.1 新员工三级教育</h3>
                    <p>新员工上岗前必须接受公司级、部门级、班组级三级安全教育，培训时间不少于24学时。培训内容应结合岗位实际，确保员工掌握必要的安全知识和技能。</p>
                    
                    <h3>6.2 日常安全教育</h3>
                    <p>各部门每月至少组织一次安全学习活动，重点学习岗位操作规程和事故案例。安全管理部门定期组织专题培训，提高员工安全意识。</p>
                    
                    <h3>6.3 特殊时期教育</h3>
                    <p>在节假日前后、季节变换、设备检修、新工艺应用等特殊时期，应及时开展针对性安全教育。</p>
                    
                    <h2>7. 隐患排查治理</h2>
                    <h3>7.1 排查频次</h3>
                    <ul>
                        <li>公司级综合检查：每季度一次</li>
                        <li>部门级专业检查：每月一次</li>
                        <li>班组级日常检查：每周一次</li>
                        <li>岗位级巡回检查：每班一次</li>
                    </ul>
                    
                    <h3>7.2 隐患分级</h3>
                    <p>一般隐患：危害和整改难度较小，发现后能够立即整改排除的隐患。</p>
                    <p>重大隐患：危害和整改难度较大，应当全部或者局部停产停业，并经过一定时间整改治理方能排除的隐患。</p>
                    
                    <h3>7.3 治理要求</h3>
                    <p>隐患治理应做到"五落实"：落实整改责任、落实整改措施、落实整改资金、落实整改时限、落实应急预案。</p>
                    
                    <h2>8. 应急管理</h2>
                    <h3>8.1 应急预案体系</h3>
                    <p>公司建立"1+3+N"应急预案体系，即1个综合预案、3个专项预案和多个现场处置方案。预案应定期修订完善，确保实用性和可操作性。</p>
                    
                    <h3>8.2 应急演练</h3>
                    <p>每年至少组织一次综合应急演练，每半年至少组织一次专项应急演练。演练结束后应及时总结评估，完善应急预案。</p>
                    
                    <h3>8.3 应急队伍</h3>
                    <p>公司组建应急救援队伍，由安全管理部门负责日常管理，定期开展培训和演练，提高应急处置能力。</p>
                    
                    <h2>9. 事故管理</h2>
                    <h3>9.1 报告程序</h3>
                    <p>发生生产安全事故后，现场有关人员应立即向部门负责人报告，部门负责人1小时内向安全管理部门报告，安全管理部门1小时内向公司领导和政府相关部门报告。</p>
                    
                    <h3>9.2 调查处理</h3>
                    <p>按照"四不放过"原则（事故原因未查清不放过、责任人员未处理不放过、整改措施未落实不放过、有关人员未受教育不放过）进行事故调查处理。</p>
                    
                    <h3>9.3 统计分析</h3>
                    <p>建立事故档案，定期进行统计分析，查找事故规律，制定预防措施。</p>
                    
                    <h2>10. 考核与奖惩</h2>
                    <h3>10.1 考核指标</h3>
                    <ul>
                        <li>千人负伤率不超过3‰</li>
                        <li>重大事故隐患整改率达到100%</li>
                        <li>员工安全培训合格率达到100%</li>
                        <li>特种作业人员持证上岗率达到100%</li>
                    </ul>
                    
                    <h3>10.2 奖惩措施</h3>
                    <p>对在安全生产工作中做出突出贡献的集体和个人给予表彰奖励；对违反安全生产规定的给予相应处罚。</p>
                    
                    <h2>11. 附则</h2>
                    <p>本制度自发布之日起施行，解释权归公司安全生产委员会。</p>
                </div>
            `;
        } else if (currentDocType === "Type-3") {
            // Type-3: 业务单据
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
        } else if (currentDocType === "Type-4") {
            // Type-4: 考试试卷 - 结构化试题展示
            return `
                <div style="box-sizing:border-box; max-width:100%; overflow-x:hidden">
                    <div style="text-align:center; margin-bottom:2rem">
                        <h1 style="margin-bottom:0.5rem">安全生产知识考试卷</h1>
                        <div>考试时间：90分钟 &nbsp;&nbsp;|&nbsp;&nbsp; 总分：100分</div>
                    </div>
                    
                    <div style="margin-bottom:2rem; padding:0; background:#f8f9fa; border-radius:8px">
                        <div style="display:flex; justify-content:space-between; margin-bottom:0.5rem">
                            <div><strong>姓名：</strong> _________________</div>
                            <div><strong>部门：</strong> _________________</div>
                        </div>
                        <div><strong>工号：</strong> _________________</div>
                    </div>
                    
                    <div style="page-break-after:always; margin-bottom:2rem">
                        <h2 style="margin-bottom:1rem; color:#1677ff">一、单项选择题（共5题，每题2分，共10分）</h2>
                        
                        <div style="margin-bottom:1.5rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>1. 《安全生产法》规定，生产经营单位的( &nbsp;&nbsp;&nbsp;&nbsp; )对本单位的安全生产工作全面负责。</strong></div>
                            <div style="margin:1rem 0 0 1rem">
                                <div>A. 安全管理人员 &nbsp;&nbsp;&nbsp;&nbsp; B. 主要负责人 &nbsp;&nbsp;&nbsp;&nbsp; C. 分管安全领导 &nbsp;&nbsp;&nbsp;&nbsp; D. 安全总监</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom:1.5rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>2. 根据国家标准，安全色中的红色表示( &nbsp;&nbsp;&nbsp;&nbsp; )。</strong></div>
                            <div style="margin:1rem 0 0 1rem">
                                <div>A. 禁止、停止 &nbsp;&nbsp;&nbsp;&nbsp; B. 注意、警告 &nbsp;&nbsp;&nbsp;&nbsp; C. 指令、必须遵守 &nbsp;&nbsp;&nbsp;&nbsp; D. 通行、安全</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom:1.5rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>3. 从业人员有权对本单位安全生产工作中存在的问题提出批评、检举、控告，这是从业人员的( &nbsp;&nbsp;&nbsp;&nbsp; )。</strong></div>
                            <div style="margin:1rem 0 0 1rem">
                                <div>A. 知情权 &nbsp;&nbsp;&nbsp;&nbsp; B. 建议权 &nbsp;&nbsp;&nbsp;&nbsp; C. 批评权 &nbsp;&nbsp;&nbsp;&nbsp; D. 拒绝权</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom:1.5rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>4. 灭火器的压力表指针在( &nbsp;&nbsp;&nbsp;&nbsp; )区域时表示压力正常。</strong></div>
                            <div style="margin:1rem 0 0 1rem">
                                <div>A. 红色 &nbsp;&nbsp;&nbsp;&nbsp; B. 黄色 &nbsp;&nbsp;&nbsp;&nbsp; C. 绿色 &nbsp;&nbsp;&nbsp;&nbsp; D. 白色</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom:1.5rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>5. 高处作业是指凡在坠落高度基准面( &nbsp;&nbsp;&nbsp;&nbsp; )米以上有可能坠落的高处进行的作业。</strong></div>
                            <div style="margin:1rem 0 0 1rem">
                                <div>A. 1 &nbsp;&nbsp;&nbsp;&nbsp; B. 2 &nbsp;&nbsp;&nbsp;&nbsp; C. 3 &nbsp;&nbsp;&nbsp;&nbsp; D. 5</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="page-break-after:always; margin-bottom:2rem">
                        <h2 style="margin-bottom:1rem; color:#52c41a">二、多项选择题（共2题，每题3分，共6分）</h2>
                        
                        <div style="margin-bottom:1.5rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>1. 下列哪些属于从业人员的安全生产权利？（ &nbsp;&nbsp;&nbsp;&nbsp; ）</strong></div>
                            <div style="margin:1rem 0 0 1rem">
                                <div>A. 知情权 &nbsp;&nbsp;&nbsp;&nbsp; B. 批评权 &nbsp;&nbsp;&nbsp;&nbsp; C. 拒绝违章指挥权 &nbsp;&nbsp;&nbsp;&nbsp; D. 紧急避险权</div>
                            </div>
                        </div>
                        
                        <div style="margin-bottom:1.5rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>2. 以下哪些行为属于违章作业？（ &nbsp;&nbsp;&nbsp;&nbsp; ）</strong></div>
                            <div style="margin:1rem 0 0 1rem">
                                <div>A. 未佩戴安全帽进入施工现场 &nbsp;&nbsp;&nbsp;&nbsp; B. 操作旋转设备戴手套 &nbsp;&nbsp;&nbsp;&nbsp; C. 酒后上岗作业 &nbsp;&nbsp;&nbsp;&nbsp; D. 按规程操作设备</div>
                            </div>
                        </div>
                    </div>
                    
                    <div style="page-break-after:always; margin-bottom:2rem">
                        <h2 style="margin-bottom:1rem; color:#faad14">三、判断题（共2题，每题1分，共2分）</h2>
                        
                        <div style="margin-bottom:1rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>1. 任何单位和个人不得阻挠和干涉对事故的依法调查处理。（ &nbsp;&nbsp;&nbsp;&nbsp; ）</strong></div>
                            <div style="margin:0.5rem 0 0 1rem">正确 ☐ &nbsp;&nbsp;&nbsp;&nbsp; 错误 ☐</div>
                        </div>
                        
                        <div style="margin-bottom:1rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>2. 发生火灾时，应乘坐电梯快速逃生。（ &nbsp;&nbsp;&nbsp;&nbsp; ）</strong></div>
                            <div style="margin:0.5rem 0 0 1rem">正确 ☐ &nbsp;&nbsp;&nbsp;&nbsp; 错误 ☐</div>
                        </div>
                    </div>
                    
                    <div>
                        <h2 style="margin-bottom:1rem; color:#ff4d4f">四、简答题（共2题，每题10分，共20分）</h2>
                        
                        <div style="margin-bottom:2rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>1. 请简述你所在岗位的主要安全风险及防范措施。</strong></div>
                            <div style="min-height:12rem; border:1px dashed #ddd; margin-top:1rem; padding:1rem; background:#fafafa"></div>
                        </div>
                        
                        <div style="margin-bottom:2rem; padding:1rem; border:1px solid #e8e8e8; border-radius:4px">
                            <div><strong>2. 当发生火灾时，你应该怎样正确报警？</strong></div>
                            <div style="min-height:12rem; border:1px dashed #ddd; margin-top:1rem; padding:1rem; background:#fafafa"></div>
                        </div>
                    </div>
                </div>
            `;
        } else {
            // 默认内容
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

    function getCreatorEditorContent(docTitle, additionalMessages) {
        // 根据文档类型动态生成 AI 交互按钮
        let actionButtonsHTML = "";
        let docType = ""; // Type-1, Type-2, Type-3, Type-4

        // 判断文档类型
        if (docTitle.includes("课件") || docTitle.includes("PPT") || docTitle.includes("演示文稿") || docTitle.includes("教材") || docTitle.includes("培训")) {
            docType = "Type-1";
            currentDocType = "Type-1"; // 设置全局变量
            actionButtonsHTML = `
                <button onclick="alert('正在把课件导入企业知识库...')" style="padding:0.5rem 0.75rem; background:#e6f4ff; color:#1677ff; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-books"></i> 导入知识库
                </button>
                <button onclick="alert('正在重新生成当前页内容...')" style="padding:0.5rem 0.75rem; background:#e6f4ff; color:#1677ff; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-arrows-clockwise"></i> 重新生成当前页
                </button>
                <button onclick="alert('已根据 PPT 内容生成演讲备注...')" style="padding:0.5rem 0.75rem; background:#e6f4ff; color:#1677ff; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-notepad"></i> 生成讲稿
                </button>
            `;
        } else if (docTitle.includes("计划") || docTitle.includes("制度") || docTitle.includes("规定") || docTitle.includes("预案") || docTitle.includes("大纲") || docTitle.includes("公文")) {
            docType = "Type-2";
            currentDocType = "Type-2"; // 设置全局变量
            actionButtonsHTML = `
                <button onclick="alert('检索法规库，自动插入相关法律条款...')" style="padding:0.5rem 0.75rem; background:#f6ffed; color:#52c41a; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-scroll"></i> 插入条款
                </button>
                <button onclick="alert('正在根据上下文补充缺失的章节...')" style="padding:0.5rem 0.75rem; background:#f6ffed; color:#52c41a; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-paragraph"></i> 续写建议
                </button>
                <button onclick="alert('已推送至 OA 系统进行审批发布')" style="padding:0.5rem 0.75rem; background:#f6ffed; color:#52c41a; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-cloud-arrow-up"></i> 导入业务系统
                </button>
            `;
        } else if (docTitle.includes("通知书") || docTitle.includes("整改") || docTitle.includes("月报") || docTitle.includes("报告") || docTitle.includes("简报") || docTitle.includes("单据")) {
            docType = "Type-3";
            currentDocType = "Type-3"; // 设置全局变量
            actionButtonsHTML = `
                <button onclick="document.querySelector('[data-target=ledger]').click()" style="padding:0.5rem 0.75rem; background:#fffbe6; color:#d48806; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-table"></i> 查看台账关联
                </button>
                <button onclick="alert('已通过邮件或企业微信推送到相关责任人')" style="padding:0.5rem 0.75rem; background:#fffbe6; color:#d48806; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-paper-plane-tilt"></i> 一键分发
                </button>
            `;
        } else if (docTitle.includes("试卷") || docTitle.includes("考试") || docTitle.includes("习题")) {
            docType = "Type-4";
            currentDocType = "Type-4"; // 设置全局变量
            actionButtonsHTML = `
                <button onclick="alert('正在从「全维数据台账-题库」中随机抽取题目...')" style="padding:0.5rem 0.75rem; background:#fff2e8; color:#d4380d; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-database"></i> 导入题库
                </button>
                <button onclick="alert('正在为每道题生成答案解析...')" style="padding:0.5rem 0.75rem; background:#fff2e8; color:#d4380d; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-lightbulb"></i> 生成解析
                </button>
            `;
        } else {
            // 默认通用功能
            docType = "General";
            currentDocType = "General"; // 设置全局变量
            actionButtonsHTML = `
                <button onclick="alert('已发送邮件')" style="padding:0.5rem 0.75rem; background:#f5f5f5; color:#666; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-envelope-simple"></i> 邮件发送
                </button>
                <button onclick="alert('已推送至业务系统')" style="padding:0.5rem 0.75rem; background:#f5f5f5; color:#666; border:none; border-radius:6px; cursor:pointer; font-size:0.8rem; display:flex; align-items:center; gap:0.25rem">
                    <i class="ph ph-cloud-arrow-up"></i> 导入业务系统
                </button>
            `;
        }

        // 获取推荐数据源
        const recommendedDataSources = window.parent.getRecommendedDataSources ? window.parent.getRecommendedDataSources(docType) : [];

        return `
            <div class="creator-layout" style="display:flex; height:100%; flex:1">
                <!-- 左侧：画布/编辑器 -->
                <div class="editor-area" style="flex:1; display:flex; flex-direction:column; position:relative">
                        
                    <!-- 顶部工具栏 -->
                    <div class="editor-toolbar" style="display:flex; align-items:center; padding:0.75rem 1rem; border-bottom:1px solid #eee; background:white">
                        <button class="icon-btn" onclick="backToCreatorDashboard()" style="margin-right:1rem"><i class="ph ph-caret-left"></i></button>
                        <span style="font-weight:600; margin-right:2rem">${docTitle}</span>
                        <div style="display:flex; gap:0.25rem">
                            <button class="icon-btn">H1</button>
                            <button class="icon-btn">H2</button>
                            <div style="width:1px; height:20px; background:#eee; margin:0 0.5rem"></div>
                            <button class="icon-btn"><i class="ph ph-text-b"></i></button>
                            <button class="icon-btn"><i class="ph ph-text-i"></i></button>
                            <button class="icon-btn"><i class="ph ph-list-bullets"></i></button>
                            <div style="width:1px; height:20px; background:#eee; margin:0 0.5rem"></div>
                            <button class="icon-btn"><i class="ph ph-image"></i></button>
                            <button class="icon-btn"><i class="ph ph-table"></i></button>
                        </div>
                        <div style="flex:1"></div>
                        <span style="font-size:0.8rem; padding:0.25rem 0.75rem; background:${docType === 'Type-1' ? '#e6f4ff' : docType === 'Type-2' ? '#f6ffed' : docType === 'Type-3' ? '#fffbe6' : docType === 'Type-4' ? '#fff2e8' : '#f5f5f5'}; color:${docType === 'Type-1' ? '#1677ff' : docType === 'Type-2' ? '#52c41a' : docType === 'Type-3' ? '#faad14' : docType === 'Type-4' ? '#ff4d4f' : '#666'}; border-radius:4px; margin-right:1rem">${docType === 'Type-1' ? '培训课件' : docType === 'Type-2' ? '标准公文' : docType === 'Type-3' ? '业务单据' : docType === 'Type-4' ? '考试试卷' : '文档'}</span>
                        <span style="font-size:0.75rem; color:#52c41a"><i class="ph ph-check-circle"></i> 已保存</span>
                    </div>
    
                    <!-- 画布区域 -->
                    <div class="doc-wrapper" style="flex:1; background:#f5f5f5; padding:2rem; overflow:visible;">
                        <div class="doc-page" contenteditable="true" style="width:100%; margin:0 auto; background:white; padding:3rem; box-shadow:0 2px 8px rgba(0,0,0,0.08); border-radius:4px; height:auto; min-height:100vh;">
                            <h1 style="text-align:center; margin-bottom:2rem">${docTitle}</h1>
                            ${getMockDocContent(docTitle)}
                        </div>
                    </div>
                </div>
    
                <!-- 右侧：AI Chatbox -->
                <div class="ai-sidebar" style="width:380px; border-left:1px solid #eee; display:flex; flex-direction:column; background:white">
                    <!-- Chatbox 头部 -->
                    <div style="padding:1rem; border-bottom:1px solid #eee; display:flex; align-items:center; justify-content:space-between">
                        <div style="display:flex; align-items:center; gap:0.5rem">
                            <i class="ph ph-robot" style="font-size:1.25rem; color:var(--primary-color)"></i>
                            <span style="font-weight:600">AI 创作助手</span>
                        </div>
                        <span style="font-size:0.75rem; color:#666; background:#f0f0f0; padding:0.25rem 0.5rem; border-radius:4px">${docType}</span>
                    </div>
    
                    <!-- AI 功能按钮区 -->
                    <div style="padding:1rem; border-bottom:1px solid #eee">
                        <div style="font-size:0.8rem; color:#666; margin-bottom:0.75rem"><i class="ph ph-magic-wand"></i> 快捷操作</div>
                        <div style="display:flex; flex-wrap:wrap; gap:0.5rem">
                            ${actionButtonsHTML}
                        </div>
                    </div>
    
                    <!-- 推荐数据源区 -->
                    <div style="padding:1rem; border-bottom:1px solid #eee">
                        <div style="font-size:0.8rem; color:#666; margin-bottom:0.75rem">
                            <i class="ph ph-database"></i> 推荐数据源
                        </div>
                        <div id="data-source-cards" style="display:flex; flex-direction:column; gap:0.5rem">
                            ${recommendedDataSources.map(source => `
                                <div class="data-source-card" data-id="${source.id}" style="border:1px solid #eee; border-radius:8px; padding:0.75rem; background:#fafafa">
                                    <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem">
                                        <div style="display:flex; align-items:center; gap:0.5rem">
                                            <span style="font-size:1.2rem">${source.icon}</span>
                                            <div>
                                                <div style="font-weight:500; font-size:0.9rem">${source.name}</div>
                                                <div style="font-size:0.75rem; color:#999">${source.count} 条记录</div>
                                            </div>
                                        </div>
                                        <button onclick="removeDataSource('${source.id}')" style="background:none; border:none; color:#ff4d4f; cursor:pointer; font-size:1rem">
                                            <i class="ph ph-x"></i>
                                        </button>
                                    </div>
                                    <div style="display:flex; gap:0.5rem; flex-wrap:wrap">
                                        <button onclick="toggleDataSourceDetails('${source.id}')" style="padding:0.25rem 0.5rem; background:#e6f4ff; color:#1677ff; border:none; border-radius:4px; font-size:0.75rem; cursor:pointer">
                                            <i class="ph ph-caret-down"></i> 展开
                                        </button>
                                        <button onclick="filterDataSource('${source.id}')" style="padding:0.25rem 0.5rem; background:#fff7e6; color:#fa8c16; border:none; border-radius:4px; font-size:0.75rem; cursor:pointer">
                                            <i class="ph ph-funnel"></i> 筛选
                                        </button>
                                    </div>
                                    <div id="details-${source.id}" style="display:none; margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed #eee">
                                        <div style="font-size:0.8rem; color:#666">
                                            这里显示 ${source.name} 的详细信息预览...
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                        <button onclick="reopenDataSourceSelection()" style="margin-top:0.75rem; padding:0.5rem; width:100%; background:#f0f0f0; border:none; border-radius:4px; font-size:0.8rem; color:#666; cursor:pointer">
                            <i class="ph ph-arrows-clockwise"></i> 重新选择数据集
                        </button>
                    </div>
    
                    <!-- 对话消息区 -->
                    <div id="creator-chat-messages" style="flex:1; overflow-y:auto; padding:1rem">
                        <div style="display:flex; gap:0.75rem; margin-bottom:1rem">
                            <div style="width:32px; height:32px; background:var(--primary-color); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0">
                                <i class="ph ph-robot" style="color:white; font-size:1rem"></i>
                            </div>
                            <div style="background:#f5f5f5; padding:0.75rem 1rem; border-radius:12px; border-top-left-radius:4px; font-size:0.9rem; line-height:1.5">
                                你好！我是你的 AI 创作助手。当前文档类型为「<strong>${docType === 'Type-1' ? '培训课件' : docType === 'Type-2' ? '标准公文' : docType === 'Type-3' ? '业务单据' : docType === 'Type-4' ? '考试试卷' : '通用文档'}</strong>」，我可以帮你：
                                <ul style="margin:0.5rem 0 0 0; padding-left:1.25rem">
                                    ${docType === 'Type-1' ? '<li>导入知识库</li><li>重新生成当前页</li><li>生成演讲讲稿</li>' : ''}
                                    ${docType === 'Type-2' ? '<li>插入法规条款</li><li>续写建议</li><li>导入 OA 系统</li>' : ''}
                                    ${docType === 'Type-3' ? '<li>查看台账关联</li><li>一键分发</li>' : ''}
                                    ${docType === 'Type-4' ? '<li>导入题库</li><li>生成答案解析</li>' : ''}
                                    ${docType === 'General' ? '<li>文档编辑</li><li>邮件发送</li>' : ''}
                                </ul>
                            </div>
                        </div>
                        ${additionalMessages || ''}
                    </div>
    
                    <!-- 输入框 -->
                    <div style="padding:1rem; border-top:1px solid #eee">
                        <div style="display:flex; gap:0.5rem">
                            <input type="text" placeholder="输入指令或描述你的需求..." style="flex:1; padding:0.75rem 1rem; border:1px solid #e5e7eb; border-radius:8px; outline:none; font-size:0.9rem" 
                                   onfocus="this.style.borderColor='var(--primary-color)'" 
                                   onblur="this.style.borderColor='#e5e7eb'">
                            <button class="send-btn" style="padding:0.75rem 1rem; border-radius:8px"><i class="ph ph-paper-plane-right"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Global Creator Navigation
    window.openDoc = (title, type, additionalMessages) => {
        // 设置当前文档类型
        if (type) {
            currentDocType = type;
        }
        
        let container = document.getElementById('creator-container');
        if (!container) {
            // Switch to Creator View if not active
            document.querySelector('[data-target=creator]').click();
            container = document.getElementById('creator-container');
        }

        if (container) {
            container.innerHTML = getCreatorEditorContent(title, additionalMessages);
            // Reset layout styles for flex editing
            container.style.display = 'flex';
            container.style.padding = '0';
        }
    };

    // 数据源操作函数
    // 移除数据源
    function removeDataSource(sourceId) {
        const card = document.querySelector(`.data-source-card[data-id="${sourceId}"]`);
        if (card) {
            card.remove();
        }
    }

    // 展开/收起数据源详情
    function toggleDataSourceDetails(sourceId) {
        const details = document.getElementById(`details-${sourceId}`);
        const button = event.target.closest('button');
        if (details && button) {
            if (details.style.display === 'none') {
                details.style.display = 'block';
                button.innerHTML = '<i class="ph ph-caret-up"></i> 收起';
            } else {
                details.style.display = 'none';
                button.innerHTML = '<i class="ph ph-caret-down"></i> 展开';
            }
        }
    }

    // 筛选数据源
    function filterDataSource(sourceId) {
        alert(`正在对数据源 ${sourceId} 进行筛选设置`);
        // 实际实现中会打开筛选对话框
    }

    // 重新打开数据源选择
    function reopenDataSourceSelection() {
        const chatMessages = document.getElementById('creator-chat-messages');
        if (chatMessages) {
            const message = `
                <div style="display:flex; gap:0.75rem; margin-bottom:1rem">
                    <div style="width:32px; height:32px; background:var(--primary-color); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0">
                        <i class="ph ph-robot" style="color:white; font-size:1rem"></i>
                    </div>
                    <div style="background:#f5f5f5; padding:0.75rem 1rem; border-radius:12px; border-top-left-radius:4px; font-size:0.9rem; line-height:1.5">
                        好的，请告诉我您需要哪些数据源？例如：
                        <ul style="margin:0.5rem 0 0 0; padding-left:1.25rem">
                            <li>"我要事故案例库和法规库"</li>
                            <li>"换成历史文档库和组织架构"</li>
                            <li>"只需要题库"</li>
                        </ul>
                        <input type="text" id="datasource-input" placeholder="请输入您的需求..." style="margin-top:0.75rem; padding:0.5rem; width:100%; border-radius:4px; border:1px solid #ddd">
                        <button onclick="processDataSourceRequest()" style="margin-top:0.5rem; padding:0.5rem 1rem; background:var(--primary-color); color:white; border:none; border-radius:4px; cursor:pointer">
                            确认选择
                        </button>
                    </div>
                </div>
            `;
            chatMessages.insertAdjacentHTML('beforeend', message);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }
    }

    // 处理数据源请求
    function processDataSourceRequest() {
        const input = document.getElementById('datasource-input');
        if (input && input.value.trim()) {
            // 这里会根据用户输入重新选择数据源
            alert(`已根据您的需求"${input.value}"重新选择数据源`);
            // 实际实现中会解析用户输入并更新数据源卡片
        }
    }

    window.backToCreatorDashboard = () => {
        const container = document.getElementById('creator-container');
        if (container) {
            container.innerHTML = getCreatorDashboardContentNew();
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
                                    <button class="action-btn-sm" onclick="generateSafetyAgreement()">生成安全协议</button>
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
                                    <button class="action-btn-sm primary" onclick="previewInspectionReport()">预览报告</button>
                                    <button class="action-btn-sm" onclick="distributeReport()">一键分发</button>
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
                                    <button class="action-btn-sm primary" onclick="viewDetailedReport()">查看详细报告</button>
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
                                    <button class="action-btn-sm primary" onclick="openDocWithClause()">插入条款到文档</button>
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
                                    <button class="action-btn-sm" onclick="generateRectificationNotice()">生成整改通知书</button>
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

    // Function to open document with clause inserted
    window.openDocWithClause = () => {
        // Prepare the additional message for the creator chat
        const additionalMessage = `
            <div style="display:flex; gap:0.75rem; margin-bottom:1rem">
                <div style="width:32px; height:32px; background:var(--primary-color); border-radius:50%; display:flex; align-items:center; justify-content:center; flex-shrink:0">
                    <i class="ph ph-robot" style="color:white; font-size:1rem"></i>
                </div>
                <div style="background:#f5f5f5; padding:0.75rem 1rem; border-radius:12px; border-top-left-radius:4px; font-size:0.9rem; line-height:1.5">
                    我已将《安全生产法》第二十八条插入到文档中，您可以基于此条款进一步指导我如何制定培训计划或相关记录表。
                </div>
            </div>
        `;
        
        // Open a new document in creator with additional message
        openDoc('法规条款引用文档', null, additionalMessage);
        
        // Wait for the creator view to fully load before setting input focus
        setTimeout(() => {
            const setInputFocus = () => {
                const creatorChatInput = document.querySelector('.ai-sidebar .chat-input');
                
                if (creatorChatInput) {
                    // Set the input value
                    creatorChatInput.value = "我已将《安全生产法》第二十八条插入到文档中，您可以基于此条款进一步指导我如何制定培训计划或相关记录表。";
                    
                    // Focus and scroll to the input
                    creatorChatInput.focus();
                    creatorChatInput.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    
                    // Scroll chat messages to bottom
                    const chatMessagesContainer = document.getElementById('creator-chat-messages');
                    if (chatMessagesContainer) {
                        chatMessagesContainer.scrollTop = chatMessagesContainer.scrollHeight;
                    }
                    
                    return true;
                }
                return false;
            };
            
            // Try multiple times to ensure elements are available
            let attempts = 0;
            const maxAttempts = 5;
            
            const trySetInputFocus = () => {
                if (!setInputFocus() && attempts < maxAttempts) {
                    attempts++;
                    setTimeout(trySetInputFocus, 300 * attempts); // Exponential backoff
                }
            };
            
            trySetInputFocus();
        }, 500); // Give extra time for the view to switch and render
    };

    // Function to generate rectification notice
    window.generateRectificationNotice = () => {
        // Open a new document with rectification notice template
        openDoc('安全隐患整改通知书');
        
        // Wait for the document to load and populate with template
        setTimeout(() => {
            const docPage = document.querySelector('.doc-page');
            if (docPage) {
                docPage.innerHTML = `
                    <h1 style="text-align:center; margin-bottom:2rem">安全隐患整改通知书</h1>
                    <div style="margin-bottom:1rem"><strong>编号：</strong> HZ-2025-001</div>
                    <div style="margin-bottom:1rem"><strong>致：</strong> A车间负责人</div>
                    <div style="margin-bottom:1rem"><strong>日期：</strong> 2025年12月20日</div>
                    
                    <h2>隐患描述</h2>
                    <p>在2025年12月20日的安全检查中，发现A车间配电箱未上锁，存在严重的安全隐患。</p>
                    
                    <h2>整改要求</h2>
                    <ol>
                        <li>立即购买并在下班前安装专用挂锁</li>
                        <li>对所有配电箱进行全面检查，确保均已上锁</li>
                        <li>对相关责任人进行安全教育</li>
                    </ol>
                    
                    <h2>整改期限</h2>
                    <p>请于2025年12月22日前完成整改，并将整改情况书面反馈至安全部。</p>
                    
                    <div style="margin-top:3rem; display:flex; justify-content:space-between">
                        <div><strong>签发人：</strong> 安全部</div>
                        <div><strong>日期：</strong> 2025年12月20日</div>
                    </div>
                `;
            }
        }, 300);
    };

    // Function to preview inspection report
    window.previewInspectionReport = () => {
        // Open a new document with inspection report template
        openDoc('每日安全巡检简报');
        
        // Wait for the document to load and populate with template
        setTimeout(() => {
            const docPage = document.querySelector('.doc-page');
            if (docPage) {
                docPage.innerHTML = `
                    <h1 style="text-align:center; margin-bottom:2rem">每日安全巡检简报</h1>
                    <div style="margin-bottom:1rem"><strong>日期：</strong> 2025年12月20日</div>
                    <div style="margin-bottom:1rem"><strong>巡检员：</strong> 张三</div>
                    
                    <h2>巡检概要</h2>
                    <p>今日共巡检5个区域，发现安全隐患2起，其中1起为严重隐患。</p>
                    
                    <h2>详细记录</h2>
                    <table style="width:100%; border-collapse:collapse; margin:1rem 0">
                        <thead>
                            <tr style="background:#f5f5f5">
                                <th style="border:1px solid #ddd; padding:0.5rem">序号</th>
                                <th style="border:1px solid #ddd; padding:0.5rem">区域</th>
                                <th style="border:1px solid #ddd; padding:0.5rem">隐患描述</th>
                                <th style="border:1px solid #ddd; padding:0.5rem">风险等级</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ddd; padding:0.5rem">1</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">A车间</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">配电箱未上锁</td>
                                <td style="border:1px solid #ddd; padding:0.5rem; color:red">严重</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd; padding:0.5rem">2</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">仓库</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">灭火器压力不足</td>
                                <td style="border:1px solid #ddd; padding:0.5rem; color:orange">中等</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h2>整改建议</h2>
                    <ol>
                        <li>立即对A车间配电箱加锁，并建立定期检查制度</li>
                        <li>更换仓库灭火器，并进行全面消防设备检查</li>
                    </ol>
                `;
            }
        }, 300);
    };

    // Function to distribute report
    window.distributeReport = () => {
        // Show distribution dialog
        const recipients = [
            {name: "李主任", role: "生产部主管", email: "li@company.com"},
            {name: "王经理", role: "安全部经理", email: "wang@company.com"},
            {name: "张厂长", role: "厂区负责人", email: "zhang@company.com"}
        ];
        
        let recipientList = "请选择分发对象：\n";
        recipients.forEach((recipient, index) => {
            recipientList += `${index + 1}. ${recipient.name} (${recipient.role})\n`;
        });
        
        const selection = prompt(recipientList + "\n请输入序号（多个序号用逗号分隔）：", "1,2,3");
        
        if (selection) {
            const selectedRecipients = [];
            selection.split(",").forEach(index => {
                const idx = parseInt(index.trim()) - 1;
                if (idx >= 0 && idx < recipients.length) {
                    selectedRecipients.push(recipients[idx]);
                }
            });
            
            if (selectedRecipients.length > 0) {
                const names = selectedRecipients.map(r => r.name).join(", ");
                alert(`报告已分发给：${names}`);
            } else {
                alert("未选择有效的收件人");
            }
        }
    };

    // Function to view detailed report
    window.viewDetailedReport = () => {
        // Open a new document in creator with detailed report template
        openDoc('数据洞察详细报告');
        
        // Wait for the document to load and populate with template
        setTimeout(() => {
            const docPage = document.querySelector('.doc-page');
            if (docPage) {
                docPage.innerHTML = `
                    <h1 style="text-align:center; margin-bottom:2rem">数据洞察详细报告</h1>
                    <div style="margin-bottom:1rem"><strong>报告日期：</strong> 2025年12月20日</div>
                    <div style="margin-bottom:1rem"><strong>分析周期：</strong> 2025年12月1日 - 2025年12月20日</div>
                    
                    <h2>总体概况</h2>
                    <p>本月共发现安全隐患45起，较上月增加12%，主要集中在A车间。</p>
                    
                    <h2>各车间隐患分布</h2>
                    <table style="width:100%; border-collapse:collapse; margin:1rem 0">
                        <thead>
                            <tr style="background:#f5f5f5">
                                <th style="border:1px solid #ddd; padding:0.5rem">车间</th>
                                <th style="border:1px solid #ddd; padding:0.5rem">隐患数量</th>
                                <th style="border:1px solid #ddd; padding:0.5rem">占比</th>
                                <th style="border:1px solid #ddd; padding:0.5rem">环比变化</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td style="border:1px solid #ddd; padding:0.5rem">A车间</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">36</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">80%</td>
                                <td style="border:1px solid #ddd; padding:0.5rem; color:red">↑ 15%</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd; padding:0.5rem">B车间</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">6</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">13.3%</td>
                                <td style="border:1px solid #ddd; padding:0.5rem; color:green">↓ 5%</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd; padding:0.5rem">C车间</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">2</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">4.4%</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">-</td>
                            </tr>
                            <tr>
                                <td style="border:1px solid #ddd; padding:0.5rem">D车间</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">1</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">2.3%</td>
                                <td style="border:1px solid #ddd; padding:0.5rem">-</td>
                            </tr>
                        </tbody>
                    </table>
                    
                    <h2>隐患类型分析</h2>
                    <p>电气安全隐患占比最高，达到45%，其次是消防安全和机械安全。</p>
                    
                    <h2>改进建议</h2>
                    <ol>
                        <li>加强对A车间的安全巡查和培训</li>
                        <li>对电气设备进行全面检修</li>
                        <li>完善隐患整改跟踪机制</li>
                    </ol>
                `;
            }
        }, 300);
    };

    // Function to generate safety agreement
    window.generateSafetyAgreement = () => {
        // Open a new document with safety agreement template
        openDoc('承包商安全管理协议');
        
        // Wait for the document to load and populate with template
        setTimeout(() => {
            const docPage = document.querySelector('.doc-page');
            if (docPage) {
                docPage.innerHTML = `
                    <h1 style="text-align:center; margin-bottom:2rem">承包商安全管理协议</h1>
                    <div style="margin-bottom:1rem"><strong>甲方：</strong> XX制造有限公司</div>
                    <div style="margin-bottom:1rem"><strong>乙方：</strong> XX建筑公司</div>
                    <div style="margin-bottom:1rem"><strong>签订日期：</strong> 2025年12月20日</div>
                    
                    <h2>第一条 总则</h2>
                    <p>为加强承包商在本公司施工期间的安全管理，明确双方安全责任，保障施工人员生命安全和身体健康，特制定本协议。</p>
                    
                    <h2>第二条 安全管理要求</h2>
                    <ol>
                        <li>乙方必须持有有效的营业执照、资质证书和安全生产许可证</li>
                        <li>乙方必须为所有施工人员购买工伤保险和意外伤害险</li>
                        <li>乙方必须配备专职安全管理人员，并持证上岗</li>
                        <li>乙方必须对施工人员进行安全教育培训，未经培训不得上岗</li>
                        <li>乙方必须遵守甲方的各项安全管理制度和操作规程</li>
                    </ol>
                    
                    <h2>第三条 安全责任划分</h2>
                    <p>乙方承担施工过程中因自身原因造成的安全事故全部责任，甲方有权监督乙方的安全管理工作。</p>
                    
                    <h2>第四条 违约责任</h2>
                    <p>如乙方违反本协议规定，甲方有权要求限期整改，情节严重的可终止合同并追究相关责任。</p>
                    
                    <div style="margin-top:3rem; display:flex; justify-content:space-between">
                        <div>
                            <strong>甲方代表：</strong><br><br>
                            签字：___________<br>
                            日期：___________
                        </div>
                        <div>
                            <strong>乙方代表：</strong><br><br>
                            签字：___________<br>
                            日期：___________
                        </div>
                    </div>
                `;
            }
        }, 300);
    };
});
