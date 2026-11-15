import { useState, useRef, useEffect, type ReactElement, isValidElement, cloneElement } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface TooltipProps {
  content: React.ReactNode;
  children: ReactElement;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
  className?: string;
}

export function Tooltip({ content, children, position = 'top', delay = 200, className }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const showTooltip = () => {
    timeoutRef.current = window.setTimeout(() => setIsVisible(true), delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    setIsVisible(false);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current);
    };
  }, []);

  if (!isValidElement(children)) {
    return <>{children}</>;
  }

  const childWithProps = cloneElement(children, {
    onMouseEnter: showTooltip,
    onMouseLeave: hideTooltip,
    onFocus: showTooltip,
    onBlur: hideTooltip,
    'aria-describedby': isVisible ? 'tooltip' : undefined,
  } as Record<string, unknown>);

  const positions = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrows = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-champagne-500/90',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-champagne-500/90',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-champagne-500/90',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-champagne-500/90',
  };

  const tooltip = isVisible ? (
    <motion.div
      id="tooltip"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className={cn(
        'fixed z-50 px-3 py-2 text-xs font-medium text-luxury-950 rounded-lg shadow-lg',
        'bg-gradient-to-r from-champagne-400 to-champagne-300',
        'whitespace-nowrap',
        positions[position],
        className
      )}
      role="tooltip"
    >
      {content}
      <div
        className={cn(
          'absolute w-0 h-0 border-4 border-transparent',
          arrows[position]
        )}
      />
    </motion.div>
  ) : null;

  return (
    <>
      {childWithProps}
      {typeof window !== 'undefined' && createPortal(tooltip, document.body)}
    </>
  );
}