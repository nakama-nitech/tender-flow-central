
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, DollarSign, FileText, Clock, CheckCircle2, XCircle, AlertCircle, MessageCircle, CalendarClock, User, Building } from 'lucide-react';
import { format } from 'date-fns';
import { Bid, TenderDocument } from '@/types/tender';

// Mock data for bid status
const mockBids: Record<string, Bid> = {
  '1': {
    id: '1',
    tenderId: '1',
    vendorName: 'ABC Construction Ltd',
    vendorEmail: 'contact@abcconstruction.com',
    amount: 725000,
    proposal: 'Our comprehensive approach to the office building renovation will ensure minimal disruption to ongoing business operations while delivering high-quality renovations within budget and timeline.',
    submittedAt: '2025-04-05T14:30:00Z',
    submittedDate: '2025-04-05',
    status: 'pending',
    documents: [
      { id: 'bd1', name: 'Technical Proposal.pdf', size: '3.2 MB' },
      { id: 'bd2', name: 'Financial Proposal.pdf', size: '1.8 MB' },
      { id: 'bd3', name: 'Company Profile.pdf', size: '4.5 MB' }
    ],
    notes: 'Additional certifications and project portfolio submitted.'
  },
  '2': {
    id: '2',
    tenderId: '2',
    vendorName: 'ABC Construction Ltd',
    vendorEmail: 'contact@abcconstruction.com',
    amount: 235000,
    proposal: 'Our team has extensive experience in IT infrastructure upgrades, having completed similar projects for multiple Fortune 500 companies. We guarantee minimal downtime during the transition.',
    submittedAt: '2025-03-28T11:15:00Z',
    submittedDate: '2025-03-28',
    status: 'shortlisted',
    score: 85,
    documents: [
      { id: 'bd4', name: 'Implementation Plan.pdf', size: '2.7 MB' },
      { id: 'bd5', name: 'Cost Breakdown.xlsx', size: '1.2 MB' }
    ],
    notes: 'Competitive pricing with excellent implementation strategy.'
  }
};

// Mock tender titles
const tenderTitles: Record<string, string> = {
  '1': 'Office Building Renovation',
  '2': 'IT Infrastructure Upgrade'
};

// Bid status badge helper function
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'pending':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">Under Review</Badge>;
    case 'qualified':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Qualified</Badge>;
    case 'disqualified':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Disqualified</Badge>;
    case 'shortlisted':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Shortlisted</Badge>;
    case 'reviewed':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Reviewed</Badge>;
    case 'rejected':
      return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Rejected</Badge>;
    case 'awarded':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Awarded</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};

