// 基于四大作品类型的创作中心重新设计

// 全局作品数据
const worksData = {
    'Type-1': [
        { title: '2025年度全员安全生产培训教材', type: '培训课件', status: '已完成', edited: '2小时前', icon: 'ph-presentation', color: '#1677ff' },
        { title: '特种作业人员安全培训PPT', type: '培训课件', status: '已完成', edited: '3天前', icon: 'ph-presentation', color: '#1677ff' },
        { title: '新员工入职安全培训教材', type: '培训课件', status: '草稿', edited: '1周前', icon: 'ph-presentation', color: '#1677ff' }
    ],
    'Type-2': [
        { title: '公司安全生产管理制度', type: '标准公文', status: '已完成', edited: '1周前', icon: 'ph-file-doc', color: '#52c41a' },
        { title: '综合应急预案_2025版', type: '标准公文', status: '草稿', edited: '5天前', icon: 'ph-file-text', color: '#52c41a' },
        { title: '2025年度安全工作计划', type: '标准公文', status: '已完成', edited: '2周前', icon: 'ph-file-doc', color: '#52c41a' }
    ],
    'Type-3': [
        { title: '12月安全隐患整改通知书', type: '业务单据', status: '草稿', edited: '昨天 14:30', icon: 'ph-warning', color: '#faad14' },
        { title: '2024年11月安全生产月报', type: '业务单据', status: '已完成', edited: '2周前', icon: 'ph-chart-bar', color: '#faad14' },
        { title: '每日安全巡检简报', type: '业务单据', status: '草稿', edited: '3天前', icon: 'ph-clipboard-text', color: '#faad14' }
    ],
    'Type-4': [
        { title: '安全生产知识考试卷', type: '练习试卷', status: '已完成', edited: '4天前', icon: 'ph-exam', color: '#ff4d4f' },
        { title: '特种作业人员练习试卷', type: '练习试卷', status: '草稿', edited: '1周前', icon: 'ph-pencil-simple', color: '#ff4d4f' },
        { title: '消防安全知识测试题', type: '练习试卷', status: '已完成', edited: '2周前', icon: 'ph-exam', color: '#ff4d4f' }
    ]
};

// 生成所有作品卡片
function getAllWorksCards() {
    const allWorks = [
        ...worksData['Type-1'],
        ...worksData['Type-2'],
        ...worksData['Type-3'],
        ...worksData['Type-4']
    ];

    return allWorks.map(work => `
        <div class="launch-card" style="height:auto; min-height:200px; align-items:flex-start; padding:1.5rem; border-left:4px solid ${work.color}; transition:all 0.3s ease;"
             onclick="openDoc('${work.title}')"
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%; margin-bottom:1rem;">
                <div class="launch-icon" style="background:${work.color}20; color:${work.color}; width:48px; height:48px; font-size:1.3rem; border-radius:12px; display:flex; align-items:center; justify-content:center;">
                    <i class="ph ${work.icon}"></i>
                </div>
                <div style="font-size:0.75rem; color:#666;">${work.edited}</div>
            </div>
            <div class="launch-title" style="font-size:1.1rem; font-weight:600; margin-bottom:0.5rem; line-height:1.4;">${work.title}</div>
            <div class="launch-desc" style="font-size:0.85rem; color:#666; margin-bottom:1rem;">${work.type}</div>
            <div style="margin-top:auto; display:flex; align-items:center; justify-content:space-between;">
                <div style="font-size:0.8rem; padding:0.25rem 0.75rem; background:${work.status === '已完成' ? '#52c41a20' : work.status === '草稿' ? '#faad1420' : '#8c8c8c20'}; color:${work.status === '已完成' ? '#52c41a' : work.status === '草稿' ? '#faad14' : '#8c8c8c'}; border-radius:12px; font-weight:500;">
                    ${work.status}
                </div>
                <i class="ph ph-caret-right" style="color:#999; font-size:1rem;"></i>
            </div>
        </div>
    `).join('');
}

