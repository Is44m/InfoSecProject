"""
Utility functions for post-quantum cryptographic operations
using the pqc library which implements NIST PQC finalists.
"""
from pqc.kem import kyber512 as kemalg

def generate_kyber_keypair():
    """
    Generate a key pair using ML-KEM-512 algorithm (standardized Kyber512)
    
    Returns:
        tuple: (public_key, private_key) as bytes
    """
    # Generate keypair directly from the algorithm module
    public_key, private_key = kemalg.keypair()
    
    return public_key, private_key

def encrypt_message(public_key, message_bytes):
    """
    Encrypt a message using ML-KEM-512
    
    Args:
        public_key (bytes): The recipient's public key
        message_bytes (bytes): The message to encrypt
        
    Returns:
        tuple: (ciphertext, shared_secret) as bytes
    """
    # Encapsulate to get shared secret and KEM ciphertext
    shared_secret, kem_ciphertext = kemalg.encap(public_key)
    
    # In reality we'd also use AES here
    
    # Extend shared secret if needed to match message length
    extended_secret = _extend_key(shared_secret, len(message_bytes))
    
    # XOR encryption
    encrypted = bytes(a ^ b for a, b in zip(message_bytes, extended_secret))
    
    # Combine KEM ciphertext and encrypted message
    full_ciphertext = kem_ciphertext + encrypted
    
    return full_ciphertext, shared_secret

def decrypt_message(private_key, ciphertext):
    """
    Decrypt a message using ML-KEM-512
    
    Args:
        private_key (bytes): The recipient's private key
        ciphertext (bytes): The encrypted message
        
    Returns:
        bytes: The decrypted message
    """
    # Calculate the KEM ciphertext size
    # ML-KEM-512 ciphertext size is 768 bytes
    kem_ciphertext_size = 768
    
    # Extract the KEM ciphertext and the encrypted message
    kem_ciphertext = ciphertext[:kem_ciphertext_size]
    actual_ciphertext = ciphertext[kem_ciphertext_size:]
    
    # Decapsulate to get the shared secret
    shared_secret = kemalg.decap(kem_ciphertext, private_key)
    
    # Extend shared secret if needed to match ciphertext length
    extended_secret = _extend_key(shared_secret, len(actual_ciphertext))
    
    # XOR decryption
    decrypted = bytes(a ^ b for a, b in zip(actual_ciphertext, extended_secret))
    
    return decrypted

def _extend_key(key, length):
    """
    Extend a key to the desired length
    
    Args:
        key (bytes): The key to extend
        length (int): The desired length
        
    Returns:
        bytes: The extended key
    """
    # Simple extension by repeating the key
    # In a real application, use a proper key derivation function
    return (key * (length // len(key) + 1))[:length]