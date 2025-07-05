
import os
import pandas as pd
from typing import Union
from fastapi import UploadFile
from vectordb import store_text

import fitz  # PyMuPDF for PDF
from docx import Document as DocxDocument

async def handle_file_upload(file: UploadFile):
    filename = file.filename
    ext = os.path.splitext(filename)[-1].lower()

    contents = await file.read()

    # Ensure data folder exists
    os.makedirs("data", exist_ok=True)
    file_path = os.path.join("data", filename)
    with open(file_path, "wb") as f:
        f.write(contents)

    if ext == ".csv":
        df = pd.read_csv(file_path)
        text = "\n".join(df.astype(str).apply(lambda row: ' | '.join(
            f"{col.strip()}: {val.strip()}" for col, val in zip(df.columns, row)), axis=1))

    elif ext == ".pdf":
        text = extract_text_from_pdf(file_path)

    elif ext == ".docx":
        text = extract_text_from_docx(file_path)

    else:
        return {"message": f"Unsupported file type: {ext}"}

    store_text(text)
    return {"message": f"{filename} uploaded and stored successfully."}

def extract_text_from_pdf(path: str) -> str:
    doc = fitz.open(path)
    return "\n".join([page.get_text() for page in doc])

def extract_text_from_docx(path: str) -> str:
    doc = DocxDocument(path)
    return "\n".join([para.text for para in doc.paragraphs])
