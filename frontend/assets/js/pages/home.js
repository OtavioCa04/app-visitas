// ============================================
// PÁGINA HOME
// ============================================

const HomePage = {
    async show() {
        Utils.showLoading();
        
        try {
            const visitas = await API.getVisitas();
            
            //estatísticas
            const hoje = visitas.filter(v => {
                const hoje = new Date().toDateString();
                const dataVisita = new Date(v.data_hora).toDateString();
                return hoje === dataVisita;
            }).length;

            const semana = visitas.filter(v => {
                const diff = Date.now() - new Date(v.data_hora).getTime();
                return diff < 7 * 24 * 60 * 60 * 1000;
            }).length;

            const app = document.getElementById('app');
            app.innerHTML = `
                ${Utils.renderHeader(Auth.currentUser?.nome_completo || Auth.currentUser?.email)}
                
                <div class="container">
                    <!-- Stats -->
                    <div class="stats-grid">
                        <div class="stat-card">
                            <div class="stat-label">📅 Hoje</div>
                            <div class="stat-value">${hoje}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">📊 Total</div>
                            <div class="stat-value">${visitas.length}</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-label">📈 Semana</div>
                            <div class="stat-value">${semana}</div>
                        </div>
                    </div>

                    <!-- Últimas Visitas -->
                    <div class="card">
                        <div class="card-header">
                            <h2 class="card-title">Últimas Visitas</h2>
                        </div>
                        
                        ${visitas.length > 0 
                            ? visitas.slice(0, 5).map(v => Utils.renderVisitaItem(v)).join('') 
                            : `
                                <div class="empty-state">
                                    <div class="empty-state-icon">📍</div>
                                    <p>Nenhuma visita registrada ainda</p>
                                    <button class="btn btn-primary" onclick="NovaVisitaPage.show()" style="margin-top: 1rem;">
                                        ➕ Registrar Primeira Visita
                                    </button>
                                </div>
                            `
                        }
                    </div>
                </div>
                
                ${Utils.renderBottomNav('home')}
            `;
        } catch (error) {
            console.error('Erro ao carregar home:', error);
            alert('Erro ao carregar dados');
        } finally {
            Utils.hideLoading();
        }
    }
};