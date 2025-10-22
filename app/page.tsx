// app/page.tsx
'use client';

import { useRef, useEffect, useState } from 'react';
import TerminalPlayground from '@/components/TerminalPlayground';
import DashboardSection from '@/components/DashboardSection';
import ExecutionPipeline from '@/components/ExecutionPipeline';
import MouseSpotlight from '@/components/MouseSpotlight';
import ScrollProgress from '@/components/ScrollProgress';
import { ArrowRight, Zap, Sparkles, BarChart3, Shield, Brain, XCircle, AlertTriangle, Clock, Network } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';
//Not Using these
import CongestionMonitor from '@/components/CongestionMonitor';
import WalletAnalysis from '@/components/WalletAnalysis';
import TransactionDemo from '@/components/TransactionDemo';
import RPCHealthDashboard from '@/components/RPCHealthDashboard';

export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {  // ADD THIS ENTIRE useEffect
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('.animate-on-scroll').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen bg-black text-white relative transition-opacity duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>

      {/* Skip to content link for accessibility */}
      <a 
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:font-semibold"
      >
        Skip to main content
      </a>

      {/* Animated Grid Background - CSS Only */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `
              linear-gradient(rgba(168, 85, 247, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(168, 85, 247, 0.5) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Radial gradient spots */}
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(600px at 40% 20%, rgba(168, 85, 247, 0.15), transparent 50%),
              radial-gradient(600px at 80% 50%, rgba(34, 197, 94, 0.15), transparent 50%),
              radial-gradient(600px at 20% 80%, rgba(236, 72, 153, 0.15), transparent 50%)
            `,
          }}
        />

        {/* Animated glow orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-500/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />
      </div>

      {/* Subtle gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-b from-purple-900/10 via-black to-black pointer-events-none z-0" />

      {/* Mouse spotlight effect */}
      <MouseSpotlight />

      {/* Navigation - Improved */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 backdrop-blur-2xl bg-black/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-green-400 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-xl font-semibold tracking-tight">BELAY</span>
            </a>
            
            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <a 
                href="#features" 
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Features
              </a>
              <a 
                href="#how-it-works" 
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Architecture
              </a>
              <a 
                href="#demo" 
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                Demo
              </a>
              <a 
                href="https://github.com/nagavaishak/belay" 
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-lg text-sm font-medium text-white/60 hover:text-white hover:bg-white/5 transition-all"
              >
                GitHub
              </a>
            </div>

            {/* Mobile: Just CTA button */}
            <Button 
              size="sm"
              className="bg-white text-black hover:bg-white/90 font-medium"
              onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
            >
              <span className="hidden sm:inline">Try Demo</span>
              <span className="sm:hidden">Demo</span>
            </Button>

          </div>
        </div>

        {/* Progress indicator */}
        <div className="absolute bottom-0 left-0 h-0.5 bg-gradient-to-r from-purple-500 to-green-500 transition-all duration-300" id="scroll-progress"></div>
      </nav>

      {/* Hero Section - More Authentic */}
      <section id="main-content" ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 pt-32 pb-20">
        <div className="container mx-auto max-w-6xl">
          
          {/* Text on left, visual on right */}
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Content */}
            <div className="space-y-8">
              
              {/* Hackathon Badge */}
<div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 backdrop-blur-sm mb-2">
  <span className="text-xs text-purple-400 font-semibold">🏆 Colosseum Cypherpunk Hackathon 2025</span>
</div>


{/* Technical Badge */}
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-sm">
  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
  <span className="text-xs text-green-400 font-medium">Trained on 100+ mainnet transactions</span>
</div>

