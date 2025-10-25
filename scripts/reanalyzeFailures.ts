// scripts/reanalyzeFailures.ts
import fs from 'fs';
import { Connection } from '@solana/web3.js';

function parseFailureTypeBetter(error: any, logs: string[] = []): string | null {
  if (!error) return null;
  
  const errorStr = JSON.stringify(error).toLowerCase();
  const logsStr = logs.join(' ').toLowerCase();
  
  // SLIPPAGE (Most important!)
  if (errorStr.includes('slippage') || 
      logsStr.includes('slippage') ||
      logsStr.includes('price') ||
      errorStr.includes('0x1771')) {
    return 'slippage';
  }
  
  // BLOCKHASH
  if (errorStr.includes('blockhash') ||
      errorStr.includes('expired') ||
      errorStr.includes('durable')) {
    return 'blockhash_expired';
  }
  
  // COMPUTE
  if (errorStr.includes('compute') ||
      errorStr.includes('budget') ||
      logsStr.includes('exceeded')) {
    return 'compute_exceeded';
  }
  
  // Check instruction errors
  if (error.InstructionError) {
    const instructionError = error.InstructionError[1];
    if (instructionError.Custom === 6000) return 'slippage';
    if (instructionError.Custom === 6001) return 'insufficient_liquidity';
  }
  
  return 'unknown';
}

async function reanalyze() {
  console.log('🔍 Re-analyzing existing failure data...\n');
  
  // Load your existing data
  const data = JSON.parse(
    fs.readFileSync('data/ml_training_data_2025-10-25T01-01-37.853Z.json', 'utf8')
  );
  
  console.log(`📊 Total transactions: ${data.length}`);
  console.log(`❌ Failed transactions: ${data.filter((d: any) => !d.success).length}\n`);
  
  // Connect to re-fetch transaction logs
  const connection = new Connection('https://api.mainnet-beta.solana.com');
  
  let updated = 0;
  const failureTypes: Record<string, number> = {};
  
  for (const tx of data) {
    if (!tx.success) {
      try {
        // Re-fetch transaction with logs
        const fullTx = await connection.getParsedTransaction(
          tx.signature,
          { maxSupportedTransactionVersion: 0 }
        );
        
        if (fullTx?.meta) {
          const logs = fullTx.meta.logMessages || [];
          const betterType = parseFailureTypeBetter(fullTx.meta.err, logs);
          
          if (betterType && betterType !== 'unknown') {
            tx.failureType = betterType;
            updated++;
            
            failureTypes[betterType] = (failureTypes[betterType] || 0) + 1;
            console.log(`✅ ${tx.signature.slice(0, 8)}... → ${betterType}`);
          }
        }
        
        // Rate limit
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (error) {
        // Skip on error
      }
    }
  }
  
  console.log(`\n🎯 Re-analysis complete!`);
  console.log(`   Updated: ${updated} failures\n`);
  
  console.log('📊 Failure Type Breakdown:');
  Object.entries(failureTypes)
    .sort(([, a], [, b]) => b - a)
    .forEach(([type, count]) => {
      console.log(`   ${type}: ${count}`);
    });
  
  // Save updated data
  const newFilename = 'data/ml_training_data_labeled.json';
  fs.writeFileSync(newFilename, JSON.stringify(data, null, 2));
  console.log(`\n💾 Saved to: ${newFilename}`);
}

reanalyze().catch(console.error);