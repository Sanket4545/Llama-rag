# services/embeddings_service.py
import os
from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface.embeddings import HuggingFaceEmbeddings
import faiss
from langchain_community.docstore.in_memory import InMemoryDocstore
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

def process_pdfs(uploads_folder):
    all_pages = []
    for filename in os.listdir(uploads_folder):
        if filename.endswith(".pdf"):
            pdf_path = os.path.join(uploads_folder, filename)
            loader = PyPDFLoader(file_path=pdf_path)
            pages = loader.load()
            for page in pages:
                all_pages.append(Document(page_content=page.page_content, metadata=page.metadata))
    return all_pages

def generate_embeddings(pages):
    embedding_size = len(embeddings.embed_query("Sample text"))
    index = faiss.IndexFlatL2(embedding_size)
    
    vector_store = FAISS(
        embedding_function=embeddings,
        index=index,
        docstore=InMemoryDocstore(),
        index_to_docstore_id={},
    )
    
    vector_store.add_documents(pages)
    return vector_store

def save_vector_store(vector_store, path):
    vector_store.save_local(path)

def load_vector_store(path):
    return FAISS.load_local(path, embeddings, allow_dangerous_deserialization=True)