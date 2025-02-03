import { useState } from 'react';
import { KeyPair } from 'near-api-js';
import styles from '../styles/key-generator.module.css';

const KeyGenerator = () => {
  const [keyPair, setKeyPair] = useState(null);
  const [error, setError] = useState('');

  const generateKeyPair = () => {
    try {
      const newKeyPair = KeyPair.fromRandom('ed25519');
      setKeyPair({
        publicKey: newKeyPair.getPublicKey().toString(),
        privateKey: newKeyPair.toString()
      });
      setError('');
    } catch (err) {
      setError('Failed to generate key pair: ' + err.message);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text)
      .catch(err => console.error('Failed to copy text: ', err));
  };

  return (
    <div className={styles.container}>
      <button 
        className={styles.generateButton}
        onClick={generateKeyPair}
      >
        Generate New Key Pair
      </button>

      {error && <div className={styles.error}>{error}</div>}
      
      {keyPair && (
        <div className={styles.keyDisplay}>
          <div className={styles.keyField}>
            <div className={styles.keyHeader}>
              <label>Public Key:</label>
              <button 
                className={styles.copyButton}
                onClick={() => copyToClipboard(keyPair.publicKey)}
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
            <div className={styles.keyText}>
              {keyPair.publicKey}
            </div>
          </div>
          <div className={styles.keyField}>
            <div className={styles.keyHeader}>
              <label>Private Key:</label>
              <button 
                className={styles.copyButton}
                onClick={() => copyToClipboard(keyPair.privateKey)}
                title="Copy to clipboard"
              >
                Copy
              </button>
            </div>
            <div className={styles.keyText}>
              {keyPair.privateKey}
            </div>
          </div>
          <p className={styles.warning}>
            ⚠️ Make sure to save your private key in a secure location.
            <br/> 
            If you lose it, you will lose access to your account!
            <br/>
            Use public key when buying a new .web3stick.near account.
            <br/>
            Do not use the same key for more than one account.
          </p>
        </div>
      )}
    </div>
  );
};

export default KeyGenerator;