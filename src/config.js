// Chains for EVM Wallets
const evmWalletChains = {
  mainnet: {
    chainId: 397,
    name: 'Near Mainnet',
    explorer: 'https://eth-explorer.near.org',
    rpc: 'https://eth-rpc.mainnet.near.org',
  },
  testnet: {
    chainId: 398,
    name: 'Near Testnet',
    explorer: 'https://eth-explorer-testnet.near.org',
    rpc: 'https://eth-rpc.testnet.near.org',
  },
};

export let NetworkId = localStorage.getItem('networkId') || 'testnet';
export const EVMWalletChain = evmWalletChains[NetworkId];

export const setNetworkId = (network) => {
  NetworkId = network;
  localStorage.setItem('networkId', network);
  window.location.reload();
};

export const getContractId = () => {
  return NetworkId === 'testnet' ? 'web3stick.testnet' : 'web3stick.near';
};
