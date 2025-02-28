// src/components/dashboard/DashboardStats.tsx
'use client';

import { 
  ChevronUp, 
  ChevronDown,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Youtube,
  Image as ImageIcon,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DashboardStatsProps {
  stats: {
    total: number;
    completed: number;
    failed: number;
    pending: number;
  };
  jobsByType: Record<string, number>;
}

export default function DashboardStats({ stats, jobsByType }: DashboardStatsProps) {
  // Calculate completion rate
  const completionRate = stats.total > 0 
    ? Math.round((stats.completed / stats.total) * 100) 
    : 0;
  
  // Track if completion rate is up or down (in a real app, this would compare to previous period)
  const isUp = true;
  
  // Generate job type tiles with proper icons
  const jobTypeCards = [
    {
      type: 'web_scraping',
      label: 'Web Scraping',
      icon: Globe,
      count: jobsByType['web_scraping'] || 0,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      type: 'youtube_download',
      label: 'YouTube',
      icon: Youtube,
      count: jobsByType['youtube_download'] || 0,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
    },
    {
      type: 'text_to_image',
      label: 'Image Generation',
      icon: ImageIcon,
      count: (jobsByType['text_to_image'] || 0) + (jobsByType['image_to_image'] || 0),
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
    {
      type: 'content_processing',
      label: 'Content Processing',
      icon: FileText,
      count: jobsByType['content_processing'] || 0,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
  ];
  
  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
          <Activity className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            All time job count
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
          {isUp ? (
            <ChevronUp className="h-4 w-4 text-green-500" />
          ) : (
            <ChevronDown className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completionRate}%</div>
          <p className="text-xs text-muted-foreground">
            {isUp ? '+2%' : '-2%'} from last period
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
          <Clock className="h-4 w-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            Jobs in progress or pending
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Job Status</CardTitle>
          <div className="flex space-x-1">
            <CheckCircle className="h-4 w-4 text-green-500" />
            <XCircle className="h-4 w-4 text-red-500" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center">
            <div className="text-sm font-medium">Completed: <span className="text-green-500">{stats.completed}</span></div>
            <div className="text-sm font-medium">Failed: <span className="text-red-500">{stats.failed}</span></div>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-100 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-green-300" 
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Job type distribution tiles */}
      {jobTypeCards.map((jobType) => (
        <Card key={jobType.type} className="md:col-span-2 lg:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{jobType.label}</CardTitle>
            <jobType.icon className={`h-4 w-4 ${jobType.color}`} />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{jobType.count}</div>
            <div className={`flex items-center mt-2 ${jobType.bgColor} ${jobType.color} text-xs px-2 py-1 rounded-full w-fit`}>
              {Math.round((jobType.count / Math.max(stats.total, 1)) * 100)}% of total
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
}