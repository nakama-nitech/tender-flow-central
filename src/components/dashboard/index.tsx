
import React from 'react';
import { TenderStatistics } from '@/types/tender';
import { DashboardHeader } from './DashboardHeader';
import { TenderStatisticsGrid } from './TenderStatisticsGrid';
import StatsCardSection from './StatsCardSection';
import PerformanceChart from './PerformanceChart';
import RecentActivity from './RecentActivity';
import CategoryDistribution from './CategoryDistribution';
import UpcomingDeadlines from './UpcomingDeadlines';

const statsData: TenderStatistics = {
  totalTenders: 36,
  activeTenders: 14,
  completedTenders: 22,
  totalBids: 186,
  averageBidsPerTender: 5.2
};

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <DashboardHeader />
      <TenderStatisticsGrid stats={statsData} />
      
      {/* Charts and Activity */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PerformanceChart />
        <RecentActivity />
      </div>

      {/* Category Distribution and Deadlines */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CategoryDistribution />
        <UpcomingDeadlines />
      </div>
    </div>
  );
};

export default Dashboard;
