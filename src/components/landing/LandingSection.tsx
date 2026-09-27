import React, { useState } from 'react';
import {
  Search,
  CreditCard,
  FolderOpen,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  Check,
} from 'lucide-react';

export interface LandingSectionProps {
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  onSelectFeature?: (featureId: string) => void;
}

export const LandingSection: React.FC<LandingSectionProps> = ({
  onPrimaryAction,
  onSecondaryAction,
  onSelectFeature,
}) => {
  const [selectedCardId, setSelectedCardId] = useState<string>('content');

  const featureCards = [
    {
      id: 'content',
      icon: <Search className="h-5 w-5 text-[#1a1a1a]" aria-hidden="true" />,
      category: 'Screening Engine',
      heading: 'Investment Content Analysis',
      body: 'Evaluates public promotional messages, chat group tips, Telegram forwards, and unverified advisory claims against statutory indicators of guaranteed return fraud.',
      caption: 'Empirical pattern identification without persistent data retention',
      actionText: 'Open Content Scanner',
      targetId: 'scam-detector',
      details: [
        'Flags claims of guaranteed returns and zero-risk investments',
        'Identifies pressure tactics, false scarcity, and psychological coercion',
        'Cross-checks disclosed entity credentials against registered broker lists',
      ],
    },
    {
      id: 'transaction',
      icon: <CreditCard className="h-5 w-5 text-[#1a1a1a]" aria-hidden="true" />,
      category: 'Surveillance Engine',
      heading: 'Payment Velocity & Anomaly Checks',
      body: 'Assesses proposed transfer amounts, recipient payment addresses, and execution timing against normal operating baselines to intercept illicit destinations.',
      caption: 'Pre-transfer verification for unusual recipient payment handles',
      actionText: 'Open Transaction Security',
      targetId: 'transaction-security',
      details: [
        'Compares transfer amounts against historical spending percentiles',
        'Detects sudden high-velocity transfers to newly created individual accounts',
        'Highlights off-hours payment requests characteristic of social engineering',
      ],
    },
    {
      id: 'cases',
      icon: <FolderOpen className="h-5 w-5 text-[#1a1a1a]" aria-hidden="true" />,
      category: 'Audit & Compliance',
      heading: 'Structured Evidence & Audit Records',
      body: 'Consolidates communication records, transaction details, and risk evaluations into standardized documentation suitable for internal review or regulatory submission.',
      caption: 'Formatted reporting aligned with financial regulatory complaint standards',
      actionText: 'Open Case Management',
      targetId: 'cases',
      details: [
        'Maintains chronological logs of flagged communications and timestamps',
        'Compiles recipient identifiers, VPAs, and payment reference hashes',
        'Generates exportable tamper-evident audit summaries for regulatory records',
      ],
    },
  ];

  const activeFeature = featureCards.find((c) => c.id === selectedCardId) || featureCards[0];

  return (
    <div className="space-y-16 max-w-5xl">
      {/* Header Block matching Variation 12 */}
      <div className="section-header">
        <div className="mono text-[#2563eb] mb-4">
          — Platform Architectural Specification
        </div>

        <h1
          id="landing-heading"
          className="font-serif text-[3.2rem] sm:text-[4rem] lg:text-[4.5rem] font-semibold text-[#1a1a1a] leading-none tracking-tight mb-6"
        >
          Early-Stage Fraud Detection & Capital Protection
        </h1>

        <p className="text-base sm:text-lg text-[#71717a] leading-relaxed max-w-3xl">
          Screen suspicious investment solicitations, detect abnormal payment velocity, and compile structured evidence before retail capital is irreversibly transferred.
        </p>

        {/* Action CTAs in Variation 12 style */}
        <div className="actions flex flex-wrap gap-4 sm:gap-6 mt-10">
          <button
            type="button"
            onClick={onPrimaryAction}
            className="btn btn-primary"
          >
            <span>Analyze Investment Content</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={onSecondaryAction}
            className="btn"
          >
            <span>Review Anomaly Detection</span>
            <ExternalLink className="h-3.5 w-3.5 text-[#71717a]" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* 3 Metric/Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {featureCards.map((card) => {
          const isSelected = selectedCardId === card.id;

          return (
            <div
              key={card.id}
              onClick={() => {
                setSelectedCardId(card.id);
                if (onSelectFeature) onSelectFeature(card.targetId);
              }}
              className={`border p-6 sm:p-8 flex flex-col justify-between transition-all cursor-pointer bg-[#ffffff] ${
                isSelected
                  ? 'border-[#1a1a1a] shadow-xs'
                  : 'border-[#e4e4e7] hover:border-[#1a1a1a]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex h-10 w-10 items-center justify-center border border-[#e4e4e7] bg-[#fdfdfc]">
                    {card.icon}
                  </div>
                  <span className="mono text-[#71717a]">
                    {card.category}
                  </span>
                </div>

                <h2 className="font-serif text-2xl font-semibold text-[#1a1a1a] tracking-tight leading-snug mb-3">
                  {card.heading}
                </h2>

                <p className="text-xs text-[#71717a] leading-relaxed mb-6">
                  {card.body}
                </p>
              </div>

              <div className="pt-4 border-t border-[#e4e4e7]">
                <div className="flex items-center justify-between">
                  <span className="mono text-[0.6rem] text-[#71717a]">
                    {card.caption}
                  </span>
                  <ChevronRight
                    className={`h-4 w-4 transition-transform ${
                      isSelected ? 'rotate-90 text-[#2563eb]' : 'text-[#71717a]'
                    }`}
                    aria-hidden="true"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Capability Detail Pane */}
      <div className="border border-[#e4e4e7] bg-[#ffffff] p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#e4e4e7] pb-5">
          <div>
            <div className="mono text-[#2563eb] mb-1">
              — Evaluation Criteria & Benchmarks
            </div>
            <h3 className="font-serif text-2xl font-semibold text-[#1a1a1a]">
              {activeFeature.heading}
            </h3>
          </div>

          <button
            type="button"
            onClick={() => {
              if (activeFeature.targetId === 'scam-detector' && onPrimaryAction) {
                onPrimaryAction();
              } else if (activeFeature.targetId === 'transaction-security' && onSecondaryAction) {
                onSecondaryAction();
              } else if (onSelectFeature) {
                onSelectFeature(activeFeature.targetId);
              }
            }}
            className="btn btn-primary self-start sm:self-center"
          >
            <span>{activeFeature.actionText}</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {activeFeature.details.map((detail, index) => (
            <div
              key={index}
              className="flex items-start gap-3 border border-[#e4e4e7] bg-[#fdfdfc] p-4"
            >
              <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center bg-[#1a1a1a] text-white">
                <Check className="h-2.5 w-2.5" aria-hidden="true" />
              </div>
              <p className="text-xs text-[#1a1a1a]/85 leading-relaxed">{detail}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Technical Principles & Governance */}
      <div className="border-t border-[#e4e4e7] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#71717a]">
        <div className="flex items-center gap-2">
          <span className="indicator" />
          <span className="mono text-[#1a1a1a]">Surveillance System Active</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 mono text-[0.6rem]">
          <span>Pre-execution risk evaluation</span>
          <span aria-hidden="true">·</span>
          <span>Zero-retention local analysis</span>
          <span aria-hidden="true">·</span>
          <span>Non-custodial advisory format</span>
        </div>
      </div>
    </div>
  );
};
