from flask import Blueprint, render_template

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def index():
    """Main route that renders the homepage"""
    return render_template('index.html', title='Post-Quantum Cryptography Demo')

@main_bp.route('/about')
def about():
    """Route to the about page with information about PQC"""
    return render_template('about.html', title='About Post-Quantum Cryptography')