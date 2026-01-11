#!/usr/bin/env python3
"""
RAG (Retrieval Augmented Generation) CLI Application
=====================================================
This application answers questions based on the contents of a PDF file.

How it works:
1. INDEXING: Load PDF -> Extract text -> Split into chunks -> Generate embeddings -> Store in ChromaDB
2. QUERYING: User question -> Generate embedding -> Find similar chunks -> Build prompt -> Get LLM answer

Dependencies: requests, chromadb, pypdf, edge_tts
LLM Backend: Ollama (llama3.2)
Audio Output: edge_tts (Microsoft Edge TTS)
"""

import os
import sys
import asyncio  # For running async edge_tts functions
from datetime import datetime
from typing import Optional

# ---------------------------------------------------------------------------
# External Dependencies
# ---------------------------------------------------------------------------
import requests  # For making HTTP requests to Ollama API
import chromadb  # Vector database for storing and searching embeddings
from pypdf import PdfReader  # For extracting text from PDF files
import edge_tts  # For text-to-speech audio generation (Microsoft Edge TTS)

# ---------------------------------------------------------------------------
# Configuration Constants
# ---------------------------------------------------------------------------

# Ollama API settings
OLLAMA_BASE_URL = "http://localhost:11434"
OLLAMA_EMBEDDINGS_URL = f"{OLLAMA_BASE_URL}/api/embeddings"
OLLAMA_GENERATE_URL = f"{OLLAMA_BASE_URL}/api/generate"
OLLAMA_MODEL = "llama3.2"

# ChromaDB settings
CHROMA_DB_PATH = "./chroma_db"  # Where to persist the vector database
COLLECTION_NAME = "pdf_rag"     # Name of our collection in ChromaDB

# Text chunking settings
CHUNK_SIZE = 1000       # Target size for each chunk (characters)
CHUNK_OVERLAP = 150     # Overlap between consecutive chunks (helps maintain context)

# RAG retrieval settings
TOP_K_RESULTS = 5       # Number of relevant chunks to retrieve for each query

# Default PDF path
DEFAULT_PDF_PATH = "./docs/input.pdf"

# ---------------------------------------------------------------------------
# Audio Output Settings (edge_tts)
# ---------------------------------------------------------------------------

# Directory where audio files will be saved
AUDIO_OUTPUT_DIR = "./output/audio"

# Default filename for the generated audio
AUDIO_OUTPUT_FILE = "answer.mp3"

# Full path to the audio file (constructed from directory + filename)
AUDIO_OUTPUT_PATH = os.path.join(AUDIO_OUTPUT_DIR, AUDIO_OUTPUT_FILE)

# Default TTS voice - using a multilingual voice that handles many languages well
# edge_tts automatically detects language from text and uses appropriate pronunciation
# See all available voices by running: edge-tts --list-voices
TTS_VOICE = "en-US-AriaNeural"  # A natural-sounding multilingual voice


# ---------------------------------------------------------------------------
# Ollama API Functions
# ---------------------------------------------------------------------------

def get_embedding(text: str) -> Optional[list[float]]:
    """
    Generate an embedding vector for the given text using Ollama's embeddings API.

    An embedding is a numerical representation of text that captures its semantic meaning.
    Similar texts will have similar embeddings (close in vector space).

    Args:
        text: The text to generate an embedding for

    Returns:
        A list of floats representing the embedding vector, or None if failed
    """
    try:
        # Make POST request to Ollama embeddings endpoint
        response = requests.post(
            OLLAMA_EMBEDDINGS_URL,
            json={
                "model": OLLAMA_MODEL,  # Which model to use for embeddings
                "prompt": text          # The text to embed
            },
            timeout=60  # Timeout after 60 seconds
        )

        # Check if request was successful
        response.raise_for_status()

        # Parse JSON response and extract the embedding
        result = response.json()
        return result.get("embedding")

    except requests.exceptions.ConnectionError:
        print(f"ERROR: Cannot connect to Ollama at {OLLAMA_BASE_URL}")
        print("Make sure Ollama is running: ollama serve")
        return None
    except requests.exceptions.Timeout:
        print("ERROR: Request to Ollama timed out")
        return None
    except Exception as e:
        print(f"ERROR generating embedding: {e}")
        return None


