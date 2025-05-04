# 🚗 Auto Car - Backend API
<img alt="Auto Car Logo" src="https://img.shields.io/badge/Auto Car-API-1d3557?style=for-the-badge">

## 📋 Sumário
- [Sobre o Projeto](#-sobre-o-projeto)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Principais Funcionalidades](#-principais-funcionalidades)
- [Configuração e Instalação](#️-configuração-e-instalação)
- [Endpoints da API](#-endpoints-da-api)
- [Autenticação e Segurança](#-autenticação-e-segurança)
- [Contribuição](#-contribuição)

## 🔍 Sobre o Projeto
Auto Car é uma API REST completa para gerenciamento de uma concessionária de veículos, oferecendo suporte para o controle de estoque, cadastro de clientes, gestão de vendas e interesses, sistema administrativo e muito mais. Esta API foi desenvolvida com Node.js e Express, seguindo padrões modernos de desenvolvimento e boas práticas de segurança.

O sistema foi projetado para ser robusto, escalável e de fácil manutenção, com uma arquitetura em camadas que separa claramente as responsabilidades entre as diferentes partes da aplicação.

## 🛠 Tecnologias Utilizadas

### Core
- **Node.js** - Ambiente de execução JavaScript
- **Express** - Framework web rápido e minimalista
- **MySQL** - Sistema de gerenciamento de banco de dados
- **ES Modules** - Sistema de módulos JavaScript moderno

### Pacotes Principais
- **mysql2** - Cliente MySQL moderno com suporte a Promises
- **jsonwebtoken** - Implementação de JSON Web Tokens para autenticação
- **bcrypt** - Biblioteca para hash de senhas seguro
- **multer** - Middleware para handling multipart/form-data (upload de arquivos)
- **dotenv** - Carregamento de variáveis de ambiente
- **nodemailer** - Envio de emails transacionais
- **cors** - Middleware para habilitar CORS
- **express-fileupload** - Middleware para upload de arquivos

### Desenvolvimento
- **nodemon** - Monitoramento de alterações e reinício automático do servidor

## 📂 Estrutura do Projeto
```
backend/
├── config/           # Configurações (banco de dados, etc)
├── controllers/      # Controladores da aplicação
├── middlewares/      # Middlewares (autenticação, etc)
├── models/           # Modelos de dados
├── repository/       # Camada de acesso a dados
├── routes/           # Definição das rotas da API
├── services/         # Lógica de negócios
├── uploads/          # Arquivos enviados pelos usuários
│   └── carros/       # Imagens dos veículos
├── utils/            # Utilitários e helpers
├── .env              # Variáveis de ambiente (não versionado)
├── .env.example      # Exemplo de variáveis de ambiente
├── app.js            # Configuração da aplicação Express
├── server.js         # Ponto de entrada da aplicação
└── package.json      # Dependências e scripts
```


## ⭐ Principais Funcionalidades
### Gestão de Veículos
- Cadastro completo de veículos com detalhes técnicos
- Gerenciamento de estoque
- Múltiplas imagens por veículo
- Categorização de veículos
- Filtros avançados de busca

### Usuários e Autenticação
- Registro e autenticação de clientes
- Sistema de administradores com privilégios especiais
- Autenticação segura com JWT
- Controle de acesso baseado em funções

### Interação com Clientes
- Sistema de captura de interesses em veículos
- Depoimentos de clientes com moderação
- Formulário de contato com notificação por email
- Agendamento de test-drives e visitas

### Área Administrativa
- Dashboard com estatísticas do negócio
- Gestão completa do inventário
- Visualização e gerenciamento de leads
- Moderação de depoimentos
- Controle de vendas realizadas

## ⚙️ Configuração e Instalação
### Pré-requisitos
- Node.js (v14+)
- MySQL (v8+)

### Passos para instalação
1. Clone o repositório  
   ```bash
   git clone https://github.com/seu-usuario/auto-car.git
   cd auto-car/backend

2. Instale as dependências
   ```bash
   npm install
   
3. Configure as variáveis de ambiente
  ```bash
  cp .env.example .env
  # Edite o arquivo .env com suas configurações
  ```

4. Execute as migrações do banco de dados (se aplicável)
  ```bash
  # Configure seu banco de dados conforme as especificações em config/database.js
  ```

5. Inicie o servidor
  ```bash
  npm start
  ```

## 🔌 Endpoints da API

### Autenticação
- **POST** `/auth/usuario/login` - Login de usuários  
- **POST** `/auth/admin/login` - Login de administradores  
- **GET** `/auth/verificar` - Verifica validade do token JWT  

### Veículos
- **GET** `/carros` - Lista todos os veículos  
- **GET** `/carros/:id` - Detalhes de um veículo específico  
- **POST** `/carros` - Adiciona novo veículo  
- **DELETE** `/carros/:id` - Remove um veículo  

### Estoque
- **GET** `/estoque` - Lista itens em estoque  
- **POST** `/estoque` - Adiciona item ao estoque  
- **PUT** `/estoque/:id` - Atualiza item do estoque  
- **DELETE** `/estoque/:id` - Remove item do estoque  

### Imagens
- **POST** `/imagens/carro/:id` - Upload de imagens para veículo  
- **GET** `/imagens/carro/:id` - Lista imagens de um veículo  
- **DELETE** `/imagens/:id` - Remove uma imagem  
- **DELETE** `/imagens/carro/:carroId` - Remove todas as imagens de um veículo  

### Usuários
- **GET** `/usuarios` - Lista usuários  
- **GET** `/usuarios/:id` - Detalhes de um usuário  
- **POST** `/usuarios` - Cadastra novo usuário  
- **PUT** `/usuarios/:id` - Atualiza dados de usuário  
- **DELETE** `/usuarios/:id` - Remove usuário  

### Depoimentos
- **GET** `/depoimentos` - Lista depoimentos aprovados  
- **POST** `/depoimentos` - Adiciona novo depoimento  
- **PUT** `/depoimentos/:id` - Aprova/reprova depoimento (admin)  
- **DELETE** `/depoimentos/:id` - Remove depoimento (admin)  

### Interesses
- **POST** `/api/interesses` - Registra interesse em veículo  
- **GET** `/api/interesses` - Lista interesses (admin)  
- **PUT** `/api/interesses/:id/lido` - Marca interesse como lido (admin)  
- **DELETE** `/api/interesses/:id` - Remove interesse (admin)  

### Contato
- **POST** `/contato` - Envia mensagem pelo formulário de contato  

### Dashboard (Admin)
- **GET** `/admin/dashboard` - Estatísticas para o dashboard administrativo  

---

## 🔒 Autenticação e Segurança
- Token JWT deve ser incluído no header `Authorization` como `Bearer {token}`  
- Rotas administrativas são protegidas pelo middleware `adminMiddleware`  
- Senhas são armazenadas com hash seguro (implementação em produção)  
- Validação de dados de entrada em todas as rotas  
- Sanitização de dados para prevenir SQL Injection  

---

## 👥 Contribuição
Para contribuir com o projeto:
1. Faça um fork do repositório  
2. Crie uma branch para sua feature  
   ```bash
   git checkout -b feature/nova-funcionalidade
3. Commit suas alterações
   ```bash
   git commit -m 'Adiciona nova funcionalidade'
4. Push para a branch
   ```bash
   git push origin feature/nova-funcionalidade
5. Abra um Pull Request

---

Desenvolvido com ❤️ pelo Grupo 4

© 2025 Auto Car. Todos os direitos reservados.
