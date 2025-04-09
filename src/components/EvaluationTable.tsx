
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';
import { 
  Award, 
  Check, 
  ChevronDown, 
  FileText, 
  MoreHorizontal, 
  Pencil, 
  Star, 
  X 
} from 'lucide-react';
import { Bid, EvaluationCriteria, Tender } from '@/types/tender';
import { format } from 'date-fns';

// Mock data
const mockTender: Tender = {
  id: '1',
  title: 'Office Building Renovation',
  description: 'Complete renovation of a 3-story office building including electrical, plumbing, and HVAC systems.',
  category: 'construction',
  budget: 750000,
  deadline: '2025-05-20T23:59:59Z',
  status: 'under_evaluation',
  createdAt: '2025-03-15T10:30:00Z'
};

const mockBids: Bid[] = [
  {
    id: '1',
    tenderId: '1',
    vendorName: 'BuildRight Construction',
    vendorEmail: 'proposals@buildright.com',
    amount: 725000,
    proposal: 'Comprehensive renovation plan with eco-friendly materials and energy-efficient solutions.',
    submittedDate: '2025-04-02T11:30:00Z',
    submittedAt: '2025-04-02T11:30:00Z',
    status: 'shortlisted',
    score: 87
  },
  {
    id: '2',
    tenderId: '1',
    vendorName: 'Premium Builders Inc.',
    vendorEmail: 'bids@premium-builders.com',
    amount: 695000,
    proposal: 'Full renovation service with 2-year warranty on all work performed.',
    submittedDate: '2025-04-05T14:45:00Z',
    submittedAt: '2025-04-05T14:45:00Z',
    status: 'shortlisted',
    score: 82
  },
  {
    id: '3',
    tenderId: '1',
    vendorName: 'Urban Development Group',
    vendorEmail: 'contracts@urbandg.com',
    amount: 780000,
    proposal: 'Premium quality materials with extended warranties and post-completion support.',
    submittedDate: '2025-04-08T09:20:00Z',
    submittedAt: '2025-04-08T09:20:00Z',
    status: 'reviewed',
    score: 76
  },
  {
    id: '4',
    tenderId: '1',
    vendorName: 'EcoConstruct Solutions',
    vendorEmail: 'bids@ecoconstruct.com',
    amount: 749000,
    proposal: 'Sustainable renovation with minimal environmental impact and LEED certification assistance.',
    submittedDate: '2025-04-10T16:35:00Z',
    submittedAt: '2025-04-10T16:35:00Z',
    status: 'pending',
    score: undefined
  },
  {
    id: '5',
    tenderId: '1',
    vendorName: 'FastTrack Renovations',
    vendorEmail: 'proposals@fasttrack.com',
    amount: 675000,
    proposal: 'Expedited timeline with experienced crew and project management.',
    submittedDate: '2025-04-12T10:15:00Z',
    submittedAt: '2025-04-12T10:15:00Z',
    status: 'rejected',
    score: 65
  }
];

const evaluationCriteria: EvaluationCriteria[] = [
  { id: '1', name: 'Price', weight: 30, description: 'Competitiveness of the bid amount' },
  { id: '2', name: 'Technical Merit', weight: 25, description: 'Quality and suitability of proposed solution' },
  { id: '3', name: 'Experience', weight: 20, description: 'Track record and relevant experience' },
  { id: '4', name: 'Sustainability', weight: 15, description: 'Environmental and social considerations' },
  { id: '5', name: 'Timeline', weight: 10, description: 'Proposed execution schedule' }
];

