
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft, 
  Search, 
  FileText, 
  DollarSign, 
  Calendar, 
  Clock, 
  ChevronDown, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Download,
  Eye 
} from 'lucide-react';
import { format } from 'date-fns';
import { Tender } from '@/types/tender';

// Mock data for bids
interface Bid {
  id: string;
  vendorName: string;
  amount: number;
  submittedDate: string;
  status: 'pending' | 'qualified' | 'disqualified';
  score?: number;
  documents: { id: string; name: string; size: string }[];
  notes?: string;
}

// Mock tender data
const mockTenders: Record<string, Tender & { bids: Bid[] }> = {
  '1': {
    id: '1',
    title: 'Office Building Renovation',
    description: 'Complete renovation of a 3-story office building including electrical, plumbing, and HVAC systems.',
    category: 'construction',
    budget: 750000,
    deadline: '2025-05-20T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-15T10:30:00Z',
    bids: [
      {
        id: 'b1',
        vendorName: 'Alpha Construction LLC',
        amount: 745000,
        submittedDate: '2025-03-25T14:30:00Z',
        status: 'qualified',
        score: 87,
        documents: [
          { id: 'bd1', name: 'Technical Proposal.pdf', size: '3.2 MB' },
          { id: 'bd2', name: 'Financial Proposal.pdf', size: '1.8 MB' },
          { id: 'bd3', name: 'Company Profile.pdf', size: '4.5 MB' }
        ],
        notes: 'Strong technical proposal with comprehensive timeline.'
      },
      {
        id: 'b2',
        vendorName: 'BuildWell Inc.',
        amount: 720000,
        submittedDate: '2025-03-27T09:15:00Z',
        status: 'qualified',
        score: 82,
        documents: [
          { id: 'bd4', name: 'Technical Proposal.pdf', size: '2.9 MB' },
          { id: 'bd5', name: 'Cost Breakdown.xlsx', size: '1.2 MB' }
        ],
        notes: 'Competitive pricing, but timeline seems optimistic.'
      },
      {
        id: 'b3',
        vendorName: 'Metro Builders',
        amount: 790000,
        submittedDate: '2025-03-28T16:45:00Z',
        status: 'pending',
        documents: [
          { id: 'bd6', name: 'Proposal Document.pdf', size: '5.1 MB' }
        ]
      },
      {
        id: 'b4',
        vendorName: 'Urban Development Co.',
        amount: 820000,
        submittedDate: '2025-03-20T11:30:00Z',
        status: 'disqualified',
        documents: [
          { id: 'bd7', name: 'Bid Document.pdf', size: '2.7 MB' }
        ],
        notes: 'Missing critical certifications required in RFP.'
      }
    ]
  },
  '2': {
    id: '2',
    title: 'IT Infrastructure Upgrade',
    description: 'Supply and installation of network equipment, servers, and workstations for headquarters.',
    category: 'goods',
    budget: 250000,
    deadline: '2025-04-28T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-18T14:15:00Z',
    bids: [
      {
        id: 'b5',
        vendorName: 'TechSolutions Inc.',
        amount: 245000,
        submittedDate: '2025-03-30T15:20:00Z',
        status: 'qualified',
        score: 91,
        documents: [
          { id: 'bd8', name: 'Technical Specifications.pdf', size: '2.3 MB' },
          { id: 'bd9', name: 'Price Quotation.pdf', size: '1.1 MB' }
        ],
        notes: 'Excellent technical specifications and competitive pricing.'
      },
      {
        id: 'b6',
        vendorName: 'NetworkPro Systems',
        amount: 255000,
        submittedDate: '2025-04-01T10:45:00Z',
        status: 'pending',
        documents: [
          { id: 'bd10', name: 'Proposal.pdf', size: '3.5 MB' }
        ]
      }
    ]
  }
};

interface BidManagementProps {
  tenderId: string;
  onBack: () => void;
}

