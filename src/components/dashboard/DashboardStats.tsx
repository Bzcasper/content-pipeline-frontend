// src/components/dashboard/DashboardStats.tsx
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Activity, FileText, Image, Upload } from 'lucide-react';

type StatCardProps = {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
  trend?: {
    value: number;
    positive: boolean;
  };
}

const StatCard = ({ title, value, description, icon, trend }: StatCardProps) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {trend && (
        <div className={`flex items-center text-xs mt-1 ${trend.positive ? 'text-green-500' : 'text-red-500'}`}>
          {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% from last week
        </div>
      )}
    </CardContent>
  </Card>
);

export function DashboardStats() {
  // In a real implementation, this data would come from an API call
  const stats = [
    {
      title: 'Total Content',
      value: '842',
      description: 'Articles and media generated',
      icon: <FileText className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 12, positive: true }
    },
    {
      title: 'Active Jobs',
      value: '18',
      description: 'Currently running processes',
      icon: <Activity className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 4, positive: true }
    },
    {
      title: 'Images Generated',
      value: '341',
      description: 'Total AI images created',
      icon: <Image className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 24, positive: true }
    },
    {
      title: 'Content Published',
      value: '625',
      description: 'Published to platforms',
      icon: <Upload className="h-4 w-4 text-muted-foreground" />,
      trend: { value: 8, positive: true }
    }
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.title} {...stat} />
      ))}
    </div>
  );
}
