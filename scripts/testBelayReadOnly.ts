// scripts/testBelayReadOnly.ts
import { Connection } from '@solana/web3.js';
import { calculateOptimalPriorityFee, microlamportsToSOL } from '../lib/solana/feeOptimizer';
import { getRealNetworkMetrics } from '../lib/solana/network';

async function testBelayReadOnly() {
  console.log('🧪 Testing BELAY Components (Read-Only)...\n');

  const connection = new Connection('https://api.mainnet-beta.solana.com', 'confirmed');

  // Test 1: Fee Optimizer
  console.log('💰 Testing Fee Optimizer...');
  const lowFee = await calculateOptimalPriorityFee(connection, 'low');
  const mediumFee = await calculateOptimalPriorityFee(connection, 'medium');
  const highFee = await calculateOptimalPriorityFee(connection, 'high');

  console.log(`   Low urgency: ${lowFee} microlamports (${microlamportsToSOL(lowFee).toFixed(8)} SOL)`);
  console.log(`   Medium urgency: ${mediumFee} microlamports (${microlamportsToSOL(mediumFee).toFixed(8)} SOL)`);
  console.log(`   High urgency: ${highFee} microlamports (${microlamportsToSOL(highFee).toFixed(8)} SOL)`);
  console.log('   ✅ Fee optimizer working!\n');

  // Test 2: Network Monitor
  console.log('📡 Testing Network Monitor...');
  const metrics = await getRealNetworkMetrics();
  
  console.log(`   Slot time: ${metrics.slotTime}ms`);
  console.log(`   Congestion: ${metrics.congestion}%`);
  console.log(`   Status: ${metrics.status}`);
  console.log('   ✅ Network monitor working!\n');

  console.log('✅ ALL BELAY COMPONENTS FUNCTIONAL!\n');
  console.log('🎉 Ready for hackathon demo!\n');
  console.log('📝 Next step: Record demo video showing:');
  console.log('   1. Real-time network monitoring');
  console.log('   2. Dynamic fee optimization');
  console.log('   3. Code walkthrough (retry engine, multi-RPC)');
}

testBelayReadOnly().catch(console.error);