const db = require('../config/database');
const emailService = require('../services/emailService');

//listar visitas do usuário
exports.list = async (req, res) => {
    try {
        const [visitas] = await db.query(
            'SELECT * FROM visitas WHERE usuario_id = ? ORDER BY data_hora DESC',
            [req.userId]
        );

        res.json(visitas);
    } catch (error) {
        console.error('Erro ao listar visitas:', error);
        res.status(500).json({ error: 'Erro ao listar visitas' });
    }
};

//criar nova visita
exports.create = async (req, res) => {
    try {
        const { nome_cliente, empresa, motivo, descricao, latitude, longitude } = req.body;

        if (!nome_cliente || !empresa || !motivo) {
            return res.status(400).json({ error: 'Campos obrigatórios: nome_cliente, empresa, motivo' });
        }

        //buscar dados do usuário
        const [users] = await db.query(
            'SELECT nome_completo, email FROM usuarios WHERE id = ?',
            [req.userId]
        );
        const usuario_nome = users[0]?.nome_completo || users[0]?.email;

        //URL da foto (se foi enviada)
        const foto_url = req.file ? `http://localhost:${process.env.PORT}/uploads/${req.file.filename}` : null;

        //inserir visita
        const [result] = await db.query(
            `INSERT INTO visitas 
            (usuario_id, nome_cliente, empresa, motivo, descricao, foto_url, latitude, longitude, data_hora, usuario_nome) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), ?)`,
            [req.userId, nome_cliente, empresa, motivo, descricao, foto_url, latitude, longitude, usuario_nome]
        );

        const visitaId = result.insertId;

        //buscar emails de destino
        const [emails] = await db.query(
            'SELECT email FROM emails_destino WHERE usuario_id = ?',
            [req.userId]
        );

        //enviar emails
        if (emails.length > 0) {
            const visitaData = {
                id: visitaId,
                nome_cliente,
                empresa,
                motivo,
                descricao,
                foto_url,
                latitude,
                longitude,
                usuario_nome,
                data_hora: new Date()
            };

            for (const emailRow of emails) {
                try {
                    await emailService.enviarRelatorioVisita(emailRow.email, visitaData);
                } catch (emailError) {
                    console.error(`Erro ao enviar email para ${emailRow.email}:`, emailError);
                }
            }

            //marcar como enviado
            await db.query(
                'UPDATE visitas SET enviado_email = true WHERE id = ?',
                [visitaId]
            );
        }

        res.status(201).json({
            message: 'Visita registrada com sucesso',
            id: visitaId
        });
    } catch (error) {
        console.error('Erro ao criar visita:', error);
        res.status(500).json({ error: 'Erro ao criar visita' });
    }
};

//buscar visita por ID
exports.getById = async (req, res) => {
    try {
        const [visitas] = await db.query(
            'SELECT * FROM visitas WHERE id = ? AND usuario_id = ?',
            [req.params.id, req.userId]
        );

        if (visitas.length === 0) {
            return res.status(404).json({ error: 'Visita não encontrada' });
        }

        res.json(visitas[0]);
    } catch (error) {
        console.error('Erro ao buscar visita:', error);
        res.status(500).json({ error: 'Erro ao buscar visita' });
    }
};