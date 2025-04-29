# routes/pdf.py
from flask import Blueprint
from controllers.pdf_controller import chat_with_llm
from middleware.auth_middleware import verify_token

pdf_bp = Blueprint('pdf', __name__)

pdf_bp.route('/chat', methods=['POST'])(verify_token(chat_with_llm))