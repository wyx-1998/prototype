// 基于四大作品类型的创作中心重新设计

// 文件夹数据
const foldersData = {
    '培训教材': [
        { title: '2025年度全员安全生产培训教材', type: 'Type-1', status: '已完成', edited: '2小时前' },
        { title: '特种作业人员安全培训PPT', type: 'Type-1', status: '已完成', edited: '3天前' },
        { title: '新员工入职安全培训教材', type: 'Type-1', status: '草稿', edited: '1周前' }
    ],
    '安全月报': [
        { title: '2024年11月安全生产月报', type: 'Type-3', status: '已完成', edited: '2周前' },
        { title: '2024年10月安全生产月报', type: 'Type-3', status: '已完成', edited: '1个月前' },
        { title: '2024年9月安全生产月报', type: 'Type-3', status: '已完成', edited: '2个月前' },
        { title: '2024年8月安全生产月报', type: 'Type-3', status: '已完成', edited: '3个月前' },
        { title: '2024年7月安全生产月报', type: 'Type-3', status: '已完成', edited: '4个月前' }
    ],
    '应急预案': [
        { title: '综合应急预案_2025版', type: 'Type-2', status: '审核中', edited: '5天前' },
        { title: '火灾应急预案', type: 'Type-2', status: '已完成', edited: '1周前' },
        { title: '化学品泄漏应急预案', type: 'Type-2', status: '已完成', edited: '2周前' },
        { title: '机械伤害应急预案', type: 'Type-2', status: '草稿', edited: '3周前' }
    ],
    '考试题库': [
        { title: '安全生产知识考试卷', type: 'Type-4', status: '已完成', edited: '4天前' },
        { title: '特种作业人员复审模拟试卷', type: 'Type-4', status: '草稿', edited: '1周前' }
    ]
}

// 打开文件夹视图
function openFolder(folderName) {
    const container = document.getElementById('creator-container');
    if (!container) return;
    
    const folderDocs = foldersData[folderName] || [];
    
    container.innerHTML = `
        <div style="padding:2rem; max-width:1200px; margin:0 auto">
            <!-- 返回按钮 -->
            <div style="margin-bottom:2rem">
                <button class="icon-btn" onclick="backToCreatorDashboard()" style="display:flex; align-items:center; gap:0.5rem; padding:0.5rem 1rem; border-radius:8px; margin-bottom:1rem">
                    <i class="ph ph-caret-left"></i> 返回创作中心
                </button>
                <h1 style="font-size:1.75rem; font-weight:700; margin:0.5rem 0; color:#1a1a1a">${folderName}</h1>
                <p style="color:#666; font-size:0.9rem">${folderDocs.length} 个文档</p>
            </div>
            
            <!-- 文档列表 -->
            <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(300px, 1fr)); gap:1rem">
                ${folderDocs.map(doc => `
                    <div class="launch-card" style="height:auto; padding:1.25rem; cursor:pointer; display:flex; align-items:flex-start; gap:1rem"
                         onclick="openDoc('${doc.title}', '${doc.type}')"
                         onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.1)'"
                         onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'">
                        <div style="width:40px; height:40px; background:#f0f0f0; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0">
                            <i class="ph ph-file-text" style="font-size:1.25rem; color:#666"></i>
                        </div>
                        <div style="flex:1">
                            <div style="font-weight:500; margin-bottom:0.25rem">${doc.title}</div>
                            <div style="font-size:0.8rem; color:#999; margin-bottom:0.5rem">${doc.edited}</div>
                            <div style="display:flex; align-items:center; gap:0.5rem">
                                <span style="font-size:0.7rem; padding:0.15rem 0.5rem; background:${doc.status === '已完成' ? '#52c41a20' : doc.status === '草稿' ? '#faad1420' : '#8c8c8c20'}; color:${doc.status === '已完成' ? '#52c41a' : doc.status === '草稿' ? '#faad14' : '#8c8c8c'}; border-radius:6px">
                                    ${doc.status}
                                </span>
                                <span style="font-size:0.7rem; padding:0.15rem 0.5rem; background:#e6f4ff; color:#1677ff; border-radius:6px">
                                    ${doc.type === 'Type-1' ? '培训课件' : doc.type === 'Type-2' ? '标准公文' : doc.type === 'Type-3' ? '业务单据' : doc.type === 'Type-4' ? '考试试卷' : '文档'}
                                </span>
                            </div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
}

