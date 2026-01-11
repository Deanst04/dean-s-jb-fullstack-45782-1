#!/usr/bin/env python3
"""
RAG GUI - Streamlit Interface (Enhanced v2)
============================================
A chat-style graphical interface for the RAG application with:
- Multilingual support (langid detection + deep-translator)
- Persistent chat history
- Per-message audio generation
- Gemini API fallback for reliability

This GUI wraps the existing RAG logic from app.py - it does NOT duplicate any code.

Run with: streamlit run gui.py
"""

from dotenv import load_dotenv
load_dotenv()

import os
import re
import uuid
from datetime import datetime
from typing import Optional

import streamlit as st

# ---------------------------------------------------------------------------
# CHANGE #1: Language Detection - Replaced langdetect with langid
# ---------------------------------------------------------------------------
# langid is more deterministic and faster than langdetect
# Install: pip install langid
import langid

# ---------------------------------------------------------------------------
# CHANGE #2: Translation - Using deep-translator instead of LLM
# ---------------------------------------------------------------------------
# deep-translator provides deterministic translation via Google Translate
# This is more reliable than using Ollama for translation
# Install: pip install deep-translator
from deep_translator import GoogleTranslator

# ---------------------------------------------------------------------------
# CHANGE #4: Gemini API for fallback
# ---------------------------------------------------------------------------
# google-generativeai provides access to Gemini models
# Used as a fallback when Ollama returns fallback/empty responses
# Install: pip install google-generativeai
import google.generativeai as genai

# ---------------------------------------------------------------------------
# Import RAG functions from app.py (NO code duplication!)
# ---------------------------------------------------------------------------
from app import (
    # Core RAG functions
    get_chroma_client,
    get_or_create_collection,
    answer_question,
    index_pdf,
    # NEW: Import these for Gemini fallback support
    query_similar_chunks,
    build_rag_prompt,
    # Audio functions
    generate_audio,
    play_audio,
    # Configuration constants
    DEFAULT_PDF_PATH,
    AUDIO_OUTPUT_DIR,
    COLLECTION_NAME,
    OLLAMA_MODEL,
)


# ---------------------------------------------------------------------------
# Configuration Constants
# ---------------------------------------------------------------------------

# Gemini API configuration
# IMPORTANT: Set your API key as an environment variable for security
# export GEMINI_API_KEY="your-api-key-here"
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_MODEL = "gemini-1.5-flash"  # Fast and capable model

# ---------------------------------------------------------------------------
# CHANGE #3: Fallback Messages Dictionary
# ---------------------------------------------------------------------------
# Predefined fallback messages in multiple languages
# These are returned when the RAG system cannot answer the question
# DO NOT translate these dynamically - use these exact strings
FALLBACK_MESSAGES = {
    "en": "I don't know based on the provided PDF.",
    "he": "אני לא יכול לענות על השאלה על סמך ה־PDF שסופק.",
    "es": "No lo sé basándome en el PDF proporcionado.",
    "fr": "Je ne sais pas d'après le PDF fourni.",
    "de": "Ich weiß es nicht basierend auf dem bereitgestellten PDF.",
    "ru": "Я не знаю, основываясь на предоставленном PDF.",
    "ar": "لا أعرف بناءً على ملف PDF المقدم.",
    "zh": "根据提供的PDF，我不知道。",
    "ja": "提供されたPDFに基づいて、わかりません。",
    "ko": "제공된 PDF를 기반으로 알 수 없습니다.",
    "pt": "Não sei com base no PDF fornecido.",
    "it": "Non lo so in base al PDF fornito.",
}

# ---------------------------------------------------------------------------
# Fallback Detection Configuration
# ---------------------------------------------------------------------------
# Patterns that indicate a fallback/unknown response from the LLM.
# These are checked against the ENTIRE response to detect uncertainty.

# STRICT patterns: If the response IS essentially this phrase (with minor variations)
# These indicate the model explicitly said "I don't know"
FALLBACK_EXACT_PATTERNS = [
    "i don't know based on the pdf",
    "i don't know based on the provided pdf",
    "i do not know based on the pdf",
    "the answer is not in the context",
    "the answer cannot be found",
    "this information is not provided",
    "this is not mentioned in the context",
    "i cannot find this information",
    "the pdf does not contain",
    "the document does not mention",
    "there is no information about",
]

