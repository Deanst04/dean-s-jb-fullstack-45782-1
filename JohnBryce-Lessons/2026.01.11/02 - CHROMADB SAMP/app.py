"""
Terminal-based Chat Application with Long-Term Memory
Uses Ollama for LLM and embeddings, ChromaDB for persistent memory storage.
"""

import requests
import chromadb
import uuid
from datetime import datetime


# =============================================================================
# CONFIGURATION
# =============================================================================

OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_MODEL = "llama3.2"
CHROMA_DB_PATH = "./chroma_db"  # Local folder for persistent storage
COLLECTION_NAME = "chat_memory"
TOP_K_RESULTS = 3  # Number of similar past messages to retrieve


# =============================================================================
# OLLAMA API FUNCTIONS
# =============================================================================

def get_embedding(text: str) -> list[float]:
    """
    Generate an embedding vector for the given text using Ollama's embeddings API.

    Args:
        text: The text to generate an embedding for

    Returns:
        A list of floats representing the embedding vector
    """
    url = f"{OLLAMA_BASE_URL}/api/embeddings"
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": text
    }

    response = requests.post(url, json=payload)
    response.raise_for_status()  # Raise exception if request failed

    return response.json()["embedding"]


def generate_response(prompt: str) -> str:
    """
    Generate a text response from Ollama given a prompt.

    Args:
        prompt: The full prompt to send to the LLM

    Returns:
        The generated text response
    """
    url = f"{OLLAMA_BASE_URL}/api/generate"
    payload = {
        "model": OLLAMA_MODEL,
        "prompt": prompt,
        "stream": False  # Get complete response at once
    }

    response = requests.post(url, json=payload)
    response.raise_for_status()

    return response.json()["response"]


# =============================================================================
# CHROMADB FUNCTIONS
# =============================================================================

def initialize_chromadb() -> chromadb.Collection:
    """
    Initialize ChromaDB with persistent storage and get or create the chat memory collection.

    Returns:
        The ChromaDB collection for storing chat messages
    """
    # Create a persistent client that stores data in the specified folder
    client = chromadb.PersistentClient(path=CHROMA_DB_PATH)

    # Get or create the collection for chat memory
    # If collection exists, it will be loaded; otherwise, a new one is created
    collection = client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "Chat conversation memory storage"}
    )

    print(f"[System] ChromaDB initialized. Collection '{COLLECTION_NAME}' has {collection.count()} stored messages.")

    return collection


def query_similar_messages(collection: chromadb.Collection, query_embedding: list[float], n_results: int = TOP_K_RESULTS) -> list[dict]:
    """
    Query ChromaDB for the most similar past messages based on embedding similarity.

    Args:
        collection: The ChromaDB collection to query
        query_embedding: The embedding vector to find similar messages for
        n_results: Number of similar results to return

    Returns:
        A list of dictionaries containing similar messages and their metadata
    """
    # Handle empty collection gracefully
    if collection.count() == 0:
        return []

    # Adjust n_results if collection has fewer items
    actual_n = min(n_results, collection.count())

    # Query the collection using the embedding vector
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=actual_n,
        include=["documents", "metadatas"]  # Include the text and metadata
    )

    # Format results into a more usable structure
    similar_messages = []
    if results["documents"] and results["documents"][0]:
        for i, doc in enumerate(results["documents"][0]):
            similar_messages.append({
                "text": doc,
                "metadata": results["metadatas"][0][i] if results["metadatas"] else {}
            })

    return similar_messages


def store_message(collection: chromadb.Collection, text: str, role: str, embedding: list[float]) -> None:
    """
    Store a message in ChromaDB with its embedding and metadata.

    Args:
        collection: The ChromaDB collection to store in
        text: The message text
        role: Either "user" or "assistant"
        embedding: The embedding vector for the message
    """
    # Generate a unique ID for this message
    message_id = str(uuid.uuid4())

    # Create metadata to store additional information about the message
    metadata = {
        "role": role,
        "timestamp": datetime.now().isoformat()
    }

    # Add the message to the collection
    collection.add(
        ids=[message_id],
        documents=[text],
        embeddings=[embedding],
        metadatas=[metadata]
    )


