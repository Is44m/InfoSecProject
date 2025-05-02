# QUANTUM SHIELD - Post-Quantum Cryptography 

A Flask web application that demonstrates Post-Quantum Cryptography (PQC) techniques for encrypting and decrypting data. This project showcases Kyber, a NIST PQC finalist algorithm, through an intuitive web interface.

## Features

- **Key Generation**: Create quantum-resistant public/private key pairs
- **Message Encryption**: Encrypt messages using a recipient's public key
- **Message Decryption**: Decrypt messages using your private key
- **Educational Content**: Learn about post-quantum cryptography and its importance

## Technologies Used

- **Backend**: Python 3.x, Flask
- **Cryptography**: pyoqs (Open Quantum Safe)
- **Frontend**: React, Tailwind
- **Security**: Flask-Talisman, CORS

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```

2. Create and activate a virtual environment:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
   ```

3. Install dependencies:
   ```
   pip install -r requirements.txt
   ```

4. Create a .env file based on .env.example:
   ```
   cp .env.example .env
   ```

5. Run the application:
   Backend:
   ```
   python app.py
   ```
   Frontend:
   ```
   npm run dev
   ```

6. To view the frontend, open your browser and navigate to:
   ```
   http://localhost:5173
   ```

   Your backend will run on:
   ```
   http://localhost:3000
   ```

## Security Considerations

This application is meant for educational purposes to demonstrate post-quantum cryptographic concepts. In a production environment, additional security measures would be needed:

- Proper key management and storage
- Server-side validation
- Rate limiting
- HTTPS enforcement
- More sophisticated error handling

## Developers
   ```
   Zarmeen Tauseef - AI & FullStack
   ```
   ```
   Isaam Ansari - FullStack & Deployments
   ```