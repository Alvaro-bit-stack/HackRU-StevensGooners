import PyPDF2
from io import BytesIO
from docx import Document
import requests
from bs4 import BeautifulSoup

def extract_file_text(file_url, file_name):
    try:
        r = requests.get(file_url)
        r.raise_for_status()
        content = None

        if file_name.lower().endswith(".pdf"):
            pdf_reader = PyPDF2.PdfReader(BytesIO(r.content))
            content = "\n".join([page.extract_text() or "" for page in pdf_reader.pages])

        elif file_name.lower().endswith(".docx"):
            doc = Document(BytesIO(r.content))
            content = "\n".join([para.text for para in doc.paragraphs])

        elif file_name.lower().endswith((".txt", ".md", ".csv")):
            content = r.text

        return content
    except Exception as e:
        print(f"Failed to read file {file_name}: {e}")
        return None

def extract_page_content(page_url, page_title, api_key=None):
    """Extract text content from Canvas pages"""
    try:
        headers = {}
        if api_key:
            headers['Authorization'] = f'Bearer {api_key}'
        
        r = requests.get(page_url, headers=headers)
        r.raise_for_status()
        
        # Parse HTML content
        soup = BeautifulSoup(r.content, 'html.parser')
        
        # Remove script and style elements
        for script in soup(["script", "style"]):
            script.decompose()
        
        # Get text content
        text = soup.get_text()
        
        # Clean up whitespace
        lines = (line.strip() for line in text.splitlines())
        chunks = (phrase.strip() for line in lines for phrase in line.split("  "))
        text = ' '.join(chunk for chunk in chunks if chunk)
        
        return text
    except Exception as e:
        print(f"Failed to read page {page_title}: {e}")
        return None
