'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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
import { Card, CardContent } from '@/components/ui/card';
import { Trash2, Plus } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

// Schema for the form validation
const scrapingSchema = z.object({
  targets: z.array(
    z.object({
      url: z.string().url({ message: 'Please enter a valid URL' }),
      selectors: z.object({
        title: z.string().optional(),
        content: z.string().optional(),
        date: z.string().optional(),
      }).optional(),
      max_pages: z.number().int().min(1).optional(),
    })
  ).min(1, { message: 'Please add at least one target' }),
});

type ScrapingFormValues = z.infer<typeof scrapingSchema>;

interface WebScrapingFormProps {
  onSuccess?: (jobId: string) => void;
}

export default function WebScrapingForm({ onSuccess }: WebScrapingFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form with default values
  const form = useForm<ScrapingFormValues>({
    resolver: zodResolver(scrapingSchema),
    defaultValues: {
      targets: [
        { 
          url: '',
          selectors: {
            title: 'h1',
            content: 'article',
            date: 'time',
          },
          max_pages: 1,
        }
      ],
    },
  });

  // Use field array for dynamic targets
  const { fields, append, remove } = useFieldArray({
    name: 'targets',
    control: form.control,
  });

  async function onSubmit(data: ScrapingFormValues) {
    try {
      setIsSubmitting(true);
      
      const response = await apiClient.scrapeWebsites(data.targets);
      
      toast({
        title: 'Scraping job created',
        description: `Job ID: ${response.job_id}`,
      });
      
      if (onSuccess) {
        onSuccess(response.job_id);
      } else {
        router.push(`/jobs/${response.job_id}`);
      }
    } catch (error) {
      console.error('Error creating scraping job:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create scraping job',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  function addNewTarget() {
    append({ 
      url: '',
      selectors: {
        title: 'h1',
        content: 'article',
        date: 'time',
      },
      max_pages: 1,
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Target {index + 1}</h3>
                  {fields.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="grid gap-4">
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="https://example.com" 
                        {...form.register(`targets.${index}.url`)} 
                      />
                    </FormControl>
                    <FormMessage id={`targets.${index}.url`} />
                  </FormItem>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormItem>
                      <FormLabel>Title Selector</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="h1" 
                          {...form.register(`targets.${index}.selectors.title`)} 
                        />
                      </FormControl>
                      <FormDescription>
                        CSS selector for title
                      </FormDescription>
                      <FormMessage id={`targets.${index}.selectors.title`} />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Content Selector</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="article" 
                          {...form.register(`targets.${index}.selectors.content`)} 
                        />
                      </FormControl>
                      <FormDescription>
                        CSS selector for content
                      </FormDescription>
                      <FormMessage id={`targets.${index}.selectors.content`} />
                    </FormItem>

                    <FormItem>
                      <FormLabel>Date Selector</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="time" 
                          {...form.register(`targets.${index}.selectors.date`)} 
                        />
                      </FormControl>
                      <FormDescription>
                        CSS selector for date
                      </FormDescription>
                      <FormMessage id={`targets.${index}.selectors.date`} />
                    </FormItem>
                  </div>

                  <FormItem>
                    <FormLabel>Max Pages</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min={1}
                        {...form.register(`targets.${index}.max_pages`, { valueAsNumber: true })}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum number of pages to scrape
                    </FormDescription>
                    <FormMessage id={`targets.${index}.max_pages`} />
                  </FormItem>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          onClick={addNewTarget}
          className="w-full"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Another Target
        </Button>

        <Button 
          type="submit" 
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Creating Job...' : 'Start Scraping'}
        </Button>
      </form>
    </Form>
  );
}
