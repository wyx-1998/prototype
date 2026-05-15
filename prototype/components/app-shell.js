(function () {
    function renderTopNav() {
        return window.AppConfig.topNav.map(function (item) {
            return '<a href="' + item.href + '" class="nav-link' + (item.active ? ' active' : '') + '">' +
                item.label +
                (item.closable ? ' <i class="ph ph-x"></i>' : '') +
                '</a>';
        }).join('');
    }

    function renderSidebar(pageId) {
        return window.AppConfig.pages.filter(function (page) {
            return !page.hiddenInSidebar;
        }).map(function (page) {
            const activeClass = page.id === pageId ? ' active' : '';
            return '<div class="menu-item' + activeClass + '" onclick="AppShell.navigateToPageById(\'' + page.id + '\')">' +
                '<i class="ph ' + page.icon + '"></i>' +
                '<span>' + page.label + '</span>' +
                '</div>';
        }).join('');
    }

    window.AppShell = {
        currentPageId: '',
        currentPageModule: null,
        pageContainer: null,
        contentArea: null,
        started: false,

        init: function (options) {
            const pageId = options && options.pageId ? options.pageId : '';
            const headerMount = document.getElementById('appShellHeader');
            const sidebarMount = document.getElementById('appShellSidebar');
            this.contentArea = document.querySelector('.content-area');
            this.pageContainer = document.getElementById('appPageContainer');

            if (headerMount) {
                headerMount.className = 'top-header';
                headerMount.innerHTML = [
                    '<div class="header-left">',
                    '  <div class="logo-area">',
                    '      <span class="logo-blue">LOGO</span>',
                    '      <span class="system-title">智能安全生产管理系统</span>',
                    '      <i class="ph ph-caret-left"></i>',
                    '  </div>',
                    '  <nav class="top-nav">' + renderTopNav() + '</nav>',
                    '</div>',
                    '<div class="header-right">',
                    '  <div class="header-icons">',
                    '      <i class="ph ph-globe"></i>',
                    '      <i class="ph ph-question"></i>',
                    '      <i class="ph ph-caret-right"></i>',
                    '  </div>',
                    '  <div class="header-tools">',
                    '      <i class="ph ph-t-shirt"></i>',
                    '      <i class="ph ph-headset"></i>',
                    '      <i class="ph ph-download-simple"></i>',
                    '      <i class="ph ph-envelope-simple"></i>',
                    '      <i class="ph ph-corners-out"></i>',
                    '      <i class="ph ph-power"></i>',
                    '  </div>',
                    '  <div class="user-profile-sm">',
                    '      <img src="https://ui-avatars.com/api/?name=Admin&background=random" alt="User" class="avatar-sm">',
                    '      <span class="username">张三</span>',
                    '  </div>',
                    '</div>'
                ].join('');
            }

            if (sidebarMount) {
                sidebarMount.className = 'left-sidebar';
                sidebarMount.innerHTML = [
                    '<div class="sidebar-header">',
                    '    <i class="ph ph-list"></i>',
                    '</div>',
                    '<div class="sidebar-menu">' + renderSidebar(pageId) + '</div>'
                ].join('');
            }
        },

        start: function () {
            if (!this.started) {
                window.addEventListener('hashchange', this.handleHashChange.bind(this));
                this.started = true;
            }

            const initialPageId = this.getPageIdFromHash() || (window.AppConfig.getDefaultPage() || {}).id;
            this.navigateToPageById(initialPageId || 'entry', { skipHash: true });
        },

        handleHashChange: function () {
            const pageId = this.getPageIdFromHash() || (window.AppConfig.getDefaultPage() || {}).id;
            if (!pageId || pageId === this.currentPageId) {
                return;
            }
            this.navigateToPageById(pageId, { skipHash: true });
        },

        getPageIdFromHash: function () {
            return window.location.hash.replace(/^#/, '').trim();
        },

        getPageModule: function (pageConfig) {
            if (!pageConfig || !pageConfig.moduleName) {
                return null;
            }
            return window[pageConfig.moduleName] || null;
        },

        setContentAreaClass: function (pageConfig) {
            if (!this.contentArea) {
                this.contentArea = document.querySelector('.content-area');
            }
            if (!this.contentArea) {
                return;
            }
            const extraClass = pageConfig && pageConfig.contentAreaClass ? ' ' + pageConfig.contentAreaClass : '';
            this.contentArea.className = 'content-area' + extraClass;
        },

        setContentTab: function (pageConfig) {
            const tabItem = document.querySelector('.content-tabs .tab-item');
            if (!tabItem || !pageConfig) {
                return;
            }
            tabItem.innerHTML = pageConfig.tabTitle + ' <i class="ph ph-x"></i>';
        },

        syncHash: function (pageId) {
            if (pageId === 'entry') {
                if (window.location.hash) {
                    history.replaceState(null, '', window.location.pathname + window.location.search);
                }
                return;
            }
            if (window.location.hash !== '#' + pageId) {
                window.location.hash = pageId;
            }
        },

        updateAIAssistantScene: function (pageConfig, assistantConfig) {
            if (!window.AIAssistant || typeof window.AIAssistant.setScene !== 'function') {
                return;
            }

            const nextConfig = Object.assign({
                sceneId: pageConfig && pageConfig.sceneId ? pageConfig.sceneId : '',
                resetConversation: true,
                onAnalysisComplete: null,
                onInsertToForm: null,
                welcomeMessage: pageConfig && pageConfig.sceneId === 'workbench_push'
                    ? ''
                    : '您好，{userName}！我是您的安全生产AI助手，请向我提问吧'
            }, assistantConfig || {});

            window.AIAssistant.setScene(nextConfig);
        },

        unmountCurrentPage: function () {
            if (this.currentPageModule && typeof this.currentPageModule.unmount === 'function') {
                this.currentPageModule.unmount();
            }
            this.currentPageModule = null;
        },

        navigateToPage: function (page) {
            const byId = window.AppConfig.getPage(page);
            if (byId) {
                this.navigateToPageById(byId.id);
                return;
            }
            this.navigateToPath(page);
        },

        navigateToPath: function (path) {
            const pageConfig = window.AppConfig.getPageByPath(path);
            if (!pageConfig) {
                return;
            }
            this.navigateToPageById(pageConfig.id);
        },

        navigateToPageById: function (pageId, options) {
            const pageConfig = window.AppConfig.getPage(pageId);
            if (!pageConfig) {
                return;
            }

            if (!this.pageContainer) {
                this.pageContainer = document.getElementById('appPageContainer');
            }
            if (!this.pageContainer) {
                return;
            }

            if (this.currentPageId === pageConfig.id) {
                if (!options || !options.skipHash) {
                    this.syncHash(pageConfig.id);
                }
                return;
            }

            this.unmountCurrentPage();
            this.currentPageId = pageConfig.id;
            this.setContentAreaClass(pageConfig);
            this.setContentTab(pageConfig);
            this.pageContainer.innerHTML = '';

            const pageModule = this.getPageModule(pageConfig);
            if (!pageModule || typeof pageModule.mount !== 'function') {
                this.pageContainer.innerHTML = '<div class="entry-page"><div class="form-card" style="padding:24px;">页面模块未找到：' + pageConfig.label + '</div></div>';
                this.init({ pageId: pageConfig.id });
                return;
            }

            this.currentPageModule = pageModule;
            const mountResult = pageModule.mount(this.pageContainer, {
                pageConfig: pageConfig,
                shell: this
            }) || {};

            this.init({ pageId: pageConfig.id });
            this.updateAIAssistantScene(pageConfig, mountResult.assistantConfig || null);

            if (!options || !options.skipHash) {
                this.syncHash(pageConfig.id);
            }
        }
    };
})();
