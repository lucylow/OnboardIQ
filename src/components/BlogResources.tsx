import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  FileText, 
  Video, 
  Download, 
  ArrowRight,
  Calendar,
  User,
  Tag,
  TrendingUp,
  Shield,
  Users,
  Zap,
  Globe,
  Award,
  Star,
  Clock,
  Eye,
  Share2
} from 'lucide-react';

const BlogResources: React.FC = () => {
  const blogPosts = [
    {
      id: 1,
      title: 'The Future of Customer Onboarding: AI-Powered Personalization',
      excerpt: 'Discover how artificial intelligence is revolutionizing customer onboarding by creating personalized experiences that adapt to individual user behavior and preferences.',
      author: 'Sarah Johnson',
      date: 'December 15, 2024',
      readTime: '5 min read',
      category: 'AI & Automation',
      tags: ['AI', 'Personalization', 'Customer Experience'],
      featured: true,
      image: '/api/placeholder/400/250'
    },
    {
      id: 2,
      title: 'Multi-Channel Onboarding: Why SMS, Email, and Video Matter',
      excerpt: 'Learn why successful onboarding requires a multi-channel approach and how to implement effective communication strategies across different platforms.',
      author: 'Michael Chen',
      date: 'December 12, 2024',
      readTime: '4 min read',
      category: 'Multi-Channel',
      tags: ['SMS', 'Email', 'Video', 'Communication'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 3,
      title: 'Compliance Automation: Reducing Risk in Customer Onboarding',
      excerpt: 'Explore how automated compliance processes can reduce risk, improve audit trails, and ensure regulatory requirements are met consistently.',
      author: 'Emily Rodriguez',
      date: 'December 10, 2024',
      readTime: '6 min read',
      category: 'Compliance',
      tags: ['Compliance', 'Risk Management', 'Automation'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 4,
      title: 'Measuring Onboarding Success: Key Metrics That Matter',
      excerpt: 'Discover the essential metrics for measuring onboarding success and how to use data to continuously improve your customer experience.',
      author: 'David Kim',
      date: 'December 8, 2024',
      readTime: '7 min read',
      category: 'Analytics',
      tags: ['Metrics', 'Analytics', 'Success Measurement'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 5,
      title: 'E-Signature Integration: Streamlining Document Workflows',
      excerpt: 'Learn how integrating e-signature capabilities can streamline document workflows and improve the overall onboarding experience.',
      author: 'Sarah Johnson',
      date: 'December 5, 2024',
      readTime: '4 min read',
      category: 'Documentation',
      tags: ['E-Signature', 'Documentation', 'Workflow'],
      featured: false,
      image: '/api/placeholder/400/250'
    },
    {
      id: 6,
      title: 'Security Best Practices for Customer Verification',
      excerpt: 'Explore the latest security best practices for customer verification and how to implement robust authentication systems.',
      author: 'Michael Chen',
      date: 'December 3, 2024',
      readTime: '5 min read',
      category: 'Security',
      tags: ['Security', 'Verification', 'Authentication'],
      featured: false,
      image: '/api/placeholder/400/250'
    }
  ];

  const resources = [
    {
      title: 'Onboarding Best Practices Guide',
      description: 'Comprehensive guide covering the latest best practices for customer onboarding',
      type: 'PDF Guide',
      downloadCount: '2.3K',
      size: '2.4 MB',
      icon: FileText
    },
    {
      title: 'Customer Onboarding Checklist',
      description: 'Essential checklist to ensure your onboarding process covers all critical touchpoints',
      type: 'Template',
      downloadCount: '1.8K',
      size: '156 KB',
      icon: BookOpen
    },
    {
      title: 'Onboarding ROI Calculator',
      description: 'Calculate the potential ROI of improving your customer onboarding process',
      type: 'Tool',
      downloadCount: '3.1K',
      size: 'Interactive',
      icon: TrendingUp
    },
    {
      title: 'Compliance Requirements Guide',
      description: 'Overview of compliance requirements for different industries and regions',
      type: 'PDF Guide',
      downloadCount: '1.5K',
      size: '1.8 MB',
      icon: Shield
    }
  ];

  const webinars = [
    {
      title: 'The Future of Customer Onboarding',
      date: 'January 15, 2025',
      time: '2:00 PM EST',
      speaker: 'Sarah Johnson, CEO',
      description: 'Join us for an exclusive webinar on the future of customer onboarding and emerging trends.',
      registrationCount: '450',
      icon: Video
    },
    {
      title: 'AI-Powered Onboarding Strategies',
      date: 'January 22, 2025',
      time: '1:00 PM EST',
      speaker: 'Michael Chen, CTO',
      description: 'Learn how to implement AI-powered onboarding strategies that drive engagement and reduce churn.',
      registrationCount: '320',
      icon: Zap
    }
  ];

  const categories = [
    { name: 'AI & Automation', count: 12, icon: Zap },
    { name: 'Multi-Channel', count: 8, icon: Globe },
    { name: 'Compliance', count: 6, icon: Shield },
    { name: 'Analytics', count: 10, icon: TrendingUp },
    { name: 'Documentation', count: 7, icon: FileText },
    { name: 'Security', count: 9, icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="bg-blue-100 text-blue-800 mb-4">
              <BookOpen className="h-3 w-3 mr-1" />
              Resources & Insights
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Latest Insights on
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Customer Onboarding</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Stay ahead of the curve with our latest articles, guides, and resources 
              on customer onboarding best practices, trends, and innovations.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">50+</div>
              <div className="text-gray-600">Articles Published</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">25K+</div>
              <div className="text-gray-600">Monthly Readers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">15+</div>
              <div className="text-gray-600">Expert Contributors</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">95%</div>
              <div className="text-gray-600">Reader Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Blog Post */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Article
            </h2>
          </div>

          {blogPosts.filter(post => post.featured).map((post) => (
            <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="p-8">
                  <CardHeader className="p-0 mb-6">
                    <div className="flex items-center space-x-2 mb-4">
                      <Badge variant="outline" className="text-blue-600">
                        {post.category}
                      </Badge>
                      <Badge variant="secondary" className="text-green-600">
                        Featured
                      </Badge>
                    </div>
                    <CardTitle className="text-2xl">{post.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <p className="text-gray-600 mb-6">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <User className="h-4 w-4 mr-1" />
                          {post.author}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {post.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {post.readTime}
                        </span>
                      </div>
                      <Button>
                        Read Article
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </div>
                <div className="bg-gray-100 rounded-r-lg flex items-center justify-center">
                  <div className="w-full h-64 bg-gray-200 rounded flex items-center justify-center">
                    <span className="text-gray-500">Featured Image</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Blog Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Browse by Category
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Explore our content organized by topics that matter most to you.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 cursor-pointer">
                <CardContent className="p-6">
                  <category.icon className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2">{category.name}</h3>
                  <p className="text-sm text-gray-600">{category.count} articles</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Latest Articles
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay updated with the latest insights and best practices in customer onboarding.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.filter(post => !post.featured).slice(0, 6).map((post) => (
              <Card key={post.id} className="hover:shadow-lg transition-shadow duration-300">
                <div className="w-full h-48 bg-gray-200 rounded-t-lg flex items-center justify-center">
                  <span className="text-gray-500">Blog Image</span>
                </div>
                <CardHeader>
                  <div className="flex items-center space-x-2 mb-3">
                    <Badge variant="outline" className="text-blue-600 text-xs">
                      {post.category}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{post.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                    <span className="flex items-center">
                      <User className="h-3 w-3 mr-1" />
                      {post.author}
                    </span>
                    <span className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      {post.date}
                    </span>
                    <span className="flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {post.readTime}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex space-x-1">
                      {post.tags.slice(0, 2).map((tag, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button variant="outline" size="sm">
                      Read
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Resources */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Free Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Download our free guides, templates, and tools to improve your onboarding process.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {resources.map((resource, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <resource.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{resource.title}</CardTitle>
                      <Badge variant="outline" className="text-blue-600">
                        {resource.type}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{resource.description}</p>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <Download className="h-4 w-4 mr-1" />
                      {resource.downloadCount} downloads
                    </span>
                    <span>{resource.size}</span>
                  </div>
                  <Button className="w-full">
                    <Download className="h-4 w-4 mr-2" />
                    Download Now
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Upcoming Webinars */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Upcoming Webinars
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Join our live webinars to learn from industry experts and get your questions answered.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {webinars.map((webinar, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <webinar.icon className="h-8 w-8 text-blue-600" />
                    <div>
                      <CardTitle className="text-lg">{webinar.title}</CardTitle>
                      <p className="text-gray-600 text-sm">{webinar.speaker}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-4">{webinar.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {webinar.date} at {webinar.time}
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-2" />
                      {webinar.registrationCount} registered
                    </div>
                  </div>
                  <Button className="w-full">
                    Register Now
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Stay Updated
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Get the latest insights and best practices delivered to your inbox.
          </p>
          <div className="max-w-md mx-auto">
            <div className="flex space-x-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-white"
              />
              <Button variant="secondary">
                Subscribe
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <p className="text-blue-100 text-sm mt-2">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BlogResources;
