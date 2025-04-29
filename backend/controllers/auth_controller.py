# controllers/auth_controller.py
import jwt
import bcrypt
from datetime import datetime, timedelta
from flask import jsonify, request, make_response
from models.user import User
from db import db
import os

def generate_access_token(user_id):
    return jwt.encode(
        {'id': str(user_id), 'exp': datetime.utcnow() + timedelta(minutes=60)},
        os.getenv('JWT_SECRET'),
        algorithm='HS256'
    )

def generate_refresh_token(user_id):
    return jwt.encode(
        {'id': str(user_id), 'exp': datetime.utcnow() + timedelta(days=7)},
        os.getenv('REFRESH_TOKEN_SECRET'),
        algorithm='HS256'
    )

def register_user():
    try:
        data = request.json
        # Check if user already exists
        existing_user = db.users.find_one({'email': data['email']})
        if existing_user:
            return jsonify({'msg': 'Email id already exists'}), 400
        
        # Use email username as default name if 'name' is not provided
        name = data.get('name', data['email'].split('@')[0])
        
        # Hash password
        hashed_password = bcrypt.hashpw(data['password'].encode('utf-8'), bcrypt.gensalt())
        
        # Create new user
        new_user = User(
            name=name,
            email=data['email'],
            password=hashed_password.decode('utf-8')
        )
        
        # Insert user into database
        result = db.users.insert_one(new_user.dict())
        
        # Generate tokens
        access_token = generate_access_token(result.inserted_id)
        refresh_token = generate_refresh_token(result.inserted_id)
        
        # Calculate expiration time (same as in login)
        decoded_refresh_token = jwt.decode(
            refresh_token,
            os.getenv('REFRESH_TOKEN_SECRET'),
            algorithms=['HS256']
        )
        expiration_time = decoded_refresh_token['exp'] * 1000 - int(datetime.utcnow().timestamp() * 1000)
        
        # Create response with same format as login
        resp = make_response(jsonify({
            'accessToken': access_token,
            'refreshToken': refresh_token,
            'expirationTime': expiration_time,
            'name':  name
        }))
        
        # Set refresh token cookie
        resp.set_cookie(
            'refreshToken',
            refresh_token,
            httponly=True,
            samesite='Strict',
            path='/api/auth/refresh-token'
            # secure=True, on production uncomment this
        )
        return resp
        
    except Exception as e:
        return jsonify({'msg': str(e)}), 500

def login_user():
    try:
        data = request.json
        user = db.users.find_one({'email': data['email']})
        
        if not user or not bcrypt.checkpw(
            data['password'].encode('utf-8'),
            user['password'].encode('utf-8')
        ):
            return jsonify({'msg': 'Invalid credentials'}), 400
        
        access_token = generate_access_token(user['_id'])
        refresh_token = generate_refresh_token(user['_id'])
        
        # Calculate expiration time
        decoded_refresh_token = jwt.decode(
            refresh_token,
            os.getenv('REFRESH_TOKEN_SECRET'),
            algorithms=['HS256']
        )
        expiration_time = decoded_refresh_token['exp'] * 1000 - int(datetime.utcnow().timestamp() * 1000)
        
        resp = make_response(jsonify({
            'accessToken': access_token,
            'refreshToken': refresh_token,
            'expirationTime': expiration_time,
            'name': user['name']
        }))
        
        resp.set_cookie(
            'refreshToken',
            refresh_token,
            httponly=True,
            # secure=True, on production uncomment this
            samesite='Strict',
            path='/api/auth/refresh-token'
        )
        return resp
        
    except Exception as e:
        return jsonify({'msg': str(e)}), 500

def refresh_token():
    try:
        refresh_token = request.cookies.get('refreshToken')
        if not refresh_token:
            return '', 401
        
        decoded = jwt.decode(
            refresh_token,
            os.getenv('REFRESH_TOKEN_SECRET'),
            algorithms=['HS256']
        )
        
        access_token = generate_access_token(decoded['id'])
        return jsonify({'accessToken': access_token})
        
    except jwt.ExpiredSignatureError:
        return jsonify({'msg': 'Refresh token expired'}), 403
    except jwt.InvalidTokenError:
        return '', 403

def logout_user():
    resp = make_response(jsonify({'msg': 'Logged out successfully'}))
    resp.delete_cookie('refreshToken', path='/api/auth/refresh-token')
    return resp