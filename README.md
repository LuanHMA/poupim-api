# Poupim – API 💰

API REST do Poupim, um app de finanças pessoais. Gerencia usuários, categorias e transações, e calcula estatísticas mensais, fluxo de caixa e insights do mês.

📄 **Front-end:** [poupim/web](../web)

## Tecnologias

- Node.js, Fastify, TypeScript
- Prisma ORM + PostgreSQL
- Autenticação JWT + bcrypt
- Validação com Zod
- Swagger/OpenAPI
- date-fns + @date-fns/tz (fuso America/Sao_Paulo)
- Docker Compose (banco local)

## Arquitetura

Cada módulo segue a separação em camadas:

```
src/
├── config/        # Prisma, schema, migrations, seed e variáveis de ambiente
├── docs/          # Configuração e schemas do Swagger
├── errors/        # Erros de domínio e handler global
├── middleware/    # Middleware de autenticação JWT
├── modules/
│   ├── auth/
│   ├── categories/
│   ├── transactions/
│   ├── stats/
│   └── reports/   # cada um com routes → controller → service → repository
├── utils/
└── server.ts
```

## Pré-requisitos

- [Node.js](https://nodejs.org/) 20 ou superior
- [Docker](https://www.docker.com/) e Docker Compose
- npm

## Configuração

### 1. Instale as dependências

```bash
npm install
```

### 2. Crie o arquivo `.env`

Na raiz da pasta `backend`, crie um `.env`:

```env
# Senha usada pelo container do PostgreSQL (docker-compose.yml)
POSTGRES_PASSWORD=sua_senha

# Conexão com o banco (use a mesma senha acima)
DATABASE_URL="postgresql://postgres:sua_senha@localhost:5432/expense_system"

# Chave para assinar os tokens JWT
JWT_SECRET=sua_chave_secreta

# Opcionais
PORT=3333
NODE_ENV=development
```

> 💡 Para gerar um `JWT_SECRET` seguro:
> `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

As variáveis são validadas com Zod na inicialização. Se faltar alguma obrigatória, a API não sobe e mostra o erro no terminal.

### 3. Suba o banco de dados

```bash
docker compose up -d
```

Cria um container PostgreSQL 18 na porta `5432` com o banco `expense_system`.

### 4. Rode as migrations e gere o Prisma Client

```bash
npm run prisma:migrate
npm run prisma:generate
```

### 5. Popule as categorias

```bash
npm run db:seed
```

### 6. Inicie a API

```bash
npm run dev
```

API disponível em `http://localhost:3333`.

## Documentação

Com a API rodando, acesse o Swagger em:

**`http://localhost:3333/docs`**

As rotas autenticadas exigem o header `Authorization: Bearer {token}`. O token é retornado no login.

### Rotas principais

Todas usam o prefixo `/api`.

| Módulo | Rota | Descrição |
|---|---|---|
| Auth | `/api/auth` | Cadastro, login e dados do usuário |
| Categories | `/api/categories` | Categorias com ícone e cor |
| Transactions | `/api/transactions` | CRUD de transações com filtros e paginação |
| Stats | `/api/stats` | Fluxo de caixa, estatísticas mensais, períodos e top categorias |
| Reports | `/api/reports` | Dados e insights do relatório mensal |

## Scripts

| Script | Descrição |
|---|---|
| `npm run dev` | Inicia em modo desenvolvimento (watch) |
| `npm run build` | Gera o Prisma Client e compila o TypeScript |
| `npm start` | Inicia a versão compilada (`dist/`) |
| `npm run prisma:migrate` | Cria/aplica migrations em desenvolvimento |
| `npm run prisma:generate` | Gera o Prisma Client |
| `npm run prisma:push` | Sincroniza o schema sem criar migration |
| `npm run prisma:studio` | Abre o Prisma Studio |
| `npm run db:seed` | Cria/atualiza as categorias padrão |



## Autor

Feito por **Luan Henrique** · [LinkedIn](https://www.linkedin.com/in/luan-henrique-407822207/) · [Portfólio](https://euluanhenrique.vercel.app/)
