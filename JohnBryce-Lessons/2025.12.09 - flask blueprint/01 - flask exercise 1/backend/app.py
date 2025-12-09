from flask import Flask
from flask_cors import CORS
from database import init_db
from blueprints.news import news_bp
from blueprints.sport import sport_bp
from blueprints.economic import economic_bp

def create_app():
    app = Flask(__name__)
    app.config['DATABASE'] = 'articles.db'
    CORS(app)

    # Initialize database
    with app.app_context():
        init_db()

    # Register blueprints
    app.register_blueprint(news_bp, url_prefix='/api/news')
    app.register_blueprint(sport_bp, url_prefix='/api/sport')
    app.register_blueprint(economic_bp, url_prefix='/api/economic')

    @app.route('/')
    def index():
        return {'message': 'Flask API with News, Sport, and Economic blueprints'}

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
