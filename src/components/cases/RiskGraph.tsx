import React, { useState } from 'react';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  User,
  Share2,
  FileText,
  Globe,
  Phone,
  CreditCard,
  Smartphone,
  Store,
  AlertTriangle,
  Flame,
  CheckCircle2,
  Info,
  X,
  ExternalLink,
} from 'lucide-react';

export interface GraphNode {
  id: string;
  label: string;
  type:
    | 'Investor'
    | 'Social Post'
    | 'Promoter'
    | 'Claim'
    | 'Website'
    | 'Contact'
    | 'Payment Destination'
    | 'Transaction'
    | 'Device'
    | 'Merchant';
  x: number;
  y: number;
  risk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  details: {
    title: string;
    identifier: string;
    description: string;
    evidenceId?: string;
    riskScore: number;
    verificationStatus: string;
    flags: string[];
  };
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  relationship:
    | 'posted by'
    | 'mentions'
    | 'claims'
    | 'contacted through'
    | 'paid to'
    | 'associated with'
    | 'deviates from';
}

const DEFAULT_NODES: GraphNode[] = [
  {
    id: 'node-investor',
    label: 'Retail Investor (Account #9204)',
    type: 'Investor',
    x: 100,
    y: 220,
    risk: 'MEDIUM',
    details: {
      title: 'Target Retail Investor Account',
      identifier: 'ACC-IN-2024-9204',
      description: 'Individual retail trading account holder receiving unsolicited solicitation.',
      riskScore: 45,
      verificationStatus: 'KYC Verified Customer',
      flags: ['First-time offshore/unlisted query', 'Active trading account 2.4 years'],
    },
  },
  {
    id: 'node-social-post',
    label: 'Telegram Post #4029',
    type: 'Social Post',
    x: 280,
    y: 110,
    risk: 'HIGH',
    details: {
      title: 'Solictation Message Broadcast',
      identifier: 't.me/vip_wealth_returns/4029',
      description: 'Promotional post alleging exclusive pre-IPO allocation and guaranteed 45% return in 15 days.',
      evidenceId: 'ev-1',
      riskScore: 88,
      verificationStatus: 'Unverified Channel',
      flags: ['Guaranteed return phrase detected', 'Urgency countdown tactic'],
    },
  },
  {
    id: 'node-promoter',
    label: 'Dr. Sharma VIP Desk',
    type: 'Promoter',
    x: 280,
    y: 230,
    risk: 'CRITICAL',
    details: {
      title: 'Alleged Wealth Advisory Promoter',
      identifier: '@DrSharma_WealthGuru',
      description: 'Unregistered promoter claiming affiliation with licensed institutional asset desks.',
      evidenceId: 'ev-2',
      riskScore: 94,
      verificationStatus: 'Unregistered (Zero SEBI License)',
      flags: ['Negative match on SEBI SCORES directory', 'Associated with 3 consumer complaints'],
    },
  },
  {
    id: 'node-claim',
    label: '45% Return in 15 Days',
    type: 'Claim',
    x: 480,
    y: 90,
    risk: 'CRITICAL',
    details: {
      title: 'Extracted Return Guarantee Claim',
      identifier: 'CLAIM-45PCT-15D',
      description: 'Explicit guarantee of 45% capital appreciation in 15 business days without downside risk disclosure.',
      evidenceId: 'ev-3',
      riskScore: 96,
      verificationStatus: 'Statutory Violation',
      flags: ['SEBI IA Regulations violation (guaranteed returns)', 'Omission of statutory market risk warning'],
    },
  },
  {
    id: 'node-website',
    label: 'unlistedretail-allot.com',
    type: 'Website',
    x: 480,
    y: 180,
    risk: 'HIGH',
    details: {
      title: 'Phishing Allotment Portal',
      identifier: 'https://unlistedretail-allot.com',
      description: 'Domain registered 9 days prior. Emulates official National Stock Exchange allotment portal.',
      evidenceId: 'ev-screenshot-1',
      riskScore: 91,
      verificationStatus: 'Suspicious Domain (Age: 9 days)',
      flags: ['Newly registered domain (< 30 days)', 'Whois privacy proxy enabled', 'Direct wallet gateway embedded'],
    },
  },
  {
    id: 'node-contact',
    label: 'WhatsApp +91 98201 XXXXX',
    type: 'Contact',
    x: 380,
    y: 330,
    risk: 'HIGH',
    details: {
      title: 'Direct Telephony Channel',
      identifier: '+91 98201 44921 (WhatsApp Business API spoof)',
      description: 'Used for secondary payment pressure and direct account detail transmission.',
      riskScore: 82,
      verificationStatus: 'Prepaid SIM / Virtual VoIP',
      flags: ['VoIP provider routing', 'Pre-formatted payment link distribution'],
    },
  },
  {
    id: 'node-transaction',
    label: 'UPI Transfer ₹78,000',
    type: 'Transaction',
    x: 200,
    y: 390,
    risk: 'HIGH',
    details: {
      title: 'Attempted Outflow Transaction',
      identifier: 'TXN-UPI-20260924-8841',
      description: 'Real-time UPI transaction of ₹78,000 initiated at 03:12 AM outside customer typical active hours.',
      evidenceId: 'ev-4',
      riskScore: 84,
      verificationStatus: 'Suspicious Outflow',
      flags: ['24.3x baseline average deviation', 'Nocturnal execution (03:12 AM)', 'New device ID'],
    },
  },
  {
    id: 'node-device',
    label: 'iPhone 15 Pro (New Device)',
    type: 'Device',
    x: 100,
    y: 490,
    risk: 'MEDIUM',
    details: {
      title: 'Hardware Fingerprint',
      identifier: 'DEV-FP-A16-88091',
      description: 'First transaction initiated from this hardware identifier without prior login history.',
      riskScore: 68,
      verificationStatus: 'Unrecognized Device',
      flags: ['Zero historical authorization', 'IP subnet variation from home broadband'],
    },
  },
  {
    id: 'node-payment-dest',
    label: 'vipcalls98@oksbi (VPA)',
    type: 'Payment Destination',
    x: 480,
    y: 390,
    risk: 'CRITICAL',
    details: {
      title: 'Destination Virtual Payment Address',
      identifier: 'vipcalls98@oksbi',
      description: 'Personal peer-to-peer VPA masquerading as an official wealth management escrow account.',
      evidenceId: 'ev-5',
      riskScore: 95,
      verificationStatus: 'Unverified Peer Account',
      flags: ['Individual peer account (not merchant escrow)', 'Zero clearing corporation registration'],
    },
  },
  {
    id: 'node-merchant',
    label: 'M/s Quantum Yields (Unreg)',
    type: 'Merchant',
    x: 650,
    y: 280,
    risk: 'HIGH',
    details: {
      title: 'Alleged Clearing Entity',
      identifier: 'M/S QUANTUM YIELDS TECH',
      description: 'Fictitious firm name provided on telegram receipt. No Ministry of Corporate Affairs (MCA) CIN record.',
      riskScore: 89,
      verificationStatus: 'Unincorporated Entity',
      flags: ['No MCA registration', 'Non-existent GSTIN on invoice'],
    },
  },
];

