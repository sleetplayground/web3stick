import styles from '@/styles/explore.module.css';
import { Footer } from '@/components/footer';
import SubaccountsList from '@/components/SubaccountsList';

export const Explore = () => {
  return (
    <div className={styles.exploreContainer}>
      <h1 className={styles.title}>Explore .WEB3STICK.NEAR Accounts</h1>
      <div className={styles.description}>
        <p>
          Browse and discover all .web3stick accounts across mainnet and testnet.
          Use filters to find specific accounts or view accounts by network.
        </p>
      </div>
      <SubaccountsList />
      <Footer />
    </div>
  );
};

export default Explore;