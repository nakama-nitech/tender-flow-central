
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ChevronRight, FileText, Clock, CheckSquare, MessageSquare, Bell, ShieldCheck, BarChart3, Award, Briefcase } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="py-6 px-6 md:px-10 flex justify-between items-center border-b bg-white/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
        <div className="flex items-center">
          <h1 className="text-2xl font-bold text-primary">TenderFlow</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/auth">
            <Button variant="outline" className="border-primary/50 text-primary hover:bg-primary/10">Login</Button>
          </Link>
          <Link to="/auth?tab=register">
            <Button className="bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700">Register</Button>
          </Link>
        </div>
      </header>
      
      {/* Hero Section */}
      <section className="py-20 px-6 md:px-10 bg-[url('https://images.unsplash.com/photo-1493397212122-2b85dda8106b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')] bg-cover bg-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="bg-white/90 backdrop-blur-sm p-8 rounded-lg shadow-xl">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Streamline Your Tendering Process</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Discover opportunities, prepare bids, and track submissions all in one place. TenderFlow makes the bidding process simpler and more efficient for suppliers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth?tab=register">
                <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700">
                  Get Started <ChevronRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="#features">
                <Button variant="outline" size="lg" className="border-primary/50 text-primary hover:bg-primary/10">Learn More</Button>
              </Link>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="aspect-video rounded-lg shadow-lg overflow-hidden border-4 border-white">
              <img 
                src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80" 
                alt="Modern laptop with data analysis"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section id="features" className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-4 bg-gradient-to-r from-primary to-indigo-600 bg-clip-text text-transparent">Features for Suppliers</h2>
          <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-16">
            Everything you need to identify, prepare, and submit competitive bids
          </p>
          
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <Bell className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Tender Discovery</h3>
                <p className="text-muted-foreground">
                  Get notified about new tenders that match your business profile and capabilities.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <FileText className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Document Management</h3>
                <p className="text-muted-foreground">
                  Download tender documents and upload your proposals in a secure environment.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <CheckSquare className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Bid Preparation</h3>
                <p className="text-muted-foreground">
                  Comprehensive tools to help you prepare high-quality, competitive bids.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <MessageSquare className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Clarification Management</h3>
                <p className="text-muted-foreground">
                  Ask questions and receive clarifications directly through the platform.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <Clock className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Status Tracking</h3>
                <p className="text-muted-foreground">
                  Monitor the status of your submitted bids in real-time.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-indigo-50">
              <CardContent className="pt-6">
                <Award className="h-10 w-10 text-primary mb-4" />
                <h3 className="text-xl font-medium mb-2">Online Submission</h3>
                <p className="text-muted-foreground">
                  Submit your bids securely through our online portal without paperwork.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-16 px-6 md:px-10 bg-gradient-to-r from-primary/10 to-indigo-600/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <BarChart3 className="h-8 w-8 mx-auto text-primary mb-2" />
              <h3 className="text-3xl font-bold text-primary">1,200+</h3>
              <p className="text-muted-foreground">Tenders Posted</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Briefcase className="h-8 w-8 mx-auto text-primary mb-2" />
              <h3 className="text-3xl font-bold text-primary">650+</h3>
              <p className="text-muted-foreground">Registered Suppliers</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <ShieldCheck className="h-8 w-8 mx-auto text-primary mb-2" />
              <h3 className="text-3xl font-bold text-primary">98%</h3>
              <p className="text-muted-foreground">Success Rate</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <Award className="h-8 w-8 mx-auto text-primary mb-2" />
              <h3 className="text-3xl font-bold text-primary">850+</h3>
              <p className="text-muted-foreground">Contracts Awarded</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 px-6 md:px-10 bg-white">
        <div className="max-w-7xl mx-auto bg-gradient-to-r from-primary/20 to-indigo-600/20 rounded-lg p-8 md:p-12 text-center shadow-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-800">Ready to Streamline Your Bidding Process?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of suppliers who are winning more contracts with TenderFlow.
          </p>
          <Link to="/auth?tab=register">
            <Button size="lg" className="gap-2 bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-700">
              Register Now <ChevronRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-8 px-6 md:px-10 border-t bg-gradient-to-r from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted-foreground">&copy; 2025 TenderFlow. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="text-muted-foreground hover:text-primary">Terms</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Privacy</a>
            <a href="#" className="text-muted-foreground hover:text-primary">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
