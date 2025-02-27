import { getKeys } from '@/lib/utils';
import { Transaction, SystemProgram, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';


interface Transfer2SolParams {
    publicKey: PublicKey | null;
    signMessage: (() => Promise<Uint8Array>) | null;
    sendTransaction: (transaction: Transaction, connection: any) => Promise<string>;
    connection: any;
}

export const transfer2Sol = async ({ publicKey, signMessage, sendTransaction, connection }: Transfer2SolParams): Promise<void> => {
    if (!publicKey) {
        alert("Please connect your wallet!");
        return;
    }

    if (!signMessage) {
        alert("Your wallet does not support message signing. Try using Phantom or Solflare.");
        return;
    }

    const recipientAddress = "FLKwcEaLf5F67vh6QKTRYc7gXU1fdWmma9Dx5jry1Sbs"; // Change this
    const recipientPublicKey = new PublicKey(recipientAddress);

    try {
        // Create the SOL transfer transaction
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: publicKey,
                toPubkey: recipientPublicKey,
                lamports: 0.1 * LAMPORTS_PER_SOL, // 2 SOL
            })
        );

       { // Send transaction
        const {publicKey}=getKeys()
        const signature = await sendTransaction(transaction, connection);
          await fetch('/api/update', {
            method: 'POST',
            body: JSON.stringify({ publicKey: PublicKey, deposited: true }),
            headers: {
                'Content-Type': 'application/json',
            },
          })
          console.log('Transaction sent! Signature:', signature);
        //   window.location.reload()
       }
    } catch (error) {
        console.error("Transaction failed", error);
        alert("Transaction failed: " + (error as Error).message);
    }
};