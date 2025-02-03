# web3stick subaccount notes

 contract and other details


website to web4.web3stick - [[web4dist]]
<br/>
subaccount create to web3stick.near


---


# Sleet NEAR Subaccount Factory Contract

This smart contract enables users to create subaccounts of the master account where the contract is deployed. It requires a deposit of 0.1 NEAR to create subaccounts, which goes to the master account.

## Contract Features

- Users must deposit NEAR before creating subaccounts
- Required deposit: 0.1 NEAR per subaccount
- Deposits are tracked per user and cannot be withdrawn
- Multiple subaccounts can be created if sufficient deposit exists
- Full access keys are automatically set up for new subaccounts


# Quickstart

1. Make sure you have installed [node.js](https://nodejs.org/en/download/package-manager/) >= 16
2. Install the [`NEAR CLI`](https://github.com/near/near-cli#setup)

## 1. Build and Deploy the Contract

```bash
# Build the contract
npm run build

# Deploy the contract to your account
near deploy web3stick.testnet contracts/sleet_subaccount.wasm
near deploy web3stick.near contracts/sleet_subaccount.wasm

# Initialize the contract
near call web3stick.testnet init '{}' --accountId web3stick.testnet
near call web3stick.near init '{}' --accountId web3stick.near
```

## 2. Interact with the Contract

### Check Your Deposit Balance
```bash
near view web3stick.testnet get_deposit '{"account_id": "YOUR_ACCOUNT.testnet"}'
near view web3stick.near get_deposit '{"account_id": "YOUR_ACCOUNT.near"}'
```

### Make a Deposit
```bash
near call web3stick.testnet deposit --accountId YOUR_ACCOUNT.testnet --deposit 0.1
near call web3stick.near deposit --accountId YOUR_ACCOUNT.near --deposit 0.1
```

### Create a Subaccount
First, generate a key pair. You have two options:

1. Using NEAR CLI:
> Human note: AI is outdated, this command does not work as far as I know! ❄️😀
```bash
near generate-key
```
This will create a key pair and save it in your local credentials directory. The public key will be displayed in the terminal.


2. Using JavaScript on the client side:
```javascript
const { KeyPair } = require('near-api-js');
const keyPair = KeyPair.fromRandom('ed25519');
const publicKey = keyPair.getPublicKey().toString();
const privateKey = keyPair.secretKey;
console.log(`Public Key: ${publicKey}`);
console.log(`Private Key: ${privateKey}`);
```

Then, use the public key to create the subaccount:
```bash
near call YOUR_ACCOUNT.testnet create_subaccount '{"subaccount_id": "mysubaccount", "public_key": "YOUR_GENERATED_PUBLIC_KEY"}' --accountId YOUR_ACCOUNT.testnet

near call YOUR_ACCOUNT.testnet create_subaccount '{"subaccount_id": "mysubaccount", "public_key": "YOUR_GENERATED_PUBLIC_KEY"}' --accountId YOUR_ACCOUNT.testnet
```

After successful execution, you'll have a new account `mysubaccount.web3stick.testnet` with full access keys set up.

### Deposit and Create Subaccount in One Command
```bash
near call web3stick.testnet deposit --accountId YOUR_ACCOUNT.testnet --deposit 0.1 && near call web3stick.testnet create_subaccount '{"subaccount_id": "mysubaccount", "public_key": "YOUR_GENERATED_PUBLIC_KEY"}' --accountId YOUR_ACCOUNT.testnet --gas 300000000000000

near call web3stick.near deposit --accountId YOUR_ACCOUNT.near --deposit 0.1 && near call web3stick.near create_subaccount '{"subaccount_id": "mysubaccount", "public_key": "YOUR_GENERATED_PUBLIC_KEY"}' --accountId YOUR_ACCOUNT.near --gas 300000000000000
```

This command combines the deposit and subaccount creation into a single line using the `&&` operator, which executes the second command only if the first one succeeds.

## Important Notes

- The deposit of 0.1 NEAR is required for each sub account creation
- Deposits cannot be withdrawn
- You can create multiple sub accounts as long as you have sufficient deposit
- The contract automatically sets up full access keys for new subaccounts
- Each subaccount receives a small amount of NEAR for storage fees



