import ollama

# 1. Simple generate (like a completion)
print("--- Generating... ---")
response = ollama.generate(model='llama3.2', prompt='Why is the sky blue?')
print(response['response'])

# 2. Chat (like ChatGPT, with memory context)
print("\n--- Chatting... ---")
response = ollama.chat(model='llama3.2', messages=[
  {
    'role': 'user',
    'content': 'Write a single sentence tagline for a used laptop marketplace.'
  },
])
print(response['message']['content'])