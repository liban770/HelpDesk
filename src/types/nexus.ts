export type TicketPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type TicketStatus = 'in_progress' | 'open' | 'pending' | 'resolved' | 'snoozed';
export type TicketChannel = 'slack' | 'email' | 'chat' | 'api';
export type Sentiment = 'positive' | 'neutral' | 'negative' | 'frustrated';

export interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  arr: string;
  healthScore: number;
  avatar?: string;
  isVip: boolean;
}

export interface Assignee {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

export interface Ticket {
  id: string;
  ticketNumber: string; // e.g., 'NEX-8492'
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  priorityLabel: string;
  channel: TicketChannel;
  channelDetails: string;
  customer: Customer;
  assignee: Assignee;
  createdAt: string;
  timeAgo: string;
  slaMinutesRemaining: number;
  slaCountdownFormatted: string;
  tags: string[];
  sentiment: Sentiment;
  sentimentLabel: string;
  aiMatchScore: number;
  aiSummary: {
    title: string;
    description: string;
    affectedUsers: number;
    suggestedMacro: string;
    relatedIncidentId?: string;
    confidence: number;
  };
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorType: 'customer' | 'staff_reply' | 'internal_note' | 'system_ai';
  authorName: string;
  authorRole: string;
  authorAvatar?: string;
  timestamp: string;
  timeAgo: string;
  content: string;
  codeSnippet?: {
    header: string;
    code: string;
  };
  channelBadge?: string;
  isStaffRestricted?: boolean;
}

export interface WorkflowNode {
  id: string;
  type: 'trigger' | 'inference' | 'condition' | 'action' | 'parallel';
  title: string;
  category: string;
  color: string;
  x: number;
  y: number;
  config: Record<string, any>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string;
  gradient: string;
}

export interface Workflow {
  id: string;
  title: string;
  version: string;
  status: 'active' | 'draft' | 'paused';
  lastRun: string;
  executionsToday: number;
  successRate: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

export interface KnowledgeArticleItem {
  id: string;
  title: string;
  readTime: string;
}

export interface KnowledgeDomain {
  id: string;
  title: string;
  description: string;
  articlesCount: number;
  icon: string;
  colorClass: string;
  featuredArticles: KnowledgeArticleItem[];
  footerLink: string;
}
