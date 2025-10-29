//configuração da API
const API_URL = 'http://localhost:3000/api';

//funções de API
const API = {
    //headers padrão
    getHeaders(includeAuth = true) {
        const headers = {
            'Content-Type': 'application/json'
        };

        if (includeAuth) {
            const token = localStorage.getItem('token');
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }
        }

        return headers;
    },

    //fetch genérico
    async fetch(endpoint, options = {}) {
        try {
            const token = localStorage.getItem('token');
            const headers = options.headers || {};

            if (token && !options.noAuth) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            if (!(options.body instanceof FormData)) {
                headers['Content-Type'] = 'application/json';
            }

            const response = await fetch(`${API_URL}${endpoint}`, {
                ...options,
                headers
            });

            if (response.status === 401) {
                localStorage.removeItem('token');
                window.location.reload();
                throw new Error('Não autorizado');
            }

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erro na requisição');
            }

            return data;
        } catch (error) {
            console.error('Erro na API:', error);
            throw error;
        }
    },

    //auth
    async login(email, password) {
        return this.fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
            noAuth: true
        });
    },

    async register(data) {
        return this.fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify(data),
            noAuth: true
        });
    },

    async me() {
        return this.fetch('/auth/me');
    },

    async updateMe(data) {
        return this.fetch('/auth/me', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    //visitas
    async getVisitas() {
        return this.fetch('/visitas');
    },

    async createVisita(formData) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_URL}/visitas`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Erro ao criar visita');
        }

        return response.json();
    },

    async getVisita(id) {
        return this.fetch(`/visitas/${id}`);
    },

    // Emails
    async getEmails() {
        return this.fetch('/users/emails');
    },

    async addEmail(email) {
        return this.fetch('/users/emails', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
    },

    async removeEmail(email) {
        return this.fetch(`/users/emails/${encodeURIComponent(email)}`, {
            method: 'DELETE'
        });
    }
};