import os
import shutil
import pandas as pd
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.vectorstores import Chroma
from langchain.text_splitter import CharacterTextSplitter
from langchain.docstore.document import Document

VECTORDB_DIR = "vectordb"

# Clean the old vector DB on every run
if os.path.exists(VECTORDB_DIR):
    shutil.rmtree(VECTORDB_DIR)

# Embedding model
embedding_model = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")

# Fresh vector DB
vector_db = Chroma(persist_directory=VECTORDB_DIR, embedding_function=embedding_model)

# Store new file (CSV)
def store_file(file_path: str):
    df = pd.read_csv(file_path)
    text = "\n".join(df.astype(str).apply(
        lambda row: ' | '.join(f"{col.strip()}: {val.strip()}" for col, val in zip(df.columns, row)),
        axis=1
    ))
    store_text(text)

# Store plain text (for PDF, DOCX, etc.)
def store_text(text: str):
    splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
    chunks = splitter.split_text(text)
    documents = [Document(page_content=chunk) for chunk in chunks]

    vector_db.add_documents(documents)
    vector_db.persist()

# Search in vector DB
def retrieve_docs(query: str):
    results = vector_db.similarity_search(query, k=3)
    return results
