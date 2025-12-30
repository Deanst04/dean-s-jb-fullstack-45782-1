from flask import Flask, request, render_template_string, redirect
import redis
import json
import threading

app = Flask(__name__)

# --- CONFIGURATION ---
r = redis.Redis(host='localhost', port=6379, decode_responses=True)

# --- BACKGROUND LISTENER (The Ears 👂) ---
def listen_to_redis():
    """
    This runs in a background thread so it doesn't block Flask.
    It listens to the 'global_chat' channel.
    """
    pubsub = r.pubsub()
    pubsub.subscribe('global_chat')
    
    print("🎧 Python Background Listener Started...")
    
    for message in pubsub.listen():
        if message['type'] == 'message':
            try:
                # Parse JSON
                data = json.loads(message['data'])
                print(f"\n💬 [INCOMING MESSAGE]")
                print(f"👤 User: {data.get('username')}")
                print(f"📝 Text: {data.get('text')}")
                print("-" * 20 + "\n")
            except:
                pass

# Start the listener in a background thread
listener_thread = threading.Thread(target=listen_to_redis, daemon=True)
listener_thread.start()


# --- ROUTES ---

@app.route('/', methods=['GET'])
def home():
    html = """
    <div style="font-family: sans-serif; text-align: center; padding: 50px; background: #fff3e0;">
        <h1>Python Chat Client 🐍</h1>
        <p>Check your terminal to see incoming messages from Node.js!</p>
        
        <div style="background: white; padding: 30px; border-radius: 15px; display: inline-block; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <h3>Send a Message:</h3>
            <form action="/send" method="POST">
                <input type="text" name="username" placeholder="Your Name" required style="padding: 10px; margin-bottom: 10px; width: 100%; box-sizing: border-box;"><br>
                <input type="text" name="message" placeholder="Message..." required style="padding: 10px; margin-bottom: 10px; width: 100%; box-sizing: border-box;"><br>
                <button type="submit" style="background: #e65100; color: white; padding: 10px 20px; border: none; cursor: pointer; width: 100%;">Send to Chat</button>
            </form>
        </div>
    </div>
    """
    return render_template_string(html)

@app.route('/send', methods=['POST'])
def send_message():
    username = request.form.get('username')
    text = request.form.get('message')
    
    if username and text:
        # Create object
        chat_data = {
            "username": username,
            "text": text,
            "from": "Python"
        }
        
        # Convert to JSON string and Publish
        r.publish('global_chat', json.dumps(chat_data))
        print(f"📤 Sent message as {username}")
    
    return redirect('/')

# --- RUN ---
if __name__ == '__main__':
    app.run(port=5000, debug=True, use_reloader=False) 
    # use_reloader=False is important when using threads to avoid running the thread twice!