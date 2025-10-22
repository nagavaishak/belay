// components/DashboardSection.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import RPCHealthDashboard from './RPCHealthDashboard';
import CongestionMonitor from './CongestionMonitor';
import WalletAnalysis from './WalletAnalysis';

type DashboardCard = 'rpc' | 'network' | 'wallet' | null;

export default function DashboardSection() {
  const [activeCard, setActiveCard] = useState<DashboardCard>(null);

  const cards = [
    { id: 'rpc' as DashboardCard, title: 'RPC Network Status', subtitle: 'Multi-endpoint monitoring' },
    { id: 'network' as DashboardCard, title: 'Network Congestion', subtitle: 'Real-time tracking' },
    { id: 'wallet' as DashboardCard, title: 'Wallet Analysis', subtitle: 'Transaction history' },
  ];

  return (
    <div className="container mx-auto max-w-6xl">

<div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-px bg-gradient-to-r from-blue-500 to-transparent"></div>
        <span className="text-sm font-medium text-blue-400 uppercase tracking-wider">Live Intelligence</span>
      </div>
      
      <div className="text-center mb-12">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          Live Intelligence
        </h2>
        <p className="text-lg text-white/50">
          Click to explore real-time data
        </p>
      </div>

      {/* Clickable Cards */}
      <div className="space-y-4 mb-8">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => setActiveCard(activeCard === card.id ? null : card.id)}
            className="w-full p-6 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 text-left group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-white mb-1">{card.title}</h3>
                <p className="text-sm text-white/50">{card.subtitle}</p>
              </div>
              <ChevronDown 
                className={`w-6 h-6 text-white/60 transition-transform duration-300 ${
                  activeCard === card.id ? 'rotate-180' : ''
                }`}
              />
            </div>
          </button>
        ))}
      </div>

      {/* Expanded Content */}
      <div className="space-y-8">
        {activeCard === 'rpc' && (
          <div className="animate-scale-in">
            <RPCHealthDashboard />
          </div>
        )}
        
        {activeCard === 'network' && (
          <div className="animate-scale-in">
            <CongestionMonitor />
          </div>
        )}
        
        {activeCard === 'wallet' && (
          <div className="animate-scale-in">
            <WalletAnalysis />
          </div>
        )}
      </div>

    </div>
  );
}