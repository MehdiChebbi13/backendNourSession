# Restaurant Backend Service

This is a backend service for a restaurant ordering system built with Fastify, PostgreSQL, and Redis. It handles session management, messaging, and order processing.

## Prerequisites

- Node.js (v18.18 or higher)
- pnpm (v7 or higher)
- Docker and Docker Compose

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd backendNourSession
```

2. Install dependencies:

```bash
cd backend
pnpm install
```

## Setup

### Database and Redis

The project uses Docker Compose to run PostgreSQL and Redis.

1. Start the services:

```bash
docker-compose up -d
```

This will start:

- PostgreSQL on port 5432
- Redis on port 6379

### Environment Variables

The backend uses environment variables for configuration. A `backend/.env` file is already set up with:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/qrdb"
REDIS_URL="redis://localhost:6379"
```

### Database Schema

Initialize the database schema using Prisma:

```bash
cd backend
npx prisma migrate dev
```

## Running the Application

### Development Mode

To run the application in development mode with hot reloading:

```bash
cd backend
pnpm dev
```

The server will be available at http://localhost:3000.

### Production Mode

To run the application in production mode:

1. Build the TypeScript code:

```bash
cd backend
pnpm build
```

2. Start the server:

```bash
pnpm start
```

## API Endpoints

### Health Check

```
GET /health
```

Returns `{"ok": true}` if the server is running.

### Session Management

Sessions are automatically created when accessing endpoints with `r` and `t` query parameters:

```
GET /any-endpoint?r=restaurant_id&t=table_id
```

This creates a session cookie that will be used for subsequent requests.

### Messages

#### Create Message

```
POST /messages
Content-Type: application/json

{
  "role": "user",
  "text": "Hello, I'd like to order a pizza"
}
```

#### Get Messages

```
GET /messages
```

Returns all messages for the current session.

## Project Structure

- `backend/src/server.ts` - Main entry point
- `backend/src/plugins/session.ts` - Session management with Redis
- `backend/src/routes/message.ts` - Message endpoints
- `backend/src/lib/prisma.ts` - Prisma client setup
- `backend/prisma/schema.prisma` - Database schema definition

## Database Schema

The database consists of three main tables:

- `Session` - Stores session information
- `Message` - Stores chat messages
- `Order` - Stores order information
