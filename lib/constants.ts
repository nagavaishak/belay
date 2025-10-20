// lib/constants.ts

export const RPC_ENDPOINTS = {
    HELIUS: process.env.NEXT_PUBLIC_HELIUS_RPC || 'https://api.devnet.solana.com',
    TRITON: process.env.NEXT_PUBLIC_TRITON_RPC || 'https://api.devnet.solana.com',
    QUICKNODE: process.env.NEXT_PUBLIC_QUICKNODE_RPC || 'https://api.devnet.solana.com',
    DEFAULT: 'https://api.devnet.solana.com'
  } as const;
  
  export const NETWORK_CONFIG = {
    CLUSTER: 'devnet' as const,
    COMMITMENT: 'confirmed' as const,
    CONGESTION_THRESHOLD: 0.5,
    PERFORMANCE_SAMPLE_SIZE: 20,
  } as const;
  
  export const RETRY_CONFIG = {
    MAX_ATTEMPTS: 3,
    BACKOFF_MS: 2000,
    CU_INCREASE_FACTOR: 1.2,
    FEE_INCREASE_FACTOR: 1.5,
  } as const;
  
  export const PROGRAM_DEFAULTS: Record<string, { computeUnits: number; priorityFee: number }> = {
    // Jupiter
    'JUP4Fb2cqiRUcaTHdrPC8h2gNsA2ETXiPDD33WcGuJB': {
      computeUnits: 400000,
      priorityFee: 0.0005,
    },
    // Raydium
    '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8': {
      computeUnits: 300000,
      priorityFee: 0.0003,
    },
    // Default fallback
    'default': {
      computeUnits: 200000,
      priorityFee: 0.0001,
    },
  };