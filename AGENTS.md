# AGENTS.md

## Overview

Angular 22 frontend for the Northwind admin app. Backend lives in a separate `northwind-backend` repo (NestJS). This repo contains only the frontend.

## Commands

| Task | Command |
|------|---------|
| Dev server | `npm start` (serves at localhost:4200) |
| Build | `npm run build` |
| Tests (all) | `npm test` |
| Tests (single run, no watch) | `npm test -- --watch=false` |
| Format | `npx prettier --write "src/**/*.{ts,html,scss}"` |

There is no linter or typecheck script. CI only runs `npm run build` then `npm test -- --watch=false`.

## Tech Details

- Angular 22, TypeScript 6, **Vitest** (not Karma/Jasmine)
- Test builder: `@angular/build:unit-test` (configured in `angular.json`)
- All components are **standalone** — no NgModules
- Component files follow Angular 22 naming: `foo.ts` not `foo.component.ts`
- Styles: SCSS. HTML files use the `angular` Prettier parser
- Component selector prefix: `app`

## Code Patterns

- **Signals**: use `signal()`, `computed()`, `input()`, `effect()` — not RxJS observables for state
- **Dependency injection**: `inject()` function (not constructor injection)
- **Services**: use `@Service()` decorator (Angular 22 standalone service pattern)
- **Route params**: bound to component `input()` signals automatically via `withComponentInputBinding()` in `app.config.ts`
- **HTTP**: `provideHttpClient()` configured at app level, services use `HttpClient`

## Project Structure

```
src/app/
├── features/
│   ├── customer/      # customer.ts (interface), customer.service.ts, customer-list/, customer-form/
│   ├── product/       # product.ts (interface), product-service.ts, product-list/, product-form/
│   └── layout/        # admin-layout/, navbar/, sidebar/
├── shared/
│   └── data-grid/     # Reusable data grid (DataGrid component, DataGridColumn/DataGridAction interfaces)
├── app.routes.ts      # All routes under AdminLayout parent
├── app.config.ts      # Providers: router, httpClient
└── app.ts             # Root component
```

## Gotchas

- API base URL `http://localhost:3000` is **hardcoded** in each service — no environment files or proxy config
- Backend must be running separately for the app to function
- `DepartmentPagedRequest` interface in `customer.ts` appears to be a misnomer (copy-paste leftover) — it is used for customer pagination
- Services return `Observable<any>` — response shapes are not typed
- The `DataGrid` component accepts `rows: any[]` — type safety is in the parent component
