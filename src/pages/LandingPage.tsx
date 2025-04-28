import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CheckCircle2, FileSearch, Award, Clock, Users } from 'lucide-react';

const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 py-8 md:py-16">
          <nav className="flex justify-between items-center mb-16">
            <h1 className="text-3xl font-bold">SupplierPro Africa</h1>
            <div className="flex gap-4">
              <Link to="/auth">
                <Button 
                  variant="outline" 
                  className="bg-white text-blue-900 border-2 border-white hover:bg-blue-50 hover:text-blue-900 font-semibold"
                >
                  Login
                </Button>
              </Link>
            </div>
          </nav>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="md:w-1/2">
              <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
                Africa's Premier <span className="text-amber-400">Tender Management</span> Platform
              </h2>
              <p className="text-xl mb-8 text-blue-100">
                Connect suppliers with opportunities across Africa. Streamlined tender discovery, bidding and management for businesses and organizations.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/auth?signup=true">
                  <Button 
                    size="lg" 
                    className="bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg hover:shadow-xl transition-all"
                  >
                    Register as Supplier
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button 
                    size="lg" 
                    variant="outline" 
                    className="bg-white/10 text-white border-2 border-white hover:bg-white/20 font-semibold backdrop-blur-sm"
                  >
                    Login to Your Account
                  </Button>
                </Link>
              </div>
            </div>
            <div className="md:w-1/2 flex justify-center">
              <div className="w-80 h-80 bg-white/10 rounded-full flex items-center justify-center">
                <div className="w-64 h-64 bg-white/20 rounded-full flex items-center justify-center">
                  <div className="w-48 h-48 bg-blue-600 rounded-full flex items-center justify-center">
                    <FileSearch size={80} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      
      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Why Choose SupplierPro Africa?</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-blue-100 text-blue-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <FileSearch size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Tender Discovery</h3>
              <p className="text-gray-600">
                Find relevant business opportunities across Africa with our advanced filtering and notification system.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-amber-100 text-amber-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Clock size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Efficient Bid Management</h3>
              <p className="text-gray-600">
                Save time with streamlined bid submission, tracking, and management tools.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="bg-green-100 text-green-800 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-semibold mb-2">Increased Win Rate</h3>
              <p className="text-gray-600">
                Get insights and analytics to help improve your proposals and increase your success rate.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link to="/auth?signup=true">
              <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
                Get Started Today
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Trusted Across Africa</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  <Users size={24} className="text-blue-700" />
                </div>
                <div>
                  <p className="font-semibold">Kenya Construction Ltd</p>
                  <p className="text-sm text-gray-500">Nairobi, Kenya</p>
                </div>
              </div>
              <p className="text-gray-700">
                "SupplierPro Africa has transformed how we find and bid for construction tenders. Our business has grown 40% since joining."
              </p>
            </div>
            
            <div className="bg-amber-50 p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4">
                  <Users size={24} className="text-amber-700" />
                </div>
                <div>
                  <p className="font-semibold">GreenTech Solutions</p>
                  <p className="text-sm text-gray-500">Lagos, Nigeria</p>
                </div>
              </div>
              <p className="text-gray-700">
                "The platform's efficiency has helped us win multiple government contracts for solar installations across West Africa."
              </p>
            </div>
            
            <div className="bg-green-50 p-6 rounded-lg lg:col-span-1 md:col-span-2 lg:col-span-1">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                  <Users size={24} className="text-green-700" />
                </div>
                <div>
                  <p className="font-semibold">MediSupply SA</p>
                  <p className="text-sm text-gray-500">Johannesburg, South Africa</p>
                </div>
              </div>
              <p className="text-gray-700">
                "As a healthcare supplier, we've expanded our reach to multiple countries through the tender opportunities on SupplierPro Africa."
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-900 to-indigo-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Grow Your Business?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Join thousands of African businesses finding success through SupplierPro Africa's tender management platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth?signup=true">
              <Button size="lg" className="bg-amber-500 hover:bg-amber-600 text-white">
                Register as Supplier
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="lg" variant="outline" className="text-white border-white hover:bg-white/10">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-white text-lg font-semibold mb-4">SupplierPro Africa</h3>
              <p className="mb-4">Connecting African businesses with opportunities.</p>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Resources</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Tender Guide</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Bid Templates</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white text-md font-semibold mb-4">Contact</h4>
              <ul className="space-y-2">
                <li>support@supplierpro.africa</li>
                <li>+254 700 000 000</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p>&copy; 2025 SupplierPro Africa. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
