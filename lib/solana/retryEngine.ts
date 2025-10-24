// lib/solana/retryEngine.ts
import { Connection, Transaction, Signer, SendOptions } from '@solana/web3.js';

export interface RetryOptions {
  maxRetries?: number;
  exponentialBackoff?: boolean;
}

export interface RetryResult {
  success: boolean;
  signature?: string;
  attempts: number;
  error?: string;
}

export async function sendWithAutoRetry(
  connection: Connection,
  transaction: Transaction,
  signers: Signer[],
  options: RetryOptions = {}
): Promise<RetryResult> {
  const { maxRetries = 3, exponentialBackoff = true } = options;

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🚀 Attempt ${attempt}/${maxRetries}...`);

      // CRITICAL: Get fresh blockhash on each attempt
      const { blockhash, lastValidBlockHeight } = 
        await connection.getLatestBlockhash('finalized');
      
      transaction.recentBlockhash = blockhash;
      transaction.lastValidBlockHeight = lastValidBlockHeight;

      // Re-sign with updated blockhash
      transaction.sign(...signers);

      // Send transaction
      const signature = await connection.sendRawTransaction(
        transaction.serialize(),
        { skipPreflight: false }
      );

      console.log(`   📝 Transaction sent: ${signature.slice(0, 8)}...`);

      // Wait for confirmation
      const confirmation = await connection.confirmTransaction({
        signature,
        blockhash,
        lastValidBlockHeight
      }, 'confirmed');

      if (!confirmation.value.err) {
        console.log(`   ✅ Confirmed on attempt ${attempt}`);
        return {
          success: true,
          signature,
          attempts: attempt
        };
      } else {
        throw new Error(`Transaction failed: ${JSON.stringify(confirmation.value.err)}`);
      }

    } catch (error: any) {
      lastError = error;
      console.error(`   ❌ Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        break;
      }

      // Exponential backoff: 2s, 4s, 8s
      const delay = exponentialBackoff 
        ? 2000 * Math.pow(2, attempt - 1)
        : 2000;
      
      console.log(`   ⏱️  Waiting ${delay}ms before retry...\n`);
      await sleep(delay);
    }
  }

  return {
    success: false,
    attempts: maxRetries,
    error: lastError?.message || 'Unknown error'
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}