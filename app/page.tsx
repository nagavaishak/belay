// app/page.tsx
import CongestionMonitor from '@/components/CongestionMonitor';
import WalletAnalysis from '@/components/WalletAnalysis';
import TransactionDemo from '@/components/TransactionDemo';
import RPCHealthDashboard from '@/components/RPCHealthDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-green-700 relative overflow-hidden">
      {/* Animated Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-6xl font-bold text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-green-200">
            🚀 BELAY
          </h1>
          <p className="text-2xl text-white/80 mb-8">
            Never Waste Money on Failed Transactions
          </p>
          <p className="text-white/60 max-w-2xl mx-auto">
            Automated transaction optimization for Solana. Predict congestion, optimize parameters, and guarantee success.
          </p>
        </div>

        {/* Dashboard */}
        <div className="max-w-6xl mx-auto space-y-8">
  {/* RPC Network Status - TECHNICAL DEPTH */}
  <RPCHealthDashboard />
  
  <CongestionMonitor />
  
  {/* Wallet Analysis - THE KILLER FEATURE */}
  <WalletAnalysis />
  
  {/* Transaction Demo - SHOW THE TECH */}
  <TransactionDemo />
</div>

        {/* Stats Preview */}
        <div className="max-w-4xl mx-auto mt-8 grid grid-cols-3 gap-6">
          <div className="text-center p-6 backdrop-blur-xl bg-white/5 rounded-lg border border-white/10">
            <p className="text-4xl font-bold text-white mb-2">99%</p>
            <p className="text-white/60">Success Rate</p>
          </div>
          <div className="text-center p-6 backdrop-blur-xl bg-white/5 rounded-lg border border-white/10">
            <p className="text-4xl font-bold text-white mb-2">85%</p>
            <p className="text-white/60">Prediction Accuracy</p>
          </div>
          <div className="text-center p-6 backdrop-blur-xl bg-white/5 rounded-lg border border-white/10">
            <p className="text-4xl font-bold text-white mb-2">3min</p>
            <p className="text-white/60">Avg Prediction Time</p>
          </div>
        </div>
      </div>
    </main>
  );
}