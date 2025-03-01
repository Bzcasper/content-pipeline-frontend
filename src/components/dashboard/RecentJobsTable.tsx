// src/components/dashboard/RecentJobsTable.tsx
'use client';

import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

type JobStatus = 'completed' | 'running' | 'failed' | 'queued';

type Job = {
  id: string;
  name: string;
  type: string;
  status: JobStatus;
  createdAt: Date;
  duration?: string;
};

const getStatusColor = (status: JobStatus) => {
  switch (status) {
    case 'completed': return 'bg-green-500';
    case 'running': return 'bg-blue-500';
    case 'failed': return 'bg-red-500';
    case 'queued': return 'bg-yellow-500';
  }
};

export function RecentJobsTable() {
  // This would come from an API in a real implementation
  const recentJobs: Job[] = [
    {
      id: 'job-1234',
      name: 'Blog Post Generation',
      type: 'Content',
      status: 'completed',
      createdAt: new Date('2025-02-27T14:30:00'),
      duration: '2m 34s',
    },
    {
      id: 'job-1235',
      name: 'Product Images',
      type: 'Image',
      status: 'running',
      createdAt: new Date('2025-02-28T09:15:00'),
    },
    {
      id: 'job-1236',
      name: 'Tech News Scraping',
      type: 'Scraping',
      status: 'queued',
      createdAt: new Date('2025-02-28T10:00:00'),
    },
    {
      id: 'job-1237',
      name: 'YouTube Video Analysis',
      type: 'Media',
      status: 'failed',
      createdAt: new Date('2025-02-27T18:45:00'),
      duration: '1m 12s',
    },
    {
      id: 'job-1238',
      name: 'Newsletter Generation',
      type: 'Content',
      status: 'completed',
      createdAt: new Date('2025-02-27T11:20:00'),
      duration: '3m 45s',
    },
  ];

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Created</TableHead>
          <TableHead>Duration</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recentJobs.map((job) => (
          <TableRow key={job.id}>
            <TableCell className="font-medium">{job.name}</TableCell>
            <TableCell>{job.type}</TableCell>
            <TableCell>
              <Badge variant="outline" className={getStatusColor(job.status)}>
                {job.status.charAt(0).toUpperCase() + job.status.slice(1)}
              </Badge>
            </TableCell>
            <TableCell>{job.createdAt.toLocaleString()}</TableCell>
            <TableCell>{job.duration || '-'}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