# LOOSE patterns: If these appear anywhere, it's likely a fallback
# But only if the response is also SHORT (to avoid false positives)
FALLBACK_LOOSE_PATTERNS = [
    "not mentioned",
    "not provided",
    "not found in",
    "no information",
    "cannot determine",
    "unable to find",
    "does not contain",
    "not in the context",
    "not in the pdf",
]

# Minimum answer length to be considered "substantive"
# Very short answers are likely fallbacks or incomplete
MIN_SUBSTANTIVE_LENGTH = 50


# ---------------------------------------------------------------------------
# Streamlit Page Configuration
# ---------------------------------------------------------------------------

st.set_page_config(
    page_title="RAG PDF Q&A",
    page_icon="📚",
    layout="centered",
    initial_sidebar_state="expanded"
)


# ---------------------------------------------------------------------------
# CHANGE #1: Language Detection Functions (Using langid)
# ---------------------------------------------------------------------------

def detect_language(text: str) -> str:
    """
    Detect the language of the input text using langid.

    langid is deterministic and doesn't require internet connection.
    Returns ISO 639-1 language code (e.g., 'en', 'he', 'es', 'fr').

    Args:
        text: The text to detect language for

    Returns:
        Language code string (defaults to 'en' if detection fails)
    """
    try:
        # langid.classify returns (language_code, confidence_score)
        lang, _ = langid.classify(text)  # _ ignores confidence score
        return lang
    except Exception:
        # If detection fails, assume English
        return "en"


# ---------------------------------------------------------------------------
# CHANGE #2: Translation Functions (Using deep-translator)
# ---------------------------------------------------------------------------

def translate_text(text: str, source_lang: str, target_lang: str) -> str:
    """
    Translate text using deep-translator (Google Translate).

    This provides deterministic, reliable translation without using the LLM.
    Falls back to original text if translation fails.

    Args:
        text: The text to translate
        source_lang: Source language code (e.g., 'he', 'es')
        target_lang: Target language code (e.g., 'en')

    Returns:
        Translated text, or original text if translation fails
    """
    # Skip translation if same language
    if source_lang == target_lang:
        return text

    try:
        # GoogleTranslator handles language codes automatically
        translator = GoogleTranslator(source=source_lang, target=target_lang)
        translated = translator.translate(text)
        return translated if translated else text

    except Exception as e:
        # Log warning but don't fail - return original text
        st.warning(f"Translation failed ({source_lang} → {target_lang}): {e}")
        return text


def verify_language_consistency(text: str, expected_lang: str) -> str:
    """
    Verify that the text is consistently in the expected language.

    If the detected language doesn't match, attempt to re-translate.
    This helps catch cases where translation produced mixed-language output.

    Args:
        text: The text to verify
        expected_lang: The expected language code

    Returns:
        The verified (possibly re-translated) text
    """
    if not text or len(text) < 20:
        # Too short to reliably detect
        return text

    try:
        detected_lang, _ = langid.classify(text)

        # If detected language matches expected, we're good
        if detected_lang == expected_lang:
            return text

        # If mismatch and expected is not English, try re-translating
        # This catches cases where translation left English fragments
        if expected_lang != "en" and detected_lang == "en":
            # Text appears to be English but should be in another language
            # Re-translate from English to target
            re_translated = translate_text(text, "en", expected_lang)
            return re_translated

        # Otherwise return as-is (could be detection error)
        return text

    except Exception:
        # On any error, return original
        return text


