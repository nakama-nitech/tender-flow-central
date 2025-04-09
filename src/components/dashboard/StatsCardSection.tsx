
import React from 'react';
import { BarChart3, FileText, Users, Calendar } from 'lucide-react';
import StatsCard from './StatsCard';
import { TenderStatistics } from '@/types/tender';

interface StatsCardSectionProps {
  statsData: TenderStatistics;
}

const StatsCardSection: React.FC<StatsCardSectionProps> = ({ statsData }) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <StatsCard
        title="Total Tenders"
        value={statsData.totalTenders}
        icon={FileText}
        change="+2 from last month"
      />
      
      <StatsCard
        title="Active Tenders"
        value={statsData.activeTenders}
        icon={Calendar}
        change="+3 from last month"
      />
      
      <StatsCard
        title="Total Bids"
        value={statsData.totalBids}
        icon={Users}
        change="+24 from last month"
      />
      
      <StatsCard
        title="Avg. Bids per Tender"
        value={statsData.averageBidsPerTender}
        icon={BarChart3}
        change="+0.8 from last month"
      />
    </div>
  );
};

export default StatsCardSection;
