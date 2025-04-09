
import React from 'react';
import { 
  BarChart3, 
  FileText, 
  Users, 
  TrendingUp, 
  Calendar,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TenderStatistics } from '@/types/tender';

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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Tenders
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalTenders}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Tenders
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.activeTenders}</div>
            <p className="text-xs text-muted-foreground">
              +3 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Bids
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.totalBids}</div>
            <p className="text-xs text-muted-foreground">
              +24 from last month
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg. Bids per Tender
            </CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statsData.averageBidsPerTender}</div>
            <p className="text-xs text-muted-foreground">
              +0.8 from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Tender Performance</CardTitle>
            <CardDescription>
              Number of tenders and bids over time
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] flex items-center justify-center">
            <div className="text-muted-foreground text-center">
              <BarChart3 className="mx-auto h-12 w-12 mb-2 opacity-50" />
              <p>Analytics chart would appear here</p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates on your tenders
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">New Tender Created</p>
                  <p className="text-xs text-muted-foreground">IT Infrastructure Upgrade</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Bid Submitted</p>
                  <p className="text-xs text-muted-foreground">Office Renovation Project</p>
                  <p className="text-xs text-muted-foreground">6 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-4 w-4 text-primary" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium">Tender Deadline Approaching</p>
                  <p className="text-xs text-muted-foreground">Network Equipment Procurement</p>
                  <p className="text-xs text-muted-foreground">2 days remaining</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Category Distribution</CardTitle>
            <CardDescription>
              Tenders by category
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-primary"></span>
                  <span className="text-sm">Construction</span>
                </div>
                <span className="text-sm font-medium">38%</span>
              </div>
              <Progress value={38} />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-blue-400"></span>
                  <span className="text-sm">Services</span>
                </div>
                <span className="text-sm font-medium">28%</span>
              </div>
              <Progress value={28} className="bg-muted [&>div]:bg-blue-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-green-400"></span>
                  <span className="text-sm">Goods</span>
                </div>
                <span className="text-sm font-medium">22%</span>
              </div>
              <Progress value={22} className="bg-muted [&>div]:bg-green-400" />
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-3 w-3 rounded-full bg-amber-400"></span>
                  <span className="text-sm">Consulting</span>
                </div>
                <span className="text-sm font-medium">12%</span>
              </div>
              <Progress value={12} className="bg-muted [&>div]:bg-amber-400" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Upcoming Deadlines</CardTitle>
            <CardDescription>
              Tenders closing soon
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">IT Security Audit</p>
                  <p className="text-xs text-muted-foreground">Services • $75,000</p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium text-red-500">3 days</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Office Furniture</p>
                  <p className="text-xs text-muted-foreground">Goods • $42,000</p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-amber-500" />
                  <span className="text-sm font-medium text-amber-500">7 days</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Network Equipment</p>
                  <p className="text-xs text-muted-foreground">Goods • $128,000</p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">12 days</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">Building Renovation</p>
                  <p className="text-xs text-muted-foreground">Construction • $350,000</p>
                </div>
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium text-green-500">15 days</span>
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <a href="#" className="text-sm text-primary hover:underline">View all tenders</a>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
