import { useState } from 'react';
import { Lock, Key, FileText, RefreshCw, Shield, Cpu, Aperture } from 'lucide-react';
import { AdvancedTextScramble } from './components/AdvancedTextScramble';

// Cyber pulse effect component for buttons
const CyberPulse = () => {
  return (
    <div className="cyber-pulse absolute inset-0 overflow-hidden">
      <div className="cyber-pulse-inner"></div>
    </div>
  );
};

function App() {
  const [publicKey, setPublicKey] = useState('');
  const [privateKey, setPrivateKey] = useState('');
  const [message, setMessage] = useState('');
  const [encryptedMessage, setEncryptedMessage] = useState('');
  const [inputDecryptMessage, setInputDecryptMessage] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState('');
  
  // Separate loading states
  const [loadingKeys, setLoadingKeys] = useState(false);
  const [loadingEncrypt, setLoadingEncrypt] = useState(false);
  const [loadingDecrypt, setLoadingDecrypt] = useState(false);
  
  // Animation states
  const [animatingKeys, setAnimatingKeys] = useState(false);
  const [animatingEncrypt, setAnimatingEncrypt] = useState(false);
  const [animatingDecrypt, setAnimatingDecrypt] = useState(false);

  const generateKeys = async () => {
    setLoadingKeys(true);
    setAnimatingKeys(true);
    
    try {
      const response = await fetch('http://localhost:5000/crypto/generate-keys', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setPublicKey(data.public_key);
        setPrivateKey(data.private_key);
      }
    } catch (error) {
      console.error('Error generating keys:', error);
    }
    
    setTimeout(() => {
      setLoadingKeys(false);
      setTimeout(() => setAnimatingKeys(false), 1500); // Longer animation
    }, 800);
  };

  const encryptMessage = async () => {
    if (!publicKey || !message) return;
    setLoadingEncrypt(true);
    setAnimatingEncrypt(true);
    
    try {
      const response = await fetch('http://localhost:5000/crypto/encrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ public_key: publicKey, message })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setEncryptedMessage(data.ciphertext);
        setInputDecryptMessage(data.ciphertext); // Automatically populate decrypt input
      }
    } catch (error) {
      console.error('Error encrypting message:', error);
    }
    
    setTimeout(() => {
      setLoadingEncrypt(false);
      setTimeout(() => setAnimatingEncrypt(false), 1500); // Longer animation
    }, 800);
  };

  const decryptMessage = async () => {
    if (!privateKey || !inputDecryptMessage) return;
    setLoadingDecrypt(true);
    setAnimatingDecrypt(true);
    setDecryptedMessage(""); // Clear previous message
    
    try {
      const response = await fetch('http://localhost:5000/crypto/decrypt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ private_key: privateKey, ciphertext: inputDecryptMessage })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setTimeout(() => {
          // Delay setting the decrypted text to ensure animation runs properly
          setDecryptedMessage(data.plaintext);
        }, 500);
      }
    } catch (error) {
      console.error('Error decrypting message:', error);
    }
    
    setTimeout(() => {
      setLoadingDecrypt(false);
      setTimeout(() => setAnimatingDecrypt(false), 1500); // Longer animation
    }, 800);
  };

  return (
    <div className="cyber-bg bg-black min-h-screen p-8 text-cyan-50">
      <div className="cyber-grid max-w-6xl mx-auto space-y-8">
        <header className="text-center cyber-header">
          <div className="cyber-logo">
            <Cpu className="w-12 h-12 inline-block mb-4" />
          </div>
          <h1 className="text-5xl font-bold mb-4 cyber-title">QUANTUM SHIELD</h1>
          <div className="cyber-divider mx-auto w-3/4 max-w-md"></div>
          <p className="text-xl mt-4 cyber-subtitle">POST-QUANTUM CRYPTOGRAPHY INTERFACE</p>
        </header>

        <div className="cyber-panel">
          <div className="cyber-panel-header">
            <Key className="w-8 h-8 text-cyan-400" />
            <h2 className="text-2xl font-bold cyber-section-title">KEY GENERATION</h2>
          </div>
          <div className="cyber-panel-content">
            <button
              onClick={generateKeys}
              disabled={loadingKeys}
              className="cyber-button cyber-button-blue w-full"
            >
              {loadingKeys && <CyberPulse />}
              <span className="cyber-button-content">
                {loadingKeys ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Shield className="w-5 h-5" />}
                GENERATE QUANTUM-RESISTANT KEYS
              </span>
            </button>
            
            {(publicKey || animatingKeys) && (
              <div className="cyber-fields mt-6 space-y-4">
                <div className="cyber-field">
                  <label className="cyber-label">PUBLIC KEY</label>
                  <div className="cyber-data-display">
                    <AdvancedTextScramble text={publicKey} isActive={animatingKeys} />
                  </div>
                </div>
                <div className="cyber-field">
                  <label className="cyber-label">PRIVATE KEY</label>
                  <div className="cyber-data-display">
                    <AdvancedTextScramble text={privateKey} isActive={animatingKeys} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="cyber-panel">
          <div className="cyber-panel-header">
            <Lock className="w-8 h-8 text-green-400" />
            <h2 className="text-2xl font-bold cyber-section-title">ENCRYPTION PROTOCOL</h2>
          </div>
          <div className="cyber-panel-content">
            <div className="cyber-field">
              <label className="cyber-label">MESSAGE INPUT</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="cyber-textarea"
                placeholder="Enter message for quantum encryption..."
                rows={3}
              />
            </div>
            <button
              onClick={encryptMessage}
              disabled={!publicKey || !message || loadingEncrypt}
              className="cyber-button cyber-button-green w-full mt-4"
            >
              {loadingEncrypt && <CyberPulse />}
              <span className="cyber-button-content">
                {loadingEncrypt ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Lock className="w-5 h-5" />}
                INITIATE ENCRYPTION
              </span>
            </button>
            
            {(encryptedMessage || animatingEncrypt) && (
              <div className="cyber-field mt-4">
                <label className="cyber-label">ENCRYPTED DATA</label>
                <div className="cyber-data-display">
                  <AdvancedTextScramble text={encryptedMessage} isActive={animatingEncrypt} />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="cyber-panel">
          <div className="cyber-panel-header">
            <FileText className="w-8 h-8 text-purple-400" />
            <h2 className="text-2xl font-bold cyber-section-title">DECRYPTION PROTOCOL</h2>
          </div>
          <div className="cyber-panel-content">
            <div className="cyber-field">
              <label className="cyber-label">ENCRYPTED DATA INPUT</label>
              <textarea
                value={inputDecryptMessage}
                onChange={(e) => setInputDecryptMessage(e.target.value)}
                className="cyber-textarea"
                placeholder="Enter encrypted data for decryption..."
                rows={3}
              />
            </div>
            <button
              onClick={decryptMessage}
              disabled={!privateKey || !inputDecryptMessage || loadingDecrypt}
              className="cyber-button cyber-button-purple w-full mt-4"
            >
              {loadingDecrypt && <CyberPulse />}
              <span className="cyber-button-content">
                {loadingDecrypt ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Aperture className="w-5 h-5" />}
                INITIATE DECRYPTION
              </span>
            </button>
            
            {(decryptedMessage !== "" || animatingDecrypt) && (
              <div className="cyber-field mt-4">
                <label className="cyber-label">DECRYPTED MESSAGE</label>
                <div className="cyber-data-display">
                  <AdvancedTextScramble text={decryptedMessage || "..."} isActive={animatingDecrypt} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;