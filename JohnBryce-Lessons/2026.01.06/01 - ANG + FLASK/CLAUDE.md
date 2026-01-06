# PROJECT BUILD CONTRACT (CLAUDE.md)

This file defines the permanent build rules for this project.
Claude Code MUST follow these rules at all times.

------------------------------------------------------------

# PROJECT OVERVIEW

We are building a full-stack **Angular + Flask e-commerce platform**.

Structure:

frontend/   → Angular + Tailwind UI  
backend/    → Flask + PostgreSQL API  

The backend uses:
- Flask Application Factory Pattern
- SQLAlchemy ORM
- Flask-Migrate migrations
- PostgreSQL database
- Environment-based configuration
- Virtual environment in backend/venv

------------------------------------------------------------

# CURRENT BUILD PHASE

CURRENT PHASE: **PHASE 1 – FOUNDATION (Backend Only)**

Do NOT implement frontend features in this phase.

------------------------------------------------------------

# GLOBAL BUILD RULES

- NEVER touch frontend/ unless explicitly allowed.
- Keep all code minimal and clean.
- Do NOT over-engineer.
- Follow the layered backend architecture strictly:
  
  Route → Service → Repository → Model

------------------------------------------------------------

# PHASE 1 – REQUIRED OUTPUT

Claude Code MUST implement ONLY the following:

### 1️⃣ BaseModel
- Abstract SQLAlchemy model
- Provides:
  - id (primary key)
  - created_at
  - updated_at

### 2️⃣ BaseRepository (generic)
- CRUD operations:
  - get_by_id
  - get_all
  - create
  - update
  - delete
- Must use `flush()` – NOT commit()

### 3️⃣ Global Error Handling
- Custom API exception base class
- Error subclasses:
  - NotFoundError
  - ValidationError
  - UnauthorizedError
  - ForbiddenError
  - ConflictError
- Flask error handlers returning JSON in this shape:

```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message"
  }
}