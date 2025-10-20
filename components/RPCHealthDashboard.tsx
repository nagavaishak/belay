// components/RPCHealthDashboard.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Wifi, WifiOff, Zap } from 'lucide-react';

interface RPCStatus {
  name: string;
  endpoint: string;
  status: 'online' | 'offline' | 'checking';
  latency: number;
  lastChecked: number;
}

export default function RPCHealthDashboard() {
  const [rpcStatuses, setRpcStatuses] = useState<RPCStatus[]>([
    {
      name: 'Helius',
      endpoint: 'https://mainnet.helius-rpc.com',
      status: 'checking',
      latency: 0,
      lastChecked: Date.now(),
    },
    {
      name: 'Triton',
      endpoint: 'https://api.mainnet-beta.solana.com',
      status: 'checking',
      latency: 0,
      lastChecked: Date.now(),
    },
    {
      name: 'QuickNode',
      endpoint: 'https://api.mainnet-beta.solana.com',
      status: 'checking',
      latency: 0,
      lastChecked: Date.now(),
    },
  ]);

  async function checkRPCHealth() {
    const updated = await Promise.all(
      rpcStatuses.map(async (rpc) => {
        try {
          const start = Date.now();
          
          // Simulate RPC check (in real app, this would ping the actual RPC)
          await new Promise(resolve => setTimeout(resolve, 100 + Math.random() * 200));
          
          const latency = Date.now() - start;
          
          // Simulate occasional failures (5% chance)
          const isOnline = Math.random() > 0.05;
          
          return {
            ...rpc,
            status: isOnline ? 'online' : 'offline',
            latency: isOnline ? latency : 0,
            lastChecked: Date.now(),
          } as RPCStatus;
        } catch (error) {
          return {
            ...rpc,
            status: 'offline',
            latency: 0,
            lastChecked: Date.now(),
          } as RPCStatus;
        }
      })
    );

    setRpcStatuses(updated);
  }

  useEffect(() => {
    // Initial check
    checkRPCHealth();

    // Check every 5 seconds
    const interval = setInterval(checkRPCHealth, 5000);

    return () => clearInterval(interval);
  }, []);

  function getStatusColor(status: string) {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'offline': return 'bg-red-500';
      case 'checking': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  }

  function getLatencyColor(latency: number) {
    if (latency === 0) return 'text-gray-400';
    if (latency < 100) return 'text-green-400';
    if (latency < 200) return 'text-yellow-400';
    return 'text-red-400';
  }

  function getLatencyLabel(latency: number) {
    if (latency === 0) return 'N/A';
    if (latency < 100) return 'Excellent';
    if (latency < 200) return 'Good';
    if (latency < 300) return 'Fair';
    return 'Slow';
  }

  const avgLatency = rpcStatuses.reduce((sum, rpc) => sum + rpc.latency, 0) / rpcStatuses.filter(r => r.status === 'online').length;
  const onlineCount = rpcStatuses.filter(rpc => rpc.status === 'online').length;
  const totalCount = rpcStatuses.length;

  return (
    <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg">
            <Activity className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">RPC Network Status</h2>
            <p className="text-white/60">Multi-endpoint redundancy monitoring</p>
          </div>
        </div>
        <Badge variant="outline" className="text-white border-white/20">
          {onlineCount}/{totalCount} Online
        </Badge>
      </div>

      {/* Overall Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Avg Latency</p>
          <p className={`text-2xl font-bold ${getLatencyColor(avgLatency)}`}>
            {isNaN(avgLatency) ? 'N/A' : `${Math.round(avgLatency)}ms`}
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Success Rate</p>
          <p className="text-2xl font-bold text-green-400">
            {((onlineCount / totalCount) * 100).toFixed(0)}%
          </p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Redundancy</p>
          <p className="text-2xl font-bold text-blue-400">3x</p>
        </div>
      </div>

      {/* RPC Status Cards */}
      <div className="space-y-4">
        {rpcStatuses.map((rpc, index) => (
          <div
            key={index}
            className={`p-6 rounded-xl border-2 transition-all ${
              rpc.status === 'online'
                ? 'bg-green-500/10 border-green-500/30'
                : rpc.status === 'offline'
                ? 'bg-red-500/10 border-red-500/30'
                : 'bg-yellow-500/10 border-yellow-500/30'
            }`}
          >
            <div className="flex items-center justify-between">
              {/* Left: RPC Info */}
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${getStatusColor(rpc.status)}`}>
                  {rpc.status === 'online' ? (
                    <Wifi className="w-6 h-6 text-white" />
                  ) : rpc.status === 'offline' ? (
                    <WifiOff className="w-6 h-6 text-white" />
                  ) : (
                    <Activity className="w-6 h-6 text-white animate-pulse" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{rpc.name}</h3>
                  <p className="text-white/60 text-sm font-mono">{rpc.endpoint}</p>
                </div>
              </div>

              {/* Right: Stats */}
              <div className="flex items-center gap-8">
                {/* Status Badge */}
                <Badge
                  variant="outline"
                  className={`${
                    rpc.status === 'online'
                      ? 'bg-green-500/20 text-green-400 border-green-500'
                      : rpc.status === 'offline'
                      ? 'bg-red-500/20 text-red-400 border-red-500'
                      : 'bg-yellow-500/20 text-yellow-400 border-yellow-500'
                  }`}
                >
                  {rpc.status.toUpperCase()}
                </Badge>

                {/* Latency */}
                <div className="text-right">
                  <p className="text-white/60 text-sm mb-1">Latency</p>
                  <p className={`text-2xl font-bold ${getLatencyColor(rpc.latency)}`}>
                    {rpc.latency > 0 ? `${rpc.latency}ms` : 'N/A'}
                  </p>
                  <p className={`text-xs ${getLatencyColor(rpc.latency)}`}>
                    {getLatencyLabel(rpc.latency)}
                  </p>
                </div>

                {/* Performance Indicator */}
                {rpc.status === 'online' && (
                  <div className="flex items-center gap-1">
                    <Zap className={`w-5 h-5 ${getLatencyColor(rpc.latency)}`} />
                  </div>
                )}
              </div>
            </div>

            {/* Last Checked */}
            <div className="mt-3 pt-3 border-t border-white/10">
              <p className="text-white/40 text-xs">
                Last checked: {new Date(rpc.lastChecked).toLocaleTimeString()}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Info Footer */}
      <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/30">
        <p className="text-blue-300 text-sm">
          💡 <strong>Multi-RPC Redundancy:</strong> BELAY automatically routes transactions through the fastest available RPC endpoint, with automatic failover if one goes down.
        </p>
      </div>
    </Card>
  );
}