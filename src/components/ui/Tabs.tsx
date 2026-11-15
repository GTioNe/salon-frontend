import { createContext, useContext, useState, type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '../../lib/utils';

interface TabsContextType {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  variant: 'default' | 'underline' | 'pills';
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabsContext() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs components must be used within Tabs.Root');
  }
  return context;
}

interface TabsRootProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue: string;
  onValueChange?: (value: string) => void;
  variant?: 'default' | 'underline' | 'pills';
  children: ReactNode;
}

export function TabsRoot({ defaultValue, onValueChange, variant = 'default', children, className, ...props }: TabsRootProps) {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const handleSetActiveTab = (value: string) => {
    setActiveTab(value);
    onValueChange?.(value);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab, variant }}>
      <div className={cn('space-y-4', className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

interface TabsListProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  const { variant } = useTabsContext();
  
  const variants = {
    default: 'bg-white/5 rounded-xl p-1',
    underline: 'border-b border-white/10 pb-1',
    pills: 'gap-1',
  };

  return (
    <div
      role="tablist"
      className={cn('flex items-center', variants[variant], className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

export function TabsTrigger({ value, disabled, children, className, ...props }: TabsTriggerProps) {
  const { activeTab, setActiveTab, variant } = useTabsContext();
  const isActive = activeTab === value;

  const variants = {
    default: isActive
      ? 'bg-gradient-to-r from-champagne-500/20 to-roseGold-500/20 text-champagne-300 shadow-md'
      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5',
    underline: isActive
      ? 'text-champagne-300 border-b-2 border-champagne-500'
      : 'text-zinc-400 hover:text-zinc-100',
    pills: isActive
      ? 'bg-gradient-to-r from-champagne-500/20 to-roseGold-500/20 text-champagne-300 shadow-md'
      : 'text-zinc-400 hover:text-zinc-100 hover:bg-white/5',
  };

  const baseStyles = 'relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-champagne-500/50 focus:ring-offset-2 focus:ring-offset-luxury-950 disabled:opacity-50 disabled:cursor-not-allowed';

  return (
    <button
      role="tab"
      aria-selected={isActive}
      aria-controls={`panel-${value}`}
      id={`tab-${value}`}
      onClick={() => !disabled && setActiveTab(value)}
      disabled={disabled}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      {children}
    </button>
  );
}

interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  children: ReactNode;
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const { activeTab } = useTabsContext();
  const isActive = activeTab === value;

  if (!isActive) return null;

  return (
    <div
      role="tabpanel"
      id={`panel-${value}`}
      aria-labelledby={`tab-${value}`}
      className={cn('animate-fade-in animate-slide-up', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Trigger: TabsTrigger,
  Content: TabsContent,
});