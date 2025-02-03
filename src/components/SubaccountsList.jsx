import { useState, useEffect, useContext } from 'react';
import styles from '../styles/subaccounts.module.css';
import { NearContext } from '@/wallets/near';

const SubaccountsList = () => {
  const { wallet } = useContext(NearContext);
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        let accounts = [];
        
        try {
          const mainnetKeys = await wallet.getAccessKeys('web3stick.near');
          const mainnetAccounts = mainnetKeys.map(key => ({
            id: key.account_id,
            network: 'mainnet'
          }));
          accounts = [...accounts, ...mainnetAccounts];
        } catch (mainnetError) {
          console.log('Error fetching mainnet accounts:', mainnetError);
        }

        try {
          const testnetKeys = await wallet.getAccessKeys('web3stick.testnet');
          const testnetAccounts = testnetKeys.map(key => ({
            id: key.account_id,
            network: 'testnet'
          }));
          accounts = [...accounts, ...testnetAccounts];
        } catch (testnetError) {
          console.log('Error fetching testnet accounts:', testnetError);
        }

        console.log('Fetched accounts:', accounts);
        setAccounts(accounts);
      } catch (error) {
        console.error('Error in fetchAccounts:', error);
      } finally {
        setLoading(false);
      }
    };

    if (wallet) {
      fetchAccounts();
    }
  }, [wallet]);

  const filteredAccounts = accounts.filter(account => {
    const matchesFilter = account.id.toLowerCase().includes(filter.toLowerCase());
    const matchesNetwork = selectedNetwork === 'all' || account.network === selectedNetwork;
    return matchesFilter && matchesNetwork;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>.web3stick Subaccounts</h2>
      
      <div className={styles.filterContainer}>
        <input
          type="text"
          placeholder="Filter accounts..."
          className={styles.filterInput}
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        />
        
        <div className={styles.networkToggle}>
          <label>
            <input
              type="radio"
              name="network"
              value="all"
              checked={selectedNetwork === 'all'}
              onChange={(e) => setSelectedNetwork(e.target.value)}
            />
            All Networks
          </label>
          <label>
            <input
              type="radio"
              name="network"
              value="mainnet"
              checked={selectedNetwork === 'mainnet'}
              onChange={(e) => setSelectedNetwork(e.target.value)}
            />
            Mainnet
          </label>
          <label>
            <input
              type="radio"
              name="network"
              value="testnet"
              checked={selectedNetwork === 'testnet'}
              onChange={(e) => setSelectedNetwork(e.target.value)}
            />
            Testnet
          </label>
        </div>
      </div>

      {loading ? (
        <p>Loading accounts...</p>
      ) : filteredAccounts.length > 0 ? (
        <ul className={styles.accountsList}>
          {filteredAccounts.map((account) => (
            <li key={account.id} className={styles.accountItem}>
              <span>{account.id}</span>
              <span className={`${styles.networkBadge} ${styles[account.network]}`}>
                {account.network}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No accounts found.</p>
      )}
    </div>
  );
};

export default SubaccountsList;