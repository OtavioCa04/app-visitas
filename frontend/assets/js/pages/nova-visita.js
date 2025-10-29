// ============================================
// PÁGINA NOVA VISITA
// ============================================

const NovaVisitaPage = {
    videoStream: null,
    capturedFile: null,

    show() {
        const app = document.getElementById('app');
        app.innerHTML = `
            ${Utils.renderHeader(Auth.currentUser?.nome_completo || Auth.currentUser?.email)}
            
            <div class="container">
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">📍 Nova Visita</h2>
                    </div>

                    <div id="visitaAlert"></div>

                    <form id="visitaForm">
                        <div class="form-group">
                            <label class="form-label">Nome do Cliente <span class="required">*</span></label>
                            <input type="text" class="form-input" id="nomeCliente" required 
                                   placeholder="Ex: João Silva">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Empresa <span class="required">*</span></label>
                            <input type="text" class="form-input" id="empresa" required 
                                   placeholder="Ex: Tech Solutions Ltda">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Motivo <span class="required">*</span></label>
                            <select class="form-select" id="motivo" required>
                                <option value="">Selecione...</option>
                                <option value="Prospecção">Prospecção</option>
                                <option value="Reunião">Reunião</option>
                                <option value="Suporte Técnico">Suporte Técnico</option>
                                <option value="Entrega">Entrega</option>
                                <option value="Negociação">Negociação</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Descrição</label>
                            <textarea class="form-textarea" id="descricao" 
                                      placeholder="Descreva os detalhes da visita..."></textarea>
                        </div>

                        <div class="form-group">
                            <label class="form-label">Foto</label>
                            
                            <div id="photoButtons" class="photo-buttons">
                                <button type="button" class="photo-btn" onclick="NovaVisitaPage.startCamera()">
                                    <span class="photo-btn-icon">📷</span>
                                    <span>Tirar Foto</span>
                                </button>
                                <button type="button" class="photo-btn" onclick="document.getElementById('fileInput').click()">
                                    <span class="photo-btn-icon">🖼️</span>
                                    <span>Da Galeria</span>
                                </button>
                            </div>
                            
                            <input type="file" id="fileInput" accept="image/*" style="display: none">
                            
                            <div id="cameraContainer" class="camera-container hidden">
                                <video id="videoElement" autoplay playsinline></video>
                                <div class="camera-controls">
                                    <button type="button" class="btn btn-outline" onclick="NovaVisitaPage.stopCamera()">
                                        Cancelar
                                    </button>
                                    <button type="button" class="btn btn-primary" onclick="NovaVisitaPage.capturePhoto()">
                                        📷 Capturar
                                    </button>
                                </div>
                            </div>

                            <div id="photoPreview" class="photo-preview hidden">
                                <img id="previewImage" src="" alt="Preview">
                                <button type="button" class="btn-remove-photo" onclick="NovaVisitaPage.removePhoto()">
                                    ✕
                                </button>
                            </div>
                        </div>

                        <button type="submit" class="btn btn-primary btn-block">
                            ✉️ Registrar e Enviar
                        </button>
                    </form>
                </div>
            </div>
            
            ${Utils.renderBottomNav('nova')}
        `;

        //event listeners
        document.getElementById('visitaForm').addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('fileInput').addEventListener('change', (e) => this.handleFileSelect(e));
    },

    async startCamera() {
        try {
            this.videoStream = await navigator.mediaDevices.getUserMedia({ 
                video: { facingMode: 'environment' } 
            });
            document.getElementById('videoElement').srcObject = this.videoStream;
            document.getElementById('photoButtons').classList.add('hidden');
            document.getElementById('cameraContainer').classList.remove('hidden');
        } catch (error) {
            alert('Erro ao acessar câmera: ' + error.message);
        }
    },

    stopCamera() {
        if (this.videoStream) {
            this.videoStream.getTracks().forEach(track => track.stop());
            this.videoStream = null;
        }
        document.getElementById('photoButtons').classList.remove('hidden');
        document.getElementById('cameraContainer').classList.add('hidden');
    },

    capturePhoto() {
        const video = document.getElementById('videoElement');
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        
        canvas.toBlob(blob => {
            this.capturedFile = new File([blob], `visita-${Date.now()}.jpg`, { type: 'image/jpeg' });
            document.getElementById('previewImage').src = URL.createObjectURL(blob);
            document.getElementById('photoPreview').classList.remove('hidden');
            this.stopCamera();
        }, 'image/jpeg', 0.8);
    },

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.capturedFile = file;
            document.getElementById('previewImage').src = URL.createObjectURL(file);
            document.getElementById('photoPreview').classList.remove('hidden');
            document.getElementById('photoButtons').classList.add('hidden');
        }
    },

    removePhoto() {
        this.capturedFile = null;
        document.getElementById('photoPreview').classList.add('hidden');
        document.getElementById('photoButtons').classList.remove('hidden');
        document.getElementById('fileInput').value = '';
    },

    async handleSubmit(e) {
        e.preventDefault();
        Utils.showLoading();

        try {
            const formData = new FormData();
            formData.append('nome_cliente', document.getElementById('nomeCliente').value);
            formData.append('empresa', document.getElementById('empresa').value);
            formData.append('motivo', document.getElementById('motivo').value);
            formData.append('descricao', document.getElementById('descricao').value);
            
            if (this.capturedFile) {
                formData.append('foto', this.capturedFile);
            }

            //obter loc
            const location = await Utils.getLocation();
            if (location) {
                formData.append('latitude', location.latitude);
                formData.append('longitude', location.longitude);
            }

            await API.createVisita(formData);
            
            alert('✅ Visita registrada e e-mail enviado com sucesso!');
            HomePage.show();
        } catch (error) {
            Utils.showAlert('visitaAlert', error.message, 'danger');
        } finally {
            Utils.hideLoading();
        }
    }
};