import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2, Zap, Brain, Shield } from 'lucide-react';

interface EnhancedLoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'default' | 'spinner' | 'dots' | 'pulse' | 'gradient' | 'ai';
  text?: string;
  className?: string;
  fullScreen?: boolean;
}

const EnhancedLoading: React.FC<EnhancedLoadingProps> = ({
  size = 'md',
  variant = 'default',
  text,
  className,
  fullScreen = false
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'spinner':
        return (
          <div className={cn('animate-spin rounded-full border-2 border-gray-300 border-t-blue-600', sizeClasses[size])} />
        );
      
      case 'dots':
        return (
          <div className="flex space-x-1">
            <div className={cn('animate-bounce rounded-full bg-blue-600', sizeClasses[size])} style={{ animationDelay: '0ms' }} />
            <div className={cn('animate-bounce rounded-full bg-blue-600', sizeClasses[size])} style={{ animationDelay: '150ms' }} />
            <div className={cn('animate-bounce rounded-full bg-blue-600', sizeClasses[size])} style={{ animationDelay: '300ms' }} />
          </div>
        );
      
      case 'pulse':
        return (
          <div className={cn('animate-pulse rounded-full bg-gradient-to-r from-blue-600 to-purple-600', sizeClasses[size])} />
        );
      
      case 'gradient':
        return (
          <div className={cn('animate-spin rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600', sizeClasses[size])}>
            <div className="w-full h-full rounded-full bg-white m-0.5" />
          </div>
        );
      
      case 'ai':
        return (
          <div className="relative">
            <Brain className={cn('animate-pulse text-blue-600', sizeClasses[size])} />
            <div className="absolute inset-0 animate-ping rounded-full bg-blue-600 opacity-20" />
          </div>
        );
      
      default:
        return <Loader2 className={cn('animate-spin text-blue-600', sizeClasses[size])} />;
    }
  };

  const content = (
    <div className={cn('flex flex-col items-center justify-center space-y-4', className)}>
      {renderSpinner()}
      {text && (
        <p className="text-sm text-gray-600 animate-pulse">
          {text}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-50">
        {content}
      </div>
    );
  }

  return content;
};

export default EnhancedLoading;
