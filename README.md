# Gastos_Residenciais
Projeto de gastos residencias(CRUD)


## Descrição
Sistema para controle de gastos residenciais, com cadastro de pessoas, categorias e transações, além de relatório de totais por pessoa.

## Tecnologias utilizadas
- Back-end: C# / ASP.NET Core Web API (Visual Studio 2026)
- Front-end: React com TypeScript (Visual Studio Code)_
- Banco de dados: SQL Server 2026

## Funcionalidades
### Pessoas
- Criar
- Listar
- Editar
- Excluir

### Categorias
- Criar
- Listar

### Transações
- Criar
- Listar

### Relatórios
- Totais por pessoa:
  - total de receitas
  - total de despesas
  - saldo
  - total geral

## Regras de negócio
- Ao excluir uma pessoa, suas transações também são apagadas
- Menores de idade só podem ter transações do tipo despesa
- A categoria deve ser compatível com o tipo da transação
- O valor da transação deve ser positivo

## Como executar o projeto
### Back-end
1. Abrir a solução no Visual Studio
2. Configurar a string de conexão com o SQL Server no `appsettings.json`(Server= Servidor do seu computador; Database=Nome do Banco de dados) 
3. Executar o projeto

### Front-end (CMD)
1. Acessar a pasta `frontend`
2. Instalar dependências com `npm install`
3. Executar com `npm run dev`

## Estrutura do projeto
- `backend/ControleGastos.Api` -> API em ASP.NET Core
- `frontend` -> aplicação React com TypeScript