def clean_answer_formatting(text: str) -> str:
    """
    Clean and improve the formatting of an answer for better readability.

    - Normalizes whitespace
    - Ensures proper paragraph breaks
    - Cleans up bullet points and lists

    Args:
        text: The raw answer text

    Returns:
        Cleaned and formatted text
    """
    if not text:
        return text

    # Normalize line endings
    text = text.replace('\r\n', '\n').replace('\r', '\n')

    # Remove excessive blank lines (more than 2 consecutive)
    text = re.sub(r'\n{3,}', '\n\n', text)

    # Normalize bullet points to consistent format
    text = re.sub(r'^[\s]*[-•*]\s*', '• ', text, flags=re.MULTILINE)

    # Ensure numbered lists have consistent formatting
    text = re.sub(r'^[\s]*(\d+)[.)]\s*', r'\1. ', text, flags=re.MULTILINE)

    # Clean up whitespace around punctuation
    text = re.sub(r'\s+([.,!?;:])', r'\1', text)

    # Ensure single space after punctuation
    text = re.sub(r'([.,!?;:])([^\s\n])', r'\1 \2', text)

    # Remove leading/trailing whitespace from each line
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)

    # Final trim
    return text.strip()


# ---------------------------------------------------------------------------
# CHANGE #3: Fallback Detection Functions
# ---------------------------------------------------------------------------

def is_fallback_response(answer: str) -> bool:
    """
    Check if the answer is a fallback/unknown response from the LLM.

    Uses a two-tier detection system:
    1. EXACT patterns: Match anywhere = definite fallback
    2. LOOSE patterns: Match + short length = likely fallback

    This reduces false positives where a valid answer mentions
    "based on the PDF" as part of a longer explanation.

    Args:
        answer: The response from the LLM

    Returns:
        True if this appears to be a fallback response
    """
    # Empty or None is always a fallback
    if not answer:
        return True

    answer_lower = answer.lower().strip()
    answer_length = len(answer_lower)

    # Very short answers are suspicious
    if answer_length < MIN_SUBSTANTIVE_LENGTH:
        # Check for any loose pattern in short answers
        for pattern in FALLBACK_LOOSE_PATTERNS:
            if pattern in answer_lower:
                return True

    # Check exact patterns (these are definite fallbacks regardless of length)
    for pattern in FALLBACK_EXACT_PATTERNS:
        if pattern in answer_lower:
            return True

    # Check if the ENTIRE answer is basically just a fallback phrase
    # (with some tolerance for punctuation and whitespace)
    clean_answer = answer_lower.strip('.,!? \n\t')
    if len(clean_answer) < 100:  # Only for short responses
        for pattern in FALLBACK_EXACT_PATTERNS:
            # Check if the answer is mostly this pattern
            if pattern in clean_answer and len(clean_answer) < len(pattern) + 30:
                return True

    return False


def get_fallback_message(lang: str) -> str:
    """
    Get the predefined fallback message for a given language.

    Args:
        lang: ISO 639-1 language code

    Returns:
        Fallback message in the specified language (or English if not found)
    """
    return FALLBACK_MESSAGES.get(lang, FALLBACK_MESSAGES["en"])


# ---------------------------------------------------------------------------
# CHANGE #4: Gemini API Integration
# ---------------------------------------------------------------------------

def initialize_gemini() -> bool:
    """
    Initialize the Gemini API client.

    Returns:
        True if initialization succeeded, False otherwise
    """
    if not GEMINI_API_KEY:
        return False

    try:
        genai.configure(api_key=GEMINI_API_KEY)
        return True
    except Exception as e:
        st.warning(f"Failed to initialize Gemini: {e}")
        return False


def query_gemini(prompt: str) -> Optional[str]:
    """
    Query Gemini API with the given prompt.

    This is used as a fallback when Ollama fails or returns a fallback answer.

    Args:
        prompt: The complete RAG prompt (context + question)

    Returns:
        Generated answer from Gemini, or None if failed
    """
    if not GEMINI_API_KEY:
        return None

    try:
        # Create the model
        model = genai.GenerativeModel(GEMINI_MODEL)

        # Generate response
        response = model.generate_content(prompt)

        # Extract text from response
        if response and response.text:
            return response.text.strip()

        return None

    except Exception as e:
        st.warning(f"Gemini query failed: {e}")
        return None


