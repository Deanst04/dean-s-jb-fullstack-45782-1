"""
Flask extensions instantiated without app (lazy initialization).

Extensions are initialized here without the app instance,
then bound to the app later via init_app() in the factory.
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS

# Database ORM
db = SQLAlchemy()

# Database migrations
migrate = Migrate()

# JWT authentication
jwt = JWTManager()

# Cross-Origin Resource Sharing
cors = CORS()
