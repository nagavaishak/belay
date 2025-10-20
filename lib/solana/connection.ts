// lib/solana/connection.ts
import { Connection, ConnectionConfig } from '@solana/web3.js';
import { RPC_ENDPOINTS, NETWORK_CONFIG } from '../constants';

const connectionConfig: ConnectionConfig = {
  commitment: NETWORK_CONFIG.COMMITMENT,
  confirmTransactionInitialTimeout: 60000,
};

export const connections = {
  helius: new Connection(RPC_ENDPOINTS.HELIUS, connectionConfig),
  triton: new Connection(RPC_ENDPOINTS.TRITON, connectionConfig),
  quicknode: new Connection(RPC_ENDPOINTS.QUICKNODE, connectionConfig),
  default: new Connection(RPC_ENDPOINTS.DEFAULT, connectionConfig),
};

interface RPCMetrics {
  endpoint: string;
  latency: number;
  successRate: number;
  lastChecked: number;
}

const rpcMetrics: Map<string, RPCMetrics> = new Map();

export async function selectBestRPC(): Promise<Connection> {
  return connections.default;
}

export async function testRPCLatency(connection: Connection): Promise<number> {
  const start = Date.now();
  try {
    await connection.getSlot();
    return Date.now() - start;
  } catch (error) {
    return Infinity;
  }
}

export { Connection };