def generate_answer(prompt: str) -> Optional[str]:
    """
    Generate a text response from the LLM using Ollama's generate API.

    Args:
        prompt: The full prompt to send to the LLM (includes context and question)

    Returns:
        The generated text response, or None if failed
    """
    try:
        # Make POST request to Ollama generate endpoint
        response = requests.post(
            OLLAMA_GENERATE_URL,
            json={
                "model": OLLAMA_MODEL,
                "prompt": prompt,
                "stream": False  # Get complete response at once (not streaming)
            },
            timeout=120  # LLM generation can take longer, so higher timeout
        )

        response.raise_for_status()

        # Parse JSON response and extract the generated text
        result = response.json()
        return result.get("response", "")

    except requests.exceptions.ConnectionError:
        print(f"ERROR: Cannot connect to Ollama at {OLLAMA_BASE_URL}")
        print("Make sure Ollama is running: ollama serve")
        return None
    except requests.exceptions.Timeout:
        print("ERROR: LLM generation timed out")
        return None
    except Exception as e:
        print(f"ERROR generating answer: {e}")
        return None


# ---------------------------------------------------------------------------
# Audio Output Functions (edge_tts)
# ---------------------------------------------------------------------------

async def _generate_audio_async(text: str, output_path: str, voice: str) -> bool:
    """
    Internal async function to generate audio using edge_tts.

    edge_tts is an async library, so we need this helper function
    that will be called via asyncio.run() from the sync wrapper.

    Args:
        text: The text to convert to speech
        output_path: Where to save the audio file
        voice: The TTS voice to use

    Returns:
        True if audio generation succeeded, False otherwise
    """
    try:
        # Create a Communicate object with the text and voice
        # edge_tts handles language detection automatically based on text content
        communicate = edge_tts.Communicate(text, voice)

        # Save the audio to the specified path
        await communicate.save(output_path)
        return True

    except Exception as e:
        print(f"ERROR in async TTS generation: {e}")
        return False


def generate_audio(text: str, output_path: str = AUDIO_OUTPUT_PATH) -> bool:
    """
    Generate an audio file from text using edge_tts (Microsoft Edge Text-to-Speech).

    This is the synchronous wrapper around the async edge_tts library.
    The audio file is saved locally and NOT auto-played.

    Args:
        text: The text to convert to speech
        output_path: Where to save the audio file (default: ./output/audio/answer.mp3)

    Returns:
        True if audio generation succeeded, False otherwise
    """
    # Ensure the output directory exists
    output_dir = os.path.dirname(output_path)
    if output_dir:
        os.makedirs(output_dir, exist_ok=True)

    try:
        # Run the async TTS function using asyncio
        # This bridges the sync main code with the async edge_tts library
        success = asyncio.run(_generate_audio_async(text, output_path, TTS_VOICE))

        if success:
            print(f"  Audio saved to: {output_path}")
            print("  (Use /play to listen to the audio)")

        return success

    except Exception as e:
        print(f"ERROR generating audio: {e}")
        return False


def play_audio(audio_path: str = AUDIO_OUTPUT_PATH) -> bool:
    """
    Play the generated audio file using the system's default audio player.

    This function is called when the user explicitly requests playback
    via the /play command. Audio is NEVER auto-played.

    Args:
        audio_path: Path to the audio file to play

    Returns:
        True if playback started successfully, False otherwise
    """
    # Check if the audio file exists
    if not os.path.exists(audio_path):
        print(f"ERROR: Audio file not found: {audio_path}")
        print("Generate an answer first to create an audio file.")
        return False

    try:
        # Use platform-specific commands to play audio
        # This opens the file with the system's default audio player
        import platform
        system = platform.system()

        if system == "Darwin":  # macOS
            os.system(f'open "{audio_path}"')
        elif system == "Windows":
            os.system(f'start "" "{audio_path}"')
        elif system == "Linux":
            # Try common Linux audio players
            os.system(f'xdg-open "{audio_path}" 2>/dev/null || mpv "{audio_path}" 2>/dev/null || mplayer "{audio_path}" 2>/dev/null')
        else:
            print(f"Unsupported platform: {system}")
            print(f"Please manually open: {audio_path}")
            return False

        print(f"Playing audio: {audio_path}")
        return True

    except Exception as e:
        print(f"ERROR playing audio: {e}")
        return False


