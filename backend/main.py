from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from canvasapi import Canvas
from dotenv import load_dotenv
import os
import requests
from canvas_utils import extract_file_text, extract_page_content  # your file extraction function
from embedding_utils import chunk_text, add_to_vector_store, vector_store, retrieve_relevant_chunks
from gpt_utils import ask_gpt

load_dotenv()
API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")

canvas = Canvas(API_URL, API_KEY)
app = FastAPI()

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "Backend is running"}


class QuestionRequest(BaseModel):
    course_id: int
    question: str

class TestConnectionRequest(BaseModel):
    course_id: int

@app.post("/ask")
def ask_question(req: QuestionRequest):
    try:
        course = canvas.get_course(req.course_id)
        modules_info = []
    except Exception as e:
        error_msg = str(e)
        if "unauthorized" in error_msg.lower() or "forbidden" in error_msg.lower():
            return {
                "answer_html": "❌ <strong>Canvas API Authentication Error</strong><br><br>Your Canvas API token doesn't have the necessary permissions. Please check:<br><br>1. <strong>Token Permissions:</strong> Make sure your API token has 'Read' permissions for courses<br>2. <strong>Course Access:</strong> Ensure you're enrolled in this course<br>3. <strong>Token Validity:</strong> Your token might be expired - try generating a new one<br><br>To fix this:<br>• Go to Canvas → Account → Settings → Approved Integrations<br>• Delete your old token and create a new one<br>• Make sure to grant 'Read' permissions",
                "modules": [],
                "file_texts": []
            }
        else:
            return {
                "answer_html": f"❌ <strong>Canvas Connection Error</strong><br><br>Could not connect to Canvas: {error_msg}<br><br>Please check your Canvas API credentials and try again.",
                "modules": [],
                "file_texts": []
            }

    # Clear previous vector_store for this request/course
    vector_store.clear()

    for module in course.get_modules():
        items_list = []
        for item in module.get_module_items():
            link = None
            content_text = None
            
            # Debug: Print available attributes for debugging
            print(f"Processing item: {item.title} (type: {item.type})")
            print(f"Available attributes: {[attr for attr in dir(item) if not attr.startswith('_')]}")
            
            # Handle files
            if item.type == "File" and item.content_id:
                try:
                    file = canvas.get_file(item.content_id)
                    link = file.url
                    filename = file.display_name

                    # Extract text safely
                    content_text = extract_file_text(link, filename)
                    if content_text:
                        # Chunk the text and add to vector store
                        for chunk in chunk_text(content_text):
                            add_to_vector_store(filename, chunk, link)

                except Exception as e:
                    print(f"Error fetching file {item.title}: {e}")
            
            # Handle Canvas pages (like syllabus)
            elif item.type == "Page" and hasattr(item, 'page_url') and item.page_url:
                page_title = item.title
                try:
                    # Use Canvas API directly with requests
                    api_url = f"{API_URL}/api/v1/courses/{req.course_id}/pages/{item.page_url}"
                    headers = {"Authorization": f"Bearer {API_KEY}"}
                    
                    response = requests.get(api_url, headers=headers)
                    response.raise_for_status()
                    page_data = response.json()
                    
                    page_content = page_data.get('body', '')
                    page_html_url = page_data.get('html_url', item.html_url)

                    if page_content:
                        # Chunk the text and add to vector store with high importance
                        importance = "high" if "syllabus" in page_title.lower() else "normal"
                        for chunk in chunk_text(page_content):
                            add_to_vector_store(page_title, chunk, page_html_url, importance=importance)
                        link = page_html_url

                except Exception as e:
                    print(f"Error fetching page {page_title}: {e}")
                    # Fallback: try to extract from HTML URL
                    try:
                        page_url = f"{API_URL}/courses/{req.course_id}/pages/{item.page_url}"
                        content_text = extract_page_content(page_url, page_title, API_KEY)
                        if content_text:
                            importance = "high" if "syllabus" in page_title.lower() else "normal"
                            for chunk in chunk_text(content_text):
                                add_to_vector_store(page_title, chunk, page_url, importance=importance)
                            link = page_url
                    except Exception as e2:
                        print(f"Fallback also failed for page {page_title}: {e2}")

            items_list.append({
                "title": item.title,
                "type": item.type,
                "link": link
            })
        modules_info.append({"module_name": module.name, "items": items_list})

    # vector_store now contains all chunks with embeddings
    # Get GPT response using the question and relevant chunks
    try:
        # Use semantic search to find relevant chunks
        relevant_chunks = retrieve_relevant_chunks(req.question, top_k=5)
        
        # Check if we have any relevant content
        if not relevant_chunks:
            gpt_response = "I couldn't find any relevant information in the course materials. Please check the syllabus or contact your instructor."
        else:
            gpt_response = ask_gpt(req.question, relevant_chunks)
        
        return {
            "answer_html": gpt_response,
            "modules": modules_info,
            "file_texts": vector_store
        }
    except Exception as e:
        print(f"Error getting GPT response: {e}")
        return {
            "answer_html": "Sorry, I couldn't process your question. Please try again.",
            "modules": modules_info,
            "file_texts": vector_store
        }

@app.post("/test-connection")
def test_connection(req: TestConnectionRequest):
    """Test Canvas API connection and permissions"""
    try:
        course = canvas.get_course(req.course_id)
        course_name = course.name
        return {
            "success": True,
            "message": f"✅ Successfully connected to course: {course_name}",
            "course_name": course_name
        }
    except Exception as e:
        error_msg = str(e)
        if "unauthorized" in error_msg.lower() or "forbidden" in error_msg.lower():
            return {
                "success": False,
                "message": "❌ Canvas API Authentication Error. Your token doesn't have the necessary permissions.",
                "details": "Please check your Canvas API token permissions and course access."
            }
        else:
            return {
                "success": False,
                "message": f"❌ Canvas Connection Error: {error_msg}",
                "details": "Please check your Canvas API credentials and try again."
            }
