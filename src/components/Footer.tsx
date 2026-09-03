import { ExternalLink, Github, Code, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/30 mt-12 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        
        {/* Left Col: Architecture */}
        <div className="space-y-6">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Code className="w-5 h-5 text-[var(--color-primary)]" />
            Enterprise Implementation Architecture
          </h3>
          
          <div className="text-sm text-[var(--color-muted-foreground)] leading-relaxed space-y-4">
            <p>This architecture is the exact blueprint used to safely scale agency operations into the seven-figure range. By embedding human-in-the-loop approvals strictly for edge cases, we are building a high-leverage communication asset that lets your existing team manage 10x the client load without ever sacrificing trust or quality.</p>
          </div>

          <ul className="space-y-4 pt-4 border-t border-[var(--color-border)]">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-[var(--color-foreground)]">Confidence Routing</p>
                <p className="text-[var(--color-muted-foreground)]">AI evaluates, deterministic code executes. High confidence executes autonomously, low flags for human review.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-[var(--color-foreground)]">LLM Fallback Chain</p>
                <p className="text-[var(--color-muted-foreground)]">Primary model (Claude 3.5 Sonnet) falls back to Gemini/GPT-4o on timeout/error for 100% uptime.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Col: Core Subsystems */}
        <div className="space-y-6 md:pl-8 border-l border-[var(--color-border)]">
          <h3 className="font-semibold text-lg">Core Subsystems</h3>
          
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <span className="text-[var(--color-muted-foreground)] flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--color-success)]"/> Engine & Confidence Router</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-[var(--color-muted-foreground)] flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--color-success)]"/> Email + Lead Scoring Integrations</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-[var(--color-muted-foreground)] flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--color-success)]"/> PM Integrations (Jira/Asana)</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-[var(--color-muted-foreground)] flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[var(--color-success)]"/> Human-in-the-Loop Dashboard</span>
            </div>
          </div>

          <div className="pt-8 border-t border-[var(--color-border)]">
            <h3 className="font-semibold text-base mb-4">About This Build</h3>
            <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
              Built as an enterprise proof-of-concept. I build production-grade AI systems that don't just generate text, but safely execute business logic.
            </p>
            <div className="flex flex-col gap-2">
              <a href="https://github.com/exelentshakil" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--color-primary)] transition-colors w-fit">
                <Github className="w-4 h-4" /> View GitHub Profile
              </a>
              <a href="https://shakilhq.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--color-primary)] transition-colors w-fit">
                <ExternalLink className="w-4 h-4" /> View Portfolio
              </a>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}
