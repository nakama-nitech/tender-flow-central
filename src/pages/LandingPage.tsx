
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, FileText, Clock, CheckSquare, MessageSquare, Bell } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Header */}
      <header className="py-6 px-6 md:px-10 flex justify-between items-center border-b bg-background/95 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">TenderFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="outline">Login</Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button>Register</Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">Streamline Your Tendering Process</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover opportunities, prepare bids, and track submissions all in one place. TenderFlow makes the bidding process simpler and more efficient for suppliers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth?tab=register">
                <Button size="lg" className="gap-2">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" size="lg">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block bg-muted rounded-lg p-6">
            <div className="aspect-video rounded-md bg-card shadow-lg border border-border"></div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-10 bg-muted/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4">Features for Suppliers</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Everything you need to identify, prepare, and submit competitive bids
          </p>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardContent className="pt-6">
                <Bell className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Tender Discovery</h3>
                <p className="text-muted-foreground">
                  Get notified about new tenders that match your business profile and capabilities.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Document Management</h3>
                <p className="text-muted-foreground">
                  Download tender documents and upload your proposals in a secure environment.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <CheckSquare className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Bid Preparation</h3>
                <p className="text-muted-foreground">
                  Comprehensive tools to help you prepare high-quality, competitive bids.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Clarification Management</h3>
                <p className="text-muted-foreground">
                  Ask questions and receive clarifications directly through the platform.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Status Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor the status of your submitted bids in real-time.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Online Submission</h3>
                <p className="text-muted-foreground">
                  Submit your bids securely through our online portal without paperwork.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10">
        <div className="max-w-7xl mx-auto bg-primary/10 rounded-lg p-8 md:p-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Streamline Your Bidding Process?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of suppliers who are winning more contracts with TenderFlow.
          </p>
          <Link to="/auth?tab=register">
            <Button size="lg" className="gap-2">Register Now <ChevronRight className="h-4 w-4" /></Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 md:px-10 border-t">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">&copy; 2025 TenderFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
