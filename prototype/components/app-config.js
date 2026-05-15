(function () {
    const pages = [
        {
            id: 'entry',
            path: 'index.html',
            label: 'AI助手演示入口',
            icon: 'ph-squares-four',
            sceneId: 'smart_qa',
            moduleName: 'EntryPage',
            tabTitle: 'AI助手演示入口',
            default: true,
            hiddenInSidebar: true,
            contentAreaClass: ''
        },
        {
            id: 'workbench_home',
            path: 'workbench_home.html',
            label: '工作台首页',
            icon: 'ph-house',
            sceneId: 'workbench_push',
            moduleName: 'WorkbenchHomePage',
            tabTitle: '工作台首页',
            contentAreaClass: 'workbench-home-content-area'
        },
        {
            id: 'hidden_danger',
            path: 'hidden_danger.html',
            label: '智能隐患分析',
            icon: 'ph-camera',
            sceneId: 'hidden_danger',
            moduleName: 'HiddenDangerPage',
            tabTitle: '问题登记: 问题登记',
            contentAreaClass: ''
        },
        {
            id: 'certificate_recognition',
            path: 'certificate_recognition.html',
            label: '辅助填报',
            icon: 'ph-identification-card',
            sceneId: 'certificate_recognition',
            moduleName: 'CertificateRecognitionPage',
            tabTitle: '项目资质',
            contentAreaClass: ''
        },
        {
            id: 'smart_qa',
            path: 'smart_qa.html',
            label: '智能问答',
            icon: 'ph-chat-circle-dots',
            sceneId: 'smart_qa',
            moduleName: 'SmartQAPage',
            tabTitle: '作业票审批',
            contentAreaClass: 'smart-qa-content-area'
        },
        {
            id: 'intelligent_report',
            path: '智能问数与报告生成.html',
            label: '智能问数与报告生成',
            icon: 'ph-chart-line-up',
            sceneId: 'intelligent_report',
            moduleName: 'HiddenDangerListPage',
            tabTitle: '智能问数与报告生成',
            contentAreaClass: 'hidden-danger-list-content-area'
        },
        {
            id: 'intelligent_inspection',
            path: 'intelligent_inspection.html',
            label: '智能巡检',
            icon: 'ph-binoculars',
            sceneId: 'intelligent_inspection',
            moduleName: 'IntelligentInspectionPage',
            tabTitle: '智能巡检',
            contentAreaClass: 'smart-qa-content-area'
        },
        {
            id: 'intelligent_inspection_report',
            path: 'intelligent_inspection_report.html',
            label: '智能巡检报告',
            icon: 'ph-file-text',
            sceneId: 'intelligent_inspection',
            moduleName: 'IntelligentInspectionPage',
            tabTitle: '智能巡检报告',
            hiddenInSidebar: true,
            contentAreaClass: 'smart-qa-content-area'
        },
        {
            id: 'legal_regulation_library',
            path: '法律法规标准库.html',
            label: '文件解读',
            icon: 'ph-scales',
            sceneId: 'standard_file_interpretation',
            moduleName: 'LegalRegulationLibraryPage',
            tabTitle: '法律法规标准库',
            contentAreaClass: 'legal-regulation-library-content-area'
        },
        {
            id: 'standard_file_interpretation',
            path: 'standard_file_interpretation.html',
            label: '标准文件解读',
            icon: 'ph-file-text',
            sceneId: 'standard_file_interpretation',
            moduleName: 'StandardFileInterpretationPage',
            tabTitle: '标准文件解读',
            hiddenInSidebar: true,
            contentAreaClass: 'smart-qa-content-area'
        },
        {
            id: 'emergency_plan_generation',
            path: '应急预案生成.html',
            label: '智能应急预案',
            icon: 'ph-siren',
            sceneId: 'emergency_plan_generation',
            moduleName: 'EmergencyPlanGenerationPage',
            tabTitle: '应急预案生成',
            contentAreaClass: 'smart-qa-content-area'
        },
        {
            id: 'hidden_danger_list',
            path: '隐患列表.html',
            label: '隐患列表',
            icon: 'ph-list-bullets',
            sceneId: 'intelligent_report',
            moduleName: 'HiddenDangerListPage',
            tabTitle: '隐患治理',
            hiddenInSidebar: true,
            contentAreaClass: 'hidden-danger-list-content-area'
        },
        {
            id: 'legal_regulation_library_detail',
            path: '法律法规标准库新建.html',
            label: '法律法规标准库新建',
            icon: 'ph-file-plus',
            sceneId: 'standard_file_interpretation',
            moduleName: 'LegalRegulationLibraryDetailPage',
            tabTitle: '法律法规标准库新建',
            hiddenInSidebar: true,
            contentAreaClass: 'legal-regulation-library-content-area'
        }
    ];

    const topNav = [
        { label: '工作台', href: '#' },
        { label: '应用中心', href: '#' },
        { label: 'ai助手demo', href: '#', active: true, closable: true }
    ];

    window.AppConfig = {
        topNav: topNav,
        pages: pages,
        defaultEntry: 'index.html',
        getPage: function (pageId) {
            return pages.find(function (page) {
                return page.id === pageId;
            }) || null;
        },
        getPageByPath: function (path) {
            return pages.find(function (page) {
                return page.path === path;
            }) || null;
        },
        getDefaultPage: function () {
            return pages.find(function (page) {
                return page.default;
            }) || pages[0] || null;
        }
    };
})();
