import { Navigation } from './components/navigation';
import { Home } from './pages/Home';
import { useEffect, useState } from 'react';
import { NearContext, Wallet } from '@/wallets/near';

function App() {
  const [signedAccountId, setSignedAccountId] = useState(null);
  const [networkId, setNetworkId] = useState(() => {
    return localStorage.getItem('networkId') || 'testnet';
  });
  const [wallet, setWallet] = useState(() => new Wallet({ networkId, createAccessKeyFor: signedAccountId }));

  useEffect(() => {
    wallet.startUp(setSignedAccountId);
    return () => {
      wallet.cleanup();
    };
  }, [wallet]);

  const handleNetworkChange = async (newNetwork) => {
    if (signedAccountId) {
      const confirmed = window.confirm('Please log out before changing networks to ensure proper wallet state management.');
      if (!confirmed) return;
      await wallet.signOut();
    }
    await wallet.cleanup();
    localStorage.setItem('networkId', newNetwork);
    setNetworkId(newNetwork);
    const newWallet = new Wallet({ networkId: newNetwork, createAccessKeyFor: signedAccountId });
    await newWallet.startUp(setSignedAccountId);
    setWallet(newWallet);
    window.location.reload();
  };

  return (
    <NearContext.Provider value={{ wallet, signedAccountId, networkId, onNetworkChange: handleNetworkChange }}>
      <div className="container d-flex flex-column min-vh-100">
        <Navigation />
        <Home />
      </div>
    </NearContext.Provider>
  )
}

export default App
