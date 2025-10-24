// scripts/testBelay.ts
import { Connection, Keypair, SystemProgram, Transaction } from '@solana/web3.js';
import { Belay } from '../lib/solana/belay';

async function testBelay() {
  console.log('🧪 Testing BELAY on Devnet...\n');

  // Connect to devnet
  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Create test wallet (you'll need devnet SOL for this)
  const payer = Keypair.generate();
  console.log('📝 Test wallet:', payer.publicKey.toString());

  // Request airdrop
  console.log('💰 Requesting devnet airdrop...');
  const airdropSig = await connection.requestAirdrop(payer.publicKey, 1000000000); // 1 SOL
  await connection.confirmTransaction(airdropSig);
  console.log('✅ Airdrop confirmed\n');

  // Create simple transfer transaction
  const recipient = Keypair.generate();
  const transaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: recipient.publicKey,
      lamports: 1000000 // 0.001 SOL
    })
  );

  // Initialize BELAY
  const belay = new Belay({
    rpcUrl: 'https://api.devnet.solana.com',
    autoRetry: true,
    maxRetries: 3
  });

  // Send with BELAY
  try {
    const result = await belay.sendTransaction(transaction, [payer]);
    
    console.log('\n✅ TRANSACTION SUCCESSFUL!');
    console.log(`   Signature: ${result.signature}`);
    console.log(`   Attempts: ${result.attempts}`);
    console.log(`   Explorer: https://explorer.solana.com/tx/${result.signature}?cluster=devnet`);
  } catch (error) {
    console.error('\n❌ TRANSACTION FAILED:', error);
  }
}

testBelay().catch(console.error);