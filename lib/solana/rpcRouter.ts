// lib/solana/rpcRouter.ts
import { Connection, Transaction, Signer } from '@solana/web3.js';

interface RPCEndpoint {
  name: string;
  url: string;
  priority: number;
}

const RPC_ENDPOINTS: RPCEndpoint[] = [
  {
    name: 'Mainnet-Beta',
    url: 'https://api.mainnet-beta.solana.com',
    priority: 1
  },
  {
    name: 'Helius-Free',
    url: 'https://mainnet.helius-rpc.com/?api-key=demo',
    priority: 2
  }
];

export async function sendViaMultiRPC(
  transaction: Transaction,
  signers: Signer[]
): Promise<{ signature: string; rpc: string }> {
  
  const sortedEndpoints = [...RPC_ENDPOINTS].sort((a, b) => a.priority - b.priority);

  for (const endpoint of sortedEndpoints) {
    try {
      console.log(`🔄 Trying ${endpoint.name}...`);
      
      const connection = new Connection(endpoint.url, 'confirmed');
      
      // Get blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.sign(...signers);

      // Send
      const signature = await connection.sendTransaction(transaction, signers);
      
      console.log(`✅ Success via ${endpoint.name}: ${signature.slice(0, 8)}...`);
      
      return { signature, rpc: endpoint.name };

    } catch (error: any) {
      console.error(`❌ ${endpoint.name} failed:`, error.message);
      continue;
    }
  }

  throw new Error('All RPC endpoints failed');
}