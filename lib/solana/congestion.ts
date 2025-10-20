// lib/solana/congestion.ts
import { Connection } from '@solana/web3.js';
import { NETWORK_CONFIG } from '../constants';

export interface CongestionData {
  status: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  percentage: number;
  averageSlotTime: number;
  predictedInMinutes: number;
  confidence: number;
  recommendation: string;
  timestamp: number;
}

export async function getCurrentCongestion(
  connection: Connection
): Promise<CongestionData> {
  try {
    const samples = await connection.getRecentPerformanceSamples(
      NETWORK_CONFIG.PERFORMANCE_SAMPLE_SIZE
    );

    if (!samples || samples.length === 0) {
      throw new Error('No performance samples available');
    }

    const avgSlotTime =
      samples.reduce((sum, sample) => sum + sample.samplePeriodSecs, 0) /
      samples.length;

    const congestionPercentage = Math.min(
      100,
      ((avgSlotTime - 0.4) / 0.6) * 100
    );

    let status: CongestionData['status'];
    if (congestionPercentage < 20) status = 'LOW';
    else if (congestionPercentage < 50) status = 'MEDIUM';
    else if (congestionPercentage < 80) status = 'HIGH';
    else status = 'CRITICAL';

    const recentSamples = samples.slice(0, 5);
    const trend =
      recentSamples[0].samplePeriodSecs >
      recentSamples[recentSamples.length - 1].samplePeriodSecs;
    
    const predictedInMinutes = trend ? 3 : 5;
    const confidence = trend ? 0.75 : 0.85;

    let recommendation = '';
    if (status === 'LOW') {
      recommendation = 'Optimal time to submit transactions';
    } else if (status === 'MEDIUM') {
      recommendation = 'Network slightly congested. Increase priority fee slightly.';
    } else if (status === 'HIGH') {
      recommendation = `High congestion. Consider waiting ${predictedInMinutes} minutes or increase fees by 2x.`;
    } else {
      recommendation = 'Critical congestion. Wait for network to calm down.';
    }

    return {
      status,
      percentage: Math.round(congestionPercentage),
      averageSlotTime: avgSlotTime,
      predictedInMinutes,
      confidence: Math.round(confidence * 100),
      recommendation,
      timestamp: Date.now(),
    };
  } catch (error) {
    console.error('Error getting congestion data:', error);
    return {
      status: 'MEDIUM',
      percentage: 50,
      averageSlotTime: 0.5,
      predictedInMinutes: 5,
      confidence: 50,
      recommendation: 'Unable to determine network status. Proceed with caution.',
      timestamp: Date.now(),
    };
  }
}

export async function predictCongestion(
  connection: Connection
): Promise<CongestionData> {
  const current = await getCurrentCongestion(connection);
  
  return {
    ...current,
    predictedInMinutes: 5,
    recommendation: `Predicted to ${current.status === 'HIGH' ? 'improve' : 'remain stable'} in next 5 minutes.`,
  };
}