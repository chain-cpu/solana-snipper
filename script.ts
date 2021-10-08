import * as anchor from "@project-serum/anchor";
import * as fs from 'fs';
import {
    CandyMachine,
    awaitTransactionSignatureConfirmation,
    getCandyMachineState,
    mintOneToken,
    //shortenAddress,
} from "./candy-machine";

const txTimeout = 20000;

anchor.setProvider(anchor.Provider.local("https://api.mainnet-beta.solana.com"));

const wallet = anchor.getProvider().wallet;
/************************ CONFIG *******************/
const numberOfPurchaseWeWant = 2;
const amountOfSolToMint = 1.5;
const transactionFeeInSol = 1;

const myPrivateKeyEncoded = "";
const myPrivateKeyArray = [];


const treasury = new anchor.web3.PublicKey(
    "DDwXyznwTFd7t1uuWBceWWiFU5z3qMCU37aC5HV52HKz"
);

const config = new anchor.web3.PublicKey(
    "Eafik1C9duUD5U7cyWQtv7rvtzUWnX72dxSUn8PJnayr"
);

const candyMachineId = new anchor.web3.PublicKey(
    "Dvq4qB7mUvFETwdAE49NTrpyzp9tQG9ScDQLURtyH94d"
);

const rpcHost = "https://api.devnet.solana.com";
const connection = new anchor.web3.Connection(rpcHost);

console.log(wallet.publicKey);

const mint = async () => {
    
    const anchorWallet = {
        publicKey: wallet.publicKey,
        signAllTransactions: wallet.signAllTransactions,
        signTransaction: wallet.signTransaction,
    } as anchor.Wallet;


    const {candyMachine, goLiveDate, itemsRemaining} =
    await getCandyMachineState(
        anchorWallet,
        candyMachineId,
        connection
    );
    
    const mintTxId = await mintOneToken(
        candyMachine,
        config,
        wallet.publicKey,
        treasury
    );

    const status = await awaitTransactionSignatureConfirmation(
        mintTxId,
        txTimeout,
        connection,
        "singleGossip",
        false
    );
};



for (let i=0;i<NumerOfLoops;i++){
    mint();
}
