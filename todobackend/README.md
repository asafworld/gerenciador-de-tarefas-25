# Gerenciador de Tarefas – Back‑end (Laravel 8)

## Visão geral

Este repositório implementa a API REST de um **Gerenciador de Tarefas** em PHP / Laravel 8.
Ele provê autenticação via **JWT**, gestão de tarefas com **sub‑tarefas (apenas 1 nível)** e **check‑lists** independentes em cada nível.

<p align="center">
   <img src="https://img.shields.io/badge/PHP-7.4-blue" />
   <img src="https://img.shields.io/badge/Laravel-8.x-red" />
   <img src="https://img.shields.io/badge/Auth-JWT-orange" />
   <img src="https://img.shields.io/badge/Tests-Pest-green" />
</p>

---

## Principais recursos

| Módulo           | Funcionalidades                                                                                                                                        |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Autenticação** | Registro, login, refresh, logout, rota `me` (JWT).                                                                                                     |
| **Tarefas**      | CRUD completo; uma tarefa raiz pode ter várias sub‑tarefas; sub‑tarefas **não podem** ter outras sub‑tarefas.                                          |
| **Check‑lists**  | Cada tarefa (raiz ou sub) possui sua própria to‑do‑list; CRUD completo de itens.                                                                       |
| **Autorização**  | *Policies* garantem que somente o **responsável** pode atualizar/excluir sua tarefa; tarefas raiz sem responsável são públicas (somente visualização). |
| **Validação**    | `FormRequest` específicos diferenciam regras de **POST** e **PUT/PATCH**.                                                                              |
| **Testes**       | Suite Pest cobrindo fluxos positivos, erros 401/403/422, regras de profundidade e policies.                                                            |

---

## Arquitetura & stack

* **Laravel 8.83** (PHP 7.4 compat.)
* **JWT Auth** (`php-open-source-saver/jwt-auth`)
* **SQLite** (default para testes) ou MySQL/PostgreSQL (produção)
* **Pest** + PHPUnit para testes
* **Docker (opcional):** exemplo de `docker-compose.yml` incluído abaixo.

### Entidades

```text
User 1─∞ Task (responsible_user_id)
Task 1─∞ Task (parent_task_id)   ← máx. 1 nível
Task 1─∞ ChecklistItem
```

| Tabela               | Campos principais                                                                                           |
| -------------------- | ----------------------------------------------------------------------------------------------------------- |
| **users**            | `id`, `name`, `email`, `password`                                                                           |
| **tasks**            | `id`, `description`, `status` (`pending`, `in_progress`, `done`), `responsible_user_id?`, `parent_task_id?` |
| **checklist\_items** | `id`, `description`, `is_done`, `responsible_user_id?`, `task_id`                                           |

---

## Instalação local

```bash
# 1. Clone
$ git clone git@github.com:asafworld/gerenciador-de-tarefas-25.git && cd todobackend

# 2. Dependências PHP
$ composer install --prefer-dist --no-scripts

# 3. Arquivo de ambiente
$ cp .env.example .env
$ php artisan key:generate
$ php artisan jwt:secret   # gera JWT_SECRET

# 4. Banco de dados
#   Por padrão .env está com SQLITE; basta:
$ touch database/database.sqlite
$ php artisan migrate --seed

# 5. Rodar
$ php artisan serve   # http://localhost:8000
```

### Docker (opcional)

> Se preferir rodar tudo em containers, crie o arquivo **`docker-compose.yml`** abaixo na raiz
> (ou adapte ao seu ambiente) e execute `docker compose up -d --build`.

```yaml
version: "3.9"
services:
  app:
    build: .
    container_name: todo-app
    ports: ["8000:8000"]
    volumes: [".:/var/www/html"]
    depends_on: [db]
    command: bash -c "composer install && php artisan key:generate && php artisan migrate --seed && php -S 0.0.0.0:8000 -t public"
  db:
    image: mysql:8.0
    environment:
      MYSQL_DATABASE: todobackend
      MYSQL_ROOT_PASSWORD: secret
    ports: ["3306:3306"]
```

*Inclua um `Dockerfile` simples baseado em `php:8.2-fpm` caso queira personalizar.*

---

## API Reference

### Autenticação (`/api/auth/*`)

| Método | URI              | Body                                          | Descrição                    |
| ------ | ---------------- | --------------------------------------------- | ---------------------------- |
| `POST` | `/auth/register` | `{name,email,password,password_confirmation}` | cria usuário & retorna token |
| `POST` | `/auth/login`    | `{email,password}`                            | gera token                   |
| `POST` | `/auth/logout`   | –                                             | revoga token atual           |
| `POST` | `/auth/refresh`  | –                                             | renova token                 |
| `GET`  | `/auth/me`       | –                                             | dados do usuário autenticado |

### Tarefas (`/api/tasks`)

| Método        | URI           | Body                                       | Acesso                                     |
| ------------- | ------------- | ------------------------------------------ | ------------------------------------------ |
| `GET`         | `/tasks`      | –                                          | lista tarefas do usuário + raízes públicas |
| `GET`         | `/tasks/{id}` | –                                          | detalhes + children + checklist            |
| `POST`        | `/tasks`      | `description*`, `status`, `parent_task_id` | cria (raiz ou sub)                         |
| `PUT`/`PATCH` | `/tasks/{id}` | campos parciais                            | atualiza (somente responsável)             |
| `DELETE`      | `/tasks/{id}` | –                                          | remove                                     |

### Checklist Items (`/api/tasks/{task}/checklist-items`)

| Método        | URI                             | Body                      |
| ------------- | ------------------------------- | ------------------------- |
| `GET`         | `/tasks/{task}/checklist-items` | –                         |
| `POST`        | idem                            | `description*`, `is_done` |
| `GET`         | `/checklist-items/{id}`         | –                         |
| `PUT`/`PATCH` | idem                            | campos parciais           |
| `DELETE`      | idem                            | –                         |

> Todas as rotas (exceto `/auth/register` e `/auth/login`) requerem header
> `Authorization: Bearer <token>` **+** `Accept: application/json`.

---

## Executando os testes

```bash
# Ambiente de teste usa SQLite in‑memory
$ php artisan test        # roda PHPUnit + Pest
```

### Cobertura

* Autenticação – 100 %
* CRUD de Tasks – positivo & negativo (401/403/422)
* CRUD de ChecklistItems – positivo & negativo
* Policies e regra de profundidade – unit tests

---

## Estrutura de pastas (simplificada)

```
app/
 ├── Models/            # User, Task, ChecklistItem
 ├── Http/
 │   ├── Controllers/   # Auth, Task, ChecklistItem
 │   ├── Requests/      # TaskRequest, ChecklistItemRequest
 │   └── Middleware/
 ├── Policies/          # TaskPolicy, ChecklistItemPolicy
 └── Console/

routes/
 └── api.php            # todas as rotas REST

database/
 ├── migrations/
 ├── factories/
 └── seeders/

tests/                  # suite Pest (Feature & Unit)
```