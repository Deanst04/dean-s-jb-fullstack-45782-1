import requests

def ask_ollama(prompt: str) -> str:
    response = requests.post(
        "http://localhost:11434/api/generate",
        json={
            "model": "llama3.2",
            "prompt": prompt,
            "stream": False
        }
    )

    return response.json()["response"]

print("🟢 Ollama chat started. Type 'exit' to quit.\n")

while True:
    user_input = input("You: ")

    if user_input.lower() in ("exit", "quit"):
        print("👋 Bye!")
        break

    answer = ask_ollama(user_input)
    print(f"\nOllama: {answer}\n")