
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Filter, FileText, DollarSign, Clock, Calendar, CheckCircle2, XCircle, ClipboardList } from 'lucide-react';
import { format } from 'date-fns';
import { Bid } from '@/types/tender';

// Mock data for bids
const mockBids: Bid[] = [
  {
    id: '1',
    tenderId: '1',
    vendorName: 'ABC Construction Ltd',
    vendorEmail: 'contact@abcconstruction.com',
    amount: 725000,
    proposal: 'Comprehensive approach to office building renovation with minimal disruption to operations.',
    submittedDate: '2025-04-05',
    status: 'pending'
  },
  {
    id: '2',
    tenderId: '2',
    vendorName: 'ABC Construction Ltd',
    vendorEmail: 'contact@abcconstruction.com',
    amount: 235000,
    proposal: 'Complete IT infrastructure upgrade with minimal downtime during transition.',
    submittedDate: '2025-03-28',
    status: 'shortlisted',
    score: 85
  },
  {
    id: '3',
    tenderId: '3',
    vendorName: 'ABC Construction Ltd',
    vendorEmail: 'contact@abcconstruction.com',
    amount: 42000,
    proposal: 'Professional financial audit services with comprehensive compliance review.',
    submittedDate: '2025-03-30',
    status: 'rejected'
  },
  {
    id: '4',
    tenderId: '4',
    vendorName: 'ABC Construction Ltd',
    vendorEmail: 'contact@abcconstruction.com',
    amount: 75000,
    proposal: 'Strategic marketing consulting with digital enhancement services.',
    submittedDate: '2025-03-15',
    status: 'awarded',
    score: 92
  }
];

// Mock tender titles
const tenderTitles: Record<string, string> = {
  '1': 'Office Building Renovation',
  '2': 'IT Infrastructure Upgrade',
  '3': 'Annual Financial Audit',
  '4': 'Marketing Strategy Consulting'
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

const BidsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('active');
  
  // Filter bids based on search, status, and active/completed tabs
  const filteredBids = mockBids.filter((bid) => {
    const matchesSearch = 
      tenderTitles[bid.tenderId]?.toLowerCase().includes(searchTerm.toLowerCase()) || 
      bid.proposal.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || bid.status === statusFilter;
    
    const isActive = ['pending', 'qualified', 'shortlisted', 'reviewed'].includes(bid.status);
    const isCompleted = ['awarded', 'rejected', 'disqualified'].includes(bid.status);
    
    const matchesTab = 
      (activeTab === 'active' && isActive) || 
      (activeTab === 'completed' && isCompleted);
    
    return matchesSearch && matchesStatus && matchesTab;
  });
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };
  
  const formatDate = (dateString: string) => {
    return format(new Date(dateString), 'MMM d, yyyy');
  };
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'awarded':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'rejected':
      case 'disqualified':
        return <XCircle className="h-5 w-5 text-red-600" />;
      default:
        return <ClipboardList className="h-5 w-5 text-amber-600" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">My Bids</h2>
        <p className="text-muted-foreground">
          Track and manage your bid submissions
        </p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search bids..." 
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[160px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="pending">Under Review</SelectItem>
              <SelectItem value="shortlisted">Shortlisted</SelectItem>
              <SelectItem value="awarded">Awarded</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="active">Active Bids</TabsTrigger>
          <TabsTrigger value="completed">Completed Bids</TabsTrigger>
        </TabsList>
        
        <TabsContent value="active" className="space-y-4">
          {filteredBids.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredBids.map((bid) => (
                <Card key={bid.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{tenderTitles[bid.tenderId]}</CardTitle>
                      {getStatusBadge(bid.status)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {bid.proposal}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Bid Amount: {formatCurrency(bid.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Submitted: {formatDate(bid.submittedDate)}</span>
                      </div>
                      {bid.score !== undefined && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Evaluation Score: {bid.score}/100</span>
                        </div>
                      )}
                      
                      <div className="pt-2 flex justify-end">
                        <Link to={`/supplier/bid-status/${bid.id}`}>
                          <Button size="sm">
                            Track Status
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No active bids found</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any active bids that match your filters
              </p>
              <Link to="/supplier/tenders">
                <Button>
                  Browse Available Tenders
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-4">
          {filteredBids.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredBids.map((bid) => (
                <Card key={bid.id} className="hover:shadow-md transition-shadow">
                  <CardHeader className="pb-2 flex flex-row items-center gap-2">
                    <div className="mr-auto">
                      <CardTitle className="text-lg">{tenderTitles[bid.tenderId]}</CardTitle>
                    </div>
                    {getStatusIcon(bid.status)}
                    {getStatusBadge(bid.status)}
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                      {bid.proposal}
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Bid Amount: {formatCurrency(bid.amount)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Submitted: {formatDate(bid.submittedDate)}</span>
                      </div>
                      {bid.score !== undefined && (
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">Evaluation Score: {bid.score}/100</span>
                        </div>
                      )}
                      
                      <div className="pt-2 flex justify-end">
                        <Link to={`/supplier/bid-status/${bid.id}`}>
                          <Button variant="outline" size="sm">
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="border rounded-lg p-8 text-center">
              <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <ClipboardList className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">No completed bids found</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any completed bids that match your filters
              </p>
              <Link to="/supplier/tenders">
                <Button>
                  Browse Available Tenders
                </Button>
              </Link>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BidsList;
