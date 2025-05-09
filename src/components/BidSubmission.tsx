import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { ArrowUpRight, DollarSign, FileText, Calendar, Upload, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Tender } from '@/types/tender';
import { cn } from '@/lib/utils';
import { RequireCompanyProfile } from '@/components/supplier/RequireCompanyProfile';

const activeTenders: Tender[] = [
  {
    id: '1',
    title: 'Office Building Renovation',
    description: 'Complete renovation of a 3-story office building including electrical, plumbing, and HVAC systems.',
    category: 'construction',
    budget: 750000,
    deadline: '2025-05-20T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-15T10:30:00Z'
  },
  {
    id: '2',
    title: 'IT Infrastructure Upgrade',
    description: 'Supply and installation of network equipment, servers, and workstations for headquarters.',
    category: 'goods',
    budget: 250000,
    deadline: '2025-04-28T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-18T14:15:00Z'
  },
  {
    id: '3',
    title: 'Annual Financial Audit',
    description: 'Professional services for annual financial audit and compliance review.',
    category: 'services',
    budget: 45000,
    deadline: '2025-05-15T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-20T09:45:00Z'
  }
];

const BidSubmissionContent: React.FC = () => {
  const { toast } = useToast();
  const [selectedTenderId, setSelectedTenderId] = useState<string>('');
  const [submitting, setSubmitting] = useState(false);
  
  const selectedTender = activeTenders.find(tender => tender.id === selectedTenderId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Bid Submitted Successfully",
      description: "Your bid has been received and is now under review.",
    });
    
    setSubmitting(false);
    setSelectedTenderId('');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Submit a Bid</h2>
        <p className="text-muted-foreground">
          Submit your proposal for an open tender
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Bid Submission Form</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="tender">Select Tender</Label>
                  <Select 
                    value={selectedTenderId} 
                    onValueChange={setSelectedTenderId}
                    required
                  >
                    <SelectTrigger id="tender">
                      <SelectValue placeholder="Select a tender to bid on" />
                    </SelectTrigger>
                    <SelectContent>
                      {activeTenders.map(tender => (
                        <SelectItem key={tender.id} value={tender.id}>
                          {tender.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedTender && (
                  <>
                    <div className="rounded-lg bg-muted p-4 text-sm">
                      <h4 className="font-medium mb-2">Tender Details</h4>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2">
                          <FileText className="h-4 w-4 mt-0.5 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Description</p>
                            <p className="text-muted-foreground">{selectedTender.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Deadline</p>
                            <p className="text-muted-foreground">
                              {format(new Date(selectedTender.deadline), "MMMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">Budget</p>
                            <p className="text-muted-foreground">
                              ${selectedTender.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="name">Company/Vendor Name</Label>
                        <Input id="name" placeholder="Enter your company name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="contact@example.com" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="amount">Bid Amount (USD)</Label>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input 
                          id="amount" 
                          type="number" 
                          placeholder="0.00" 
                          className="pl-10" 
                          required 
                          min="1"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="proposal">Proposal Description</Label>
                      <Textarea 
                        id="proposal" 
                        placeholder="Describe your proposal and how you plan to meet the requirements" 
                        rows={6}
                        required 
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Supporting Documents</Label>
                      <div className="border border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Upload proposal documents, credentials, or portfolios
                        </p>
                        <Button type="button" variant="outline" size="sm">
                          Browse Files
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Supported formats: PDF, DOCX, XLSX, JPG (Max 10MB per file)
                      </p>
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={submitting}>
                        {submitting ? (
                          <>
                            <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                            Submitting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Submit Bid
                          </>
                        )}
                      </Button>
                    </div>
                  </>
                )}
              </form>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Approaching Deadlines</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activeTenders.map(tender => {
                  const deadline = new Date(tender.deadline);
                  const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
                  const isUrgent = daysLeft <= 7;
                  
                  return (
                    <div key={tender.id} className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium text-sm">{tender.title}</h4>
                        <div 
                          className={cn(
                            "text-xs font-medium rounded-full px-2 py-0.5 flex items-center gap-1",
                            isUrgent ? "bg-red-100 text-red-700" : "bg-amber-100 text-amber-700"
                          )}
                        >
                          <ArrowUpRight className="h-3 w-3" />
                          {daysLeft} days left
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {tender.description}
                      </p>
                      <div className="text-xs flex justify-between">
                        <span>Budget: ${tender.budget.toLocaleString()}</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-auto p-0 text-xs text-primary hover:text-primary/80 font-medium"
                          onClick={() => setSelectedTenderId(tender.id)}
                        >
                          Bid now
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const BidSubmission: React.FC = () => {
  return (
    <RequireCompanyProfile>
      <BidSubmissionContent />
    </RequireCompanyProfile>
  );
};

export default BidSubmission;
