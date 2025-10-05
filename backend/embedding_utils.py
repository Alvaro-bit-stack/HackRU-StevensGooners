import tiktoken
from openai import OpenAI
import os
from numpy import dot
from numpy.linalg import norm
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# In-memory vector store with metadata
vector_store = []

# Chunk text into pieces <= max_tokens
def chunk_text(text, max_tokens=500):
    enc = tiktoken.get_encoding("cl100k_base")
    tokens = enc.encode(text)
    chunks = []
    for i in range(0, len(tokens), max_tokens):
        chunk_tokens = tokens[i:i+max_tokens]
        chunk_text = enc.decode(chunk_tokens)
        chunks.append(chunk_text)
    return chunks

# Generate embedding using OpenAI 1.0+ client
def get_embedding(text):
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Add chunk to vector store with metadata
def add_to_vector_store(file_title, chunk_text, file_link, module_name="", importance="normal"):
    embedding = get_embedding(chunk_text)
    vector_store.append({
        "title": file_title,
        "text": chunk_text,
        "link": file_link,
        "module": module_name,
        "importance": importance,
        "embedding": embedding
    })

# Cosine similarity helper
def cosine_similarity(a, b):
    return dot(a, b) / (norm(a) * norm(b))

# Retrieve top-k relevant chunks for a question with optional weighting
def retrieve_relevant_chunks(question, top_k=5):
    question_embedding = get_embedding(question)
    scores = []

    for chunk in vector_store:
        sim = cosine_similarity(question_embedding, chunk["embedding"])
        # Boost important files (syllabus, exams)
        if chunk["importance"] == "high":
            sim *= 1.2
        scores.append((sim, chunk))

    scores.sort(reverse=True, key=lambda x: x[0])
    return [c for _, c in scores[:top_k]]