# ---------------------------------------------------------------------------
# PDF Processing Functions
# ---------------------------------------------------------------------------

def extract_text_from_pdf(pdf_path: str) -> list[tuple[int, str]]:
    """
    Extract text from all pages of a PDF file.

    Args:
        pdf_path: Path to the PDF file

    Returns:
        List of tuples: (page_number, page_text)
        Page numbers are 1-indexed for human readability
    """
    # Check if file exists
    if not os.path.exists(pdf_path):
        print(f"ERROR: PDF file not found: {pdf_path}")
        return []

    try:
        # Open and read the PDF
        reader = PdfReader(pdf_path)
        pages_text = []

        # Iterate through all pages (enumerate starts at 0, so we add 1 for human-readable page numbers)
        for page_num, page in enumerate(reader.pages, start=1):
            text = page.extract_text()

            # Only include pages that have actual text content
            if text and text.strip():
                pages_text.append((page_num, text))

        return pages_text

    except Exception as e:
        print(f"ERROR reading PDF: {e}")
        return []


def split_text_into_chunks(
    pages_text: list[tuple[int, str]],
    chunk_size: int = CHUNK_SIZE,
    overlap: int = CHUNK_OVERLAP
) -> list[dict]:
    """
    Split extracted PDF text into overlapping chunks for better retrieval.

    Why chunking?
    - LLMs have context limits, so we can't send entire documents
    - Smaller chunks allow more precise retrieval
    - Overlap ensures we don't lose context at chunk boundaries

    Args:
        pages_text: List of (page_number, text) tuples from PDF extraction
        chunk_size: Target size for each chunk in characters
        overlap: Number of characters to overlap between consecutive chunks

    Returns:
        List of chunk dictionaries with text and metadata
    """
    chunks = []
    chunk_index = 0

    # First, combine all text while tracking page boundaries
    # We'll create a list of (char_position, page_number) to track which page each character came from
    full_text = ""
    char_to_page = []  # Maps character position to page number

    for page_num, page_text in pages_text:
        start_pos = len(full_text)
        full_text += page_text + "\n"  # Add newline between pages

        # Record page number for each character position in this page
        for _ in range(len(page_text) + 1):  # +1 for the newline
            char_to_page.append(page_num)

    # Now split the combined text into overlapping chunks
    text_length = len(full_text)
    start = 0

    while start < text_length:
        # Calculate end position for this chunk
        end = min(start + chunk_size, text_length)

        # Try to end at a sentence boundary (period, question mark, exclamation)
        # This helps maintain semantic coherence in chunks
        if end < text_length:
            # Look for sentence boundaries in the last 20% of the chunk
            search_start = start + int(chunk_size * 0.8)
            best_break = end

            for i in range(end, search_start, -1):
                if i < text_length and full_text[i-1] in '.!?\n':
                    best_break = i
                    break

            end = best_break

        # Extract the chunk text
        chunk_text = full_text[start:end].strip()

        # Skip empty chunks
        if not chunk_text:
            start = end - overlap if end - overlap > start else end
            continue

        # Determine which pages this chunk spans
        chunk_start_page = char_to_page[start] if start < len(char_to_page) else char_to_page[-1]
        chunk_end_page = char_to_page[min(end-1, len(char_to_page)-1)]

        # Create page reference string
        if chunk_start_page == chunk_end_page:
            page_ref = f"page {chunk_start_page}"
        else:
            page_ref = f"pages {chunk_start_page}-{chunk_end_page}"

        # Create chunk dictionary with text and metadata
        chunks.append({
            "text": chunk_text,
            "chunk_index": chunk_index,
            "page_ref": page_ref,
            "start_page": chunk_start_page,
            "end_page": chunk_end_page
        })

        chunk_index += 1

        # Move start position forward, accounting for overlap
        # Overlap helps ensure context isn't lost at chunk boundaries
        start = end - overlap if end - overlap > start else end

    return chunks


# ---------------------------------------------------------------------------
# ChromaDB Functions
# ---------------------------------------------------------------------------

def get_chroma_client() -> chromadb.PersistentClient:
    """
    Create and return a persistent ChromaDB client.

    Persistent means the data is saved to disk and survives program restarts.
    """
    # Create the directory if it doesn't exist
    os.makedirs(CHROMA_DB_PATH, exist_ok=True)

    # Create persistent client - data stored at CHROMA_DB_PATH
    return chromadb.PersistentClient(path=CHROMA_DB_PATH)