// 全局作品数据
// 四大作品类型数据 - 基于《创作中心作品类型梳理.md》
const worksData = {
    'Type-1': [
        { title: '2025年度全员安全生产培训教材', type: '培训课件 (Courseware)', status: '已完成', edited: '2小时前', icon: 'ph-presentation', color: '#1677ff', canvas: 'PPT课件画布' },
        { title: '特种作业人员安全培训PPT', type: '培训课件 (Courseware)', status: '已完成', edited: '3天前', icon: 'ph-presentation', color: '#1677ff', canvas: 'PPT课件画布' },
        { title: '新员工入职安全培训教材', type: '培训课件 (Courseware)', status: '草稿', edited: '1周前', icon: 'ph-presentation', color: '#1677ff', canvas: 'PPT课件画布' }
    ],
    'Type-2': [
        { title: '公司安全生产管理制度', type: '标准公文 (Standard Doc)', status: '已完成', edited: '1周前', icon: 'ph-file-doc', color: '#52c41a', canvas: '长文档画布' },
        { title: '综合应急预案_2025版', type: '标准公文 (Standard Doc)', status: '审核中', edited: '5天前', icon: 'ph-file-text', color: '#52c41a', canvas: '长文档画布' },
        { title: '2025年度安全工作计划', type: '标准公文 (Standard Doc)', status: '已完成', edited: '2周前', icon: 'ph-file-doc', color: '#52c41a', canvas: '长文档画布' }
    ],
    'Type-3': [
        { title: '12月安全隐患整改通知书', type: '业务单据 (Business Form)', status: '草稿', edited: '昨天 14:30', icon: 'ph-warning', color: '#faad14', canvas: '报告画布' },
        { title: '2024年11月安全生产月报', type: '业务单据 (Business Form)', status: '已完成', edited: '2周前', icon: 'ph-chart-bar', color: '#faad14', canvas: '报告画布' },
        { title: '每日安全巡检简报', type: '业务单据 (Business Form)', status: '草稿', edited: '3天前', icon: 'ph-clipboard-text', color: '#faad14', canvas: '报告画布' }
    ],
    'Type-4': [
        { title: '安全生产知识考试卷', type: '考试试卷 (Examination)', status: '已完成', edited: '4天前', icon: 'ph-exam', color: '#ff4d4f', canvas: '特殊扩展' },
        { title: '特种作业人员复审模拟试卷', type: '考试试卷 (Examination)', status: '草稿', edited: '1周前', icon: 'ph-pencil-simple', color: '#ff4d4f', canvas: '特殊扩展' },
        { title: '消防安全知识测试题', type: '考试试卷 (Examination)', status: '已完成', edited: '2周前', icon: 'ph-exam', color: '#ff4d4f', canvas: '特殊扩展' }
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
        <div class="launch-card" style="height:auto; min-height:180px; align-items:flex-start; padding:1.5rem; border-left:4px solid ${work.color}; transition:all 0.3s ease; background:white; border:1px solid #f0f0f0; border-radius:12px;"
             onclick="openDoc('${work.title}')"
             onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)'; this.style.borderColor='${work.color}'"
             onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='#f0f0f0'">
            <div style="display:flex; align-items:center; justify-content:space-between; width:100%; margin-bottom:1rem;">
                <div class="launch-icon" style="background:${work.color}15; color:${work.color}; width:40px; height:40px; font-size:1.1rem; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                    <i class="ph ${work.icon}"></i>
                </div>
                <div style="font-size:0.75rem; color:#8c8c8c;">${work.edited}</div>
            </div>
            <div class="launch-title" style="font-size:1rem; font-weight:600; margin-bottom:0.5rem; line-height:1.4; color:#262626;">${work.title}</div>
            <div class="launch-desc" style="font-size:0.85rem; color:#8c8c8c; margin-bottom:1rem;">${work.type}</div>
            <div style="margin-top:auto; display:flex; align-items:center; justify-content:space-between;">
                <div style="font-size:0.75rem; padding:0.25rem 0.75rem; background:${work.status === '已完成' ? '#52c41a15' : work.status === '草稿' ? '#faad1415' : '#8c8c8c15'}; color:${work.status === '已完成' ? '#52c41a' : work.status === '草稿' ? '#faad14' : '#8c8c8c'}; border-radius:6px; font-weight:500;">
                    ${work.status}
                </div>
                <i class="ph ph-arrow-right" style="color:#bfbfbf; font-size:0.875rem;"></i>
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
                <div class="launch-card" style="height:auto; min-height:180px; align-items:flex-start; padding:1.5rem; border-left:4px solid ${work.color}; transition:all 0.3s ease; background:white; border:1px solid #f0f0f0; border-radius:12px;"
                     onclick="openDoc('${work.title}', 'Type-${work.type.split('-')[1]}')"
                     onmouseover="this.style.transform='translateY(-2px)'; this.style.boxShadow='0 6px 16px rgba(0,0,0,0.08)'; this.style.borderColor='${work.color}'"
                     onmouseout="this.style.transform='translateY(0)'; this.style.boxShadow='none'; this.style.borderColor='#f0f0f0'">
                    <div style="display:flex; align-items:center; justify-content:space-between; width:100%; margin-bottom:1rem;">
                        <div class="launch-icon" style="background:${work.color}15; color:${work.color}; width:40px; height:40px; font-size:1.1rem; border-radius:8px; display:flex; align-items:center; justify-content:center; flex-shrink:0;">
                            <i class="ph ${work.icon}"></i>
                        </div>
                        <div style="font-size:0.75rem; color:#8c8c8c;">${work.edited}</div>
                    </div>
                    <div class="launch-title" style="font-size:1rem; font-weight:600; margin-bottom:0.5rem; line-height:1.4; color:#262626;">${work.title}</div>
                    <div class="launch-desc" style="font-size:0.85rem; color:#8c8c8c; margin-bottom:1rem;">${work.type}</div>
                    <div style="margin-top:auto; display:flex; align-items:center; justify-content:space-between;">
                        <div style="font-size:0.75rem; padding:0.25rem 0.75rem; background:${work.status === '已完成' ? '#52c41a15' : work.status === '草稿' ? '#faad1415' : work.status === '审核中' ? '#1677ff15' : '#8c8c8c15'}; color:${work.status === '已完成' ? '#52c41a' : work.status === '草稿' ? '#faad14' : work.status === '审核中' ? '#1677ff' : '#8c8c8c'}; border-radius:6px; font-weight:500;">
                            ${work.status}
                        </div>
                        <i class="ph ph-arrow-right" style="color:#bfbfbf; font-size:0.875rem;"></i>
                    </div>
                </div>
            `).join('');
        }
    }
}

// 显示模板库
function showTemplates() {
    const templateHTML = `
        <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center" onclick="this.remove()">
            <div style="background:white; border-radius:16px; padding:2rem; max-width:800px; width:90%; max-height:80vh; overflow-y:auto" onclick="event.stopPropagation()">
                <h2 style="margin-bottom:1.5rem">模板库</h2>
                <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:1rem">
                    <div style="border:1px solid #e5e7eb; border-radius:12px; padding:1rem; cursor:pointer" onclick="openDoc('年度安全培训计划')">
                        <div style="color:#1677ff; font-size:1.5rem; margin-bottom:0.5rem"><i class="ph ph-presentation"></i></div>
                        <div style="font-weight:600; margin-bottom:0.25rem">培训课件模板</div>
                        <div style="font-size:0.85rem; color:#666">PPT课件画布</div>
                    </div>
                    <div style="border:1px solid #e5e7eb; border-radius:12px; padding:1rem; cursor:pointer" onclick="openDoc('安全生产管理制度')">
                        <div style="color:#52c41a; font-size:1.5rem; margin-bottom:0.5rem"><i class="ph ph-file-doc"></i></div>
                        <div style="font-weight:600; margin-bottom:0.25rem">标准公文模板</div>
                        <div style="font-size:0.85rem; color:#666">长文档画布</div>
                    </div>
                    <div style="border:1px solid #e5e7eb; border-radius:12px; padding:1rem; cursor:pointer" onclick="openDoc('隐患整改通知书')">
                        <div style="color:#faad14; font-size:1.5rem; margin-bottom:0.5rem"><i class="ph ph-warning"></i></div>
                        <div style="font-weight:600; margin-bottom:0.25rem">业务单据模板</div>
                        <div style="font-size:0.85rem; color:#666">报告画布</div>
                    </div>
                    <div style="border:1px solid #e5e7eb; border-radius:12px; padding:1rem; cursor:pointer" onclick="openDoc('安全知识考试卷')">
                        <div style="color:#ff4d4f; font-size:1.5rem; margin-bottom:0.5rem"><i class="ph ph-exam"></i></div>
                        <div style="font-weight:600; margin-bottom:0.25rem">考试试卷模板</div>
                        <div style="font-size:0.85rem; color:#666">学考闭环</div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', templateHTML);
}

