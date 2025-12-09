from flask import Blueprint, request, jsonify
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from database import get_db

news_bp = Blueprint('news', __name__)

@news_bp.route('/', methods=['GET'])
def get_all_news():
    db = get_db()
    articles = db.execute('SELECT * FROM news ORDER BY created_at DESC').fetchall()
    return jsonify([dict(article) for article in articles])

@news_bp.route('/<int:id>', methods=['GET'])
def get_news(id):
    db = get_db()
    article = db.execute('SELECT * FROM news WHERE id = ?', (id,)).fetchone()
    if article is None:
        return jsonify({'error': 'Article not found'}), 404
    return jsonify(dict(article))

@news_bp.route('/', methods=['POST'])
def create_news():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author = data.get('author', 'Anonymous')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    db = get_db()
    cursor = db.execute(
        'INSERT INTO news (title, content, author) VALUES (?, ?, ?)',
        (title, content, author)
    )
    db.commit()

    return jsonify({'id': cursor.lastrowid, 'message': 'News article created'}), 201

@news_bp.route('/<int:id>', methods=['PUT'])
def update_news(id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author = data.get('author')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    db = get_db()
    db.execute(
        'UPDATE news SET title = ?, content = ?, author = ? WHERE id = ?',
        (title, content, author, id)
    )
    db.commit()

    return jsonify({'message': 'News article updated'})

@news_bp.route('/<int:id>', methods=['DELETE'])
def delete_news(id):
    db = get_db()
    db.execute('DELETE FROM news WHERE id = ?', (id,))
    db.commit()
    return jsonify({'message': 'News article deleted'})
