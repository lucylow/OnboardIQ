import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  Video, 
  Settings, 
  User,
  BarChart3,
  Globe,
  MessageSquare
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

const MobileNavigation: React.FC = () => {
  const location = useLocation();

  const navItems: NavItem[] = [
    {
      label: 'Home',
      href: '/',
      icon: Home
    },
    {
      label: 'PDF Generator',
      href: '/foxit-pdf-generator',
      icon: FileText
    },
    {
      label: 'Video Onboarding',
      href: '/video-onboarding',
      icon: Video
    },
    {
      label: 'Analytics',
      href: '/analytics',
      icon: BarChart3,
      badge: 3
    },
    {
      label: 'Settings',
      href: '/settings',
      icon: Settings
    }
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <nav className="mobile-nav safe-area-bottom">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          
          return (
            <Link
              key={item.href}
              to={item.href}
              className={`mobile-nav-item relative ${
                active 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-gray-900'
              } transition-colors duration-200`}
            >
              <div className="relative">
                <Icon className="h-5 w-5 mx-auto mb-1" />
                {item.badge && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs flex items-center justify-center"
                  >
                    {item.badge}
                  </Badge>
                )}
              </div>
              <span className="text-xs font-medium">{item.label}</span>
              {active && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNavigation;
