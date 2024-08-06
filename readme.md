# Tela Vermelha

O projeto Tela Vermelha é uma aplicação serverless desenvolvida com o objetivo de fornecer uma API GraphQL robusta e escalável, utilizando a arquitetura hexagonal para promover a separação de preocupações e a manutenção facilitada. Este projeto faz uso de uma série de tecnologias e ferramentas modernas para garantir a eficiência, qualidade de código e melhores práticas de desenvolvimento.

## Stacks Utilizadas
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

## Funcionalidades
- **APIs GraphQL com Resolvers em AWS Lambda:** A integração com o AppSync permite a criação de resolvers eficientes utilizando funções Lambda.
- **Autenticação e Autorização com JWT:** Implementação de autenticação segura com tokens JWT.
- **Banco de Dados DynamoDB:** Armazenamento de dados de maneira eficiente e escalável.
- **Ferramentas de Qualidade de Código:** Uso de ESLint e Prettier para manter a qualidade e consistência do código.
- **Desenvolvimento Colaborativo:** Utilização de Husky para garantir que os hooks de Git sejam executados, promovendo melhores práticas de desenvolvimento.

## Scripts do Projeto

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

## Descrição dos Scripts
- **build:** Remove a pasta dist e compila o código TypeScript.
- **deploy:** Compila o código e realiza o deploy da aplicação utilizando o Serverless Framework.
- **lint:** Executa o ESLint para verificar a qualidade do código.
- **lint:fix:** Executa o ESLint e corrige automaticamente os problemas encontrados.
- **format:** Formata o código fonte utilizando o Prettier.
- **prepare:** Configura os hooks do Husky.

##  Comandos para Invocar Funções para Testes

_Listar Todos os Usuários_

```sh
sls invoke --function GetUsers --stage pet
```

_Efetuar Login_

```sh
sls invoke local --function Login --data '{ "arguments": { "input": { "email": "testj@gmail.com", "password": "123456" }}}' --stage pet
```

_Adicionar um novo Usuário_

```sh
sls invoke local --function AddUser --data '{ "arguments": { "input": { "name": "Jubileu", "email": "test@gmail.com", "password": "Jubileu@123" }}}' --stage pet
```
