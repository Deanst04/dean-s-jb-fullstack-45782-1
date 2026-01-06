"""
API Blueprint Registration.

This module provides a central place to register all API blueprints.
"""


def register_blueprints(app):
    """
    Register all API blueprints with the Flask application.

    Args:
        app: Flask application instance.
    """
    # Health check route for testing
    @app.route('/api/health')
    def health_check():
        return {'status': 'healthy', 'message': 'API is running'}

    # Register additional blueprints here as they are created
    # Example:
    # from .products import products_bp
    # app.register_blueprint(products_bp, url_prefix='/api/products')
