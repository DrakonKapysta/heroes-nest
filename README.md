# Super Hero App - Backend

## Overview

This is the backend for the Super Hero App, built with [NestJS](https://nestjs.com/) and [TypeScript](https://www.typescriptlang.org/). It provides RESTful APIs for managing superheroes and users, supports authentication with JWT, and stores files using MinIO. The app uses PostgreSQL as its database and Redis for caching.

## Features

- User registration and authentication (JWT, Passport)
- Superhero CRUD operations
- File upload and storage via MinIO
- API documentation with Swagger
- Dockerized infrastructure (PostgreSQL, MinIO, Redis)

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

## Getting Started

### 1. Clone the repository

```sh
git clone <repository-url>
cd super-hero-app/back-end
```

### 2. Install dependencies

```sh
npm install
```

or

```sh
yarn install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```properties
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/heroes?schema=public"
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRATION=3600
PORT=5000

MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_USE_SSL=false
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123

REDIS_PORT=6379
```

### 4. Start infrastructure with Docker

```sh
docker-compose up -d
```

This will start:

- PostgreSQL on port 5432
- MinIO on ports 9000 (API) and 9090 (Console)
- Redis on port 6379

### 5. Run database migrations and seed data

If you use Prisma, run:

```sh
npx prisma migrate deploy
npm run prisma:seed
```

### 6. Start the backend server

#### Development mode

```sh
npm run start:dev
```

#### Production mode

```sh
npm run build
npm run start:prod
```

## API Documentation

After starting the server, Swagger documentation is available at:

```
http://localhost:5000/api
```

## Running Tests

- Unit tests: `npm run test`

## Useful Docker Commands

- Stop services: `docker-compose down`
- View logs: `docker-compose logs`
- Access MinIO Console: [http://localhost:9090](http://localhost:9090) (login: `minioadmin`, password: `minioadmin123`)
- Access PostgreSQL:
  ```sh
  docker exec -it postgres-heroes psql -U postgres -d heroes
  ```

## Project Structure

```
back-end/
├── src/                # Source code
├── prisma/             # Prisma schema and migrations
├── test/               # e2e tests
├── docker-compose.yaml # Docker infrastructure
├── package.json        # NPM scripts and dependencies
└── README.md           # This file
```

## Troubleshooting

- **Ports busy:** Change ports in `docker-compose.yaml` or `.env`.
- **MinIO Console:** [http://localhost:9090](http://localhost:9090)
- **Database connection issues:**
