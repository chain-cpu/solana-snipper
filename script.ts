import * as anchor from "@project-serum/anchor";

import {
    CandyMachine,
    awaitTransactionSignatureConfirmation,
    getCandyMachineState,
    mintOneToken,
    //shortenAddress,
} from "./candy-machine";

anchor.setProvider(anchor.Provider.local("https://api.devnet.solana.com"));


const treasury = new anchor.web3.PublicKey(
    "JCFHBoAxpFrKi9kShQdZCDUWjwCe1W25EvVza8DL8xwz"
);
console.log(treasury.toBase58())

const config = new anchor.web3.PublicKey(
    process.env.REACT_APP_CANDY_MACHINE_CONFIG!
);

const candyMachineId = new anchor.web3.PublicKey(
    process.env.REACT_APP_CANDY_MACHINE_ID!
);

const rpcHost = "https://api.devnet.solana.com";
const connection = new anchor.web3.Connection(rpcHost);

//console.log("treasury", treasury)

const mint = async () => {
    
    const anchorWallet = {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction,
    } as anchor.Wallet;


    const {candyMachine, goLiveDate, itemsRemaining} =
    await getCandyMachineState(
        anchorWallet,
        props.candyMachineId,
        props.connection
    );
    
    const mintTxId = await mintOneToken(
        candyMachine,
        props.config,
        wallet.publicKey,
        props.treasury
    );

    const status = await awaitTransactionSignatureConfirmation(
        mintTxId,
        props.txTimeout,
        props.connection,
        "singleGossip",
        false
    );
};

