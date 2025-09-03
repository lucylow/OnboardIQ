import React from 'react';
import { cn } from '@/lib/utils';

interface EnhancedCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'glass' | 'gradient';
  hover?: boolean;
  animation?: 'fade' | 'slide' | 'scale' | 'none';
  delay?: number;
}

const EnhancedCard: React.FC<EnhancedCardProps> = ({
  children,
  className,
  variant = 'default',
  hover = true,
  animation = 'fade',
  delay = 0
}) => {
  const baseClasses = cn(
    'relative overflow-hidden transition-all duration-300',
    {
      // Variant styles
      'bg-white border border-gray-200 shadow-lg': variant === 'default',
      'bg-white/95 backdrop-blur-sm border border-gray-200/50 shadow-xl': variant === 'elevated',
      'bg-white/10 backdrop-blur-md border border-white/20 shadow-lg': variant === 'glass',
      'bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/50 shadow-lg': variant === 'gradient',
      
      // Hover effects
      'hover:shadow-xl hover:-translate-y-1': hover,
      'hover:shadow-blue-500/10': hover && variant === 'default',
      'hover:shadow-purple-500/10': hover && variant === 'elevated',
      'hover:bg-white/20': hover && variant === 'glass',
      'hover:from-blue-100 hover:to-purple-100': hover && variant === 'gradient',
      
      // Animation classes
      'animate-fade-in': animation === 'fade',
      'animate-slide-up': animation === 'slide',
      'animate-scale-in': animation === 'scale',
    },
    className
  );

  return (
    <div 
      className={baseClasses}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default EnhancedCard;