// 按类型过滤作品
function filterByType(type) {
    // 更新按钮状态
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
        btn.style.background = 'white';
        btn.style.borderColor = '#e5e7eb';
        btn.style.color = '#666';
    });

    const activeBtn = document.querySelector(`[data-filter="${type}"]`);
    if (activeBtn) {
        activeBtn.classList.add('active');
        activeBtn.style.background = '#6366f1';
        activeBtn.style.borderColor = '#6366f1';
        activeBtn.style.color = 'white';
    }

    // 更新作品列表
    const container = document.getElementById('works-container');
    if (container) {
        if (type === 'all') {
            container.innerHTML = getAllWorksCards();
        } else {
            const typeWorks = worksData[type] || [];
            container.innerHTML = typeWorks.map(work => `
                <div class="launch-card" style="height:auto; min-height:200px; align-items:flex-start; padding:1.5rem; border-left:4px solid ${work.color}; transition:all 0.3s ease;"
                     onclick="openDoc('${work.title}')"
                     onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 8px 24px rgba(0,0,0,0.1)'"
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                    <div style="display:flex; align-items:center; justify-content:space-between; width:100%; margin-bottom:1rem;">
                        <div class="launch-icon" style="background:${work.color}20; color:${work.color}; width:48px; height:48px; font-size:1.3rem; border-radius:12px; display:flex; align-items:center; justify-content:center;">
                            <i class="ph ${work.icon}"></i>
                        </div>
                        <div style="font-size:0.75rem; color:#666;">${work.edited}</div>
                    </div>
                    <div class="launch-title" style="font-size:1.1rem; font-weight:600; margin-bottom:0.5rem; line-height:1.4;">${work.title}</div>
                    <div class="launch-desc" style="font-size:0.85rem; color:#666; margin-bottom:1rem;">${work.type}</div>
                    <div style="margin-top:auto; display:flex; align-items:center; justify-content:space-between;">
                        <div style="font-size:0.8rem; padding:0.25rem 0.75rem; background:${work.status === '已完成' ? '#52c41a20' : work.status === '草稿' ? '#faad1420' : '#8c8c8c20'}; color:${work.status === '已完成' ? '#52c41a' : work.status === '草稿' ? '#faad14' : '#8c8c8c'}; border-radius:12px; font-weight:500;">
                            ${work.status}
                        </div>
                        <i class="ph ph-caret-right" style="color:#999; font-size:1rem;"></i>
                    </div>
                </div>
            `).join('');
        }
    }
}

// 显示模板库
function showTemplates() {
    alert('模板库功能：根据四大类型提供专业模板');
}

// 显示创建对话框
function showCreateDialog() {
    alert('创建功能：选择作品类型开始创作');
}

