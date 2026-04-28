# Student Application Portal – REST Server

A RESTful backend for a student degree course application portal, built with Node.js, Express, TypeScript, and MongoDB. Developed as part of the **Web Engineering II** course at the Berliner Hochschule für Technik.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Language | TypeScript |
| Framework | Express |
| Database | MongoDB (local, Community Edition) |
| ODM | Mongoose |
| Authentication | Basic Auth + JWT |
| Password Hashing | bcryptjs |
| Protocol | HTTPS (self-signed certificate) |

---

## Features

- Full **CRUD** operations for Users, Degree Courses, and Degree Course Applications
- **JWT-based authentication** via Basic Auth credential handshake
- **Role-based authorization** — Admins vs. Students with granular access control
- **Password hashing** with bcryptjs (salted, never stored in plaintext)
- Auto-creation of default admin user (`admin` / `123`) on first startup if DB is empty
- Search endpoints for filtering by university, applicant, or degree course
- Nested route for retrieving applications per degree course
- Clean **Route → Service → Model** architecture
- Structured JSON error responses with appropriate HTTP status codes
- Catch-all 404 handler for unknown endpoints

---

## Project Structure

```
src/
├── config/                        # Configuration (DB URL, port, JWT secret)
├── database/                      # Mongoose connection setup
├── certificates/                  # HTTPS certificates
├── endpoints/
│   ├── user/
│   │   ├── UserModel.ts
│   │   ├── PublicUsersRoute.ts    # /api/publicUsers (no auth)
│   │   ├── UserRoute.ts           # /api/users (auth required)
│   │   └── UserService.ts
│   ├── authentication/
│   │   ├── AuthenticationRoute.ts # /api/authenticate
│   │   └── AuthenticationService.ts
│   ├── degreeCourse/
│   │   ├── DegreeCourseModel.ts
│   │   ├── DegreeCourseRoute.ts   # /api/degreeCourses
│   │   └── DegreeCourseService.ts
│   └── degreeCourseApplication/
│       ├── DegreeCourseApplicationModel.ts
│       ├── DegreeCourseApplicationRoute.ts  # /api/degreeCourseApplications
│       └── DegreeCourseApplicationService.ts
├── utils/                         # JWT middleware, shared helpers
└── httpServer.ts                  # Entry point
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/)
- [MongoDB Community Edition](https://www.mongodb.com/try/download/community) running locally on default port `27017`

### Installation

```bash
npm install
```

### Run

```bash
npm start
```

The server starts on `https://127.0.0.1:443`.

On first startup, if the database is empty, a default admin user is created automatically:

| Field | Value |
|---|---|
| userID | `admin` |
| password | `123` |
| isAdministrator | `true` |

---

## API Overview

All endpoints are prefixed with `/api`.

### Public Users — no authentication required
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/publicUsers` | Get all users (incl. hashed passwords) |
| GET | `/api/publicUsers/:userID` | Get user by userID |
| POST | `/api/publicUsers` | Create user |
| PUT | `/api/publicUsers/:userID` | Update user |
| DELETE | `/api/publicUsers/:userID` | Delete user |

> This endpoint exists for automated testing and always returns the hashed password. It is retained across all milestones.

### Authentication
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/authenticate` | Authenticate via Basic Auth, returns JWT in response header |

### Users — JWT required
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/users` | Get all users — admin only |
| GET | `/api/users/:userID` | Get user by userID |
| POST | `/api/users` | Create user — admin only |
| PUT | `/api/users/:userID` | Update user (non-admins: own firstName/lastName/password only) |
| DELETE | `/api/users/:userID` | Delete user — admin only |

### Degree Courses — JWT required for write operations
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/degreeCourses` | Get all degree courses (public read) |
| GET | `/api/degreeCourses?universityShortName=BHT` | Filter by university |
| GET | `/api/degreeCourses/:id` | Get degree course by ID |
| POST | `/api/degreeCourses` | Create degree course — admin only |
| PUT | `/api/degreeCourses/:id` | Update degree course — admin only |
| DELETE | `/api/degreeCourses/:id` | Delete degree course — admin only |
| GET | `/api/degreeCourses/:id/degreeCourseApplications` | Get all applications for a degree course — admin only |

### Degree Course Applications — JWT required
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/degreeCourseApplications` | Get all applications — admin only |
| GET | `/api/degreeCourseApplications?applicantUserID=manfred` | Filter by applicant — admin only |
| GET | `/api/degreeCourseApplications?degreeCourseID=:id` | Filter by degree course — admin only |
| GET | `/api/degreeCourseApplications/myApplications` | Get own applications |
| GET | `/api/degreeCourseApplications/:id` | Get application by ID |
| POST | `/api/degreeCourseApplications` | Create application (applicantUserID determined from token) |
| PUT | `/api/degreeCourseApplications/:id` | Update application (non-admins: year/semester only) |
| DELETE | `/api/degreeCourseApplications/:id` | Delete own application |

---

## Authorization Rules

**Users**
- Only admins can list all users, create, edit, or delete any user
- Non-admins can only read and update their own profile (firstName, lastName, password)
- The `userID` and `isAdministrator` fields cannot be changed by non-admins

**Degree Courses**
- Anyone (including unauthenticated users) can read degree courses
- Only admins can create, update, or delete

**Degree Course Applications**
- Only one application per user per degree course per semester is allowed
- Non-admins can only view, edit (year/semester), and delete their own applications
- Admins have full access

---

## Architecture

The project follows a strict three-layer separation:

```
Route  →  Service  →  Model
```

- **Route**: Handles HTTP request/response, token validation middleware, and status codes — no business logic
- **Service**: Contains business logic, authorization checks, and data validation — no HTTP objects
- **Model**: Mongoose schema and direct database access

JWT middleware is implemented as a reusable utility function applied per route where authentication is required.

---

## Security

- **HTTPS** with self-signed certificate
- **Basic Authentication** for the `/authenticate` endpoint (credentials via `Authorization: Basic <base64>` header)
- **JWT tokens** passed via `Authorization: Bearer <token>` header — never via cookie or request body
- Passwords hashed with **bcryptjs** (salt + hash) and never returned outside of `/publicUsers`
- Token payload contains `userID` and `isAdministrator` to avoid extra DB lookups per request
