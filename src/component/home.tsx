"use client";
import React, { FC, useMemo } from 'react';
import { ConnectionProvider, WalletProvider, useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { UnsafeBurnerWalletAdapter, PhantomWalletAdapter } from '@solana/wallet-adapter-wallets';
import idl  from "./idl.json";
import token_idl from "./token_idl.json";
import {
    WalletModalProvider,
    WalletDisconnectButton,
    WalletMultiButton
} from '@solana/wallet-adapter-react-ui';
import * as anchor from '@coral-xyz/anchor';
import { Connection, PublicKey, Transaction, clusterApiUrl } from '@solana/web3.js';
import { getProgram } from './transaction';
import { AnchorWallet } from "@solana/wallet-adapter-react";
import { BonkArena } from "../config/bonk_arena";
import { TestToken } from "../config/test_token";
// Default styles that can be overridden by your app
import "@solana/wallet-adapter-react-ui/styles.css";
import { CONFIG } from '@/config/config';
import { createAssociatedTokenAccount, createAssociatedTokenAccountInstruction, getAssociatedTokenAddress, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID} from '@solana/spl-token';
import { token } from '@coral-xyz/anchor/dist/cjs/utils';
import NodeWallet from '@coral-xyz/anchor/dist/cjs/nodewallet';

export const Home: FC = () => {
    // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
    const network = WalletAdapterNetwork.Devnet;

    // You can also provide a custom RPC endpoint.
    //const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const endpoint = "https://devnet.helius-rpc.com/?api-key=9516866c-f53b-49f3-8f8d-c509d1ea4d75";

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
                    { /* Your app's components go here, nested within the context providers. */}
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
};

const Child = () => {
    const { sendTransaction, publicKey } = useWallet();
    const wallet = useAnchorWallet() as NodeWallet;
    const {connection} = useConnection();
    async function send() {
        if (!publicKey) {
            return;
        }
        const { program, provider, authority } = getProgram(connection, wallet as AnchorWallet, idl, CONFIG.programId, new PublicKey(CONFIG.ownerTokenAccount), BonkArena as any);
        const tokenProgramWrapper = getProgram(connection, wallet as AnchorWallet, token_idl, CONFIG.tokenProgram, new PublicKey(CONFIG.ownerTokenAccount), TestToken as any);
        const tokenProgram = tokenProgramWrapper.program;
        const leaderboardKeypair = anchor.web3.Keypair.generate();
        console.log(program, provider, authority);

        let tokenPool;
        console.log("send transaction");

        try {
            // 准备测试用户的代币账户
            const contributor = wallet;//anchor.web3.Keypair.generate();
            
            // 先给贡献者足够的 SOL
            const signature = await provider.connection.requestAirdrop(
                publicKey,
                2 * anchor.web3.LAMPORTS_PER_SOL
            );
            console.log("air drop first")
            await provider.connection.confirmTransaction(signature);
    
            console.log("air drop you")
            // 为测试用户创建代币账户
            const contributorTokenAccount = getAssociatedTokenAddressSync(
                new PublicKey(CONFIG.mintToken),
                publicKey
            );
    
            // 创建代币账户
            console.log("payer die")
            const payer = (provider.wallet as anchor.Wallet).payer;
            const instruction = createAssociatedTokenAccountInstruction(
                publicKey,
                contributorTokenAccount,
                publicKey,
                new PublicKey(CONFIG.mintToken),
                undefined,
            )
            const tx = new Transaction();
            tx.add(instruction);
            sendTransaction(tx, connection);

            console.log("payer alive")
            // 从主账户铸造代币给贡献者
            const mintAmount = new anchor.BN(1_000_000);
            console.log("zero step")
            await tokenProgram.methods
                .mintTokens(mintAmount)
                .accounts({
                    mint: new PublicKey(CONFIG.mintToken),
                    tokenAccount: contributorTokenAccount,
                    authority: wallet?.publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .transaction();
                
            // 等待交易确认
            console.log("first step");
    
            // 记录添加前的奖金池金额
            const beforePrizePool = (await program.account.leaderboard.fetch(
                leaderboardKeypair.publicKey
            )).prizePool;
    
            console.log(beforePrizePool)
            // 添加代币到奖金��
            tokenPool = await getAssociatedTokenAddress(
                new PublicKey(CONFIG.mintToken),
                leaderboardKeypair.publicKey,
                true // allowOwnerOffCurve = true for PDA
              );
            const addAmount = new anchor.BN(500_000);
            await program.methods
                .addPrizePool(addAmount)
                .accounts({
                    leaderboard: leaderboardKeypair.publicKey,
                    contributorTokenAccount: contributorTokenAccount,
                    tokenPool: tokenPool,
                    contributor: publicKey,
                    tokenProgram: TOKEN_PROGRAM_ID,
                })
                .signers([contributor])
                .transaction();
    
            // 等待交易确认
            await new Promise(resolve => setTimeout(resolve, 1000));
    
            // 验证奖金池金额是否正确增加
            const afterPrizePool = (await program.account.leaderboard.fetch(
                leaderboardKeypair.publicKey
            )).prizePool;
            console.log(afterPrizePool)
    
        } catch (error) {
            console.error("Add prize pool error:", error);
            throw error;
        }
    }
    return (
        <div>
            <h1>
                Hello
            </h1>
                <button onClick={() => {
                //     const { program, provider, authority } = getProgram(connection, wallet as AnchorWallet, idl, CONFIG.programId, new PublicKey(CONFIG.ownerTokenAccount));
                // console.log(program, provider, authority);
                    send()
                }}>test get program</button>
        </div >
    );
};