const BidManagement: React.FC<BidManagementProps> = ({ tenderId, onBack }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBid, setSelectedBid] = useState<Bid | null>(null);
  
  const tenderWithBids = mockTenders[tenderId];
  
  if (!tenderWithBids) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Tender Not Found</h2>
        <Button onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tenders
        </Button>
      </div>
    );
  }
  
  const { title, bids } = tenderWithBids;
  
  const filteredBids = bids.filter(bid => 
    bid.vendorName.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'qualified':
        return <Badge className="bg-green-100 text-green-800">Qualified</Badge>;
      case 'disqualified':
        return <Badge className="bg-red-100 text-red-800">Disqualified</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'qualified':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'disqualified':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Bid Management</h2>
            <p className="text-muted-foreground">
              {title} ({bids.length} bids)
            </p>
          </div>
        </div>
        <Button>
          Export Results
        </Button>
      </div>
      
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Submitted Bids</CardTitle>
              <CardDescription>
                Review and evaluate submitted proposals
              </CardDescription>
            </div>
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search vendors..." 
                className="pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vendor</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Score</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredBids.length > 0 ? (
                filteredBids.map((bid) => (
                  <TableRow key={bid.id}>
                    <TableCell className="font-medium">{bid.vendorName}</TableCell>
                    <TableCell>{formatCurrency(bid.amount)}</TableCell>
                    <TableCell>{formatDate(bid.submittedDate)}</TableCell>
                    <TableCell>{getStatusBadge(bid.status)}</TableCell>
                    <TableCell>{bid.score || '-'}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => setSelectedBid(bid)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          <DialogHeader>
                            <DialogTitle className="text-xl">Bid Details</DialogTitle>
                          </DialogHeader>
                          
                          {selectedBid && (
                            <Tabs defaultValue="overview" className="mt-4">
                              <TabsList className="mb-4">
                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                <TabsTrigger value="documents">Documents</TabsTrigger>
                                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="overview" className="space-y-4">
                                <div className="space-y-4">
                                  <div className="flex justify-between items-start">
                                    <div>
                                      <h3 className="text-lg font-semibold">{selectedBid.vendorName}</h3>
                                      <div className="flex items-center gap-2 mt-1">
                                        {getStatusBadge(selectedBid.status)}
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-sm text-muted-foreground">Bid Amount</p>
                                      <p className="text-xl font-bold">{formatCurrency(selectedBid.amount)}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Submission Date</span>
                                      </div>
                                      <p className="text-sm pl-6">{formatDate(selectedBid.submittedDate)}</p>
                                    </div>
                                    
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm font-medium">Documents</span>
                                      </div>
                                      <p className="text-sm pl-6">{selectedBid.documents.length} attached</p>
                                    </div>
                                    
                                    {selectedBid.score && (
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
                                          <span className="text-sm font-medium">Evaluation Score</span>
                                        </div>
                                        <p className="text-sm pl-6">{selectedBid.score}/100</p>
                                      </div>
                                    )}
                                  </div>
                                  
                                  {selectedBid.notes && (
                                    <div className="mt-4">
                                      <h4 className="text-sm font-medium mb-2">Notes</h4>
                                      <p className="text-sm p-3 bg-muted rounded-md">{selectedBid.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="documents" className="space-y-4">
                                <div className="space-y-4">
                                  {selectedBid.documents.map((doc) => (
                                    <div key={doc.id} className="flex items-center justify-between p-3 border rounded-md">
                                      <div className="flex items-center gap-3">
                                        <FileText className="h-5 w-5 text-muted-foreground" />
                                        <div>
                                          <p className="text-sm font-medium">{doc.name}</p>
                                          <p className="text-xs text-muted-foreground">{doc.size}</p>
                                        </div>
                                      </div>
                                      <Button variant="ghost" size="sm">
                                        <Download className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              </TabsContent>
                              
                              <TabsContent value="evaluation" className="space-y-4">
                                {selectedBid.status === 'pending' ? (
                                  <div className="text-center p-6 space-y-4">
                                    <AlertCircle className="mx-auto h-12 w-12 text-yellow-500" />
                                    <h3 className="text-lg font-medium">Evaluation Pending</h3>
                                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                      This bid has not been evaluated yet. Evaluate it to assign a status and score.
                                    </p>
                                    <div className="flex gap-4 justify-center mt-4">
                                      <Button variant="outline">
                                        <XCircle className="mr-2 h-4 w-4" />
                                        Disqualify
                                      </Button>
                                      <Button>
                                        <CheckCircle2 className="mr-2 h-4 w-4" />
                                        Qualify & Evaluate
                                      </Button>
                                    </div>
                                  </div>
                                ) : selectedBid.status === 'disqualified' ? (
                                  <div className="text-center p-6 space-y-4">
                                    <XCircle className="mx-auto h-12 w-12 text-red-500" />
                                    <h3 className="text-lg font-medium">Bid Disqualified</h3>
                                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                                      This bid has been disqualified from the evaluation process.
                                    </p>
                                    {selectedBid.notes && (
                                      <div className="mt-4 text-left">
                                        <h4 className="text-sm font-medium mb-2">Disqualification Reason</h4>
                                        <p className="text-sm p-3 bg-muted rounded-md">{selectedBid.notes}</p>
                                      </div>
                                    )}
                                    <Button variant="outline" className="mt-4">
                                      Revise Decision
                                    </Button>
                                  </div>
                                ) : (
                                  <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                      <h3 className="text-lg font-medium">Evaluation Results</h3>
                                      <div className="text-right">
                                        <span className="text-sm text-muted-foreground">Overall Score</span>
                                        <p className="text-xl font-bold">{selectedBid.score}/100</p>
                                      </div>
                                    </div>
                                    
                                    <div className="space-y-4">
                                      <div className="p-3 border rounded-md">
                                        <div className="flex justify-between mb-2">
                                          <span className="text-sm font-medium">Technical Compliance</span>
                                          <span className="text-sm font-medium">28/30</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                          <div className="h-full bg-primary" style={{ width: '93%' }}></div>
                                        </div>
                                      </div>
                                      
                                      <div className="p-3 border rounded-md">
                                        <div className="flex justify-between mb-2">
                                          <span className="text-sm font-medium">Financial Proposal</span>
                                          <span className="text-sm font-medium">25/30</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                          <div className="h-full bg-primary" style={{ width: '83%' }}></div>
                                        </div>
                                      </div>
                                      
                                      <div className="p-3 border rounded-md">
                                        <div className="flex justify-between mb-2">
                                          <span className="text-sm font-medium">Experience & References</span>
                                          <span className="text-sm font-medium">18/20</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                          <div className="h-full bg-primary" style={{ width: '90%' }}></div>
                                        </div>
                                      </div>
                                      
                                      <div className="p-3 border rounded-md">
                                        <div className="flex justify-between mb-2">
                                          <span className="text-sm font-medium">Project Timeline</span>
                                          <span className="text-sm font-medium">16/20</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                          <div className="h-full bg-primary" style={{ width: '80%' }}></div>
                                        </div>
                                      </div>
                                    </div>
                                    
                                    <Button className="w-full">
                                      Edit Evaluation
                                    </Button>
                                  </div>
                                )}
                              </TabsContent>
                            </Tabs>
                          )}
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-6">
                    <p className="text-muted-foreground">No bids found matching your search.</p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Bid Comparison</CardTitle>
          <CardDescription>Compare qualified bids side by side</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredBids.filter(bid => bid.status === 'qualified').length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Criteria</TableHead>
                    {filteredBids
                      .filter(bid => bid.status === 'qualified')
                      .map(bid => (
                        <TableHead key={bid.id}>{bid.vendorName}</TableHead>
                      ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Bid Amount</TableCell>
                    {filteredBids
                      .filter(bid => bid.status === 'qualified')
                      .map(bid => (
                        <TableCell key={bid.id}>{formatCurrency(bid.amount)}</TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Overall Score</TableCell>
                    {filteredBids
                      .filter(bid => bid.status === 'qualified')
                      .map(bid => (
                        <TableCell key={bid.id}>{bid.score || '-'}/100</TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Submission Date</TableCell>
                    {filteredBids
                      .filter(bid => bid.status === 'qualified')
                      .map(bid => (
                        <TableCell key={bid.id}>{formatDate(bid.submittedDate)}</TableCell>
                      ))}
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Documents</TableCell>
                    {filteredBids
                      .filter(bid => bid.status === 'qualified')
                      .map(bid => (
                        <TableCell key={bid.id}>{bid.documents.length}</TableCell>
                      ))}
                  </TableRow>
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No qualified bids available for comparison.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BidManagement;
