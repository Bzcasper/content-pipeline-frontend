'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormItem, 
  FormLabel, 
  FormMessage,
  FormDescription
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

// Schema for the form validation
const youtubeSchema = z.object({
  video_url: z.string()
    .url({ message: 'Please enter a valid URL' })
    .refine(
      (url) => url.includes('youtube.com') || url.includes('youtu.be'),
      { message: 'Must be a YouTube URL' }
    ),
  transcribe: z.boolean().default(true),
  extract_audio_only: z.boolean().default(true),
});

type YouTubeFormValues = z.infer<typeof youtubeSchema>;

interface YouTubeFormProps {
  onSuccess?: (jobId: string) => void;
}

export default function YouTubeForm({ onSuccess }: YouTubeFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<YouTubeFormValues>({
    resolver: zodResolver(youtubeSchema),
    defaultValues: {
      video_url: '',
      transcribe: true,
      extract_audio_only: true,
    },
  });

  async function onSubmit(data: YouTubeFormValues) {
    try {
      setIsSubmitting(true);
      
      const response = await apiClient.downloadYouTube({
        video_url: data.video_url,
        transcribe: data.transcribe,
        extract_audio_only: data.extract_audio_only,
      });
      
      toast({
        title: 'YouTube download job created',
        description: `Job ID: ${response.job_id}`,
      });
      
      if (onSuccess) {
        onSuccess(response.job_id);
      } else {
        router.push(`/jobs/${response.job_id}`);
      }
    } catch (error) {
      console.error('Error creating YouTube download job:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create YouTube download job',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>YouTube Downloader</CardTitle>
            <CardDescription>
              Download and transcribe YouTube videos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel>YouTube URL</FormLabel>
              <FormControl>
                <Input
                  placeholder="https://www.youtube.com/watch?v=..."
                  {...form.register("video_url")}
                />
              </FormControl>
              <FormDescription>
                Enter the full URL of the YouTube video
              </FormDescription>
              <FormMessage id="video_url" />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Transcribe Audio</FormLabel>
                  <FormDescription>
                    Generate text transcript from the audio
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    {...form.register("transcribe")}
                    checked={form.watch("transcribe")}
                  />
                </FormControl>
              </FormItem>

              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Extract Audio Only</FormLabel>
                  <FormDescription>
                    Save only the audio track (MP3)
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    {...form.register("extract_audio_only")}
                    checked={form.watch("extract_audio_only")}
                  />
                </FormControl>
              </FormItem>
            </div>
          </CardContent>
        </Card>

        <Button
          type="submit"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Processing...' : 'Download & Process'}
        </Button>
      </form>
    </Form>
  );
}
