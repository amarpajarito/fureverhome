<div align="center">
  <img src="frontend/public/logo.svg" alt="FureverHome Logo" width="400"/>

[![Angular](https://img.shields.io/badge/Angular-20.3.0-red)](https://angular.dev/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.2.0-green)](https://spring.io/projects/spring-boot)
[![Java](https://img.shields.io/badge/Java-17-orange)](https://www.oracle.com/java/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-336791)](https://www.postgresql.org/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

</div>

FureverHome is a comprehensive dog adoption management system that connects potential adopters with rescue dogs. The platform features secure authentication with role-based access control (User/Admin), real-time dog browsing, adoption request management, favorites system, and user profile management with avatar uploads.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Database Setup](#database-setup)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Troubleshooting](#troubleshooting)
- [License](#license)

## Prerequisites

**Required Software**

- Node.js 20.0.0 or higher
- npm 9.0.0 or higher
- Java 17 or higher
- Maven 3.8.0 or higher
- PostgreSQL 15 or higher
- Git

## Installation

**1. Clone the Repository**

```bash
git clone https://github.com/amarpajarito/fureverhome.git
cd fureverhome
```

**2. Install Backend Dependencies**

```bash
cd backend
mvn clean install
```

**3. Install Frontend Dependencies**

```bash
cd ../frontend
npm install
```

## Database Setup

**1. Create PostgreSQL Database**

```bash
# Login to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE fureverhome;

# Exit psql
\q
```

**2. Execute Database Schema**

The application uses Spring Boot's automatic schema generation (`spring.jpa.hibernate.ddl-auto=update`), but you can also manually create the schema:

```sql
-- ============================================
-- FUREVERHOME DATABASE SETUP
-- ============================================

-- Users table
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'USER',
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    phone_number VARCHAR(20),
    address VARCHAR(500),
    avatar BYTEA,
    avatar_content_type VARCHAR(50),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Dogs table
CREATE TABLE dogs (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    breed VARCHAR(100) NOT NULL,
    age INTEGER NOT NULL,
    gender VARCHAR(10) NOT NULL,
    description TEXT,
    health_status VARCHAR(50) NOT NULL DEFAULT 'Healthy',
    image_url VARCHAR(255),
    image BYTEA,
    image_content_type VARCHAR(100),
    available BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Adoption Requests table
CREATE TABLE adoption_requests (
    id BIGSERIAL PRIMARY KEY,
    dog_id BIGINT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    message TEXT,
    full_name VARCHAR(255),
    email VARCHAR(255),
    phone VARCHAR(50),
    address TEXT,
    occupation VARCHAR(255),
    household_members INTEGER,
    has_other_pets BOOLEAN,
    pet_experience TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Favorites table
CREATE TABLE favorites (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    dog_id BIGINT NOT NULL REFERENCES dogs(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, dog_id)
);

-- Create indexes for better performance
CREATE INDEX idx_dogs_available ON dogs(available);
CREATE INDEX idx_dogs_breed ON dogs(breed);
CREATE INDEX idx_adoption_requests_user_id ON adoption_requests(user_id);
CREATE INDEX idx_adoption_requests_dog_id ON adoption_requests(dog_id);
CREATE INDEX idx_adoption_requests_status ON adoption_requests(status);
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_dog_id ON favorites(dog_id);

-- Insert default admin user (password: admin123)
INSERT INTO users (username, email, password_hash, role, first_name, last_name)
VALUES ('admin', 'admin@fureverhome.com', '$2a$10$YourHashedPasswordHere', 'ADMIN', 'Admin', 'User')
ON CONFLICT DO NOTHING;
```

**Verify Database Setup**

```sql
-- Check tables
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE';

-- Check if admin user exists
SELECT username, email, role FROM users WHERE role = 'ADMIN';
```

## Configuration

**Backend Configuration**

Create a `.env` file in the **backend** directory:

```env
# Server Configuration
SERVER_PORT=8080
CONTEXT_PATH=/api

# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_NAME=fureverhome
DB_USERNAME=postgres
DB_PASSWORD=your_postgres_password

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-minimum-256-bits-long-please-change-this
JWT_EXPIRATION=86400000

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:4200

# File Upload Settings
MAX_FILE_SIZE=5MB
MAX_REQUEST_SIZE=10MB

# Logging Level
LOGGING_LEVEL=INFO
```

**Frontend Configuration**

Create `environment.ts` in `frontend/src/environments/`:

```typescript
export const environment = {
  production: false,
  apiUrl: "http://localhost:8080/api",
};
```

**Obtaining Configuration Values**

1. **PostgreSQL Database**

   - Install PostgreSQL locally or use a cloud provider
   - Create database: `fureverhome`
   - Note your username and password

2. **JWT Secret**

   - Generate using: `openssl rand -base64 64`
   - Must be at least 256 bits (32 characters)

3. **CORS Origins**
   - For development: `http://localhost:4200`
   - For production: Add your deployed frontend URL

## Running the Application

### Backend (Spring Boot)

**Option 1: Using Maven**

```bash
cd backend
mvn spring-boot:run
```

**Option 2: Using IDE (IntelliJ IDEA / Eclipse)**

1. Open the `backend` folder as a Maven project
2. Run `FureverHomeApplication.java`

The backend will be available at `http://localhost:8080/api`

### Frontend (Angular)

```bash
cd frontend
npm start
# or
ng serve
```

The frontend will be available at `http://localhost:4200`

### PostgreSQL Database

Ensure PostgreSQL is running:

```bash
# Windows (if installed as service)
# It should start automatically

# Linux/Mac
sudo service postgresql start
# or
pg_ctl -D /usr/local/var/postgresql@15 start
```

**Default Login Credentials**

- **Admin Account**

  - Email: `admin@fureverhome.com`
  - Password: `admin123`

- **Test User Account**
  - Email: `user@test.com`
  - Password: `password123`

## Project Structure

```
fureverhome/
├── backend/                 # Spring Boot backend
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/fureverhome/
│   │   │   │   ├── config/          # Security, CORS, etc.
│   │   │   │   ├── controller/      # REST API endpoints
│   │   │   │   ├── dto/             # Data Transfer Objects
│   │   │   │   ├── model/           # JPA entities
│   │   │   │   ├── repository/      # Database repositories
│   │   │   │   ├── security/        # JWT, authentication
│   │   │   │   └── service/         # Business logic
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   ├── pom.xml
│   └── .env
│
├── frontend/                # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/            # Services, guards, interceptors
│   │   │   ├── features/        # Feature modules (auth, dogs, admin, etc.)
│   │   │   ├── shared/          # Shared components (navbar, footer)
│   │   │   └── app.routes.ts
│   │   ├── environments/
│   │   └── index.html
│   ├── angular.json
│   ├── package.json
│   └── tailwind.config.js
│
└── README.md
```

## Features

### User Features

- 🐕 Browse available dogs for adoption
- ❤️ Add dogs to favorites
- 📝 Submit adoption requests with detailed application
- 👤 User profile management with avatar upload
- 🔐 Secure authentication (JWT-based)

### Admin Features

- 🔧 Manage dogs (CRUD operations)
- 📸 Upload dog images (stored as BYTEA in database)
- 📋 Review and manage adoption requests (Approve/Reject)
- 👥 View all users and adoption statistics

### Technical Features

- 🔒 Role-based access control (USER/ADMIN)
- 🖼️ Binary image storage in PostgreSQL
- ⚡ Cache-busting for image updates
- 🎨 Responsive design with Tailwind CSS
- 🔄 Real-time form validation
- 📱 Mobile-friendly interface

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Dogs

- `GET /api/dogs` - Get all dogs
- `GET /api/dogs/{id}` - Get dog by ID
- `GET /api/dogs/{id}/image` - Get dog image
- `POST /api/dogs` - Create dog (Admin only)
- `PUT /api/dogs/{id}` - Update dog (Admin only)
- `DELETE /api/dogs/{id}` - Delete dog (Admin only)

### Adoption Requests

- `GET /api/adoption-requests` - Get all requests (Admin only)
- `GET /api/adoption-requests/my-requests` - Get user's requests
- `POST /api/adoption-requests` - Create adoption request
- `PATCH /api/adoption-requests/{id}/status` - Update status (Admin only)

### Users

- `GET /api/users/profile` - Get current user profile
- `PUT /api/users/profile` - Update profile with avatar
- `PUT /api/users/password` - Update password

### Favorites

- `GET /api/favorites` - Get user's favorite dog IDs
- `POST /api/favorites/{dogId}` - Add to favorites
- `DELETE /api/favorites/{dogId}` - Remove from favorites

## Troubleshooting

**Common Issues**

| Issue                      | Solution                                                          |
| -------------------------- | ----------------------------------------------------------------- |
| Backend won't start        | Check PostgreSQL is running and credentials in `.env` are correct |
| Frontend can't connect     | Verify backend is running on port 8080                            |
| Image upload fails         | Check `MAX_FILE_SIZE` in backend `.env` (default: 5MB)            |
| JWT token invalid          | Ensure `JWT_SECRET` is at least 256 bits (32 characters)          |
| CORS errors                | Verify `CORS_ALLOWED_ORIGINS` includes `http://localhost:4200`    |
| Database connection failed | Check PostgreSQL service is running and database exists           |

**Backend Build Errors**

```bash
# Clean Maven cache and rebuild
cd backend
mvn clean install -U
```

**Frontend Build Errors**

```bash
# Clear npm cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
```

**Database Connection Test**

```bash
# Test PostgreSQL connection
psql -U postgres -d fureverhome -c "SELECT version();"
```

**Port Already in Use**

```bash
# Backend (port 8080)
# Windows: netstat -ano | findstr :8080
# Linux/Mac: lsof -ti:8080 | xargs kill -9

# Frontend (port 4200)
# Windows: netstat -ano | findstr :4200
# Linux/Mac: lsof -ti:4200 | xargs kill -9
```

**Additional Resources**

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Angular Documentation](https://angular.dev/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

## License

MIT License

## Contributors

- Amar Pajarito - Full Stack Developer
