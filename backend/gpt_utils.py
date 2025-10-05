from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()

# Initialize OpenAI client
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def ask_gpt(question, relevant_chunks):
    # Combine relevant chunks into a context string
    context = "\n\n".join(
        [f"{c['title']} ({c['link']}):\n{c['text']}" for c in relevant_chunks]
    )

    prompt = f"""
You are a helpful assistant for a student studying a Canvas course.
Only use the following course materials to answer the question:

{context}

Question: {question}

Instructions:
- Answer concisely and reference file names when relevant
- If the information is not found in the provided materials, respond with: "I couldn't find that information in the course materials. Please check the syllabus or contact your instructor."
- Do not make up or guess information that isn't explicitly stated in the materials
- If you find partial information, mention what you found and what's missing
"""

    # Call ChatCompletion with new 1.0+ API
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.2
    )

    # Extract the assistant's message
    return response.choices[0].message.content
