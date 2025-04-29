# routes/chat.py
from flask import Blueprint
from controllers.chat_controller import chat_response
from middleware.auth_middleware import verify_token

chat_bp = Blueprint('chat', __name__)

chat_bp.route('/', methods=['GET'])(verify_token(chat_response))