
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
  createdAt?: string; // Making this optional 
  created_at?: string; // Support both formats
  documents?: TenderDocument[];
  questions?: TenderQuestion[];
  created_by?: string;
  updated_at?: string;
}

// Add bid-related types with extended status options
export interface Bid {
  id: string;
  tenderId?: string;
  tenderid?: string; // Support database field name 
  vendorName?: string;
  vendorname?: string; // Support database field name
  vendorEmail?: string; 
  vendoremail?: string; // Support database field name
  amount: number;
  proposal?: string;
  submittedAt?: string;
  submittedDate?: string;
  submitteddate?: string; // Support database field name
  status: 'pending' | 'qualified' | 'disqualified' | 'shortlisted' | 'reviewed' | 'rejected' | 'awarded';
  score?: number;
  documents?: TenderDocument[];
  notes?: string;
  vendor_id?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TenderStatistics {
  totalTenders: number;
  activeTenders: number;
  completedTenders: number;
  totalBids: number;
  averageBidsPerTender: number;
}