def answer_with_fallback(
    question: str,
    collection,
    user_lang: str
) -> tuple[str, str]:
    """
    Answer a question using RAG with Gemini fallback.

    Flow:
    1. Try Ollama first (via existing answer_question)
    2. If Ollama returns fallback/empty → try Gemini
    3. If both fail → return predefined fallback message

    Args:
        question: The question (in English for retrieval)
        collection: ChromaDB collection
        user_lang: Original language of the user

    Returns:
        Tuple of (answer, source) where source is "ollama", "gemini", or "fallback"
    """
    # Step 1: Try Ollama first
    with st.spinner("Querying Ollama..."):
        ollama_answer = answer_question(question, collection)

    # Check if Ollama gave a valid response
    if ollama_answer and not ollama_answer.startswith("ERROR"):
        if not is_fallback_response(ollama_answer):
            # Ollama gave a real answer
            return ollama_answer, "ollama"

    # Step 2: Ollama failed or returned fallback - try Gemini
    if GEMINI_API_KEY:
        with st.spinner("Ollama uncertain, trying Gemini..."):
            # Get the context chunks for Gemini
            chunks = query_similar_chunks(question, collection)

            if chunks:
                # Build the same prompt we'd use for Ollama
                prompt = build_rag_prompt(question, chunks)

                # Query Gemini
                gemini_answer = query_gemini(prompt)

                if gemini_answer and not is_fallback_response(gemini_answer):
                    # Gemini gave a real answer
                    return gemini_answer, "gemini"

    # Step 3: Both failed - return predefined fallback
    fallback = get_fallback_message(user_lang)
    return fallback, "fallback"


# ---------------------------------------------------------------------------
# Session State Initialization
# ---------------------------------------------------------------------------

def init_session_state():
    """Initialize session state variables if they don't exist."""

    # ChromaDB client and collection
    if "client" not in st.session_state:
        st.session_state.client = None

    if "collection" not in st.session_state:
        st.session_state.collection = None

    # Chat history: list of message dicts
    # Each message includes: role, content, audio_path, timestamp, language, source
    if "chat_history" not in st.session_state:
        st.session_state.chat_history = []

    # Audio preference
    if "enable_audio" not in st.session_state:
        st.session_state.enable_audio = True

    # Gemini availability
    if "gemini_available" not in st.session_state:
        st.session_state.gemini_available = initialize_gemini()


def initialize_rag():
    """Initialize ChromaDB client and collection."""
    try:
        if st.session_state.client is None:
            st.session_state.client = get_chroma_client()

        if st.session_state.collection is None:
            st.session_state.collection = get_or_create_collection(st.session_state.client)

        return True
    except Exception as e:
        st.error(f"Failed to initialize RAG system: {e}")
        return False


# ---------------------------------------------------------------------------
# Helper Functions
# ---------------------------------------------------------------------------

def get_collection_info():
    """Get information about the current collection."""
    if st.session_state.collection is None:
        return {"count": 0, "status": "Not initialized"}

    try:
        count = st.session_state.collection.count()
        return {
            "count": count,
            "status": "Ready" if count > 0 else "Empty - needs indexing"
        }
    except Exception as e:
        return {"count": 0, "status": f"Error: {e}"}


def generate_unique_audio_path() -> str:
    """
    Generate a unique audio file path using UUID.

    Returns:
        Unique file path like ./output/audio/answer_abc123.mp3
    """
    unique_id = uuid.uuid4().hex[:8]
    filename = f"answer_{unique_id}.mp3"
    return os.path.join(AUDIO_OUTPUT_DIR, filename)


def add_user_message(content: str, language: str):
    """
    Add a user message to chat history.

    CHANGE: Now stores detected language with each message.
    """
    st.session_state.chat_history.append({
        "role": "user",
        "content": content,
        "audio_path": None,
        "timestamp": datetime.now().isoformat(),
        "language": language,  # NEW: Store detected language
    })


def add_assistant_message(
    content: str,
    audio_path: Optional[str] = None,
    source: str = "ollama"
):
    """
    Add an assistant message to chat history.

    CHANGE: Now stores the answer source (ollama/gemini/fallback).
    """
    st.session_state.chat_history.append({
        "role": "assistant",
        "content": content,
        "audio_path": audio_path,
        "timestamp": datetime.now().isoformat(),
        "source": source,  # NEW: Track which model provided the answer
    })


