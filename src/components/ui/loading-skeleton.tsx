// src/components/ui/loading-skeleton.tsx
export function LoadingSkeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-accent rounded-md ${className}`}></div>
  );
}
