'use client';

import { JobStatusResponse } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';
import { 
  FileText, 
  Link, 
  Clock, 
  Youtube, 
  Image as ImageIcon,
  Copy
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface JobResultViewProps {
  job: JobStatusResponse;
}

export default function JobResultView({ job }: JobResultViewProps) {
  const { toast } = useToast();
  
  // Function to copy text to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: 'Copied to clipboard',
      description: 'The text has been copied to your clipboard.',
    });
  };

  // Helper function to format text for display
  const formatText = (text: string) => {
    return text.split('\n').map((line, i) => (
      <span key={i}>
        {line}
        <br />
      </span>
    ));
  };

  if (!job || !job.results) {
    return <div>No results available</div>;
  }

  // Handle web scraping results
  if (job.job_type === 'web_scraping') {
    const results = job.results.results || [];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Scraped {results.length} target{results.length !== 1 ? 's' : ''}
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(results, null, 2))}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Results
          </Button>
        </div>
        
        {results.map((result: any, index: number) => (
          <div key={index} className="border rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <Link className="mr-2 h-4 w-4 text-blue-500" />
                <a 
                  href={result.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline truncate max-w-[300px]"
                >
                  {result.url}
                </a>
              </div>
              <Badge variant="outline">
                <Clock className="mr-1 h-3 w-3" />
                {format(new Date(result.timestamp), 'MMM d, yyyy HH:mm')}
              </Badge>
            </div>
            
            {result.data && (
              <div className="mt-4 space-y-2">
                {result.data.title && (
                  <div>
                    <span className="font-medium">Title:</span> {result.data.title}
                  </div>
                )}
                {result.data.content && (
                  <div>
                    <span className="font-medium">Content:</span>{' '}
                    <span className="text-sm">
                      {result.data.content.length > 200
                        ? `${result.data.content.substring(0, 200)}...`
                        : result.data.content}
                    </span>
                  </div>
                )}
                {result.data.date && (
                  <div>
                    <span className="font-medium">Date:</span> {result.data.date}
                  </div>
                )}
              </div>
            )}
            
            {result.error && (
              <div className="mt-2 text-red-500">
                Error: {result.error}
              </div>
            )}
          </div>
        ))}
      </div>
    );
  }
  
  // Handle content processing results
  if (job.job_type === 'content_processing') {
    const analysisResults = job.results.analyses || {};
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            Content Analysis Results
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(analysisResults, null, 2))}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Results
          </Button>
        </div>
        
        <Tabs defaultValue="summaries">
          <TabsList>
            {analysisResults.summaries && (
              <TabsTrigger value="summaries">Summaries</TabsTrigger>
            )}
            {analysisResults.sentiments && (
              <TabsTrigger value="sentiments">Sentiment</TabsTrigger>
            )}
            {analysisResults.embeddings && (
              <TabsTrigger value="embeddings">Embeddings</TabsTrigger>
            )}
          </TabsList>
          
          {analysisResults.summaries && (
            <TabsContent value="summaries" className="mt-4 space-y-4">
              {analysisResults.summaries.map((summary: string, index: number) => (
                <div key={index} className="border rounded-md p-4">
                  <div className="flex justify-between mb-1">
                    <h4 className="font-medium">Summary {index + 1}</h4>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => copyToClipboard(summary)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="text-sm">{formatText(summary)}</p>
                </div>
              ))}
            </TabsContent>
          )}
          
          {analysisResults.sentiments && (
            <TabsContent value="sentiments" className="mt-4">
              <div className="border rounded-md p-4">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">#</th>
                      <th className="text-left py-2">Label</th>
                      <th className="text-left py-2">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {analysisResults.sentiments.map((sentiment: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="py-2">{index + 1}</td>
                        <td className="py-2">
                          <Badge 
                            variant={sentiment.label === 'POSITIVE' ? 'default' : 'destructive'}
                          >
                            {sentiment.label}
                          </Badge>
                        </td>
                        <td className="py-2">
                          {(sentiment.score * 100).toFixed(2)}%
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          )}
          
          {analysisResults.embeddings && (
            <TabsContent value="embeddings" className="mt-4">
              <div className="border rounded-md p-4">
                <p className="mb-4">
                  Generated {analysisResults.embeddings.length} embeddings with dimension {analysisResults.embeddings[0]?.length || 0}
                </p>
                <div className="bg-muted text-xs p-2 rounded-md overflow-auto max-h-60">
                  <pre>{JSON.stringify(analysisResults.embeddings, null, 2)}</pre>
                </div>
              </div>
            </TabsContent>
          )}
        </Tabs>
      </div>
    );
  }
  
  // Handle YouTube download results
  if (job.job_type === 'youtube_download') {
    const result = job.results.result || {};
    const transcription = result.transcription || {};
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            YouTube Download Results
          </h3>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => copyToClipboard(JSON.stringify(result, null, 2))}
          >
            <Copy className="mr-2 h-4 w-4" />
            Copy Results
          </Button>
        </div>
        
        <div className="border rounded-md p-4">
          <div className="flex items-center mb-4">
            <Youtube className="mr-2 h-5 w-5 text-red-500" />
            <a 
              href={result.video_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              {result.title || result.video_url}
            </a>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Video Details</h4>
              <div className="space-y-1 text-sm">
                <div><span className="font-medium">Duration:</span> {result.duration ? `${result.duration} seconds` : 'Unknown'}</div>
                <div><span className="font-medium">Video ID:</span> {result.video_id || 'Unknown'}</div>
                <div><span className="font-medium">Downloaded:</span> {result.audio_path ? 'Yes (Audio)' : result.video_path ? 'Yes (Video)' : 'No'}</div>
              </div>
            </div>
            
            {transcription && transcription.segments && (
              <div>
                <h4 className="font-medium mb-2">Transcription</h4>
                <div className="text-sm">
                  <div><span className="font-medium">Segments:</span> {transcription.segments.length}</div>
                  <div className="mt-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => copyToClipboard(transcription.text || '')}
                    >
                      <Copy className="mr-2 h-3 w-3" />
                      Copy Full Text
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          
          {transcription && transcription.text && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Transcript Preview</h4>
              <div className="max-h-60 overflow-y-auto p-3 bg-muted rounded-md text-sm">
                {formatText(transcription.text)}
              </div>
            </div>
          )}
          
          {transcription && transcription.segments && (
            <div className="mt-6">
              <h4 className="font-medium mb-2">Segments Timeline</h4>
              <div className="max-h-60 overflow-y-auto border rounded-md">
                <table className="w-full">
                  <thead>
                    <tr className="border-b bg-muted">
                      <th className="px-3 py-2 text-left text-xs">#</th>
                      <th className="px-3 py-2 text-left text-xs">Time</th>
                      <th className="px-3 py-2 text-left text-xs">Text</th>
                    </tr>
                  </thead>
                  <tbody>
                    {transcription.segments.slice(0, 20).map((segment: any, index: number) => (
                      <tr key={index} className="border-b">
                        <td className="px-3 py-2 text-xs">{index + 1}</td>
                        <td className="px-3 py-2 text-xs whitespace-nowrap">
                          {segment.start.toFixed(1)}s - {segment.end.toFixed(1)}s
                        </td>
                        <td className="px-3 py-2 text-xs">
                          {segment.text}
                        </td>
                      </tr>
                    ))}
                    {transcription.segments.length > 20 && (
                      <tr>
                        <td colSpan={3} className="px-3 py-2 text-xs text-center">
                          {transcription.segments.length - 20} more segments not shown
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Handle image generation results
  if (job.job_type === 'text_to_image' || job.job_type === 'image_to_image') {
    const result = job.results.result || {};
    const images = result.image_data || [];
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">
            {job.job_type === 'text_to_image' ? 'Text to Image' : 'Image to Image'} Results
          </h3>
          <Badge variant="outline">
            {result.timestamp || 'Unknown date'}
          </Badge>
        </div>
        
        <div className="border rounded-md p-4">
          <h4 className="font-medium mb-2">Prompt</h4>
          <div className="p-3 bg-muted rounded-md mb-4">
            {result.prompt || 'No prompt provided'}
          </div>
          
          {result.parameters && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
              <div><span className="font-medium">Steps:</span> {result.parameters.num_inference_steps || 'N/A'}</div>
              <div><span className="font-medium">Guidance:</span> {result.parameters.guidance_scale || 'N/A'}</div>
              <div><span className="font-medium">Seed:</span> {result.parameters.seed || 'Random'}</div>
              {job.job_type === 'image_to_image' && (
                <div><span className="font-medium">Strength:</span> {result.parameters.strength || 'N/A'}</div>
              )}
            </div>
          )}
          
          <h4 className="font-medium mb-3">Generated Images ({images.length})</h4>
          {images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((imageData: string, index: number) => (
                <div key={index} className="border rounded-md p-2">
                  <div className="aspect-square relative">
                    <Image
                      src={`data:image/${result.parameters?.output_format || 'png'};base64,${imageData}`}
                      alt={`Generated image ${index + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="text-sm text-muted-foreground">Image {index + 1}</div>
                    <a 
                      href={`data:image/${result.parameters?.output_format || 'png'};base64,${imageData}`}
                      download={`generated-${result.timestamp}-${index}.${result.parameters?.output_format || 'png'}`}
                      className="text-sm text-blue-500 hover:underline"
                    >
                      Download
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
              No images available
            </div>
          )}
        </div>
      </div>
    );
  }
  
  // Default fallback for other job types
  return (
    <div className="border rounded-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Job Results</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => copyToClipboard(JSON.stringify(job.results, null, 2))}
        >
          <Copy className="mr-2 h-4 w-4" />
          Copy Results
        </Button>
      </div>
      <pre className="bg-muted p-4 rounded-md overflow-auto max-h-[400px] text-sm">
        {JSON.stringify(job.results, null, 2)}
      </pre>
    </div>
  );
}
