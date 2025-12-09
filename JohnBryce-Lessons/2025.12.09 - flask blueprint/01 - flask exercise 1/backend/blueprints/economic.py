from flask import Blueprint, request, jsonify
import sys
from pathlib import Path
sys.path.append(str(Path(__file__).parent.parent))
from database import get_db

economic_bp = Blueprint('economic', __name__)

@economic_bp.route('/', methods=['GET'])
def get_all_economic():
    db = get_db()
    articles = db.execute('SELECT * FROM economic ORDER BY created_at DESC').fetchall()
    return jsonify([dict(article) for article in articles])

@economic_bp.route('/<int:id>', methods=['GET'])
def get_economic(id):
    db = get_db()
    article = db.execute('SELECT * FROM economic WHERE id = ?', (id,)).fetchone()
    if article is None:
        return jsonify({'error': 'Article not found'}), 404
    return jsonify(dict(article))

@economic_bp.route('/', methods=['POST'])
def create_economic():
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author = data.get('author', 'Anonymous')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    db = get_db()
    cursor = db.execute(
        'INSERT INTO economic (title, content, author) VALUES (?, ?, ?)',
        (title, content, author)
    )
    db.commit()

    return jsonify({'id': cursor.lastrowid, 'message': 'Economic article created'}), 201

@economic_bp.route('/<int:id>', methods=['PUT'])
def update_economic(id):
    data = request.get_json()
    title = data.get('title')
    content = data.get('content')
    author = data.get('author')

    if not title or not content:
        return jsonify({'error': 'Title and content are required'}), 400

    db = get_db()
    db.execute(
        'UPDATE economic SET title = ?, content = ?, author = ? WHERE id = ?',
        (title, content, author, id)
    )
    db.commit()

    return jsonify({'message': 'Economic article updated'})

@economic_bp.route('/<int:id>', methods=['DELETE'])
def delete_economic(id):
    db = get_db()
    db.execute('DELETE FROM economic WHERE id = ?', (id,))
    db.commit()
    return jsonify({'message': 'Economic article deleted'})
