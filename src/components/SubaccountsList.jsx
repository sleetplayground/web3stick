import { useState, useEffect } from 'react';
import styles from '../styles/subaccounts.module.css';

const SubaccountsList = () => {
  const [accounts, setAccounts] = useState([]);
  const [filter, setFilter] = useState('');
  const [selectedNetwork, setSelectedNetwork] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const mainnetRPC = 'https://rpc.mainnet.near.org';
        const testnetRPC = 'https://rpc.testnet.near.org';

        // Function to fetch all subaccounts for a network
        const fetchAllSubaccounts = async (rpcUrl, suffix) => {
          try {
            const response = await fetch(rpcUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                jsonrpc: '2.0',
                id: 'dontcare',
                method: 'view_access_key_list',
                params: {
                  account_id: suffix
                }
              })
            });

            const data = await response.json();
            if (data.error) {
              console.error(`Error fetching subaccounts for ${suffix}:`, data.error);
              return [];
            }

            const network = rpcUrl.includes('testnet') ? 'testnet' : 'mainnet';
            
            // Parse the accounts from the response
            const accountsList = data.result?.keys || [];
            return accountsList.map(account => ({
              id: account.public_key,
              network,
              created_at: new Date().toISOString() // Creation date not available from RPC
            }));
          } catch (error) {
            console.error('Error fetching subaccounts:', error);
            return [];
          }
        };

        // Fetch accounts from both networks
        const mainnetAccounts = await fetchAllSubaccounts(mainnetRPC, 'web3stick.near');
        const testnetAccounts = await fetchAllSubaccounts(testnetRPC, 'web3stick.testnet');

        // Combine and set accounts
        setAccounts([...mainnetAccounts, ...testnetAccounts]);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  // Filter accounts based on search and network
  const filteredAccounts = accounts.filter(account => {
    const matchesFilter = account.id.toLowerCase().includes(filter.toLowerCase());
    const matchesNetwork = selectedNetwork === 'all' || account.network === selectedNetwork;
    return matchesFilter && matchesNetwork;
  });

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <input
          type="text"
          placeholder="Search accounts..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className={styles.searchInput}
        />
        <select
          value={selectedNetwork}
          onChange={(e) => setSelectedNetwork(e.target.value)}
          className={styles.networkSelect}
        >
          <option value="all">All Networks</option>
          <option value="mainnet">Mainnet</option>
          <option value="testnet">Testnet</option>
        </select>
      </div>

      {loading ? (
        <div className={styles.loading}>Loading accounts...</div>
      ) : (
        <div className={styles.accountsList}>
          {filteredAccounts.length > 0 ? (
            filteredAccounts.map((account) => (
              <div key={account.id} className={styles.accountItem}>
                <span className={styles.accountId}>{account.id}</span>
                <span className={styles.network}>{account.network}</span>
              </div>
            ))
          ) : (
            <div className={styles.noAccounts}>
              No accounts found matching your criteria
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SubaccountsList;