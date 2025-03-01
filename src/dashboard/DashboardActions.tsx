'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Globe, Youtube, Image as ImageIcon } from 'lucide-react';
import WebScrapingForm from '@/components/forms/web-scraping-form';
import YouTubeForm from '@/components/forms/youtube-form';
import TextToImageForm from '@/components/forms/text-to-image-form';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

interface DashboardActionsProps {
  onJobCreated?: (jobId: string) => void;
}

export default function DashboardActions({ onJobCreated }: DashboardActionsProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('web-scraping');

  const handleJobCreated = (jobId: string) => {
    toast({
      title: 'Job created successfully',
      description: `Job ID: ${jobId}`,
    });

    if (onJobCreated) {
      onJobCreated(jobId);
    }

    // Navigate to job details page
    router.push(`/jobs/${jobId}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Job</CardTitle>
        <CardDescription>
          Choose a job type to run on the content pipeline
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="web-scraping" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="web-scraping" className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              Web Scraping
            </TabsTrigger>
            <TabsTrigger value="youtube" className="flex items-center">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube
            </TabsTrigger>
            <TabsTrigger value="image-gen" className="flex items-center">
              <ImageIcon className="h-4 w-4 mr-2" />
              Image Generation
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="web-scraping">
            <WebScrapingForm onSuccess={handleJobCreated} />
          </TabsContent>
          
          <TabsContent value="youtube">
            <YouTubeForm onSuccess={handleJobCreated} />
          </TabsContent>
          
          <TabsContent value="image-gen">
            <TextToImageForm onSuccess={handleJobCreated} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}