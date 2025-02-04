# Web4 Distribution

> NOTE: web4 does not work when you have another contract deployed to your account.

using https://github.com/vgrichina/web4-min-contract

first deploy web4-min-contract
```sh
near deploy web4.web3stick.testnet contracts/web4-min.wasm
near deploy web4.web3stick.near contracts/web4-min.wasm
```

near cli network
```sh
export NEAR_NETWORK=testnet
export NEAR_NETWORK=mainnet
echo $NEAR_NETWORK 
echo $NEAR_ENV
```

deploy

```sh
npx web4-deploy dist web4.web3stick.testnet --nearfs
npx web4-deploy dist web4.web3stick.near --nearfs
```
- can be run with or without --nearfs




also locally with ipfs
```sh
ipfs add -r dist
```


---



near sub account setup

```sh
near create-account web4.web3stick.testnet --masterAccount web3stick.testnet --initialBalance 1
near create-account web4.web3stick.near --masterAccount web3stick.near --initialBalance 0.5
```

remember to export account
```sh
# export
near account export-account web4.web3stick.testnet
near account export-account web4.web3stick.near

#view
near view-account 
```
