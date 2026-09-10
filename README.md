# Northwind App

Angular frontend for a simple Northwind admin panel. Shows customers, products, orders, employees, suppliers, shippers etc. with a table that has search, sort and pagination.

## Run

```bash
npm install
ng serve
```

Open http://localhost:4200

## Backend

This repo is only the frontend. The API is a separate NestJS project ([northwind-backend](https://github.com/rajeshgajra19889/northwind-backend)). Start that first, it runs on port 3000, then this app will talk to it.

## What's inside

- Customers, Products, Categories, Suppliers, Orders, Employees, Territories, Regions, Shippers
- A dashboard with some charts (no chart lib, just CSS)
- Dashboard / list / form pages for most modules
- Detail pages: supplier products, employee territories, employee orders, customer orders, order items