# README

# Gerenciador de Tarefas - Frontend

Este repositório contém o frontend do sistema de Gerenciador de Tarefas, desenvolvido com **Laravel Mix**, **React** e **TypeScript**.

## Índice

* [Tecnologias](#tecnologias)
* [Pré-requisitos](#pré-requisitos)
* [Instalação](#instalação)
* [Configuração](#configuração)
* [Scripts úteis](#scripts-úteis)
* [Estrutura de Pastas](#estrutura-de-pastas)
* [Funcionalidades](#funcionalidades)

## Tecnologias

* **Laravel Mix** para bundling de assets
* **React** (v17+) com **TypeScript**
* **Axios** para chamadas HTTP
* **Tailwind CSS** para estilização (opcional)

## Pré-requisitos

* [Node.js](https://nodejs.org/) (v14+)
* [npm](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
* Backend do Gerenciador de Tarefas em execução (Laravel API)

## Instalação

1. Clone este repositório:

   ```bash
   git clone git@github.com:asafworld/gerenciador-de-tarefas-25.git
   cd todo-frontend-php
   ```

2. Instale as dependências:

   ```bash
   npm install
   # ou
   yarn install
   ```

## Configuração

1. Copie o arquivo de exemplo de variáveis de ambiente:

   ```bash
   cp .env.example .env
   ```

2. Ajuste a URL da API Laravel no `.env`:

   ```ini
   MIX_API_URL=http://localhost:8000
   ```

## Scripts úteis

* **Compilar para desenvolvimento**:

  ```bash
  npm run dev
  ```
* **Compilar para produção**:

  ```bash
  npm run build
  ```
* **Assistir mudanças** (hot-reload):

  ```bash
  npm run watch
  ```

* **Ou utilize o serve via artisan**:
```bash
php artisan serve
```

## Estrutura de Pastas

```
resources/js/
├── api.ts                      # instancia do Axios
├── components/                 # componentes React
│   ├── App.tsx                 # configura rotas e Provider
│   ├── Dashboard.tsx           # lista de tarefas
│   ├── TaskPage.tsx            # detalhes de tarefa e subtarefas
│   └── ...                     # outros componentes menores
├── contexts/                   # Context API para tarefas e autenticação
│   ├── AuthContext.tsx         # provê login/logout e user
│   ├── TaskContext.tsx         # provê tasks e operações (create, updateStatus...)
│   └── ...                     
├── types/                      # definições de tipos TypeScript
│   └── api.d.ts                # tipos de respostas da API
├── utils/                      # funções utilitárias
│   └── statusMaps.ts           # mapas de status PT ↔ EN
├── hooks/                      # hooks personalizados (ex: useTasks)
└── index.tsx                   # ponto de entrada
```

## Funcionalidades

* Autenticação de usuário com JWT
* Listagem de tarefas raiz
* Criação, edição e remoção de tarefas
* Subtarefas: criação, navegação e remoção
* Checklist dentro de tarefas: criação, marcação e remoção
* Alteração de status (interface em Português)
