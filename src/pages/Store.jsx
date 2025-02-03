import styles from '@/styles/store.module.css';

export const Store = () => {
  return (
    <div className={styles.storeContainer}>
      <h1 className={styles.title}>.WEB3STICK.NEAR STORE</h1>
      <div className={styles.storeContent}>
        <div className={styles.filterSection}>
          {/* Filter options will be implemented later */}
          <p className={styles.comingSoon}>Filters coming soon...</p>
        </div>
        <div className={styles.nftGrid}>
          {/* NFT grid will be implemented later */}
          <p className={styles.comingSoon}>NFT marketplace coming soon...</p>
        </div>
      </div>
    </div>
  );
};