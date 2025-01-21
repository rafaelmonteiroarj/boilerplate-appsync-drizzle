# Tela Vermelha

O projeto Tela Vermelha é uma aplicação serverless desenvolvida com o objetivo de fornecer uma API GraphQL robusta e escalável, utilizando a arquitetura hexagonal para promover a separação de preocupações e a manutenção facilitada. Este projeto faz uso de uma série de tecnologias e ferramentas modernas para garantir a eficiência, qualidade de código e melhores práticas de desenvolvimento.

## Tecnologias Principais

- **TypeScript:** Linguagem de programação tipada que compila para JavaScript
- **Serverless Framework:** Framework para desenvolvimento e implantação de aplicações serverless
- **AppSync GraphQL:** Serviço da AWS para construção de APIs GraphQL
- **Lambda Functions:** Funções serverless usadas para lógica de backend
- **JWT Authorizer:** Autorizações baseadas em JSON Web Tokens para controle de acesso
- **Drizzle ORM:** ORM moderno para TypeScript com foco em type safety e developer experience
- **Husky:** Ferramenta para gerenciamento de hooks de Git
- **Prettier:** Ferramenta de formatação de código
- **ESLint:** Ferramenta de análise estática de código

## Drizzle ORM

O Drizzle é um ORM TypeScript-first que oferece:

- Type safety completo
- Migrations automatizadas
- Query builder intuitivo
- Performance otimizada
- Suporte a múltiplos bancos de dados

### Arquivos do Drizzle

- `schema.ts`: Define a estrutura das tabelas e relacionamentos
- `migrate.ts`: Script para execução de migrations
- `seed.ts`: Script para população inicial do banco de dados
- `migrations/`: Diretório contendo os arquivos de migration

### Comandos do Drizzle

- `db:generate`: Gera as migrations baseadas nas alterações do schema
- `db:migrate`: Executa as migrations pendentes no banco de dados
- `db:seed`: Popula o banco de dados com dados iniciais
- `db:studio`: Inicia o Drizzle Studio para visualização e gestão do banco de dados

## Scripts Disponíveis

- **start**: `sls offline start --stage pet`
  - Inicia a aplicação localmente usando o Serverless Offline
  - O parâmetro `--stage pet` define o ambiente de desenvolvimento

- **db:generate**: `drizzle-kit generate`
  - Gera arquivos de migration baseados nas alterações do schema
  - Útil após modificações nas definições das tabelas

- **db:migrate**: `tsx -r dotenv/config src/shared/module/drizzle/db/migrate.ts`
  - Executa as migrations pendentes no banco de dados
  - Carrega variáveis de ambiente do arquivo .env

- **db:seed**: `tsx -r dotenv/config src/shared/module/drizzle/db/seed.ts`
  - Popula o banco de dados com dados iniciais
  - Importante para ambiente de desenvolvimento e testes

- **db:studio**: `pnpm drizzle-kit studio`
  - Inicia o Drizzle Studio para gestão visual do banco de dados
  - Permite visualizar e modificar dados facilmente

- **build**: `rimraf ./dist && tsc`
  - Remove a pasta dist existente
  - Compila o código TypeScript para JavaScript

- **lint**: `eslint src/**/*.ts`
  - Executa a verificação de código com ESLint
  - Identifica problemas de código e estilo

- **lint:fix**: `pnpm run lint --fix`
  - Corrige automaticamente os problemas encontrados pelo ESLint
  - Ajusta formatação e problemas simples de código

- **format**: `prettier --write 'src/**/*.ts'`
  - Formata o código seguindo as regras do Prettier
  - Mantém consistência no estilo do código

- **prepare**: `husky`
  - Configura os hooks do Git com Husky
  - Garante que verificações sejam executadas antes dos commits

- **deploy**: `pnpm run build && sls deploy --stage pet`
  - Realiza o build da aplicação
  - Deploy na AWS usando o Serverless Framework
  - O parâmetro `--stage pet` define o ambiente de implantação

