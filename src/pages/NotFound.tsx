import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Home, 
  ArrowLeft, 
  Search, 
  FileText, 
  Users, 
  Mail,
  Zap,
  AlertTriangle
} from 'lucide-react';

const NotFound: React.FC = () => {
  const helpfulLinks = [
    {
      title: 'Home',
      description: 'Return to the main page',
      href: '/',
      icon: <Home className="h-5 w-5" />
    },
    {
      title: 'Documentation',
      description: 'Browse our comprehensive guides',
      href: '/docs',
      icon: <FileText className="h-5 w-5" />
    },
    {
      title: 'Support',
      description: 'Get help from our team',
      href: '/help',
      icon: <Users className="h-5 w-5" />
    },
    {
      title: 'Contact',
      description: 'Reach out to us directly',
      href: '/contact',
      icon: <Mail className="h-5 w-5" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Icon */}
        <div className="mb-8">
          <div className="mx-auto w-32 h-32 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white mb-6">
            <AlertTriangle className="h-16 w-16" />
          </div>
          <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">
            Page Not Found
          </h2>
          <p className="text-gray-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track with OnboardIQ.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Button 
            asChild
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Link to="/">
              <Home className="mr-2 h-4 w-4" />
              Go Home
            </Link>
          </Button>
          <Button 
            variant="outline" 
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>

        {/* Search Section */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center justify-center">
              <Search className="mr-2 h-5 w-5" />
              Can't find what you're looking for?
            </CardTitle>
            <CardDescription>
              Search our documentation or browse helpful resources
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Search documentation..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button>
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Helpful Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helpfulLinks.map((link, index) => (
            <Card 
              key={index} 
              className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
            >
              <Link to={link.href}>
                <CardContent className="p-6 text-center">
                  <div className="mx-auto w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center text-white mb-4">
                    {link.icon}
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{link.title}</h3>
                  <p className="text-sm text-gray-600">{link.description}</p>
                </CardContent>
              </Link>
            </Card>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Still need help? Our support team is here for you.
          </p>
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
            <span>Powered by</span>
            <div className="flex items-center">
              <Zap className="h-4 w-4 text-blue-600 mr-1" />
              <span className="font-semibold text-blue-600">OnboardIQ</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
