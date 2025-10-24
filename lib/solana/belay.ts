// lib/solana/belay.ts
import { Connection, Transaction, Signer } from '@solana/web3.js';
import { sendWithAutoRetry } from './retryEngine';
import { sendViaMultiRPC } from './rpcRouter';
import { calculateOptimalPriorityFee, microlamportsToSOL } from './feeOptimizer';

export interface BelayOptions {
  rpcUrl?: string;
  useMultiRPC?: boolean;
  autoRetry?: boolean;
  maxRetries?: number;
}

export class Belay {
  private connection: Connection;
  private options: BelayOptions;

  constructor(options: BelayOptions = {}) {
    this.options = {
      rpcUrl: options.rpcUrl || 'https://api.mainnet-beta.solana.com',
      useMultiRPC: options.useMultiRPC ?? false, // Default to retry (simpler)
      autoRetry: options.autoRetry ?? true,
      maxRetries: options.maxRetries ?? 3
    };

    this.connection = new Connection(
        this.options.rpcUrl || 'https://api.mainnet-beta.solana.com', 
        'confirmed'
      );
  }

  async sendTransaction(
    transaction: Transaction,
    signers: Signer[]
  ): Promise<{ signature: string; attempts: number; rpc?: string }> {
    
    console.log('\n🚀 BELAY: Sending optimized transaction...\n');

    // Step 1: Optimize priority fee
    console.log('💰 Calculating optimal priority fee...');
    const optimalFee = await calculateOptimalPriorityFee(this.connection);
    console.log(`   Recommended: ${optimalFee} microlamports (${microlamportsToSOL(optimalFee).toFixed(8)} SOL)\n`);

    // Step 2: Choose routing strategy
    if (this.options.useMultiRPC) {
      console.log('🌐 Using multi-RPC routing...\n');
      const result = await sendViaMultiRPC(transaction, signers);
      return {
        signature: result.signature,
        attempts: 1,
        rpc: result.rpc
      };
    } else if (this.options.autoRetry) {
      console.log('🔄 Using auto-retry engine...\n');
      const result = await sendWithAutoRetry(
        this.connection,
        transaction,
        signers,
        { maxRetries: this.options.maxRetries }
      );
      
      if (!result.success) {
        throw new Error(result.error || 'Transaction failed');
      }

      return {
        signature: result.signature!,
        attempts: result.attempts
      };
    } else {
      // Standard send
      const signature = await this.connection.sendTransaction(transaction, signers);
      return { signature, attempts: 1 };
    }
  }
}