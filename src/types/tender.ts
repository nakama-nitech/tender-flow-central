
export type TenderStatus = 'draft' | 'published' | 'under_evaluation' | 'awarded' | 'closed';

export type TenderCategory = 'construction' | 'services' | 'goods' | 'consulting' | 'other';

export interface Tender {
  id: string;
  title: string;
  description: string;
  category: TenderCategory;
  budget: number;
  deadline: string; // ISO date string
  status: TenderStatus;
  createdAt: string; // ISO date string
  documents?: string[];
}

export interface Bid {
  id: string;
  tenderId: string;
  vendorName: string;
  vendorEmail: string;
  amount: number;
  proposal: string;
  documents?: string[];
  submittedAt: string; // ISO date string
  status: 'pending' | 'reviewed' | 'shortlisted' | 'rejected' | 'awarded';
  score?: number;
}

export interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number; // 0-100 percentage
  description?: string;
}

export interface TenderStatistics {
  totalTenders: number;
  activeTenders: number;
  completedTenders: number;
  totalBids: number;
  averageBidsPerTender: number;
}
