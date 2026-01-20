# Task Manager Pro

A professional PHP CRUD task management application with user authentication, image uploads, and export capabilities.

## Features

- **User Authentication**
  - Registration with email verification
  - JWT-based login/logout
  - Secure password hashing (bcrypt)

- **Task Management**
  - Create, read, update, delete tasks
  - UUID-based unique identifiers
  - Shareable URLs with slugs
  - Image attachments with auto-resize
  - Priority levels (Low, Medium, High)
  - Categories/tags
  - Due dates with human-readable display

- **Export/Import**
  - Export tasks to PDF
  - Export tasks to CSV
  - Import tasks from CSV

- **Modern UI**
  - Responsive design
  - Smooth animations (Animate.css)
  - Filter by status, priority, category
  - Search functionality

## Tech Stack

- **Backend**: PHP 8.2, Apache
- **Database**: MySQL 8.0
- **ORM**: Eloquent (Laravel's ORM)
- **Templates**: Twig
- **Auth**: Firebase JWT
- **Mail**: PHPMailer + MailHog (dev)
- **Image Processing**: Intervention Image
- **PDF Generation**: DomPDF
- **CSV Handling**: League CSV

## Quick Start

### Prerequisites
- Docker & Docker Compose

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd php-crud
   ```

2. **Start the containers:**
   ```bash
   docker-compose up --build -d
   ```

3. **Wait for containers to be ready** (first run installs dependencies)

4. **Seed the database with demo data:**
   ```bash
   docker exec -it php-crud-php-1 php seeds/run.php
   ```

5. **Access the application:**
   - App: http://localhost:8080
   - phpMyAdmin: http://localhost:8081
   - MailHog: http://localhost:8025

### Demo Credentials
After seeding:
- Email: `demo@example.com`
- Password: `demo123`

## Project Structure

```
php-crud/
├── docker-compose.yml
├── Dockerfile
├── README.md
└── src/
    ├── composer.json
    ├── .env
    ├── .env.example
    ├── public/
    │   ├── index.php          # Entry point / Router
    │   └── .htaccess           # URL rewriting
    ├── config/
    │   ├── app.php             # App configuration
    │   ├── database.php        # Database config
    │   └── bootstrap.php       # Application bootstrap
    ├── models/
    │   ├── User.php            # User Eloquent model
    │   └── Task.php            # Task Eloquent model
    ├── controllers/
    │   ├── AuthController.php  # Authentication logic
    │   └── TaskController.php  # Task CRUD logic
    ├── services/
    │   ├── JWTService.php      # JWT token handling
    │   ├── MailService.php     # Email sending
    │   ├── ImageService.php    # Image processing
    │   └── ExportService.php   # PDF/CSV export
    ├── migrations/
    │   ├── Migration.php       # Migration runner
    │   ├── 001_create_users_table.php
    │   └── 002_create_tasks_table.php
    ├── views/
    │   ├── layout.twig
    │   ├── auth/
    │   │   ├── login.twig
    │   │   └── register.twig
    │   ├── tasks/
    │   │   ├── index.twig
    │   │   ├── create.twig
    │   │   ├── edit.twig
    │   │   └── view.twig
    │   └── errors/
    │       └── 404.twig
    ├── seeds/
    │   ├── DatabaseSeeder.php
    │   └── run.php
    ├── logs/
    └── uploads/
```

## CLI Commands

### Database Seeding
```bash
# Seed with demo data
docker exec -it php-crud-php-1 php seeds/run.php

# Clear and re-seed
docker exec -it php-crud-php-1 php seeds/run.php --fresh
```

### View Logs
```bash
# Application logs
docker exec -it php-crud-php-1 tail -f logs/app.log

# Error logs
docker exec -it php-crud-php-1 tail -f logs/error.log
```

### Composer Commands
```bash
# Install dependencies
docker exec -it php-crud-php-1 composer install

# Update dependencies
docker exec -it php-crud-php-1 composer update

# Dump autoloader
docker exec -it php-crud-php-1 composer dump-autoload
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `APP_NAME` | Application name | Task Manager Pro |
| `APP_ENV` | Environment | development |
| `APP_DEBUG` | Debug mode | true |
| `APP_URL` | Application URL | http://localhost:8080 |
| `DB_HOST` | Database host | db |
| `DB_DATABASE` | Database name | tasks_db |
| `DB_USERNAME` | Database user | root |
| `DB_PASSWORD` | Database password | secret |
| `JWT_SECRET` | JWT signing key | (change in production!) |
| `JWT_EXPIRY` | Token expiry (seconds) | 86400 |
| `MAIL_HOST` | SMTP host | mailhog |
| `MAIL_PORT` | SMTP port | 1025 |

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Dashboard / Task list |
| GET | `/login` | Login page |
| POST | `/login` | Authenticate user |
| GET | `/register` | Registration page |
| POST | `/register` | Create account |
| GET | `/logout` | Logout user |
| GET | `/verify-email` | Verify email |
| GET | `/tasks/create` | New task form |
| POST | `/tasks` | Create task |
| GET | `/tasks/{id}/edit` | Edit task form |
| POST | `/tasks/{id}` | Update task |
| GET | `/tasks/{id}/toggle` | Toggle completion |
| GET | `/tasks/{id}/delete` | Delete task |
| GET | `/export/pdf` | Export to PDF |
| GET | `/export/csv` | Export to CSV |
| POST | `/import` | Import from CSV |
| GET | `/task/{slug}` | Public task view |

## Security Features

- Password hashing with bcrypt
- JWT token authentication (24h expiry)
- CSRF protection on forms
- XSS prevention (htmlspecialchars)
- SQL injection prevention (Eloquent ORM)
- Input validation (Respect/Validation)
- Secure cookie settings

## Production Deployment

1. Update `.env` with production values:
   - Set `APP_DEBUG=false`
   - Change `JWT_SECRET` to a secure random string
   - Update database credentials
   - Configure real SMTP server

2. Enable Twig caching in `config/bootstrap.php`

3. Use HTTPS in production

4. Set proper file permissions:
   ```bash
   chmod 755 uploads logs
   chown -R www-data:www-data uploads logs
   ```

## License

MIT License