// 显示创建对话框
function showCreateDialog() {
    const dialogHTML = `
        <div style="position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.5); z-index:9999; display:flex; align-items:center; justify-content:center" onclick="this.remove()">
            <div style="background:white; border-radius:16px; padding:2rem; max-width:600px; width:90%" onclick="event.stopPropagation()">
                <h2 style="margin-bottom:1rem">新建作品</h2>
                <p style="color:#666; margin-bottom:2rem">选择作品类型开始创作</p>
                <div style="display:grid; gap:1rem">
                    <button style="padding:1rem; border:2px solid #e5e7eb; background:white; border-radius:12px; cursor:pointer; text-align:left; transition:all 0.2s" onmouseover="this.style.borderColor='#1677ff'" onmouseout="this.style.borderColor='#e5e7eb'" onclick="openDoc('未命名培训课件'); this.parentElement.parentElement.parentElement.remove()">
                        <div style="display:flex; align-items:center; gap:1rem">
                            <div style="width:48px; height:48px; background:#e6f4ff; color:#1677ff; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem"><i class="ph ph-presentation"></i></div>
                            <div>
                                <div style="font-weight:600; margin-bottom:0.25rem">培训课件 (Courseware)</div>
                                <div style="font-size:0.85rem; color:#666">PPT课件画布 | 支持多媒体插入</div>
                            </div>
                        </div>
                    </button>
                    <button style="padding:1rem; border:2px solid #e5e7eb; background:white; border-radius:12px; cursor:pointer; text-align:left; transition:all 0.2s" onmouseover="this.style.borderColor='#52c41a'" onmouseout="this.style.borderColor='#e5e7eb'" onclick="openDoc('未命名标准公文'); this.parentElement.parentElement.parentElement.remove()">
                        <div style="display:flex; align-items:center; gap:1rem">
                            <div style="width:48px; height:48px; background:#f6ffed; color:#52c41a; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem"><i class="ph ph-file-doc"></i></div>
                            <div>
                                <div style="font-weight:600; margin-bottom:0.25rem">标准公文 (Standard Doc)</div>
                                <div style="font-size:0.85rem; color:#666">长文档画布 | Word式编辑</div>
                            </div>
                        </div>
                    </button>
                    <button style="padding:1rem; border:2px solid #e5e7eb; background:white; border-radius:12px; cursor:pointer; text-align:left; transition:all 0.2s" onmouseover="this.style.borderColor='#faad14'" onmouseout="this.style.borderColor='#e5e7eb'" onclick="openDoc('未命名业务单据'); this.parentElement.parentElement.parentElement.remove()">
                        <div style="display:flex; align-items:center; gap:1rem">
                            <div style="width:48px; height:48px; background:#fffbe6; color:#faad14; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem"><i class="ph ph-warning"></i></div>
                            <div>
                                <div style="font-weight:600; margin-bottom:0.25rem">业务单据 (Business Form)</div>
                                <div style="font-size:0.85rem; color:#666">报告画布 | 标准化表单</div>
                            </div>
                        </div>
                    </button>
                    <button style="padding:1rem; border:2px solid #e5e7eb; background:white; border-radius:12px; cursor:pointer; text-align:left; transition:all 0.2s" onmouseover="this.style.borderColor='#ff4d4f'" onmouseout="this.style.borderColor='#e5e7eb'" onclick="openDoc('未命名考试试卷'); this.parentElement.parentElement.parentElement.remove()">
                        <div style="display:flex; align-items:center; gap:1rem">
                            <div style="width:48px; height:48px; background:#fff2e8; color:#ff4d4f; border-radius:12px; display:flex; align-items:center; justify-content:center; font-size:1.5rem"><i class="ph ph-exam"></i></div>
                            <div>
                                <div style="font-weight:600; margin-bottom:0.25rem">考试试卷 (Examination)</div>
                                <div style="font-size:0.85rem; color:#666">特殊扩展 | 学考闭环</div>
                            </div>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', dialogHTML);
}

// 新的创作中心主页面内容
function getCreatorDashboardContentNew() {
    return `
        <div style="max-width:1400px; margin:0 auto; padding:1rem">
            <!-- Header -->
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:2rem; gap:1rem">
                <div>
                    <h1 style="font-size:1.75rem; font-weight:700; margin-bottom:0.25rem; color:#1a1a1a">创作中心</h1>
                    <p style="color:#666; font-size:0.9rem">管理你的文档和文件夹</p>
                </div>

                <div style="flex:1; max-width:400px; position:relative">
                    <i class="ph ph-magnifying-glass" style="position:absolute; left:12px; top:50%; transform:translateY(-50%); color:#999"></i>
                    <input type="text" placeholder="搜索文档或文件夹..." style="width:100%; padding:0.6rem 1rem 0.6rem 2.5rem; border-radius:8px; border:1px solid #e5e7eb; outline:none; font-size:0.9rem"
                           onfocus="this.style.borderColor='#1677ff'; this.style.boxShadow='0 0 0 2px rgba(22,119,255,0.1)'"
                           onblur="this.style.borderColor='#e5e7eb'; this.style.boxShadow='none'">
                </div>

                <div style="display:flex; gap:0.5rem">
                     <button class="btn-secondary" onclick="showTemplates()" style="padding:0.6rem 1rem; border-radius:8px; font-size:0.9rem; display:flex; align-items:center; gap:0.4rem">
                        <i class="ph ph-layout"></i> 模板库
                     </button>
                     <button class="send-btn" onclick="showCreateDialog()" style="padding:0.6rem 1rem; border-radius:8px; font-size:0.9rem; display:flex; align-items:center; gap:0.4rem">
                        <i class="ph ph-plus"></i> 新建
                     </button>
                </div>
            </div>

            <!-- 文件夹区域 -->
            <div style="margin-bottom:2rem">
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem">
                    <div class="section-title" style="font-size:1rem; font-weight:600; color:#1a1a1a">我的文件夹</div>
                    <button style="background:none; border:none; color:#1677ff; cursor:pointer; font-size:0.85rem; display:flex; align-items:center; gap:0.25rem" onclick="alert('新建文件夹')">
                        <i class="ph ph-folder-plus"></i> 新建文件夹
                    </button>
                </div>
                <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(200px, 1fr)); gap:1rem">
                    <div class="launch-card" style="height:auto; padding:1rem; cursor:pointer; display:flex; align-items:center; gap:0.75rem" onclick="openFolder('培训教材')">
                        <i class="ph ph-folder" style="font-size:2rem; color:#faad14"></i>
                        <div>
                            <div style="font-weight:500; margin-bottom:0.25rem">培训教材</div>
                            <div style="font-size:0.75rem; color:#999">3 个文件</div>
                        </div>
                    </div>
                    <div class="launch-card" style="height:auto; padding:1rem; cursor:pointer; display:flex; align-items:center; gap:0.75rem" onclick="openFolder('安全月报')">
                        <i class="ph ph-folder" style="font-size:2rem; color:#faad14"></i>
                        <div>
                            <div style="font-weight:500; margin-bottom:0.25rem">安全月报</div>
                            <div style="font-size:0.75rem; color:#999">5 个文件</div>
                        </div>
                    </div>
                    <div class="launch-card" style="height:auto; padding:1rem; cursor:pointer; display:flex; align-items:center; gap:0.75rem" onclick="openFolder('应急预案')">
                        <i class="ph ph-folder" style="font-size:2rem; color:#faad14"></i>
                        <div>
                            <div style="font-weight:500; margin-bottom:0.25rem">应急预案</div>
                            <div style="font-size:0.75rem; color:#999">4 个文件</div>
                        </div>
                    </div>
                    <div class="launch-card" style="height:auto; padding:1rem; cursor:pointer; display:flex; align-items:center; gap:0.75rem" onclick="openFolder('考试题库')">
                        <i class="ph ph-folder" style="font-size:2rem; color:#faad14"></i>
                        <div>
                            <div style="font-weight:500; margin-bottom:0.25rem">考试题库</div>
                            <div style="font-size:0.75rem; color:#999">2 个文件</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 最近文档区域 -->
            <div>
                <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:1rem">
                    <div class="section-title" style="font-size:1rem; font-weight:600; color:#1a1a1a">最近文档</div>
                    <div style="display:flex; gap:0.5rem">
                        <button onclick="filterByType('all')" class="filter-btn active" data-filter="all" style="padding:0.4rem 0.75rem; border:1px solid #e5e7eb; background:#1677ff; color:white; border-radius:6px; font-size:0.8rem; cursor:pointer">全部</button>
                        <button onclick="filterByType('Type-1')" class="filter-btn" data-filter="Type-1" style="padding:0.4rem 0.75rem; border:1px solid #e5e7eb; background:white; color:#666; border-radius:6px; font-size:0.8rem; cursor:pointer">课件</button>
                        <button onclick="filterByType('Type-2')" class="filter-btn" data-filter="Type-2" style="padding:0.4rem 0.75rem; border:1px solid #e5e7eb; background:white; color:#666; border-radius:6px; font-size:0.8rem; cursor:pointer">公文</button>
                        <button onclick="filterByType('Type-3')" class="filter-btn" data-filter="Type-3" style="padding:0.4rem 0.75rem; border:1px solid #e5e7eb; background:white; color:#666; border-radius:6px; font-size:0.8rem; cursor:pointer">单据</button>
                        <button onclick="filterByType('Type-4')" class="filter-btn" data-filter="Type-4" style="padding:0.4rem 0.75rem; border:1px solid #e5e7eb; background:white; color:#666; border-radius:6px; font-size:0.8rem; cursor:pointer">试卷</button>
                    </div>
                </div>

                <div id="works-container" style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:1rem">
                    ${getAllWorksCards()}
                </div>
            </div>
        </div>
    `;
}