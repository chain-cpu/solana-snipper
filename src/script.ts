//@ts-nocheck
import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import dotenv from "dotenv";
import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

dotenv.config();

anchor.setProvider(anchor.Provider.local("https://api.mainnet-beta.solana.com"));

const wallet = anchor.getProvider().wallet;


const anchorWallet = {
  publicKey: wallet.publicKey,
  payer: wallet.payer,
  signAllTransactions: wallet.signAllTransactions,
  signTransaction: wallet.signTransaction,
} as anchor.Wallet;


const treasury = new anchor.web3.PublicKey(
  process.env.APP_TREASURY_ADDRESS
);

const config = new anchor.web3.PublicKey(
  process.env.APP_CANDY_MACHINE_CONFIG
);

const candyMachineId = new anchor.web3.PublicKey(
  process.env.APP_CANDY_MACHINE_ID
);


const rpcHost = "https://api." + process.env.APP_SOLANA_NETWORK + ".solana.com";
const connection = new anchor.web3.Connection(rpcHost);
const txTimeout = process.env.TX_TIME_OUT;

const mint = async() => {
  const {
    candyMachine,
    goLiveDate,
    itemsAvailable,
    itemsRemaining,
    itemsRedeemed,
  } = await getCandyMachineState(
    anchorWallet as anchor.Wallet,
    candyMachineId,
    connection
  );
  
  console.log("itemsAvailable", itemsAvailable);
  console.log("itemsRemaining", itemsRemaining);
  console.log("itemsRedeemed", itemsRedeemed);

  if (wallet && candyMachine?.program) {
    console.log(anchorWallet);
    const mintTxId = await mintOneToken(
      candyMachine,
      config,
      anchorWallet.publicKey,
      treasury
    );

    const status = await awaitTransactionSignatureConfirmation(
      mintTxId,
      txTimeout,
      connection,
      "singleGossip",
      false
    );


  }

}
const mintAmount = process.env.MINT_AMOUNT;
for(let i=0;i<mintAmount;i++){
  mint();
}

