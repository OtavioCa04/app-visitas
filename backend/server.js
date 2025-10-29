require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const authRoutes = require('./routes/auth');
const visitasRoutes = require('./routes/visitas');
const usersRoutes = require('./routes/users');

const app = express();

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//servir arquivos de upload
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

//servir frontend
app.use(express.static(path.join(__dirname, '../frontend')));

//rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/visitas', visitasRoutes);
app.use('/api/users', usersRoutes);

//rota padrão serve o frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

//error handling
app.use((err, req, res, next) => {
    console.error('Erro:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Erro interno do servidor'
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log('=================================');
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📱 Frontend: http://localhost:${PORT}`);
    console.log(`🔌 API: http://localhost:${PORT}/api`);
    console.log('=================================');
});