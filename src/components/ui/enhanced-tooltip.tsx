import React, { useState } from 'react';
import { cn } from '@/lib/utils';

interface EnhancedTooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'default' | 'info' | 'success' | 'warning' | 'error';
  delay?: number;
  className?: string;
  maxWidth?: number;
}

const EnhancedTooltip: React.FC<EnhancedTooltipProps> = ({
  children,
  content,
  position = 'top',
  variant = 'default',
  delay = 200,
  className,
  maxWidth = 200
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 transform -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 transform -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 transform -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 transform -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 transform -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 transform -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 transform -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 transform -translate-y-1/2 border-r-gray-900'
  };

  const variantClasses = {
    default: 'bg-gray-900 text-white',
    info: 'bg-blue-600 text-white',
    success: 'bg-green-600 text-white',
    warning: 'bg-yellow-600 text-white',
    error: 'bg-red-600 text-white'
  };

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      <div
        className={cn(
          'absolute z-50 px-3 py-2 text-sm rounded-md shadow-lg opacity-0 pointer-events-none transition-all duration-200',
          positionClasses[position],
          variantClasses[variant],
          'border-0',
          className
        )}
        style={{ 
          maxWidth,
          opacity: isVisible ? 1 : 0,
          transform: isVisible 
            ? positionClasses[position].includes('transform') 
              ? positionClasses[position].split('transform')[1] 
              : 'translateY(0)'
            : 'translateY(5px)'
        }}
      >
        <div className="relative">
          {content}
          <div 
            className={cn(
              'absolute w-0 h-0 border-4 border-transparent',
              arrowClasses[position]
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default EnhancedTooltip;
