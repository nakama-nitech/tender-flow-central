
export type TenderCategory = 'construction' | 'services' | 'goods' | 'consulting' | 'other';
export type TenderStatus = 'draft' | 'published' | 'under_evaluation' | 'awarded' | 'closed';

// Add additional types for documents and questions
export interface TenderDocument {
  id: string;
  name: string;
  size: string;
}

export interface TenderQuestion {
  id: string;
  question: string;
  answer: string;
  date: string;
}

// Add evaluation criteria type
export interface EvaluationCriteria {
  id: string;
  name: string;
  weight: number;
  description: string;
}

// Extend the Tender interface with optional documents and questions
export interface Tender {
  id: string;
  title: string;
  description: string;
  category: TenderCategory;
  budget: number;
  deadline: string;
  status: TenderStatus;
  createdAt: string;
  documents?: TenderDocument[];
  questions?: TenderQuestion[];
}

// Add bid-related types with extended status options
export interface Bid {
  id: string;
  tenderId: string;
  vendorName: string;
  vendorEmail?: string; // Added vendorEmail as optional
  amount: number;
  proposal?: string;
  submittedAt?: string;
  submittedDate: string;
  status: 'pending' | 'qualified' | 'disqualified' | 'shortlisted' | 'reviewed' | 'rejected' | 'awarded';
  score?: number;
  documents?: TenderDocument[];
  notes?: string;
}

export interface TenderStatistics {
  totalTenders: number;
  activeTenders: number;
  completedTenders: number;
  totalBids: number;
  averageBidsPerTender: number;
}