def get_or_create_collection(client: chromadb.PersistentClient) -> chromadb.Collection:
    """
    Get existing collection or create a new one.

    A collection in ChromaDB is like a table in a database - it stores
    documents, their embeddings, and metadata.
    """
    # get_or_create_collection: returns existing if found, creates new if not
    return client.get_or_create_collection(
        name=COLLECTION_NAME,
        metadata={"description": "PDF RAG collection for question answering"}
    )


def clear_collection(client: chromadb.PersistentClient) -> chromadb.Collection:
    """
    Delete and recreate the collection (for reindexing).
    """
    try:
        client.delete_collection(name=COLLECTION_NAME)
        print(f"Cleared existing collection: {COLLECTION_NAME}")
    except Exception:
        pass  # Collection might not exist, that's okay

    return get_or_create_collection(client)


def index_pdf(pdf_path: str, client: chromadb.PersistentClient, force_reindex: bool = False) -> bool:
    """
    Index a PDF file into ChromaDB for later retrieval.

    This is the "indexing step" of RAG:
    1. Extract text from PDF
    2. Split into chunks
    3. Generate embeddings for each chunk
    4. Store in vector database

    Args:
        pdf_path: Path to the PDF file
        client: ChromaDB client
        force_reindex: If True, clear existing data before indexing

    Returns:
        True if indexing succeeded, False otherwise
    """
    print(f"\n{'='*60}")
    print(f"INDEXING PDF: {pdf_path}")
    print(f"{'='*60}")

    # Step 1: Get or clear the collection
    if force_reindex:
        collection = clear_collection(client)
    else:
        collection = get_or_create_collection(client)

    # Step 2: Extract text from PDF
    print("\n[1/4] Extracting text from PDF...")
    pages_text = extract_text_from_pdf(pdf_path)

    if not pages_text:
        print("ERROR: No text extracted from PDF. Is the file valid?")
        return False

    print(f"      Extracted text from {len(pages_text)} pages")

    # Step 3: Split text into chunks
    print("\n[2/4] Splitting text into chunks...")
    chunks = split_text_into_chunks(pages_text)

    if not chunks:
        print("ERROR: No chunks created. PDF might have very little text.")
        return False

    print(f"      Created {len(chunks)} chunks")

    # Step 4: Generate embeddings and store in ChromaDB
    print("\n[3/4] Generating embeddings and storing in ChromaDB...")
    print("      (This may take a while depending on the PDF size)")

    # Get the PDF filename for metadata
    pdf_filename = os.path.basename(pdf_path)
    created_at = datetime.now().isoformat()

    # Process chunks one by one (could be batched for performance)
    success_count = 0
    for i, chunk in enumerate(chunks):
        # Generate embedding for this chunk
        embedding = get_embedding(chunk["text"])

        if embedding is None:
            print(f"      WARNING: Failed to generate embedding for chunk {i}")
            continue

        # Create unique ID for this chunk
        chunk_id = f"{pdf_filename}_chunk_{chunk['chunk_index']}"

        # Store in ChromaDB
        # - ids: unique identifier for each document
        # - documents: the actual text content
        # - embeddings: the vector representation
        # - metadatas: additional information about each document
        collection.add(
            ids=[chunk_id],
            documents=[chunk["text"]],
            embeddings=[embedding],
            metadatas=[{
                "source_pdf": pdf_filename,
                "page_ref": chunk["page_ref"],
                "start_page": chunk["start_page"],
                "end_page": chunk["end_page"],
                "chunk_index": chunk["chunk_index"],
                "created_at": created_at
            }]
        )

        success_count += 1

        # Print progress every 5 chunks
        if (i + 1) % 5 == 0 or i == len(chunks) - 1:
            print(f"      Progress: {i + 1}/{len(chunks)} chunks processed")

    # Step 5: Summary
    print(f"\n[4/4] Indexing complete!")
    print(f"      - Pages extracted: {len(pages_text)}")
    print(f"      - Chunks created: {len(chunks)}")
    print(f"      - Chunks stored: {success_count}")
    print(f"{'='*60}\n")

    return success_count > 0


