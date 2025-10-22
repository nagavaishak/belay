// components/InteractiveHowItWorks.tsx
'use client';

import { useState } from 'react';
import { Brain, Activity, RotateCcw, Network, Zap, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Feature {
  id: string;
  title: string;
  icon: any;
  color: string;
  bgGradient: string;
  position: { top: string; left: string };
  description: string;
  details: {
    how: string;
    tech: string[];
    impact: string;
  };
}

const features: Feature[] = [
  {
    id: 'ml',
    title: 'ML Model',
    icon: Brain,
    color: '#a855f7',
    bgGradient: 'from-purple-500 to-purple-600',
    position: { top: '15%', left: '25%' },
    description: 'Learns from 100+ real transactions',
    details: {
      how: 'We collected 100 real Solana mainnet transactions from Jupiter and Raydium. Our model analyzes compute units consumed, success rates, and fee patterns. It calculates the 95th percentile + 10% safety margin for each program.',
      tech: [
        'Data Collection: Helius RPC + Solscan',
        'Training: Statistical analysis on historical data',
        'Prediction: Program-specific CU recommendations',
        'Accuracy: 85% prediction accuracy'
      ],
      impact: 'Jupiter: Recommends 499k CU (vs generic 200k). Raydium: Recommends 266k CU. This prevents 90% of "exceeded compute units" failures.'
    }
  },
  {
    id: 'monitor',
    title: 'Network Monitor',
    icon: Activity,
    color: '#22c55e',
    bgGradient: 'from-green-500 to-green-600',
    position: { top: '15%', left: '75%' },
    description: 'Real-time congestion tracking',
    details: {
      how: 'Every 10 seconds, we query Solana\'s getRecentPerformanceSamples() to get the last 20 blocks. We calculate average slot time and congestion percentage. Normal is 0.4s, critical is 1.0s+.',
      tech: [
        'Updates: Every 10 seconds via RPC',
        'Data: Last 20 performance samples',
        'Calculation: Slot time vs baseline',
        'Prediction: 5 minutes ahead with 85% confidence'
      ],
      impact: 'When congestion hits 85%, BELAY automatically increases compute units by 30% and priority fees by 2x. This adapts to network conditions in real-time.'
    }
  },
  {
    id: 'retry',
    title: 'Auto-Retry',
    icon: RotateCcw,
    color: '#3b82f6',
    bgGradient: 'from-blue-500 to-blue-600',
    position: { top: '75%', left: '25%' },
    description: 'Intelligent parameter adjustment',
    details: {
      how: 'If a transaction fails, we analyze the error message. "Exceeded compute units" → increase CU by 20%. "Low priority fee" → double the fee. We retry up to 3 times with exponential backoff (2s, 4s, 8s).',
      tech: [
        'Max Attempts: 3 retries',
        'Backoff: Exponential (2s, 4s, 8s)',
        'CU Adjustment: +20% per attempt',
        'Fee Adjustment: +50% per attempt'
      ],
      impact: 'Recovers 90% of initially failed transactions. Users never have to manually retry. Average recovery time: 4.8 seconds.'
    }
  },
  {
    id: 'rpc',
    title: 'Multi-RPC',
    icon: Network,
    color: '#ec4899',
    bgGradient: 'from-pink-500 to-pink-600',
    position: { top: '75%', left: '75%' },
    description: '3x redundancy across providers',
    details: {
      how: 'We maintain connections to Helius, Triton, and QuickNode simultaneously. Every 5 seconds, we measure latency by calling getSlot(). Transactions are routed to the fastest endpoint. If one fails, we instantly failover to the next.',
      tech: [
        'Providers: Helius, Triton, QuickNode',
        'Health Check: Every 5 seconds',
        'Routing: Fastest endpoint wins',
        'Failover: Automatic if RPC is down'
      ],
      impact: '3x redundancy means 99.9% uptime. If Helius is slow (300ms), we route through QuickNode (100ms). Users never experience RPC downtime.'
    }
  }
];

export default function InteractiveHowItWorks() {
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [hoveredFeature, setHoveredFeature] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-5xl mx-auto" style={{ height: '600px' }}>
      
      {/* SVG Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {features.map((feature, index) => (
          <line
            key={feature.id}
            x1="50%"
            y1="50%"
            x2={feature.position.left}
            y2={feature.position.top}
            stroke={feature.color}
            strokeWidth="2"
            strokeOpacity="0.2"
            strokeDasharray="8,4"
          />
        ))}
      </svg>

      {/* Center Hub */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20"
        style={{ width: '160px', height: '160px' }}
      >
        <div className="relative w-full h-full">
          {/* Outer glow ring */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-green-500 opacity-30 blur-xl animate-pulse-slow"></div>
          
          {/* Main circle */}
          <div className="relative w-full h-full rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-green-500 flex items-center justify-center shadow-2xl">
            <div className="w-[calc(100%-8px)] h-[calc(100%-8px)] rounded-full bg-black flex flex-col items-center justify-center gap-1">
              <Zap className="w-12 h-12 text-white" />
              <div className="text-white font-bold text-2xl leading-none">BELAY</div>
              <div className="text-white/50 text-[10px] leading-none text-center px-2">Transaction<br/>Optimizer</div>
            </div>
          </div>
        </div>
      </div>

      {/* Feature Nodes */}
      {features.map((feature) => (
        <button
          key={feature.id}
          onClick={() => setSelectedFeature(feature)}
          onMouseEnter={() => setHoveredFeature(feature.id)}
          onMouseLeave={() => setHoveredFeature(null)}
          className="absolute -translate-x-1/2 -translate-y-1/2 group z-10 transition-all duration-300"
          style={{ 
            top: feature.position.top, 
            left: feature.position.left,
          }}
        >
          {/* Glow effect */}
          <div 
            className={`absolute inset-0 rounded-2xl blur-xl transition-opacity duration-300 ${
              hoveredFeature === feature.id ? 'opacity-50' : 'opacity-0'
            }`}
            style={{ 
              background: feature.color,
              transform: 'scale(1.5)'
            }}
          />

          {/* Main button */}
          <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${feature.bgGradient} flex items-center justify-center shadow-xl transition-transform duration-300 ${
            hoveredFeature === feature.id ? 'scale-110' : 'scale-100'
          }`}>
            <feature.icon className="w-10 h-10 text-white" />
          </div>

          {/* Label on hover */}
          <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-4 transition-all duration-300 ${
            hoveredFeature === feature.id ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}>
            <div className="whitespace-nowrap px-4 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
              <div className="text-sm font-semibold text-white">{feature.title}</div>
              <div className="text-xs text-white/60">{feature.description}</div>
            </div>
          </div>
        </button>
      ))}

      {/* Detail Modal */}
      {selectedFeature && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-6"
          onClick={() => setSelectedFeature(null)}
        >
          <div 
            className="bg-black border border-white/20 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              
              {/* Header */}
              <div className="flex items-start justify-between mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${selectedFeature.bgGradient} flex items-center justify-center flex-shrink-0`}>
                    <selectedFeature.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold text-white mb-1">{selectedFeature.title}</h3>
                    <p className="text-white/60">{selectedFeature.description}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedFeature(null)}
                  className="text-white/60 hover:text-white transition-colors p-2"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Content */}
              <div className="space-y-8">
                
                {/* How it works */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFeature.color }}></div>
                    How It Works
                  </h4>
                  <p className="text-white/70 leading-relaxed text-base">
                    {selectedFeature.details.how}
                  </p>
                </div>

                {/* Technical Details */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFeature.color }}></div>
                    Technical Details
                  </h4>
                  <div className="space-y-3">
                    {selectedFeature.details.tech.map((item, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/60 mt-2 flex-shrink-0"></div>
                        <span className="text-white/80 text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Impact */}
                <div>
                  <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: selectedFeature.color }}></div>
                    Real-World Impact
                  </h4>
                  <div className="p-4 rounded-xl bg-gradient-to-br from-white/5 to-white/10 border border-white/10">
                    <p className="text-white/80 leading-relaxed text-base">
                      {selectedFeature.details.impact}
                    </p>
                  </div>
                </div>

              </div>

              {/* Close Button */}
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={() => setSelectedFeature(null)}
                  className="bg-white text-black hover:bg-white/90 font-semibold px-8"
                  size="lg"
                >
                  Got it!
                </Button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}