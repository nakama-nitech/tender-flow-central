
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Clock, ArrowRight, TrendingUp, Briefcase, CheckCircle, ShieldCheck } from 'lucide-react';
import Navbar from '@/components/Navbar';

const categoryItems = [
  {
    title: "Construction & Infrastructure",
    icon: Building,
    description: "Building, roads, bridges, water systems and other infrastructure projects."
  },
  {
    title: "Information Technology",
    icon: TrendingUp,
    description: "Hardware, software, networking, and IT consultancy services."
  },
  {
    title: "Medical Supplies",
    icon: ShieldCheck,
    description: "Pharmaceuticals, medical equipment, and healthcare services."
  },
  {
    title: "Professional Services",
    icon: Briefcase,
    description: "Consultancy, auditing, research, and professional advisory services."
  }
];

const tenderItems = [
  {
    title: "School Building Construction Project",
    category: "Construction",
    deadline: "15 May 2025",
    budget: "KSh 25,000,000",
    location: "Nairobi County"
  },
  {
    title: "Hospital IT Systems Upgrade",
    category: "IT Services",
    deadline: "22 May 2025",
    budget: "KSh 8,500,000",
    location: "Kisumu"
  },
  {
    title: "Road Maintenance Services",
    category: "Infrastructure",
    deadline: "30 May 2025",
    budget: "KSh 12,000,000",
    location: "Mombasa"
  }
];

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-blue-600 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-700 opacity-90"></div>
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Find and Win Government Tenders in East Africa
              </h1>
              <p className="text-xl mb-8 opacity-90">
                TenderFlow simplifies the tender process, connecting suppliers with opportunities across Kenya and beyond.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/auth?tab=register">
                  <Button 
                    size="lg" 
                    className="bg-white text-blue-600 hover:bg-gray-100"
                  >
                    Register Now
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/supplier/tenders">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="border-white text-white hover:bg-blue-700"
                  >
                    Browse Tenders
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <img 
                src="https://images.unsplash.com/photo-1517048676732-d65bc937f952?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80" 
                alt="Business meeting" 
                className="rounded-lg shadow-xl w-full"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-2">Categories</Badge>
          <h2 className="text-3xl font-bold mb-3">Tender Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Browse through our diverse range of tender categories to find opportunities that match your business expertise.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categoryItems.map((item, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="bg-blue-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-lg font-medium mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </CardContent>
              <CardFooter>
                <Link to="/supplier/tenders" className="text-blue-600 hover:underline flex items-center">
                  View Tenders <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Tenders */}
      <section className="bg-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <Badge variant="outline" className="mb-2">Opportunities</Badge>
            <h2 className="text-3xl font-bold mb-3">Featured Tenders</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore some of our current tender opportunities and find your next business opportunity.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tenderItems.map((item, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <Badge className="bg-blue-100 text-blue-600 hover:bg-blue-100">{item.category}</Badge>
                    <div className="flex items-center text-amber-500 text-sm">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{item.deadline}</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-medium mb-3">{item.title}</h3>
                  <div className="text-sm text-gray-600 mb-4">
                    <div className="flex justify-between mb-1">
                      <span>Budget:</span>
                      <span className="font-medium">{item.budget}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium">{item.location}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link to="/auth" className="w-full">
                    <Button variant="outline" className="w-full">View Details</Button>
                  </Link>
                </CardFooter>
              </Card>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link to="/supplier/tenders">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                View All Tenders
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <Badge variant="outline" className="mb-2">Benefits</Badge>
          <h2 className="text-3xl font-bold mb-3">Why Choose TenderFlow?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our platform offers a range of features designed to make the tender process smoother and more accessible.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-green-100 rounded-full p-4 mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Easy Application</h3>
            <p className="text-gray-600">
              Streamlined tender application process that saves you time and resources.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-blue-100 rounded-full p-4 mb-4">
              <ShieldCheck className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Verified Tenders</h3>
            <p className="text-gray-600">
              All opportunities on our platform are verified and from trusted sources.
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-purple-100 rounded-full p-4 mb-4">
              <TrendingUp className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-medium mb-2">Business Growth</h3>
            <p className="text-gray-600">
              Access to diverse opportunities helps your business expand and grow.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding on Tenders?</h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of suppliers already using TenderFlow to find new business opportunities.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/auth?tab=register">
                <Button 
                  size="lg" 
                  className="bg-white text-blue-600 hover:bg-gray-100"
                >
                  Register Now
                </Button>
              </Link>
              <Link to="/about">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-white text-white hover:bg-blue-700"
                >
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-10 mt-auto">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">TenderFlow</h3>
              <p className="text-gray-400">
                Connecting suppliers with opportunities across East Africa.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {['Home', 'About Us', 'Contact', 'FAQ'].map((item, i) => (
                  <li key={i}>
                    <Link to={i === 0 ? '/' : `/${item.toLowerCase().replace(' ', '-')}`} className="text-gray-400 hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Categories</h3>
              <ul className="space-y-2">
                {['Construction', 'IT Services', 'Medical', 'Professional Services'].map((item, i) => (
                  <li key={i}>
                    <Link to="/supplier/tenders" className="text-gray-400 hover:text-white">
                      {item}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact</h3>
              <address className="text-gray-400 not-italic">
                TenderFlow Tower<br />
                123 Business Avenue<br />
                Nairobi, Kenya<br />
                <a href="mailto:info@tenderflow.com" className="hover:text-white">info@tenderflow.com</a>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">© {new Date().getFullYear()} TenderFlow. All rights reserved.</p>
            <div className="flex space-x-4 mt-4 md:mt-0">
              {['facebook', 'twitter', 'linkedin', 'instagram'].map((platform) => (
                <a 
                  key={platform}
                  href={`#${platform}`}
                  className="text-gray-400 hover:text-white"
                >
                  <span className="sr-only">{platform}</span>
                  <div className="w-5 h-5 bg-gray-400 rounded-sm"></div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
