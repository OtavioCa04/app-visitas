const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/database');

//login
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        //buscar usuário
        const [users] = await db.query(
            'SELECT * FROM usuarios WHERE email = ? AND ativo = true',
            [email]
        );

        if (users.length === 0) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        const user = users[0];

        //verificar senha
        const validPassword = await bcrypt.compare(password, user.senha_hash);
        if (!validPassword) {
            return res.status(401).json({ error: 'Email ou senha inválidos' });
        }

        //gerar token
        const token = jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                nome_completo: user.nome_completo,
                cargo: user.cargo
            }
        });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: 'Erro ao fazer login' });
    }
};

//registro (opcional - para criar novos usuários)
exports.register = async (req, res) => {
    try {
        const { email, password, nome_completo, cargo } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        //verificar se email já existe
        const [existing] = await db.query('SELECT id FROM usuarios WHERE email = ?', [email]);
        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        //hash da senha
        const senha_hash = await bcrypt.hash(password, 10);

        //inserir usuário
        const [result] = await db.query(
            'INSERT INTO usuarios (email, senha_hash, nome_completo, cargo) VALUES (?, ?, ?, ?)',
            [email, senha_hash, nome_completo, cargo]
        );

        //gerar token
        const token = jwt.sign(
            { id: result.insertId, email },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: result.insertId,
                email,
                nome_completo,
                cargo
            }
        });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: 'Erro ao registrar usuário' });
    }
};

//perfil do usuário
exports.me = async (req, res) => {
    try {
        const [users] = await db.query(
            'SELECT id, email, nome_completo, cargo FROM usuarios WHERE id = ?',
            [req.userId]
        );

        if (users.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }

        //buscar emails de destino
        const [emails] = await db.query(
            'SELECT email FROM emails_destino WHERE usuario_id = ?',
            [req.userId]
        );

        const user = users[0];
        user.emails_destino = emails.map(e => e.email);

        res.json(user);
    } catch (error) {
        console.error('Erro ao buscar perfil:', error);
        res.status(500).json({ error: 'Erro ao buscar perfil' });
    }
};

//atualizar perfil
exports.updateMe = async (req, res) => {
    try {
        const { nome_completo, cargo } = req.body;

        await db.query(
            'UPDATE usuarios SET nome_completo = ?, cargo = ? WHERE id = ?',
            [nome_completo, cargo, req.userId]
        );

        res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
        console.error('Erro ao atualizar perfil:', error);
        res.status(500).json({ error: 'Erro ao atualizar perfil' });
    }
};