from flask import Flask
from flask_talisman import Talisman
from flask_cors import CORS
import os
from dotenv import load_dotenv

from routes.main_routes import main_bp
from routes.crypto_routes import crypto_bp

load_dotenv()

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY', os.urandom(24))

    # Enable CORS for your frontend ONLY with proper configuration
    CORS(
        app,
        origins=[
            "https://quantum-shield-five.vercel.app",  # your FE
            "https://is44m.pythonanywhere.com",
            # Add localhost for development if needed
            "http://localhost:5173",
            "http://localhost:3000"
        ],
        supports_credentials=True,
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization", "X-Requested-With", "Accept"],
        expose_headers=["Access-Control-Allow-Origin", "Access-Control-Allow-Headers"],
        vary_header=True,
        max_age=600
    )

    # Security headers with Talisman -- move this AFTER CORS!
    csp = {
        'default-src': ['\'self\''],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
        'font-src': ['\'self\'', 'https://fonts.gstatic.com'],
        'script-src': ['\'self\'', '\'unsafe-inline\''],
        'connect-src': ['\'self\'', 'https://is44m.pythonanywhere.com', 'https://quantum-shield-five.vercel.app']
    }

    Talisman(
        app,
        content_security_policy=csp,
        force_https=False,
        session_cookie_secure=False,
        feature_policy={'geolocation': '\'none\''}
    )

    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(crypto_bp, url_prefix='/crypto')

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=3000)