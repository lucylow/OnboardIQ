import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Menu,
  X,
  User,
  Settings,
  LogOut,
  Search,
  Zap,
  Shield,
  BarChart3,
  Users,
  FileText,
  Video,
  Smartphone,
  ChevronDown,
  ExternalLink,
  Bell,
  HelpCircle,
  Play,
  MessageSquare,
  Home,
  Brain,
  Activity,
  Globe,
  Sparkles,
  FolderOpen,
  FileCheck,
  Workflow,
  Phone,
  Lock,
  Unlock,
  Monitor,
  Headphones,
  MessageCircle,
  Award,
  Star,
  TrendingUp,
  Code,
  Database,
  Cloud,
  Settings2,
  BookOpen,
  Target,
  PieChart,
  Calendar,
  Clock,
  Mail,
  Download,
  Upload,
  Edit,
  Wallet,
  Trash2,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  RefreshCw,
  Network,
  DollarSign
} from 'lucide-react';
import NotificationDropdown from './NotificationDropdown';
import BackendHealthCheck from './BackendHealthCheck';
import { authService } from '../services/authService';

interface NavigationProps {
  variant?: 'default' | 'transparent';
  showAuthButtons?: boolean;
}

const Navigation: React.FC<NavigationProps> = ({ 
  variant = 'default', 
  showAuthButtons = true 
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [authState, setAuthState] = useState(authService.getAuthState());
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setAuthState(authService.getAuthState());
    
    // Listen for authentication state changes
    const checkAuthState = () => {
      setAuthState(authService.getAuthState());
    };
    
    // Check auth state periodically and on storage changes
    const interval = setInterval(checkAuthState, 1000);
    window.addEventListener('storage', checkAuthState);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', checkAuthState);
    };
  }, []);

  // Handle scroll effect for transparent navigation
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (variant === 'transparent') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [variant]);

  const isTransparent = variant === 'transparent';
  const isHomePage = location.pathname === '/';
  const shouldShowBackground = isTransparent && (isScrolled || !isHomePage);

  // Unified navigation items - everything in one menu
  const unifiedNavItems = [
    // Featured - Chat First
    {
      section: 'Featured',
      items: [
        {
          label: 'AI Streaming Chat',
          href: '/streaming-chat',
          icon: <MessageSquare className="h-4 w-4" />,
          description: 'Real-time AI chat with OpenAI GPT-4',
          badge: 'Featured'
        }
      ]
    },
    // Main Dashboard
    {
      section: 'Main',
      items: [
        {
          label: 'Dashboard',
          href: '/dashboard',
          icon: <Home className="h-4 w-4" />,
          description: 'Overview & insights'
        },
        {
          label: 'Adaptive Onboarding',
          href: '/adaptive-onboarding',
          icon: <Brain className="h-4 w-4" />,
          description: 'AI recommendations',
          badge: 'New'
        }
      ]
    },
    // AI & Analytics
    {
      section: 'AI & Analytics',
      items: [
        {
          label: 'Risk Monitoring',
          href: '/risk-monitoring',
          icon: <Activity className="h-4 w-4" />,
          description: 'Security alerts'
        },
        {
          label: 'Analytics',
          href: '/analytics',
          icon: <BarChart3 className="h-4 w-4" />,
          description: 'Performance metrics'
        },
        {
          label: 'User Profiling',
          href: '/user-profiling',
          icon: <Users className="h-4 w-4" />,
          description: 'Customer insights'
        },
        {
          label: 'Churn Prediction',
          href: '/churn-prediction',
          icon: <TrendingUp className="h-4 w-4" />,
          description: 'Predictive analytics'
        }
      ]
    },
    // Document Management
    {
      section: 'Document Management',
      items: [
        {
          label: 'Documents',
          href: '/documents',
          icon: <FileText className="h-4 w-4" />,
          description: 'Manage contracts'
        },
        {
          label: 'Document PDF Generator',
          href: '/document-pdf-generator',
          icon: <FileCheck className="h-4 w-4" />,
          description: 'Generate PDFs'
        },
        {
          label: 'Document Demo',
          href: '/document-demo',
          icon: <Play className="h-4 w-4" />,
          description: 'PDF features demo'
        },
        {
          label: 'Document Workflow',
          href: '/document-workflow',
          icon: <Workflow className="h-4 w-4" />,
          description: 'Automated processing'
        }
      ]
    },
            // Integration & Orchestration
        {
          section: 'Integration & Orchestration',
          items: [
            {
              label: 'OnboardIQ',
              href: '/onboardiq',
              icon: <Shield className="h-4 w-4" />,
              description: 'AI-powered onboarding',
              badge: 'New'
            },
            {
              label: 'Integration Platform Demo',
              href: '/integration-platform-demo',
              icon: <Code className="h-4 w-4" />,
              description: 'Anypoint Platform demo'
            },
            {
              label: 'MCP Dashboard',
              href: '/integration-platform-mcp',
              icon: <Network className="h-4 w-4" />,
              description: 'Model Context Protocol'
            }
          ]
        },
    // Communication & Authentication
    {
      section: 'Communication & Auth',
      items: [
        {
          label: 'Vonage Authentication',
          href: '/vonage-auth',
          icon: <Lock className="h-4 w-4" />,
          description: 'Enhanced security'
        },
        {
          label: 'Communication Multi-Channel',
          href: '/communication-multichannel',
          icon: <MessageSquare className="h-4 w-4" />,
          description: 'Multi-channel messaging'
        },
        {
          label: 'Communication Demo',
          href: '/communication-demo',
          icon: <Award className="h-4 w-4" />,
          description: 'Communication demo'
        },
        {
          label: 'Video Onboarding',
          href: '/video-onboarding',
          icon: <Video className="h-4 w-4" />,
          description: 'Interactive sessions'
        }
      ]
    },

    // Blockchain Features
    {
      section: 'Blockchain Features',
      items: [
        {
          label: 'Blockchain Dashboard',
          href: '/blockchain',
          icon: <Network className="h-4 w-4" />,
          description: 'Complete Web3 overview',
          badge: 'New'
        },
        {
          label: 'ZK Identity Verification',
          href: '/zk-identity',
          icon: <Shield className="h-4 w-4" />,
          description: 'Zero-knowledge identity proofs',
          badge: 'New'
        },
        {
          label: 'NFT Gallery',
          href: '/nft-gallery',
          icon: <Award className="h-4 w-4" />,
          description: 'Mint & trade achievement NFTs',
          badge: 'New'
        },
        {
          label: 'Wallet Connection',
          href: '/wallet',
          icon: <Wallet className="h-4 w-4" />,
          description: 'Connect & manage wallet'
        }
      ]
    },

    // Business Features
    {
      section: 'Business Features',
      items: [
        {
          label: 'Billing & Pricing',
          href: '/billing',
          icon: <DollarSign className="h-4 w-4" />,
          description: 'Manage subscriptions & billing',
          badge: 'Enterprise'
        },
        {
          label: 'Customer Success',
          href: '/customer-success',
          icon: <Users className="h-4 w-4" />,
          description: 'Monitor customer health'
        },
        {
          label: 'Sales Pipeline',
          href: '/sales-pipeline',
          icon: <Target className="h-4 w-4" />,
          description: 'Track deals & revenue'
        },
        {
          label: 'Enterprise Features',
          href: '/enterprise',
          icon: <Settings2 className="h-4 w-4" />,
          description: 'Security & compliance'
        }
      ]
    },

    // Support & Resources
    {
      section: 'Support & Resources',
      items: [
        {
          label: 'Documentation',
          href: '/docs',
          icon: <BookOpen className="h-4 w-4" />,
          description: 'Guides & API docs'
        },
        {
          label: 'Help & Support',
          href: '/help',
          icon: <HelpCircle className="h-4 w-4" />,
          description: 'Get assistance'
        }
      ]
    }
  ];

  const handleLogout = () => {
    authService.logout();
    navigate('/');
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Top Navigation Bar - Minimal */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          shouldShowBackground 
            ? 'bg-white/95 backdrop-blur-md border-b border-gray-200/50 shadow-lg' 
            : isTransparent 
              ? 'bg-transparent' 
              : 'bg-white border-b border-gray-200 shadow-sm'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Menu Button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center space-x-2"
              >
                <Menu className="h-5 w-5" />
                <span className="hidden sm:inline">Menu</span>
              </Button>
              
              <Link 
                to="/" 
                className="flex items-center space-x-2 group"
              >
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OnboardIQ
                </span>
              </Link>
              
              {/* AI Badge */}
              <Badge 
                variant="secondary" 
                className="hidden sm:flex items-center gap-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border-purple-200"
              >
                <Brain className="h-3 w-3" />
                AI-Powered
              </Badge>
            </div>

            {/* Right side - Notifications and user */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <NotificationDropdown />

              {/* Backend Health Check - Minimal */}
              <BackendHealthCheck />

              {authState.isAuthenticated ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-9 w-9 rounded-full border-2 border-gray-200 hover:border-blue-300 transition-colors"
                    >
                      <User className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                          {authState.user?.firstName || 'User'}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {authState.user?.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setIsSidebarOpen(true)}>
                      <Menu className="h-4 w-4 mr-2" />
                      Open Menu
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                showAuthButtons && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/login')}
                      className="text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                    >
                      Sign in
                    </Button>
                    <Button
                      onClick={() => navigate('/signup')}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    >
                      Get Started
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Unified Sidebar Menu */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-[350px] sm:w-[400px] overflow-y-auto">
          <SheetHeader className="border-b pb-4">
            <SheetTitle className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-bold">OnboardIQ</span>
                <p className="text-xs text-gray-500">AI-powered platform</p>
              </div>
            </SheetTitle>
            <SheetDescription className="text-sm text-gray-600">
              Complete navigation menu
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search features..."
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Navigation Sections */}
            {unifiedNavItems.map((section) => (
              <div key={section.section} className="space-y-2">
                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                  {section.section}
                </h3>
                <div className="space-y-1">
                  {section.items.map((item) => (
                    <Link
                      key={item.label}
                      to={item.href}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-colors ${
                        location.pathname === item.href
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                      }`}
                      onClick={() => setIsSidebarOpen(false)}
                    >
                      <div className="flex items-center space-x-3">
                        {item.icon}
                        <div>
                          <span className="font-medium">{item.label}</span>
                          <p className="text-xs text-gray-500">{item.description}</p>
                        </div>
                      </div>
                      {item.badge && (
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${
                            item.badge === 'Featured' 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-400 text-green-900 font-semibold' 
                              : ''
                          }`}
                        >
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            <div className="space-y-2 pt-4 border-t">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3">
                Quick Actions
              </h3>
              <div className="space-y-1">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 hover:bg-green-100"
                  onClick={() => {
                    navigate('/streaming-chat');
                    setIsSidebarOpen(false);
                  }}
                >
                  <MessageSquare className="h-4 w-4 mr-2 text-green-600" />
                  Try AI Chat Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/document-demo');
                    setIsSidebarOpen(false);
                  }}
                >
                  <Play className="h-4 w-4 mr-2" />
                  Try Document Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/communication-demo');
                    setIsSidebarOpen(false);
                  }}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Try Communication Demo
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start"
                  onClick={() => {
                    navigate('/integration-platform-demo');
                    setIsSidebarOpen(false);
                  }}
                >
                  <Code className="h-4 w-4 mr-2" />
                  Try Integration Platform Demo
                </Button>
              </div>
            </div>

            {/* User Info for authenticated users */}
            {authState.isAuthenticated && (
              <div className="pt-4 border-t">
                <div className="px-3 py-2 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">
                    {authState.user?.firstName || 'User'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {authState.user?.email}
                  </p>
                </div>
              </div>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default Navigation;