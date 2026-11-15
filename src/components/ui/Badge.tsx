import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', dot, children, ...props }, ref) => {
    const variants = {
      default: 'bg-white/10 text-zinc-300 border border-white/10',
      success: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      warning: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      danger: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
      info: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      premium: 'bg-gradient-to-r from-champagne-500/20 to-roseGold-500/20 text-champagne-300 border border-champagne-500/30',
    };

    const sizes = {
      sm: 'px-2 py-0.5 text-xs gap-1',
      md: 'px-2.5 py-1 text-xs gap-1.5',
      lg: 'px-3 py-1.5 text-sm gap-2',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center font-medium rounded-full',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {dot && <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

interface StatusBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export const StatusBadge = forwardRef<HTMLSpanElement, StatusBadgeProps>(
  ({ className, status, children, ...props }, ref) => {
    const variants = {
      pending: 'bg-amber-500/20 text-amber-400 border border-amber-500/30',
      confirmed: 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30',
      completed: 'bg-blue-500/20 text-blue-400 border border-blue-500/30',
      cancelled: 'bg-rose-500/20 text-rose-400 border border-rose-500/30',
    };

    const labels = {
      pending: 'Pendente',
      confirmed: 'Confirmado',
      completed: 'Finalizado',
      cancelled: 'Cancelado',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border',
          variants[status],
          className
        )}
        {...props}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-current mr-2" />
        {children || labels[status]}
      </span>
    );
  }
);

StatusBadge.displayName = 'StatusBadge';