from flask import request, jsonify, Response, stream_with_context
import os
from services.embeddings_service import (
    process_pdfs,
    generate_embeddings,
    save_vector_store,
    load_vector_store
)
from services.chat_service import query_llm_with_faiss
 
INDEX_PATH = "faiss_index"
 
def chat_with_llm():
    try:
        data = request.json
        print("Received data:", data)
        query = data.get('query')
       
        if not query:
            print("No query provided.")
            return jsonify({'error': 'Query is required'}), 400
 
        if os.path.exists(INDEX_PATH):
            print("Loading existing vector store.")
            vector_store = load_vector_store(INDEX_PATH)
        else:
            print("Processing PDFs and generating embeddings.")
            pdf_pages = process_pdfs("uploads")
            vector_store = generate_embeddings(pdf_pages)
            save_vector_store(vector_store, INDEX_PATH)
 
        def generate_response():
            print("Querying LLM with FAISS...")  
            for chunk in query_llm_with_faiss(query, vector_store, yield_response=True):
                yield f"data: {chunk}\n\n"  
 
        return Response(stream_with_context(generate_response()), content_type='text/event-stream')
 
    except Exception as e:
        print("Error occurred:", str(e))
        return jsonify({'error': str(e)}), 500
 