// components/TerminalPlayground.tsx
'use client';

import { useState } from 'react';
import { Play, Zap, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

type ProgramType = 'jupiter' | 'raydium' | 'custom';
type SimulationStep = 'idle' | 'analyzing' | 'predicting' | 'monitoring' | 'optimizing' | 'ready' | 'submitting' | 'success';

const programs = [
    { id: 'jupiter', name: 'Jupiter V6', icon: '🪐', description: 'DEX Aggregator' },
    { id: 'raydium', name: 'Raydium AMM', icon: '⚡', description: 'Liquidity Pool' }
  ];

export default function TerminalPlayground() {
  const [selectedProgram, setSelectedProgram] = useState<ProgramType>('jupiter');
  const [simulationStep, setSimulationStep] = useState<SimulationStep>('idle');
  const [logs, setLogs] = useState<string[]>([]);

  const runSimulation = async () => {
    setLogs([]);
    setSimulationStep('analyzing');
    
    // Step 1: Analyzing
    await addLog('$ belay optimize --program ' + selectedProgram, 0);
    await addLog('', 100);
    await addLog('🔍 Analyzing transaction...', 200);
    
    setSimulationStep('predicting');
    await addLog('', 800);
    
    // Step 2: ML Prediction
    await addLog('🧠 ML Model: Loading historical data...', 300);
    await addLog('   → Program: ' + (selectedProgram === 'jupiter' ? 'JUP6LkbZbjS1jKKwapdHNy74zcZ3tLUZoi5QNyVTaV4' : '675kPX9MHTjS2zt1qfr1NYHuzeLXfQM9H24wFSUt1Mp8'), 200);
    await addLog('   → Transactions analyzed: ' + (selectedProgram === 'jupiter' ? '64' : '36'), 200);
    await addLog('   → Historical avg CU: ' + (selectedProgram === 'jupiter' ? '284,891' : '91,428'), 200);
    await addLog('   → Success rate: ' + (selectedProgram === 'jupiter' ? '86%' : '74%'), 200);
    
    setSimulationStep('monitoring');
    await addLog('', 500);
    
    // Step 3: Network Monitor
    await addLog('📡 Network Monitor: Checking current conditions...', 300);
    await addLog('   → Slot time: 420ms (Optimal)', 200);
    await addLog('   → Congestion: 32% (Low)', 200);
    await addLog('   → Network multiplier: 1.0x', 200);
    
    setSimulationStep('optimizing');
    await addLog('', 500);
    
    // Step 4: Optimization
    await addLog('⚡ Dynamic Optimizer: Calculating parameters...', 300);
    const recommendedCU = selectedProgram === 'jupiter' ? '499,000' : '266,000';
    await addLog('   → Base CU (95th percentile): ' + recommendedCU, 200);
    await addLog('   → Adjusted for congestion: ' + recommendedCU, 200);
    await addLog('   → Priority fee: 0.0001 SOL', 200);
    await addLog('   → Total cost: ~$0.0003', 200);
    
    setSimulationStep('ready');
    await addLog('', 500);
    await addLog('✅ Optimization complete!', 300);
    await addLog('', 200);
    await addLog('📊 Estimated success rate: 99%', 300);
    await addLog('⚡ Ready for submission', 300);
  };

  const submitTransaction = async () => {
    setSimulationStep('submitting');
    await addLog('', 500);
    await addLog('🚀 Submitting transaction...', 300);
    await addLog('   → RPC: Helius (120ms latency)', 400);
    await addLog('   → Sending to network...', 600);
    
    setSimulationStep('success');
    await addLog('', 800);
    await addLog('✅ Transaction confirmed!', 500);
    await addLog('   → Signature: 5h8Kx2vN3...9mPq4sL7', 200);
    await addLog('   → Slot: 284,329,847', 200);
    await addLog('   → Fee paid: 0.000005 SOL', 200);
    await addLog('   → Status: Success ✓', 300);
  };

  const addLog = (text: string, delay: number): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        setLogs((prev) => [...prev, text]);
        resolve();
      }, delay);
    });
  };

  const reset = () => {
    setSimulationStep('idle');
    setLogs([]);
  };

  return (
    <div className="max-w-5xl mx-auto">
      
      {/* Program Selector */}
      <div className="mb-8">
        <label className="block text-sm font-medium text-white/60 mb-4">
          Select Program to Optimize
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {programs.map((program) => (
            <button
              key={program.id}
              onClick={() => {
                setSelectedProgram(program.id as ProgramType);
                reset();
              }}
              disabled={simulationStep !== 'idle'}
              className={`p-4 sm:p-6 rounded-xl border transition-all ${
                selectedProgram === program.id
                  ? 'border-purple-500/50 bg-purple-500/10'
                  : 'border-white/10 bg-white/5 hover:border-white/20'
              } ${simulationStep !== 'idle' ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <div className="text-2xl mb-2">{program.icon}</div>
              <div className="text-sm font-semibold text-white">{program.name}</div>
              <div className="text-xs text-white/40 mt-1">{program.description}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Terminal Window */}
      <div className="relative rounded-2xl border border-white/10 bg-black/80 overflow-hidden shadow-2xl">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
            <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
            <span className="ml-3 text-xs text-white/40 font-mono">belay-optimizer.sh</span>
          </div>
          <div className="flex items-center gap-2">
            {simulationStep !== 'idle' && simulationStep !== 'success' && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/30">
                <Loader2 className="w-3 h-3 text-yellow-400 animate-spin" />
                <span className="text-xs text-yellow-400">Running</span>
              </div>
            )}
            {simulationStep === 'success' && (
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/30">
                <CheckCircle2 className="w-3 h-3 text-green-400" />
                <span className="text-xs text-green-400">Complete</span>
              </div>
            )}
          </div>
        </div>

        {/* Terminal Content */}
        <div className="p-6 font-mono text-sm min-h-[400px] max-h-[500px] overflow-y-auto">
          {logs.length === 0 && simulationStep === 'idle' && (
            <div className="flex flex-col items-center justify-center h-[350px] text-white/40">
              <Zap className="w-12 h-12 mb-4 opacity-50" />
              <p className="text-center">
                Select a program and click "Run Optimization" to see BELAY in action
              </p>
            </div>
          )}
          
          {logs.map((log, index) => (
            <div
              key={index}
              className={`mb-1 ${
                log.startsWith('$') 
                  ? 'text-purple-400 font-semibold' 
                  : log.startsWith('✅') || log.includes('Success')
                  ? 'text-green-400'
                  : log.startsWith('🔍') || log.startsWith('🧠') || log.startsWith('📡') || log.startsWith('⚡')
                  ? 'text-white'
                  : log.startsWith('   →')
                  ? 'text-white/60 pl-4'
                  : log.startsWith('🚀')
                  ? 'text-blue-400'
                  : 'text-white/80'
              }`}
              style={{
                animation: 'fadeIn 0.3s ease-out'
              }}
            >
              {log || '\u00A0'}
            </div>
          ))}
          
          {/* Cursor blink */}
          {simulationStep !== 'idle' && simulationStep !== 'success' && (
            <div className="inline-block w-2 h-4 bg-white/60 animate-pulse ml-1"></div>
          )}
        </div>

        {/* Terminal Footer - Action Buttons */}
        <div className="px-6 py-4 border-t border-white/10 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {simulationStep === 'idle' && (
              <Button
                onClick={runSimulation}
                className="bg-gradient-to-r from-purple-500 to-green-500 hover:from-purple-600 hover:to-green-600 text-white font-semibold"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Optimization
              </Button>
            )}
            
            {simulationStep === 'ready' && (
              <Button
                onClick={submitTransaction}
                className="bg-green-500 hover:bg-green-600 text-white font-semibold"
              >
                <Zap className="w-4 h-4 mr-2" />
                Submit Transaction
              </Button>
            )}
            
            {simulationStep === 'success' && (
              <Button
                onClick={reset}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                Run Again
              </Button>
            )}
          </div>
          
          {/* Stats */}
          {simulationStep === 'success' && (
              <Button
                onClick={reset}
                className="bg-white/10 text-white hover:bg-white/20 border border-white/20 font-semibold backdrop-blur-sm"
              >
                <Play className="w-4 h-4 mr-2" />
                Run Again
              </Button>
            )}
        </div>

      </div>

      {/* Info below */}
      <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
        <p className="text-sm text-white/60 text-center">
          <span className="text-white/80 font-semibold">Interactive Demo:</span> This simulation shows BELAY's optimization process using real ML model data. 
          Actual implementation available in <span className="font-mono text-purple-400">lib/solana/optimizer.ts</span>
        </p>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>

    </div>
  );
}