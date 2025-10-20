// lib/solana/retry.ts
import { 
    Connection, 
    Transaction, 
    TransactionSignature,
    SendOptions,
    Signer 
  } from '@solana/web3.js';
  import { RETRY_CONFIG } from '../constants';
  import { 
    analyzeTransaction, 
    calculateOptimalParams, 
    optimizeTransaction,
    adjustParamsForRetry,
    OptimizationParams 
  } from './optimizer';
  import { getCurrentCongestion } from './congestion';
  
  export interface RetryResult {
    success: boolean;
    signature?: TransactionSignature;
    attempts: number;
    finalParams: OptimizationParams;
    errorLog: string[];
    timeElapsed: number;
  }
  
  /**
   * Send transaction with automatic retry and optimization
   */
  export async function sendTransactionWithRetry(
    connection: Connection,
    transaction: Transaction,
    signers: Signer[],
    options?: SendOptions
  ): Promise<RetryResult> {
    const startTime = Date.now();
    const errorLog: string[] = [];
    let lastParams: OptimizationParams | null = null;
  
    // Get current network congestion
    const congestion = await getCurrentCongestion(connection);
    console.log(`Network congestion: ${congestion.percentage}%`);
  
    // Analyze transaction
    const analysis = await analyzeTransaction(transaction);
    console.log('Transaction analysis:', analysis);
  
    // Calculate initial optimal parameters
    let currentParams = calculateOptimalParams(analysis, congestion.percentage);
    console.log('Initial params:', currentParams);
  
    for (let attempt = 1; attempt <= RETRY_CONFIG.MAX_ATTEMPTS; attempt++) {
      try {
        console.log(`\n🔄 Attempt ${attempt}/${RETRY_CONFIG.MAX_ATTEMPTS}`);
        console.log(`CU: ${currentParams.computeUnits}, Fee: ${currentParams.priorityFee.toFixed(6)} SOL`);
        
        // Optimize transaction with current parameters
        const optimizedTx = optimizeTransaction(transaction, currentParams);
        
        // Get fresh blockhash
        const { blockhash } = await connection.getLatestBlockhash();
        optimizedTx.recentBlockhash = blockhash;
        optimizedTx.feePayer = transaction.feePayer;
  
        // Sign transaction
        optimizedTx.sign(...signers);
  
        // Send transaction
        const signature = await connection.sendRawTransaction(
          optimizedTx.serialize(),
          options
        );
  
        console.log(`✅ Transaction sent: ${signature}`);
  
        // Wait for confirmation
        const confirmation = await connection.confirmTransaction(signature, 'confirmed');
  
        if (!confirmation.value.err) {
          console.log(`🎉 Transaction confirmed!`);
          return {
            success: true,
            signature,
            attempts: attempt,
            finalParams: currentParams,
            errorLog,
            timeElapsed: Date.now() - startTime,
          };
        } else {
          const error = `Transaction failed: ${JSON.stringify(confirmation.value.err)}`;
          console.error(`❌ ${error}`);
          errorLog.push(error);
          throw new Error(error);
        }
  
      } catch (error: any) {
        const errorMsg = error.message || 'Unknown error';
        console.error(`❌ Attempt ${attempt} failed: ${errorMsg}`);
        errorLog.push(`Attempt ${attempt}: ${errorMsg}`);
  
        // If this was the last attempt, return failure
        if (attempt === RETRY_CONFIG.MAX_ATTEMPTS) {
          console.log('❌ All retry attempts exhausted');
          return {
            success: false,
            attempts: attempt,
            finalParams: currentParams,
            errorLog,
            timeElapsed: Date.now() - startTime,
          };
        }
  
        // Adjust parameters for next retry
        lastParams = currentParams;
        currentParams = adjustParamsForRetry(
          currentParams,
          attempt,
          errorMsg
        );
  
        console.log(`🔧 Adjusted params: CU ${lastParams.computeUnits} → ${currentParams.computeUnits}`);
        console.log(`🔧 Adjusted fee: ${lastParams.priorityFee.toFixed(6)} → ${currentParams.priorityFee.toFixed(6)} SOL`);
  
        // Wait before retry (exponential backoff)
        const backoffTime = RETRY_CONFIG.BACKOFF_MS * attempt;
        console.log(`⏳ Waiting ${backoffTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, backoffTime));
      }
    }
  
    // This should never be reached, but TypeScript needs it
    return {
      success: false,
      attempts: RETRY_CONFIG.MAX_ATTEMPTS,
      finalParams: currentParams,
      errorLog,
      timeElapsed: Date.now() - startTime,
    };
  }
  
  /**
   * Simulate transaction to check if it will succeed
   */
  export async function simulateTransaction(
    connection: Connection,
    transaction: Transaction,
    signers: Signer[]
  ): Promise<{ success: boolean; logs?: string[]; error?: string }> {
    try {
      // Get fresh blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
  
      // Sign transaction
      transaction.sign(...signers);
  
      // Simulate
      const simulation = await connection.simulateTransaction(transaction);
  
      if (simulation.value.err) {
        return {
          success: false,
          error: JSON.stringify(simulation.value.err),
          logs: simulation.value.logs || [],
        };
      }
  
      return {
        success: true,
        logs: simulation.value.logs || [],
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message,
      };
    }
  }