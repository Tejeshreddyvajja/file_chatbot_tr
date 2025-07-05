
from langchain_groq import ChatGroq
from langchain.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os
from vectordb import retrieve_docs


load_dotenv()

llm = ChatGroq(
    groq_api_key=os.getenv("GROQ_API_KEY"),
    model_name="llama-3.3-70b-versatile"
)

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful AI assistant. The user has uploaded a CSV file containing structured data like feedback and responses. Use the provided context from the file to answer questions. If the file doesn't contain the answer, say so clearly.\n\n{context}"),
    ("user", "{input}")
])

chain = prompt | llm
# It takes in a user message and returns the chatbot's reply

from vectordb import retrieve_docs

def ask_bot(message: str):
    # Check if the question is clearly about the file or data
    file_keywords = ["file", "feedback", "csv", "upload", "data", "respondent", "response"]
    is_file_question = any(keyword in message.lower() for keyword in file_keywords)

    # Try to retrieve relevant documents from vector DB
    docs = retrieve_docs(message)

    context = ""
    if is_file_question or docs:
        context = "\n\n".join([doc.page_content for doc in docs])
        if "what is the file about" in message.lower():
            message = "Can you summarize the uploaded file?"

    # Send to the model regardless, with or without context
    reply = chain.invoke({"context": context, "input": message})
    return reply.content
