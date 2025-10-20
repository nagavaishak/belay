// components/CongestionMonitor.tsx
'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CongestionData {
  status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  percentage: number;
  averageSlotTime: number;
  predictedInMinutes: number;
  confidence: number;
  recommendation: string;
  timestamp: number;
}

export default function CongestionMonitor() {
  const [congestion, setCongestion] = useState<CongestionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch congestion data
    async function fetchCongestion() {
      try {
        const response = await fetch('/api/congestion');
        const data = await response.json();
        setCongestion(data);
      } catch (error) {
        console.error('Error fetching congestion:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchCongestion();
    const interval = setInterval(fetchCongestion, 10000); // Update every 10s

    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'LOW': return 'bg-green-500';
      case 'MEDIUM': return 'bg-yellow-500';
      case 'HIGH': return 'bg-orange-500';
      case 'CRITICAL': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LOW': return <TrendingDown className="w-5 h-5" />;
      case 'MEDIUM': return <Minus className="w-5 h-5" />;
      case 'HIGH': return <TrendingUp className="w-5 h-5" />;
      case 'CRITICAL': return <Activity className="w-5 h-5" />;
      default: return <Activity className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10">
        <div className="animate-pulse">
          <div className="h-8 bg-white/10 rounded w-1/3 mb-4"></div>
          <div className="h-32 bg-white/10 rounded"></div>
        </div>
      </Card>
    );
  }

  if (!congestion) {
    return (
      <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10">
        <p className="text-white/60">Unable to load network status</p>
      </Card>
    );
  }

  return (
    <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10 hover:bg-white/10 transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-3 rounded-lg ${getStatusColor(congestion.status)}`}>
            {getStatusIcon(congestion.status)}
          </div>
          <div>
            <h3 className="text-2xl font-bold text-white">Network Status</h3>
            <p className="text-white/60 text-sm">Real-time monitoring • ML-powered predictions</p>
          </div>
        </div>
        <Badge variant="outline" className="text-white border-white/20">
          Live
        </Badge>
      </div>

      {/* Congestion Meter */}
      <div className="mb-6">
        <div className="flex justify-between mb-2">
          <span className="text-white/80 font-medium">{congestion.status}</span>
          <span className="text-white font-bold">{congestion.percentage}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className={`h-full ${getStatusColor(congestion.status)} transition-all duration-500`}
            style={{ width: `${congestion.percentage}%` }}
          />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Avg Slot Time</p>
          <p className="text-white text-xl font-bold">{congestion.averageSlotTime.toFixed(2)}s</p>
        </div>
        <div className="p-4 rounded-lg bg-white/5 border border-white/10">
          <p className="text-white/60 text-sm mb-1">Prediction</p>
          <p className="text-white text-xl font-bold">{congestion.predictedInMinutes} min</p>
        </div>
      </div>

      {/* Recommendation */}
      <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-green-500/10 border border-white/10">
        <p className="text-white/80 text-sm">
          💡 <strong>Recommendation:</strong> {congestion.recommendation}
        </p>
      </div>
    </Card>
  );
}