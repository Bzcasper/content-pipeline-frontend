'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';
import { useJobStatus } from '@/lib/hooks/use-job-status';
import { JobStatusResponse } from '@/lib/types';
import { formatDistanceToNow, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ArrowLeft,
  AlertCircle,
  Clock,
  PlayCircle,
  StopCircle,
  RefreshCw
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import JobStatusBadge from '@/components/jobs/JobStatusBadge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import JobResultView from '@/components/jobs/JobResultView';
import JobParametersView from '@/components/jobs/JobParametersView';

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params.id as string;
  
  const {
    status: job,
    loading,
    error,
    polling,
    startPolling,
    stopPolling,
    refresh
  } = useJobStatus(jobId, {
    pollInterval: 3000,
    autoStart: true
  });

  // Handle job loading error
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => router.back()}
            className="mr-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Job Details</h1>
        </div>
        
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {error.message}
          </AlertDescription>
        </Alert>
        
        <div className="mt-6">
          <Button onClick={refresh}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => router.back()}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-3xl font-bold">Job Details</h1>
      </div>
      
      {loading && !job ? (
        <div className="space-y-4">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      ) : job ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Status</CardTitle>
                <CardDescription>Current job status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <JobStatusBadge status={job.status} size="lg" />
                  {(job.status === 'pending' || job.status === 'processing') && (
                    <div className="ml-auto">
                      {polling ? (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => stopPolling()}
                        >
                          <StopCircle className="mr-2 h-4 w-4" />
                          Stop Polling
                        </Button>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => startPolling()}
                        >
                          <PlayCircle className="mr-2 h-4 w-4" />
                          Start Polling
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Type</CardTitle>
                <CardDescription>Job type and ID</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-medium">
                  {job.job_type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                </div>
                <div className="text-sm text-muted-foreground font-mono mt-1">
                  {job.job_id}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Timing</CardTitle>
                <CardDescription>Job creation and update times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center mb-2">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Created:</div>
                    <div className="font-medium">
                      {format(new Date(job.created_at), 'PPpp')}
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="text-sm text-muted-foreground">Last Updated:</div>
                    <div className="font-medium">
                      {format(new Date(job.updated_at), 'PPpp')}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="parameters">
            <TabsList>
              <TabsTrigger value="parameters">Parameters</TabsTrigger>
              <TabsTrigger value="results">Results</TabsTrigger>
              <TabsTrigger value="json">Raw JSON</TabsTrigger>
            </TabsList>
            
            <TabsContent value="parameters" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Parameters</CardTitle>
                  <CardDescription>
                    Parameters used for this job
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <JobParametersView 
                    job={job}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="results" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Job Results</CardTitle>
                  <CardDescription>
                    Output and results from the job
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {job.status !== 'completed' ? (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground mb-2">
                        Results will appear here when the job is completed
                      </div>
                      {job.status === 'pending' || job.status === 'processing' ? (
                        <div className="animate-pulse flex justify-center">
                          <RefreshCw className="h-8 w-8 text-muted-foreground" />
                        </div>
                      ) : job.status === 'failed' && job.error ? (
                        <Alert variant="destructive">
                          <AlertCircle className="h-4 w-4" />
                          <AlertTitle>Job Failed</AlertTitle>
                          <AlertDescription>{job.error}</AlertDescription>
                        </Alert>
                      ) : null}
                    </div>
                  ) : (
                    <JobResultView job={job} />
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="json" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Raw JSON</CardTitle>
                  <CardDescription>
                    Complete job data in JSON format
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[500px]">
                    {JSON.stringify(job, null, 2)}
                  </pre>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : null}
    </div>
  );
}
