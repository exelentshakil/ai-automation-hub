'use client';

import { useState } from 'react';
import { Bot, Mail, MessageSquare, Zap, Activity, CheckCircle2, AlertCircle, RefreshCw, Send, ArrowRight } from 'lucide-react';
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

const MOCK_EVENTS = {
  email: "Hi team, I'd like to get a quote for a 3-month engagement starting next week. What's your availability?",
  lead: "User viewed 'Enterprise Pricing', downloaded 'Q3 Case Study', and attended 'Automation Webinar'.",
  project: "The API integration for the payment gateway is blocked because the sandbox credentials expired."
};

export default function Home() {
  const [activeTab, setActiveTab] = useState<EventType>('email');
  const [isSimulating, setIsSimulating] = useState(false);
  const [logs, setLogs] = useState<LogEvent[]>([
    {
      id: 'log-1',
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
      type: 'email',
      input: "Can I reset my password?",
      confidence: 98,
      action: "Sent password reset link via SendGrid.",
      status: 'autonomous'
    },
    {
      id: 'log-2',
      timestamp: new Date(Date.now() - 1000 * 60 * 2),
      type: 'project',
      input: "We need to discuss the timeline changes.",
      confidence: 45,
      action: "Flagged for manual review. AI unsure if this requires an executive meeting or just a Slack update.",
      status: 'review'
    }
  ]);

  const simulateEvent = async () => {
    setIsSimulating(true);
    
    // Simulate AI latency
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    const newEvent: LogEvent = {
      id: `log-${Date.now()}`,
      timestamp: new Date(),
      type: activeTab,
      input: MOCK_EVENTS[activeTab],
      confidence: activeTab === 'project' ? 62 : 94,
      action: activeTab === 'email' 
        ? "Drafted quote template and scheduled send for 9AM tomorrow." 
        : activeTab === 'lead'
        ? "Scored Lead as HOT (85). Triggered 'Enterprise Follow-up' HubSpot sequence."
        : "Confidence too low for autonomous task creation. Drafted Jira ticket for review.",
      status: activeTab === 'project' ? 'review' : 'autonomous'
    };
    
    setLogs(prev => [newEvent, ...prev]);
    setIsSimulating(false);
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      
      {/* Header */}
      <header className="border-b border-[var(--color-border)] bg-[var(--color-background)]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[var(--color-primary)] text-[var(--color-primary-foreground)] flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <span className="font-semibold text-lg tracking-tight">AI Automation Hub</span>
          </div>
          <div className="flex items-center gap-4">
             <div className="hidden md:flex items-center gap-2 text-sm text-[var(--color-muted-foreground)] px-3 py-1.5 rounded-full bg-[var(--color-muted)]">
                <div className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                Deterministic Simulator Active
             </div>
             <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Hero */}
        <div className="max-w-3xl mb-12">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Confidence-Routed <br/>
            <span className="text-[var(--color-muted-foreground)]">AI Orchestration.</span>
          </h1>
          <p className="text-lg text-[var(--color-muted-foreground)] mb-8 max-w-2xl">
            This demo proves the core architecture: AI evaluates inputs, assigns a confidence score, and routes the action. High confidence executes autonomously. Low confidence routes to a human. Operational safety guaranteed.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Col: Simulator */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm overflow-hidden flex flex-col h-[500px]">
              
              {/* Tabs */}
              <div className="flex border-b border-[var(--color-border)]">
                <button 
                  onClick={() => setActiveTab('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === 'email' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'}`}
                >
                  <Mail className="w-4 h-4" /> Email Automation
                </button>
                <button 
                  onClick={() => setActiveTab('lead')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === 'lead' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'}`}
                >
                  <Zap className="w-4 h-4" /> Lead Scoring
                </button>
                <button 
                  onClick={() => setActiveTab('project')}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 text-sm font-medium transition-colors ${activeTab === 'project' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-foreground)]' : 'text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]'}`}
                >
                  <Activity className="w-4 h-4" /> Project Mgmt
                </button>
              </div>

              {/* Payload Area */}
              <div className="p-6 flex-1 flex flex-col">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-[var(--color-muted-foreground)]">Incoming Webhook Payload</span>
                  <span className="text-[var(--color-muted-foreground)] font-mono text-xs">POST /api/webhooks/{activeTab}</span>
                </div>
                <div className="bg-[var(--color-muted)] p-4 rounded-lg font-mono text-sm text-[var(--color-foreground)] mb-6 flex-1 flex items-center">
                  "{MOCK_EVENTS[activeTab]}"
                </div>
                
                <button 
                  onClick={simulateEvent}
                  disabled={isSimulating}
                  className="w-full flex items-center justify-center gap-2 bg-[var(--color-primary)] text-[var(--color-primary-foreground)] py-3 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {isSimulating ? (
                    <><RefreshCw className="w-4 h-4 animate-spin" /> Processing via Claude 3.5 Sonnet...</>
                  ) : (
                    <><Send className="w-4 h-4" /> Trigger Automation Pipeline</>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Right Col: Feed */}
          <div className="lg:col-span-5">
            <div className="bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] shadow-sm h-[500px] flex flex-col">
              <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-[var(--color-muted-foreground)]" />
                <h3 className="font-semibold text-sm">Orchestration Feed</h3>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {logs.map((log) => (
                  <div key={log.id} className="p-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {log.status === 'autonomous' ? (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-success)] bg-[var(--color-success)]/10 px-2 py-1 rounded-full">
                            <CheckCircle2 className="w-3 h-3" /> Autonomous
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-xs font-medium text-[var(--color-warning)] bg-[var(--color-warning)]/10 px-2 py-1 rounded-full">
                            <AlertCircle className="w-3 h-3" /> Human Review
                          </div>
                        )}
                        <span className="text-xs text-[var(--color-muted-foreground)] font-mono">
                          {log.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <div className="text-xs font-mono font-medium">
                        Conf: {log.confidence}%
                      </div>
                    </div>
                    <div className="text-sm border-l-2 border-[var(--color-border)] pl-3 text-[var(--color-muted-foreground)]">
                      <span className="line-clamp-2">{log.input}</span>
                    </div>
                    <div className="flex gap-2">
                      <ArrowRight className="w-4 h-4 text-[var(--color-primary)] shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">{log.action}</p>
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
