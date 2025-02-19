# Salão da Leila - Sistema de Agendamentos

Sistema de agendamentos online desenvolvido para o Salão da Leila, permitindo que clientes realizem agendamentos de serviços e a proprietária gerencie seu negócio de forma eficiente.

## 🚀 Tecnologias Utilizadas

### Frontend
- **Next.js 14.2.24** - Framework React com App Router
- **TypeScript** - Linguagem de programação tipada
- **Tailwind CSS** - Framework CSS para estilização
- **Shadcn/UI** - Biblioteca de componentes
- **Axios** - Cliente HTTP para requisições
- **Recharts** - Biblioteca para criação de gráficos
- **Sonner** - Biblioteca para notificações toast
- **Zod** - Biblioteca para validação de schemas

### Backend
- **Next.js API Routes** - Backend integrado ao Next.js
- **Prisma ORM** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Clean Architecture** - Arquitetura do projeto
- **Cookies** - Autenticação via cookies seguros

## 📋 Pré-requisitos

- NVM v21.0.0 [Aqui](https://github.com/coreybutler/nvm-windows/)
- MongoDB instalado e configurado (escolha opcional o banco de dados utilizado)

## 🔧 Instalação

1. **Clone o repositório**

bash

`git clone https://github.com/igleite/cabeleleila-agendamentos`

`cd cabeleleila-agendamentos`

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**
```bash
# Crie um arquivo .env na raiz do projeto com:
NEXT_PUBLIC_APP_URL="http://localhost:3000"
DATABASE_URL="mongodb+srv://usuario:senha@mongodb.net/cabeleleila-agendamentos?retryWrites=true&w=majority"

# Configurações de Email
SMTP_HOST="smtp.com"
SMTP_PORT="587"
SMTP_USER="your-email@domain.com.br"
SMTP_PASS="your-password"
SMTP_FROM="your-email@domain.com.br"

# Segurança
JWT_SECRET="your-secret-key"
```

> Nota: Substitua os valores acima com suas próprias credenciais e configurações.

4. **Execute as migrações do banco de dados**
```bash
npx prisma migrate dev
```

5. **Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

6. **Acesse o projeto**
```bash
http://localhost:3000
```

## 📁 Estrutura do Projeto

```
src/
├── app/             # Rotas e páginas da aplicação
│   ├── api/         # Rotas da API
│   ├── app/         # Páginas da aplicação
│   └── auth/        # Páginas de autenticação
├── components/      # Componentes reutilizáveis
│   ├── ui/          # Componentes de UI (shadcn)
│   └── forms/       # Componentes de formulário
├── modules/         # Módulos da aplicação (Clean Architecture)
│   ├── appointment/ # Módulo de agendamentos
│   ├── user/        # Módulo de usuários
│   └── service/     # Módulo de serviços
└── lib/            # Utilitários e configurações
```

## ⚙️ Funcionalidades

### Autenticação
- Sistema de login para clientes e administrador
- Proteção de rotas por perfil de usuário
- Gerenciamento de sessão

### Agendamentos
- Criação de novos agendamentos
- Edição de agendamentos existentes (com regra de 48h)
- Histórico de agendamentos com filtros por período
- Visualização detalhada de cada agendamento

### Área Administrativa
- Dashboard gerencial com:
  - Métricas de desempenho
  - Gráficos de crescimento
  - Análise de horários de pico
  - Relatório de serviços mais populares
- Gestão de agendamentos
- Controle de status dos serviços

## 🔒 Segurança

- Todas as rotas administrativas são protegidas
- Validação de dados com Zod
- Sanitização de inputs
- Cookies seguros para sessão

## 📝 Observações do Projeto

### Funcionalidades Implementadas
- Sistema de autenticação para clientes e administrador
- Criação e edição de agendamentos
- Regra de 48h para alterações de agendamentos
- Histórico de agendamentos com filtros
- Dashboard gerencial com métricas e gráficos
- Gestão de status dos agendamentos
- Controle administrativo completo

### Segurança
- Rotas protegidas por autenticação
- Validação de dados com Zod
- Cookies seguros para sessão
- Sanitização de inputs