// scripts/analyzeData.ts
console.log('🧠 Starting ML Model Training...\n');

import * as fs from 'fs';
import * as path from 'path';

interface TransactionData {
  signature: string;
  programId: string;
  computeUnitsConsumed: number;
  success: boolean;
  slot: number;
  fee: number;
  accountCount: number;
}

interface ProgramStats {
  programId: string;
  programName: string;
  totalTransactions: number;
  successfulTransactions: number;
  failedTransactions: number;
  successRate: number;
  avgComputeUnits: number;
  maxComputeUnits: number;
  minComputeUnits: number;
  p95ComputeUnits: number;
  recommendedComputeUnits: number;
  avgFee: number;
  recommendedPriorityFee: number;
  avgAccountCount: number;
}

interface MLModel {
  metadata: {
    trainingDate: string;
    totalTransactions: number;
    programs: number;
  };
  programs: Record<string, ProgramStats>;
}

function getProgramName(programId: string): string {
  const names: Record<string, string> = {
    'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB': 'Jupiter',
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': 'Raydium',
    'whirLbMiicVdio4qvUfM5KAg6Ct8VwpYzGff3uctyCc': 'Orca Whirlpool',
    'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA': 'Token Program',
  };
  return names[programId] || 'Unknown Program';
}

function calculatePercentile(values: number[], percentile: number): number {
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[index] || 0;
}

function analyzeProgram(transactions: TransactionData[]): ProgramStats {
  const programId = transactions[0].programId;
  const programName = getProgramName(programId);
  
  const successful = transactions.filter(tx => tx.success);
  const failed = transactions.filter(tx => !tx.success);
  
  // Calculate compute units statistics
  const cuValues = successful
    .map(tx => tx.computeUnitsConsumed)
    .filter(cu => cu > 0);
  
  const avgCU = cuValues.reduce((sum, cu) => sum + cu, 0) / cuValues.length;
  const maxCU = Math.max(...cuValues);
  const minCU = Math.min(...cuValues);
  const p95CU = calculatePercentile(cuValues, 95);
  
  // Recommended CU = 95th percentile + 10% safety margin
  const recommendedCU = Math.ceil(p95CU * 1.1);
  
  // Calculate fee statistics
  const avgFee = successful.reduce((sum, tx) => sum + tx.fee, 0) / successful.length;
  const avgFeeInSOL = avgFee / 1_000_000_000; // Convert lamports to SOL
  
  // Recommended priority fee (slightly higher than average)
  const recommendedPriorityFee = avgFeeInSOL * 1.2;
  
  // Account count average
  const avgAccountCount = transactions.reduce((sum, tx) => sum + tx.accountCount, 0) / transactions.length;
  
  return {
    programId,
    programName,
    totalTransactions: transactions.length,
    successfulTransactions: successful.length,
    failedTransactions: failed.length,
    successRate: (successful.length / transactions.length) * 100,
    avgComputeUnits: Math.round(avgCU),
    maxComputeUnits: maxCU,
    minComputeUnits: minCU,
    p95ComputeUnits: Math.round(p95CU),
    recommendedComputeUnits: recommendedCU,
    avgFee: avgFeeInSOL,
    recommendedPriorityFee: parseFloat(recommendedPriorityFee.toFixed(6)),
    avgAccountCount: Math.round(avgAccountCount),
  };
}

function trainModel(transactions: TransactionData[]): MLModel {
  console.log('📊 Analyzing transaction data...\n');
  
  // Group transactions by program
  const byProgram: Record<string, TransactionData[]> = {};
  
  transactions.forEach(tx => {
    if (!byProgram[tx.programId]) {
      byProgram[tx.programId] = [];
    }
    byProgram[tx.programId].push(tx);
  });
  
  // Analyze each program
  const programStats: Record<string, ProgramStats> = {};
  
  Object.keys(byProgram).forEach(programId => {
    const txs = byProgram[programId];
    console.log(`🔍 Analyzing ${getProgramName(programId)}...`);
    console.log(`   Transactions: ${txs.length}`);
    
    const stats = analyzeProgram(txs);
    programStats[programId] = stats;
    
    console.log(`   ✅ Success Rate: ${stats.successRate.toFixed(1)}%`);
    console.log(`   ⚡ Avg CU: ${stats.avgComputeUnits.toLocaleString()}`);
    console.log(`   📈 Recommended CU: ${stats.recommendedComputeUnits.toLocaleString()}`);
    console.log('');
  });
  
  return {
    metadata: {
      trainingDate: new Date().toISOString(),
      totalTransactions: transactions.length,
      programs: Object.keys(programStats).length,
    },
    programs: programStats,
  };
}

function saveModel(model: MLModel) {
  const dataDir = path.join(process.cwd(), 'data');
  const modelPath = path.join(dataDir, 'model.json');
  
  fs.writeFileSync(modelPath, JSON.stringify(model, null, 2));
  
  console.log('💾 Model saved to:', modelPath);
}

function printModelSummary(model: MLModel) {
  console.log('\n' + '='.repeat(60));
  console.log('🎓 ML MODEL TRAINING COMPLETE!');
  console.log('='.repeat(60));
  console.log('\n📊 Model Statistics:');
  console.log(`   Training Date: ${new Date(model.metadata.trainingDate).toLocaleString()}`);
  console.log(`   Total Transactions Analyzed: ${model.metadata.totalTransactions}`);
  console.log(`   Programs Trained: ${model.metadata.programs}`);
  
  console.log('\n🎯 Program Recommendations:\n');
  
  Object.values(model.programs).forEach(program => {
    console.log(`📦 ${program.programName}`);
    console.log(`   Program ID: ${program.programId.substring(0, 20)}...`);
    console.log(`   Success Rate: ${program.successRate.toFixed(1)}%`);
    console.log(`   Avg Compute Units: ${program.avgComputeUnits.toLocaleString()}`);
    console.log(`   Recommended CU: ${program.recommendedComputeUnits.toLocaleString()} (95th percentile + 10%)`);
    console.log(`   Recommended Priority Fee: ${program.recommendedPriorityFee} SOL`);
    console.log(`   Avg Accounts: ${program.avgAccountCount}`);
    console.log('');
  });
  
  console.log('='.repeat(60));
  console.log('✅ Model is ready to use!');
  console.log('📁 Location: data/model.json');
  console.log('\n💡 Next steps:');
  console.log('   1. The model is automatically loaded by your app');
  console.log('   2. Test the optimizer with real transactions');
  console.log('   3. Record your demo video!');
  console.log('='.repeat(60) + '\n');
}

async function main() {
  try {
    // Load transaction data
    const dataPath = path.join(process.cwd(), 'data', 'transactions.json');
    
    if (!fs.existsSync(dataPath)) {
      console.log('❌ No transaction data found!');
      console.log('   Run "npm run collect" first to collect data.');
      return;
    }
    
    console.log('📂 Loading transaction data...');
    const rawData = fs.readFileSync(dataPath, 'utf-8');
    const transactions: TransactionData[] = JSON.parse(rawData);
    console.log(`   ✅ Loaded ${transactions.length} transactions\n`);
    
    // Train the model
    const model = trainModel(transactions);
    
    // Save the model
    saveModel(model);
    
    // Print summary
    printModelSummary(model);
    
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    console.error(error.stack);
  }
}

main();