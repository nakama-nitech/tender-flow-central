
import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, FileText, DollarSign, Upload, Calendar, CheckCircle2, AlertCircle, Save, Send } from 'lucide-react';
import { format } from 'date-fns';
import { Tender, TenderDocument } from '@/types/tender';

// Mock data for the selected tender
const mockTenderDetails: Record<string, Tender> = {
  '1': {
    id: '1',
    title: 'Office Building Renovation',
    description: 'Complete renovation of a 3-story office building including electrical, plumbing, and HVAC systems.',
    category: 'construction',
    budget: 750000,
    deadline: '2025-05-20T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-15T10:30:00Z',
    documents: [
      { id: 'd1', name: 'Requirements Specification.pdf', size: '2.4 MB' },
      { id: 'd2', name: 'Building Plans.dwg', size: '5.8 MB' },
      { id: 'd3', name: 'Contract Template.docx', size: '1.1 MB' }
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
    documents: [
      { id: 'd4', name: 'Technical Requirements.pdf', size: '3.2 MB' },
      { id: 'd5', name: 'Network Diagram.vsdx', size: '1.5 MB' }
    ]
  },
  '3': {
    id: '3',
    title: 'Annual Financial Audit',
    description: 'Professional services for annual financial audit and compliance review.',
    category: 'services',
    budget: 45000,
    deadline: '2025-05-15T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-20T09:45:00Z',
    documents: [
      { id: 'd6', name: 'Audit Scope.pdf', size: '1.8 MB' },
      { id: 'd7', name: 'Prior Year Financial Statements.pdf', size: '4.2 MB' }
    ]
  }
};

const BidPreparation: React.FC = () => {
  const { tenderId } = useParams<{ tenderId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [activeTab, setActiveTab] = useState('details');
  const [bidProgress, setBidProgress] = useState(20);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [bidForm, setBidForm] = useState({
    tenderId: tenderId || '',
    companyName: 'ABC Construction Ltd',
    contactEmail: 'contact@abcconstruction.com',
    amount: '',
    proposal: '',
    timeline: '',
    methodology: '',
    experienceDetails: '',
    keyPersonnel: '',
    documents: [] as File[],
    status: 'draft'
  });
  
  if (!tenderId || !mockTenderDetails[tenderId]) {
    return (
      <div className="text-center p-8">
        <h2 className="text-xl font-semibold mb-4">Tender Not Found</h2>
        <Link to="/supplier/tenders">
          <Button>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Tenders
          </Button>
        </Link>
      </div>
    );
  }
  
  const tender = mockTenderDetails[tenderId];
  
  const calculateProgress = () => {
    let filledFields = 0;
    let totalFields = 7; // Number of main fields to consider
    
    if (bidForm.amount) filledFields++;
    if (bidForm.proposal) filledFields++;
    if (bidForm.timeline) filledFields++;
    if (bidForm.methodology) filledFields++;
    if (bidForm.experienceDetails) filledFields++;
    if (bidForm.keyPersonnel) filledFields++;
    if (bidForm.documents.length > 0) filledFields++;
    
    const progress = Math.round((filledFields / totalFields) * 100);
    setBidProgress(progress);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setBidForm(prev => ({ ...prev, [name]: value }));
    calculateProgress();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const filesArray = Array.from(e.target.files);
      setBidForm(prev => ({ ...prev, documents: [...prev.documents, ...filesArray] }));
      calculateProgress();
    }
  };
  
  const handleRemoveDocument = (index: number) => {
    setBidForm(prev => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index)
    }));
    calculateProgress();
  };
  
  const handleSaveDraft = () => {
    setIsSaving(true);
    
    setTimeout(() => {
      toast({
        title: "Draft Saved",
        description: "Your bid has been saved as a draft",
      });
      setIsSaving(false);
    }, 1000);
  };
  
  const handleSubmitBid = () => {
    if (bidProgress < 100) {
      toast({
        title: "Incomplete Bid",
        description: "Please complete all required sections before submitting",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    setTimeout(() => {
      toast({
        title: "Bid Submitted Successfully",
        description: "Your bid has been received and is now under review",
      });
      setIsSubmitting(false);
      navigate('/supplier/my-bids');
    }, 1500);
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
  
  const deadline = new Date(tender.deadline);
  const daysLeft = Math.ceil((deadline.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to={`/supplier/tender-details/${tenderId}`}>
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </Link>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Prepare Bid</h2>
            <p className="text-muted-foreground">{tender.title}</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div>
            <div className="text-sm text-muted-foreground mb-1">Completion</div>
            <div className="flex items-center gap-2">
              <Progress value={bidProgress} className="w-24 h-2" />
              <span className="text-sm font-medium">{bidProgress}%</span>
            </div>
          </div>
          <Button variant="outline" onClick={handleSaveDraft} disabled={isSaving}>
            {isSaving ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-4 w-full">
              <TabsTrigger value="details">Bid Details</TabsTrigger>
              <TabsTrigger value="proposal">Proposal</TabsTrigger>
              <TabsTrigger value="documents">Documents</TabsTrigger>
              <TabsTrigger value="review">Review & Submit</TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Enter the core details of your bid</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="companyName">Company Name</Label>
                      <Input 
                        id="companyName" 
                        name="companyName"
                        value={bidForm.companyName}
                        onChange={handleInputChange}
                        readOnly 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input 
                        id="contactEmail" 
                        name="contactEmail" 
                        type="email"
                        value={bidForm.contactEmail}
                        onChange={handleInputChange}
                        readOnly
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="amount">Bid Amount (USD)</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="amount" 
                        name="amount"
                        type="number" 
                        placeholder="0.00" 
                        className="pl-10" 
                        required 
                        min="1"
                        value={bidForm.amount}
                        onChange={handleInputChange}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Tender budget: {formatCurrency(tender.budget)}
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="timeline">Project Timeline</Label>
                    <Select 
                      value={bidForm.timeline} 
                      onValueChange={(value) => {
                        setBidForm(prev => ({ ...prev, timeline: value }));
                        calculateProgress();
                      }}
                    >
                      <SelectTrigger id="timeline">
                        <SelectValue placeholder="Select estimated timeline" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under_30">Under 30 days</SelectItem>
                        <SelectItem value="30_60">30-60 days</SelectItem>
                        <SelectItem value="60_90">60-90 days</SelectItem>
                        <SelectItem value="over_90">Over 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-end border-t pt-4">
                  <Button onClick={() => setActiveTab('proposal')}>
                    Continue to Proposal
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="proposal" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Proposal Details</CardTitle>
                  <CardDescription>Describe your approach and qualifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="proposal">Executive Summary</Label>
                    <Textarea 
                      id="proposal" 
                      name="proposal"
                      placeholder="Provide a brief overview of your bid proposal" 
                      rows={4}
                      value={bidForm.proposal}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="methodology">Methodology & Approach</Label>
                    <Textarea 
                      id="methodology" 
                      name="methodology"
                      placeholder="Describe how you plan to execute this project" 
                      rows={6}
                      value={bidForm.methodology}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="experienceDetails">Relevant Experience</Label>
                    <Textarea 
                      id="experienceDetails" 
                      name="experienceDetails"
                      placeholder="Detail your previous experience with similar projects" 
                      rows={4}
                      value={bidForm.experienceDetails}
                      onChange={handleInputChange}
                    />
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <Label htmlFor="keyPersonnel">Key Personnel</Label>
                    <Textarea 
                      id="keyPersonnel" 
                      name="keyPersonnel"
                      placeholder="List the key team members who will work on this project" 
                      rows={4}
                      value={bidForm.keyPersonnel}
                      onChange={handleInputChange}
                    />
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => setActiveTab('details')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('documents')}>
                    Continue to Documents
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Supporting Documents</CardTitle>
                  <CardDescription>Upload files to support your bid</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border border-dashed rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload proposal documents, certificates, or portfolios
                    </p>
                    <Input
                      id="documents"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                    />
                    <Label htmlFor="documents">
                      <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                        Browse Files
                      </Button>
                    </Label>
                    <p className="text-xs text-muted-foreground mt-2">
                      Supported formats: PDF, DOCX, XLSX, JPG (Max 10MB per file)
                    </p>
                  </div>
                  
                  {bidForm.documents.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="text-sm font-medium">Uploaded Documents</h3>
                      <div className="space-y-2">
                        {bidForm.documents.map((file, index) => (
                          <div key={index} className="flex items-center justify-between p-2 border rounded-md">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm truncate max-w-[200px]">{file.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {(file.size / 1024 / 1024).toFixed(2)} MB
                              </span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-8 w-8 p-0" 
                              onClick={() => handleRemoveDocument(index)}
                            >
                              <AlertCircle className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => setActiveTab('proposal')}>
                    Back
                  </Button>
                  <Button onClick={() => setActiveTab('review')}>
                    Continue to Review
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
            
            <TabsContent value="review" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Review Your Bid</CardTitle>
                  <CardDescription>Verify all information before submission</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">Company Name</h3>
                        <p className="text-sm">{bidForm.companyName}</p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">Contact Email</h3>
                        <p className="text-sm">{bidForm.contactEmail}</p>
                      </div>
                    </div>
                    
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">Bid Amount</h3>
                        <p className="text-sm font-semibold">
                          {bidForm.amount ? `$${Number(bidForm.amount).toLocaleString()}` : 'Not specified'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-sm font-medium">Timeline</h3>
                        <p className="text-sm">
                          {bidForm.timeline === 'under_30' && 'Under 30 days'}
                          {bidForm.timeline === '30_60' && '30-60 days'}
                          {bidForm.timeline === '60_90' && '60-90 days'}
                          {bidForm.timeline === 'over_90' && 'Over 90 days'}
                          {!bidForm.timeline && 'Not specified'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Executive Summary</h3>
                      <p className="text-sm">{bidForm.proposal || 'Not provided'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Methodology & Approach</h3>
                      <p className="text-sm">{bidForm.methodology || 'Not provided'}</p>
                    </div>
                    
                    <div className="space-y-1">
                      <h3 className="text-sm font-medium">Supporting Documents</h3>
                      {bidForm.documents.length > 0 ? (
                        <ul className="text-sm list-disc pl-5">
                          {bidForm.documents.map((file, index) => (
                            <li key={index}>{file.name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm">No documents uploaded</p>
                      )}
                    </div>
                  </div>
                  
                  <div className="bg-muted p-4 rounded-lg">
                    <div className="flex items-center gap-2">
                      {bidProgress < 100 ? (
                        <AlertCircle className="h-5 w-5 text-amber-500" />
                      ) : (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      )}
                      <h3 className="text-sm font-medium">
                        {bidProgress < 100 
                          ? `Bid is ${bidProgress}% complete. Please fill all required fields.` 
                          : `Bid is ready for submission.`}
                      </h3>
                    </div>
                  </div>
                  
                  <div className="rounded-lg border p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-sm font-medium">Submission Deadline</h3>
                    </div>
                    <p className="text-sm ml-6 mb-1">{formatDate(tender.deadline)}</p>
                    <p className={`text-sm ml-6 font-medium ${daysLeft <= 3 ? 'text-red-600' : 'text-amber-600'}`}>
                      {daysLeft} days remaining
                    </p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-between border-t pt-4">
                  <Button variant="outline" onClick={() => setActiveTab('documents')}>
                    Back
                  </Button>
                  <Button 
                    onClick={handleSubmitBid} 
                    disabled={isSubmitting || bidProgress < 100}
                  >
                    {isSubmitting ? (
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
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Tender Overview</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-4">
              <h3 className="font-medium text-base">{tender.title}</h3>
              <p className="text-muted-foreground line-clamp-4">
                {tender.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>Deadline: {formatDate(tender.deadline)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span>Budget: {formatCurrency(tender.budget)}</span>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2">Required Documents</h4>
                <ul className="space-y-1 list-disc list-inside text-muted-foreground">
                  <li>Company profile</li>
                  <li>Similar project experience</li>
                  <li>Financial proposal</li>
                  <li>Implementation plan</li>
                  <li>Team qualifications</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Bid Preparation Tips</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-3">
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Read all tender documents thoroughly</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Address all requirements specifically</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Highlight your unique value proposition</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Provide evidence of similar successful projects</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Be realistic with pricing and timelines</p>
              </div>
              <div className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                <p>Proofread all documents before submission</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default BidPreparation;
