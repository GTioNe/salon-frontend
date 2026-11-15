import { cn } from '../../lib/utils';
import { type HTMLAttributes } from 'react';

interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'circular' | 'rectangular' | 'card';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant = 'text', width, height, ...props }: SkeletonProps) {
  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-xl',
    card: 'rounded-2xl',
  };

  const widths = {
    text: 'w-3/4',
    circular: 'w-12',
    rectangular: 'w-full',
    card: 'w-full',
  };

  const heights = {
    text: 'h-4',
    circular: 'h-12',
    rectangular: 'h-20',
    card: 'h-64',
  };

  return (
    <div
      className={cn(
        'skeleton animate-pulse bg-white/5',
        variants[variant],
        widths[variant],
        heights[variant],
        width && `w-[${width}]`,
        height && `h-[${height}]`,
        className
      )}
      {...props}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card p-6 space-y-4">
      <Skeleton variant="circular" className="w-16 h-16" />
      <div className="space-y-2">
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
      </div>
      <Skeleton variant="rectangular" height="32" />
    </div>
  );
}

export function SkeletonTable(rows = 5, columns = 4) {
  return (
    <div className="glass-card overflow-hidden">
      <div className="p-4 border-b border-white/10">
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton variant="text" key={i} width="60%" />
          ))}
        </div>
      </div>
      <div className="divide-y divide-white/5">
        {Array.from({ length: rows }).map((_, rowIndex) => (
          <div key={rowIndex} className="p-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <Skeleton variant="text" key={colIndex} width="80%" />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonAppointment() {
  return (
    <div className="glass-card p-4">
      <div className="flex items-start gap-4">
        <Skeleton variant="circular" />
        <div className="flex-1 space-y-3">
          <div className="flex items-center justify-between">
            <Skeleton variant="text" width="40%" />
            <Skeleton variant="text" width="20%" />
          </div>
          <Skeleton variant="text" width="60%" />
          <div className="flex items-center gap-4">
            <Skeleton variant="text" width="30%" />
            <Skeleton variant="text" width="30%" />
          </div>
        </div>
      </div>
    </div>
  );
}