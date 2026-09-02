'use client';

import { useState } from 'react';
import { Bot, Mail, MessageSquare, Zap, Activity, CheckCircle2, AlertCircle, RefreshCw, Send, ArrowRight, ShieldCheck } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Footer } from '@/components/Footer';

type EventType = 'email' | 'lead' | 'project';

interface LogEvent {
  id: string;
  timestamp: Date;
  type: EventType;
  input: string;
  confidence: number;
  action: string;
  status: 'autonomous' | 'review' | 'pending';
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<EventType>('email');
  const [isSimulating, setIsSimulating] = useState(false);
  const [customInput, setCustomInput] = useState('');
  
  const [logs, setLogs] = useState<LogEvent[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'email',
      input: "Can I reset my password? I forgot it again.",
      confidence: 98,
      action: "Sent password reset link via SendGrid.",
      status: 'autonomous'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      type: 'project',
      input: "We need to discuss the timeline changes because the API is blocked.",
      confidence: 45,
      action: "Flagged for manual review. AI unsure if this requires an executive meeting or just a Slack update.",
      status: 'review'
    }
  ]);

  const DEFAULT_EVENTS: Record<EventType, string> = {
    email: "Hi team, I'd like to get a quote for a 3-month engagement starting next week. What's your availability?",
    lead: "User viewed 'Enterprise Pricing', downloaded 'Q3 Case Study', and attended 'Automation Webinar'.",
    project: "The API integration for the payment gateway is blocked because the sandbox credentials expired."
  };

  const getPayload = () => customInput.trim() || DEFAULT_EVENTS[activeTab];

  const simulateEvent = async () => {
    setIsSimulating(true);
    const payload = getPayload();
    
    try {
      const res = await fetch('/api/orchestrate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: activeTab,
          payload: payload
        })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to process event');
      }
      
      const newEvent: LogEvent = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        type: activeTab,
        input: payload,
        confidence: data.confidence,
        action: data.action,
        status: data.status
      };
      
      setLogs(prev => [newEvent, ...prev]);
    } catch (error: any) {
      const errorEvent: LogEvent = {
        id: `log-${Date.now()}`,
        timestamp: new Date(),
        type: activeTab,
        input: payload,
        confidence: 0,
        action: `System Error: ${error.message}. Fallback sequence initiated.`,
        status: 'review'
      };
      setLogs(prev => [errorEvent, ...prev]);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen">
      
      <header className="border-b border-[var(--color-border)] glass-panel sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
              <Bot className="w-4 h-4" />
            </div>
            <span className="font-semibold text-[var(--color-foreground)] tracking-tight">AI Automation Hub</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-xs font-medium text-[var(--color-primary)] px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-primary)] animate-pulse" />
                Live Gemini LLM Connected
             </div>
             <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-20 pb-24">
        
        {/* Hero Section */}
        <div className="max-w-3xl mb-16 text-center mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-muted)] text-[var(--color-muted-foreground)] text-xs font-medium mb-6">
            <ShieldCheck className="w-4 h-4" /> Enterprise-Grade Safety Rails
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold tracking-tighter mb-6 text-balance">
            Confidence-Routed <br/>
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-blue-500 bg-clip-text text-transparent">
              AI Orchestration.
            </span>
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] max-w-2xl text-balance leading-relaxed">
            This live demo proves the core architecture: A Live LLM evaluates inputs, assigns a confidence score, and routes the action. High confidence executes autonomously. Low confidence routes to a human. 
          </p>
        </div>

        {/* Dashboard UI */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 relative z-10">
          
          <div className="lg:col-span-7">
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] stripe-shadow overflow-hidden flex flex-col h-[540px] transition-all">
              
              <div className="flex bg-[var(--color-card)] border-b border-[var(--color-border)] p-2 gap-2">
                {[
                  { id: 'email', icon: Mail, label: 'Email Automation' },
                  { id: 'lead', icon: Zap, label: 'Lead Scoring' },
                  { id: 'project', icon: Activity, label: 'Project Mgmt' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as EventType); setCustomInput(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${activeTab === tab.id ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm' : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'}`}
                  >
                    <tab.icon className="w-4 h-4" /> <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--color-foreground)]">Incoming Webhook Payload</span>
                  <span className="text-[var(--color-muted-foreground)] font-mono text-xs bg-[var(--color-muted)] px-2 py-1 rounded">POST /api/webhooks/{activeTab}</span>
                </div>
                
                <div className="relative flex-1 mb-6 group">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[var(--color-card)] pointer-events-none opacity-0 transition-opacity" />
                  <textarea
                    value={customInput || DEFAULT_EVENTS[activeTab]}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full h-full bg-[#f8fafc] dark:bg-[#0f0f11] p-5 rounded-xl font-mono text-[13px] leading-relaxed text-[var(--color-foreground)] resize-none border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all shadow-inner"
                    placeholder="Paste a custom event payload here..."
                  />
                </div>
                
                <button 
                  onClick={simulateEvent}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[#5851df] dark:hover:bg-[#75a7e6] text-[var(--color-primary-foreground)] py-3.5 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_2px_10px_rgba(99,91,255,0.2)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.3)] hover:-translate-y-0.5"
                >
                  {isSimulating ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Processing via Live LLM...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Trigger Automation Pipeline</>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] stripe-shadow h-[540px] flex flex-col">
              <div className="p-5 border-b border-[var(--color-border)] flex items-center gap-2 bg-gradient-to-r from-transparent to-[var(--color-muted)]/30">
                <div className="w-6 h-6 rounded bg-[var(--color-muted)] flex items-center justify-center">
                  <MessageSquare className="w-3.5 h-3.5 text-[var(--color-foreground)]" />
                </div>
                <h3 className="font-semibold text-sm">Orchestration Feed</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] space-y-3 shadow-sm hover:shadow-md transition-shadow duration-200 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[var(--color-border)] to-transparent group-hover:from-[var(--color-primary)] transition-colors" />
                    <div className="flex items-start justify-between pl-2">
                      <div className="flex items-center gap-2">
                        {log.status === 'autonomous' ? (
                          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[var(--color-success)] bg-[var(--color-success)]/10 px-2.5 py-1 rounded-full border border-[var(--color-success)]/20">
                            <CheckCircle2 className="w-3 h-3" /> Autonomous
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[var(--color-warning)] bg-[var(--color-warning)]/10 px-2.5 py-1 rounded-full border border-[var(--color-warning)]/20">
                            <AlertCircle className="w-3 h-3" /> Human Review
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-mono font-semibold text-[var(--color-muted-foreground)]">
                        Conf: <span className={log.confidence >= 90 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}>{log.confidence}%</span>
                      </div>
                    </div>
                    <div className="text-[13px] pl-2 text-[var(--color-muted-foreground)] bg-[var(--color-muted)]/50 p-2 rounded-md font-mono">
                      <span className="line-clamp-2">"{log.input}"</span>
                    </div>
                    <div className="flex gap-2 pl-2 pt-1">
                      <ArrowRight className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                      <p className="text-sm font-medium leading-snug">{log.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
