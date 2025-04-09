
import React from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar, DollarSign, FileText, Users, Tag, Clock, Download } from 'lucide-react';
import { format } from 'date-fns';
import { Tender, TenderCategory, TenderStatus } from '@/types/tender';

// Mock data for the selected tender (in a real app, this would come from a database)
const mockTenders: Record<string, Tender> = {
  '1': {
    id: '1',
    title: 'Office Building Renovation',
    description: 'Complete renovation of a 3-story office building including electrical, plumbing, and HVAC systems. The project requires contractors with experience in commercial renovations and ability to work within specified timelines while adhering to local building codes and regulations. The renovation will be completed in phases to minimize disruption to ongoing business operations.',
    category: 'construction',
    budget: 750000,
    deadline: '2025-05-20T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-15T10:30:00Z',
    documents: [
      { id: 'd1', name: 'Requirements Specification.pdf', size: '2.4 MB' },
      { id: 'd2', name: 'Building Plans.dwg', size: '5.8 MB' },
      { id: 'd3', name: 'Contract Template.docx', size: '1.1 MB' }
    ],
    questions: [
      { id: 'q1', question: 'Is the building occupied during renovation?', answer: 'Yes, the building will remain partially occupied. Work will need to be scheduled to minimize disruption.', date: '2025-03-20T14:25:00Z' },
      { id: 'q2', question: 'Are there any specific materials required?', answer: 'Please refer to the Requirements Specification document for detailed material specifications.', date: '2025-03-22T09:10:00Z' }
    ]
  },
  '2': {
    id: '2',
    title: 'IT Infrastructure Upgrade',
    description: 'Supply and installation of network equipment, servers, and workstations for headquarters. The upgrade includes replacement of outdated network switches, installation of new rack-mounted servers, and deployment of 100 workstations across multiple departments. The successful bidder will be responsible for migration of data and minimal downtime during transition.',
    category: 'goods',
    budget: 250000,
    deadline: '2025-04-28T23:59:59Z',
    status: 'published',
    createdAt: '2025-03-18T14:15:00Z',
    documents: [
      { id: 'd4', name: 'Technical Requirements.pdf', size: '3.2 MB' },
      { id: 'd5', name: 'Network Diagram.vsdx', size: '1.5 MB' }
    ],
    questions: [
      { id: 'q3', question: 'What is the expected timeline for completion?', answer: 'The full deployment should be completed within 45 days after contract signing.', date: '2025-03-25T11:30:00Z' }
    ]
  }
};

// Get status badge helper function
const getStatusBadge = (status: TenderStatus) => {
  switch (status) {
    case 'draft':
      return <Badge variant="outline" className="bg-gray-100 text-gray-800">Draft</Badge>;
    case 'published':
      return <Badge variant="outline" className="bg-green-100 text-green-800">Published</Badge>;
    case 'under_evaluation':
      return <Badge variant="outline" className="bg-blue-100 text-blue-800">Under Evaluation</Badge>;
    case 'awarded':
      return <Badge variant="outline" className="bg-purple-100 text-purple-800">Awarded</Badge>;
    case 'closed':
      return <Badge variant="outline" className="bg-red-100 text-red-800">Closed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
};

// Category badge helper function
const getCategoryBadge = (category: TenderCategory) => {
  switch (category) {
    case 'construction':
      return <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100">{category}</Badge>;
    case 'services':
      return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">{category}</Badge>;
    case 'goods':
      return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">{category}</Badge>;
    case 'consulting':
      return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">{category}</Badge>;
    case 'other':
      return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{category}</Badge>;
    default:
      return <Badge>{category}</Badge>;
  }
};

interface TenderDetailsProps {
  tenderId: string;
  onBack: () => void;
}

const TenderDetails: React.FC<TenderDetailsProps> = ({ tenderId, onBack }) => {
  const tender = mockTenders[tenderId];

  if (!tender) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="sm" onClick={onBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{tender.title}</h2>
          <div className="flex items-center gap-2 mt-1">
            {getStatusBadge(tender.status)}
            {getCategoryBadge(tender.category)}
          </div>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="questions">Questions & Answers</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tender Details</CardTitle>
              <CardDescription>Complete information about this tender</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-2">Description</h3>
                <p className="text-sm">{tender.description}</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Submission Deadline</span>
                  </div>
                  <p className="text-sm pl-6">{formatDate(tender.deadline)}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Budget</span>
                  </div>
                  <p className="text-sm pl-6">{formatCurrency(tender.budget)}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Published Date</span>
                  </div>
                  <p className="text-sm pl-6">{formatDate(tender.createdAt)}</p>
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm font-medium">Documents</span>
                  </div>
                  <p className="text-sm pl-6">{tender.documents?.length || 0} documents attached</p>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6 flex justify-between">
              <Button variant="outline">
                <FileText className="mr-2 h-4 w-4" />
                Export Details
              </Button>
              <Button>
                Submit Bid
              </Button>
            </CardFooter>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Timeline</CardTitle>
              <CardDescription>Key dates for this tender</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Clock className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Published</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tender.createdAt)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-primary/10 p-1">
                    <Calendar className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Submission Deadline</p>
                    <p className="text-xs text-muted-foreground">{formatDate(tender.deadline)}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-muted p-1">
                    <Users className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Evaluation Period</p>
                    <p className="text-xs text-muted-foreground">To be determined</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <div className="mt-1 rounded-full bg-muted p-1">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Award Announcement</p>
                    <p className="text-xs text-muted-foreground">To be determined</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="documents" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tender Documents</CardTitle>
              <CardDescription>Download the required documents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tender.documents && tender.documents.length > 0 ? (
                  tender.documents.map((doc) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No documents available for this tender.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="questions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Questions & Answers</CardTitle>
              <CardDescription>Clarifications about this tender</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {tender.questions && tender.questions.length > 0 ? (
                  tender.questions.map((qa) => (
                    <div key={qa.id} className="border rounded-md p-4">
                      <div className="mb-3">
                        <p className="text-sm font-medium">Q: {qa.question}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Asked on {formatDate(qa.date)}
                        </p>
                      </div>
                      <div className="pl-4 border-l-2 border-primary/20">
                        <p className="text-sm">A: {qa.answer}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No questions have been asked about this tender yet.</p>
                )}
              </div>
            </CardContent>
            <CardFooter className="border-t pt-6">
              <Button variant="outline" className="w-full">
                Ask a Question
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TenderDetails;