def process_question(question: str) -> tuple[str, Optional[str], str]:
    """
    Process a user question through the multilingual RAG pipeline.

    UPDATED FLOW:
    1. Detect user's language (using langid)
    2. If not English: translate question to English (using deep-translator)
    3. Run RAG pipeline with Gemini fallback
    4. Handle fallback responses with predefined messages
    5. If not English AND not fallback: translate answer back
    6. Verify language consistency (fix mixed-language outputs)
    7. Clean and format the answer for readability
    8. Optionally generate audio

    Args:
        question: The user's question in any language

    Returns:
        Tuple of (answer_text, audio_path or None, source)
    """
    # Step 1: Detect language using langid
    user_lang = detect_language(question)
    is_english = user_lang == "en"

    # Step 2: Translate to English if needed (for retrieval)
    if is_english:
        english_question = question
    else:
        with st.spinner(f"Translating question ({user_lang.upper()} → EN)..."):
            english_question = translate_text(question, user_lang, "en")

    # Step 3: Run RAG pipeline with Gemini fallback
    english_answer, source = answer_with_fallback(
        english_question,
        st.session_state.collection,
        user_lang
    )

    # Step 4: Handle the response based on source
    if source == "fallback":
        # Fallback messages are already in the correct language
        # DO NOT translate them - they are pre-defined and clean
        final_answer = english_answer
    elif is_english:
        # English user, no translation needed
        # Just clean up the formatting
        final_answer = clean_answer_formatting(english_answer)
    else:
        # Non-English user, translate answer back
        with st.spinner(f"Translating answer (EN → {user_lang.upper()})..."):
            translated_answer = translate_text(english_answer, "en", user_lang)

        # Step 5: Verify language consistency
        # This catches cases where translation left English fragments
        final_answer = verify_language_consistency(translated_answer, user_lang)

    # Step 6: Clean and format the answer for readability
    # (Skip for fallback messages as they're already clean)
    if source != "fallback":
        final_answer = clean_answer_formatting(final_answer)

    # Step 7: Generate audio if enabled
    audio_path = None
    if st.session_state.enable_audio:
        with st.spinner("Generating audio..."):
            audio_path = generate_unique_audio_path()
            success = generate_audio(final_answer, audio_path)
            if not success:
                audio_path = None

    return final_answer, audio_path, source


def handle_reindex(pdf_path: str):
    """Reindex a PDF file."""
    if not pdf_path.strip():
        st.warning("Please enter a PDF path.")
        return False

    if not os.path.exists(pdf_path):
        st.error(f"PDF file not found: {pdf_path}")
        return False

    with st.spinner(f"Indexing PDF: {pdf_path}..."):
        success = index_pdf(pdf_path, st.session_state.client, force_reindex=True)

    if success:
        st.session_state.collection = get_or_create_collection(st.session_state.client)
        st.session_state.chat_history = []
        st.success("PDF indexed successfully! Chat history cleared.")
        return True
    else:
        st.error("Failed to index PDF. Check the file and Ollama connection.")
        return False


def render_chat_message(message: dict, index: int):
    """
    Render a single chat message as a chat bubble.

    CHANGE: Now shows source indicator for assistant messages.
    """
    role = message["role"]
    content = message["content"]
    audio_path = message.get("audio_path")
    source = message.get("source", "")

    with st.chat_message(role):
        # Display content
        st.markdown(content)

        # For assistant messages, show source and audio controls
        if role == "assistant":
            # Show source indicator
            if source:
                source_icons = {
                    "ollama": "🦙 Ollama",
                    "gemini": "✨ Gemini",
                    "fallback": "⚠️ No answer found"
                }
                st.caption(source_icons.get(source, source))

            # Audio controls
            if audio_path and os.path.exists(audio_path):
                st.markdown("---")
                col1, col2 = st.columns([1, 3])

                with col1:
                    if st.button("🔊 Play", key=f"play_{index}", help="Play audio"):
                        play_audio(audio_path)

                with col2:
                    with open(audio_path, "rb") as audio_file:
                        st.audio(audio_file.read(), format="audio/mp3")


