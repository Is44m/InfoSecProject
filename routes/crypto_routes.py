from flask import Blueprint, render_template, request, jsonify
from utils.crypto_utils import generate_kyber_keypair, encrypt_message, decrypt_message

crypto_bp = Blueprint('crypto', __name__)

@crypto_bp.route('/generate-keys', methods=['POST'])
def generate_keys():
    """API endpoint to generate a Kyber keypair"""
    try:
        # Generate public and private keys
        public_key, private_key = generate_kyber_keypair()
        
        # Convert binary data to hex strings for display
        public_key_hex = public_key.hex()
        private_key_hex = private_key.hex()
        
        return jsonify({
            'status': 'success',
            'public_key': public_key_hex,
            'private_key': private_key_hex
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error generating keys: {str(e)}'
        }), 500

@crypto_bp.route('/encrypt', methods=['POST'])
def encrypt():
    """API endpoint to encrypt a message using a public key"""
    try:
        data = request.get_json()
        message = data.get('message', '')
        public_key_hex = data.get('public_key', '')
        
        if not message or not public_key_hex:
            return jsonify({
                'status': 'error',
                'message': 'Message and public key are required'
            }), 400
            
        # Convert hex string back to bytes
        public_key = bytes.fromhex(public_key_hex)
        
        # Encrypt the message
        ciphertext, shared_secret = encrypt_message(public_key, message.encode())
        
        return jsonify({
            'status': 'success',
            'ciphertext': ciphertext.hex(),
            'shared_secret': shared_secret.hex()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error encrypting message: {str(e)}'
        }), 500

@crypto_bp.route('/decrypt', methods=['POST'])
def decrypt():
    """API endpoint to decrypt a message using a private key"""
    try:
        data = request.get_json()
        ciphertext_hex = data.get('ciphertext', '')
        private_key_hex = data.get('private_key', '')
        
        if not ciphertext_hex or not private_key_hex:
            return jsonify({
                'status': 'error',
                'message': 'Ciphertext and private key are required'
            }), 400
            
        # Convert hex strings back to bytes
        ciphertext = bytes.fromhex(ciphertext_hex)
        private_key = bytes.fromhex(private_key_hex)
        
        # Decrypt the message
        plaintext = decrypt_message(private_key, ciphertext)
        
        return jsonify({
            'status': 'success',
            'plaintext': plaintext.decode()
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': f'Error decrypting message: {str(e)}'
        }), 500