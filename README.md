# Post-Quantum Cryptography Demo

A Flask web application that demonstrates Post-Quantum Cryptography (PQC) techniques for encrypting and decrypting data. This project showcases Kyber, a NIST PQC finalist algorithm, through an intuitive web interface.

## Features

- **Key Generation**: Create quantum-resistant public/private key pairs
- **Message Encryption**: Encrypt messages using a recipient's public key
- **Message Decryption**: Decrypt messages using your private key
- **Educational Content**: Learn about post-quantum cryptography and its importance

## Technologies Used

- **Backend**: Python 3.x, Flask
- **Cryptography**: pyoqs (Open Quantum Safe)
- **Frontend**: HTML, CSS, JavaScript
- **Security**: Flask-Talisman

## Getting Started

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd pqc-demo
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
   ```
   python app.py
   ```

6. Open your browser and navigate to:
   ```
   http://localhost:5000
   ```

## Project Structure

```
pqc-demo/
├── app.py                  # Main Flask application entry point
├── routes/                 # Route definitions
│   ├── main_routes.py      # Main page routes
│   └── crypto_routes.py    # Cryptographic operation routes
├── utils/                  # Utility functions
│   └── crypto_utils.py     # Cryptographic functions
├── templates/              # HTML templates
│   ├── base.html           # Base template
│   ├── index.html          # Homepage
│   └── about.html          # About PQC page
├── static/                 # Static files
│   ├── css/                # Stylesheets
│   ├── js/                 # JavaScript files
│   └── images/             # Images
├── .env                    # Environment variables
├── .env.example            # Example environment file
└── requirements.txt        # Project dependencies
```

## Security Considerations

This application is meant for educational purposes to demonstrate post-quantum cryptographic concepts. In a production environment, additional security measures would be needed:

- Proper key management and storage
- Server-side validation
- Rate limiting
- HTTPS enforcement
- More sophisticated error handling

## About Post-Quantum Cryptography

Post-Quantum Cryptography (PQC) refers to cryptographic algorithms that are believed to be secure against an attack by a quantum computer. As quantum computing advances, many widely-used cryptographic systems (like RSA and ECC) will become vulnerable. PQC aims to develop new cryptographic systems that remain secure even against quantum attacks.

The US National Institute of Standards and Technology (NIST) has been leading an effort to standardize quantum-resistant cryptographic algorithms. This application implements Kyber, one of NIST's selected algorithms.

## License

This project is licensed under the MIT License - see the LICENSE file for details.