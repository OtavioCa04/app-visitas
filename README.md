# 📍 StopBy

Sistema web para gerenciamento de visitas com registro fotográfico, geolocalização e envio automático de relatórios por email.

## 📋 Sobre o Projeto

O **StopBy** é uma solução completa para gerenciar sua visitas a clientes de forma profissional e organizada. O sistema permite registro rápido de visitas, captura de fotos, geolocalização automática e envio de relatórios detalhados por email.

### ✨ Principais Funcionalidades

- 📸 **Registro de Visitas** - Cadastro rápido com foto (câmera ou galeria)
- 📍 **Geolocalização** - GPS automático de cada visita
- 📊 **Dashboard** - Estatísticas e métricas em tempo real
- 📧 **Relatórios Automáticos** - Envio de email com detalhes completos
- 🔍 **Histórico Completo** - Busca e filtros avançados
- ⚙️ **Configurações** - Gerenciamento de perfil e destinatários
- 📱 **Responsivo** - Funciona perfeitamente em mobile, tablet e desktop

## 🚀 Tecnologias

### Backend
- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **MySQL** - Banco de dados relacional
- **JWT** - Autenticação segura
- **Bcrypt** - Criptografia de senhas
- **Multer** - Upload de arquivos
- **Nodemailer** - Envio de emails

### Frontend
- **HTML5** - Estrutura
- **CSS3** - Estilização moderna
- **JavaScript (Vanilla)** - Sem frameworks, puro e rápido
- **API Fetch** - Comunicação com backend
- **Geolocation API** - Captura de localização
- **Media Devices API** - Acesso à câmera

## 📁 Estrutura do Projeto

```
visitas-comerciais/
├── backend/
│   ├── config/
│   │   └── database.js              # Configuração MySQL
│   ├── controllers/
│   │   ├── authController.js        # Autenticação
│   │   ├── visitaController.js      # CRUD de visitas
│   │   └── userController.js        # Gerenciamento de usuários
│   ├── middlewares/
│   │   ├── auth.js                  # Middleware de autenticação
│   │   └── upload.js                # Middleware de upload
│   ├── routes/
│   │   ├── auth.js                  # Rotas de autenticação
│   │   ├── visitas.js               # Rotas de visitas
│   │   └── users.js                 # Rotas de usuários
│   ├── services/
│   │   └── emailService.js          # Serviço de email
│   ├── uploads/                     # Armazenamento de fotos
│   ├── .env                         # Variáveis de ambiente
│   ├── server.js                    # Servidor principal
│   └── package.json                 # Dependências
└── frontend/
    ├── assets/
    │   ├── css/
    │   │   └── style.css            # Estilos globais
    │   └── js/
    │       ├── api.js               # Comunicação com API
    │       ├── auth.js              # Lógica de autenticação
    │       ├── utils.js             # Funções utilitárias
    │       ├── app.js               # Inicialização
    │       └── pages/               # Páginas da aplicação
    │           ├── home.js
    │           ├── nova-visita.js
    │           ├── historico.js
    │           └── configuracoes.js
    └── index.html                   # Página principal
```

## 🔧 Pré-requisitos

