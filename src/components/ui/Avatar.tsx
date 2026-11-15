import { forwardRef, type ImgHTMLAttributes, type HTMLAttributes, Children, cloneElement, isValidElement, type ReactElement } from 'react';
import { cn } from '../../lib/utils';
import { getInitials } from '../../lib/utils';

interface AvatarProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src'> {
  src?: string | null;
  alt?: string;
  name?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fallback?: React.ReactNode;
}

export const Avatar = forwardRef<HTMLImageElement, AvatarProps>(
  ({ className, src, alt, name, size = 'md', fallback, ...props }, ref) => {
    const sizes = {
      xs: 'w-6 h-6 text-xs',
      sm: 'w-8 h-8 text-sm',
      md: 'w-10 h-10 text-base',
      lg: 'w-12 h-12 text-lg',
      xl: 'w-16 h-16 text-xl',
    };

    const showFallback = !src || src === '';

    return (
      <div
        className={cn(
          'relative inline-flex items-center justify-center overflow-hidden rounded-full bg-white/5 border border-white/10',
          sizes[size],
          className
        )}
      >
        {!showFallback ? (
          <img
            ref={ref}
            src={src!}
            alt={alt || name || 'Avatar'}
            className="w-full h-full object-cover"
            {...props}
          />
        ) : (
          fallback || (name ? (
            <span className="font-semibold text-champagne-400">
              {getInitials(name)}
            </span>
          ) : (
            <svg className="w-1/2 h-1/2 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          ))
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';

interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  max?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export function AvatarGroup({ className, children, max = 5, size = 'md', ...props }: AvatarGroupProps) {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };
  const childrenArray = Children.toArray(children);
  const visibleChildren = childrenArray.slice(0, max);
  const remainingCount = childrenArray.length - max;

  return (
    <div className={cn('flex -space-x-2', className)} {...props}>
      {visibleChildren.map((child, index) =>
        isValidElement(child) ? cloneElement(child as ReactElement<any>, {
          key: index,
          size,
          className: cn('ring-2 ring-luxury-950', (child.props as Record<string, unknown>).className as string),
        }) : child
      )}
      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center bg-white/5 border border-white/10 rounded-full font-medium text-zinc-400',
            sizes[size]
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
}