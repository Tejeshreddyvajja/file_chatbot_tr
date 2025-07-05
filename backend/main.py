from fastapi import FastAPI
# Import BaseModel from Pydantic to define expected input structure
from pydantic import BaseModel
from chatbot import ask_bot
from fastapi import FastAPI, UploadFile
from upload_handler import handle_file_upload
from fastapi.middleware.cors import CORSMiddleware



app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Vite runs on 5173 by default
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatInput(BaseModel):
    message: str  # The user must send a "message" string in the JSON body


@app.post("/chat")
def chat_endpoint(user_input: ChatInput):
    reply = ask_bot(user_input.message)
    return {"reply": reply}

@app.post("/upload")
async def upload_endpoint(file: UploadFile):
    return await handle_file_upload(file)


