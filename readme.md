# Tela Vermelha

O projeto Tela Vermelha é uma aplicação serverless desenvolvida com o objetivo de fornecer uma API GraphQL robusta e escalável, utilizando a arquitetura hexagonal para promover a separação de preocupações e a manutenção facilitada. Este projeto faz uso de uma série de tecnologias e ferramentas modernas para garantir a eficiência, qualidade de código e melhores práticas de desenvolvimento.

### Stacks Utilizadas
- **TypeScript:** Linguagem de programação tipada que compila para JavaScript.
- **Node.js:** Ambiente de execução para JavaScript server-side.
- **Serverless Framework:** Framework para desenvolvimento e implantação de aplicações serverless.
- **AppSync GraphQL:** Serviço da AWS para construção de APIs GraphQL.
- **Lambda Functions:** Funções serverless usadas para lógica de backend.
- **DynamoDB:** Banco de dados NoSQL gerenciado pela AWS.
- **JWT Authorizer:** Autorizações baseadas em JSON Web Tokens para controle de acesso.
- **Husky:** Ferramenta para gerenciamento de hooks de Git.
- **Arquitetura Hexagonal:** Padrão de design que promove a separação de preocupações.
- **Prettier:** Ferramenta de formatação de código.
- **ESLint:** Ferramenta de análise estática de código.

### Funcionalidades
- **APIs GraphQL com Resolvers em AWS Lambda:** A integração com o AppSync permite a criação de resolvers eficientes utilizando funções Lambda.
- **Autenticação e Autorização com JWT:** Implementação de autenticação segura com tokens JWT.
- **Banco de Dados DynamoDB:** Armazenamento de dados de maneira eficiente e escalável.
- **Ferramentas de Qualidade de Código:** Uso de ESLint e Prettier para manter a qualidade e consistência do código.
- **Desenvolvimento Colaborativo:** Utilização de Husky para garantir que os hooks de Git sejam executados, promovendo melhores práticas de desenvolvimento.

### Configurar ambiente local do projeto

**1. Instale o Node.js Usando NVM**

Para garantir que você esteja utilizando a versão correta do Node.js, siga os passos abaixo para instalar o Node Version Manager (nvm):

#### Instalação do NVM no Linux

```sh
# Instalação do NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Reinicie seu terminal ou execute o seguinte comando para carregar o nvm:
source ~/.nvm/nvm.sh
```

#### Instalação do NVM no macOS

```sh
# Instalação do NVM
brew update
brew install nvm

# Crie o diretório do nvm:
mkdir ~/.nvm

# Adicione o nvm ao seu perfil do shell (por exemplo, .zshrc ou .bash_profile):
export NVM_DIR="$HOME/.nvm"
[ -s "/usr/local/opt/nvm/nvm.sh" ] && \. "/usr/local/opt/nvm/nvm.sh"
[ -s "/usr/local/opt/nvm/etc/bash_completion" ] && \. "/usr/local/opt/nvm/etc/bash_completion"

# Reinicie seu terminal ou execute o seguinte comando para carregar o nvm:
source ~/.nvm/nvm.sh
```

**2. Instale a versão necessária do Node.js (exemplo com a versão v20.11.0):**
```sh
nvm install v20.11.0
nvm use v20.11.0
```

**3. Verifique a instalação:**
```sh
node -v
npm -v
```

### Scripts do Projeto

Os seguintes scripts estão disponíveis para execução de diferentes tarefas no projeto:

```json
"scripts": {
    "build": "rimraf ./dist && tsc",
    "deploy": "npm run build && sls deploy --stage pet",
    "lint": "eslint src/**/*.ts",
    "lint:fix": "npm run lint --fix",
    "format": "prettier --write 'src/**/*.ts'",
    "prepare": "husky"
}
```

### Descrição dos Scripts
- **build:** Remove a pasta dist e compila o código TypeScript.
- **deploy:** Compila o código e realiza o deploy da aplicação utilizando o Serverless Framework.
- **lint:** Executa o ESLint para verificar a qualidade do código.
- **lint:fix:** Executa o ESLint e corrige automaticamente os problemas encontrados.
- **format:** Formata o código fonte utilizando o Prettier.
- **prepare:** Configura os hooks do Husky.

### Instalar dependencias do projeto.

```sh
npm install
```

### Realizar o build do projeto

```sh
npm build
```

###  Comandos para Invocar Funções para Testes