# ---------------------------------------------------------------------------
# Query Functions
# ---------------------------------------------------------------------------

def query_similar_chunks(
    question: str,
    collection: chromadb.Collection,
    top_k: int = TOP_K_RESULTS
) -> list[dict]:
    """
    Find the most relevant chunks for a given question.

    This is the "retrieval" part of RAG:
    1. Convert question to embedding
    2. Find chunks with similar embeddings in the database

    Args:
        question: The user's question
        collection: ChromaDB collection to search
        top_k: Number of results to return

    Returns:
        List of relevant chunks with their metadata
    """
    # Generate embedding for the question
    question_embedding = get_embedding(question)

    if question_embedding is None:
        return []

    # Query ChromaDB for similar chunks
    # ChromaDB uses cosine similarity by default to find similar embeddings
    results = collection.query(
        query_embeddings=[question_embedding],
        n_results=top_k,
        include=["documents", "metadatas", "distances"]  # What to return
    )

    # Format results into a cleaner structure
    chunks = []

    # Results come as parallel lists, so we zip them together
    if results["documents"] and results["documents"][0]:
        documents = results["documents"][0]
        metadatas = results["metadatas"][0] if results["metadatas"] else [{}] * len(documents)
        distances = results["distances"][0] if results["distances"] else [0] * len(documents)

        for doc, meta, dist in zip(documents, metadatas, distances):
            chunks.append({
                "text": doc,
                "metadata": meta,
                "distance": dist  # Lower distance = more similar
            })

    return chunks


def build_rag_prompt(question: str, context_chunks: list[dict]) -> str:
    """
    Build the prompt for the LLM that includes the retrieved context.

    This is the "augmented generation" part of RAG:
    We augment the user's question with relevant context from the PDF.

    Args:
        question: The user's question
        context_chunks: List of relevant chunks from the database

    Returns:
        Complete prompt string for the LLM
    """
    # Build the context section from retrieved chunks
    context_parts = []
    for i, chunk in enumerate(context_chunks, start=1):
        page_ref = chunk["metadata"].get("page_ref", "unknown page")
        chunk_idx = chunk["metadata"].get("chunk_index", "?")

        context_parts.append(
            f"--- Context {i} ({page_ref}, chunk {chunk_idx}) ---\n"
            f"{chunk['text']}\n"
        )

    context_text = "\n".join(context_parts)

    # Build the complete prompt with instructions
    # NOTE: The GUI handles language translation, so we always work in English here
    prompt = f"""You are a helpful assistant that answers questions based ONLY on the provided context from a PDF document.

IMPORTANT INSTRUCTIONS:
1. Answer the question using ONLY the information in the context below.
2. If the answer cannot be found in the context, respond EXACTLY with: "I don't know based on the PDF."
3. Do not make up information or use knowledge outside the provided context.
4. Provide thorough, well-structured explanations when the context supports it.
5. Use paragraphs to organize longer answers. Use bullet points or numbered lists when listing multiple items.
6. When relevant, mention which part of the context (page number) your answer comes from.
7. Always respond in English only. Do not mix languages.

CONTEXT FROM PDF:
{context_text}

USER QUESTION: {question}

ANSWER:"""

    return prompt


def answer_question(question: str, collection: chromadb.Collection) -> str:
    """
    Main function to answer a question using RAG.

    Complete RAG pipeline:
    1. Retrieve relevant chunks from the database
    2. Build a prompt with the context
    3. Generate an answer using the LLM

    Args:
        question: The user's question
        collection: ChromaDB collection with indexed PDF content

    Returns:
        The generated answer string
    """
    # Step 1: Retrieve relevant context
    print("  Searching for relevant context...")
    chunks = query_similar_chunks(question, collection)

    if not chunks:
        return "ERROR: Could not retrieve context. Make sure the PDF is indexed and Ollama is running."

    print(f"  Found {len(chunks)} relevant chunks")

    # Step 2: Build the RAG prompt
    prompt = build_rag_prompt(question, chunks)

    # Step 3: Generate answer
    print("  Generating answer...")
    answer = generate_answer(prompt)

    if answer is None:
        return "ERROR: Could not generate answer. Check Ollama connection."

    return answer


# ---------------------------------------------------------------------------
# CLI Interface
# ---------------------------------------------------------------------------

