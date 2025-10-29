// ============================================
// AUTENTICAÇÃO
// ============================================

const Auth = {
    currentUser: null,

    //login
    async login(email, password) {
        try {
            Utils.showLoading();
            const data = await API.login(email, password);
            
            localStorage.setItem('token', data.token);
            this.currentUser = data.user;
            
            HomePage.show();
        } catch (error) {
            Utils.showAlert('loginAlert', error.message, 'danger');
        } finally {
            Utils.hideLoading();
        }
    },

    //logout
    logout() {
        localStorage.removeItem('token');
        this.currentUser = null;
        this.showLoginPage();
    },

    //verif autenticação
    async checkAuth() {
        const token = localStorage.getItem('token');
        
        if (!token) {
            this.showLoginPage();
            return false;
        }

        try {
            this.currentUser = await API.me();
            return true;
        } catch (error) {
            this.showLoginPage();
            return false;
        }
    },

    //pag de login
    showLoginPage() {
        const app = document.getElementById('app');
        app.innerHTML = `
            <div class="login-container">
                <div class="login-card">
                    <div class="login-header">
                        <img src="../assets/css/logo.png" alt="Logo StopBy" class="login-logo">
                        <h1 class="login-title">StopBy</h1>
                        <p class="login-subtitle">Gestão de Visitas</p>
                    </div>


                    <div id="loginAlert"></div>

                    <form id="loginForm">
                        <div class="form-group">
                            <label class="form-label">E-mail</label>
                            <input type="email" class="form-input" id="loginEmail" required 
                                   placeholder="seu@email.com">
                        </div>

                        <div class="form-group">
                            <label class="form-label">Senha</label>
                            <input type="password" class="form-input" id="loginPassword" required 
                                   placeholder="••••••••">
                        </div>

                        <button type="submit" class="btn btn-primary btn-block">
                            Entrar
                        </button>
                    </form>

                    <p style="text-align: center; margin-top: 1.5rem; color: var(--secondary); font-size: 0.875rem;">
                        <strong>Usuário teste:</strong><br>
                        Email: teste@exemplo.com<br>
                        Senha: teste123
                    </p>
                </div>
            </div>
        `;

        //event listener do form
        document.getElementById('loginForm').addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            Auth.login(email, password);
        });
    }
};