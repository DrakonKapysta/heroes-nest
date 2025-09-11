# Super Hero App - Backend

## 🚀 Технології

- **NestJS** - Node.js фреймворк для створення серверних додатків
- **TypeScript** - типізована мова програмування
- **PostgreSQL** - база даних
- **MinIO** - об'єктне сховище для файлів
- **Docker** - контейнеризація
- **JWT** - автентифікація
- **Passport** - стратегії автентифікації

## 📋 Передумови

Переконайтеся, що у вас встановлено:

- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)
- [Node.js](https://nodejs.org/) (версія 18 або новіша)
- [npm](https://www.npmjs.com/) або [yarn](https://yarnpkg.com/)

## 🛠️ Встановлення та запуск

### 1. Клонування репозиторію

```bash
git clone <repository-url>
```

### 2. Встановлення залежностей

```bash
npm install
```

або

```bash
yarn install
```

### 3. Запуск інфраструктури через Docker

Спочатку запустіть PostgreSQL та MinIO:

```bash
docker-compose up -d
```

Ця команда запустить:

- **PostgreSQL** на порту `5432`
  - База даних: `heroes`
  - Користувач: `postgres`
  - Пароль: `postgres`
- **MinIO** на портах `9000` (API) та `9090` (Console)
  - Користувач: `minioadmin`
  - Пароль: `minioadmin123`

### 4. Налаштування змінних середовища

Створіть файл `.env` в корені проекту:

```bash
# База даних
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/heroes

# JWT
JWT_SECRET=your-super-secret-jwt-key

# MinIO
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
MINIO_BUCKET_NAME=heroes-bucket

# Додаток
PORT=3000
NODE_ENV=development
```

### 5. Запуск додатку

#### Режим розробки

```bash
npm run start:dev
```

#### Режим продакшн

```bash
npm run build
npm run start:prod
```

#### Режим з відладженням

```bash
npm run start:debug
```

## 🧪 Тестування

### Запуск юніт тестів

```bash
npm run test
```

### Запуск тестів з відстеженням змін

```bash
npm run test:watch
```

### Запуск e2e тестів

```bash
npm run test:e2e
```

### Запуск тестів з покриттям

```bash
npm run test:cov
```

## 🐳 Docker команди

### Запуск інфраструктури

```bash
# Запуск у фоновому режимі
docker-compose up -d

# Запуск з логами
docker-compose up

# Зупинка сервісів
docker-compose down

# Зупинка з видаленням томів
docker-compose down -v
```

### Перевірка статусу контейнерів

```bash
docker-compose ps
```

### Перегляд логів

```bash
# Логи всіх сервісів
docker-compose logs

# Логи конкретного сервісу
docker-compose logs postgres
docker-compose logs minio
```

## 🔧 Корисні команди

### Лінтинг та форматування

```bash
# Запуск ESLint
npm run lint

# Форматування коду
npm run format
```

### Робота з базою даних

```bash
# Підключення до PostgreSQL через Docker
docker exec -it postgres-heroes psql -U postgres -d heroes
```

### Доступ до MinIO Console

Відкрийте в браузері: http://localhost:9090

- Логін: `minioadmin`
- Пароль: `minioadmin123`

## 📁 Структура проекту

```
back-end/
├── src/
│   ├── app.controller.ts      # Основний контролер
│   ├── app.module.ts          # Головний модуль додатку
│   ├── app.service.ts         # Основний сервіс
│   └── main.ts               # Точка входу
├── test/                     # E2E тести
├── docker-compose.yaml       # Docker конфігурація
├── package.json             # NPM залежності
└── README.md               # Цей файл
```

## 🌐 API Endpoints

Після запуску додаток буде доступний за адресою: http://localhost:3000

## 🚨 Усунення проблем

### Порти зайняті

Якщо порти 5432, 9000 або 9090 зайняті, змініть їх у файлі `docker-compose.yaml`.

### Проблеми з правами доступу

На Linux/macOS можуть знадобитися додаткові права:

```bash
sudo docker-compose up -d
```

### Очищення Docker

Якщо виникають проблеми з контейнерами:

```bash
# Зупинка всіх контейнерів
docker-compose down

# Видалення томів
docker-compose down -v

# Перезапуск
docker-compose up -d
```
