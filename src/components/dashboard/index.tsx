
import React from 'react';
import { TenderStatistics } from '@/types/tender';
import StatsCardSection from './StatsCardSection';
import PerformanceChart from './PerformanceChart';
import RecentActivity from './RecentActivity';
import CategoryDistribution from './CategoryDistribution';
import UpcomingDeadlines from './UpcomingDeadlines';

// Mock data for statistics
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
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Overview of your organization's tendering activities
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCardSection statsData={statsData} />

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
