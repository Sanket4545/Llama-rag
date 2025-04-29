# app.py
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['SECRET_KEY'] = os.getenv('JWT_SECRET')

    from routes.auth import auth_bp
    from routes.pdf import pdf_bp 

    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(pdf_bp, url_prefix='/api/pdf')

    return app