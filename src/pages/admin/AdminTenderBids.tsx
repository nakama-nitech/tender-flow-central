
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { useTenderBids } from '@/hooks/admin/useTenderBids';
import { Bid } from '@/types/tender';
import { format } from 'date-fns';
import { ArrowLeft, Award, Check, FileText, MoreHorizontal, Star, X, Loader2 } from 'lucide-react';

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

const AdminTenderBids: React.FC = () => {
  useAdminAuth(); // This ensures only admins can access this page
  const navigate = useNavigate();
  const { tenderId } = useParams<{ tenderId: string }>();
  const { bids, isLoading, error, updateBidStatus } = useTenderBids(tenderId!);
  const [processingBid, setProcessingBid] = useState<string | null>(null);
  
  const handleStatusChange = async (bidId: string, status: Bid['status']) => {
    setProcessingBid(bidId);
    await updateBidStatus(bidId, status);
    setProcessingBid(null);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => navigate('/admin/tenders')}>
          Back to Tenders
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/tenders')}
            className="mb-4 flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tenders
          </Button>
          <h2 className="text-3xl font-bold tracking-tight">Bid Management</h2>
          <p className="text-muted-foreground">
            Review and manage bids for this tender
          </p>
        </div>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Submitted Bids ({bids.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {bids.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vendor</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
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
                    <TableCell>
                      {bid.submittedDate && format(new Date(bid.submittedDate), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      {processingBid === bid.id ? (
                        <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem 
                              onClick={() => navigate(`/admin/bid/${bid.id}`)}
                            >
                              <FileText className="mr-2 h-4 w-4" />
                              View Details
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
                                  <AlertDialogAction 
                                    onClick={() => handleStatusChange(bid.id, 'awarded')}
                                  >
                                    Continue
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center p-8">
              <p className="text-muted-foreground">No bids have been submitted yet for this tender</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminTenderBids;