- **destroy**: `sls destroy --stage pet`
  - Remove toda a infraestrutura criada na AWS
  - Útil para limpeza de recursos quando necessário

## Arquitetura do Projeto

O projeto segue a Arquitetura Hexagonal (também conhecida como Ports and Adapters), dividida em camadas bem definidas:

### Business Logic (Lógica de Negócio)
- **core:** Contém a lógica de negócio central da aplicação
  - `use-cases`: Casos de uso que implementam a lógica de negócio
  - `model`: Modelos de dados da aplicação

### Supporting Infrastructure / Adapters (Infraestrutura de Suporte)
- **http:** Adaptadores para comunicação HTTP
  - `handlers`: Handlers para processamento de requisições
  - `dto`: Objetos de transferência de dados
  - `validation`: Validações de entrada de dados

- **persistence:** Camada de persistência
  - `repository`: Repositórios para acesso e manipulação de dados

### Shared (Compartilhada)
- **core:** Bibliotecas e utilitários compartilhados
  - `model`: Modelos de dados padrão da aplicação
  - `types`: Definições de tipos globais
  - `exception`: Tratamento centralizado de exceções
- **modules:** Módulos compartilhados
  - `drizzle`: Configurações do banco de dados
  - `logging`: Sistema de logs
  - `monitoring`: Monitoramento da aplicação

## Estrutura de Pastas

```
src/
├── core/                  # Lógica de negócio central
│   ├── model/            # Modelos de domínio
│   ├── use-cases/        # Implementações dos casos de uso
│
├── http/                 # Configurações HTTP
│   ├── handlers/         # Handlers de requisições
│   ├── dtos/            # Objetos de transferência de dados
│   └── validations/      # Validações de entrada
│
├── persistence/          # Camada de persistência
│   └── repository/       # Repositórios de dados
│
├── shared/              # Recursos compartilhados
│   ├── core/
│   │   ├── exception/   # Tratamento de exceções
│   │   ├── model/      # Modelos compartilhados
│   │   └── types/      # Tipos globais
│   └── modules/
│       └── drizzle/     # Configurações do Drizzle ORM
│           └── db/
│               ├── migrations/  # Arquivos de migration
│               ├── schema.ts   # Definição do schema
│               ├── seed.ts     # Dados iniciais
│               └── migrate.ts  # Script de migração
```

## Ambiente de Desenvolvimento

### Pré-requisitos

- Node.js v20.11.0 ou superior
- NPM ou PNPM
- Postgres (para desenvolvimento local)

### Configurando o Ambiente

1. **Instale o Node.js usando NVM**

#### Linux
```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash
source ~/.nvm/nvm.sh
```

#### macOS
```sh
brew update
brew install nvm
mkdir ~/.nvm

# Adicione ao seu .zshrc ou .bash_profile:
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
[ -s "/usr/local/opt/nvm/etc/bash_completion" ] && \. "/usr/local/opt/nvm/etc/bash_completion"

source ~/.nvm/nvm.sh
```

2. **Instale a versão correta do Node.js**
```sh
nvm install v20.11.0
nvm use v20.11.0
```

3. **Verifique a instalação**
```sh
node -v
npm -v
```

4. **Instale as dependências do projeto**
```sh
npm install
```

5. **Configure as variáveis de ambiente**
   - Copie o arquivo `.env.example` para `.env`
   - Preencha as variáveis necessárias

## Comandos para Teste Local

### Listar Todos os Usuários
```sh
npx sls invoke local --function getUsers --stage pet
```

### Efetuar Login
```sh
npx sls invoke local --function login --data '{ "arguments": { "input": { "email": "exemplo@email.com", "password": "senha123" }}}' --stage pet
```

### Adicionar um novo Usuário
```sh
npx sls invoke local --function addUser --data '{ "arguments": { "input": { "name": "Nome", "email": "novo@email.com", "password": "senha123" }}}' --stage pet
```

## Como Contribuir

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-feature`)
3. Faça commit das suas mudanças (`git commit -m 'Adiciona nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request
