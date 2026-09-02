'use client';

import { useState, useEffect } from 'react';
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
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [customInput, setCustomInput] = useState('');
  const [logs, setLogs] = useState<LogEvent[]>([]);

  // Fetch initial logs from Supabase
  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/orchestrate/logs');
        const data = await res.json();
        
        if (data.logs && data.logs.length > 0) {
          setLogs(data.logs.map((l: any) => ({
            id: l.id,
            timestamp: new Date(l.created_at),
            type: l.event_type as EventType,
            input: l.input_payload,
            confidence: l.confidence,
            action: l.action,
            status: l.status
          })));
        } else {
          // Fallback UI if DB is empty or unconfigured
          setLogs([
            {
              id: 'log-1',
              timestamp: new Date(Date.now() - 1000 * 60 * 5),
              type: 'email',
              input: "Inquiry: We need an AI system to automate our end-to-end email communication. Can we see a demo?",
              confidence: 96,
              action: "Drafted personalized response & scheduled follow-up sequence.",
              status: 'autonomous'
            },
            {
              id: 'log-2',
              timestamp: new Date(Date.now() - 1000 * 60 * 2),
              type: 'project',
              input: "Status Update: The API integration for the payment gateway is blocked because the sandbox credentials expired.",
              confidence: 45,
              action: "Flagged for manual review. AI unsure if this requires an executive meeting or just a Slack update.",
              status: 'review'
            }
          ]);
        }
      } catch (e) {
        console.error('Failed to load logs', e);
      } finally {
        setIsInitialLoad(false);
      }
    };
    
    fetchLogs();
  }, []);

  const DEFAULT_EVENTS: Record<EventType, string> = {
    email: "New Inquiry: Hi, we are looking for a generative AI solution to automate our email responses and handle follow-ups. We handle 500+ emails a day. Can we schedule a demo?",
    lead: "Lead Event: Enterprise CTO downloaded 'AI Automation Case Study', attended our marketing webinar, and viewed the pricing page. Score threshold crossed.",
    project: "Project Update: Frontend team is blocked on the LLM API integration. Authentication endpoints are failing. This might delay the launch."
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
        id: data.id || `log-${Date.now()}`,
        timestamp: data.created_at ? new Date(data.created_at) : new Date(),
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
            <div className="w-9 h-9 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center shadow-lg shadow-[var(--color-primary)]/20">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-semibold text-[var(--color-foreground)] tracking-tight text-lg">Automation Hub</span>
          </div>
          
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-[var(--color-primary)] px-3 py-1.5 rounded-full bg-[var(--color-primary)]/10 border border-[var(--color-primary)]/20 shadow-sm">
                <div className="w-2 h-2 rounded-full bg-[var(--color-primary)] animate-pulse" />
                Live AI & Supabase Connected
             </div>
             <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pt-16 pb-24">
        
        <div className="max-w-4xl mb-16 text-center mx-auto flex flex-col items-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm text-[var(--color-muted-foreground)] text-sm font-medium mb-8">
            <ShieldCheck className="w-4 h-4 text-[var(--color-primary)]" /> 
            Seamless Automated Ecosystems
          </div>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tighter mb-6 text-balance text-[var(--color-foreground)]">
            Bridge the gap between <br/>
            <span className="bg-gradient-to-r from-[var(--color-primary)] to-[#87bbfd] bg-clip-text text-transparent">
              AI & Operational Efficiency.
            </span>
          </h1>
          <p className="text-xl text-[var(--color-muted-foreground)] max-w-2xl text-balance leading-relaxed">
            A custom Generative AI pipeline that evaluates inputs, assigns a safety confidence score, and executes cross-functional workflows. 
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
          
          <div className="lg:col-span-7">
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] stripe-shadow overflow-hidden flex flex-col h-[560px] transition-all">
              
              <div className="flex bg-[var(--color-card)] border-b border-[var(--color-border)] p-2 gap-2">
                {[
                  { id: 'email', icon: Mail, label: 'End-to-End Email' },
                  { id: 'lead', icon: Zap, label: 'Marketing Pipelines' },
                  { id: 'project', icon: Activity, label: 'Project Mgmt' }
                ].map((tab) => (
                  <button 
                    key={tab.id}
                    onClick={() => { setActiveTab(tab.id as EventType); setCustomInput(''); }}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 px-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                      activeTab === tab.id 
                        ? 'bg-[var(--color-primary)]/10 text-[var(--color-primary)] shadow-sm border border-[var(--color-primary)]/10' 
                        : 'text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]'
                    }`}
                  >
                    <tab.icon className="w-4 h-4 shrink-0" /> <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="p-6 md:p-8 flex-1 flex flex-col">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="font-semibold text-[var(--color-foreground)]">Incoming Webhook Payload</span>
                  <span className="text-[var(--color-muted-foreground)] font-mono text-xs bg-[var(--color-muted)] px-2 py-1 rounded">POST /api/webhooks/{activeTab}</span>
                </div>
                
                <div className="relative flex-1 mb-6">
                  <textarea
                    value={customInput || DEFAULT_EVENTS[activeTab]}
                    onChange={(e) => setCustomInput(e.target.value)}
                    className="w-full h-full bg-[var(--color-input-bg)] p-5 rounded-xl font-mono text-[14px] leading-relaxed text-[var(--color-foreground)] resize-none border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-4 focus:ring-[var(--color-primary)]/10 outline-none transition-all shadow-inner"
                    placeholder="Paste a custom event payload here..."
                  />
                </div>
                
                <button 
                  onClick={simulateEvent}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-[var(--color-primary-foreground)] py-4 rounded-xl font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_4px_14px_rgba(99,91,255,0.25)] hover:shadow-[0_6px_20px_rgba(99,91,255,0.35)] hover:-translate-y-0.5 text-base"
                >
                  {isSimulating ? (
                    <><RefreshCw className="w-5 h-5 animate-spin" /> Analyzing via LLM Workflow...</>
                  ) : (
                    <><Send className="w-5 h-5" /> Execute Automation Pipeline</>
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[var(--color-card)] rounded-2xl border border-[var(--color-border)] stripe-shadow h-[560px] flex flex-col">
              <div className="p-5 border-b border-[var(--color-border)] flex items-center gap-3 bg-[var(--color-muted)]/30">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-[var(--color-foreground)]" />
                </div>
                <h3 className="font-semibold text-base text-[var(--color-foreground)]">Orchestration Feed</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[var(--color-background)]/30">
                {isInitialLoad ? (
                  <div className="flex items-center justify-center h-full text-[var(--color-muted-foreground)]">
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  </div>
                ) : logs.map((log) => (
                  <div key={log.id} className="p-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] space-y-4 shadow-sm hover:shadow-md transition-all duration-200 relative overflow-hidden group">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-[var(--color-border)] group-hover:bg-[var(--color-primary)] transition-colors" />
                    
                    <div className="flex items-start justify-between pl-1">
                      <div className="flex items-center gap-2">
                        {log.status === 'autonomous' ? (
                          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[var(--color-success)] bg-[var(--color-success-bg)] px-2.5 py-1 rounded-full border border-[var(--color-success)]/20">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Autonomous
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-wider font-bold text-[var(--color-warning)] bg-[var(--color-warning-bg)] px-2.5 py-1 rounded-full border border-[var(--color-warning)]/20">
                            <AlertCircle className="w-3.5 h-3.5" /> Human Review
                          </div>
                        )}
                      </div>
                      <div className="text-xs font-mono font-semibold text-[var(--color-muted-foreground)]">
                        Conf: <span className={log.confidence >= 90 ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}>{log.confidence}%</span>
                      </div>
                    </div>
                    
                    <div className="text-[13px] pl-1 text-[var(--color-muted-foreground)] bg-[var(--color-input-bg)] p-3 rounded-lg font-mono border border-[var(--color-border)]/50">
                      <span className="line-clamp-2 leading-relaxed">"{log.input}"</span>
                    </div>
                    
                    <div className="flex gap-3 pl-1 pt-1">
                      <ArrowRight className="w-5 h-5 text-[var(--color-primary)] shrink-0 mt-0.5" />
                      <p className="text-sm font-medium leading-relaxed text-[var(--color-foreground)]">{log.action}</p>
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
