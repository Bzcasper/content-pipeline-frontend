'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { JobStatusResponse } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  MoreVertical, 
  RefreshCw, 
  XCircle, 
  ExternalLink, 
  Trash2
} from 'lucide-react';
import JobStatusBadge from './JobStatusBadge';

interface JobListProps {
  jobs: JobStatusResponse[];
  onRefresh: () => void;
}

export default function JobList({ jobs, onRefresh }: JobListProps) {
  const router = useRouter();
  const [sortBy, setSortBy] = useState<keyof JobStatusResponse>('updated_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedJobs = [...jobs].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sortOrder === 'asc' 
        ? valueA.localeCompare(valueB) 
        : valueB.localeCompare(valueA);
    }

    // Fallback for non-string values
    return sortOrder === 'asc'
      ? String(valueA).localeCompare(String(valueB))
      : String(valueB).localeCompare(String(valueA));
  });

  function toggleSort(column: keyof JobStatusResponse) {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  }

  function formatJobType(type: string) {
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  function viewJobDetails(jobId: string) {
    router.push(`/jobs/${jobId}`);
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="w-[100px] cursor-pointer"
              onClick={() => toggleSort('status')}
            >
              Status {sortBy === 'status' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('job_type')}
            >
              Type {sortBy === 'job_type' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead>Parameters</TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('created_at')}
            >
              Created {sortBy === 'created_at' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => toggleSort('updated_at')}
            >
              Updated {sortBy === 'updated_at' && (sortOrder === 'asc' ? '↑' : '↓')}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedJobs.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                No jobs found
              </TableCell>
            </TableRow>
          ) : (
            sortedJobs.map((job) => (
              <TableRow key={job.job_id} className="hover:bg-muted/50">
                <TableCell>
                  <JobStatusBadge status={job.status} />
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-mono">
                    {formatJobType(job.job_type)}
                  </Badge>
                </TableCell>
                <TableCell>
                  {job.job_type === 'web_scraping' && (
                    <span>
                      {job.parameters.targets?.length} target{job.parameters.targets?.length !== 1 ? 's' : ''}
                    </span>
                  )}
                  {job.job_type === 'content_processing' && (
                    <span>
                      File: {job.parameters.source_file?.split('/').pop() || 'Unknown'}
                    </span>
                  )}
                  {job.job_type === 'youtube_download' && (
                    <span className="truncate max-w-[200px] inline-block">
                      {job.parameters.video_url || 'Unknown URL'}
                    </span>
                  )}
                  {job.job_type === 'text_to_image' && (
                    <span className="truncate max-w-[200px] inline-block">
                      Prompt: "{job.parameters.prompt?.substring(0, 30)}..."
                    </span>
                  )}
                  {job.job_type === 'image_to_image' && (
                    <span className="truncate max-w-[200px] inline-block">
                      Prompt: "{job.parameters.prompt?.substring(0, 30)}..."
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(job.created_at), { addSuffix: true })}
                </TableCell>
                <TableCell>
                  {formatDistanceToNow(new Date(job.updated_at), { addSuffix: true })}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Actions</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => viewJobDetails(job.job_id)}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {/* Future: Add ability to delete jobs */}
                      {/* <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
