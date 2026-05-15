window.CertificateRecognitionPage = (function () {
    const template = `
        <div class="scroll-container">
            <div class="form-card">
                <div class="card-header">
                    <h3>项目资质</h3>
                    <i class="ph ph-caret-up"></i>
                </div>

                <div class="form-grid">
                    <div class="form-group required">
                        <label>资质类型</label>
                        <input type="text" placeholder="营业执照" value="营业执照" class="form-control" id="qualificationType">
                    </div>
                    <div class="form-group required">
                        <label>统一社会信用代码</label>
                        <input type="text" placeholder="请输入内容" class="form-control" id="creditCode">
                    </div>
                    <div class="form-group required">
                        <label>企业名称</label>
                        <input type="text" placeholder="请输入内容" class="form-control" id="companyName">
                    </div>

                    <div class="form-group required">
                        <label>成立日期</label>
                        <div class="date-input-wrapper">
                            <input type="date" class="form-control date-input" id="establishDate">
                        </div>
                    </div>
                    <div class="form-group required">
                        <label>法定代表人</label>
                        <input type="text" placeholder="请输入内容" class="form-control" id="legalPerson">
                    </div>
                    <div class="form-group required">
                        <label>注册资本(万元)</label>
                        <input type="text" placeholder="请输入内容" class="form-control" id="registeredCapital">
                    </div>

                    <div class="form-group required">
                        <label>类型</label>
                        <input type="text" placeholder="请输入内容" class="form-control" id="companyType">
                    </div>
                    <div class="form-group required">
                        <label>登记机关</label>
                        <input type="text" placeholder="请输入内容" class="form-control" id="registrationAuthority">
                    </div>
                    <div class="form-group required">
                        <label>登记时间</label>
                        <div class="date-input-wrapper">
                            <input type="date" class="form-control date-input" id="registrationDate">
                        </div>
                    </div>

                    <div class="form-group required full-width">
                        <label>住所</label>
                        <input type="text" placeholder="请输入内容" class="form-control" id="address">
                    </div>

                    <div class="form-group full-width">
                        <label>经营范围</label>
                        <div class="textarea-wrapper">
                            <textarea class="form-control" placeholder="请输入内容" rows="4" id="businessScope"></textarea>
                            <span class="char-count" id="charCounter">0/200</span>
                        </div>
                    </div>

                    <div class="form-group full-width">
                        <label>资质附件</label>
                        <div class="file-upload-container" id="fileUploadApp"></div>
                    </div>
                </div>
            </div>

            <div class="form-card" style="margin-top: 16px;">
                <div class="card-header">
                    <h3>人员清单</h3>
                    <i class="ph ph-caret-up"></i>
                </div>

                <div id="personnelTableApp" style="padding: 24px;"></div>
            </div>
        </div>

        <footer class="bottom-bar">
            <button class="btn btn-default"><i class="ph ph-x-circle"></i> 关闭</button>
            <button class="btn btn-primary"><i class="ph ph-floppy-disk"></i> 保存</button>
            <button class="btn btn-primary"><i class="ph ph-paper-plane-right"></i> 提交</button>
        </footer>

        <div class="modal-overlay" id="aiModal" style="display: none;">
            <div class="modal">
                <div class="modal-header">
                    <span>AI智能识别</span>
                    <i class="ph ph-x" onclick="window.CertificateRecognitionPage.closeModal()"></i>
                </div>
                <div class="modal-body">
                    <p>已检测到用户上传<span id="fileCount">1</span>个文件,是否需要AI助手自动帮您识别文件内的信息?</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" onclick="window.CertificateRecognitionPage.closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="window.CertificateRecognitionPage.startRecognition()">AI识别</button>
                </div>
            </div>
        </div>

        <div id="addPersonnelDialogApp"></div>
    `;

    const state = {
        uploadedFiles: [],
        latestEnterpriseResult: null,
        latestPersonnelResult: null,
        objectUrls: [],
        fileUploadApp: null,
        personnelTableApp: null,
        addPersonnelDialogApp: null,
        particleTimer: null
    };

    function trackUrl(url) {
        if (url && state.objectUrls.indexOf(url) === -1) {
            state.objectUrls.push(url);
        }
        return url;
    }

    function revokeObjectUrls() {
        state.objectUrls.forEach(function (url) {
            URL.revokeObjectURL(url);
        });
        state.objectUrls = [];
    }

    function createParticleEffect(sourceElement) {
        const rect = sourceElement.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        const endX = window.innerWidth - 40;
        const endY = window.innerHeight - 40;

        const container = document.createElement('div');
        container.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;';
        document.body.appendChild(container);

        const particleCount = 20;
        const colors = ['#8B5CF6', '#3B82F6', '#A78BFA', '#60A5FA', '#C4B5FD'];

        for (let i = 0; i < particleCount; i += 1) {
            const particle = document.createElement('div');
            const size = Math.random() * 8 + 4;
            const color = colors[Math.floor(Math.random() * colors.length)];
            const delay = i * 30;
            const offsetX = (Math.random() - 0.5) * 60;
            const offsetY = (Math.random() - 0.5) * 60;

            particle.style.cssText = 'position: absolute; left: ' + startX + 'px; top: ' + startY + 'px; width: ' + size + 'px; height: ' + size + 'px; background: ' + color + '; border-radius: 50%; box-shadow: 0 0 ' + size + 'px ' + color + '; opacity: 1; transform: translate(-50%, -50%);';
            container.appendChild(particle);

            setTimeout(function () {
                particle.style.transition = 'all ' + (0.6 + Math.random() * 0.3) + 's cubic-bezier(0.25, 0.46, 0.45, 0.94)';
                particle.style.left = (endX + offsetX) + 'px';
                particle.style.top = (endY + offsetY) + 'px';
                particle.style.opacity = '0';
                particle.style.transform = 'translate(-50%, -50%) scale(0.3)';
            }, delay);
        }

        state.particleTimer = setTimeout(function () {
            container.remove();
        }, 1200);
    }

    function setUploadedFiles(files) {
        state.uploadedFiles = files || [];
    }

    function previewFullImage(src) {
        const overlay = document.createElement('div');
        overlay.className = 'image-preview-overlay';
        overlay.innerHTML = [
            '<div class="preview-container">',
            '    <img src="' + src + '" alt="预览">',
            '    <span class="close-preview" onclick="this.parentElement.parentElement.remove()">',
            '        <i class="ph ph-x"></i>',
            '    </span>',
            '</div>'
        ].join('');
        overlay.onclick = function (event) {
            if (event.target === overlay) {
                overlay.remove();
            }
        };
        document.body.appendChild(overlay);
    }

    function closeModal() {
        const modal = document.getElementById('aiModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function setLatestEnterpriseResult(result) {
        state.latestEnterpriseResult = result;
    }

    function setLatestPersonnelResult(result) {
        state.latestPersonnelResult = result;
    }

    function fillEnterpriseForm(result) {
        const mapping = {
            creditCode: 'creditCode',
            companyName: 'companyName',
            establishDate: 'establishDate',
            legalPerson: 'legalPerson',
            registeredCapital: 'registeredCapital',
            companyType: 'companyType',
            registrationAuthority: 'registrationAuthority',
            registrationDate: 'registrationDate',
            address: 'address',
            businessScope: 'businessScope'
        };

        Object.keys(mapping).forEach(function (key) {
            const element = document.getElementById(mapping[key]);
            if (element) {
                element.value = result[key] || '';
            }
        });

        const charCounter = document.getElementById('charCounter');
        const businessScope = document.getElementById('businessScope');
        if (charCounter && businessScope) {
            charCounter.textContent = businessScope.value.length + '/200';
        }
    }

    function calculateAge(idCard) {
        if (!idCard || idCard.length < 14) {
            return 0;
        }

        const year = parseInt(idCard.substr(6, 4), 10);
        const month = parseInt(idCard.substr(10, 2), 10);
        const day = parseInt(idCard.substr(12, 2), 10);
        const today = new Date();

        let age = today.getFullYear() - year;
        if ((today.getMonth() + 1) < month || ((today.getMonth() + 1) === month && today.getDate() < day)) {
            age -= 1;
        }
        return age;
    }

    function buildPersonnelRow(result) {
        return {
            avatar: result.avatar,
            name: result.name,
            gender: result.gender,
            phone: result.phone || '',
            age: calculateAge(result.certNumber),
            certStatus: '正常',
            certCheckResult: result.personnelType,
            status: '入场',
            safetyTraining: '未完成'
        };
    }

    function openAssistantAndSubmit(text, attachments, mode, skillId) {
        window.AIAssistant.toggleAI(true);
        setTimeout(function () {
            window.AIAssistant.submitSceneRequest({
                text: text,
                attachments: attachments,
                skillId: skillId,
                extras: { mode: mode }
            });
        }, 300);
    }

    function startRecognition() {
        closeModal();
        if (!state.uploadedFiles.length) {
            return;
        }
        openAssistantAndSubmit('请帮我识别这些企业资质证照文件中的信息', state.uploadedFiles, 'enterprise', 'enterprise_certificate');
    }

    function startEnterpriseRecognitionFromFiles(files, triggerElement) {
        if (!files.length) {
            ElementPlus.ElMessage.warning('请先上传文件');
            return;
        }

        setUploadedFiles(files);
        if (triggerElement) {
            createParticleEffect(triggerElement);
        }
        openAssistantAndSubmit('请帮我识别这些企业资质证照文件中的信息', files, 'enterprise', 'enterprise_certificate');
    }

    function startPersonnelRecognitionWithImages(imageUrls) {
        if (!imageUrls.length) {
            return;
        }

        const centerPoint = {
            getBoundingClientRect: function () {
                return {
                    left: window.innerWidth / 2,
                    top: window.innerHeight / 2,
                    width: 0,
                    height: 0
                };
            }
        };
        createParticleEffect(centerPoint);
        openAssistantAndSubmit('请帮我识别这些人员证件中的信息', imageUrls, 'personnel', 'personnel_certificate');
    }

    function insertEnterpriseResult() {
        if (!state.latestEnterpriseResult) {
            ElementPlus.ElMessage.warning('没有可插入的识别结果');
            return;
        }

        fillEnterpriseForm(state.latestEnterpriseResult);
        ElementPlus.ElMessage.success('已成功插入资质基本信息');
    }

    function insertPersonnelResult() {
        if (!state.latestPersonnelResult) {
            ElementPlus.ElMessage.warning('没有可插入的识别结果');
            return;
        }

        if (!window.personnelTableInstance || typeof window.personnelTableInstance.addPersonnel !== 'function') {
            ElementPlus.ElMessage.error('人员清单未正确初始化');
            return;
        }

        window.personnelTableInstance.addPersonnel(buildPersonnelRow(state.latestPersonnelResult));
    }

    function createFileUploadApp() {
        const app = Vue.createApp({
            setup: function () {
                const fileList = Vue.ref([]);

                const toStoredFiles = function (files) {
                    return files.map(function (file) {
                        if (file.raw) {
                            return {
                                url: trackUrl(URL.createObjectURL(file.raw)),
                                name: file.name,
                                size: file.size || ''
                            };
                        }
                        return file;
                    });
                };

                const handlePreview = function (uploadFile) {
                    if (uploadFile.raw && uploadFile.raw.type.startsWith('image/')) {
                        previewFullImage(trackUrl(URL.createObjectURL(uploadFile.raw)));
                    } else {
                        ElementPlus.ElMessage.info('PDF文件无法预览,请下载后查看');
                    }
                };

                const handleRemove = function (uploadFile, uploadFiles) {
                    setUploadedFiles(toStoredFiles(uploadFiles));
                };

                const handleChange = function (uploadFile, uploadFiles) {
                    if (uploadFile.status === 'ready' && uploadFiles.length > 0) {
                        setUploadedFiles(toStoredFiles(uploadFiles));
                        setTimeout(function () {
                            const fileCount = document.getElementById('fileCount');
                            const aiModal = document.getElementById('aiModal');
                            if (fileCount) {
                                fileCount.innerText = uploadFiles.length;
                            }
                            if (aiModal) {
                                aiModal.style.display = 'flex';
                            }
                        }, 300);
                    }
                };

                return {
                    fileList: fileList,
                    handlePreview: handlePreview,
                    handleRemove: handleRemove,
                    handleChange: handleChange,
                    handleExceed: function () {
                        ElementPlus.ElMessage.warning('最多只能上传 5 个文件');
                    },
                    triggerAIRecognition: function (event) {
                        const files = toStoredFiles(fileList.value);
                        const button = event && event.target && event.target.closest('.ai-recognize-btn');
                        startEnterpriseRecognitionFromFiles(files, button || document.querySelector('.ai-recognize-btn'));
                    }
                };
            },
            template: `
                <div style="display: flex; flex-direction: column; gap: 12px; width: 100%;">
                    <el-upload v-model:file-list="fileList" action="#" :auto-upload="false" :limit="5"
                        accept="image/jpeg,image/png,application/pdf" :on-preview="handlePreview"
                        :on-remove="handleRemove" :on-change="handleChange" :on-exceed="handleExceed">
                        <el-button type="primary">
                            <el-icon><UploadFilled /></el-icon>
                            选择文件
                        </el-button>
                        <template #tip>
                            <div class="el-upload__tip">支持 jpg/png/pdf 格式，最多上传 5 个文件</div>
                        </template>
                    </el-upload>
                    <el-button v-if="fileList.length > 0" class="ai-recognize-btn" @click="triggerAIRecognition($event)" style="align-self: flex-start;">
                        <i class="ph ph-magic-wand"></i>
                        <span>AI智能分析</span>
                    </el-button>
                </div>
            `
        });
        app.use(ElementPlus);
        Object.entries(ElementPlusIconsVue).forEach(function (entry) {
            app.component(entry[0], entry[1]);
        });
        state.fileUploadApp = app;
        app.mount('#fileUploadApp');
    }

    function createPersonnelTableApp() {
        const app = Vue.createApp({
            setup: function () {
                const personnelData = Vue.ref([
                    {
                        id: 1,
                        avatar: 'https://ui-avatars.com/api/?name=张伟&background=3366CC&color=fff',
                        name: '张伟',
                        gender: '男',
                        phone: '13812345678',
                        age: 35,
                        certStatus: '正常',
                        certCheckResult: '电工证、焊工证',
                        status: '入场',
                        safetyTraining: '已完成'
                    },
                    {
                        id: 2,
                        avatar: 'https://ui-avatars.com/api/?name=李娜&background=F33E3E&color=fff',
                        name: '李娜',
                        gender: '女',
                        phone: '13987654321',
                        age: 28,
                        certStatus: '即将过期',
                        certCheckResult: '安全员证',
                        status: '入场',
                        safetyTraining: '已完成'
                    },
                    {
                        id: 3,
                        avatar: 'https://ui-avatars.com/api/?name=王强&background=30BE13&color=fff',
                        name: '王强',
                        gender: '男',
                        phone: '13765432109',
                        age: 42,
                        certStatus: '已过期',
                        certCheckResult: '高空作业证',
                        status: '离场',
                        safetyTraining: '未完成'
                    }
                ]);

                const addPersonnel = function (personnelInfo) {
                    const newId = personnelData.value.length
                        ? Math.max.apply(null, personnelData.value.map(function (item) { return item.id; })) + 1
                        : 1;
                    personnelData.value.push(Object.assign({ id: newId }, personnelInfo));
                    ElementPlus.ElMessage.success('人员已成功添加到清单');
                };

                window.personnelTableInstance = {
                    personnelData: personnelData,
                    addPersonnel: addPersonnel
                };

                return {
                    personnelData: personnelData,
                    handleView: function (row) {
                        ElementPlus.ElMessage.info('查看人员: ' + row.name);
                    },
                    handleEdit: function (row) {
                        ElementPlus.ElMessage.info('编辑人员: ' + row.name);
                    },
                    handleDelete: function (row) {
                        ElementPlus.ElMessageBox.confirm('确定要删除人员 ' + row.name + ' 吗？', '确认删除', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                            type: 'warning'
                        }).then(function () {
                            const index = personnelData.value.findIndex(function (item) {
                                return item.id === row.id;
                            });
                            if (index > -1) {
                                personnelData.value.splice(index, 1);
                                ElementPlus.ElMessage.success('删除成功');
                            }
                        }).catch(function () {
                            ElementPlus.ElMessage.info('已取消删除');
                        });
                    },
                    showAddPersonnelDialog: function () {
                        if (window.addPersonnelDialogInstance) {
                            window.addPersonnelDialogInstance.addMethodDialogVisible.value = true;
                        }
                    }
                };
            },
            template: `
                <div>
                    <div style="margin-bottom: 16px;">
                        <el-button type="primary" @click="showAddPersonnelDialog">
                            <i class="ph ph-plus"></i>
                            添加人员
                        </el-button>
                    </div>
                    <el-table :data="personnelData" style="width: 100%"
                        :header-cell-style="{background: '#F8FAFC', color: '#151B26', fontWeight: '600', fontSize: '12px', padding: '16px'}"
                        :cell-style="{fontSize: '12px', padding: '12px 16px'}" stripe>
                        <el-table-column label="头像" width="80" align="center">
                            <template #default="scope">
                                <el-popover placement="right" :width="200" trigger="hover">
                                    <template #reference>
                                        <el-avatar :size="40" :src="scope.row.avatar"></el-avatar>
                                    </template>
                                    <img :src="scope.row.avatar" style="width: 100%;" />
                                </el-popover>
                            </template>
                        </el-table-column>
                        <el-table-column label="姓名" width="120">
                            <template #default="scope">
                                <span style="color: #3366CC; text-decoration: underline; cursor: pointer;">{{ scope.row.name }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="gender" label="性别" width="80" align="center"></el-table-column>
                        <el-table-column prop="phone" label="联系电话" width="140"></el-table-column>
                        <el-table-column prop="age" label="年龄" width="80" align="center"></el-table-column>
                        <el-table-column label="证书状态" width="120" align="center">
                            <template #default="scope">
                                <el-tag :type="scope.row.certStatus === '正常' ? 'success' : scope.row.certStatus === '即将过期' ? 'warning' : 'danger'" size="small">
                                    {{ scope.row.certStatus }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column prop="certCheckResult" label="资质证书（校验结果）" width="180"></el-table-column>
                        <el-table-column label="状态" width="100" align="center">
                            <template #default="scope">
                                <el-tag :type="scope.row.status === '入场' ? 'primary' : 'info'" size="small">
                                    {{ scope.row.status }}
                                </el-tag>
                            </template>
                        </el-table-column>
                        <el-table-column label="入场安全教育培训" width="160" align="center">
                            <template #default="scope">
                                <span :style="{color: scope.row.safetyTraining === '已完成' ? '#30BE13' : '#84868C'}">
                                    {{ scope.row.safetyTraining }}
                                </span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="140" align="center" fixed="right">
                            <template #default="scope">
                                <el-button link type="primary" size="small" @click="handleView(scope.row)"><i class="ph ph-eye"></i></el-button>
                                <el-button link type="primary" size="small" @click="handleEdit(scope.row)"><i class="ph ph-pencil"></i></el-button>
                                <el-button link type="danger" size="small" @click="handleDelete(scope.row)"><i class="ph ph-trash"></i></el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            `
        });
        app.use(ElementPlus);
        Object.entries(ElementPlusIconsVue).forEach(function (entry) {
            app.component(entry[0], entry[1]);
        });
        state.personnelTableApp = app;
        app.mount('#personnelTableApp');
    }

    function createAddPersonnelDialogApp() {
        const app = Vue.createApp({
            setup: function () {
                const addMethodDialogVisible = Vue.ref(false);

                window.addPersonnelDialogInstance = {
                    addMethodDialogVisible: addMethodDialogVisible
                };

                return {
                    addMethodDialogVisible: addMethodDialogVisible,
                    selectFromList: function () {
                        addMethodDialogVisible.value = false;
                        ElementPlus.ElMessage.info('从人员清单中选择功能开发中...');
                    },
                    recognizeCredential: function () {
                        addMethodDialogVisible.value = false;
                        const input = document.createElement('input');
                        input.type = 'file';
                        input.accept = 'image/jpeg,image/png';
                        input.multiple = true;
                        input.onchange = function (event) {
                            const files = Array.from(event.target.files || []);
                            if (!files.length) {
                                input.onchange = null;
                                return;
                            }
                            if (files.length > 5) {
                                ElementPlus.ElMessage.warning('最多只能上传 5 张证照');
                                input.onchange = null;
                                return;
                            }

                            const imageUrls = [];
                            let loadedCount = 0;
                            files.forEach(function (file) {
                                const reader = new FileReader();
                                reader.onload = function (readerEvent) {
                                    imageUrls.push(readerEvent.target.result);
                                    loadedCount += 1;
                                    if (loadedCount === files.length) {
                                        startPersonnelRecognitionWithImages(imageUrls);
                                        input.onchange = null;
                                    }
                                };
                                reader.readAsDataURL(file);
                            });
                        };
                        input.click();
                    }
                };
            },
            template: `
                <el-dialog v-model="addMethodDialogVisible" title="添加人员" width="500px" append-to-body :close-on-click-modal="false">
                    <div style="text-align: center; padding: 20px 0;">
                        <p style="font-size: 14px; color: #5C5F66; margin-bottom: 24px;">请选择添加人员的方式</p>
                        <div style="display: flex; gap: 16px; justify-content: center;">
                            <el-button type="primary" size="large" @click="selectFromList" style="width: 180px;">
                                <i class="ph ph-users"></i>
                                从人员清单中选择
                            </el-button>
                            <el-button type="primary" size="large" @click="recognizeCredential" style="width: 180px;">
                                <i class="ph ph-scan"></i>
                                识别证照录入
                            </el-button>
                        </div>
                    </div>
                </el-dialog>
            `
        });
        app.use(ElementPlus);
        Object.entries(ElementPlusIconsVue).forEach(function (entry) {
            app.component(entry[0], entry[1]);
        });
        state.addPersonnelDialogApp = app;
        app.mount('#addPersonnelDialogApp');
    }

    function buildAssistantConfig() {
        return {
            sceneId: 'certificate_recognition'
        };
    }

    return {
        mount: function (container) {
            container.innerHTML = template;
            createFileUploadApp();
            createPersonnelTableApp();
            createAddPersonnelDialogApp();
            return {
                assistantConfig: buildAssistantConfig()
            };
        },
        unmount: function () {
            closeModal();
            if (state.fileUploadApp) {
                state.fileUploadApp.unmount();
            }
            if (state.personnelTableApp) {
                state.personnelTableApp.unmount();
            }
            if (state.addPersonnelDialogApp) {
                state.addPersonnelDialogApp.unmount();
            }
            state.fileUploadApp = null;
            state.personnelTableApp = null;
            state.addPersonnelDialogApp = null;
            state.uploadedFiles = [];
            state.latestEnterpriseResult = null;
            state.latestPersonnelResult = null;
            revokeObjectUrls();
            if (state.particleTimer) {
                clearTimeout(state.particleTimer);
                state.particleTimer = null;
            }
            window.personnelTableInstance = null;
            window.addPersonnelDialogInstance = null;
            document.querySelectorAll('.el-overlay, .image-preview-overlay').forEach(function (node) {
                if (node && node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
        },
        createParticleEffect: createParticleEffect,
        setUploadedFiles: setUploadedFiles,
        previewFullImage: previewFullImage,
        closeModal: closeModal,
        startRecognition: startRecognition,
        startEnterpriseRecognitionFromFiles: startEnterpriseRecognitionFromFiles,
        startPersonnelRecognitionWithImages: startPersonnelRecognitionWithImages,
        setLatestEnterpriseResult: setLatestEnterpriseResult,
        setLatestPersonnelResult: setLatestPersonnelResult,
        insertEnterpriseResult: insertEnterpriseResult,
        insertPersonnelResult: insertPersonnelResult
    };
})();
