import PropTypes from 'prop-types';
import styles from '../styles/purchase-status.module.css';

const PurchaseStatus = ({ status, error, depositBalance, signedAccountId }) => {
  if (!status && !depositBalance) return null;

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
          <p className={styles.importMessage}>
            ✨ Your account has been created successfully! You can now use your private key to import this account into your wallet.
          </p>
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
  depositBalance: PropTypes.string,
  signedAccountId: PropTypes.string
};

export default PurchaseStatus;