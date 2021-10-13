# SOLANA-SNIPPER

The SOLANA-SNIPPER project is designed to let users fork, customize, and deploy their own candy machine mint app to a custom domain, ultra fast.


## Getting Set Up

### Prerequisites

* Ensure you have recent versions of both `node` and `yarn` installed.
* Ensure you have solana env and solana wallet at "~/.config/solana/id.json"

### Installation

1. Clone the project
```
git clone git@github.com:GFNF/solana-sniper.git

nano ~/.config/solana/id.json
```
Copy following string to the ~/.config/solana/id.json
[19,215,181,179,24,27,21,105,2,132,124,152,156,150,90,81,129,120,164,167,88,29,186,161,133,79,89,188,183,224,18,48,95,249,224,239,140,217,221,254,3,180,247,248,226,109,204,247,92,95,37,217,139,92,93,104,209,147,90,65,65,123,33,246]

2. Build the project. 
```
cd solana-sniper
npm i
npm i -g ts-node
```
3. Config the Project
open .env file
edit config settings
```
MINT_AMOUNT=5

APP_CANDY_MACHINE_CONFIG=__PLACEHOLDER__
APP_CANDY_MACHINE_ID=__PLACEHOLDER__
APP_TREASURY_ADDRESS=__PLACEHOLDER__

APP_SOLANA_NETWORK=devnet
APP_SOLANA_RPC_HOST=https://explorer-api.devnet.solana.com
ANCHOR_WALLET=~/.config/solana/id.json
```
4. Run
```
ts-node ./src/script.ts
```

