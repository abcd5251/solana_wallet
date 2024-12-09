"use client";
import React, { FC, useMemo } from "react";
import {
  ConnectionProvider,
  WalletProvider,
  useAnchorWallet,
  useConnection,
  useWallet,
} from "@solana/wallet-adapter-react";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  UnsafeBurnerWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import idl from "./idl.json";
import token_idl from "./token_idl.json";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import * as anchor from "@coral-xyz/anchor";
import {
  Connection,
  PublicKey,
  Transaction,
  clusterApiUrl,
} from "@solana/web3.js";
import { getProgram } from "./transaction";
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { BonkArena } from "../config/bonk_arena";
import { TestToken } from "../config/test_token";
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import { CONFIG } from "@/config/config";
import {
  createAssociatedTokenAccount,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { token } from "@coral-xyz/anchor/dist/cjs/utils";
import NodeWallet from "@coral-xyz/anchor/dist/cjs/nodewallet";

export const Home: FC = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  //const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const endpoint =
    "https://devnet.helius-rpc.com/?api-key=9516866c-f53b-49f3-8f8d-c509d1ea4d75";

  const wallets = useMemo(
    () => [
      //new UnsafeBurnerWalletAdapter(),
      new PhantomWalletAdapter(),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [network]
  );

  return (
    <ConnectionProvider endpoint={endpoint}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <WalletMultiButton />
          <WalletDisconnectButton />
          <Child />
          {/* Your app's components go here, nested within the context providers. */}
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  );
};

const Child = () => {
  const { sendTransaction, publicKey } = useWallet();
  const wallet = useAnchorWallet() as NodeWallet;
  const { connection } = useConnection();

  async function send() {
    const { program, provider, authority } = getProgram(
      connection,
      wallet as AnchorWallet,
      idl,
      CONFIG.programId,
      new PublicKey(CONFIG.ownerTokenAccount),
      BonkArena as any
    );

    const [leaderboardPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("leaderboard")],
      program.programId
    );

    const leaderboardAccount = await program.account.leaderboard.fetch(
      leaderboardPda
    );
    console.log("Leaderboard Data:", {
      prizePool: leaderboardAccount.prizePool.toString(),
      players: leaderboardAccount.players,
    });
  }

  const addPrizePool = async (amount: number) => {
    const { program, provider, authority } = getProgram(
      connection,
      wallet as AnchorWallet,
      idl,
      CONFIG.programId,
      new PublicKey(CONFIG.ownerTokenAccount),
      BonkArena as any
    );

    const [leaderboardPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("leaderboard")],
      program.programId
    );

    const leaderboardAccount = await program.account.leaderboard.fetch(
      leaderboardPda
    );

    const contributorTokenAccount = await getAssociatedTokenAddress(
      leaderboardAccount.tokenMint,
      wallet.publicKey
    );

    console.log(
      "Contributor Token Account:",
      contributorTokenAccount.toString()
    );

    const tokenPoolAccount = await getAssociatedTokenAddress(
      leaderboardAccount.tokenMint,
      leaderboardPda,
      true
    );

    console.log("Token Pool Account:", tokenPoolAccount.toString());

    const tx = await program.methods
      .addPrizePool(new anchor.BN(amount))
      .accounts({
        leaderboard: leaderboardPda,
        contributorTokenAccount,
        tokenPool: tokenPoolAccount,
        contributor: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
      })
      .rpc();

    console.log("Transaction:", tx);
  };
  return (
    <div>
      <h1>Hello</h1>
      <button
        onClick={() => {
          //     const { program, provider, authority } = getProgram(connection, wallet as AnchorWallet, idl, CONFIG.programId, new PublicKey(CONFIG.ownerTokenAccount));
          // console.log(program, provider, authority);
          send();
        }}
      >
        test get program
      </button>
      <br />
      <button
        onClick={() => {
          addPrizePool(1000);
        }}
      >
        test add prize pool
      </button>
    </div>
  );
};
