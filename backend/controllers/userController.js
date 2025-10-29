const db = require('../config/database');

//adicionar email de destino
exports.addEmail = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email é obrigatório' });
        }

        //validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Email inválido' });
        }

        //verificar se já existe
        const [existing] = await db.query(
            'SELECT id FROM emails_destino WHERE usuario_id = ? AND email = ?',
            [req.userId, email]
        );

        if (existing.length > 0) {
            return res.status(400).json({ error: 'Email já cadastrado' });
        }

        //inserir email
        await db.query(
            'INSERT INTO emails_destino (usuario_id, email) VALUES (?, ?)',
            [req.userId, email]
        );

        res.status(201).json({ message: 'Email adicionado com sucesso' });
    } catch (error) {
        console.error('Erro ao adicionar email:', error);
        res.status(500).json({ error: 'Erro ao adicionar email' });
    }
};

//remover email de destino
exports.removeEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const [result] = await db.query(
            'DELETE FROM emails_destino WHERE usuario_id = ? AND email = ?',
            [req.userId, email]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Email não encontrado' });
        }

        res.json({ message: 'Email removido com sucesso' });
    } catch (error) {
        console.error('Erro ao remover email:', error);
        res.status(500).json({ error: 'Erro ao remover email' });
    }
};

//listar emails de destino
exports.listEmails = async (req, res) => {
    try {
        const [emails] = await db.query(
            'SELECT email, created_at FROM emails_destino WHERE usuario_id = ? ORDER BY created_at DESC',
            [req.userId]
        );

        res.json(emails);
    } catch (error) {
        console.error('Erro ao listar emails:', error);
        res.status(500).json({ error: 'Erro ao listar emails' });
    }
};