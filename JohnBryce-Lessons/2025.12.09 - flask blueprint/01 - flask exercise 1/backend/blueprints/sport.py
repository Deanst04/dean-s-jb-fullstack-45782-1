from flask import Blueprint, request, jsonify
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from database import get_db

sport_bp = Blueprint('sport', __name__)

@sport_bp.route('/', methods=['GET'])
def get_all_sport():
    db = get_db()
    articles = db.execute('SELECT * FROM sport ORDER BY created_at DESC').fetchall()
    return jsonify([dict(article) for article in articles])

@sport_bp.route('/<int:id>', methods=['GET'])
def get_sport(id):
    db = get_db()
    article = db.execute('SELECT * FROM sport WHERE id = ?', (id,)).fetchone()
    if article is None:
        return jsonify({'error': 'Article not found'}), 404
    return jsonify(dict(article))

@sport_bp.route('/', methods=['POST'])
def create_sport():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author = data.get('author', 'Anonymous')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    db = get_db()
    cursor = db.execute(
        'INSERT INTO sport (title, content, author) VALUES (?, ?, ?)',
        (title, content, author)
    )
    db.commit()

    return jsonify({'id': cursor.lastrowid, 'message': 'Sport article created'}), 201

@sport_bp.route('/<int:id>', methods=['PUT'])
def update_sport(id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author = data.get('author')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    db = get_db()
    db.execute(
        'UPDATE sport SET title = ?, content = ?, author = ? WHERE id = ?',
        (title, content, author, id)
    )
    db.commit()

    return jsonify({'message': 'Sport article updated'})

@sport_bp.route('/<int:id>', methods=['DELETE'])
def delete_sport(id):
    db = get_db()
    db.execute('DELETE FROM sport WHERE id = ?', (id,))
    db.commit()
    return jsonify({'message': 'Sport article deleted'})