// Bid status timeline helper component
const StatusTimeline: React.FC<{ status: string }> = ({ status }) => {
  const getStepStatus = (step: string) => {
    if (
      (step === 'submitted' && ['pending', 'qualified', 'disqualified', 'shortlisted', 'reviewed', 'rejected', 'awarded'].includes(status)) ||
      (step === 'reviewed' && ['qualified', 'disqualified', 'shortlisted', 'reviewed', 'rejected', 'awarded'].includes(status)) ||
      (step === 'shortlisted' && ['shortlisted', 'awarded'].includes(status)) ||
      (step === 'awarded' && status === 'awarded')
    ) {
      return 'completed';
    } else if (
      (step === 'reviewed' && status === 'pending') ||
      (step === 'shortlisted' && ['qualified', 'reviewed'].includes(status)) ||
      (step === 'awarded' && status === 'shortlisted')
    ) {
      return 'current';
    }
    return 'pending';
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute left-3 top-0 h-full w-px bg-muted"></div>
        
        <div className="relative flex gap-3 pb-6">
          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${getStepStatus('submitted') === 'completed' ? 'bg-primary border-primary text-primary-foreground' : 'border-muted bg-background'}`}>
            {getStepStatus('submitted') === 'completed' && <CheckCircle2 className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-sm font-medium">Bid Submitted</p>
            <p className="text-xs text-muted-foreground">Your bid has been successfully submitted</p>
          </div>
        </div>
        
        <div className="relative flex gap-3 pb-6">
          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
            getStepStatus('reviewed') === 'completed' 
              ? 'bg-primary border-primary text-primary-foreground' 
              : getStepStatus('reviewed') === 'current' 
                ? 'border-primary' 
                : 'border-muted bg-background'
          }`}>
            {getStepStatus('reviewed') === 'completed' && <CheckCircle2 className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-sm font-medium">Initial Review</p>
            <p className="text-xs text-muted-foreground">Technical and financial evaluation</p>
          </div>
        </div>
        
        <div className="relative flex gap-3 pb-6">
          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
            getStepStatus('shortlisted') === 'completed' 
              ? 'bg-primary border-primary text-primary-foreground' 
              : getStepStatus('shortlisted') === 'current' 
                ? 'border-primary' 
                : 'border-muted bg-background'
          }`}>
            {getStepStatus('shortlisted') === 'completed' && <CheckCircle2 className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-sm font-medium">Shortlisted</p>
            <p className="text-xs text-muted-foreground">Selected as a top candidate</p>
          </div>
        </div>
        
        <div className="relative flex gap-3">
          <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
            getStepStatus('awarded') === 'completed' 
              ? 'bg-primary border-primary text-primary-foreground' 
              : getStepStatus('awarded') === 'current' 
                ? 'border-primary' 
                : 'border-muted bg-background'
          }`}>
            {getStepStatus('awarded') === 'completed' && <CheckCircle2 className="h-4 w-4" />}
          </div>
          <div>
            <p className="text-sm font-medium">Contract Awarded</p>
            <p className="text-xs text-muted-foreground">Your bid has been selected</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const BidStatus: React.FC = () => {
  const { bidId } = useParams<{ bidId: string }>();
  
  if (!bidId || !mockBids[bidId]) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Bid Not Found</h2>
        <Link to="/supplier/my-bids">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to My Bids
          </Button>
        </Link>
      </div>
    );
  }
  
  const bid = mockBids[bidId];
  const tenderTitle = tenderTitles[bid.tenderId] || 'Unknown Tender';
  
  // Calculate evaluation progress based on status
  const getEvaluationProgress = () => {
    switch (bid.status) {
      case 'pending': return 25;
      case 'qualified':
      case 'disqualified': return 50;
      case 'reviewed': return 50;
      case 'shortlisted': return 75;
      case 'rejected': return 50;
      case 'awarded': return 100;
      default: return 0;
    }
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMMM d, yyyy');
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/supplier/my-bids">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Bid Status</h2>
          <p className="text-muted-foreground">{tenderTitle}</p>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Status</span>
                {getStatusBadge(bid.status)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Evaluation Progress</span>
                  <span className="text-sm font-medium">{getEvaluationProgress()}%</span>
                </div>
                <Progress value={getEvaluationProgress()} className="h-2" />
              </div>
              
              <StatusTimeline status={bid.status} />
              
              {bid.status === 'shortlisted' && (
                <div className="bg-muted p-4 rounded-md">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Your bid has been shortlisted!</p>
                      <p className="text-sm text-muted-foreground">
                        The final decision is expected within the next 10 business days.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {bid.status === 'awarded' && (
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-green-800">Congratulations! Your bid has been accepted.</p>
                      <p className="text-sm text-green-700">
                        A contract representative will contact you within 3 business days with next steps.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              {bid.status === 'rejected' && (
                <div className="bg-red-50 p-4 rounded-md border border-red-200">
                  <div className="flex items-start gap-2">
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-800">Your bid was not selected for this tender.</p>
                      <p className="text-sm text-red-700">
                        You can request feedback on your bid to improve future submissions.
                      </p>
                      <Button variant="outline" size="sm" className="mt-2">
                        <MessageCircle className="h-4 w-4 mr-2" />
                        Request Feedback
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Tabs defaultValue="details">
            <TabsList className="mb-4">
              <TabsTrigger value="details">Bid Details</TabsTrigger>
              <TabsTrigger value="documents">Submitted Documents</TabsTrigger>
              {bid.score !== undefined && <TabsTrigger value="evaluation">Evaluation</TabsTrigger>}
            </TabsList>
            
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Bid Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <Building className="h-4 w-4" />
                        <span>Company</span>
                      </div>
                      <p className="font-medium">{bid.vendorName}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <User className="h-4 w-4" />
                        <span>Contact</span>
                      </div>
                      <p className="font-medium">{bid.vendorEmail}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <DollarSign className="h-4 w-4" />
                        <span>Bid Amount</span>
                      </div>
                      <p className="font-medium">{formatCurrency(bid.amount)}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        <CalendarClock className="h-4 w-4" />
                        <span>Submitted Date</span>
                      </div>
                      <p className="font-medium">{formatDate(bid.submittedAt || '')}</p>
                    </div>
                  </div>
                  
                  <div className="pt-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                      <FileText className="h-4 w-4" />
                      <span>Proposal Summary</span>
                    </div>
                    <p className="text-sm">{bid.proposal}</p>
                  </div>
                  
                  {bid.notes && (
                    <div className="pt-2">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                        <MessageCircle className="h-4 w-4" />
                        <span>Additional Notes</span>
                      </div>
                      <p className="text-sm">{bid.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents">
              <Card>
                <CardHeader>
                  <CardTitle>Submitted Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {bid.documents && bid.documents.length > 0 ? (
                      bid.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-muted-foreground" />
                            <div>
                              <p className="text-sm font-medium">{doc.name}</p>
                              <p className="text-xs text-muted-foreground">{doc.size}</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <FileText className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No documents were submitted with this bid.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {bid.score !== undefined && (
              <TabsContent value="evaluation">
                <Card>
                  <CardHeader>
                    <CardTitle>Evaluation Results</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Overall Score</span>
                        <span className="text-sm font-medium">{bid.score}/100</span>
                      </div>
                      <Progress value={bid.score} className="h-2" />
                    </div>
                    
                    <div className="space-y-3 pt-2">
                      <h3 className="text-sm font-medium">Score Breakdown</h3>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Technical Solution</span>
                          <span className="text-sm">42/50</span>
                        </div>
                        <Progress value={84} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Experience & Qualifications</span>
                          <span className="text-sm">18/20</span>
                        </div>
                        <Progress value={90} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Financial Proposal</span>
                          <span className="text-sm">15/20</span>
                        </div>
                        <Progress value={75} className="h-1.5" />
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm text-muted-foreground">Implementation Plan</span>
                          <span className="text-sm">10/10</span>
                        </div>
                        <Progress value={100} className="h-1.5" />
                      </div>
                    </div>
                    
                    <div className="bg-muted p-3 rounded-md">
                      <h3 className="text-sm font-medium mb-1">Evaluator Comments</h3>
                      <p className="text-sm text-muted-foreground">
                        Strong technical proposal with excellent implementation strategy. Competitive pricing and proven experience in similar projects. Selected for the shortlist.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tender Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <h3 className="font-medium">{tenderTitle}</h3>
              
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <Link to={`/supplier/tender-details/${bid.tenderId}`} className="text-sm text-primary hover:underline">
                  View Tender Details
                </Link>
              </div>
              
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  Bid submitted {formatDate(bid.submittedAt || '')}
                </span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
              
              <Button variant="outline" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                Download Bid Summary
              </Button>
              
              {(bid.status === 'rejected' || bid.status === 'disqualified') && (
                <Button variant="outline" className="w-full justify-start">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Request Feedback
                </Button>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BidStatus;
