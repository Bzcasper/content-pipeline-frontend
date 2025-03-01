// src/components/dashboard/ContentOverview.tsx
'use client';

import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

type ContentType = {
  name: string;
  value: number;
  color: string;
};

export function ContentOverview({ detailed = false }: { detailed?: boolean }) {
  const [activeIndex, setActiveIndex] = useState<number | undefined>();
  
  // Example data - in a real app, fetch this from an API
  const data: ContentType[] = [
    { name: 'Blog Posts', value: 45, color: '#8884d8' },
    { name: 'Images', value: 30, color: '#82ca9d' },
    { name: 'Videos', value: 15, color: '#ffc658' },
    { name: 'Social Media', value: 10, color: '#ff8042' }
  ];

  return (
    <div className="w-full h-full">
      <ResponsiveContainer width="100%" height={detailed ? 400 : 300}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={detailed ? 80 : 60}
            outerRadius={detailed ? 120 : 80}
            fill="#8884d8"
            paddingAngle={5}
            dataKey="value"
            onMouseEnter={(_, index) => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(undefined)}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.color}
                stroke={activeIndex === index ? '#fff' : 'transparent'}
                strokeWidth={2}
              />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}%`, 'Content Share']} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      
      {detailed && (
        <div className="grid grid-cols-2 gap-4 mt-8">
          {data.map((type) => (
            <div key={type.name} className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: type.color }} />
                <span>{type.name}</span>
              </div>
              <span className="font-bold">{type.value}%</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
