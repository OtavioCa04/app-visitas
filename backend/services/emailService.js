const nodemailer = require('nodemailer');

//configurar transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: false, // true para 465, false para outras portas
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

//verificar conexão
transporter.verify(function (error, success) {
    if (error) {
        console.log('❌ Erro na configuração de email:', error.message);
        console.log('⚠️  Configure o .env com credenciais válidas de email');
    } else {
        console.log('✅ Servidor de email pronto');
    }
});

//função para enviar relatório de visita
exports.enviarRelatorioVisita = async (destinatario, visita) => {
    try {
        const dataFormatada = new Date(visita.data_hora).toLocaleString('pt-BR', {
            dateStyle: 'long',
            timeStyle: 'short'
        });

        const emailHTML = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 30px; border-radius: 10px 10px 0 0; text-align: center; }
        .header h1 { margin: 0; font-size: 24px; }
        .content { background: #f8fafc; padding: 30px; }
        .card { background: white; padding: 25px; border-radius: 8px; margin-bottom: 20px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .card h2 { color: #1e293b; margin-top: 0; border-bottom: 2px solid #2563eb; padding-bottom: 10px; font-size: 18px; }
        .info-row { margin: 10px 0; }
        .info-row strong { color: #1e293b; }
        .badge { background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 20px; font-size: 14px; display: inline-block; }
        .footer { text-align: center; padding: 20px; color: #64748b; font-size: 12px; }
        .btn { display: inline-block; background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; margin-top: 10px; }
        img { max-width: 100%; border-radius: 8px; margin-top: 15px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📍 Nova Visita Registrada</h1>
            <p style="margin: 10px 0 0; opacity: 0.9;">Relatório de Visita</p>
        </div>
        
        <div class="content">
            <div class="card">
                <h2>Informações do Cliente</h2>
                <div class="info-row"><strong>👤 Cliente:</strong> ${visita.nome_cliente}</div>
                <div class="info-row"><strong>🏢 Empresa:</strong> ${visita.empresa}</div>
                <div class="info-row"><strong>📋 Motivo:</strong> <span class="badge">${visita.motivo}</span></div>
                <div class="info-row"><strong>📅 Data/Hora:</strong> ${dataFormatada}</div>
                <div class="info-row"><strong>👨‍💼 Visitado por:</strong> ${visita.usuario_nome}</div>
            </div>

            ${visita.descricao ? `
            <div class="card">
                <h2>📝 Descrição da Visita</h2>
                <p style="color: #475569; line-height: 1.6;">${visita.descricao}</p>
            </div>
            ` : ''}

            ${visita.foto_url ? `
            <div class="card">
                <h2>📸 Foto da Visita</h2>
                <img src="${visita.foto_url}" alt="Foto da visita">
            </div>
            ` : ''}

            ${visita.latitude && visita.longitude ? `
            <div class="card">
                <h2>📍 Localização</h2>
                <div class="info-row">Latitude: ${visita.latitude}</div>
                <div class="info-row">Longitude: ${visita.longitude}</div>
                <a href="https://www.google.com/maps?q=${visita.latitude},${visita.longitude}" class="btn">
                    Ver no Google Maps
                </a>
            </div>
            ` : ''}
        </div>

        <div class="footer">
            <p>Este é um relatório automático gerado pelo sistema Visitas Pro</p>
            <p>© ${new Date().getFullYear()} - Visitas Pro</p>
        </div>
    </div>
</body>
</html>
        `;

        const info = await transporter.sendMail({
            from: process.env.EMAIL_FROM,
            to: destinatario,
            subject: `Nova Visita: ${visita.nome_cliente} - ${visita.empresa}`,
            html: emailHTML
        });

        console.log('✉️ Email enviado:', info.messageId);
        return info;
    } catch (error) {
        console.error('❌ Erro ao enviar email:', error);
        throw error;
    }
};