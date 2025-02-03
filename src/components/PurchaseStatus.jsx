import PropTypes from 'prop-types';
import styles from '../styles/purchase-status.module.css';

const PurchaseStatus = ({ status, error, transactionHashes, depositBalance, signedAccountId }) => {
  if (!status && !depositBalance) return null;

  const getExplorerUrl = (hash) => {
    const network = window.location.hostname.includes('testnet') ? 'testnet' : 'near';
    return `https://explorer.${network}.near.org/transactions/${hash}`;
  };

  const formatNearAmount = (amount) => {
    return (parseInt(amount) / 1e24).toFixed(2);
  };

  return (
    <div className={styles.purchaseStatus}>
      {depositBalance && signedAccountId && (
        <div className={styles.depositInfo}>
          <p>Current Deposit Balance: {formatNearAmount(depositBalance)} NEAR</p>
        </div>
      )}

      {status === 'processing' && (
        <div className={styles.processing}>
          <div className={styles.spinner}></div>
          <p>Processing your request...</p>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.success}>
          <h3>🎉 Success!</h3>
          {transactionHashes && (
            <div className={styles.transactions}>
              <p>View your transactions on NEAR Explorer:</p>
              {transactionHashes.map((hash, index) => (
                <div key={index}>
                  <a
                    href={getExplorerUrl(hash)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {index === 0 ? 'View Deposit Transaction' : 'View Account Creation Transaction'}
                  </a>
                  {index === 1 && (
                    <p className={styles.importMessage}>
                      ✨ Your account has been created successfully! You can now use your private key to import this account into your wallet.
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <h3>❌ Error</h3>
          <p>{error || 'An error occurred. Please try again.'}</p>
        </div>
      )}
    </div>
  );
};

PurchaseStatus.propTypes = {
  status: PropTypes.oneOf(['processing', 'success', 'error', null]).isRequired,
  error: PropTypes.string,
  transactionHashes: PropTypes.arrayOf(PropTypes.string),
  depositBalance: PropTypes.string,
  signedAccountId: PropTypes.string
};

export default PurchaseStatus;