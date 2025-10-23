// components/DashboardSection.tsx
'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import RPCHealthDashboard from './RPCHealthDashboard';
import CongestionMonitor from './CongestionMonitor';
import WalletAnalysis from './WalletAnalysis';

type Section = 'rpc' | 'congestion' | 'wallet' | null;

export default function DashboardSection() {
  const [expandedSection, setExpandedSection] = useState<Section>(null);

  const toggleSection = (section: Section) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="container mx-auto max-w-6xl">
      
      {/* Section label */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-px bg-gradient-to-r from-cyan-500 to-transparent"></div>
        <span className="text-sm font-medium text-cyan-400 uppercase tracking-wider">Live Dashboard</span>
      </div>

      <div className="text-center mb-12">
        <h2 className="text-5xl md:text-6xl font-bold mb-6">
          Real-time monitoring
        </h2>
        <p className="text-xl text-white/50 max-w-3xl mx-auto">
          Click any card to explore live network data, RPC health metrics, and transaction analysis
        </p>
      </div>

      <div className="space-y-4">
        
        {/* RPC Network Status Card */}
        <div className="rounded-2xl border border-purple-500/30 bg-gradient-to-br from-purple-500/10 to-transparent backdrop-blur-sm overflow-hidden">
          <button
            onClick={() => toggleSection('rpc')}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white mb-1">RPC Network Status</h3>
              <p className="text-sm text-white/50">Multi-endpoint monitoring</p>
            </div>
            <ChevronDown 
              className={`w-6 h-6 text-white/60 transition-transform duration-300 ${
                expandedSection === 'rpc' ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedSection === 'rpc' && (
            <div className="p-6 pt-0 animate-fade-in">
              <RPCHealthDashboard />
            </div>
          )}
        </div>

        {/* Network Congestion Card */}
        <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-transparent backdrop-blur-sm overflow-hidden">
          <button
            onClick={() => toggleSection('congestion')}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white mb-1">Network Congestion</h3>
              <p className="text-sm text-white/50">Real-time tracking</p>
            </div>
            <ChevronDown 
              className={`w-6 h-6 text-white/60 transition-transform duration-300 ${
                expandedSection === 'congestion' ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedSection === 'congestion' && (
            <div className="p-6 pt-0 animate-fade-in">
              <CongestionMonitor />
            </div>
          )}
        </div>

        {/* Wallet Analysis Card */}
        <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-br from-pink-500/10 to-transparent backdrop-blur-sm overflow-hidden">
          <button
            onClick={() => toggleSection('wallet')}
            className="w-full p-6 flex items-center justify-between hover:bg-white/5 transition-colors"
          >
            <div className="text-left">
              <h3 className="text-2xl font-bold text-white mb-1">Wallet Analysis</h3>
              <p className="text-sm text-white/50">Transaction history</p>
            </div>
            <ChevronDown 
              className={`w-6 h-6 text-white/60 transition-transform duration-300 ${
                expandedSection === 'wallet' ? 'rotate-180' : ''
              }`}
            />
          </button>
          
          {expandedSection === 'wallet' && (
            <div className="p-6 pt-0 animate-fade-in">
              <WalletAnalysis />
            </div>
          )}
        </div>

      </div>
    </div>
  );
}