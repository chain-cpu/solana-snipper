//@ts-nocheck
import * as anchor from "@project-serum/anchor";

import { LAMPORTS_PER_SOL, Keypair } from "@solana/web3.js";
import dotenv from "dotenv";
import {decode} from 'base58-universal';

import {
  CandyMachine,
  awaitTransactionSignatureConfirmation,
  getCandyMachineState,
  mintOneToken,
  shortenAddress,
} from "./candy-machine";

dotenv.config();

const rpcHost = "https://api." + process.env.APP_SOLANA_NETWORK + ".solana.com";
console.log(rpcHost)
const connection = new anchor.web3.Connection(rpcHost);
const txTimeout = process.env.TX_TIME_OUT;

anchor.setProvider(anchor.Provider.local("https://api.mainnet-beta.solana.com"));

const wallet = anchor.getProvider().wallet;

const privateKey = process.env.WALLET_PRIVATE_KEY;

const byte_array: Uint8Array = decode(privateKey)

//@ts-ignore
const keyPair = Keypair.fromSecretKey(byte_array);

anchor.setProvider(new anchor.Provider(connection, new anchor.Wallet(keyPair)));

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
    try{
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
      console.log("mint succeed");
    }
    catch(err){
      console.log("mint failed");
    }
    

  }

}

const mintAmount = process.env.MINT_AMOUNT;
const mintN = async () => {
  for(let i=0;i<mintAmount;i++){
    console.log("minting " + i + "...");
    mint();
  }
  
}

mintN();