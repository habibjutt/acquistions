# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Running the Application
- `npm run dev` - Start development server with hot reload using Node.js --watch flag
- `npm start` - Start production server (uses `src/index.js` as entry point)

### Code Quality
- `npm run lint` - Run ESLint to check code style and errors
- `npm run lint:fix` - Automatically fix ESLint errors where possible
- `npm run format` - Format code using Prettier
- `npm run format:check` - Check if code is properly formatted without making changes

### Database Operations
- `npm run db:generate` - Generate database migration files using Drizzle Kit
- `npm run db:migrate` - Apply database migrations to the database
- `npm run db:studio` - Open Drizzle Studio for database management and inspection

## Architecture Overview

### Project Structure
This is a Node.js Express.js application with a modular architecture using ES modules and path mapping for clean imports.

**Key Architectural Patterns:**
- **MVC Pattern**: Controllers handle HTTP requests, Services contain business logic, Models define database schema
- **Path Mapping**: Uses Node.js imports map with `#` prefix for clean internal module imports (e.g., `#config/*`, `#controllers/*`)
- **Layered Architecture**: Clear separation between routes, controllers, services, and data access

### Technology Stack
- **Framework**: Express.js 5.x with ES modules
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Authentication**: JWT tokens with bcrypt password hashing
- **Validation**: Zod for request validation
- **Logging**: Winston with file and console transports
- **Security**: Helmet, CORS, cookie-parser with secure cookie handling

### Core Components

**Database Layer:**
- Database connection configured in `src/config/database.js` using Neon serverless
- Models defined with Drizzle ORM in `src/models/` (currently only `user.model.js`)
- Migrations stored in `drizzle/` directory and managed by Drizzle Kit

**Authentication System:**
- JWT-based authentication with configurable expiration
- Secure cookie handling with environment-specific settings
- Password hashing using bcrypt with salt rounds of 10
- Role-based access (user/admin roles defined in validation schema)

**Request Flow:**
1. Routes (`src/routes/`) define endpoints and map to controllers
2. Controllers (`src/controllers/`) handle HTTP logic and validation
3. Services (`src/services/`) contain business logic and database operations
4. Utilities (`src/utils/`) provide reusable functionality (JWT, cookies, formatting)

**Configuration:**
- Environment variables managed through dotenv
- Logging configured with Winston (file and console outputs)
- Database configuration centralized in `src/config/database.js`

### Environment Setup
Copy `.env.example` to `.env` and configure:
- `PORT` - Server port (defaults to 3000)
- `NODE_ENV` - Environment (development/production)
- `DATABASE_URL` - PostgreSQL connection string for Neon
- `LOG_LEVEL` - Winston logging level
- `JWT_SECRET` - Secret for JWT token signing
- `JWT_EXPIRES_IN` - JWT token expiration time

### Current Implementation Status
- Basic Express app setup with security middleware (helmet, CORS)
- User registration endpoint (`POST /api/auth/sign-up`) fully implemented
- Sign-in and sign-out endpoints stubbed but not implemented
- Health check endpoint at `/health`
- Logging configured for both file and console output
- Database schema includes users table with role-based access

### Development Notes
- Uses ES modules with top-level await support
- Path mappings require Node.js imports field in package.json
- Database migrations are version-controlled in the drizzle directory
- Logging outputs to `logs/` directory (error.log and combined.log)
- Code style enforced through ESLint and Prettier with specific rules for Node.js globals