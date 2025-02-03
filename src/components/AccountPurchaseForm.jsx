import { useState } from 'react';
import styles from '../styles/account-creation.module.css';

const AccountPurchaseForm = () => {
  const [accountName, setAccountName] = useState('');
  const [publicKey, setPublicKey] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement NEAR payment and account creation logic
    console.log('Submitting purchase for:', accountName + '.web3stick.near');
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="accountName">Account Name</label>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              id="accountName"
              value={accountName}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder="yourname"
            />
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-color)' }}>
              .web3stick.near
            </span>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="publicKey">Public Key</label>
          <input
            type="text"
            id="publicKey"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="Enter your public key"
          />
        </div>

        <button type="submit" className={styles.actionButton}>
          Buy Now Securely with NEAR
        </button>
      </form>
    </div>
  );
};

export default AccountPurchaseForm;