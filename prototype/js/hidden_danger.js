(function () {
    const template = `
        <div class="scroll-container">
            <div class="form-card">
                <div class="card-header">
                    <h3>登记信息</h3>
                    <i class="ph ph-caret-up"></i>
                </div>

                <div class="form-grid">
                    <div class="form-group required span-2">
                        <label>地点</label>
                        <input type="text" placeholder="请输入内容" class="form-control">
                    </div>
                    <div class="form-group">
                        <label>所属区域</label>
                        <div class="select-wrapper">
                            <select class="form-control">
                                <option>请选择</option>
                            </select>
                        </div>
                    </div>

                    <div class="form-group">
                        <label>问题所属部门/相关方</label>
                        <div style="flex: 1; display: flex; flex-direction: column; gap: 4px;">
                            <div class="search-input-wrapper">
                                <input type="text" placeholder="请选择" class="form-control">
                                <i class="ph ph-magnifying-glass search-icon"></i>
                            </div>
                            <div class="help-text hint" style="margin-top: 0;">初步确认问题所属单位</div>
                        </div>
                    </div>
                    <div class="form-group full-width">
                        <label>问题描述</label>
                        <div class="textarea-container" style="display: flex; gap: 8px; width: 100%;">
                            <div class="textarea-wrapper">
                                <textarea class="form-control" placeholder="请输入内容" rows="4"></textarea>
                                <span class="char-count">0/200</span>
                            </div>
                            <button class="btn-extract" style="position: static; transform: none; margin-top: 4px;">隐患排查库</button>
                        </div>
                    </div>

                    <div class="form-group full-width">
                        <label>建议治理措施</label>
                        <div class="textarea-wrapper">
                            <textarea class="form-control" placeholder="请输入内容" rows="4"></textarea>
                            <span class="char-count">0/200</span>
                        </div>
                    </div>

                    <div class="form-group required">
                        <label>发现人</label>
                        <div class="text-display">管理员</div>
                    </div>
                    <div class="form-group">
                        <label>发现人部门</label>
                        <div class="text-display">安全管理处</div>
                    </div>
                    <div class="form-group">
                        <label>发现人班组</label>
                        <div class="text-display">安全管理处</div>
                    </div>

                    <div class="form-group required">
                        <label>发现日期</label>
                        <div class="date-input-wrapper">
                            <input type="date" value="2025-12-29" class="form-control date-input">
                        </div>
                    </div>

                    <div class="form-group">
                        <label>无需提供整改照片</label>
                        <div class="toggle-wrapper" style="justify-content: flex-start;">
                            <div class="toggle-switch">
                                <input type="checkbox" id="noPhoto">
                                <label for="noPhoto"></label>
                            </div>
                        </div>
                    </div>

                    <div class="form-group"></div>

                    <div class="form-group required full-width">
                        <label>问题照片</label>
                        <div class="photo-upload-container" id="photoUploadApp"></div>
                    </div>

                    <div class="form-group full-width">
                        <label>问题视频</label>
                        <div class="video-upload-container" id="videoUploadApp"></div>
                    </div>
                </div>
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
                    <i class="ph ph-x" onclick="window.HiddenDangerPage.closeModal()"></i>
                </div>
                <div class="modal-body">
                    <p>已检测到用户上传<span id="photoCount">1</span>张照片，是否需要AI助手自动帮您识别照片内的隐患问题？</p>
                </div>
                <div class="modal-footer">
                    <button class="btn btn-default" onclick="window.HiddenDangerPage.closeModal()">取消</button>
                    <button class="btn btn-primary" onclick="window.HiddenDangerPage.startRecognition()">AI识别</button>
                </div>
            </div>
        </div>
    `;

    const state = {
        photoApp: null,
        videoApp: null,
        particleTimer: null
    };

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

    function closeModal() {
        const modal = document.getElementById('aiModal');
        if (modal) {
            modal.style.display = 'none';
        }
    }

    function startRecognition() {
        closeModal();

        const uploadedImages = [];
        document.querySelectorAll('#photoUploadApp .el-upload-list__item img').forEach(function (img) {
            if (img && img.src) {
                uploadedImages.push(img.src);
            }
        });

        if (!uploadedImages.length) {
            return;
        }

        window.AIAssistant.toggleAI(true);
        setTimeout(function () {
            window.AIAssistant.submitSceneRequest({
                text: '请帮我识别这些照片中的安全隐患',
                attachments: uploadedImages,
                skillId: 'hazard_analysis',
                reply: window.AIAssistantScenes.getScene('hidden_danger').createRecognitionReply()
            });
        }, 300);
    }

    function createPhotoUploadApp() {
        const app = Vue.createApp({
            setup: function () {
                const fileList = Vue.ref([]);
                const dialogImageUrl = Vue.ref('');
                const dialogVisible = Vue.ref(false);

                const handlePreview = function (uploadFile) {
                    dialogImageUrl.value = uploadFile.url;
                    dialogVisible.value = true;
                };

                const handleChange = function (uploadFile, uploadFiles) {
                    if (uploadFile.status === 'ready' && uploadFiles.length > 0) {
                        setTimeout(function () {
                            const photoCount = document.getElementById('photoCount');
                            const aiModal = document.getElementById('aiModal');
                            if (photoCount) {
                                photoCount.innerText = uploadFiles.length;
                            }
                            if (aiModal) {
                                aiModal.style.display = 'flex';
                            }
                        }, 300);
                    }
                };

                const handleExceed = function () {
                    ElementPlus.ElMessage.warning('最多只能上传 5 张图片');
                };

                const triggerAIRecognition = function (event) {
                    if (!fileList.value.length) {
                        ElementPlus.ElMessage.warning('请先上传照片');
                        return;
                    }
                    if (window.AIAssistant && window.AIAssistant.state.isAnalyzing) {
                        ElementPlus.ElMessage.info('AI正在分析中，请稍候...');
                        return;
                    }

                    const button = event && event.target && event.target.closest('.ai-recognize-btn');
                    if (button) {
                        createParticleEffect(button);
                    }
                    startRecognition();
                };

                return {
                    fileList: fileList,
                    dialogImageUrl: dialogImageUrl,
                    dialogVisible: dialogVisible,
                    handlePreview: handlePreview,
                    handleRemove: function () {},
                    handleChange: handleChange,
                    handleExceed: handleExceed,
                    triggerAIRecognition: triggerAIRecognition
                };
            },
            template: `
                <el-upload v-model:file-list="fileList" action="#" list-type="picture-card" :auto-upload="false" :limit="5"
                    accept="image/jpeg,image/png" :on-preview="handlePreview" :on-remove="handleRemove" :on-change="handleChange"
                    :on-exceed="handleExceed">
                    <el-icon><Plus /></el-icon>
                    <template #tip>
                        <div class="el-upload__tip">支持 jpg/png 格式，最多上传 5 张</div>
                    </template>
                </el-upload>
                <el-button v-if="fileList.length > 0" class="ai-recognize-btn" @click="triggerAIRecognition($event)">
                    <i class="ph ph-magic-wand"></i>
                    <span>AI智能分析</span>
                </el-button>
                <el-dialog v-model="dialogVisible" width="800px">
                    <img :src="dialogImageUrl" alt="预览图片" style="width: 100%;" />
                </el-dialog>
            `
        });
        app.use(ElementPlus);
        Object.entries(ElementPlusIconsVue).forEach(function (entry) {
            app.component(entry[0], entry[1]);
        });
        state.photoApp = app;
        app.mount('#photoUploadApp');
    }

    function createVideoUploadApp() {
        const app = Vue.createApp({
            setup: function () {
                const videoList = Vue.ref([]);

                const formatSize = function (bytes) {
                    if (!bytes) {
                        return '0 B';
                    }
                    const k = 1024;
                    const sizes = ['B', 'KB', 'MB', 'GB'];
                    const i = Math.floor(Math.log(bytes) / Math.log(k));
                    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
                };

                const beforeVideoUpload = function (file) {
                    const isMP4 = file.type === 'video/mp4';
                    const isLt50M = file.size / 1024 / 1024 < 50;
                    if (!isMP4) {
                        ElementPlus.ElMessage.error('只能上传 MP4 格式的视频!');
                        return false;
                    }
                    if (!isLt50M) {
                        ElementPlus.ElMessage.error('视频大小不能超过 50MB!');
                        return false;
                    }
                    return true;
                };

                const handleVideoRemove = function (file) {
                    const index = videoList.value.findIndex(function (item) {
                        return item.uid === file.uid;
                    });
                    if (index > -1) {
                        videoList.value.splice(index, 1);
                    }
                };

                return {
                    videoList: videoList,
                    formatSize: formatSize,
                    beforeVideoUpload: beforeVideoUpload,
                    handleVideoRemove: handleVideoRemove,
                    handleVideoChange: function () {},
                    handleVideoExceed: function () {
                        ElementPlus.ElMessage.warning('最多只能上传 5 个视频');
                    }
                };
            },
            template: `
                <el-upload v-model:file-list="videoList" action="#" :auto-upload="false" :limit="5"
                    accept="video/mp4" :on-remove="handleVideoRemove" :on-change="handleVideoChange"
                    :on-exceed="handleVideoExceed" :before-upload="beforeVideoUpload">
                    <el-button type="primary">
                        <el-icon><VideoCamera /></el-icon>
                        添加视频
                    </el-button>
                    <template #tip>
                        <div class="el-upload__tip">支持 MP4 格式，最多 5 个，单个文件不超过 50MB</div>
                    </template>
                    <template #file="{ file }">
                        <div class="video-file-item">
                            <el-icon class="video-icon"><VideoCamera /></el-icon>
                            <span class="video-name">{{ file.name }}</span>
                            <span class="video-size">{{ formatSize(file.size) }}</span>
                            <el-icon class="video-remove" @click="handleVideoRemove(file)"><Close /></el-icon>
                        </div>
                    </template>
                </el-upload>
            `
        });
        app.use(ElementPlus);
        Object.entries(ElementPlusIconsVue).forEach(function (entry) {
            app.component(entry[0], entry[1]);
        });
        state.videoApp = app;
        app.mount('#videoUploadApp');
    }

    function buildAssistantConfig() {
        return {
            sceneId: 'hidden_danger',
            onAnalysisComplete: function (results) {
                console.log('AI 分析完成，共识别出', results.length, '个隐患');
            },
            onInsertToForm: function (selectedResults) {
                if (!selectedResults.length) {
                    ElementPlus.ElMessage.warning('请先选择要插入的隐患分析结果');
                    return;
                }

                const descriptions = [];
                const measures = [];
                selectedResults.forEach(function (result) {
                    descriptions.push('【' + result.name + '】' + result.description);
                    measures.push('【' + result.name + '】' + (result.measure || result.suggestion));
                });

                const textareas = document.querySelectorAll('.form-group.full-width .textarea-wrapper textarea');
                const descTextarea = textareas[0];
                const measureTextarea = textareas[1];

                if (descTextarea) {
                    descTextarea.value = descriptions.join('\n\n');
                    const charCount = descTextarea.parentElement.querySelector('.char-count');
                    if (charCount) {
                        charCount.textContent = descTextarea.value.length + '/200';
                    }
                }

                if (measureTextarea) {
                    measureTextarea.value = measures.join('\n\n');
                    const charCount = measureTextarea.parentElement.querySelector('.char-count');
                    if (charCount) {
                        charCount.textContent = measureTextarea.value.length + '/200';
                    }
                }

                ElementPlus.ElMessage.success('已成功插入到问题登记表');
            }
        };
    }

    window.HiddenDangerPage = {
        mount: function (container) {
            container.innerHTML = template;
            createPhotoUploadApp();
            createVideoUploadApp();
            return {
                assistantConfig: buildAssistantConfig()
            };
        },
        unmount: function () {
            closeModal();
            if (state.photoApp) {
                state.photoApp.unmount();
            }
            if (state.videoApp) {
                state.videoApp.unmount();
            }
            state.photoApp = null;
            state.videoApp = null;
            if (state.particleTimer) {
                clearTimeout(state.particleTimer);
                state.particleTimer = null;
            }
            document.querySelectorAll('.el-overlay, .image-preview-overlay').forEach(function (node) {
                if (node && node.parentNode) {
                    node.parentNode.removeChild(node);
                }
            });
        },
        createParticleEffect: createParticleEffect,
        closeModal: closeModal,
        startRecognition: startRecognition
    };
})();
