// src/components/jobs/JobParametersView.tsx
'use client';

import { JobStatusResponse } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Globe, Youtube, Image, FileText } from 'lucide-react';

interface JobParametersViewProps {
  job: JobStatusResponse;
}

export default function JobParametersView({ job }: JobParametersViewProps) {
  if (!job || !job.parameters) {
    return <div>No parameters available</div>;
  }

  // Helper function to render different types of parameters
  const renderParameter = (key: string, value: any) => {
    // Handle nested objects
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      return (
        <div className="space-y-2">
          {Object.entries(value).map(([nestedKey, nestedValue]) => (
            <div key={nestedKey} className="pl-4 border-l-2 border-gray-200">
              <span className="font-medium">{formatKey(nestedKey)}: </span>
              {renderValue(nestedValue)}
            </div>
          ))}
        </div>
      );
    }
    
    // Handle arrays
    if (Array.isArray(value)) {
      if (key === 'targets' && job.job_type === 'web_scraping') {
        return (
          <div className="space-y-4">
            {value.map((target, index) => (
              <div key={index} className="border rounded-md p-3">
                <div className="flex items-center mb-2">
                  <Globe className="h-4 w-4 mr-2 text-blue-500" />
                  <span className="font-medium">Target {index + 1}: </span>
                  <a 
                    href={target.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="ml-2 text-blue-500 hover:underline truncate max-w-[300px]"
                  >
                    {target.url}
                  </a>
                </div>
                {target.selectors && (
                  <div className="grid grid-cols-3 gap-2 mt-2 text-sm">
                    {Object.entries(target.selectors).map(([selectorKey, selectorValue]) => (
                      <div key={selectorKey}>
                        <span className="font-medium">{formatKey(selectorKey)}: </span>
                        {renderValue(selectorValue)}
                      </div>
                    ))}
                  </div>
                )}
                {target.max_pages && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">Max Pages: </span>
                    {target.max_pages}
                  </div>
                )}
              </div>
            ))}
          </div>
        );
      }
      
      return (
        <div>
          {value.map((item: any, index: number) => (
            <div key={index} className="mb-1">
              {renderValue(item)}
            </div>
          ))}
        </div>
      );
    }
    
    // Handle basic values
    return renderValue(value);
  };
  
  // Helper function to render different value types
  const renderValue = (value: any) => {
    if (value === null || value === undefined) {
      return <span className="text-gray-400">null</span>;
    }
    
    if (typeof value === 'boolean') {
      return (
        <Badge variant={value ? 'default' : 'outline'}>
          {value ? 'Enabled' : 'Disabled'}
        </Badge>
      );
    }
    
    if (typeof value === 'string') {
      // Check if it's a URL
      if (value.startsWith('http')) {
        return (
          <a 
            href={value} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline truncate max-w-[300px] inline-block"
          >
            {value}
          </a>
        );
      }
      
      // If it's a long string, truncate it
      if (value.length > 100) {
        return <span title={value}>{value.substring(0, 100)}...</span>;
      }
      
      return <span>{value}</span>;
    }
    
    return <span>{String(value)}</span>;
  };
  
  // Format parameter keys for display
  const formatKey = (key: string) => {
    return key
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };
  
  // Get job type icon
  const getJobTypeIcon = () => {
    switch (job.job_type) {
      case 'web_scraping':
        return <Globe className="h-5 w-5 text-blue-500" />;
      case 'youtube_download':
        return <Youtube className="h-5 w-5 text-red-500" />;
      case 'text_to_image':
      case 'image_to_image':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'content_processing':
        return <FileText className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center mb-4">
        {getJobTypeIcon()}
        <h3 className="text-lg font-medium ml-2">
          {job.job_type.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Parameters
        </h3>
      </div>
      
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Parameter</TableHead>
            <TableHead>Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.entries(job.parameters).map(([key, value]) => (
            <TableRow key={key}>
              <TableCell className="font-medium">{formatKey(key)}</TableCell>
              <TableCell>{renderParameter(key, value)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}