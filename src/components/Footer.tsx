import { ExternalLink, Github, Code, CheckCircle2 } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-[var(--color-border)] bg-[var(--color-muted)]/30 mt-12 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
        
        {/* Left Col: Project Scope */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Enterprise Implementation Architecture</h3>
          <div className="space-y-2 text-sm text-[var(--color-muted-foreground)]">
            <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
              <span>Phase 0: Core Engine (This Demo)</span>
              <span className="font-medium text-[var(--color-foreground)]">Built</span>
            </div>
            <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
              <span>Phase 1: Email + Lead Scoring</span>
              <span className="font-medium text-[var(--color-foreground)]">24 hrs</span>
            </div>
            <div className="flex justify-between border-b border-[var(--color-border)] pb-2">
              <span>Phase 2: PM Integrations & Dashboard</span>
              <span className="font-medium text-[var(--color-foreground)]">32 hrs</span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="font-semibold text-[var(--color-foreground)]">Phase 1 Value</span>
              <span className="font-semibold text-[var(--color-success)]">Enterprise</span>
            </div>
          </div>
        </div>

        {/* Middle Col: Architecture */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Architecture Decisions</h3>
          <ul className="space-y-3">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium">Confidence Routing</p>
                <p className="text-[var(--color-muted-foreground)]">AI evaluates, deterministic code executes. High confidence executes autonomously, low flags for human review.</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-[var(--color-success)] mt-0.5 shrink-0" />
              <div className="text-sm">
                <p className="font-medium">LLM Fallback Chain</p>
                <p className="text-[var(--color-muted-foreground)]">Primary model (Claude 3.5 Sonnet) falls back to Gemini/GPT-4o on timeout/error for 100% uptime.</p>
              </div>
            </li>
          </ul>
        </div>

        {/* Right Col: About / Links */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">About This Build</h3>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            This architecture is the exact blueprint used to safely scale agency operations into the seven-figure range. By embedding human-in-the-loop approvals strictly for edge cases, we are building a high-leverage communication asset that lets your existing team manage 10x the client load without ever sacrificing trust or quality.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <a href="https://github.com/exelentshakil" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--color-primary)] transition-colors w-fit">
              <Github className="w-4 h-4" /> View GitHub Profile
            </a>
            <a href="https://shakilhq.com" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium hover:text-[var(--color-primary)] transition-colors w-fit">
              <ExternalLink className="w-4 h-4" /> View Portfolio
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
