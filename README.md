# SOLANA-SNIPPER

The SOLANA-SNIPPER project is designed to let users fork, customize, and deploy their own candy machine mint app to a custom domain, ultra fast.


## Getting Set Up

### Prerequisites

* Ensure you have recent versions of both `node` and `yarn` installed.
* Ensure you have solana env and solana wallet at "~/.config/solana/id.json"

### Installation

1. Fork the project, then clone down. Example:
```
git clone git@github.com:GFNF/solana-sniper.git
```

2. Build the project. Example:
```
cd solana-sniper
npm i
npm i -g ts-node
```

3. Run
```
ANCHOR_WALLET=~/.config/solana/id.json ts-node script.ts
```