Antes de começar, você precisa ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [MySQL](https://dev.mysql.com/downloads/) (versão 8.0 ou superior)
- [Git](https://git-scm.com/)

## 📦 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/visitas-comerciais.git
cd visitas-comerciais
```

### 2. Configure o banco de dados

Abra o MySQL e execute:

```sql
CREATE DATABASE IF NOT EXISTS visitas_comerciais
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE visitas_comerciais;

-- Tabela de usuários
CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    senha_hash VARCHAR(255) NOT NULL,
    nome_completo VARCHAR(255),
    cargo VARCHAR(100),
    ativo BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de emails de destino
CREATE TABLE emails_destino (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabela de visitas
CREATE TABLE visitas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    usuario_id INT NOT NULL,
    nome_cliente VARCHAR(255) NOT NULL,
    empresa VARCHAR(255) NOT NULL,
    motivo ENUM('Prospecção','Reunião','Suporte Técnico','Entrega','Negociação','Follow-up','Outro') NOT NULL,
    descricao TEXT,
    foto_url VARCHAR(500),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    data_hora DATETIME NOT NULL,
    enviado_email BOOLEAN DEFAULT FALSE,
    usuario_nome VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    INDEX idx_usuario_id (usuario_id),
    INDEX idx_data_hora (data_hora)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
```

### 3. Instale as dependências

```bash
cd backend
npm install
```

### 4. Configure as variáveis de ambiente

Crie o arquivo `backend/.env`:

```env
# Servidor
PORT=3000
NODE_ENV=development

# Banco de Dados
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha_mysql
DB_NAME=visitas_comerciais

# JWT
JWT_SECRET=sua_chave_secreta_super_segura_aqui
JWT_EXPIRES_IN=7d

# Email (Opcional - configure depois)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=sua_senha_de_app
EMAIL_FROM=Visitas Pro <seu_email@gmail.com>

# Upload
MAX_FILE_SIZE=5242880
UPLOAD_PATH=./uploads
```

### 5. Crie um usuário de teste

Crie o arquivo `backend/gerar-hash.js`:

```javascript
const bcrypt = require('bcryptjs');

async function gerarHash() {
    const senha = 'teste123';
    const hash = await bcrypt.hash(senha, 10);
    console.log('\n=================================');
    console.log('HASH GERADO PARA A SENHA: teste123');
    console.log('=================================');
    console.log(hash);
    console.log('\n=================================');
    console.log('EXECUTE NO MySQL:');
    console.log('=================================');
    console.log(`UPDATE usuarios SET senha_hash = '${hash}' WHERE email = 'teste@exemplo.com';`);
    console.log('\n');
}

gerarHash();
```

Execute:

```bash
node gerar-hash.js
```

Copie o comando UPDATE que aparecer e execute no MySQL. Depois insira o usuário:

```sql
INSERT INTO usuarios (email, senha_hash, nome_completo, cargo) VALUES
('teste@exemplo.com', 'COLE_O_HASH_AQUI', 'João Silva', 'Vendedor');
```

### 6. Inicie o servidor

```bash
npm run dev
```

Você verá:

```
=================================
🚀 Servidor rodando na porta 3000
📱 Frontend: http://localhost:3000
🔌 API: http://localhost:3000/api
=================================
✅ Conectado ao MySQL
```

### 7. Acesse o sistema

Abra o navegador em: **http://localhost:3000**

**Credenciais de teste:**
- Email: `teste@exemplo.com`
- Senha: `teste123`

## 📧 Configuração de Email (Opcional)

### Gmail

1. Ative a verificação em 2 etapas: https://myaccount.google.com/security
2. Gere uma senha de app: https://myaccount.google.com/apppasswords
3. Configure no `.env`:

```env
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=seu_email@gmail.com
EMAIL_PASS=senha_de_app_16_caracteres
EMAIL_FROM=Visitas Pro <seu_email@gmail.com>
```

### Mailtrap (Para Testes)

1. Crie uma conta em: https://mailtrap.io
2. Configure no `.env`:

```env
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_PORT=2525
EMAIL_USER=seu_username_mailtrap
EMAIL_PASS=sua_password_mailtrap
EMAIL_FROM=Visitas Pro <noreply@visitaspro.com>
```

## 🎯 Como Usar

### 1. Fazer Login
- Acesse http://localhost:3000
- Use as credenciais de teste

### 2. Registrar Visita
- Clique em **Nova Visita** (➕)
- Preencha os dados do cliente
- Tire uma foto ou escolha da galeria
- O sistema captura a localização GPS automaticamente
- Clique em **Registrar e Enviar**

### 3. Visualizar Histórico
- Clique em **Histórico** (🕒)
- Use os filtros para buscar visitas específicas
- Clique nas fotos para ampliar

### 4. Configurar Emails
- Clique em **Configurações** (⚙️)
- Adicione emails que receberão os relatórios
- Atualize seu nome e cargo

---

⭐ Se este projeto te ajudou, considere dar uma estrela no repositório!
