# WE2 Übung 1 – Studienbewerberportal (Backend)

Node.js REST API backend for a degree course application portal, built as part of the Web Engineering II course at BHT Berlin.

## Tech Stack

- Node.js + TypeScript + Express 5
- MongoDB + Mongoose
- JWT authentication
- HTTPS with self-signed certificate
- Jest + Supertest (testing)

## Features

- Basic Auth login with JWT token response
- User management (admin & regular users)
- Degree course management
- Degree course application management
- Contact message endpoint
- CORS enabled for frontend integration

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server on `https://localhost:443`:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## Notes

- Requires a running MongoDB instance
- Uses a self-signed SSL certificate — add a browser exception for `https://localhost:443` on first use
- Admin user (`admin` / `123`) is created automatically on first start
