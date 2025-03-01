'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { JobStatusResponse } from '@/lib/types';
import JobList from '@/components/jobs/JobList';
import DashboardStats from '@/components/dashboard/DashboardStats';
import DashboardActions from '@/components/dashboard/DashboardActions';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function DashboardPage() {
  const router = useRouter();
  const [jobs, setJobs] = useState<JobStatusResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetchJobs();

    // Set up polling for job updates
    const intervalId = setInterval(fetchJobs, 30000); // Poll every 30 seconds

    return () => clearInterval(intervalId);
  }, []);

  async function fetchJobs() {
    try {
      setLoading(true);
      const response = await apiClient.listJobs();
      setJobs(response.jobs);
      setError(null);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }

  // Calculate stats
  const stats = {
    total: jobs.length,
    completed: jobs.filter(job => job.status === 'completed').length,
    failed: jobs.filter(job => job.status === 'failed').length,
    pending: jobs.filter(job => ['pending', 'processing'].includes(job.status)).length
  };

  // Get job distribution by type
  const jobsByType = jobs.reduce((acc, job) => {
    acc[job.job_type] = (acc[job.job_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Content Pipeline Dashboard</h1>
        <Button onClick={() => router.refresh()}>Refresh</Button>
      </div>

      {error && (
        <Alert variant="destructive" className="mb-8">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="jobs">Jobs</TabsTrigger>
          <TabsTrigger value="actions">New Job</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {loading ? (
              Array(4).fill(0).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <Skeleton className="h-8 w-40 mb-2" />
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              <DashboardStats stats={stats} jobsByType={jobsByType} />
            )}
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Recent Jobs</h2>
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ) : (
              <JobList jobs={jobs.slice(0, 5)} onRefresh={fetchJobs} />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="jobs">
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">All Jobs</h2>
            {loading ? (
              <Card>
                <CardContent className="p-6">
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-12 w-full mb-4" />
                  <Skeleton className="h-12 w-full" />
                </CardContent>
              </Card>
            ) : (
              <JobList jobs={jobs} onRefresh={fetchJobs} />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="actions">
          <DashboardActions onJobCreated={fetchJobs} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
