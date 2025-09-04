import React from 'react';

// Mobile Responsive Utilities for OnboardIQ
// Provides consistent mobile-first responsive patterns

export const MOBILE_BREAKPOINTS = {
  xs: '320px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
} as const;

export const MOBILE_SPACING = {
  xs: '0.5rem',    // 8px
  sm: '0.75rem',   // 12px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem'    // 48px
} as const;

export const MOBILE_TEXT_SIZES = {
  xs: '0.75rem',   // 12px
  sm: '0.875rem',  // 14px
  base: '1rem',    // 16px
  lg: '1.125rem',  // 18px
  xl: '1.25rem',   // 20px
  '2xl': '1.5rem', // 24px
  '3xl': '1.875rem', // 30px
  '4xl': '2.25rem'   // 36px
} as const;

// Responsive class utilities
export const RESPONSIVE_CLASSES = {
  // Text sizes
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl'
  },
  
  // Padding
  padding: {
    xs: 'p-2 sm:p-3',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-12'
  },
  
  // Margin
  margin: {
    xs: 'm-2 sm:m-3',
    sm: 'm-3 sm:m-4',
    md: 'm-4 sm:m-6',
    lg: 'm-6 sm:m-8',
    xl: 'm-8 sm:m-12'
  },
  
  // Grid layouts
  grid: {
    '1-2': 'grid-cols-1 sm:grid-cols-2',
    '1-3': 'grid-cols-1 md:grid-cols-3',
    '1-4': 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    '2-4': 'grid-cols-2 md:grid-cols-4',
    '2-6': 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6'
  },
  
  // Flex layouts
  flex: {
    'col-row': 'flex-col sm:flex-row',
    'row-col': 'flex-row sm:flex-col',
    'center': 'justify-center items-center',
    'between': 'justify-between items-center'
  },
  
  // Button sizes
  button: {
    sm: 'h-8 sm:h-10 text-xs sm:text-sm',
    md: 'h-10 sm:h-11 text-sm sm:text-base',
    lg: 'h-11 sm:h-12 text-sm sm:text-base',
    xl: 'h-12 sm:h-14 text-sm sm:text-base'
  },
  
  // Input sizes
  input: {
    sm: 'h-8 sm:h-10 text-xs sm:text-sm',
    md: 'h-10 sm:h-11 text-sm sm:text-base',
    lg: 'h-11 sm:h-12 text-sm sm:text-base'
  },
  
  // Icon sizes
  icon: {
    sm: 'h-3 w-3 sm:h-4 sm:w-4',
    md: 'h-4 w-4 sm:h-5 sm:w-5',
    lg: 'h-5 w-5 sm:h-6 sm:w-6',
    xl: 'h-6 w-6 sm:h-8 sm:w-8'
  }
} as const;

// Mobile-first responsive helpers
export const getResponsiveClasses = (type: keyof typeof RESPONSIVE_CLASSES, size: string) => {
  return RESPONSIVE_CLASSES[type][size as keyof typeof RESPONSIVE_CLASSES[typeof type]] || '';
};

// Touch-friendly minimum sizes
export const TOUCH_TARGETS = {
  button: 'min-h-[44px] min-w-[44px]',
  link: 'min-h-[44px] min-w-[44px]',
  input: 'min-h-[44px]',
  icon: 'min-h-[44px] min-w-[44px]'
} as const;

// Mobile-specific utilities
export const MOBILE_UTILITIES = {
  // Prevent text overflow
  textTruncate: 'truncate',
  textWrap: 'break-words',
  
  // Touch-friendly spacing
  touchSpacing: 'space-y-4 sm:space-y-6',
  touchPadding: 'p-4 sm:p-6',
  
  // Mobile navigation
  mobileNav: 'fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50',
  mobileNavItem: 'flex flex-col items-center justify-center p-2 text-xs',
  
  // Mobile cards
  mobileCard: 'rounded-lg border border-gray-200 bg-white shadow-sm',
  mobileCardHeader: 'p-4 sm:p-6 border-b border-gray-200',
  mobileCardContent: 'p-4 sm:p-6',
  
  // Mobile forms
  mobileForm: 'space-y-4 sm:space-y-6',
  mobileFormGroup: 'space-y-2 sm:space-y-3',
  mobileFormLabel: 'text-sm sm:text-base font-medium text-gray-700',
  mobileFormInput: 'h-10 sm:h-11 text-sm sm:text-base',
  
  // Mobile buttons
  mobileButton: 'h-10 sm:h-11 text-sm sm:text-base font-medium',
  mobileButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white',
  mobileButtonSecondary: 'bg-gray-100 hover:bg-gray-200 text-gray-900',
  
  // Mobile lists
  mobileList: 'divide-y divide-gray-200',
  mobileListItem: 'p-4 sm:p-6 hover:bg-gray-50',
  
  // Mobile modals
  mobileModal: 'fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4',
  mobileModalContent: 'bg-white rounded-lg max-w-sm w-full max-h-[90vh] overflow-y-auto',
  
  // Mobile tables
  mobileTable: 'min-w-full divide-y divide-gray-200',
  mobileTableHeader: 'bg-gray-50',
  mobileTableRow: 'hover:bg-gray-50',
  mobileTableCell: 'px-3 sm:px-6 py-3 sm:py-4 text-sm sm:text-base'
} as const;

// Hook for detecting mobile devices
export const useIsMobile = () => {
  const checkIsMobile = () => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768; // md breakpoint
  };
  
  const [isMobile, setIsMobile] = React.useState(checkIsMobile);
  
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setIsMobile(checkIsMobile());
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return isMobile;
};

// Hook for detecting touch devices
export const useIsTouchDevice = () => {
  if (typeof window === 'undefined') return false;
  
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Mobile-specific component props
export interface MobileResponsiveProps {
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
  children: React.ReactNode;
}

// Mobile-responsive wrapper component
export const MobileResponsive: React.FC<MobileResponsiveProps> = ({
  className = '',
  mobileClassName = '',
  desktopClassName = '',
  children
}) => {
  const isMobile = useIsMobile();
  
  const combinedClassName = `${className} ${isMobile ? mobileClassName : desktopClassName}`;
  
  return <div className={combinedClassName}>{children}</div>;
};