def render_chat_history():
    """Render the full chat history."""
    for i, message in enumerate(st.session_state.chat_history):
        render_chat_message(message, i)


# ---------------------------------------------------------------------------
# Main GUI Layout
# ---------------------------------------------------------------------------

def main():
    """Main function to render the Streamlit GUI."""

    # Initialize session state
    init_session_state()

    # Initialize RAG system
    if not initialize_rag():
        st.stop()

    # ----- Header -----
    st.title("📚 RAG PDF Chat")
    st.markdown("Chat with your PDF documents in any language!")

    # ----- Sidebar -----
    with st.sidebar:
        st.header("⚙️ Settings")

        # Audio toggle
        st.session_state.enable_audio = st.toggle(
            "🔊 Enable Audio",
            value=st.session_state.enable_audio,
            help="Generate audio for each assistant response"
        )

        st.markdown("---")

        # ----- System Status -----
        st.header("📊 System Status")
        info = get_collection_info()
        st.metric("Indexed Chunks", info["count"])
        st.caption(f"Status: {info['status']}")
        st.caption(f"Collection: {COLLECTION_NAME}")
        st.caption(f"Primary Model: {OLLAMA_MODEL}")

        # Show Gemini status
        if st.session_state.gemini_available:
            st.caption(f"Fallback Model: {GEMINI_MODEL} ✅")
        else:
            st.caption("Fallback Model: Not configured ❌")
            st.caption("Set GEMINI_API_KEY env var to enable")

        st.markdown("---")

        # ----- Reindex Section -----
        st.header("📄 Index PDF")

        pdf_path = st.text_input(
            "PDF Path",
            value=DEFAULT_PDF_PATH,
            help="Enter the path to the PDF file"
        )

        if st.button("🔄 Reindex PDF", use_container_width=True):
            handle_reindex(pdf_path)
            st.rerun()

        st.markdown("---")

        # ----- Chat Controls -----
        st.header("💬 Chat Controls")

        if st.button("🗑️ Clear Chat History", use_container_width=True):
            st.session_state.chat_history = []
            st.rerun()

        st.caption(f"Messages: {len(st.session_state.chat_history)}")

        st.markdown("---")

        # ----- Help Section -----
        st.header("❓ Help")
        st.markdown("""
        **Features:**
        - Ask questions in any language
        - Automatic translation (Google)
        - Gemini fallback for reliability
        - Audio playback per message

        **Model Sources:**
        - 🦙 = Ollama (primary)
        - ✨ = Gemini (fallback)
        - ⚠️ = No answer found
        """)

    # ----- Main Chat Area -----

    # Display chat history
    render_chat_history()

    # Check if we have indexed content
    collection_info = get_collection_info()
    if collection_info["count"] == 0:
        st.info("👆 Please index a PDF first using the sidebar.")
        st.stop()

    # ----- Chat Input -----
    if prompt := st.chat_input("Ask a question about the PDF..."):
        # Detect language for the user message
        user_lang = detect_language(prompt)

        # Add user message to history (with language)
        add_user_message(prompt, user_lang)

        # Display user message
        with st.chat_message("user"):
            st.markdown(prompt)

        # Process the question
        answer, audio_path, source = process_question(prompt)

        # Add assistant message to history (with source)
        add_assistant_message(answer, audio_path, source)

        # Display assistant message
        with st.chat_message("assistant"):
            st.markdown(answer)

            # Show source indicator
            source_icons = {
                "ollama": "🦙 Ollama",
                "gemini": "✨ Gemini",
                "fallback": "⚠️ No answer found"
            }
            st.caption(source_icons.get(source, source))

            # Audio controls
            if audio_path and os.path.exists(audio_path):
                st.markdown("---")
                col1, col2 = st.columns([1, 3])

                with col1:
                    if st.button("🔊 Play", key="play_latest"):
                        play_audio(audio_path)

                with col2:
                    with open(audio_path, "rb") as audio_file:
                        st.audio(audio_file.read(), format="audio/mp3")

        # Rerun to update chat history display
        st.rerun()


# ---------------------------------------------------------------------------
# Entry Point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    main()
