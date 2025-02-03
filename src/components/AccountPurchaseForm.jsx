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
  const [depositComplete, setDepositComplete] = useState(false);
  const [depositBalance, setDepositBalance] = useState('0');

  // Check deposit balance when component mounts or account changes
  const checkDepositBalance = async () => {
    if (!signedAccountId) return;
    try {
      const contractId = getContractId();
      const balance = await wallet.viewMethod({
        contractId,
        method: 'get_deposit',
        args: { account_id: signedAccountId }
      });
      setDepositBalance(balance);
      setDepositComplete(balance >= '100000000000000000000000'); // 0.1 NEAR
    } catch (err) {
      console.error('Error checking deposit balance:', err);
    }
  };

  const handleDeposit = async () => {
    if (!signedAccountId) {
      setError('Please connect your NEAR wallet first');
      setPurchaseStatus('error');
      return;
    }

    try {
      setPurchaseStatus('processing');
      setError(null);
      
      const contractId = getContractId();
      
      // Deposit transaction
      const depositResult = await wallet.callMethod({
        contractId,
        method: 'deposit',
        args: {},
        deposit: '100000000000000000000000' // 0.1 NEAR
      });

      if (depositResult) {
        setTransactionHashes(prev => [...prev, depositResult.transaction.hash]);
        await checkDepositBalance(); // Verify deposit was successful
        setPurchaseStatus('success');
        setError(null);
      }
    } catch (err) {
      console.error('Deposit error:', err);
      handleError(err);
    }
  };

  const handleCreateAccount = async () => {
    if (!signedAccountId) {
      setError('Please connect your NEAR wallet first');
      setPurchaseStatus('error');
      return;
    }

    if (!accountName || !publicKey) {
      setError('Please fill in both account name and public key');
      setPurchaseStatus('error');
      return;
    }

    // Validate account name format
    const accountNameRegex = /^[a-z0-9_-]{2,}$/;
    if (!accountNameRegex.test(accountName)) {
      setError('Account name can only contain lowercase letters, numbers, hyphens and underscores, and must be at least 2 characters long');
      setPurchaseStatus('error');
      return;
    }

    // Validate public key format
    if (!publicKey.startsWith('ed25519:')) {
      setError('Invalid public key format. Public key must start with "ed25519:"');
      setPurchaseStatus('error');
      return;
    }

    try {
      setPurchaseStatus('processing');
      setError(null);

      const contractId = getContractId();
      const fullAccountName = `${accountName}.${contractId}`;
      
      // Create subaccount transaction with updated parameters
      const createResult = await wallet.callMethod({
        contractId,
        method: 'create_subaccount',
        args: {
          subaccount_id: accountName,
          public_key: publicKey
        },
        gas: '300000000000000'
      });

      if (createResult) {
        setTransactionHashes(prev => [...prev, createResult.transaction?.hash]);
        setPurchaseStatus('success');
        setError(null);
        
        // Reset form after successful creation
        setAccountName('');
        setPublicKey('');
        setDepositComplete(false);
        await checkDepositBalance();

        // Show success message with the full account name
        setError(`Successfully created account: ${fullAccountName}`);
      }
    } catch (err) {
      console.error('Account creation error:', err);
      handleError(err);
    } finally {
      setPurchaseStatus(null);
    }
  };

  const handleError = (err) => {
    let errorMessage = 'An error occurred. Please try again.';
    
    if (err.message) {
      if (err.message.includes('insufficient deposit')) {
        errorMessage = 'Insufficient deposit. Please make a deposit first.';
      } else if (err.message.includes('account already exists')) {
        errorMessage = 'This account name is already taken. Please choose another one.';
      } else if (err.message.includes('invalid public key')) {
        errorMessage = 'Invalid public key format. Please check and try again.';
      } else if (err.message.includes('User rejected')) {
        errorMessage = 'Transaction was cancelled by user.';
      } else {
        errorMessage = err.message;
      }
    }
    
    setError(errorMessage);
    setPurchaseStatus('error');
  };

  return (
    <div className={styles.formContainer}>
      <form>
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
            <span className={styles.accountSuffix}>
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
            placeholder="Enter your public key (ed25519:...)"
            required
          />
        </div>

        <div className={styles.buttonContainer}>
          <button
            type="button"
            className={styles.actionButton}
            onClick={handleDeposit}
            disabled={purchaseStatus === 'processing'}
          >
            {purchaseStatus === 'processing' ? 'Processing...' : 'Step 1: Deposit 0.1 NEAR'}
          </button>

          <button
            type="button"
            className={styles.actionButton}
            onClick={checkDepositBalance}
            disabled={purchaseStatus === 'processing'}
          >
            Check Deposit
          </button>

          <button
            type="button"
            className={`${styles.actionButton} ${depositComplete ? styles.active : ''}`}
            onClick={handleCreateAccount}
            disabled={purchaseStatus === 'processing' || !depositComplete}
          >
            {purchaseStatus === 'processing' ? 'Processing...' : depositComplete ? 'Step 2: Create Account' : 'Deposit Required'}
          </button>
        </div>
      </form>

      <PurchaseStatus
        status={purchaseStatus}
        error={error}
        transactionHashes={transactionHashes}
        depositBalance={depositBalance}
        signedAccountId={signedAccountId}
      />
    </div>
  );
}