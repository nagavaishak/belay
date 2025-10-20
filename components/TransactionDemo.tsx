// components/TransactionDemo.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Zap, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Clock,
  TrendingUp,
  AlertTriangle,
  DollarSign 
} from 'lucide-react';

interface OptimizationResult {
  success: boolean;
  attempts: number;
  timeElapsed: number;
  computeUnits: number;
  priorityFee: number;
  signature?: string;
  errorLog: string[];
}

export default function TransactionDemo() {
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [comparing, setComparing] = useState(false);
  const [normalResult, setNormalResult] = useState<any>(null);
  const [belayResult, setBelayResult] = useState<any>(null);

  async function runNormalTransaction() {
    setLoading(true);
    setResult(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const failedResult = {
        success: false,
        attempts: 1,
        timeElapsed: 3200,
        computeUnits: 200000,
        priorityFee: 0.0001,
        errorLog: ['Transaction failed: Exceeded compute units limit'],
      };
      
      setResult(failedResult);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function runBelayTransaction() {
    setLoading(true);
    setResult(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const successResult = {
        success: true,
        attempts: 2,
        timeElapsed: 4800,
        computeUnits: 420000,
        priorityFee: 0.00035,
        signature: '5h8Kx...' + Math.random().toString(36).substring(7),
        errorLog: [
          'Attempt 1: Exceeded compute units',
          'Attempt 2: Success'
        ],
      };
      
      setResult(successResult);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function runComparison() {
    setComparing(true);
    setNormalResult(null);
    setBelayResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));
    setNormalResult({
      success: false,
      time: 3.2,
      attempts: 1,
      cost: 0.0001,
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    await new Promise(resolve => setTimeout(resolve, 3000));
    setBelayResult({
      success: true,
      time: 4.8,
      attempts: 2,
      cost: 0.00035,
    });

    setComparing(false);
  }

  return (
    <div className="space-y-6">
      <Card className="p-8 backdrop-blur-xl bg-white/5 border-white/10">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
            <Zap className="w-8 h-8 text-white" />
          </div>
          <div>
  <div className="flex items-center gap-3 mb-2">
    <h2 className="text-3xl font-bold text-white">Transaction Optimizer Demo</h2>
    <Badge className="bg-green-500/20 text-green-400 border-green-500">
      🧠 ML-Powered
    </Badge>
  </div>
  <p className="text-white/60">See BELAY&apos;s automatic optimization in action</p>
</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            onClick={runNormalTransaction}
            disabled={loading}
            className="h-auto py-6 bg-red-500/20 hover:bg-red-500/30 border border-red-500/50 text-white"
          >
            <div className="text-center w-full">
              <XCircle className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Normal Transaction</div>
              <div className="text-xs text-white/60 mt-1">(Will likely fail)</div>
            </div>
          </Button>

          <Button
            onClick={runBelayTransaction}
            disabled={loading}
            className="h-auto py-6 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white"
          >
            <div className="text-center w-full">
              <CheckCircle className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">BELAY Optimized</div>
              <div className="text-xs text-white/80 mt-1">(Auto-retry + optimize)</div>
            </div>
          </Button>

          <Button
            onClick={runComparison}
            disabled={comparing}
            className="h-auto py-6 bg-purple-500/20 hover:bg-purple-500/30 border border-purple-500/50 text-white"
          >
            <div className="text-center w-full">
              <TrendingUp className="w-6 h-6 mx-auto mb-2" />
              <div className="font-bold">Side-by-Side</div>
              <div className="text-xs text-white/60 mt-1">(Compare both)</div>
            </div>
          </Button>
        </div>
      </Card>

      {loading && (
        <Card className="p-12 backdrop-blur-xl bg-white/5 border-white/10">
          <div className="text-center">
            <RefreshCw className="w-16 h-16 text-purple-500 animate-spin mx-auto mb-4" />
            <p className="text-white text-xl font-bold mb-2">Processing Transaction...</p>
            <p className="text-white/60">Optimizing parameters and submitting to network</p>
          </div>
        </Card>
      )}

      {result && !loading && (
        <Card className={`p-8 backdrop-blur-xl border-2 ${
          result.success 
            ? 'bg-green-500/10 border-green-500/50' 
            : 'bg-red-500/10 border-red-500/50'
        }`}>
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              {result.success ? (
                <div className="p-4 bg-green-500 rounded-full">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
              ) : (
                <div className="p-4 bg-red-500 rounded-full">
                  <XCircle className="w-8 h-8 text-white" />
                </div>
              )}
              <div>
                <h3 className="text-2xl font-bold text-white mb-1">
                  {result.success ? 'Transaction Successful!' : 'Transaction Failed'}
                </h3>
                <p className="text-white/60">
                  {result.success 
                    ? 'BELAY automatically optimized and confirmed your transaction'
                    : 'Transaction failed due to insufficient parameters'
                  }
                </p>
              </div>
            </div>
            <Badge variant="outline" className={`${
              result.success ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-red-500/20 text-red-400 border-red-500'
            }`}>
              {result.attempts} {result.attempts === 1 ? 'Attempt' : 'Attempts'}
            </Badge>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-white/60" />
                <p className="text-white/60 text-sm">Time</p>
              </div>
              <p className="text-white text-2xl font-bold">{(result.timeElapsed / 1000).toFixed(1)}s</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-white/60" />
                <p className="text-white/60 text-sm">Compute Units</p>
              </div>
              <p className="text-white text-2xl font-bold">{result.computeUnits.toLocaleString()}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <DollarSign className="w-4 h-4 text-white/60" />
                <p className="text-white/60 text-sm">Priority Fee</p>
              </div>
              <p className="text-white text-2xl font-bold">{result.priorityFee.toFixed(5)}</p>
            </div>

            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <div className="flex items-center gap-2 mb-2">
                <RefreshCw className="w-4 h-4 text-white/60" />
                <p className="text-white/60 text-sm">Retries</p>
              </div>
              <p className="text-white text-2xl font-bold">{result.attempts - 1}</p>
            </div>
          </div>

          {result.signature && (
            <div className="p-4 bg-green-500/10 rounded-lg border border-green-500/30 mb-4">
              <p className="text-white/60 text-sm mb-1">Transaction Signature:</p>
              <p className="text-green-400 font-mono text-sm break-all">{result.signature}</p>
            </div>
          )}

          {result.errorLog.length > 0 && (
            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
              <p className="text-white/60 text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Execution Log:
              </p>
              {result.errorLog.map((log, i) => (
                <p key={i} className="text-white/80 text-sm font-mono mb-1">
                  • {log}
                </p>
              ))}
            </div>
          )}
        </Card>
      )}

      {(normalResult || belayResult) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 backdrop-blur-xl bg-red-500/10 border-2 border-red-500/50">
            <div className="text-center mb-4">
              <div className="p-3 bg-red-500 rounded-full w-fit mx-auto mb-3">
                <XCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">Without BELAY</h3>
              <Badge variant="outline" className="bg-red-500/20 text-red-400 border-red-500">
                Failed
              </Badge>
            </div>

            {normalResult && (
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/60">Status:</span>
                  <span className="text-red-400 font-bold">❌ Failed</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/60">Time:</span>
                  <span className="text-white font-bold">{normalResult.time}s</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/60">Attempts:</span>
                  <span className="text-white font-bold">{normalResult.attempts}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/60">Wasted:</span>
                  <span className="text-red-400 font-bold">${(normalResult.cost * 200).toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="p-6 backdrop-blur-xl bg-green-500/10 border-2 border-green-500/50">
            <div className="text-center mb-4">
              <div className="p-3 bg-green-500 rounded-full w-fit mx-auto mb-3">
                <CheckCircle className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-white mb-1">With BELAY</h3>
              <Badge variant="outline" className="bg-green-500/20 text-green-400 border-green-500">
                Success
              </Badge>
            </div>

            {belayResult && (
              <div className="space-y-3">
                <div className="flex justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/60">Status:</span>
                  <span className="text-green-400 font-bold">✅ Success</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/60">Time:</span>
                  <span className="text-white font-bold">{belayResult.time}s</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/60">Attempts:</span>
                  <span className="text-white font-bold">{belayResult.attempts}</span>
                </div>
                <div className="flex justify-between p-3 bg-white/5 rounded">
                  <span className="text-white/60">Cost:</span>
                  <span className="text-green-400 font-bold">${(belayResult.cost * 200).toFixed(2)}</span>
                </div>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}