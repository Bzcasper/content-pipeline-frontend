// src/app/dashboard/page.tsx
'use client';

import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { DashboardActions } from '@/components/dashboard/DashboardActions';
import { RecentJobsTable } from '@/components/dashboard/RecentJobsTable';
import { ContentOverview } from '@/components/dashboard/ContentOverview';
import { PlatformPerformance } from '@/components/dashboard/PlatformPerformance';

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <DashboardActions />
      <DashboardStats />
      <h2 className="text-xl font-semibold mt-8 mb-2">Recent Jobs</h2>
      <RecentJobsTable />
      <h2 className="text-xl font-semibold mt-8 mb-2">Content Overview</h2>
      <ContentOverview />
      <h2 className="text-xl font-semibold mt-8 mb-2">Platform Performance</h2>
      <PlatformPerformance />
    </div>
  );
}
