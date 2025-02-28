'use client';

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../api-client';
import { JobStatusResponse } from '../types';

interface UseJobStatusOptions {
  pollInterval?: number;
  autoStart?: boolean;
  onComplete?: (data: JobStatusResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Custom hook for tracking job status with polling
 */
export function useJobStatus(jobId: string | null, options: UseJobStatusOptions = {}) {
  const {
    pollInterval = 2000,
    autoStart = true,
    onComplete,
    onError,
  } = options;

  const [status, setStatus] = useState<JobStatusResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [polling, setPolling] = useState<boolean>(autoStart && !!jobId);

  const fetchStatus = useCallback(async () => {
    if (!jobId) return;

    try {
      setLoading(true);
      const response = await apiClient.getJobStatus(jobId);
      setStatus(response);

      if (response.status === 'completed') {
        setPolling(false);
        onComplete?.(response);
      } else if (response.status === 'failed') {
        setPolling(false);
        const err = new Error(response.error || 'Job failed');
        setError(err);
        onError?.(err);
      }
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Failed to fetch job status');
      setError(error);
      setPolling(false);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [jobId, onComplete, onError]);

  // Poll for job status
  useEffect(() => {
    if (!polling || !jobId) return;

    let timeoutId: NodeJS.Timeout;

    const poll = async () => {
      await fetchStatus();
      timeoutId = setTimeout(poll, pollInterval);
    };

    poll();

    // Cleanup the timeout when the component unmounts or when polling stops
    return () => {
      clearTimeout(timeoutId);
    };
  }, [jobId, polling, pollInterval, fetchStatus]);

  // Start/stop polling
  const startPolling = useCallback(() => {
    if (!jobId) return;
    setPolling(true);
  }, [jobId]);

  const stopPolling = useCallback(() => {
    setPolling(false);
  }, []);

  // Force refresh status
  const refresh = useCallback(() => {
    fetchStatus();
  }, [fetchStatus]);

  return {
    status,
    loading,
    error,
    polling,
    startPolling,
    stopPolling,
    refresh,
  };
}
