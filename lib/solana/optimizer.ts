// lib/solana/optimizer.ts
import { 
  Transaction, 
  ComputeBudgetProgram,
  TransactionInstruction 
} from '@solana/web3.js';
import { PROGRAM_DEFAULTS } from '../constants';
import fs from 'fs';
import path from 'path';

// Load ML model
let ML_MODEL: any = null;
try {
  const modelPath = path.join(process.cwd(), 'data', 'model.json');
  if (fs.existsSync(modelPath)) {
    const modelData = fs.readFileSync(modelPath, 'utf-8');
    ML_MODEL = JSON.parse(modelData);
    console.log('✅ ML Model loaded successfully!');
  }
} catch (error) {
  console.log('⚠️ ML Model not found, using defaults');
}

export interface OptimizationParams {
  computeUnits: number;
  priorityFee: number;
  confidence: 'low' | 'medium' | 'high';
  reasoning: string;
}

export interface TransactionAnalysis {
  programIds: string[];
  accountCount: number;
  instructionCount: number;
  estimatedCU: number;
  recommendedCU: number;
  recommendedPriorityFee: number;
}
  
  /**
   * Analyze a transaction and predict optimal parameters
   */
  export async function analyzeTransaction(
    transaction: Transaction
  ): Promise<TransactionAnalysis> {
    const instructions = transaction.instructions;
    const programIds = new Set<string>();
    let totalAccounts = 0;
  
    for (const instruction of instructions) {
      programIds.add(instruction.programId.toBase58());
      totalAccounts += instruction.keys.length;
    }
  
    const programIdArray = Array.from(programIds);
    
    let estimatedCU = 0;
    let confidence: 'low' | 'medium' | 'high' = 'medium';
    
    // 🧠 USE ML MODEL IF AVAILABLE
    for (const programId of programIdArray) {
      if (ML_MODEL && ML_MODEL.programs[programId]) {
        // Use ML model prediction
        const programData = ML_MODEL.programs[programId];
        estimatedCU += programData.recommendedComputeUnits;
        confidence = 'high';
        console.log(`🧠 ML Model: ${programData.programName} needs ${programData.recommendedComputeUnits} CU`);
      } else if (PROGRAM_DEFAULTS[programId]) {
        // Fallback to known defaults
        estimatedCU += PROGRAM_DEFAULTS[programId].computeUnits;
        confidence = 'medium';
      } else {
        // Unknown program
        estimatedCU += PROGRAM_DEFAULTS.default.computeUnits;
        confidence = 'low';
      }
    }
  
    const complexityFactor = Math.min(1 + (totalAccounts / 20), 1.5);
    const recommendedCU = Math.ceil(estimatedCU * complexityFactor);
  
    const baseFee = 0.0001;
    const recommendedPriorityFee = baseFee * (totalAccounts / 10);
  
    return {
      programIds: programIdArray,
      accountCount: totalAccounts,
      instructionCount: instructions.length,
      estimatedCU,
      recommendedCU,
      recommendedPriorityFee,
    };
  }
  
  /**
   * Optimize transaction by adding compute budget instructions
   */
  export function optimizeTransaction(
    transaction: Transaction,
    params: OptimizationParams
  ): Transaction {
    const optimized = new Transaction();
  
    // Add compute budget instructions at the start
    optimized.add(
      ComputeBudgetProgram.setComputeUnitLimit({
        units: params.computeUnits,
      })
    );
  
    optimized.add(
      ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: Math.floor(params.priorityFee * 1_000_000),
      })
    );
  
    // Add original instructions
    for (const instruction of transaction.instructions) {
      optimized.add(instruction);
    }
  
    // Copy recent blockhash and fee payer
    optimized.recentBlockhash = transaction.recentBlockhash;
    optimized.feePayer = transaction.feePayer;
  
    return optimized;
  }
  
  /**
   * Calculate optimal parameters based on network conditions
   */
  export function calculateOptimalParams(
    analysis: TransactionAnalysis,
    congestionLevel: number
  ): OptimizationParams {
    // Adjust CU based on congestion
    const congestionMultiplier = 1 + (congestionLevel / 100) * 0.3;
    const computeUnits = Math.ceil(analysis.recommendedCU * congestionMultiplier);
  
    // Adjust priority fee based on congestion
    const feeMultiplier = 1 + (congestionLevel / 100) * 2;
    const priorityFee = analysis.recommendedPriorityFee * feeMultiplier;
  
    let confidence: 'low' | 'medium' | 'high' = 'medium';
    let reasoning = '';
  
    if (congestionLevel < 20) {
      confidence = 'high';
      reasoning = 'Low congestion - standard parameters';
    } else if (congestionLevel < 50) {
      confidence = 'medium';
      reasoning = 'Moderate congestion - slightly increased parameters';
    } else if (congestionLevel < 80) {
      confidence = 'medium';
      reasoning = 'High congestion - significantly increased parameters';
    } else {
      confidence = 'low';
      reasoning = 'Critical congestion - maximum parameters recommended';
    }
  
    return {
      computeUnits,
      priorityFee,
      confidence,
      reasoning,
    };
  }
  
  /**
   * Smart parameter adjustment for retry attempts
   */
  export function adjustParamsForRetry(
    params: OptimizationParams,
    attemptNumber: number,
    failureReason?: string
  ): OptimizationParams {
    const cuMultiplier = 1 + (attemptNumber * 0.2);
    const feeMultiplier = 1 + (attemptNumber * 0.5);
  
    let reasoning = `Retry attempt ${attemptNumber}: `;
  
    if (failureReason?.includes('compute')) {
      // CU-related failure
      reasoning += 'Increased compute units significantly';
      return {
        computeUnits: Math.ceil(params.computeUnits * 1.5),
        priorityFee: params.priorityFee * 1.2,
        confidence: 'medium',
        reasoning,
      };
    } else if (failureReason?.includes('fee') || failureReason?.includes('priority')) {
      // Fee-related failure
      reasoning += 'Increased priority fee significantly';
      return {
        computeUnits: Math.ceil(params.computeUnits * 1.1),
        priorityFee: params.priorityFee * 2,
        confidence: 'medium',
        reasoning,
      };
    } else {
      // Generic failure - increase both
      reasoning += 'Increased both CU and priority fee';
      return {
        computeUnits: Math.ceil(params.computeUnits * cuMultiplier),
        priorityFee: params.priorityFee * feeMultiplier,
        confidence: 'low',
        reasoning,
      };
    }
  }