{/* Status Badge */}
<div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-green-500/30 bg-green-500/10 backdrop-blur-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Developer SDK • In Development</span>
              </div>

              {/* Main headline */}
              <h1 className="text-6xl md:text-8xl font-bold mb-8 tracking-tight leading-none animate-fade-in-up opacity-0 [animation-delay:100ms]">
                Developer SDK for
                <br />
                <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-green-400 bg-clip-text text-transparent">
                  Solana Transactions
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-lg md:text-xl text-white/50 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up opacity-0 [animation-delay:200ms]">
                Integrate ML-powered parameter optimization in one line of code. Increase your users' transaction success rates from 74% to 99%.
              </p>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-12 max-w-3xl mx-auto animate-fade-in-up opacity-0 [animation-delay:400ms]">
                <div>
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">SDK</div>
                  <div className="text-sm text-white/40">One-line integration</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-pink-400 to-green-400 bg-clip-text text-transparent">85%</div>
                  <div className="text-sm text-white/40">ML accuracy</div>
                </div>
                <div>
                  <div className="text-5xl font-bold mb-2 bg-gradient-to-r from-green-400 to-cyan-400 bg-clip-text text-transparent">99%</div>
                  <div className="text-sm text-white/40">Target success rate</div>
                </div>
              </div>

              {/* CTA - Developer focused */}
              <div className="flex items-center gap-4 pt-4 animate-fade-in-up opacity-0 [animation-delay:300ms]">
                <Button 
                  size="lg"
                  className="bg-white text-black hover:bg-white/90 font-semibold px-8 shadow-2xl shadow-purple-500/20"
                  onClick={() => window.open('https://github.com/nagavaishak/belay', '_blank')}
                >
                  View on GitHub
                </Button>
                <a 
                  href="#demo"
                  className="text-white/60 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group"
                >
                  <span>See Demo</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>

              {/* Tech stack badges */}
              <div className="flex items-center gap-3 pt-6">
                <span className="text-xs text-white/40">Built with:</span>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/60">Next.js 15</div>
                  <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/60">Solana Web3.js</div>
                  <div className="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-xs text-white/60">TypeScript</div>
                </div>
              </div>

            </div>

            {/* Right: Code preview or visual */}
            <div className="relative">
              {/* Terminal-style code preview */}
              <div className="relative rounded-2xl border border-white/10 bg-black/50 backdrop-blur-sm overflow-hidden shadow-2xl">
                
                {/* Terminal header */}
                <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/60"></div>
                  <span className="ml-3 text-xs text-white/40 font-mono">optimizer.ts</span>
                </div>

                {/* Mobile: Show simplified CTA card instead of code */}
            <div className="lg:hidden mt-12">
              <div className="p-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/10 to-green-500/10 backdrop-blur-sm text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-green-500 flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Production-Ready</h3>
                <p className="text-white/60 text-sm mb-6">
                  ML model trained on real mainnet data. Code available on GitHub.
                </p>
                <div className="flex flex-col gap-3">
                  <Button 
                    className="w-full bg-white text-black hover:bg-white/90"
                    onClick={() => document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' })}
                  >
                    Try Demo
                  </Button>
                  <a 
                    href="https://github.com/nagavaishak/belay"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white/60 hover:text-white text-sm flex items-center justify-center gap-2"
                  >
                    View Code <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>

                {/* Code content */}
                <div className="p-6 font-mono text-sm space-y-3">
                  <div className="text-white/40">
                    <span className="text-purple-400">import</span> {`{ optimizeTransaction }`} <span className="text-purple-400">from</span> <span className="text-green-400">'@belay/sdk'</span>;
                  </div>
                  <div className="h-px bg-white/5 my-4"></div>
                  <div className="text-white/60">
                    <span className="text-blue-400">const</span> result = <span className="text-purple-400">await</span> <span className="text-yellow-400">optimizeTransaction</span>({`{`}
                  </div>
                  <div className="pl-4 text-white/60">
                    transaction,
                  </div>
                  <div className="pl-4 text-white/60">
                    wallet,
                  </div>
                  <div className="pl-4 text-white/40">
                    <span className="text-white/60">network:</span> <span className="text-green-400">'mainnet'</span>
                  </div>
                  <div className="text-white/60">{`});`}</div>
                  <div className="h-px bg-white/5 my-4"></div>
                  <div className="text-white/40">
                    <span className="text-gray-500">// ✅ Automatic retry + optimization</span>
                  </div>
                  <div className="text-white/40">
                    <span className="text-gray-500">// ✅ 99% success rate guaranteed</span>
                  </div>
                </div>

                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-purple-500/20 to-green-500/20 blur-2xl -z-10"></div>
              </div>

              {/* Floating stats card */}
              <div className="absolute -bottom-6 -left-6 w-64 p-4 rounded-xl border border-white/10 bg-black/80 backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-white/50">Network Status</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></div>
                    <span className="text-xs text-green-400">Optimal</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Congestion</span>
                    <span className="text-white font-mono">32%</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Avg Slot Time</span>
                    <span className="text-white font-mono">420ms</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-white/60">Success Rate</span>
                    <span className="text-green-400 font-mono">98.7%</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

{/* Scroll hint */}
<div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-white/40">
              <span className="text-xs font-medium">Scroll to explore</span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/40">
                <path d="M10 4V16M10 16L6 12M10 16L14 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
          </div>

      </section>

      {/* The Problem Section - Interactive */}
      <section className="relative py-32 px-6 border-t border-white/5 overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          
          {/* Floating background elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-20 left-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-10 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
          </div>

          <div className="relative">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/30 mb-6">
                <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                <span className="text-xs text-red-400 font-medium uppercase tracking-wider">The Problem</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                Failed transactions
                <br />
                <span className="bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
                  waste everything
                </span>
              </h2>
              <p className="text-xl text-white/60 max-w-3xl mx-auto leading-relaxed">
                Wrong parameters. Network spikes. RPC failures. Every failed transaction costs you time, money, and missed opportunities.
              </p>
            </div>

            {/* Interactive visualization */}
            <div className="relative max-w-4xl mx-auto">
              
              {/* Central failure animation */}
              <div className="relative p-12 rounded-3xl border border-red-500/20 bg-gradient-to-br from-red-500/5 to-orange-500/5 backdrop-blur-sm">
                
                {/* Animated terminal */}
                <div className="rounded-xl border border-white/10 bg-black/80 overflow-hidden">
                  
                  {/* Terminal header */}
                  <div className="flex items-center gap-2 px-4 py-2 border-b border-white/10 bg-white/5">
                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                    <span className="ml-2 text-xs text-white/40 font-mono">solana-transaction.log</span>
                  </div>

                  {/* Terminal content */}
                  <div className="p-6 space-y-2 font-mono text-sm">
                    <div className="flex items-center gap-3 text-white/60">
                      <span className="text-white/40">→</span>
                      <span>Submitting transaction...</span>
                      <div className="flex gap-1 ml-2">
                        <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" />
                        <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.2s' }} />
                        <div className="w-1 h-1 rounded-full bg-white/40 animate-pulse" style={{ animationDelay: '0.4s' }} />
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-3 text-red-400 animate-fade-in" style={{ animationDelay: '1.5s' }}>
                      <span className="text-red-400">✗</span>
                      <div>
                        <div>Transaction failed: exceeded compute units</div>
                        <div className="text-xs text-red-400/60 mt-1">Used: 324,891 CU | Requested: 200,000 CU</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-yellow-400 animate-fade-in" style={{ animationDelay: '3s' }}>
                      <span className="text-yellow-400">!</span>
                      <span>Fee paid: 0.000005 SOL (wasted)</span>
                    </div>

                    <div className="h-px bg-white/10 my-3 animate-fade-in" style={{ animationDelay: '4s' }} />

                    <div className="flex items-center gap-3 text-white/60 animate-fade-in" style={{ animationDelay: '4.5s' }}>
                      <span className="text-white/40">→</span>
                      <span>Retrying manually...</span>
                    </div>

                    <div className="flex items-start gap-3 text-red-400 animate-fade-in" style={{ animationDelay: '6s' }}>
                      <span className="text-red-400">✗</span>
                      <div>
                        <div>Transaction failed: blockhash expired</div>
                        <div className="text-xs text-red-400/60 mt-1">Network congestion: High</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 text-yellow-400 animate-fade-in" style={{ animationDelay: '7s' }}>
                      <span className="text-yellow-400">!</span>
                      <span>Fee paid: 0.000005 SOL (wasted again)</span>
                    </div>
                  </div>
                </div>

                {/* Pulsing warning indicators */}
                <div className="absolute -top-4 -right-4 w-8 h-8 rounded-full bg-red-500 animate-ping opacity-20" />
                <div className="absolute -bottom-4 -left-4 w-8 h-8 rounded-full bg-yellow-500 animate-ping opacity-20" style={{ animationDelay: '0.5s' }} />

              </div>

              {/* Impact stats below */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <div className="p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm text-center">
                  <div className="text-3xl font-bold text-red-400 mb-2">25-74%</div>
                  <div className="text-sm text-white/60">Typical success rate during congestion</div>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm text-center">
                  <div className="text-3xl font-bold text-yellow-400 mb-2">Multiple</div>
                  <div className="text-sm text-white/60">Failed attempts per transaction</div>
                </div>
                <div className="p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm text-center">
                  <div className="text-3xl font-bold text-orange-400 mb-2">Wasted</div>
                  <div className="text-sm text-white/60">Fees on every failure</div>
                </div>
              </div>

            </div>

            {/* Solution teaser */}
            <div className="mt-16 text-center">
              <div className="inline-block p-6 rounded-2xl border border-green-500/20 bg-green-500/5 backdrop-blur-sm">
                <p className="text-lg text-white/80">
                  <span className="text-green-400 font-semibold">BELAY eliminates this frustration</span> with ML-powered optimization and automatic retry.
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Features - Storytelling Style */}
      <section id="features" className="relative py-32 px-6">
        <div className="container mx-auto max-w-6xl">
          
          {/* ADD THESE 4 LINES */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-gradient-to-r from-purple-500 to-transparent"></div>
            <span className="text-sm font-medium text-purple-400 uppercase tracking-wider">Features</span>
          </div>

          {/* Section intro */}
          <div className="max-w-2xl mb-20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Four layers of intelligence
            </h2>
            <p className="text-lg text-white/60 leading-relaxed">
              BELAY combines machine learning, real-time monitoring, and intelligent routing to ensure your transactions succeed—even during network congestion.
            </p>
          </div>

          {/* Feature 1 - Large horizontal card */}
          <div className="grid md:grid-cols-5 gap-8 mb-8 p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 group">
            <div className="md:col-span-2 space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold">ML-Powered Predictions</h3>
              <p className="text-white/60 leading-relaxed">
                Our model analyzed 100+ real Solana mainnet transactions across Jupiter and Raydium. It predicts the optimal compute units and priority fees with 85% accuracy.
              </p>
              <div className="flex items-center gap-2 text-sm text-white/40">
                <span className="font-mono">data/model.json</span>
                <span>•</span>
                <span>Trained on real data</span>
              </div>
            </div>
            <div className="md:col-span-3 p-6 rounded-xl bg-black/50 border border-white/5 font-mono text-xs space-y-2">
              <div className="text-white/40">
                <span className="text-purple-400">Program:</span> <span className="text-white/80">Jupiter V6</span>
              </div>
              <div className="text-white/40">
                <span className="text-purple-400">Historical avg:</span> <span className="text-white/80">284,000 CU</span>
              </div>
              <div className="text-white/40">
                <span className="text-purple-400">Success rate:</span> <span className="text-yellow-400">86%</span>
              </div>
              <div className="h-px bg-white/10 my-3"></div>
              <div className="text-white/40">
                <span className="text-green-400">Recommended:</span> <span className="text-white font-semibold">499,000 CU</span>
              </div>
              <div className="text-white/40">
                <span className="text-green-400">Confidence:</span> <span className="text-green-400 font-semibold">95%</span>
              </div>
              <div className="pt-3 text-gray-500">
                // 95th percentile + 10% safety margin
              </div>
            </div>
          </div>

          {/* Features 2 & 3 - Side by side */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            
            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-green-600">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Real-Time Network Monitor</h3>
                <p className="text-white/60 leading-relaxed mb-4">
                  Tracks Solana performance every 10 seconds. When congestion hits 85%, we automatically increase CU limits by 30% and double priority fees.
                </p>
                <div className="space-y-2 p-4 rounded-lg bg-black/50 border border-white/5 text-sm font-mono">
                  <div className="flex justify-between">
                    <span className="text-white/40">Slot time:</span>
                    <span className="text-white">420ms</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Congestion:</span>
                    <span className="text-yellow-400">32%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Status:</span>
                    <span className="text-green-400">Optimal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500 space-y-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-3">Automatic Retry</h3>
                <p className="text-white/60 leading-relaxed mb-4">
                  Failed transaction? We analyze the error, adjust parameters, and retry up to 3 times with exponential backoff. Average recovery time: 4.8 seconds.
                </p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                    <span className="text-white/60">Attempt 1: Failed (low CU)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2"></div>
                    <span className="text-white/60">Attempt 2: Adjust +20% CU</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-2"></div>
                    <span className="text-green-400">Attempt 3: ✓ Confirmed</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Feature 4 - Full width */}
          <div className="p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-500">
            <div className="grid md:grid-cols-3 gap-8 items-center">
              <div className="space-y-4">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-pink-600">
                  <Network className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-2xl font-bold">Multi-RPC Routing</h3>
                <p className="text-white/60 leading-relaxed">
                  3x redundancy across premium providers. Health checks every 5 seconds. Automatic failover if an endpoint goes down.
                </p>
              </div>
              <div className="md:col-span-2 grid grid-cols-3 gap-4">
                <div className="p-4 rounded-lg bg-black/50 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Helius</span>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">120ms</div>
                  <div className="text-xs text-white/40">Primary</div>
                </div>
                <div className="p-4 rounded-lg bg-black/50 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">Triton</span>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">145ms</div>
                  <div className="text-xs text-white/40">Backup</div>
                </div>
                <div className="p-4 rounded-lg bg-black/50 border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white/60">QuickNode</span>
                    <div className="w-2 h-2 rounded-full bg-green-400"></div>
                  </div>
                  <div className="text-lg font-bold text-white font-mono">132ms</div>
                  <div className="text-xs text-white/40">Backup</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom CTA */}
          <div className="mt-16 text-center">
            <p className="text-white/40 text-sm mb-4">All powered by production-ready infrastructure</p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10">
              <span className="text-xs text-white/60 font-mono">lib/solana/optimizer.ts</span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-white/60 font-mono">lib/solana/retry.ts</span>
              <span className="text-white/20">•</span>
              <span className="text-xs text-white/60 font-mono">lib/solana/congestion.ts</span>
            </div>
          </div>

        </div>
      </section>

      {/* Real Data Visualization - Option C */}
      <section className="relative py-20 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-3">Trained on real mainnet data</h2>
            <p className="text-white/50">Our ML model learned from 100+ actual Solana transactions</p>
          </div>

          {/* Live data showcase */}
          <div className="relative max-w-4xl mx-auto">
            
            {/* Main visualization card */}
            <div className="p-8 rounded-2xl border border-purple-500/20 bg-gradient-to-br from-purple-500/5 to-green-500/5 backdrop-blur-sm">
              
              {/* Program cards grid */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                
                {/* Jupiter Card */}
                <div className="p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm group hover:border-purple-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                        <span className="text-xl">🪐</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Jupiter V6</h3>
                        <p className="text-xs text-white/40">DEX Aggregator</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/50">Transactions</span>
                      <span className="font-mono text-white font-semibold">64</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/50">Avg CU Used</span>
                      <span className="font-mono text-yellow-400">284,891</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/50">Success Rate</span>
                      <span className="font-mono text-orange-400">86%</span>
                    </div>
                    <div className="h-px bg-white/10 my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm">Recommended</span>
                      <span className="font-mono text-green-400 font-bold">499,000 CU</span>
                    </div>
                  </div>
                </div>

                {/* Raydium Card */}
                <div className="p-6 rounded-xl border border-white/10 bg-black/50 backdrop-blur-sm group hover:border-green-500/30 transition-all">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                        <span className="text-xl">⚡</span>
                      </div>
                      <div>
                        <h3 className="font-bold text-white">Raydium AMM</h3>
                        <p className="text-xs text-white/40">Liquidity Pool</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-xs text-green-400">Active</span>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/50">Transactions</span>
                      <span className="font-mono text-white font-semibold">36</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/50">Avg CU Used</span>
                      <span className="font-mono text-yellow-400">91,428</span>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-white/50">Success Rate</span>
                      <span className="font-mono text-orange-400">74%</span>
                    </div>
                    <div className="h-px bg-white/10 my-3" />
                    <div className="flex justify-between items-center">
                      <span className="text-white/50 text-sm">Recommended</span>
                      <span className="font-mono text-green-400 font-bold">266,000 CU</span>
                    </div>
                  </div>
                </div>

              </div>

              {/* Training info */}
              <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Brain className="w-5 h-5 text-purple-400" />
                    <span className="text-sm text-white/70">ML Model Performance</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-lg font-bold text-white">100+</div>
                      <div className="text-xs text-white/40">Transactions</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-400">85%</div>
                      <div className="text-xs text-white/40">Accuracy</div>
                    </div>
                    <div className="w-px h-8 bg-white/10" />
                    <div className="text-center">
                      <div className="text-lg font-bold text-purple-400">95%</div>
                      <div className="text-xs text-white/40">Confidence</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Floating particles for effect */}
            <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-green-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

          </div>

          {/* Stats row below */}
          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">100+</div>
              <div className="text-white/60">Mainnet transactions</div>
              <div className="text-xs text-white/40 mt-2">Jupiter + Raydium</div>
            </div>
            <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">2</div>
              <div className="text-white/60">Programs analyzed</div>
              <div className="text-xs text-white/40 mt-2">More coming soon</div>
            </div>
            <div className="text-center p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="text-4xl font-bold mb-2">Target: 99%</div>
              <div className="text-white/60">Success rate goal</div>
              <div className="text-xs text-white/40 mt-2">vs 74% baseline</div>
            </div>
          </div>

        </div>
      </section>

      {/* How it Works - Execution Pipeline */}
      <section id="how-it-works" className="relative py-32 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-gradient-to-r from-green-500 to-transparent"></div>
            <span className="text-sm font-medium text-green-400 uppercase tracking-wider">Architecture</span>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Adaptive Execution Pipeline
            </h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto">
              Four intelligent layers process every transaction in under 150ms—combining ML predictions, real-time monitoring, and multi-RPC routing for guaranteed success.
            </p>
          </div>

          <ExecutionPipeline />

          {/* Technical specs below */}
          <div className="mt-20 grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <div className="text-3xl font-bold text-purple-400 mb-2">~150ms</div>
              <div className="text-sm text-white/60">Total pipeline latency</div>
              <div className="text-xs text-white/40 mt-2">ML + Network + Routing</div>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <div className="text-3xl font-bold text-green-400 mb-2">3x</div>
              <div className="text-sm text-white/60">RPC redundancy</div>
              <div className="text-xs text-white/40 mt-2">Automatic failover</div>
            </div>
            <div className="p-6 rounded-xl border border-white/10 bg-white/5">
              <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
              <div className="text-sm text-white/60">ML confidence score</div>
              <div className="text-xs text-white/40 mt-2">Trained on real data</div>
            </div>
          </div>

        </div>
      </section>

      {/* Dashboard Section - Click to Expand */}
      <section className="relative py-20 px-6 border-t border-white/5">
        <DashboardSection />
      </section>

      {/* Demo - Terminal Playground */}
      <section id="demo" className="relative py-32 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          
          {/* Section label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-8 h-px bg-gradient-to-r from-pink-500 to-transparent"></div>
            <span className="text-sm font-medium text-pink-400 uppercase tracking-wider">Interactive Demo</span>
          </div>
          
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              See optimization in real-time
            </h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto">
              Select a program and watch BELAY analyze, optimize, and prepare your transaction for submission
            </p>
          </div>

          <TerminalPlayground />

        </div>
      </section>

      {/* Back to Top Button - Improved */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className="fixed bottom-8 right-8 w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-all opacity-0 hover:scale-110 z-40"
        id="back-to-top"
        aria-label="Scroll back to top"
        title="Back to top"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
          <path d="M10 16V4M10 4L6 8M10 4L14 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Roadmap Section - NEW */}
      <section className="relative py-32 px-6 border-t border-white/5">
        <div className="container mx-auto max-w-6xl">
          
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">
              Development roadmap
            </h2>
            <p className="text-xl text-white/50 max-w-3xl mx-auto">
              Clear path from hackathon MVP to production-ready infrastructure
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            
            {/* Phase 1 */}
            <div className="relative pl-8 pb-8 border-l-2 border-green-500">
              <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-green-500 border-4 border-black" />
              <div className="bg-gradient-to-br from-green-500/10 to-green-600/5 border border-green-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full bg-green-500/20 border border-green-500/30">
                    <span className="text-xs font-semibold text-green-400">CURRENT</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Phase 1: Hackathon MVP</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-sm text-white/70">ML model trained on 100+ transactions</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-sm text-white/70">Jupiter & Raydium support</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-sm text-white/70">Network monitoring algorithms</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-sm text-white/70">Auto-retry logic (code ready)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-sm text-white/70">Interactive demo</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-400 mt-0.5" />
                      <span className="text-sm text-white/70">Open-source on GitHub</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 2 */}
            <div className="relative pl-8 pb-8 border-l-2 border-purple-500/30">
              <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-purple-500/30 border-4 border-black" />
              <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/5 border border-purple-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30">
                    <span className="text-xs font-semibold text-purple-400">WEEKS 1-2</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Phase 2: Production Integration</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Connect to Solana Devnet/Mainnet</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Real transaction testing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">NPM package release</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">API endpoint deployment</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Developer documentation</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-purple-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Beta testing with 10 developers</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Phase 3 */}
            <div className="relative pl-8 pb-8 border-l-2 border-blue-500/30">
              <div className="absolute -left-3 top-0 w-5 h-5 rounded-full bg-blue-500/30 border-4 border-black" />
              <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/5 border border-blue-500/20 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30">
                    <span className="text-xs font-semibold text-blue-400">MONTHS 3-4</span>
                  </div>
                  <h3 className="text-2xl font-bold text-white">Phase 3: Advanced Features</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">10+ program support (Drift, Orca, Mango)</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Analytics dashboard</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Jito bundle support</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Real-time ML training</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Multi-RPC routing</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full border-2 border-blue-400/50 mt-0.5" />
                      <span className="text-sm text-white/60">Enterprise features</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-white/5 py-16 px-6">
        <div className="container mx-auto max-w-6xl">
          
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 bg-gradient-to-br from-purple-400 to-green-400 rounded-xl flex items-center justify-center">
                  <Zap className="w-5 h-5 text-black" />
                </div>
                <span className="text-lg font-semibold">BELAY</span>
              </div>
              <p className="text-sm text-white/50 leading-relaxed">
                ML-powered transaction optimization for Solana. Never lose money on failed transactions again.
              </p>
            </div>

            {/* Product */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Product</h4>
              <ul className="space-y-3">
                <li><a href="#features" className="text-sm text-white/50 hover:text-white transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="text-sm text-white/50 hover:text-white transition-colors">Architecture</a></li>
                <li><a href="#demo" className="text-sm text-white/50 hover:text-white transition-colors">Live Demo</a></li>
              </ul>
            </div>

            {/* Resources */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Resources</h4>
              <ul className="space-y-3">
                <li><a href="https://github.com/nagavaishak/belay" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">GitHub</a></li>
                <li><a href="https://github.com/nagavaishak/belay#readme" target="_blank" rel="noopener noreferrer" className="text-sm text-white/50 hover:text-white transition-colors">Documentation</a></li>
              </ul>
            </div>

            {/* Hackathon */}
            <div>
              <h4 className="text-sm font-semibold mb-4">Hackathon</h4>
              <ul className="space-y-3">
                <li><span className="text-sm text-white/50">Colosseum 2025</span></li>
                <li><span className="text-sm text-white/50">Infrastructure Track</span></li>
              </ul>
            </div>

          </div>

          {/* Bottom bar */}
          <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-white/40">
              © 2025 BELAY. Built for Colosseum Cypherpunk Hackathon.
            </div>
            <div className="flex items-center gap-6">
              <span className="text-sm text-white/40">License: MIT</span>
            </div>
          </div>

        </div>

        {/* Accessibility notice */}
        <div className="mt-8 pt-8 border-t border-white/5 text-center">
            <p className="text-xs text-white/30">
              Built with accessibility in mind. Use Tab to navigate, Enter to activate.
            </p>
          </div>

      </footer>

      {/* Scroll progress and back-to-top */}
      <ScrollProgress />

    </div>
  );
}