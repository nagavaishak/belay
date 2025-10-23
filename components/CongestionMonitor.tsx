// components/CongestionMonitor.tsx
'use client';

import { useState, useEffect } from 'react';
import { Activity } from 'lucide-react';
import { getRealNetworkMetrics } from '@/lib/solana/network';

export default function CongestionMonitor() {
  const [metrics, setMetrics] = useState({
    slotTime: 420,
    congestion: 32,
    status: 'optimal' as 'optimal' | 'moderate' | 'high'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await getRealNetworkMetrics();
        setMetrics(data);
      } catch (error) {
        console.error('Failed to fetch metrics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchMetrics, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (metrics.status) {
      case 'optimal': return 'from-green-500 to-emerald-500';
      case 'moderate': return 'from-yellow-500 to-orange-500';
      case 'high': return 'from-red-500 to-rose-500';
    }
  };

  const getStatusLabel = () => {
    switch (metrics.status) {
      case 'optimal': return 'OPTIMAL';
      case 'moderate': return 'MODERATE';
      case 'high': return 'HIGH';
    }
  };

  const getPrediction = () => {
    if (metrics.congestion < 30) return '< 1 min';
    if (metrics.congestion < 70) return '2-3 min';
    return '5+ min';
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm p-6 hover:border-white/20 transition-all">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-xl bg-gradient-to-br ${getStatusColor()}`}>
            <Activity className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Network Status</h3>
            <p className="text-xs text-white/40">Real-time Solana Mainnet-Beta</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/30">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          <span className="text-xs text-green-400 font-medium">Live</span>
        </div>
      </div>

      {/* Status Bar */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-white/60">Congestion Level</span>
          <span className="text-xl font-bold text-white">{metrics.congestion}%</span>
        </div>
        <div className="h-2 bg-white/5 rounded-full overflow-hidden">
          <div 
            className={`h-full bg-gradient-to-r ${getStatusColor()} transition-all duration-500 rounded-full`}
            style={{ width: `${metrics.congestion}%` }}
          />
        </div>
        <div className="mt-2 text-xs text-white/40 text-right">{getStatusLabel()}</div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xs text-white/40 mb-1">Avg Slot Time</div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? '...' : `${(metrics.slotTime / 1000).toFixed(2)}s`}
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white/5 border border-white/5">
          <div className="text-xs text-white/40 mb-1">Est. Confirmation</div>
          <div className="text-2xl font-bold text-white">
            {isLoading ? '...' : getPrediction()}
          </div>
        </div>
      </div>

      {/* Recommendation */}
      <div className={`mt-4 p-3 rounded-lg border ${
        metrics.status === 'optimal' 
          ? 'bg-green-500/10 border-green-500/20' 
          : metrics.status === 'moderate'
          ? 'bg-yellow-500/10 border-yellow-500/20'
          : 'bg-red-500/10 border-red-500/20'
      }`}>
        <div className="flex items-start gap-2">
          <span className="text-base">💡</span>
          <div className="text-xs text-white/70">
            {metrics.status === 'optimal' && 'Network is optimal. Good time for transactions.'}
            {metrics.status === 'moderate' && 'Moderate congestion. BELAY will adjust parameters.'}
            {metrics.status === 'high' && 'High congestion. BELAY optimization strongly recommended.'}
          </div>
        </div>
      </div>

    </div>
  );
}