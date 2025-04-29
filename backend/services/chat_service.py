from langchain_openai import ChatOpenAI

def query_llm_with_faiss(query, vector_store, yield_response=False):
    print(f"Searching for '{query}' in the vector store...")
    results = vector_store.similarity_search(query, k=1)
    print("Results in the vector store for query:", results)

    if results:
        llm = ChatOpenAI(base_url="http://localhost:1234/v1", api_key="Jayesh", streaming=True)
        
        prompt = f"""
        You are a helpful assistant for answering questions based on the retrieved context from a yoga exercises PDF. Your task is to provide clear, simple, and detailed answers, specifically tailored for a beginner in yoga.

        - Use the provided context to answer the query.
        - If the context doesn't contain the answer, acknowledge that you don't know.
        - Ensure your answer is detailed and easy to understand for someone new to yoga.
        - Organize your response in a structured and step-by-step manner where appropriate.
        - Use markdown formatting for headers, lists, and emphasis.
        - Use '\\n' for line breaks to ensure proper formatting.

        Question: {query}
        Context: {results[0].page_content}
        Answer:
        """
        
        print("Sending prompt to OpenAI LLM...")
        buffer = ""
        for chunk in llm.stream(prompt):
            content = chunk.content
            print(content, end="", flush=True)  # Stream output to console
            
            # Process buffer for line breaks
            buffer += content
            if '\n' in buffer:
                lines = buffer.split('\n')
                for line in lines[:-1]:  # Yield complete lines
                    yield line + '\n'
                buffer = lines[-1]  # Retain the last incomplete line
        if buffer:  # Yield any remaining content in buffer
            yield buffer

    else:
        yield "No relevant information found in the FAISS index.\n"


def call_openai(query, context):
    llm = ChatOpenAI(base_url="http://localhost:1234/v1", api_key="Jayesh", streaming=True)

    prompt = f"""
    You are a helpful assistant for answering questions based on the retrieved context from a yoga exercises PDF. Your task is to provide clear, simple, and detailed answers, specifically tailored for a beginner in yoga.

    - Use the provided context to answer the query.
    - If the context doesn't contain the answer, acknowledge that you don't know.
    - Ensure your answer is detailed and easy to understand for someone new to yoga.
    - Organize your response in a structured and step-by-step manner where appropriate.
    - Use markdown formatting for headers, lists, and emphasis.
    - Use '\\n' for line breaks to ensure proper formatting.

    Question: {query}
    Context: {context}
    Answer:
    """

    print("Sending prompt to OpenAI LLM...")
    buffer = ""
    for chunk in llm.stream(prompt):
        content = chunk.content
        print(content, end="", flush=True)  # Stream output to console

        # Process buffer for line breaks
        buffer += content
        if '\n' in buffer:
            lines = buffer.split('\n')
            for line in lines[:-1]:  # Yield complete lines
                yield line + '\n'
            buffer = lines[-1]  # Retain the last incomplete line
    if buffer:  # Yield any remaining content in buffer
        yield buffer
