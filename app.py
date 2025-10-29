# backend/app.py
from dotenv import load_dotenv
load_dotenv()

import os
import json
import requests
from datetime import datetime
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity
from flask_cors import CORS
from config import Config
from models import db, User, Doctor, SymptomRecord
from disease_model import analyze_symptoms
from utils import find_nearby_doctors, haversine_distance

app = Flask(__name__)
app.config.from_object(Config)

# Ensure secret key exists
if not app.config.get("JWT_SECRET_KEY"):
    app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "dev-secret-change-me")

db.init_app(app)
bcrypt = Bcrypt(app)
jwt = JWTManager(app)
CORS(app)

with app.app_context():
    db.create_all()

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json or {}
    if not data.get('email') or not data.get('password'):
        return jsonify({'msg':'email and password required'}),400
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'msg':'user exists'}),400
    pw_hash = bcrypt.generate_password_hash(data['password']).decode()
    user = User(email=data['email'], name=data.get('name',''), password_hash=pw_hash)
    db.session.add(user)
    db.session.commit()
    return jsonify({'msg':'registered'}),201

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json or {}
    user = User.query.filter_by(email=data.get('email')).first()
    if not user or not bcrypt.check_password_hash(user.password_hash, data.get('password','')):
        return jsonify({'msg':'bad credentials'}),401
    # send string identity
    token = create_access_token(identity=str(user.id))
    return jsonify({'access_token': token, 'user': {'id': user.id, 'email': user.email, 'name': user.name}})

@app.route('/api/diagnose', methods=['POST'])
@jwt_required()
def diagnose():
    payload = request.json or {}
    user_id = int(get_jwt_identity())
    symptoms = payload.get('symptoms', {})
    lat = payload.get('lat')
    lon = payload.get('lon')
    if not symptoms:
        return jsonify({'msg': 'no symptoms provided'}), 400

    # Save record (serialize to JSON string)
    record = SymptomRecord(user_id=user_id, symptoms_json=json.dumps(symptoms), created_at=datetime.utcnow())
    db.session.add(record)
    db.session.commit()

    # Analyze (your function)
    diagnoses = analyze_symptoms(symptoms)

    # Nearby doctors
    doctors = []
    if lat is not None and lon is not None:
        doctors = find_nearby_doctors(float(lat), float(lon), limit=5)

    return jsonify({'diagnoses': diagnoses, 'doctors': doctors})

@app.route('/api/doctors', methods=['GET'])
def list_doctors():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)
    q = Doctor.query.all()
    docs = []
    for d in q:
        item = { 'id': d.id, 'name': d.name, 'specialty': d.specialty, 'lat': d.lat, 'lon': d.lon, 'clinic': d.clinic }
        if lat is not None and lon is not None:
            item['distance_km'] = haversine_distance(lat, lon, d.lat, d.lon)
        docs.append(item)
    if lat is not None and lon is not None:
        docs.sort(key=lambda x: x.get('distance_km', 1e6))
    return jsonify({'doctors': docs})

@app.route('/api/chat', methods=['POST'])
def chat():
    data = request.json or {}
    message = data.get('message')
    if not isinstance(message, str) or not message.strip():
        return jsonify({'msg':'message required'}),400

    gemini_key = os.getenv("GEMINI_API_KEY")
    if not gemini_key:
        return jsonify({'msg':'chat not configured on server. set GEMINI_API_KEY'}),500

    # Use the simple REST call to the GenAI generateContent endpoint
    # NOTE: model name & version may need to be adjusted to what your project has access to.
    url = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-mini:generateText"
    headers = {"Content-Type": "application/json"}
    params = {"key": gemini_key}
    payload = {
        "prompt": {
            "text": f"You are a friendly and empathetic medical assistant. Remind users to consult professionals.\nUser: {message}"
        },
        "temperature": 0.2,
        "maxOutputTokens": 300
    }

    try:
        resp = requests.post(url, headers=headers, params=params, json=payload, timeout=20)
        resp.raise_for_status()
        j = resp.json()
        # different responses may vary — try to extract text safely
        reply = None
        if isinstance(j.get("candidates"), list) and j["candidates"]:
            reply = j["candidates"][0].get("content", "")
        elif j.get("output") and isinstance(j["output"], dict):
            # fallback for newer formats
            reply = ""
            for item in j["output"].get("content", []):
                if item.get("text"):
                    reply += item["text"]
        else:
            # try other possible fields
            reply = j.get("text") or str(j)
        if not reply:
            return jsonify({'msg':'No response from Gemini API'}), 500
        return jsonify({'reply': reply})
    except requests.exceptions.RequestException as e:
        print("Chat error:", e)
        if getattr(e, "response", None) is not None:
            print("Response:", e.response.text)
        return jsonify({'msg':'Failed to get response from Gemini API'}), 500

if __name__ == '__main__':
    app.run(debug=True)