// 新的创作中心主页面内容
function getCreatorDashboardContentNew() {
    return `
        <div style="max-width:1400px; margin:0 auto; padding:1rem">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:3rem; gap:1rem">
                <div>
                    <h1 style="font-size:2rem; font-weight:700; margin-bottom:0.5rem; color:#1a1a1a">创作中心</h1>
                    <p style="color:#666; font-size:1rem">基于四大作品类型的专业文档创作平台</p>
                </div>

                <div style="flex:1; max-width:500px; position:relative">
                    <i class="ph ph-magnifying-glass" style="position:absolute; left:15px; top:50%; transform:translateY(-50%); color:#999; font-size:1.1rem"></i>
                    <input type="text" placeholder="搜索文档、模板或关键词..." style="width:100%; padding:0.75rem 1rem 0.75rem 3rem; border-radius:12px; border:2px solid #e5e7eb; outline:none; font-size:0.95rem; transition:all 0.2s ease"
                           onfocus="this.style.borderColor='#6366f1'; this.style.boxShadow='0 0 0 3px rgba(99,102,241,0.1)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
                </div>

                <div style="display:flex; gap:0.75rem">
                     <button class="btn-secondary" onclick="showTemplates()" style="padding:0.75rem 1.5rem; border-radius:10px; font-weight:500; display:flex; align-items:center; gap:0.5rem">
                        <i class="ph ph-layout"></i> 模板库
                     </button>
                     <button class="send-btn" onclick="showCreateDialog()" style="padding:0.75rem 1.5rem; border-radius:10px; font-weight:600; display:flex; align-items:center; gap:0.5rem">
                        <i class="ph ph-plus"></i> 新建作品
                     </button>
                </div>
            </div>

            <!-- Four Work Types Section -->
            <div style="margin-bottom:3rem">
                <div class="section-title" style="font-size:1.25rem; font-weight:600; margin-bottom:1.5rem; color:#1a1a1a">四大作品类型</div>
                <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:1.5rem">

                    <!-- Type-1: 培训课件 -->
                    <div class="work-type-card" onclick="filterByType('Type-1')" style="background:linear-gradient(135deg, #e6f4ff 0%, #bae7ff 100%); border:1px solid #91d5ff; border-radius:16px; padding:1.5rem; cursor:pointer; transition:all 0.3s ease; position:relative; overflow:hidden">
                        <div style="position:absolute; top:-20px; right:-20px; width:100px; height:100px; background:radial-gradient(circle, rgba(24,144,255,0.1) 0%, transparent 70%)"></div>
                        <div style="position:relative; z-index:1">
                            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem">
                                <div style="width:48px; height:48px; background:#1677ff; border-radius:12px; display:flex; align-items:center; justify-content:center">
                                    <i class="ph ph-presentation" style="color:white; font-size:1.5rem"></i>
                                </div>
                                <div>
                                    <h3 style="margin:0; font-size:1.2rem; font-weight:600; color:#0050b3">Type-1 培训课件</h3>
                                    <p style="margin:0; font-size:0.85rem; color:#666">PPT课件画布</p>
                                </div>
                            </div>
                            <p style="margin:0 0 1rem 0; font-size:0.9rem; color:#333; line-height:1.5">年度安全培训、岗前培训、专项技能培训</p>
                            <div style="display:flex; align-items:center; justify-content:space-between">
                                <div style="font-size:0.8rem; color:#666">
                                    <i class="ph ph-tag"></i> 触发词：课件、PPT、教材
                                </div>
                                <div style="font-size:0.8rem; color:#1677ff; font-weight:600">
                                    <i class="ph ph-file-text"></i> ${worksData['Type-1'].length} 篇
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Type-2: 标准公文 -->
                    <div class="work-type-card" onclick="filterByType('Type-2')" style="background:linear-gradient(135deg, #f6ffed 0%, #d9f7be 100%); border:1px solid #b7eb8f; border-radius:16px; padding:1.5rem; cursor:pointer; transition:all 0.3s ease; position:relative; overflow:hidden">
                        <div style="position:absolute; top:-20px; right:-20px; width:100px; height:100px; background:radial-gradient(circle, rgba(82,196,26,0.1) 0%, transparent 70%)"></div>
                        <div style="position:relative; z-index:1">
                            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem">
                                <div style="width:48px; height:48px; background:#52c41a; border-radius:12px; display:flex; align-items:center; justify-content:center">
                                    <i class="ph ph-file-doc" style="color:white; font-size:1.5rem"></i>
                                </div>
                                <div>
                                    <h3 style="margin:0; font-size:1.2rem; font-weight:600; color:#237804">Type-2 标准公文</h3>
                                    <p style="margin:0; font-size:0.85rem; color:#666">长文档画布</p>
                                </div>
                            </div>
                            <p style="margin:0 0 1rem 0; font-size:0.9rem; color:#333; line-height:1.5">安全管理制度、年度工作计划、应急预案</p>
                            <div style="display:flex; align-items:center; justify-content:space-between">
                                <div style="font-size:0.8rem; color:#666">
                                    <i class="ph ph-tag"></i> 触发词：制度、规定、预案
                                </div>
                                <div style="font-size:0.8rem; color:#52c41a; font-weight:600">
                                    <i class="ph ph-file-text"></i> ${worksData['Type-2'].length} 篇
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Type-3: 业务单据 -->
                    <div class="work-type-card" onclick="filterByType('Type-3')" style="background:linear-gradient(135deg, #fffbe6 0%, #fff1b8 100%); border:1px solid #ffe58f; border-radius:16px; padding:1.5rem; cursor:pointer; transition:all 0.3s ease; position:relative; overflow:hidden">
                        <div style="position:absolute; top:-20px; right:-20px; width:100px; height:100px; background:radial-gradient(circle, rgba(250,173,20,0.1) 0%, transparent 70%)"></div>
                        <div style="position:relative; z-index:1">
                            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem">
                                <div style="width:48px; height:48px; background:#faad14; border-radius:12px; display:flex; align-items:center; justify-content:center">
                                    <i class="ph ph-warning" style="color:white; font-size:1.5rem"></i>
                                </div>
                                <div>
                                    <h3 style="margin:0; font-size:1.2rem; font-weight:600; color:#d48806">Type-3 业务单据</h3>
                                    <p style="margin:0; font-size:0.85rem; color:#666">报告画布</p>
                                </div>
                            </div>
                            <p style="margin:0 0 1rem 0; font-size:0.9rem; color:#333; line-height:1.5">隐患整改通知书、每日巡检简报、安全月报</p>
                            <div style="display:flex; align-items:center; justify-content:space-between">
                                <div style="font-size:0.8rem; color:#666">
                                    <i class="ph ph-tag"></i> 触发词：通知书、月报、报告
                                </div>
                                <div style="font-size:0.8rem; color:#faad14; font-weight:600">
                                    <i class="ph ph-file-text"></i> ${worksData['Type-3'].length} 篇
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Type-4: 练习试卷 -->
                    <div class="work-type-card" onclick="filterByType('Type-4')" style="background:linear-gradient(135deg, #fff2e8 0%, #ffd8bf 100%); border:1px solid #ffbb96; border-radius:16px; padding:1.5rem; cursor:pointer; transition:all 0.3s ease; position:relative; overflow:hidden">
                        <div style="position:absolute; top:-20px; right:-20px; width:100px; height:100px; background:radial-gradient(circle, rgba(255,77,79,0.1) 0%, transparent 70%)"></div>
                        <div style="position:relative; z-index:1">
                            <div style="display:flex; align-items:center; gap:0.75rem; margin-bottom:1rem">
                                <div style="width:48px; height:48px; background:#ff4d4f; border-radius:12px; display:flex; align-items:center; justify-content:center">
                                    <i class="ph ph-exam" style="color:white; font-size:1.5rem"></i>
                                </div>
                                <div>
                                    <h3 style="margin:0; font-size:1.2rem; font-weight:600; color:#cf1322">Type-4 练习试卷</h3>
                                    <p style="margin:0; font-size:0.85rem; color:#666">长文档画布</p>
                                </div>
                            </div>
                            <p style="margin:0 0 1rem 0; font-size:0.9rem; color:#333; line-height:1.5">题库出题、按知识点组卷、讲评材料生成</p>
                            <div style="display:flex; align-items:center; justify-content:space-between">
                                <div style="font-size:0.8rem; color:#666">
                                    <i class="ph ph-tag"></i> 触发词：试卷、练习、组卷
                                </div>
                                <div style="font-size:0.8rem; color:#ff4d4f; font-weight:600">
                                    <i class="ph ph-file-text"></i> ${worksData['Type-4'].length} 篇
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </div>

            <!-- Recent Works Section -->
            <div>
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem">
                    <div class="section-title" style="font-size:1.25rem; font-weight:600; color:#1a1a1a">最近作品</div>
                    <div style="display:flex; gap:0.5rem">
                        <button onclick="filterByType('all')" class="filter-btn active" data-filter="all" style="padding:0.5rem 1rem; border:1px solid #e5e7eb; background:#6366f1; color:white; border-radius:8px; font-size:0.85rem; cursor:pointer; transition:all 0.2s ease">全部</button>
                        <button onclick="filterByType('Type-1')" class="filter-btn" data-filter="Type-1" style="padding:0.5rem 1rem; border:1px solid #e5e7eb; background:white; color:#666; border-radius:8px; font-size:0.85rem; cursor:pointer; transition:all 0.2s ease">培训课件</button>
                        <button onclick="filterByType('Type-2')" class="filter-btn" data-filter="Type-2" style="padding:0.5rem 1rem; border:1px solid #e5e7eb; background:white; color:#666; border-radius:8px; font-size:0.85rem; cursor:pointer; transition:all 0.2s ease">标准公文</button>
                        <button onclick="filterByType('Type-3')" class="filter-btn" data-filter="Type-3" style="padding:0.5rem 1rem; border:1px solid #e5e7eb; background:white; color:#666; border-radius:8px; font-size:0.85rem; cursor:pointer; transition:all 0.2s ease">业务单据</button>
                        <button onclick="filterByType('Type-4')" class="filter-btn" data-filter="Type-4" style="padding:0.5rem 1rem; border:1px solid #e5e7eb; background:white; color:#666; border-radius:8px; font-size:0.85rem; cursor:pointer; transition:all 0.2s ease">练习试卷</button>
                    </div>
                </div>

                <div id="works-container" class="launchpad-grid" style="padding:0; gap:1.5rem; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));;">
                    ${getAllWorksCards()}
                </div>
            </div>
        </div>
    `;
}