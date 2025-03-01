// src/components/dashboard/DashboardActions.tsx
'use client';

import { PlusCircle, Upload, FileText, Image, Globe, Youtube } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export function DashboardActions() {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm">
        <Upload className="mr-2 h-4 w-4" />
        Export Data
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="sm">
            <PlusCircle className="mr-2 h-4 w-4" />
            New Job
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Create New</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <FileText className="mr-2 h-4 w-4" />
            Article Generation
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Image className="mr-2 h-4 w-4" />
            Image Creation
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Globe className="mr-2 h-4 w-4" />
            Web Scraping Task
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Youtube className="mr-2 h-4 w-4" />
            Video Processing
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
