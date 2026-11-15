import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pink-500 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
      primary: 'bg-gradient-to-r from-champagne-500 via-champagne-400 to-champagne-300 text-luxury-950 shadow-lg shadow-champagne-500/20 hover:shadow-xl hover:shadow-champagne-500/30 hover:scale-[1.02] active:scale-[0.98] focus:ring-champagne-500',
      secondary: 'bg-white/5 backdrop-blur-sm border border-white/10 text-zinc-300 hover:bg-white/10 hover:border-champagne-500/30 hover:text-champagne-400 active:scale-[0.98] focus:ring-champagne-500',
      ghost: 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5 active:scale-[0.95] focus:ring-zinc-500',
      danger: 'bg-roseGold-600 text-white shadow-lg shadow-roseGold-600/20 hover:bg-roseGold-500 hover:shadow-xl hover:shadow-roseGold-500/30 hover:scale-[1.02] active:scale-[0.98] focus:ring-roseGold-500',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-xs gap-1.5',
      md: 'px-5 py-2.5 text-sm gap-2',
      lg: 'px-7 py-3.5 text-base gap-2.5',
    };

    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';