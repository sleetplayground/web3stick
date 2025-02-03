import { useState, useContext } from 'react';
import styles from '../styles/account-creation.module.css';
import PurchaseStatus from './PurchaseStatus';
import { NearContext } from '@/wallets/near';
import { getContractId, NetworkId } from '../config';

export default function AccountPurchaseForm() {
  const { wallet, signedAccountId } = useContext(NearContext);
  const [accountName, setAccountName] = useState('');
  const [publicKey, setPublicKey] = useState('');
  const [purchaseStatus, setPurchaseStatus] = useState(null);
  const [error, setError] = useState(null);
  const [transactionHashes, setTransactionHashes] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signedAccountId) {
      setError('Please connect your NEAR wallet first');
      setPurchaseStatus('error');
      return;
    }

    try {
      setPurchaseStatus('processing');
      setError(null);
      
      // Add network check
      try {
        await fetch('https://rpc.testnet.near.org/status', { timeout: 5000 });
      } catch (error) {
        console.error('Network check failed:', error);
        setError('Network connectivity issues detected. Please check your internet connection and try again.');
        setPurchaseStatus('error');
        return;
      }

      const contractId = getContractId();
      
      // Combine deposit and create_subaccount into a single transaction
      const transactions = [
        {
          receiverId: contractId,
          actions: [
            {
              type: 'FunctionCall',
              params: {
                methodName: 'deposit',
                args: {},
                gas: '30000000000000',
                deposit: '100000000000000000000000' // 0.1 NEAR
              }
            },
            {
              type: 'FunctionCall',
              params: {
                methodName: 'create_subaccount',
                args: {
                  subaccount_id: accountName,
                  public_key: publicKey
                },
                gas: '300000000000000',
                deposit: '0'
              }
            }
          ]
        }
      ];

      // Add timeout promise
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Transaction is taking longer than expected. Please check your transaction status in NEAR Explorer.')), 30000)
      );

      const result = await Promise.race([
        wallet.signAndSendTransactions({ transactions }),
        timeoutPromise
      ]);
      
      if (result && result[0] && result[0].transaction) {
        setTransactionHashes([result[0].transaction.hash]);
        setPurchaseStatus('success');
      } else {
        throw new Error('Invalid transaction result received');  
      }
    } catch (err) {
      console.error('Purchase error:', err);
      if (err.message.includes('timeout') || err.message.includes('taking longer')) {
        setError('Transaction is still processing. Please check your transaction status in NEAR Explorer.');
      } else if (err.message.includes('network') || err.message.includes('connectivity')) {
        setError('Network connectivity issues detected. Please check your internet connection and try again.');
      } else {
        setError(err.message || 'Failed to complete the purchase. Please try again.');
        setPurchaseStatus('error');
      }
    }
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
              required
            />
            <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-color)' }}>
              .web3stick.{NetworkId === 'testnet' ? 'testnet' : 'near'}
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
            required
          />
        </div>

        <button type="submit" className={styles.actionButton} disabled={purchaseStatus === 'processing'}>
          {purchaseStatus === 'processing' ? 'Processing...' : 'Buy Now Securely with NEAR'}
        </button>
      </form>

      <PurchaseStatus
        status={purchaseStatus}
        error={error}
        transactionHashes={transactionHashes}
      />
    </div>
  );
}