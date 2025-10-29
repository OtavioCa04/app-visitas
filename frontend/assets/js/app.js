const App = {
    async init() {

        //verificar autenticação
        const isAuthenticated = await Auth.checkAuth();

        if (isAuthenticated) {
            HomePage.show();
        } else {
            Auth.showLoginPage();
        }
    }
};

//iniciar quando o DOM estiver pronto
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => App.init());
} else {
    App.init();
}
