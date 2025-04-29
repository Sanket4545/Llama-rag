# controllers/chat_controller.py
from flask import jsonify, request

def chat_response():
    return jsonify({'msg': 'Welcome to your chat!', 'user': request.user})
