"use client";
import React, { FC, useMemo }from "react";
import { PublicKey } from "@solana/web3.js";
import { ConnectionProvider, WalletProvider, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react";
import * as anchor from "@coral-xyz/anchor";
import { getProgram } from "@/utils/transaction";
import { CONFIG } from "@/config/config";
import {
  getLeaderboard,
  addPrizePool,
  startGame,
  endGame,
  claimPrize
} from "@/utils/gameAction";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import {
  UnsafeBurnerWalletAdapter,
  PhantomWalletAdapter,
} from "@solana/wallet-adapter-wallets";
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";


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
  const wallet = useAnchorWallet();
  const { connection } = useConnection();

  if (!wallet || !wallet.publicKey) {
    return <p>Please connect your wallet to access this feature.</p>;
  }

  const { program } = getProgram(
    connection,
    wallet,
    CONFIG.idl,
    CONFIG.programId,
    new PublicKey(CONFIG.ownerTokenAccount)
  );

  const [leaderboardPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("leaderboard")],
    program.programId
  );

  const [gameSessionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("player_session"), wallet.publicKey.toBuffer()],
    program.programId
  );

  return (
    <div>
      <button onClick={() => getLeaderboard(program, leaderboardPda)}>
        Get Leaderboard
      </button>
      <br />
      <button onClick={() => addPrizePool(program, leaderboardPda, wallet, 1000)}>
        Add Prize Pool
      </button>
      <br />
      <button
        onClick={() =>
          startGame(program, leaderboardPda, gameSessionPda, wallet, "Game 1")
        }
      >
        Start Game
      </button>
      <br />
      <button onClick={() => endGame(program, leaderboardPda, gameSessionPda, wallet, 100000)}>
        End Game
      </button>
      <br />
      <button onClick={() => claimPrize(program, leaderboardPda,  wallet)}>
        claim Prize
      </button>
    </div>
  );
};
