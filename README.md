# Northwind Admin App

A full-stack CRUD application built with Angular and NestJS, backed by the classic Northwind PostgreSQL database.

## Tech Stack

- **Frontend:** Angular 22 (signals, reusable data grid, admin layout)
- **Backend:** NestJS + TypeORM
- **Database:** PostgreSQL (Northwind)

## Features

- Server-side pagination, search, and sorting
- Reusable data grid component
- Navbar / sidebar admin layout with routing
- Customer management

## Repositories

This project is split into two repos:

| Part | Repo |
|------|------|
| Frontend (Angular) | `northwind-app` (this repo) |
| Backend (NestJS) | `northwind-backend` |

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL with the Northwind database imported
- Angular CLI 22

### 1. Database setup

Create a database named `Northwind` in PostgreSQL and import the Northwind schema/data.

### 2. Backend

```bash
git clone <northwind-backend-url>
cd northwind-backend
npm install
```

Create a `.env` file with your database credentials:

```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_NAME=Northwind
```

Then start the API:

```bash
npm run start:dev
```

The API runs at `http://localhost:3000`.

### 3. Frontend

```bash
git clone <this-repo-url>
cd northwind-app
npm install
ng serve
```

The app runs at `http://localhost:4200`.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/customers` | Get customers with paging, search, sorting |

### Query parameters

| Param | Type | Description |
|-------|------|-------------|
| `page` | number | Page number (default 1) |
| `pageSize` | number | Rows per page (default 10) |
| `search` | string | Filter by company/contact name |
| `sortBy` | string | Column to sort by |
| `sortOrder` | `asc` \| `desc` | Sort direction |

## License

MIT