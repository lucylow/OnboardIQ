import React from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface EnhancedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'secondary' | 'outline' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  fullWidth?: boolean;
  animation?: 'scale' | 'bounce' | 'none';
}

const EnhancedButton: React.FC<EnhancedButtonProps> = ({
  children,
  className,
  variant = 'default',
  size = 'md',
  loading = false,
  disabled = false,
  icon,
  iconPosition = 'left',
  onClick,
  type = 'button',
  fullWidth = false,
  animation = 'scale'
}) => {
  const baseClasses = cn(
    'relative inline-flex items-center justify-center font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    {
      // Size variants
      'px-3 py-1.5 text-sm': size === 'sm',
      'px-4 py-2 text-sm': size === 'md',
      'px-6 py-3 text-base': size === 'lg',
      'px-8 py-4 text-lg': size === 'xl',
      
      // Width
      'w-full': fullWidth,
      
      // Variant styles
      'bg-gray-900 text-white hover:bg-gray-800 focus:ring-gray-500': variant === 'default',
      'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500': variant === 'primary',
      'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500': variant === 'secondary',
      'border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500': variant === 'outline',
      'text-gray-700 hover:bg-gray-100 focus:ring-gray-500': variant === 'ghost',
      'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500': variant === 'gradient',
      
      // Animation effects
      'hover:scale-105 active:scale-95': animation === 'scale',
      'hover:animate-bounce-gentle': animation === 'bounce',
      
      // Loading state
      'cursor-wait': loading,
    },
    className
  );

  const iconClasses = cn(
    'transition-transform duration-200',
    {
      'mr-2': iconPosition === 'left',
      'ml-2': iconPosition === 'right',
      'animate-spin': loading,
    }
  );

  return (
    <button
      type={type}
      className={baseClasses}
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && (
        <Loader2 className={cn(iconClasses, 'animate-spin')} />
      )}
      
      {!loading && icon && iconPosition === 'left' && (
        <span className={iconClasses}>
          {icon}
        </span>
      )}
      
      <span className={loading ? 'opacity-0' : 'opacity-100'}>
        {children}
      </span>
      
      {!loading && icon && iconPosition === 'right' && (
        <span className={iconClasses}>
          {icon}
        </span>
      )}
      
      {/* Ripple effect */}
      <div className="absolute inset-0 overflow-hidden rounded-md">
        <div className="absolute inset-0 bg-white/20 opacity-0 hover:opacity-100 transition-opacity duration-300" />
      </div>
    </button>
  );
};

export default EnhancedButton;
