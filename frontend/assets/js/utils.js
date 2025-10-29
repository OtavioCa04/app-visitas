// ============================================
// UTILITÁRIOS GERAIS
// ============================================

const Utils = {
    //loading
    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
    },

    hideLoading() {
        document.getElementById('loading').classList.add('hidden');
    },

    //formatação de data
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    //validar email
    isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    },

    //mostrar alerta
    showAlert(containerId, message, type = 'danger') {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="alert alert-${type}">
                    ${message}
                </div>
            `;

            // Remover após 5 segundos
            setTimeout(() => {
                container.innerHTML = '';
            }, 5000);
        }
    },

    //limpar alerta
    clearAlert(containerId) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = '';
        }
    },

    //render do header
    renderHeader(userName) {
        return `
            <header class="header">
                <div class="header-content">
                    <div class="header-title">
                        <img src="../assets/css/logo.png" alt="Logo StopBy" class="app-logo">
                        <div>
                            <h1>StopBy</h1>
                            <div class="header-subtitle">Gestão de Visitas</div>
                        </div>
                    </div>
                    <div class="user-info">
                        <span style="font-size: 0.875rem;">${userName || ''}</span>
                        <button class="btn-logout" onclick="Auth.logout()">Sair</button>
                    </div>
                </div>
            </header>
        `;
    },

    //render da nav inferior
    renderBottomNav(activePage) {
        return `
            <nav class="bottom-nav">
                <div class="nav-items">
                    <button class="nav-item ${activePage === 'home' ? 'active' : ''}" onclick="HomePage.show()">
                        <div class="nav-icon">🏠</div>
                        <div class="nav-label">Home</div>
                    </button>
                    <button class="nav-item ${activePage === 'nova' ? 'active' : ''}" onclick="NovaVisitaPage.show()">
                        <div class="nav-icon">➕</div>
                        <div class="nav-label">Nova</div>
                    </button>
                    <button class="nav-item ${activePage === 'historico' ? 'active' : ''}" onclick="HistoricoPage.show()">
                        <div class="nav-icon">🕒</div>
                        <div class="nav-label">Histórico</div>
                    </button>
                    <button class="nav-item ${activePage === 'config' ? 'active' : ''}" onclick="ConfiguracoesPage.show()">
                        <div class="nav-icon">⚙️</div>
                        <div class="nav-label">Config</div>
                    </button>
                </div>
            </nav>
        `;
    },

    //render item de visita
    renderVisitaItem(visita) {
        return `
            <div class="visita-item">
                <div class="visita-header">
                    <div>
                        <div class="visita-cliente">${visita.nome_cliente}</div>
                        <div class="visita-empresa">🏢 ${visita.empresa}</div>
                    </div>
                    <span class="badge ${visita.enviado_email ? 'badge-success' : 'badge-warning'}">
                        ${visita.enviado_email ? '✅ Enviado' : '⏳ Pendente'}
                    </span>
                </div>

                <div class="visita-motivo">
                    <strong>📍 Motivo:</strong> ${visita.motivo}
                </div>

                ${visita.descricao ? `
                    <div class="visita-descricao">${visita.descricao}</div>
                ` : ''}

                ${visita.foto_url ? `
                    <img src="${visita.foto_url}" alt="Foto da visita" 
                         style="width: 100%; border-radius: 0.5rem; margin: 0.75rem 0; cursor: pointer;" 
                         onclick="window.open('${visita.foto_url}', '_blank')">
                ` : ''}

                <div class="visita-footer">
                    <span>📅 ${this.formatDate(visita.data_hora)}</span>
                    ${visita.usuario_nome ? `<span>👤 ${visita.usuario_nome}</span>` : ''}
                </div>
            </div>
        `;
    },

    //render lista de emails
    renderEmailsList(emails) {
        if (!emails || emails.length === 0) {
            return '<div class="empty-state" style="padding: 2rem;"><p>Nenhum e-mail cadastrado</p></div>';
        }
        return emails.map(email => `
            <div class="email-item">
                <span>📧 ${typeof email === 'string' ? email : email.email}</span>
                <button type="button" class="btn btn-danger" 
                        style="padding: 0.5rem 1rem;" 
                        onclick="ConfiguracoesPage.removerEmail('${typeof email === 'string' ? email : email.email}')">
                    🗑️
                </button>
            </div>
        `).join('');
    },

    //obter loc
    async getLocation() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocalização não suportada'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    resolve({
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    });
                },
                (error) => {
                    console.warn('Erro ao obter localização:', error);
                    resolve(null); // Não bloqueia se falhar
                }
            );
        });
    }
};