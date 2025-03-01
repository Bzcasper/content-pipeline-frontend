// src/components/dashboard/PlatformPerformance.tsx
'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function PlatformPerformance() {
  // Example data - in a real app, fetch this from an API
  const data = [
    { platform: 'Website', views: 4000, engagement: 2400 },
    { platform: 'Medium', views: 3000, engagement: 1398 },
    { platform: 'LinkedIn', views: 2000, engagement: 9800 },
    { platform: 'Twitter', views: 2780, engagement: 3908 },
    { platform: 'Facebook', views: 1890, engagement: 4800 },
    { platform: 'Instagram', views: 2390, engagement: 3800 }
  ];

  return (
    <ResponsiveContainer width="100%" height={450}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="platform" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="views" fill="#8884d8" name="Total Views" />
        <Bar dataKey="engagement" fill="#82ca9d" name="Engagement" />
      </BarChart>
    </ResponsiveContainer>
  );
}
