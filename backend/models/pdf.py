from pydantic import BaseModel
from typing import Optional, List

class PDFDocument(BaseModel):
    content: str
    metadata: dict

class QueryRequest(BaseModel):
    query: str
    user_id: Optional[str]

class QueryResponse(BaseModel):
    response: str
    source_page: Optional[int]
    confidence: Optional[float]