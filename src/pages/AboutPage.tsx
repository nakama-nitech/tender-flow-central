
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';

const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-12 text-primary">About TenderFlow</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 mb-4">
              TenderFlow exists to create transparency and efficiency in the procurement process, 
              empowering suppliers and buyers across East Africa to connect and grow together.
            </p>
            <p className="text-gray-700">
              We believe that by making tender opportunities more accessible, we can foster economic 
              development and create a level playing field for businesses of all sizes.
            </p>
          </div>
          
          <div className="bg-blue-600 rounded-lg overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1374&q=80" 
              alt="Business meeting" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        <Card className="mb-16 border-none shadow-lg">
          <CardContent className="p-8">
            <h2 className="text-2xl font-semibold mb-6 text-center">Why Choose TenderFlow?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Efficiency</h3>
                <p className="text-gray-600">Our streamlined process reduces the time and resources needed to find and bid on tenders.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Security</h3>
                <p className="text-gray-600">Bank-level security ensures that your data and bids are protected at all times.</p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="font-medium text-lg mb-2">Community</h3>
                <p className="text-gray-600">Join a growing network of suppliers and buyers across East Africa.</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <div className="mb-16">
          <h2 className="text-2xl font-semibold mb-6">Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="w-32 h-32 bg-gray-300 rounded-full overflow-hidden mb-4">
                  <img 
                    src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 50}.jpg`} 
                    alt="Team member" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="font-semibold text-lg">{['Sarah Johnson', 'Robert Maina', 'David Kamau'][index - 1]}</h3>
                <p className="text-gray-600">{['CEO & Co-founder', 'CTO', 'Head of Operations'][index - 1]}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-blue-600 text-white rounded-lg p-8 text-center">
          <h2 className="text-2xl font-semibold mb-4">Ready to Get Started?</h2>
          <p className="mb-6">Join thousands of businesses already benefiting from TenderFlow's platform.</p>
          <div className="flex justify-center space-x-4">
            <Link 
              to="/auth?tab=register"
              className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              Register Now
            </Link>
            <Link 
              to="/contact"
              className="border border-white text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
      
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>© {new Date().getFullYear()} TenderFlow. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