_Listar Todos os Usuários_

```sh
npx sls invoke local --function GetUsers --stage pet
```

_Efetuar Login_

```sh
npx sls invoke local --function Login --data '{ "arguments": { "input": { "email": "rafael.arjonas@claro.com.br", "password": "F@zer250" }}}' --stage pet
```

_Adicionar um novo Usuário_

```sh
npx sls invoke local --function AddUser --data '{ "arguments": { "input": { "name": "Jubileu", "email": "test@gmail.com", "password": "Jubileu@123" }}}' --stage pet
```

_Ativar Usuário_

```sh
npx sls invoke local --function ActivateUser \
--data '{
  "arguments": {
    "input": {
      "isActive": true,
      "userEmail": "francisco.rosa@claro.com.br"
    }
  },
  "request": {
    "headers": {
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTBlOTM5LWRmYzMtNDE0ZS1iZDUxLWU4YzA4MWE2OGFhZSIsIm5hbWUiOiJSYWZhZWwgTW9udGVpcm8gQXJqb25hcyIsImVtYWlsIjoicmFmYWVsLmFyam9uYXNAY2xhcm8uY29tLmJyIiwiYWN0aXZlIjp0cnVlLCJpc0FkbWluIjp0cnVlLCJwYXNzd29yZCI6IlUyRnNkR1ZrWDEvMyt1Z1hqQnk2dUJtSytpT1p5WHIrcXBnU1haRHVoK2M9IiwicXVlc3Rpb25saW1pdFF1b3RhIjoyMCwiY3JlYXRlZEF0IjoiMjAyNC0xMS0xNFQyMDo1Nzo1MS43MTFaIiwidXBkYXRlZEF0IjoiMjAyNC0xMS0xNFQyMDo1Nzo1MS43MTFaIiwiaWF0IjoxNzMxNzIwNjA5LCJleHAiOjE3MzE3MjI0MDl9.66ZfJ7Vwrk87nYeGz3dDRbaiaWT5A-7fA5ut1-Us6Iw"
    }
  }
}' \
--stage pet
```

_Aumentar cota de perguntas do usuário_

```sh
npx sls invoke local --function UpdateQuotaUser \
--data '{
  "arguments": {
    "input": {
      "questionlimitQuota": 30,
      "userEmail": "francisco.rosa@claro.com.br"
    }
  },
  "request": {
    "headers": {
      "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZTBlOTM5LWRmYzMtNDE0ZS1iZDUxLWU4YzA4MWE2OGFhZSIsIm5hbWUiOiJSYWZhZWwgTW9udGVpcm8gQXJqb25hcyIsImVtYWlsIjoicmFmYWVsLmFyam9uYXNAY2xhcm8uY29tLmJyIiwiYWN0aXZlIjp0cnVlLCJpc0FkbWluIjp0cnVlLCJwYXNzd29yZCI6IlUyRnNkR1ZrWDEvMyt1Z1hqQnk2dUJtSytpT1p5WHIrcXBnU1haRHVoK2M9IiwicXVlc3Rpb25saW1pdFF1b3RhIjoyMCwiY3JlYXRlZEF0IjoiMjAyNC0xMS0xNFQyMDo1Nzo1MS43MTFaIiwidXBkYXRlZEF0IjoiMjAyNC0xMS0xNFQyMDo1Nzo1MS43MTFaIiwiaWF0IjoxNzMxNzI1MzIzLCJleHAiOjE3MzE3MjcxMjN9.TtGIlQA32m3DN4AxeKriUhYaisfKftYKtAZYsyxW6kI"
    }
  }
}' \
--stage pet
```

## [UTILS] Update data new field dynamo

define new field and value

```sh
TABLE_NAME="click-alert-serverless-pet-feedbacks"        # Nome da sua tabela DynamoDB
NOVO_CAMPO="typeApplication"        # Nome do campo a 
ser adicionado
VALOR_DEFAULT="trends"  # Valor default para o novo campo
```

got to local folder

```bash
cd scripts
```

Grant permission file

```sh
chmod +x updateNewFieldFull.sh
```

execute file second plan

```sh
./updateNewFieldFull.sh 2>&1 | ts '[%Y-%m-%d %H:%M:%S]' > output.log &

ou

./updateNewFieldFull.sh > output.log 2>&1

```

verify execution

```sh
ps aux | grep meuscript.sh
```
