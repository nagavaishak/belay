// components/WalletAnalysis.tsx
'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Wallet, TrendingUp, Clock, DollarSign } from 'lucide-react';

interface WalletStats {
  totalTransactions: number;
  failedTransactions: number;
  failureRate: number;
  wastedSOL: number;
  wastedUSD: number;
  couldHaveSaved: number;
  netSavings: number;
  timeWasted: number;
}

export default function WalletAnalysis() {
  const { publicKey, connected } = useWallet();
  const [stats, setStats] = useState<WalletStats | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Call analyzeWallet immediately (no wallet needed for demo)
    analyzeWallet();
  }, []);

  async function analyzeWallet() {
    setLoading(true);
    
    // MOCK DATA for demo
    setTimeout(() => {
      setStats({
        totalTransactions: 247,
        failedTransactions: 52,
        failureRate: 21.1,
        wastedSOL: 0.3390,
        wastedUSD: 67.80,
        couldHaveSaved: 59.50,
        netSavings: 22.45,
        timeWasted: 104,
      });
      setLoading(false);
    }, 2000);
  }

  if (false) {
    return (
      <Card className="p-12 backdrop-blur-xl bg-white/5 border-white/10 text-center">
        <div className="max-w-md mx-auto">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Wallet className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Connect Your Wallet
          </h2>
          <p className="text-white/60 mb-8">
            See how much you've wasted on failed transactions and how much BELAY could save you.
          </p>
          <div className="flex justify-center">
            <WalletMultiButton className="!bg-gradient-to-r !from-purple-500 !to-green-500 !rounded-lg !px-8 !py-4 !text-lg !font-bold hover:!scale-105 !transition-transform" />
          </div>
        </div>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card className="p-12 backdrop-blur-xl bg-white/5 border-white/10">
        <div className="text-center">
          <div className="animate-spin w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Analyzing your transaction history...</p>
          <p className="text-white/60 text-sm mt-2">This may take a few seconds</p>
        </div>
      </Card>
    );
  }

  if (!stats) {
    return (
      <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10">
        <p className="text-white/60 text-center">Unable to load wallet data</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">Your Transaction History</h2>
            <p className="text-white/60">Last 90 days • {publicKey?.toBase58().slice(0, 8)}...</p>
          </div>
          <WalletMultiButton className="!bg-white/10" />
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="p-6 rounded-xl bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-500 rounded-lg">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/80 font-medium">Total Transactions</p>
            </div>
            <p className="text-4xl font-bold text-white">{stats.totalTransactions}</p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-red-500 rounded-lg">
                <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <p className="text-white/80 font-medium">Failed</p>
            </div>
            <p className="text-4xl font-bold text-white">{stats.failedTransactions}</p>
            <p className="text-red-400 text-sm mt-2">{stats.failureRate}% failure rate</p>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-orange-500 rounded-lg">
                <DollarSign className="w-5 h-5 text-white" />
              </div>
              <p className="text-white/80 font-medium">Money Wasted</p>
            </div>
            <p className="text-4xl font-bold text-white">${stats.wastedUSD.toFixed(2)}</p>
            <p className="text-orange-400 text-sm mt-2">{stats.wastedSOL.toFixed(4)} SOL</p>
          </div>
        </div>

        {/* Time Wasted */}
        <div className="p-6 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500 rounded-lg">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-white/80 font-medium">Time Wasted on Retries</p>
              <p className="text-white/60 text-sm">Average 2 minutes per failed transaction</p>
            </div>
          </div>
          <p className="text-3xl font-bold text-white">{stats.timeWasted} min</p>
        </div>
      </Card>

      {/* The Big Reveal - Could Have Saved */}
      <Card className="p-12 backdrop-blur-xl bg-gradient-to-br from-green-500/10 via-purple-500/10 to-green-500/10 border-2 border-green-500/30 relative overflow-hidden">
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-purple-500/20 blur-xl"></div>
        
        <div className="relative z-10 text-center">
          <p className="text-white/80 text-xl mb-4">IF YOU HAD USED BELAY:</p>
          
          <div className="mb-8">
            <p className="text-white/60 text-lg mb-2">You Could Have Saved</p>
            <p className="text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-400 to-green-200 mb-4">
              ${stats.couldHaveSaved.toFixed(2)}
            </p>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-full">
              <span className="text-white/80">BELAY Cost:</span>
              <span className="text-white font-bold">${(stats.totalTransactions * 0.15).toFixed(2)}</span>
              <span className="text-white/60">({stats.totalTransactions} × $0.15)</span>
            </div>
          </div>

          <div className="p-6 bg-green-500/20 rounded-xl border-2 border-green-500 inline-block">
            <p className="text-white/80 mb-2">NET BENEFIT</p>
            <p className="text-5xl font-bold text-green-400">${stats.netSavings.toFixed(2)}</p>
          </div>

          <div className="mt-8">
            <button className="px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg text-lg hover:scale-105 transition-transform shadow-lg shadow-green-500/50">
              Start Using BELAY →
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
}