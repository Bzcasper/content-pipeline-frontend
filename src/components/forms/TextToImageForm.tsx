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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { apiClient } from '@/lib/api-client';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/ui/use-toast';

// Schema for the form validation
const textToImageSchema = z.object({
  prompt: z.string().min(3, { message: 'Prompt must be at least 3 characters' }),
  negative_prompt: z.string().optional(),
  width: z.number().int().min(256).max(1024),
  height: z.number().int().min(256).max(1024),
  num_inference_steps: z.number().int().min(10).max(150),
  guidance_scale: z.number().min(1).max(20),
  batch_size: z.number().int().min(1).max(4),
  output_format: z.enum(['png', 'jpg']),
  seed: z.number().int().optional(),
});

type TextToImageFormValues = z.infer<typeof textToImageSchema>;

interface TextToImageFormProps {
  onSuccess?: (jobId: string) => void;
}

export default function TextToImageForm({ onSuccess }: TextToImageFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [useSeed, setUseSeed] = useState(false);

  // Initialize form with default values
  const form = useForm<TextToImageFormValues>({
    resolver: zodResolver(textToImageSchema),
    defaultValues: {
      prompt: '',
      negative_prompt: '',
      width: 512,
      height: 512,
      num_inference_steps: 50,
      guidance_scale: 7.5,
      batch_size: 1,
      output_format: 'png',
      seed: undefined,
    },
  });

  async function onSubmit(data: TextToImageFormValues) {
    try {
      setIsSubmitting(true);
      
      // Only include seed if checkbox is checked
      const params = {
        ...data,
        seed: useSeed ? data.seed : undefined,
      };
      
      const response = await apiClient.generateImageFromText(params);
      
      toast({
        title: 'Image generation job created',
        description: `Job ID: ${response.job_id}`,
      });
      
      if (onSuccess) {
        onSuccess(response.job_id);
      } else {
        router.push(`/jobs/${response.job_id}`);
      }
    } catch (error) {
      console.error('Error creating image generation job:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create image generation job',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  // Helper function to get random seed
  function getRandomSeed() {
    const randomSeed = Math.floor(Math.random() * 2147483647);
    form.setValue('seed', randomSeed);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Text to Image</CardTitle>
            <CardDescription>
              Generate images from text descriptions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormItem>
              <FormLabel>Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the image you want to generate..."
                  {...form.register("prompt")}
                  className="min-h-[100px]"
                />
              </FormControl>
              <FormDescription>
                Detailed description of the image you want to generate
              </FormDescription>
              <FormMessage id="prompt" />
            </FormItem>

            <FormItem>
              <FormLabel>Negative Prompt</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Elements to avoid in the generated image..."
                  {...form.register("negative_prompt")}
                />
              </FormControl>
              <FormDescription>
                Elements you want to exclude from the generated image
              </FormDescription>
              <FormMessage id="negative_prompt" />
            </FormItem>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Width</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      min={256}
                      max={1024}
                      step={64}
                      defaultValue={[512]}
                      value={form.watch("width") ? [form.watch("width")] : [512]}
                      onValueChange={(value) => form.setValue("width", value[0])}
                    />
                  </FormControl>
                  <div className="w-16 text-right font-mono">
                    {form.watch("width")}px
                  </div>
                </div>
                <FormMessage id="width" />
              </FormItem>

              <FormItem>
                <FormLabel>Height</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      min={256}
                      max={1024}
                      step={64}
                      defaultValue={[512]}
                      value={form.watch("height") ? [form.watch("height")] : [512]}
                      onValueChange={(value) => form.setValue("height", value[0])}
                    />
                  </FormControl>
                  <div className="w-16 text-right font-mono">
                    {form.watch("height")}px
                  </div>
                </div>
                <FormMessage id="height" />
              </FormItem>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormItem>
                <FormLabel>Inference Steps</FormLabel>
                <div className="flex items-center space-x-4">
                  <FormControl>
                    <Slider
                      min={10}
                      max={150}
                      step={1}
                      defaultValue={[50]}
                      value={form.watch("num_inference_steps") ? [form.watch("num_inference_steps")] : [50]}
                      onValueChange={(value) => form.setValue("num_inference_steps", value[0])}
                    />
                  </FormControl>
                  <div className="w-10 text-right font-mono">
                    {form.watch("num_inference_steps")}
                  </div>
                </div>
                <FormDescription>
                  More steps = higher quality, slower generation
                  </FormDescription>
                  <FormMessage id="num_inference_steps" />
                </FormItem>

                <FormItem>
                  <FormLabel>Guidance Scale</FormLabel>
                  <div className="flex items-center space-x-4">
                    <FormControl>
                      <Slider
                        min={1}
                        max={20}
                        step={0.1}
                        defaultValue={[7.5]}
                        value={form.watch("guidance_scale") ? [form.watch("guidance_scale")] : [7.5]}
                        onValueChange={(value) => form.setValue("guidance_scale", value[0])}
                      />
                    </FormControl>
                    <div className="w-10 text-right font-mono">
                      {form.watch("guidance_scale")?.toFixed(1)}
                    </div>
                  </div>
                  <FormDescription>
                    How closely to follow the prompt
                  </FormDescription>
                  <FormMessage id="guidance_scale" />
                </FormItem>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormItem>
                  <FormLabel>Batch Size</FormLabel>
                  <Select
                    onValueChange={(value) => form.setValue("batch_size", parseInt(value))}
                    defaultValue="1"
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select batch size" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="1">1 image</SelectItem>
                      <SelectItem value="2">2 images</SelectItem>
                      <SelectItem value="3">3 images</SelectItem>
                      <SelectItem value="4">4 images</SelectItem>
                    </SelectContent>
                    <FormDescription>
                      Number of images to generate per prompt
                    </FormDescription>
                    <FormMessage id="batch_size" />
                  </FormItem>

                  <FormItem>
                    <FormLabel>Output Format</FormLabel>
                    <Select
                      onValueChange={(value) => form.setValue("output_format", value)}
                      defaultValue="png"
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="png">PNG</SelectItem>
                        <SelectItem value="jpg">JPG</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Image file format
                    </FormDescription>
                    <FormMessage id="output_format" />
                  </FormItem>
                </div>

                <Card className="border-dashed">
                  <CardContent className="pt-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <input
                        type="checkbox"
                        id="use-seed"
                        checked={useSeed}
                        onChange={(e) => setUseSeed(e.target.checked)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <label htmlFor="use-seed" className="text-sm font-medium">
                        Use specific seed (for reproducibility)
                      </label>
                    </div>

                    {useSeed && (
                      <div className="flex items-center space-x-4">
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Seed number"
                              {...form.register("seed", { valueAsNumber: true })}
                            />
                          </FormControl>
                          <FormMessage id="seed" />
                        </FormItem>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={getRandomSeed}
                          className="flex-shrink-0"
                        >
                          Random
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </CardContent>
            </Card>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating Job...' : 'Generate Image'}
            </Button>
          </form>
        </Form>
      );
}
