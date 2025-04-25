
import React from 'react';
import { TenderStatistics } from '@/types/tender';
import { DashboardHeader } from './dashboard/DashboardHeader';
import { DashboardStatsGrid } from './dashboard/DashboardStatsGrid';
import { PerformanceChart } from './dashboard/PerformanceChart';
import { RecentActivity } from './dashboard/RecentActivity';
import { CategoryDistribution } from './dashboard/CategoryDistribution';
import { UpcomingDeadlines } from './dashboard/UpcomingDeadlines';

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
      <DashboardStatsGrid stats={statsData} />
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <PerformanceChart />
        <RecentActivity />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <CategoryDistribution />
        <UpcomingDeadlines />
      </div>
    </div>
  );
};

export default Dashboard;
