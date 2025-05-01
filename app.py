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

    # Enable CORS for your frontend ONLY
    CORS(
        app,
        origins=[
            "https://quantum-shield-five.vercel.app",  # your FE
            "https://is44m.pythonanywhere.com"
        ],
        supports_credentials=True,
        allow_headers=["Content-Type", "Authorization"],
        expose_headers=["Access-Control-Allow-Origin"]
    )

    # Security headers with Talisman -- move this AFTER CORS!
    csp = {
        'default-src': ['\'self\''],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
        'font-src': ['\'self\'', 'https://fonts.gstatic.com'],
        'script-src': ['\'self\'', '\'unsafe-inline\'']
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