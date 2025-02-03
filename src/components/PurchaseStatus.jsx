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

      {status === 'success' && depositBalance && parseInt(depositBalance) >= 100000000000000000000000 && (
        <div className={styles.success}>
          <h3>🎉 Ready to Create Account!</h3>
          <p className={styles.importMessage}>
            ✨ You have sufficient deposit balance ({formatNearAmount(depositBalance)} NEAR). You can now create your .web3stick account!
          </p>
        </div>
      )}

      {status === 'success' && depositBalance && parseInt(depositBalance) < 100000000000000000000000 && parseInt(depositBalance) > 0 && (
        <div className={styles.success}>
          <h3>🎉 Deposit Successful!</h3>
          <p className={styles.importMessage}>
            ✨ Your current deposit balance is {formatNearAmount(depositBalance)} NEAR.
            Additional deposit needed to reach 0.1 NEAR for account creation.
          </p>
        </div>
      )}

      {status === 'success' && (!depositBalance || parseInt(depositBalance) === 0) && (
        <div className={styles.success}>
          <h3>🎉 Account Created Successfully!</h3>
          <p className={styles.importMessage}>
            ✨ Your .web3stick account has been created! You can now use your private key to import this account into your wallet.
            Make sure to keep your private key safe, as it&apos;s required to access your account.
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