import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  MessageCircle, 
  X, 
  Minimize2,
  Maximize2,
  Settings,
  Sparkles,
  HelpCircle,
  FileText,
  Video,
  Smartphone
} from 'lucide-react';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type: 'text' | 'quick_reply' | 'document' | 'video' | 'action';
  metadata?: {
    action?: string;
    documentId?: string;
    videoUrl?: string;
    quickReplies?: string[];
  };
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: string;
  description: string;
}

const AIChatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: "Hi! I'm your AI assistant. I can help you with onboarding, document generation, video sessions, and more. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        quickReplies: [
          "Help me with onboarding",
          "Generate a document",
          "Schedule a video session",
          "Security questions"
        ]
      }
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const quickActions: QuickAction[] = [
    {
      id: '1',
      label: 'Onboarding Help',
      icon: <HelpCircle className="h-4 w-4" />,
      action: 'onboarding_help',
      description: 'Get help with your onboarding process'
    },
    {
      id: '2',
      label: 'Generate Document',
      icon: <FileText className="h-4 w-4" />,
      action: 'generate_document',
      description: 'Create a new document or contract'
    },
    {
      id: '3',
      label: 'Video Session',
      icon: <Video className="h-4 w-4" />,
      action: 'video_session',
      description: 'Schedule a personalized video call'
    },
    {
      id: '4',
      label: 'SMS Verification',
      icon: <Smartphone className="h-4 w-4" />,
      action: 'sms_verification',
      description: 'Help with phone verification'
    }
  ];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const simulateAIResponse = async (userMessage: string): Promise<Message> => {
    // Simulate AI processing time
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));

    const responses = {
      'onboarding': {
        content: "I'd be happy to help with your onboarding! Let me guide you through the process. What specific step are you having trouble with?",
        quickReplies: ["Registration", "Phone verification", "Document setup", "Video session"]
      },
      'document': {
        content: "I can help you generate documents! What type of document do you need? I can create welcome packets, contracts, or onboarding guides.",
        quickReplies: ["Welcome packet", "Contract", "Onboarding guide", "Invoice"]
      },
      'video': {
        content: "Great! I can help you schedule a video session. Our team will provide personalized guidance. When would you prefer to have the session?",
        quickReplies: ["Today", "Tomorrow", "This week", "Next week"]
      },
      'security': {
        content: "Security is our top priority! I can help you with verification, explain our security measures, or address any concerns.",
        quickReplies: ["Phone verification", "Security features", "Privacy policy", "Report issue"]
      },
      'default': {
        content: "I understand you're asking about that. Let me provide you with the most relevant information and assistance.",
        quickReplies: ["More details", "Contact human", "Related topics", "Close"]
      }
    };

    const lowerMessage = userMessage.toLowerCase();
    let response = responses.default;

    if (lowerMessage.includes('onboard') || lowerMessage.includes('signup') || lowerMessage.includes('register')) {
      response = responses.onboarding;
    } else if (lowerMessage.includes('document') || lowerMessage.includes('contract') || lowerMessage.includes('generate')) {
      response = responses.document;
    } else if (lowerMessage.includes('video') || lowerMessage.includes('call') || lowerMessage.includes('session')) {
      response = responses.video;
    } else if (lowerMessage.includes('security') || lowerMessage.includes('verify') || lowerMessage.includes('fraud')) {
      response = responses.security;
    }

    return {
      id: Date.now().toString(),
      content: response.content,
      sender: 'bot',
      timestamp: new Date(),
      type: 'text',
      metadata: {
        quickReplies: response.quickReplies
      }
    };
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      const aiResponse = await simulateAIResponse(content);
      setMessages(prev => [...prev, aiResponse]);
    } catch (error) {
      console.error('Error getting AI response:', error);
    } finally {
      setIsTyping(false);
    }
  };

  const handleQuickReply = (reply: string) => {
    handleSendMessage(reply);
  };

  const handleQuickAction = (action: QuickAction) => {
    const actionMessage: Message = {
      id: Date.now().toString(),
      content: `I'd like to ${action.label.toLowerCase()}`,
      sender: 'user',
      timestamp: new Date(),
      type: 'action',
      metadata: { action: action.action }
    };

    setMessages(prev => [...prev, actionMessage]);
    handleSendMessage(`I'd like to ${action.label.toLowerCase()}`);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!isOpen) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsOpen(true)}
          className="rounded-full w-14 h-14 shadow-lg bg-blue-600 hover:bg-blue-700"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96">
      <Card className="shadow-2xl border-0">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/bot-avatar.png" />
                <AvatarFallback className="bg-blue-600">
                  <Bot className="h-4 w-4 text-white" />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-sm font-semibold">AI Assistant</CardTitle>
                <CardDescription className="text-xs">
                  {isTyping ? 'Typing...' : 'Online'}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(!isMinimized)}
                className="h-8 w-8 p-0"
              >
                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <>
            <CardContent className="pt-0">
              {/* Quick Actions */}
              <div className="mb-4">
                <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <Button
                      key={action.id}
                      variant="outline"
                      size="sm"
                      onClick={() => handleQuickAction(action)}
                      className="h-auto p-2 flex flex-col items-center space-y-1 text-xs"
                    >
                      {action.icon}
                      <span>{action.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              {/* Messages */}
              <ScrollArea className="h-64 mb-4">
                <div className="space-y-3">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] rounded-lg px-3 py-2 ${
                          message.sender === 'user'
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100 text-gray-900'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {formatTime(message.timestamp)}
                        </p>
                        
                        {/* Quick Replies */}
                        {message.sender === 'bot' && message.metadata?.quickReplies && (
                          <div className="mt-2 space-y-1">
                            {message.metadata.quickReplies.map((reply, index) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                onClick={() => handleQuickReply(reply)}
                                className="h-6 text-xs mr-1 mb-1"
                              >
                                {reply}
                              </Button>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {isTyping && (
                    <div className="flex justify-start">
                      <div className="bg-gray-100 rounded-lg px-3 py-2">
                        <div className="flex items-center space-x-1">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm text-gray-600">AI is typing...</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              {/* Input */}
              <div className="flex space-x-2">
                <Input
                  ref={inputRef}
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendMessage(inputValue);
                    }
                  }}
                  placeholder="Type your message..."
                  className="flex-1"
                  disabled={isTyping}
                />
                <Button
                  onClick={() => handleSendMessage(inputValue)}
                  disabled={!inputValue.trim() || isTyping}
                  size="sm"
                  className="px-3"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </>
        )}
      </Card>
    </div>
  );
};

export default AIChatbot;
