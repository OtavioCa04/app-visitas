// ============================================
// PÁGINA HISTÓRICO
// ============================================

const HistoricoPage = {
    visitas: [],

    async show() {
        Utils.showLoading();
        
        try {
            this.visitas = await API.getVisitas();
            
            const app = document.getElementById('app');
            app.innerHTML = `
                ${Utils.renderHeader(Auth.currentUser?.nome_completo || Auth.currentUser?.email)}
                
                <div class="container">
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">📋 Histórico de Visitas</h2>
                        </div>

                        <!-- Filtros -->
                        <div class="filters">
                            <div class="search-box">
                                <span class="search-icon">🔍</span>
                                <input type="text" class="form-input search-input" 
                                       id="searchInput" 
                                       placeholder="Buscar cliente ou empresa...">
                            </div>
                            <select class="form-select" id="filterMotivo">
                                <option value="">Todos os motivos</option>
                                <option value="Prospecção">Prospecção</option>
                                <option value="Reunião">Reunião</option>
                                <option value="Suporte Técnico">Suporte Técnico</option>
                                <option value="Entrega">Entrega</option>
                                <option value="Negociação">Negociação</option>
                                <option value="Follow-up">Follow-up</option>
                                <option value="Outro">Outro</option>
                            </select>
                        </div>

                        <div class="filters">
                            <select class="form-select" id="filterStatus">
                                <option value="">Todos os status</option>
                                <option value="enviado">Enviado</option>
                                <option value="pendente">Pendente</option>
                            </select>
                            <button class="btn btn-outline" id="clearFilters">
                                🗑️ Limpar Filtros
                            </button>
                        </div>

                        <!-- Lista de Visitas -->
                        <div id="visitasList">
                            ${this.renderVisitas(this.visitas)}
                        </div>
                    </div>
                </div>
                
                ${Utils.renderBottomNav('historico')}
            `;

            //event listeners
            document.getElementById('searchInput').addEventListener('input', () => this.filterVisitas());
            document.getElementById('filterMotivo').addEventListener('change', () => this.filterVisitas());
            document.getElementById('filterStatus').addEventListener('change', () => this.filterVisitas());
            document.getElementById('clearFilters').addEventListener('click', () => this.clearFilters());

        } catch (error) {
            console.error('Erro ao carregar histórico:', error);
            alert('Erro ao carregar visitas');
        } finally {
            Utils.hideLoading();
        }
    },

    renderVisitas(visitas) {
        if (visitas.length === 0) {
            return `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p>Nenhuma visita encontrada</p>
                </div>
            `;
        }

        return visitas.map(v => Utils.renderVisitaItem(v)).join('');
    },

    filterVisitas() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const motivo = document.getElementById('filterMotivo').value;
        const status = document.getElementById('filterStatus').value;

        const filtered = this.visitas.filter(v => {
            const matchSearch = 
                v.nome_cliente.toLowerCase().includes(searchTerm) || 
                v.empresa.toLowerCase().includes(searchTerm);
            
            const matchMotivo = !motivo || v.motivo === motivo;
            
            const matchStatus = 
                !status || 
                (status === 'enviado' && v.enviado_email) ||
                (status === 'pendente' && !v.enviado_email);

            return matchSearch && matchMotivo && matchStatus;
        });

        document.getElementById('visitasList').innerHTML = this.renderVisitas(filtered);
    },

    clearFilters() {
        document.getElementById('searchInput').value = '';
        document.getElementById('filterMotivo').value = '';
        document.getElementById('filterStatus').value = '';
        this.filterVisitas();
    }
};