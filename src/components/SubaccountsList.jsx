import { useState, useEffect } from 'react';
import styles from '../styles/subaccounts.module.css';

const SubaccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');

  useEffect(() => {
    // TODO: Implement fetching accounts from NEAR API
    // This is a placeholder for demonstration
    const mockAccounts = [
      { id: 'example1.web3stick.near', network: 'mainnet' },
      { id: 'example2.web3stick.near', network: 'mainnet' },
      { id: 'test1.web3stick.testnet', network: 'testnet' },
      { id: 'test2.web3stick.testnet', network: 'testnet' },
    ];
    setAccounts(mockAccounts);
  }, []);

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
            All
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

      <div className={styles.accountsList}>
        {filteredAccounts.length > 0 ? (
          filteredAccounts.map(account => (
            <div key={account.id} className={styles.accountCard}>
              <div className={styles.network}>{account.network}</div>
              <div className={styles.accountId}>{account.id}</div>
            </div>
          ))
        ) : (
          <div className={styles.noAccounts}>
            No accounts found
          </div>
        )}
      </div>
    </div>
  );
};

export default SubaccountsList;