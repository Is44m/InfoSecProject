from flask import Flask, render_template
from flask_talisman import Talisman
from flask_cors import CORS
import os
from dotenv import load_dotenv

# Import routes
from routes.main_routes import main_bp
from routes.crypto_routes import crypto_bp

# Load environment variables
load_dotenv()

def create_app():
    app = Flask(__name__)
    app.secret_key = os.getenv('SECRET_KEY', os.urandom(24))
    
     # Enable CORS for only your frontend domain
    CORS(app, origins=["https://quantum-shield-five.vercel.app"])
    
    # Security headers with Talisman
    csp = {
        'default-src': ['\'self\''],
        'style-src': ['\'self\'', '\'unsafe-inline\'', 'https://fonts.googleapis.com'],
        'font-src': ['\'self\'', 'https://fonts.gstatic.com'],
        'script-src': ['\'self\'', '\'unsafe-inline\'']
    }
    
    Talisman(app, 
             content_security_policy=csp,
             force_https=False,  # Set to True in production
             session_cookie_secure=False,  # Set to True in production
             feature_policy={'geolocation': '\'none\''}
    )
    
    # Register blueprints
    app.register_blueprint(main_bp)
    app.register_blueprint(crypto_bp, url_prefix='/crypto')
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, host='0.0.0.0', port=3000)  # Define the port here