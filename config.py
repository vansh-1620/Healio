import os

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY','devsecret')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY','jwt-secret')
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL','sqlite:///medai.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False