const DEFAULT_EDGES: GraphEdge[] = [
  { id: 'e1', source: 'node-investor', target: 'node-social-post', relationship: 'mentions' },
  { id: 'e2', source: 'node-social-post', target: 'node-promoter', relationship: 'posted by' },
  { id: 'e3', source: 'node-social-post', target: 'node-claim', relationship: 'claims' },
  { id: 'e4', source: 'node-social-post', target: 'node-website', relationship: 'mentions' },
  { id: 'e5', source: 'node-promoter', target: 'node-contact', relationship: 'contacted through' },
  { id: 'e6', source: 'node-investor', target: 'node-transaction', relationship: 'deviates from' },
  { id: 'e7', source: 'node-transaction', target: 'node-device', relationship: 'associated with' },
  { id: 'e8', source: 'node-transaction', target: 'node-payment-dest', relationship: 'paid to' },
  { id: 'e9', source: 'node-contact', target: 'node-payment-dest', relationship: 'mentions' },
  { id: 'e10', source: 'node-payment-dest', target: 'node-merchant', relationship: 'associated with' },
];

export const RiskGraph: React.FC = () => {
  const [nodes] = useState<GraphNode[]>(DEFAULT_NODES);
  const [edges] = useState<GraphEdge[]>(DEFAULT_EDGES);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(nodes[1]); // Default to Social Post
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [filterType, setFilterType] = useState<string>('ALL');

  const getNodeIcon = (type: GraphNode['type']) => {
    switch (type) {
      case 'Investor':
        return <User className="h-4 w-4" />;
      case 'Social Post':
        return <Share2 className="h-4 w-4" />;
      case 'Promoter':
        return <User className="h-4 w-4" />;
      case 'Claim':
        return <FileText className="h-4 w-4" />;
      case 'Website':
        return <Globe className="h-4 w-4" />;
      case 'Contact':
        return <Phone className="h-4 w-4" />;
      case 'Payment Destination':
        return <CreditCard className="h-4 w-4" />;
      case 'Transaction':
        return <CreditCard className="h-4 w-4" />;
      case 'Device':
        return <Smartphone className="h-4 w-4" />;
      case 'Merchant':
        return <Store className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getRiskColors = (risk: GraphNode['risk']) => {
    switch (risk) {
      case 'CRITICAL':
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-400',
          text: 'text-rose-700',
          stroke: '#e11d48',
          badge: 'bg-rose-100 text-rose-800',
        };
      case 'HIGH':
        return {
          bg: 'bg-orange-50',
          border: 'border-orange-400',
          text: 'text-orange-700',
          stroke: '#ea580c',
          badge: 'bg-orange-100 text-orange-800',
        };
      case 'MEDIUM':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-400',
          text: 'text-amber-800',
          stroke: '#d97706',
          badge: 'bg-amber-100 text-amber-800',
        };
      case 'LOW':
      default:
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-400',
          text: 'text-emerald-800',
          stroke: '#059669',
          badge: 'bg-emerald-100 text-emerald-800',
        };
    }
  };

  const handleZoomIn = () => setZoomLevel((z) => Math.min(z + 0.15, 1.8));
  const handleZoomOut = () => setZoomLevel((z) => Math.max(z - 0.15, 0.6));
  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const filteredNodes = nodes.filter((n) => {
    if (filterType === 'ALL') return true;
    if (filterType === 'CONTENT') return ['Social Post', 'Claim', 'Website'].includes(n.type);
    if (filterType === 'TRANSACTION') return ['Transaction', 'Payment Destination', 'Device', 'Merchant'].includes(n.type);
    if (filterType === 'ACTORS') return ['Investor', 'Promoter', 'Contact'].includes(n.type);
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Graph Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Risk Graph
            </h3>
            <span className="rounded bg-indigo-50 px-2 py-0.5 font-mono text-[10px] font-bold text-indigo-700 border border-indigo-200">
              Correlated Multi-Entity Topology
            </span>
          </div>
          <p className="mt-0.5 text-xs text-slate-500">
            Interactive relational map connecting investors, social posts, claims, transactions, devices, and payment destinations.
          </p>
        </div>

        {/* Controls & Filter */}
        <div className="flex items-center gap-2">
          {/* Node Category Filter */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 p-0.5 text-xs">
            {(['ALL', 'CONTENT', 'TRANSACTION', 'ACTORS'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setFilterType(cat)}
                className={`rounded px-2.5 py-1 text-[11px] font-semibold transition-colors ${
                  filterType === cat
                    ? 'bg-white text-indigo-700 shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="flex items-center rounded-lg border border-slate-200 bg-white p-0.5 shadow-2xs">
            <button
              onClick={handleZoomIn}
              aria-label="Zoom In"
              className="flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
            >
              <ZoomIn className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              aria-label="Zoom Out"
              className="flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
            >
              <ZoomOut className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              aria-label="Reset View"
              className="flex h-7 w-7 items-center justify-center rounded text-slate-600 hover:bg-slate-100"
              title="Reset Zoom"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Graph Viewport + Details Inspector */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* SVG Interactive Canvas (8 cols) */}
        <div className="relative h-[480px] w-full overflow-hidden rounded-xl border border-slate-200 bg-slate-50/70 lg:col-span-8 shadow-inner">
          {/* Subtle Grid Background Pattern */}
          <svg className="absolute inset-0 h-full w-full pointer-events-none opacity-40">
            <defs>
              <pattern id="graph-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1" fill="#cbd5e1" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#graph-grid)" />
          </svg>

          {/* Graph Interactive Surface */}
          <svg
            className="h-full w-full cursor-grab active:cursor-grabbing"
            viewBox="0 0 760 560"
            style={{
              transform: `scale(${zoomLevel}) translate(${panOffset.x}px, ${panOffset.y}px)`,
              transformOrigin: 'center center',
              transition: 'transform 0.15s ease-out',
            }}
          >
            {/* Markers for Directed Edges */}
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="6"
                refX="20"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#94a3b8" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="6"
                refX="20"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 8 3, 0 6" fill="#4f46e5" />
              </marker>
            </defs>

            {/* Render Edges */}
            <g className="edges">
              {edges.map((edge) => {
                const sourceNode = nodes.find((n) => n.id === edge.source);
                const targetNode = nodes.find((n) => n.id === edge.target);
                if (!sourceNode || !targetNode) return null;

                const isConnectedToSelected =
                  selectedNode &&
                  (selectedNode.id === edge.source || selectedNode.id === edge.target);

                const midX = (sourceNode.x + targetNode.x) / 2;
                const midY = (sourceNode.y + targetNode.y) / 2;

                return (
                  <g key={edge.id}>
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isConnectedToSelected ? '#4f46e5' : '#cbd5e1'}
                      strokeWidth={isConnectedToSelected ? 2 : 1.25}
                      strokeDasharray={edge.relationship === 'deviates from' ? '4 3' : undefined}
                      markerEnd={isConnectedToSelected ? 'url(#arrowhead-active)' : 'url(#arrowhead)'}
                    />
                    {/* Relationship Pill Label */}
                    <rect
                      x={midX - 35}
                      y={midY - 8}
                      width={70}
                      height={16}
                      rx={4}
                      fill="#ffffff"
                      stroke={isConnectedToSelected ? '#c7d2fe' : '#e2e8f0'}
                      strokeWidth={0.8}
                    />
                    <text
                      x={midX}
                      y={midY + 3.5}
                      textAnchor="middle"
                      fontSize="8.5"
                      fontFamily="monospace"
                      fontWeight="600"
                      fill={isConnectedToSelected ? '#4338ca' : '#64748b'}
                    >
                      {edge.relationship}
                    </text>
                  </g>
                );
              })}
            </g>

            {/* Render Nodes */}
            <g className="nodes">
              {filteredNodes.map((node) => {
                const isSelected = selectedNode?.id === node.id;
                const colors = getRiskColors(node.risk);

                return (
                  <g
                    key={node.id}
                    transform={`translate(${node.x}, ${node.y})`}
                    onClick={() => setSelectedNode(node)}
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    {/* Node Selection Glow / Ring */}
                    {isSelected && (
                      <circle
                        r="24"
                        fill="none"
                        stroke="#4f46e5"
                        strokeWidth="2.5"
                        strokeDasharray="3 2"
                        className="animate-spin-slow"
                      />
                    )}

                    {/* Outer Circle */}
                    <circle
                      r="18"
                      fill="#ffffff"
                      stroke={isSelected ? '#4f46e5' : colors.stroke}
                      strokeWidth={isSelected ? 2.5 : 1.5}
                      className="shadow-md"
                    />

                    {/* Inner Colored Core */}
                    <circle
                      r="13"
                      fill={isSelected ? '#e0e7ff' : '#f8fafc'}
                      stroke={colors.stroke}
                      strokeWidth={0.5}
                    />

                    {/* Center Dot Indicator */}
                    <circle r="4" fill={colors.stroke} />

                    {/* Label below node */}
                    <rect
                      x={-60}
                      y={22}
                      width={120}
                      height={16}
                      rx={3}
                      fill="#ffffff"
                      fillOpacity={0.92}
                      stroke={isSelected ? '#6366f1' : '#e2e8f0'}
                      strokeWidth={0.8}
                    />
                    <text
                      x={0}
                      y={33.5}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="700"
                      fill="#0f172a"
                      className="select-none"
                    >
                      {node.type}
                    </text>
                  </g>
                );
              })}
            </g>
          </svg>

          {/* Floating Instructions Helper */}
          <div className="absolute bottom-3 left-3 rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 backdrop-blur-xs text-[10px] text-slate-500 shadow-2xs">
            <span className="font-semibold text-slate-700">Click any node</span> to inspect risk evidence & relationships.
          </div>
        </div>

        {/* Selected Node Details Inspector (4 cols) */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs lg:col-span-4 flex flex-col justify-between space-y-4">
          {selectedNode ? (
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-100">
                    {getNodeIcon(selectedNode.type)}
                  </div>
                  <div>
                    <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      {selectedNode.type}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 leading-tight">
                      {selectedNode.details.title}
                    </h4>
                  </div>
                </div>

                <span
                  className={`rounded px-2 py-0.5 font-mono text-[10px] font-bold ${
                    getRiskColors(selectedNode.risk).badge
                  }`}
                >
                  {selectedNode.risk}
                </span>
              </div>

              {/* Identifier & Status */}
              <div className="space-y-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Identifier / Handle:
                  </span>
                  <p className="font-mono text-xs font-bold text-slate-800 break-all mt-0.5">
                    {selectedNode.details.identifier}
                  </p>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Verification Status:
                  </span>
                  <span className="font-semibold text-slate-800">
                    {selectedNode.details.verificationStatus}
                  </span>
                </div>

                <div className="flex items-center justify-between rounded-lg bg-slate-50 p-2.5 border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    Node Risk Index:
                  </span>
                  <span className="font-mono font-bold text-rose-700">
                    {selectedNode.details.riskScore} / 100
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Analyst Assessment
                </span>
                <p className="mt-1 text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                  {selectedNode.details.description}
                </p>
              </div>

              {/* Risk Flags */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Associated Risk Flags ({selectedNode.details.flags.length})
                </span>
                <div className="mt-1.5 space-y-1.5">
                  {selectedNode.details.flags.map((flag, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-1.5 text-xs text-rose-800 bg-rose-50/70 p-2 rounded-md border border-rose-200"
                    >
                      <AlertTriangle className="h-3 w-3 text-rose-600 mt-0.5 shrink-0" />
                      <span>{flag}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Connected Relationships list */}
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Graph Relationships
                </span>
                <div className="mt-1.5 space-y-1 text-xs">
                  {edges
                    .filter(
                      (e) => e.source === selectedNode.id || e.target === selectedNode.id
                    )
                    .map((e) => {
                      const otherId = e.source === selectedNode.id ? e.target : e.source;
                      const otherNode = nodes.find((n) => n.id === otherId);
                      const isSource = e.source === selectedNode.id;

                      return (
                        <div
                          key={e.id}
                          className="flex items-center justify-between rounded bg-slate-50 px-2 py-1 text-[11px] text-slate-600 border border-slate-100"
                        >
                          <span className="font-mono text-indigo-700 font-semibold">
                            {isSource ? `→ ${e.relationship}` : `← ${e.relationship}`}
                          </span>
                          <span className="font-semibold text-slate-800 truncate max-w-[140px]">
                            {otherNode?.label}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              Select a node in the graph to view properties and evidence associations.
            </div>
          )}

          <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-400 italic">
            Risk graph maps empirical relations without asserting criminal culpability.
          </div>
        </div>
      </div>
    </div>
  );
};