def print_help():
    """Print help information for the CLI."""
    print("""
RAG CLI Commands:
-----------------
  <question>       Ask a question about the indexed PDF
                   (Answer will be shown + audio file generated)
  /play            Play the last generated audio answer
  /reindex <path>  Clear and reindex a new PDF file
  /status          Show current collection status
  /help            Show this help message
  exit, quit, q    Exit the application

Audio Notes:
------------
  - Audio files are saved to: ./output/audio/answer.mp3
  - Audio is NEVER auto-played; use /play to listen
  - The assistant answers in the same language as your question
""")


def print_status(collection: chromadb.Collection):
    """Print the current status of the collection."""
    count = collection.count()
    print(f"\nCollection Status:")
    print(f"  - Collection name: {COLLECTION_NAME}")
    print(f"  - Chunks indexed: {count}")
    print(f"  - Database path: {CHROMA_DB_PATH}")
    print()


def main():
    """
    Main entry point for the RAG CLI application.

    Flow:
    1. Initialize ChromaDB
    2. Check if collection is empty and auto-index if needed
    3. Run interactive question-answer loop
    """
    print("\n" + "="*60)
    print("    RAG CLI - PDF Question Answering System")
    print("    (with Audio Output via edge_tts)")
    print("="*60)
    print(f"Using Ollama model: {OLLAMA_MODEL}")
    print(f"ChromaDB path: {CHROMA_DB_PATH}")
    print(f"Audio output: {AUDIO_OUTPUT_PATH}")
    print("Type /help for available commands")

    # Initialize ChromaDB client and collection
    try:
        client = get_chroma_client()
        collection = get_or_create_collection(client)
    except Exception as e:
        print(f"ERROR: Could not initialize ChromaDB: {e}")
        sys.exit(1)

    # Check if collection is empty - if so, try to auto-index default PDF
    if collection.count() == 0:
        print(f"\nCollection is empty. Checking for default PDF at: {DEFAULT_PDF_PATH}")

        if os.path.exists(DEFAULT_PDF_PATH):
            print("Found default PDF. Starting auto-indexing...")
            index_pdf(DEFAULT_PDF_PATH, client)
            collection = get_or_create_collection(client)  # Refresh collection
        else:
            print(f"No PDF found at default path: {DEFAULT_PDF_PATH}")
            print("Use /reindex <path> to index a PDF file.")
    else:
        print(f"\nFound existing index with {collection.count()} chunks.")

    # Main interactive loop
    print("\n" + "-"*60)
    print("Ready! Ask questions about the PDF or type /help for commands.")
    print("-"*60 + "\n")

    while True:
        try:
            # Get user input
            user_input = input("You: ").strip()

            # Skip empty input
            if not user_input:
                continue

            # Check for exit commands
            if user_input.lower() in ["exit", "quit", "q"]:
                print("Goodbye!")
                break

            # Check for help command
            if user_input.lower() == "/help":
                print_help()
                continue

            # Check for status command
            if user_input.lower() == "/status":
                print_status(collection)
                continue

            # Check for play command - plays the last generated audio
            # Audio is ONLY played when the user explicitly requests it
            if user_input.lower() == "/play":
                play_audio()
                continue

            # Check for reindex command
            if user_input.lower().startswith("/reindex"):
                parts = user_input.split(maxsplit=1)
                pdf_path = parts[1] if len(parts) > 1 else DEFAULT_PDF_PATH

                if index_pdf(pdf_path, client, force_reindex=True):
                    collection = get_or_create_collection(client)  # Refresh
                    print("Reindexing complete. You can now ask questions.")
                else:
                    print("Reindexing failed. Check the PDF path and Ollama connection.")
                continue

            # Check if we have any indexed content
            if collection.count() == 0:
                print("\nNo PDF is indexed yet. Use /reindex <path> to index a PDF first.\n")
                continue

            # Regular question - use RAG to answer
            print()  # Empty line for readability
            answer = answer_question(user_input, collection)
            print(f"\nAssistant: {answer}\n")

            # Generate audio file from the answer (but do NOT auto-play)
            # The user can play it later using the /play command
            if answer and not answer.startswith("ERROR"):
                print("  Generating audio...")
                generate_audio(answer)
                print()  # Extra line for readability

        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break
        except EOFError:
            print("\nGoodbye!")
            break


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    main()
