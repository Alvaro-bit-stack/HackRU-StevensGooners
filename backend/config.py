import os
from dotenv import load_dotenv
from canvasapi import Canvas
import openai

load_dotenv()

API_URL = os.getenv("API_URL")
API_KEY = os.getenv("API_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

canvas = Canvas(API_URL, API_KEY)
openai.api_key = OPENAI_API_KEY
