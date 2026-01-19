"use client";
import React from "react";
import { motion } from "framer-motion";
import { 
  GitPullRequest, 
  Terminal, 
  Settings, 
  Bug, 
  Lightbulb, 
  CheckCircle2, 
  FileCode2,
  Users,
  ExternalLink,
  Github
} from "lucide-react";

export default function ContributingPage() {
  return (
    <div className="min-h-screen bg-white text-black font-sans selection:bg-black selection:text-white">
      {/* Structural Grid Background */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#e5e5e5_1px,transparent_1px),linear-gradient(to_bottom,#e5e5e5_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:linear-gradient(to_bottom,white,transparent)] pointer-events-none" />

      {/* Header */}
      <header className="relative z-10 border-b-4 border-black bg-white">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.3em] mb-2 flex items-center gap-2">
                <Users size={14} /> Open Source Protocol
              </p>
              <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-none">
                Contributing<br />Guidelines.
              </h1>
            </div>
            <div className="bg-black text-white p-6 max-w-xs border-l-8 border-white">
              <p className="text-xs font-medium leading-relaxed italic">
                "We are building a standard, not just a tool. Every pull request should move us toward cleaner, more modular authentication."
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-8 py-20 grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* Sidebar Navigation (Sticky) */}
        <aside className="lg:col-span-3">
          <div className="sticky top-10 space-y-8">
            <div>
              <h3 className="text-xs font-black uppercase tracking-widest text-black/40 mb-4">Jump To</h3>
              <ul className="space-y-3 text-sm font-bold uppercase tracking-tight">
                <li className="hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2"><ArrowRight size={14}/> Environment Setup</li>
                <li className="hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2"><ArrowRight size={14}/> Workflow</li>
                <li className="hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2"><ArrowRight size={14}/> Standards</li>
                <li className="hover:translate-x-2 transition-transform cursor-pointer flex items-center gap-2"><ArrowRight size={14}/> Roadmap</li>
              </ul>
            </div>
            <div className="p-4 border-2 border-black bg-black/5 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-[10px] font-black uppercase mb-2 underline">Need Help?</p>
              <p className="text-xs font-medium text-black/60">Join our Discord for real-time collaboration on Next.js templates.</p>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <div className="lg:col-span-9 space-y-24">
          
          {/* Section: Local Setup */}
          <section>
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-black text-white"><Settings size={24} /></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">01. Environment Setup</h2>
            </div>
            <p className="text-black/60 font-medium mb-6">To contribute, you must first link the CLI locally to test the scaffolding commands in real-time.</p>
            <div className="bg-slate-50 border-2 border-black p-6 font-mono text-sm space-y-3 overflow-x-auto">
              <div className="flex gap-4">
                <span className="text-black/30">1</span>
                <span>git clone https://github.com/your-username/auth-scaffolder.git</span>
              </div>
              <div className="flex gap-4">
                <span className="text-black/30">2</span>
                <span>npm install</span>
              </div>
              <div className="flex gap-4">
                <span className="text-black/30">3</span>
                <span className="text-black font-bold">npm link</span>
              </div>
              <div className="flex gap-4">
                <span className="text-black/30">4</span>
                <span className="text-black/40 italic"># Now you can use the command globally for testing</span>
              </div>
              <div className="flex gap-4">
                <span className="text-black/30">5</span>
                <span>auth-scaffolder init</span>
              </div>
            </div>
          </section>

          {/* Section: Workflow */}
          <section className="grid md:grid-cols-2 gap-8">
            <div className="p-8 border-2 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)]">
              <Bug size={32} className="mb-4" />
              <h3 className="text-xl font-black uppercase mb-2 italic">Found a Bug?</h3>
              <p className="text-sm text-black/60 leading-relaxed font-medium">
                Submit an issue using our structured template. Include your Node version, OS, and the target framework (Express/Next).
              </p>
            </div>
            <div className="p-8 border-2 border-black bg-black text-white shadow-[10px_10px_0px_0px_rgba(229,229,229,1)]">
              <Lightbulb size={32} className="mb-4" />
              <h3 className="text-xl font-black uppercase mb-2 italic">Feature Requests</h3>
              <p className="text-sm text-white/60 leading-relaxed font-medium">
                We prioritize Next.js App Router support and OAuth integrations. Open a discussion before writing code.
              </p>
            </div>
          </section>

          {/* Section: Engineering Standards */}
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="p-3 bg-black text-white"><FileCode2 size={24} /></div>
              <h2 className="text-3xl font-black uppercase tracking-tighter italic">02. Engineering Standards</h2>
            </div>
            
            <div className="space-y-6">
              <StandardItem 
                title="Strict Typing" 
                desc="All template-generation logic must be 100% Type-Safe. Use the internal `FrameworkConfig` interface." 
              />
              <StandardItem 
                title="Atomic Templates" 
                desc="Keep JS and TS templates in separate directories. Do not use transpilers; we provide raw, readable code to users." 
              />
              <StandardItem 
                title="Zero Dependencies" 
                desc="Avoid adding new runtime dependencies to the CLI core unless strictly necessary for auth security." 
              />
            </div>
          </section>

          {/* Footer of Docs */}
          <div className="pt-20 border-t-2 border-black flex items-center justify-between">
            <p className="text-[10px] font-black uppercase tracking-widest text-black/40">© 2026 Auth-CLI Engine</p>
            <div className="flex gap-6">
              <Github size={20} className="hover:scale-110 transition-transform cursor-pointer" />
              <ExternalLink size={20} className="hover:scale-110 transition-transform cursor-pointer" />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function StandardItem({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="group flex items-start gap-6 border-l-4 border-black/10 pl-6 hover:border-black transition-colors">
      <div className="pt-1"><CheckCircle2 size={18} className="text-black/20 group-hover:text-black transition-colors" /></div>
      <div>
        <h4 className="text-lg font-black uppercase tracking-tight mb-1">{title}</h4>
        <p className="text-black/50 text-sm font-medium">{desc}</p>
      </div>
    </div>
  );
}

function ArrowRight({ size, className }: { size?: number, className?: string }) {
  return (
    <svg 
      width={size || 24} 
      height={size || 24} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="3" 
      strokeLinecap="square" 
      strokeLinejoin="miter" 
      className={className}
    >
      <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
  );
}