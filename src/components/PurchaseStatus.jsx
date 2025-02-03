import PropTypes from 'prop-types';
import styles from '../styles/purchase-status.module.css';

const PurchaseStatus = ({ status, error, transactionHashes }) => {
  if (!status) return null;

  const getExplorerUrl = (hash) => {
    const network = window.location.hostname.includes('testnet') ? 'testnet' : 'near';
    return `https://explorer.${network}.near.org/transactions/${hash}`;
  };

  return (
    <div className={styles.purchaseStatus}>
      {status === 'processing' && (
        <div className={styles.processing}>
          <div className={styles.spinner}></div>
          <p>Processing your purchase...</p>
        </div>
      )}

      {status === 'success' && (
        <div className={styles.success}>
          <h3>🎉 Purchase Successful!</h3>
          <p>Your .web3stick account has been created successfully.</p>
          {transactionHashes && (
            <div className={styles.transactions}>
              <p>View your transactions:</p>
              {transactionHashes.map((hash, index) => (
                <a
                  key={index}
                  href={getExplorerUrl(hash)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {index === 0 ? 'Deposit' : 'Account Creation'} Transaction
                </a>
              ))}
            </div>
          )}
        </div>
      )}

      {status === 'error' && (
        <div className={styles.error}>
          <h3>❌ Transaction Failed</h3>
          <p>{error || 'An error occurred during the purchase process. Please try again.'}</p>
        </div>
      )}
    </div>
  );
};

PurchaseStatus.propTypes = {
  status: PropTypes.oneOf(['processing', 'success', 'error', null]).isRequired,
  error: PropTypes.string,
  transactionHashes: PropTypes.arrayOf(PropTypes.string)
};

export default PurchaseStatus;