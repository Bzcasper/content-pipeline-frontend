'use client';

import { JobStatus } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Clock, RefreshCw, XCircle } from 'lucide-react';

interface JobStatusBadgeProps {
  status: JobStatus;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function JobStatusBadge({ 
  status, 
  showIcon = true,
  size = 'md' 
}: JobStatusBadgeProps) {
  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  const iconSize = {
    sm: 12,
    md: 14,
    lg: 16
  };

  const statusConfig = {
    pending: {
      label: 'Pending',
      variant: 'outline' as const,
      icon: Clock,
      iconColor: 'text-yellow-500'
    },
    processing: {
      label: 'Processing',
      variant: 'secondary' as const,
      icon: RefreshCw,
      iconColor: 'text-blue-500'
    },
    completed: {
      label: 'Completed',
      variant: 'default' as const,
      icon: CheckCircle,
      iconColor: 'text-green-500'
    },
    failed: {
      label: 'Failed',
      variant: 'destructive' as const,
      icon: XCircle,
      iconColor: 'text-red-500'
    }
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Badge variant={config.variant} className={`${sizeClasses[size]} font-medium`}>
      {showIcon && (
        <Icon 
          className={`${config.iconColor} mr-1`}
          size={iconSize[size]} 
        />
      )}
      {config.label}
    </Badge>
  );
}
