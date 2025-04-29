# Llama-rag

This repository contains a Retrieval-Augmented Generation (RAG) application that allows users to query information and receive responses from a specific PDF stored in the backend. The application supports full user authentication with JWT-based access and refresh tokens, and features login and registration pages. Additionally, it includes session management, a MongoDB database for storage, and runs on LLM Studio using the LLaMa model.


## Features

- **RAG Architecture**: Queries are processed, and responses are generated based on a pre-loaded PDF stored in the backend.
- **PDF Chunking and Embedding**: The PDF content is chunked and embedded using LangChain, and stored in a FAISS vector database for efficient retrieval.
- **User Authentication**: Includes login, registration, and JWT-based access token and refresh token system.
- **Session Management**: Manages user sessions efficiently.
- **LLM Studio Integration**: Uses LLM Studio to load and run the LLaMa model for text generation.
- **MongoDB**: Database integration for managing user data and sessions.
  

## PDF Chunking and Embedding

To ensure efficient and accurate query responses, the application uses **LangChain** for PDF processing. Here's how it works:

- **Chunking**: The PDF is broken down into manageable chunks of text to ensure that embeddings are generated from smaller, coherent pieces of the document. This allows for better semantic understanding and retrieval.
  
- **Embedding**: Once the PDF is chunked, each chunk is embedded using a pre-trained language model. These embeddings are numerical representations of the text, capturing its meaning in a form that the model can work with.

- **Vector Storage in FAISS**: The generated embeddings are stored in **FAISS** (Facebook AI Similarity Search), which is a fast and efficient vector database. FAISS allows the application to quickly search for the most relevant chunks when a user makes a query, ensuring rapid and accurate responses.

## Getting Started

### Prerequisites

Ensure you have the following installed:
- Node.js
- Python (version 3.8+)
- MongoDB
- npm (Node package manager)
- Python virtual environment tools
- FAISS (optional, can be installed using Python package)


### Clone the Repository

```bash
git clone https://github.com/Sanket4545/Llama-rag.git
cd Llama-rag
```


### Step 1: Download and Set Up LLM Studio

1. **Download LLM Studio**:
   Follow the instructions on the [LLM Studio GitHub page](https://github.com/LLM-Studio/LLM-Studio) to download and set up the LLM Studio.

2. **Download the LLaMa Model**:
   Once LLM Studio is installed, download the LLaMa model following the model download instructions provided by LLM Studio.

3. **Start the LLM Studio Server**:
   Start the server to run the LLaMa model within LLM Studio.

### Step 2: Frontend Setup

Navigate to the `frontend` directory and install the necessary packages.

```bash
cd frontend
npm install
npm run start
```


### Step 3: Backend Setup

1. Navigate to the `backend` directory.

   ```bash
   cd backend
   ```

2. Create and activate a Python virtual environment.

   ```bash
   python -m venv venv
   ./venv/Scripts/Activate  # For Windows
   source venv/bin/activate  # For Mac/Linux
   ```

3. Install the required Python packages.

   ```bash
   pip install -r requirements.txt
   ```

4. Start the backend server.

   ```bash
   python main.py
   ```

### Database Setup

Ensure MongoDB is running and accessible on your system. The backend is configured to interact with MongoDB to manage user data and sessions.

### Environment Variables

You will need to set up environment variables to run the application properly:

- **JWT_SECRET**: Secret key for generating JWT tokens.
- **MONGODB_URI**: MongoDB connection string.
- **FAISS_PATH**: Path to your FAISS vector database files.

Create a `.env` file in the `backend` directory with the necessary configurations:

```
JWT_SECRET=your_jwt_secret
MONGODB_URI=your_mongodb_uri
FAISS_PATH=path_to_faiss_db
```

### Authentication

- **JWT Tokens**: The application uses access tokens and refresh tokens for authentication. Upon login, an access token is issued, and when it expires, a refresh token is used to generate a new access token.
- **Login & Registration**: Users can register and log in through the provided authentication pages.

## Usage

1. **Querying**: Once the user is authenticated, they can input queries. The response will be generated using the pre-loaded PDF stored in the backend and retrieved via FAISS-based search.
2. **Yoga Chat**: The application is focused on delivering yoga-related information based on the PDF, offering users an interactive yoga assistant experience.

## PDF Processing Workflow

1. **Load PDF**: The backend loads the specific PDF file.
2. **Chunking with LangChain**: The PDF is broken into chunks of text to enhance the embedding process.
3. **Embedding**: LangChain generates embeddings for each chunk.
4. **Storage in FAISS**: The embeddings are stored in the FAISS vector database for fast retrieval.
5. **Query Response**: When a user queries something, the system searches the FAISS database for the most relevant chunks and responds with information extracted from the PDF.

## Contributing

Feel free to contribute to the project by forking the repository and creating pull requests.

## License

This project is licensed under the MIT License.
