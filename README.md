# Gerenciador de Tarefas (Monorepo)

Este repositório agrega dois microserviços que compõem o **Gerenciador de Tarefas**:

* **todobackend**: API RESTful em Laravel (PHP)
* **todofrontend**: SPA em React + TypeScript (via Laravel Mix)

O sistema permite:

* Autenticação de usuários com JWT
* CRUD de tarefas e subtarefas
* Checklist dentro de cada tarefa
* Alteração de status (interface em Português, dados em Inglês)

---

## Pré-requisitos

* PHP 8.1+
* Composer
* MySQL 5.7+ (ou MariaDB)
* Node.js 16+ e npm (ou Yarn)

---

## Estrutura de Pastas

```
/ (raiz do projeto)
├── todobackend/    # Laravel API
│   ├── app/
│   ├── routes/
│   ├── .env         # configure DB_HOST, conexão etc.
│   ├── Dockerfile   # (opcional, se usarem Docker localmente)
│   └── ...
├── todofrontend/   # SPA React + TS
│   ├── resources/js/
│   ├── .env         # configure MIX_API_BASE
│   ├── package.json
│   └── ...
└── README.md        # este arquivo
```

---

## Como rodar localmente

### 1. Backend (todobackend)

1. Acesse o diretório:

   ```bash
   cd todobackend
   ```
2. Instale dependências PHP:

   ```bash
   composer install
   ```
3. Configure o arquivo `.env` (copie de `.env.example`) e ajuste:

   ```dotenv
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=todobackend
   DB_USERNAME=<seu_usuario>
   DB_PASSWORD=<sua_senha>
   ```
4. Gere a chave da aplicação e rode as migrations:

   ```bash
   php artisan key:generate
   php artisan migrate --seed
   ```
5. Inicie o servidor de desenvolvimento:

   ```bash
   php artisan serve --host=127.0.0.1 --port=8000
   ```

A API ficará disponível em **[http://localhost:8000/api](http://localhost:8000/api)**

### 2. Frontend (todofrontend)

1. Abra uma nova aba/terminal e vá para:

   ```bash
   cd todofrontend
   ```
2. Instale dependências JavaScript:

   ```bash
   npm install
   # ou yarn install
   ```
3. Configure o `.env` (copie de `.env.example`):

   ```env
   MIX_API_BASE=http://localhost:8000/api
   ```
4. Inicie o compilador com hot‑reload:

   ```bash
   npm run dev
   # ou yarn dev
   ```

A aplicação estará em **[http://localhost:3000](http://localhost:3000)**

---

## Contribuição

1. Fork este repositório
2. Crie uma branch feature (`git checkout -b feature/nome`)
3. Faça suas alterações e commit (`git commit -m "Adiciona feature X"`)
4. Push para sua branch (`git push origin feature/nome`)
5. Abra um Pull Request

---

## Licença

MIT © \[asafworld]
