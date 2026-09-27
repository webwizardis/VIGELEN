import React, { useState, useRef, useEffect } from 'react';
import {
  MessageSquareCode,
  X,
  Send,
  Bot,
  User,
  Shield,
  RefreshCw,
} from 'lucide-react';
import { ShieldChatMessage } from '../../types';
import { apiChatWithShield } from '../../services/api';

interface ShieldAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShieldAssistantModal: React.FC<ShieldAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ShieldChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      timestamp: 'Just now',
      text: 'VIGILEN Risk Intelligence: I can assist with evaluating financial risk signals, interpreting anomaly scores, explaining behavioral deviations, or validating regulatory compliance protocols.',
      suggestedFollowUps: [
        'How is the risk score calculated?',
        'What indicators trigger high-risk status?',
        'How does behavioral anomaly detection work?',
        'How do I verify a broker registration number?',
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
      const response = await apiChatWithShield(text, messages);
      const assistantMsg: ShieldChatMessage = {
        id: `assistant-${Date.now()}`,
        sender: 'assistant',
        timestamp: 'Just now',
        text: response,
        suggestedFollowUps: [
          'What are safe next actions for the investor?',
          'What are the statutory guidelines regarding guarantees?',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-900/60 p-4 backdrop-blur-xs">
      <div className="flex h-[580px] w-full max-w-xl flex-col rounded-lg border border-neutral-200 bg-white shadow-2xl dark:border-neutral-800 dark:bg-neutral-950">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                VIGILEN Risk Intelligence Specialist
              </h2>
              <p className="text-[10px] text-neutral-400">
                Analytical Query & Indicator Explanations
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close assistant"
            className="flex h-7 w-7 items-center justify-center rounded text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4 text-xs">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300">
                    <Bot className="h-3.5 w-3.5" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-lg p-3 leading-relaxed ${
                    isUser
                      ? 'bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900'
                      : 'border border-neutral-100 bg-neutral-50 text-neutral-800 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-200'
                  }`}
                >
                  <p>{msg.text}</p>

                  {/* Suggested Followups */}
                  {msg.suggestedFollowUps && (
                    <div className="mt-3 flex flex-wrap gap-1.5 border-t border-neutral-200/50 pt-2 dark:border-neutral-800">
                      {msg.suggestedFollowUps.map((prompt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSend(prompt)}
                          className="rounded border border-neutral-200 bg-white px-2 py-1 text-[11px] text-neutral-700 transition-colors hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
                        >
                          {prompt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {loading && (
            <div className="flex items-center gap-2 text-neutral-400">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
              <span>Analyzing risk signals...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="border-t border-neutral-100 p-3 dark:border-neutral-800">
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
              placeholder="Ask about risk indicators, score attribution, or regulations..."
              className="flex-1 rounded-md border border-neutral-200 bg-neutral-50 px-3 py-2 text-xs text-neutral-900 focus:border-neutral-900 focus:outline-hidden dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-md bg-neutral-900 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-neutral-800 disabled:opacity-50 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