# =============================================================================
# PROMPT BUILDING
# =============================================================================

def build_prompt(user_message: str, similar_messages: list[dict]) -> str:
    """
    Build a prompt that includes relevant past context and the current user question.

    Args:
        user_message: The current user's question/message
        similar_messages: List of similar past messages from ChromaDB

    Returns:
        A formatted prompt string for the LLM
    """
    prompt_parts = []

    # Add relevant past context section if we have similar messages
    if similar_messages:
        prompt_parts.append("=== Relevant Past Context ===")
        for i, msg in enumerate(similar_messages, 1):
            role = msg["metadata"].get("role", "unknown")
            prompt_parts.append(f"{i}. [{role}]: {msg['text']}")
        prompt_parts.append("")  # Empty line for separation

    # Add the current user question
    prompt_parts.append("=== Current Question ===")
    prompt_parts.append(user_message)
    prompt_parts.append("")

    # Add instruction for the assistant
    prompt_parts.append("=== Instructions ===")
    prompt_parts.append("Based on any relevant context above (if available), please respond to the current question. If the context is not relevant, you may ignore it.")

    return "\n".join(prompt_parts)


# =============================================================================
# MAIN CHAT LOOP
# =============================================================================

def main():
    """
    Main function that runs the chat application loop.
    """
    print("=" * 60)
    print("  Chat Application with Long-Term Memory")
    print("  Using Ollama (llama3.2) + ChromaDB")
    print("=" * 60)
    print("Type 'exit' to quit.\n")

    # Step 1: Initialize ChromaDB and load/create the collection
    try:
        collection = initialize_chromadb()
    except Exception as e:
        print(f"[Error] Failed to initialize ChromaDB: {e}")
        return

    # Step 2: Run the continuous chat loop
    while True:
        # Get user input
        try:
            user_input = input("\nYou: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\n[System] Goodbye!")
            break

        # Check for exit command
        if user_input.lower() == "exit":
            print("[System] Goodbye!")
            break

        # Skip empty inputs
        if not user_input:
            print("[System] Please enter a message.")
            continue

        try:
            # Step 3a: Generate embedding for the user input
            print("[System] Generating embedding for your message...")
            user_embedding = get_embedding(user_input)

            # Step 3b: Query ChromaDB for similar past messages
            similar_messages = query_similar_messages(collection, user_embedding)
            if similar_messages:
                print(f"[System] Found {len(similar_messages)} relevant past message(s) for context.")

            # Step 3c: Build the prompt with context and current question
            prompt = build_prompt(user_input, similar_messages)

            # Step 3d: Send prompt to Ollama and get response
            print("[System] Generating response...")
            assistant_response = generate_response(prompt)

            # Step 4: Print the response
            print(f"\nAssistant: {assistant_response}")

            # Step 5: Store both messages in ChromaDB
            # Store user message (we already have its embedding)
            store_message(collection, user_input, "user", user_embedding)

            # Generate embedding for assistant response and store it
            assistant_embedding = get_embedding(assistant_response)
            store_message(collection, assistant_response, "assistant", assistant_embedding)

            print(f"[System] Messages stored in memory. Total messages: {collection.count()}")

        except requests.exceptions.ConnectionError:
            print("[Error] Cannot connect to Ollama. Make sure it's running on http://localhost:11434")
        except requests.exceptions.HTTPError as e:
            print(f"[Error] Ollama API error: {e}")
        except Exception as e:
            print(f"[Error] An unexpected error occurred: {e}")


# =============================================================================
# ENTRY POINT
# =============================================================================

if __name__ == "__main__":
    main()
