"""
Flask Application Factory.

This module contains the create_app factory function that:
- Creates and configures a Flask application instance
- Initializes extensions with the app
- Registers blueprints
- Sets up error handlers
"""

import os
from flask import Flask

from .config import config_map
from .extensions import db, migrate, jwt, cors


def create_app(config_name=None):
    """
    Application factory for creating Flask app instances.

    Args:
        config_name: Configuration name ('dev', 'test', 'prod').
                    Defaults to FLASK_ENV environment variable or 'dev'.

    Returns:
        Configured Flask application instance.
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'dev')

    app = Flask(__name__)

    # Load configuration
    config_class = config_map.get(config_name, config_map['dev'])
    app.config.from_object(config_class)

    # Initialize extensions
    _init_extensions(app)

    # Register blueprints
    _register_blueprints(app)

    # Register error handlers
    _register_error_handlers(app)

    return app


def _init_extensions(app):
    """Initialize Flask extensions with the app instance."""
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    cors.init_app(app, resources={r"/api/*": {"origins": "*"}})


def _register_blueprints(app):
    """Register application blueprints."""
    from .api import register_blueprints
    register_blueprints(app)


def _register_error_handlers(app):
    """Register error handlers for the application."""

    @app.errorhandler(404)
    def not_found(error):
        return {'error': 'Not found'}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {'error': 'Internal server error'}, 500
