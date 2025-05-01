// Crypto.js - JavaScript for the cryptographic operations in the PQC Demo

document.addEventListener('DOMContentLoaded', function() {
    // Initialize button event listeners
    initializeCryptoButtons();
});

/**
 * Initialize event listeners for crypto operation buttons
 */
function initializeCryptoButtons() {
    // Key Generation
    const generateKeysBtn = document.getElementById('generate-keys-btn');
    if (generateKeysBtn) {
        generateKeysBtn.addEventListener('click', generateKeys);
    }
    
    // Encryption
    const encryptBtn = document.getElementById('encrypt-btn');
    if (encryptBtn) {
        encryptBtn.addEventListener('click', encryptMessage);
    }
    
    // Decryption
    const decryptBtn = document.getElementById('decrypt-btn');
    if (decryptBtn) {
        decryptBtn.addEventListener('click', decryptMessage);
    }
    
    // Initialize auto-fill functionality for convenience
    initializeAutoFill();
}

/**
 * Generate a new Kyber keypair
 */
async function generateKeys() {
    // Update UI to show that keys are being generated
    const statusIndicator = document.getElementById('keygen-status');
    statusIndicator.className = 'status-indicator working';
    
    try {
        const response = await fetch('/crypto/generate-keys', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Update UI with the generated keys
            document.getElementById('public-key').textContent = data.public_key;
            document.getElementById('private-key').textContent = data.private_key;
            
            // Show the key results section
            document.getElementById('key-results').classList.remove('hidden');
            
            // Update status indicator
            statusIndicator.className = 'status-indicator success';
            
            // Enable auto-fill buttons
            document.getElementById('public-key').setAttribute('data-value', data.public_key);
            document.getElementById('private-key').setAttribute('data-value', data.private_key);
            
            // Show success notification
            showNotification('Key pair successfully generated!', 'success');
        } else {
            // Handle error
            statusIndicator.className = 'status-indicator error';
            showNotification(`Error: ${data.message}`, 'error');
        }
    } catch (error) {
        // Handle network or other errors
        statusIndicator.className = 'status-indicator error';
        showNotification(`Error: ${error.message}`, 'error');
    }
}

/**
 * Encrypt a message using a public key
 */
async function encryptMessage() {
    // Get the public key and message
    const publicKey = document.getElementById('encryption-pubkey').value.trim();
    const message = document.getElementById('plaintext-message').value.trim();
    
    // Validate inputs
    if (!publicKey) {
        showNotification('Please enter a public key', 'error');
        return;
    }
    
    if (!message) {
        showNotification('Please enter a message to encrypt', 'error');
        return;
    }
    
    // Update UI status
    const statusIndicator = document.getElementById('encryption-status');
    statusIndicator.className = 'status-indicator working';
    
    try {
        const response = await fetch('/crypto/encrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                public_key: publicKey,
                message: message
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Update UI with the encrypted message
            document.getElementById('ciphertext').textContent = data.ciphertext;
            
            // Show the encryption results section
            document.getElementById('encryption-results').classList.remove('hidden');
            
            // Update status indicator
            statusIndicator.className = 'status-indicator success';
            
            // Show success notification
            showNotification('Message encrypted successfully!', 'success');
        } else {
            // Handle error
            statusIndicator.className = 'status-indicator error';
            showNotification(`Error: ${data.message}`, 'error');
        }
    } catch (error) {
        // Handle network or other errors
        statusIndicator.className = 'status-indicator error';
        showNotification(`Error: ${error.message}`, 'error');
    }
}

/**
 * Decrypt a message using a private key
 */
async function decryptMessage() {
    // Get the private key and ciphertext
    const privateKey = document.getElementById('decryption-privkey').value.trim();
    const ciphertext = document.getElementById('encrypted-message').value.trim();
    
    // Validate inputs
    if (!privateKey) {
        showNotification('Please enter a private key', 'error');
        return;
    }
    
    if (!ciphertext) {
        showNotification('Please enter an encrypted message to decrypt', 'error');
        return;
    }
    
    // Update UI status
    const statusIndicator = document.getElementById('decryption-status');
    statusIndicator.className = 'status-indicator working';
    
    try {
        const response = await fetch('/crypto/decrypt', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                private_key: privateKey,
                ciphertext: ciphertext
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            // Update UI with the decrypted message
            document.getElementById('plaintext').textContent = data.plaintext;
            
            // Show the decryption results section
            document.getElementById('decryption-results').classList.remove('hidden');
            
            // Update status indicator
            statusIndicator.className = 'status-indicator success';
            
            // Show success notification
            showNotification('Message decrypted successfully!', 'success');
        } else {
            // Handle error
            statusIndicator.className = 'status-indicator error';
            showNotification(`Error: ${data.message}`, 'error');
        }
    } catch (error) {
        // Handle network or other errors
        statusIndicator.className = 'status-indicator error';
        showNotification(`Error: ${error.message}`, 'error');
    }
}

/**
 * Initialize auto-fill functionality for convenience during testing
 */
function initializeAutoFill() {
    // Add click event for public key autofill
    document.getElementById('public-key').addEventListener('click', function() {
        if (this.getAttribute('data-value')) {
            document.getElementById('encryption-pubkey').value = this.getAttribute('data-value');
            showNotification('Public key filled in encryption form', 'info');
        }
    });
    
    // Add click event for private key autofill
    document.getElementById('private-key').addEventListener('click', function() {
        if (this.getAttribute('data-value')) {
            document.getElementById('decryption-privkey').value = this.getAttribute('data-value');
            showNotification('Private key filled in decryption form', 'info');
        }
    });
    
    // Add click event for ciphertext autofill
    document.getElementById('ciphertext')?.addEventListener('click', function() {
        if (this.textContent && this.textContent !== 'Your encrypted message will appear here') {
            document.getElementById('encrypted-message').value = this.textContent;
            showNotification('Ciphertext filled in decryption form', 'info');
        }
    });
}

/**
 * Display a notification message to the user
 * @param {string} message - The message to display
 * @param {string} type - The notification type (success, error, info)
 */
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.querySelector('.notification-container');
    
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.className = 'notification-container';
        document.body.appendChild(notificationContainer);
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add close button
    const closeButton = document.createElement('button');
    closeButton.className = 'notification-close';
    closeButton.innerHTML = '&times;';
    closeButton.addEventListener('click', () => {
        notificationContainer.removeChild(notification);
    });
    
    notification.appendChild(closeButton);
    notificationContainer.appendChild(notification);
    
    // Style the notification container if not already styled
    if (!document.querySelector('#notification-styles')) {
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            .notification-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 1000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            }
            .notification {
                padding: 12px 16px;
                border-radius: 4px;
                color: white;
                max-width: 300px;
                position: relative;
                animation: slide-in 0.3s ease;
            }
            .notification.success {
                background-color: #48bb78;
            }
            .notification.error {
                background-color: #f56565;
            }
            .notification.info {
                background-color: #4299e1;
            }
            .notification-close {
                position: absolute;
                top: 5px;
                right: 5px;
                background: none;
                border: none;
                color: white;
                cursor: pointer;
                font-size: 16px;
            }
            @keyframes slide-in {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto-remove notification after 4 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notificationContainer.removeChild(notification);
        }
    }, 4000);
}