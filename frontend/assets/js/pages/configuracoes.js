// ============================================
// PÁGINA CONFIGURAÇÕES
// ============================================

const ConfiguracoesPage = {
    user: null,

    async show() {
        Utils.showLoading();
        
        try {
            this.user = await API.me();
            
            const app = document.getElementById('app');
            app.innerHTML = `
                ${Utils.renderHeader(Auth.currentUser?.nome_completo || Auth.currentUser?.email)}
                
                <div class="container">
                    <!-- Informações Pessoais -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">⚙️ Configurações</h2>
                        </div>

                        <div id="configAlert"></div>

                        <form id="configForm">
                            <div class="form-group">
                                <label class="form-label">Nome Completo</label>
                                <input type="text" class="form-input" id="nomeCompleto" 
                                       value="${this.user.nome_completo || ''}"
                                       placeholder="Seu nome completo">
                            </div>

                            <div class="form-group">
                                <label class="form-label">Cargo / Função</label>
                                <input type="text" class="form-input" id="cargo" 
                                       value="${this.user.cargo || ''}"
                                       placeholder="Ex: Vendedor, Representante">
                            </div>

                            <div class="form-group">
                                <label class="form-label">E-mail de Login</label>
                                <input type="email" class="form-input" 
                                       value="${this.user.email}" 
                                       disabled>
                                <small style="color: var(--secondary); font-size: 0.875rem;">
                                    Este e-mail não pode ser alterado
                                </small>
                            </div>

                            <button type="submit" class="btn btn-primary btn-block">
                                💾 Salvar Configurações
                            </button>
                        </form>
                    </div>

                    <!-- E-mails de Destino -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">📧 E-mails de Destino</h2>
                        </div>

                        <p style="color: var(--secondary); margin-bottom: 1rem; font-size: 0.875rem;">
                            Adicione os e-mails que receberão os relatórios de visita automaticamente
                        </p>

                        <div id="emailAlert"></div>

                        <div class="email-add">
                            <input type="email" class="form-input" id="novoEmail" 
                                   placeholder="exemplo@email.com">
                            <button type="button" class="btn btn-primary" onclick="ConfiguracoesPage.adicionarEmail()">
                                ➕ Adicionar
                            </button>
                        </div>

                        <div id="emailsList" class="email-list" style="margin-top: 1rem;">
                            ${Utils.renderEmailsList(this.user.emails_destino || [])}
                        </div>
                    </div>

                    <!-- Informações do Sistema -->
                    <div class="card" style="background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);">
                        <div style="text-align: center; color: var(--secondary);">
                            <p style="font-size: 0.875rem; margin-bottom: 0.5rem;">
                                <strong>StopBy</strong> - Sistema de Gestão de Visitas
                            </p>
                            <p style="font-size: 0.75rem;">
                                Versão 1.0.0 | © ${new Date().getFullYear()}
                            </p>
                        </div>
                    </div>
                </div>
                
                ${Utils.renderBottomNav('config')}
            `;

            //event listeners
            document.getElementById('configForm').addEventListener('submit', (e) => this.handleSaveConfig(e));

        } catch (error) {
            console.error('Erro ao carregar configurações:', error);
            alert('Erro ao carregar dados');
        } finally {
            Utils.hideLoading();
        }
    },

    async handleSaveConfig(e) {
        e.preventDefault();
        Utils.showLoading();

        try {
            const data = {
                nome_completo: document.getElementById('nomeCompleto').value,
                cargo: document.getElementById('cargo').value
            };

            await API.updateMe(data);
            
            //atualizar usuário atual
            Auth.currentUser = await API.me();

            Utils.showAlert('configAlert', '✅ Configurações salvas com sucesso!', 'success');
            
            setTimeout(() => {
                Utils.clearAlert('configAlert');
            }, 3000);

        } catch (error) {
            Utils.showAlert('configAlert', error.message, 'danger');
        } finally {
            Utils.hideLoading();
        }
    },

    async adicionarEmail() {
        const emailInput = document.getElementById('novoEmail');
        const email = emailInput.value.trim();

        if (!email) {
            Utils.showAlert('emailAlert', 'Digite um e-mail', 'danger');
            return;
        }

        if (!Utils.isValidEmail(email)) {
            Utils.showAlert('emailAlert', 'E-mail inválido', 'danger');
            return;
        }

        Utils.showLoading();
        try {
            await API.addEmail(email);
            emailInput.value = '';
            Utils.clearAlert('emailAlert');
            
            //recarregar página
            this.show();
        } catch (error) {
            Utils.showAlert('emailAlert', error.message, 'danger');
            Utils.hideLoading();
        }
    },

    async removerEmail(email) {
        if (!confirm(`Deseja realmente remover o e-mail:\n${email}?`)) {
            return;
        }

        Utils.showLoading();
        try {
            await API.removeEmail(email);
            
            //recarregar página
            this.show();
        } catch (error) {
            alert('Erro ao remover e-mail: ' + error.message);
            Utils.hideLoading();
        }
    }
};