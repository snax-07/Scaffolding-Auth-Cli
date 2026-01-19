"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  Terminal, ShieldCheck, Zap, Cpu, Github, 
  ArrowRight, Box, Lock, Code2, Layers, CheckCircle2 
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LandingPage() {
  const router = useRouter()
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white font-sans overflow-hidden">
      {/* Subtle Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto border-b border-black/5 bg-white/80 backdrop-blur-md">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="p-1.5 bg-black rounded flex items-center justify-center transition-transform group-hover:rotate-12">
            <Lock size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold tracking-tighter uppercase">AUTOMA</span>
        </div>
        <div className="hidden md:flex gap-10 text-xs font-bold uppercase tracking-widest text-black/50">
          <a href="#features" className="hover:text-black transition-colors">Architecture</a>
          <a href="/docs" className="hover:text-black transition-colors">Documentation</a>
          <a href="#roadmap" className="hover:text-black transition-colors">Roadmap</a>
        </div>
        <Link
          href="https://www.github.com/snax-07/Scaffolding-Auth-Cli"
          className="flex items-center gap-2 px-5 py-2 bg-black text-white rounded-full hover:shadow-[0_8px_20px_rgba(0,0,0,0.2)] transition-all active:scale-95"
        >
          <Github size={16} />
          <span className="text-xs font-bold uppercase tracking-wider">Source</span>
        </Link>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-24 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-black/10 bg-black/5 text-[10px] font-bold uppercase tracking-[0.2em] mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-black opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-black"></span>
            </span>
            Enterprise Scaffolding v1.0
          </div>
          <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-black leading-[0.85]">
            BUILD FAST.<br />
            STAY SECURE.
          </h1>
          <p className="mt-8 text-xl text-black/60 max-w-xl mx-auto font-medium leading-snug">
            The professional CLI tool to inject robust, industry-standard 
            authentication into your Express and Next.js applications instantly.
          </p>

          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Link href="/docs" className="px-10 py-4 bg-transparent border-2 border-black text-black font-bold rounded-full hover:bg-black hover:text-white transition-all active:scale-95">
              Read the Docs
            </Link>
          </div>
        </motion.div>

        {/* Terminal Simulation - Minimalist style */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mt-24 max-w-2xl mx-auto"
        >
          <div className="bg-white border-2 border-black shadow-[20px_20px_0px_0px_rgba(0,0,0,0.05)] rounded-lg overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 bg-black border-b border-black">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
                <div className="w-2.5 h-2.5 rounded-full bg-white/20" />
              </div>
              <span className="text-[10px] text-white/50 font-mono uppercase tracking-[0.2em]">Auth-Engine-CLI</span>
            </div>
            <div className="p-8 text-left font-mono text-sm leading-relaxed text-black/80">
              <div className="flex gap-3 mb-2">
                <span className="font-bold">user@dev:~$</span>
                <span className="text-black font-bold">npx automa init --flag </span>
              </div>
              <div className="text-black/40 italic mb-4">// System Analysis Started...</div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-black" />
                <span>Framework detected: <span className="font-bold underline">Express.js</span></span>
              </div>
              <div className="flex items-center gap-2 mb-1">
                <CheckCircle2 size={14} className="text-black" />
                <span>Language: <span className="font-bold underline">TypeScript</span></span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle2 size={14} className="text-black" />
                <span>Auth Layer: <span className="font-bold underline">JWT + Bcrypt</span></span>
              </div>
              <div className="bg-black text-white px-3 py-1 inline-block font-bold">
                ✓ AUTH SYSTEM SCAFFOLDED SUCCESSFULLY
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Professional Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 py-32 border-t border-black/5">
        <div className="mb-16">
          <h2 className="text-4xl font-black tracking-tighter uppercase">Professional Architecture</h2>
          <p className="text-black/50 font-medium">Built for scale, audited for security.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-4">
          <DocCard 
            icon={<Box size={24} />}
            title="Modular Design"
            description="Components are decoupled. Swap JWT for Sessions or Prisma for Mongoose with zero friction."
          />
          <DocCard 
            icon={<ShieldCheck size={24} />}
            title="OWASP Standard"
            description="Implements industry protection against CSRF, XSS, and Brute Force attacks out of the box."
          />
          <DocCard 
            icon={<Code2 size={24} />}
            title="Type-Safe"
            description="First-class TypeScript support with generated interfaces for User models and Request objects."
          />
          <DocCard 
            icon={<Layers size={24} />}
            title="Middleware"
            description="Pre-configured Rate limiting using in-storage mem and can be sacalable to redis."
          />
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="relative z-10 max-w-5xl mx-auto px-6 py-32 bg-black text-white rounded-[3rem] mb-20">
        <div className="text-center mb-20">
          <h2 className="text-5xl font-black tracking-tighter uppercase italic">Future Roadmap</h2>
          <p className="text-white/40 uppercase tracking-widest text-xs mt-4">Continuous evolution of the auth stack</p>
        </div>
        <div className="space-y-12">
          <RoadmapItem step="01" status="Live" title="Express.js Core" desc="Full JS/TS support with JWT and Bcrypt integration and also intigrated the session handling usign express-session." />
          <RoadmapItem step="02" status="In Progress" title="Next.js Integration" desc="App Router and page router support, Next-Auth compatibility, and Server Actions." />
          <RoadmapItem step="03" status="Upcoming" title="OAuth 2.0 Providers" desc="One-click social login injection for Google, GitHub, and Apple." />
          <RoadmapItem step="04" status="Planned" title="Multi-Tenant Auth" desc="Enterprise-grade organization and team management scaffolding." />
        </div>
      </section>

      <footer className="flex justify-center align-center pb-10">
        <p className="text-gray-600 underline">@2026 ALL rights reserved by SNAX-07</p>
      </footer>
    </div>
  );
}

function DocCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 border-2 border-black hover:bg-black hover:text-white transition-all group cursor-default">
      <div className="mb-6 group-hover:scale-110 transition-transform duration-300 italic">
        {icon}
      </div>
      <h3 className="text-lg font-black uppercase mb-3 tracking-tighter">{title}</h3>
      <p className="text-sm opacity-60 font-medium leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function RoadmapItem({ step, title, desc, status }: { step: string, title: string, desc: string, status: string }) {
  return (
    <div className="flex flex-col md:flex-row gap-6 border-b border-white/10 pb-8 hover:border-white/40 transition-colors group">
      <div className="text-4xl font-black italic opacity-20 group-hover:opacity-100 transition-opacity">{step}</div>
      <div className="flex-1">
        <div className="flex items-center gap-4 mb-2">
          <h4 className="text-2xl font-bold tracking-tight">{title}</h4>
          <span className="px-2 py-0.5 border border-white/20 rounded text-[10px] uppercase font-bold tracking-widest">{status}</span>
        </div>
        <p className="text-white/50 text-sm max-w-xl font-medium">{desc}</p>
      </div>
    </div>
  );
}