// Helper function to get status badge
const getBidStatusBadge = (status: Bid['status']) => {
  switch (status) {
    case 'pending':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Pending</Badge>;
    case 'reviewed':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Reviewed</Badge>;
    case 'shortlisted':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Shortlisted</Badge>;
    case 'rejected':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Rejected</Badge>;
    case 'awarded':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Awarded</Badge>;
    case 'qualified':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Qualified</Badge>;
    case 'disqualified':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Disqualified</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

const EvaluationTable: React.FC = () => {
  const { toast } = useToast();
  const [selectedTender, setSelectedTender] = useState<string>(mockTender.id);
  const [bids, setBids] = useState<Bid[]>(mockBids);
  const [isEditingScore, setIsEditingScore] = useState<string | null>(null);
  const [scoreValue, setScoreValue] = useState<number>(0);

  const handleScoreChange = (bidId: string) => {
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === bidId 
          ? { ...bid, score: scoreValue, status: 'reviewed' as Bid['status'] } 
          : bid
      )
    );
    setIsEditingScore(null);
    
    toast({
      title: "Score updated",
      description: `The evaluation score has been updated.`,
    });
  };

  const handleStatusChange = (bidId: string, status: Bid['status']) => {
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === bidId 
          ? { ...bid, status } 
          : bid
      )
    );
    
    toast({
      title: "Status updated",
      description: `Bid status has been changed to ${status}.`,
    });
  };

  const handleAwardBid = (bidId: string) => {
    // Update the awarded bid
    setBids(prevBids => 
      prevBids.map(bid => 
        bid.id === bidId 
          ? { ...bid, status: 'awarded' as Bid['status'] } 
          : { ...bid, status: bid.status === 'awarded' ? 'shortlisted' as Bid['status'] : bid.status }
      )
    );
    
    toast({
      title: "Bid awarded",
      description: "The selected bid has been awarded the tender.",
      variant: "default",
    });
  };

  const startEditScore = (bid: Bid) => {
    setIsEditingScore(bid.id);
    setScoreValue(bid.score || 0);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Bid Evaluation</h2>
        <p className="text-muted-foreground">
          Evaluate and compare submitted bids
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="tender-select">Select Tender</Label>
          <Select value={selectedTender} onValueChange={setSelectedTender}>
            <SelectTrigger id="tender-select">
              <SelectValue placeholder="Select a tender to evaluate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={mockTender.id}>{mockTender.title}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-end space-x-2">
          <Button className="flex-1">View Tender Details</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Submitted Bids</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Score</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {bids.map(bid => (
                  <TableRow key={bid.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{bid.vendorName}</p>
                        <p className="text-sm text-muted-foreground">{bid.vendorEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      ${bid.amount.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {getBidStatusBadge(bid.status)}
                    </TableCell>
                    <TableCell className="text-center">
                      {isEditingScore === bid.id ? (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="number"
                            min="0"
                            max="100"
                            value={scoreValue}
                            onChange={(e) => setScoreValue(parseInt(e.target.value) || 0)}
                            className="w-16 text-center"
                          />
                          <div className="flex space-x-1">
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8" 
                              onClick={() => handleScoreChange(bid.id)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              size="icon" 
                              variant="ghost" 
                              className="h-8 w-8" 
                              onClick={() => setIsEditingScore(null)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div 
                          onClick={() => startEditScore(bid)}
                          className="cursor-pointer hover:bg-muted rounded p-1 inline-block min-w-[40px]"
                        >
                          {bid.score ?? '-'}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => window.alert('View bid details')}>
                            <FileText className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => startEditScore(bid)}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit Score
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(bid.id, 'shortlisted')}
                            disabled={bid.status === 'shortlisted'}
                          >
                            <Star className="mr-2 h-4 w-4" />
                            Shortlist
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => handleStatusChange(bid.id, 'rejected')}
                            disabled={bid.status === 'rejected'}
                          >
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem 
                                onSelect={(e) => e.preventDefault()}
                                disabled={bid.status === 'awarded'}
                              >
                                <Award className="mr-2 h-4 w-4" />
                                Award Contract
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Award Contract</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to award the contract to {bid.vendorName}? 
                                  This action will mark the tender as awarded and notify the vendor.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleAwardBid(bid.id)}>
                                  Continue
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evaluation Criteria</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {evaluationCriteria.map(criteria => (
                <div key={criteria.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">{criteria.name}</p>
                    <p className="text-sm">{criteria.weight}%</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{criteria.description}</p>
                </div>
              ))}

              <Button className="w-full mt-4" variant="outline">
                <Pencil className="mr-2 h-4 w-4" />
                Edit Criteria
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EvaluationTable;
