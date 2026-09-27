import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Send,
  Sparkles,
  HelpCircle,
  FileText,
  AlertTriangle,
  CreditCard,
  RefreshCw,
  Shield,
  CornerDownLeft,
} from 'lucide-react';
import { ShieldChatMessage } from '../../types';
import { apiChatWithShield } from '../../services/api';

interface VigilAssistantPanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentPageContext?: string;
  selectedCaseContext?: {
    caseNumber: string;
    title: string;
    riskScore: number;
    summary: string;
  } | null;
}

export const VigilAssistantPanel: React.FC<VigilAssistantPanelProps> = ({
  isOpen,
  onClose,
  currentPageContext = 'Dashboard',
  selectedCaseContext,
}) => {
  const [messages, setMessages] = useState<ShieldChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: `Hello. I am the Vigil Assistant. I provide context-aware risk explanations for ${
        selectedCaseContext ? `Case ${selectedCaseContext.caseNumber}` : currentPageContext
      }. Ask me about detected risk signals, behavioral deviations, evidence records, or regulatory standards.`,
      suggestedFollowUps: [
        'Why was this flagged?',
        'What evidence supports this risk score?',
        'Summarize this investigation.',
        'Explain this transaction anomaly.',
        'Explain this investment claim.',
      ],
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || input;
    if (!text.trim() || loading) return;

    const userMsg: ShieldChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      timestamp: 'Just now',
      text,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Pass contextual metadata to the chat endpoint
      const contextualPrompt = selectedCaseContext
        ? `[Context: Case ${selectedCaseContext.caseNumber} - ${selectedCaseContext.title}, Score: ${selectedCaseContext.riskScore}/100]\nUser question: ${text}`
        : `[Context: Page ${currentPageContext}]\nUser question: ${text}`;

      const response = await apiChatWithShield(contextualPrompt, messages);
      const assistantMsg: ShieldChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: response,
        suggestedFollowUps: [
          'What are safe next actions for the investor?',
          'What are statutory guidelines on guarantees?',
        ],
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-2xs transition-opacity"
      />

      {/* Slide-over Right Panel */}
      <aside className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-slate-200 bg-white shadow-2xl transition-transform duration-200">
        {/* Panel Header */}
        <div className="flex h-14 items-center justify-between border-b border-slate-100 px-4 bg-slate-50/80">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-display text-xs font-bold text-slate-900">
                  Vigil Assistant
                </h3>
                <span className="rounded bg-indigo-100 px-1.5 py-0.2 font-mono text-[9px] font-bold text-indigo-700">
                  Contextual
                </span>
              </div>
              <p className="text-[10px] text-slate-500 truncate max-w-[220px]">
                {selectedCaseContext
                  ? `Active: ${selectedCaseContext.caseNumber}`
                  : `Context: ${currentPageContext}`}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close Vigil Assistant"
            className="flex h-7 w-7 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Guardrail Policy Banner */}
        <div className="border-b border-slate-100 bg-amber-50/60 px-4 py-2 text-[10px] text-amber-800 flex items-center justify-between">
          <span>Non-advisory guardrail active. Will never request PINs or execute orders.</span>
        </div>

        {/* Messages Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${
                msg.sender === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[88%] rounded-xl p-3 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium shadow-2xs'
                    : 'border border-slate-200 bg-slate-50 text-slate-800'
                }`}
              >
                {msg.text}
              </div>
              <span className="mt-1 font-mono text-[9px] text-slate-400 px-1">
                {msg.timestamp}
              </span>

              {/* Follow-up suggestions */}
              {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                <div className="mt-2.5 flex flex-wrap gap-1.5">
                  {msg.suggestedFollowUps.map((prompt, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={() => handleSend(prompt)}
                      className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-medium text-slate-700 transition-colors hover:border-indigo-300 hover:bg-indigo-50/70 hover:text-indigo-900"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-slate-400 p-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-600" />
              <span>Analyzing context and risk heuristics...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-slate-200 bg-white p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about this case or anomaly..."
              disabled={loading}
              className="flex-1 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:bg-white focus:outline-hidden disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              aria-label="Send message"
              className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600 text-white shadow-2xs hover:bg-indigo-700 disabled:opacity-50"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
          <p className="mt-1.5 text-center text-[10px] text-slate-400">
            Press Enter to ask. Never enter passwords, OTPs, or financial secrets.
          </p>
        </div>
      </aside>
    </>
  );
};
