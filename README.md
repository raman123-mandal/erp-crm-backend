# ERP + CRM Backend API

REST API for the Mini ERP + CRM Operations Portal built with Node.js, Express, TypeScript, Prisma ORM, and PostgreSQL.

## Live URL
```
https://erp-crm-backend-1.onrender.com
```

## Tech Stack
- **Runtime:** Node.js + TypeScript
- **Framework:** Express.js
- **ORM:** Prisma
- **Database:** PostgreSQL (Neon)
- **Auth:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Password Hashing:** bcryptjs

## Local Setup

```bash
npm install
cp .env.example .env
# Fill in DATABASE_URL and JWT_SECRET in .env
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Server runs on `http://localhost:5000`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing |
| `PORT` | Server port (default: 5000) |
| `FRONTEND_URL` | Frontend URL for CORS |

## API Endpoints

### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login user |
| GET | `/api/auth/me` | Protected | Get current user |

### Customers
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/customers` | Protected | List all customers |
| POST | `/api/customers` | Protected | Create customer |
| GET | `/api/customers/:id` | Protected | Get customer by ID |
| PUT | `/api/customers/:id` | Protected | Update customer |

### Products
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/products` | Protected | List all products |
| POST | `/api/products` | Protected | Create product |
| GET | `/api/products/:id` | Protected | Get product by ID |
| PUT | `/api/products/:id` | Protected | Update product |

### Stock
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/stock/movements` | Protected | List stock movements |
| POST | `/api/stock/products/:id/adjust` | Protected | Manual stock adjustment |

### Challans
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/challans` | Protected | List all challans |
| POST | `/api/challans` | Protected | Create draft challan |
| GET | `/api/challans/:id` | Protected | Get challan by ID |
| POST | `/api/challans/:id/confirm` | Protected | Confirm challan + deduct stock |

### Dashboard
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/dashboard/metrics` | Protected | Get dashboard metrics |

## Business Logic

- **Atomic Stock Deduction:** Challan confirmation uses `prisma.$transaction` — if any item exceeds stock, entire transaction rolls back
- **Snapshot Isolation:** Challan items store `productNameSnapshot`, `skuSnapshot`, `unitPriceSnapshot` at creation time for historical accuracy
- **Role Based Access:** Roles — `ADMIN`, `SALES`, `WAREHOUSE`, `ACCOUNTS`

## Seed Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@example.com | Admin@123 |
| Sales | sales@example.com | Admin@123 |
| Warehouse | warehouse@example.com | Admin@123 |
| Accounts | accounts@example.com | Admin@123 |

## Scripts

```bash
npm run dev        # Start dev server with hot reload
npm run build      # Compile TypeScript to dist/
npm run start      # Run compiled production build
npm run prisma:seed  # Seed database
```
