# course-project

# Bookshop — Информационная система книжного магазина

**Стек:** Python, FastAPI, React, SCSS, PostgreSQL, JWT

---

## Быстрый старт (локально)

### 1. База данных

Создай базу данных в PostgreSQL:

```sql
CREATE DATABASE bookshop_db;
```

### 2. Бэкенд

```bash
cd backend

# Создать виртуальное окружение
python -m venv .venv
source .venv/bin/activate        # Linux/Mac
# .venv\Scripts\activate         # Windows

# Установить зависимости
pip install -r requirements.txt

# Настроить окружение
cp .env.example .env
# Открой .env и заполни DATABASE_URL и SECRET_KEY

# Применить миграции
alembic upgrade head

# Запустить сервер
uvicorn app.main:app --reload
```

API будет доступен на `http://localhost:8000`  
Swagger UI: `http://localhost:8000/api/docs`

### 3. Фронтенд

```bash
cd frontend
npm install
npm run dev
```

Приложение откроется на `http://localhost:5173`

---

## Структура проекта

```
bookshop/
├── backend/
│   ├── app/
│   │   ├── api/v1/endpoints/   # Эндпоинты (books, sales, ...)
│   │   ├── core/               # config.py, security.py
│   │   ├── db/                 # session.py
│   │   ├── models/             # SQLAlchemy модели
│   │   ├── schemas/            # Pydantic схемы
│   │   ├── services/           # Бизнес-логика
│   │   ├── repositories/       # Работа с БД
│   │   └── main.py
│   ├── alembic/                # Миграции
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/                # axios-клиент и запросы
│   │   ├── components/         # React компоненты
│   │   ├── pages/              # Страницы
│   │   ├── hooks/              # Кастомные хуки
│   │   ├── store/              # Глобальное состояние
│   │   └── styles/             # SCSS
│   └── public/
├── docs/                       # Диаграммы и документация
├── docker-compose.yml
└── .gitignore
```

---

## Git

```bash
git init
git add .
git commit -m "init: project structure"
git remote add origin https://github.com/YOUR_USERNAME/bookshop.git
git push -u origin main
```

# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
