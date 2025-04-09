
import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/dashboard';
import TenderList from '@/components/TenderList';
import TenderForm from '@/components/TenderForm';
import BidSubmission from '@/components/BidSubmission';
import EvaluationTable from '@/components/EvaluationTable';
import TenderDetails from '@/components/TenderDetails';
import BidManagement from '@/components/BidManagement';
import { cn } from '@/lib/utils';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePage, setActivePage] = useState('dashboard');
  const [isCreatingTender, setIsCreatingTender] = useState(false);
  const [selectedTenderId, setSelectedTenderId] = useState<string | null>(null);
  const [viewingBids, setViewingBids] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleTenderSelect = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    setActivePage('tenderDetails');
  };

  const handleManageBids = (tenderId: string) => {
    setSelectedTenderId(tenderId);
    setViewingBids(true);
    setActivePage('bidManagement');
  };

  const renderContent = () => {
    if (activePage === 'tenders') {
      if (isCreatingTender) {
        return <TenderForm onCancel={() => setIsCreatingTender(false)} />;
      }
      return (
        <TenderList 
          onNewTender={() => setIsCreatingTender(true)} 
          onViewDetails={handleTenderSelect}
          onManageBids={handleManageBids}
        />
      );
    }
    
    if (activePage === 'dashboard') return <Dashboard />;
    if (activePage === 'bids') return <BidSubmission />;
    if (activePage === 'evaluation') return <EvaluationTable />;
    if (activePage === 'tenderDetails' && selectedTenderId) {
      return (
        <TenderDetails 
          tenderId={selectedTenderId} 
          onBack={() => {
            setActivePage('tenders');
            setSelectedTenderId(null);
          }}
        />
      );
    }
    if (activePage === 'bidManagement' && selectedTenderId) {
      return (
        <BidManagement 
          tenderId={selectedTenderId} 
          onBack={() => {
            setActivePage('tenders');
            setSelectedTenderId(null);
            setViewingBids(false);
          }}
        />
      );
    }
    
    return <Dashboard />;
  };

  return (
    <div className="min-h-screen flex w-full bg-background">
      <Sidebar 
        isOpen={sidebarOpen} 
        toggleSidebar={toggleSidebar} 
        activePage={activePage}
        setActivePage={(page) => {
          setActivePage(page);
          setIsCreatingTender(false);
          setSelectedTenderId(null);
          setViewingBids(false);
        }}
      />
      
      <main 
        className={cn(
          "flex-1 p-6 transition-all duration-300",
          sidebarOpen ? "md:ml-0" : "md:ml-0"
        )}
      >
        <div className="w-full mx-auto max-w-7xl">
          {renderContent()}
        </div>
      </main>
    </div>
  );
};

export default Index;
