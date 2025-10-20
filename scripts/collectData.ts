// scripts/collectData.ts
console.log('🚀 Script is running!');
console.log('📁 Current directory:', process.cwd());

import { Connection, PublicKey } from '@solana/web3.js';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
import { config } from 'dotenv';
config({ path: '.env.local' });

const HELIUS_API_KEY = process.env.HELIUS_API_KEY || '';

console.log('🔑 API Key loaded:', HELIUS_API_KEY ? 'YES ✅' : 'NO ❌');
console.log('🔑 API Key (first 10 chars):', HELIUS_API_KEY.substring(0, 10));

const RPC_URL = HELIUS_API_KEY 
  ? `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
  : 'https://api.mainnet-beta.solana.com';

console.log('📡 RPC URL:', RPC_URL.substring(0, 50) + '...');

interface TransactionData {
  signature: string;
  programId: string;
  computeUnitsConsumed: number;
  success: boolean;
  slot: number;
  fee: number;
  accountCount: number;
}

const PROGRAMS_TO_TRACK = [
  'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB', // Jupiter
  '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8', // Raydium
];

async function collectTransactionData(limit: number = 50): Promise<TransactionData[]> {
  console.log('\n🔍 Starting data collection...');
  
  const connection = new Connection(RPC_URL, 'confirmed');
  const allData: TransactionData[] = [];

  for (const programId of PROGRAMS_TO_TRACK) {
    console.log(`\n📊 Collecting data for: ${programId.substring(0, 12)}...`);
    
    try {
      const publicKey = new PublicKey(programId);
      
      console.log('   Fetching signatures...');
      const signatures = await connection.getSignaturesForAddress(
        publicKey,
        { limit: Math.min(limit, 100) }
      );

      console.log(`   ✅ Found ${signatures.length} signatures`);

      for (let i = 0; i < Math.min(signatures.length, limit); i++) {
        try {
          const sig = signatures[i];
          
          const tx = await connection.getTransaction(sig.signature, {
            maxSupportedTransactionVersion: 0,
          });

          if (!tx || !tx.meta) continue;

          const data: TransactionData = {
            signature: sig.signature,
            programId: programId,
            computeUnitsConsumed: tx.meta.computeUnitsConsumed || 0,
            success: tx.meta.err === null,
            slot: sig.slot,
            fee: tx.meta.fee,
            accountCount: tx.transaction.message.staticAccountKeys?.length || 0,
          };

          allData.push(data);

          if ((i + 1) % 10 === 0) {
            console.log(`   Progress: ${i + 1}/${Math.min(signatures.length, limit)}`);
          }

          await new Promise(resolve => setTimeout(resolve, 200));

        } catch (error: any) {
          console.log(`   ⚠️ Skipped one transaction: ${error.message}`);
          continue;
        }
      }

      console.log(`   ✅ Collected ${allData.filter(d => d.programId === programId).length} transactions`);

    } catch (error: any) {
      console.error(`   ❌ Error collecting for ${programId}:`, error.message);
    }
  }

  return allData;
}

async function saveData(data: TransactionData[]) {
  const dataDir = path.join(process.cwd(), 'data');
  
  console.log('\n📁 Creating data directory:', dataDir);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
    console.log('   ✅ Directory created');
  } else {
    console.log('   ✅ Directory already exists');
  }

  const filePath = path.join(dataDir, 'transactions.json');
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  
  console.log(`\n💾 Saved ${data.length} transactions to:`);
  console.log(`   ${filePath}`);
}

async function main() {
  console.log('\n🚀 BELAY Data Collection Script');
  console.log('=' .repeat(50));
  
  try {
    const data = await collectTransactionData(50);
    
    if (data.length === 0) {
      console.log('\n❌ No data collected. Check your RPC connection.');
      return;
    }

    await saveData(data);

    console.log('\n📊 SUMMARY:');
    console.log('=' .repeat(50));
    console.log(`Total transactions: ${data.length}`);
    console.log(`Successful: ${data.filter(d => d.success).length}`);
    console.log(`Failed: ${data.filter(d => !d.success).length}`);
    
    console.log('\nBy Program:');
    PROGRAMS_TO_TRACK.forEach(programId => {
      const count = data.filter(d => d.programId === programId).length;
      const name = programId.includes('JUP') ? 'Jupiter' : 'Raydium';
      console.log(`  ${name}: ${count} transactions`);
    });

    console.log('\n✅ Data collection complete!');
    console.log('📊 Next: Run "npm run analyze" to build the model\n');

  } catch (error: any) {
    console.error('\n❌ Fatal Error:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

console.log('\n▶️ Starting main function...\n');
main();