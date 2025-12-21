from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
import os
from dotenv import load_dotenv
from models import db, Conversation

app = Flask(__name__)
CORS(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///culinary.db'
db.init_app(app)

with app.app_context():
    db.create_all()

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

# FIX: Use the model confirmed in your list
def get_ai_response(prompt):
    response = client.models.generate_content(
        model="gemini-2.5-flash", 
        contents=prompt
    )
    return response.text

@app.route('/')
def home():
    return "Server is running!"

@app.route('/api/ask', methods=['POST'])
def ask():
    # 1. Get JSON data from request
    data = request.get_json()
    
    # 2. Extract the question
    question = data.get('question')
    
    existing = Conversation.query.filter_by(question=question).first()

    if existing:
        answer = existing.answer
    else:
        answer = get_ai_response(f"You are a professional chef. Answer this cooking question: {question}") or ""
        new_conversation = Conversation(question=question, answer=answer)
        db.session.add(new_conversation)
        db.session.commit()  
    
    # 4. Return JSON response
    return jsonify({
        "question": question,
        "answer": answer,
        "cached": existing is not None
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)