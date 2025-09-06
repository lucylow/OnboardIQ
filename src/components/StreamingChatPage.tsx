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
  Sparkles,
  Zap,
  ArrowLeft
} from 'lucide-react';
import { streamingChatService } from '@/services/streamingChatService';
import { useNavigate } from 'react-router-dom';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

const StreamingChatPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Welcome to OnboardIQ's streaming chat! I can help you with onboarding, document generation, video sessions, and more. Ask me anything!",
      timestamp: new Date(),
      isStreaming: false
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Create streaming message
    const streamingMessage: Message = {
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true
    };

    setMessages(prev => [...prev, streamingMessage]);

    try {
      await streamingChatService.sendStreamingMessage(
        input,
        { 
          messages: messages.slice(-5),
          userProfile: { firstName: 'User', companyName: 'Demo Company', planTier: 'free' }
        },
        // onChunk
        (chunk: string, fullText: string, progress: number) => {
          setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 && msg.isStreaming
              ? { ...msg, content: fullText }
              : msg
          ));
        },
        // onComplete
        (fullText: string) => {
          setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 && msg.isStreaming
              ? { ...msg, content: fullText, isStreaming: false }
              : msg
          ));
        },
        // onError
        (error: string) => {
          console.error('Streaming error:', error);
          setMessages(prev => prev.map((msg, index) => 
            index === prev.length - 1 && msg.isStreaming
              ? { 
                  ...msg, 
                  content: "I'm here to help you with OnboardIQ! How can I assist you today?",
                  isStreaming: false 
                }
              : msg
          ));
        }
      );
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => prev.map((msg, index) => 
        index === prev.length - 1 && msg.isStreaming
          ? { 
              ...msg, 
              content: "I'm here to help you with OnboardIQ! How can I assist you today?",
              isStreaming: false 
            }
          : msg
      ));
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 to-purple-600">
      <div className="container mx-auto px-4 py-8 h-screen flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between text-white mb-8">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center">
                <Sparkles className="h-8 w-8 mr-3" />
                💬 TextStream Chat
              </h1>
              <p className="text-xl opacity-90 flex items-center">
                <Zap className="h-5 w-5 mr-2" />
                Real-time AI chat with streaming responses!
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
            <MessageCircle className="h-3 w-3 mr-1" />
            Streaming Active
          </Badge>
        </div>
        
        {/* Chat Container */}
        <Card className="flex-1 shadow-2xl border-0 bg-white/10 backdrop-blur-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src="/bot-avatar.png" />
                  <AvatarFallback className="bg-green-500">
                    <Bot className="h-5 w-5 text-white" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white">AI Assistant</CardTitle>
                  <CardDescription className="text-white/70">
                    {isLoading ? 'Streaming response...' : 'Online & Ready'}
                  </CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="border-white/30 text-white">
                Real-time
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="pt-0 flex flex-col h-full">
            {/* Messages */}
            <ScrollArea className="flex-1 mb-4">
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex items-start space-x-3 ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    {message.role === 'assistant' && (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot size={16} className="text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-xs lg:max-w-2xl px-4 py-3 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-white'
                      }`}
                    >
                      <p className="whitespace-pre-wrap text-sm">
                        {message.content}
                        {message.isStreaming && (
                          <span className="inline-block w-2 h-4 bg-blue-400 ml-1 animate-pulse"></span>
                        )}
                      </p>
                      <p className="text-xs opacity-70 mt-2">
                        {formatTime(message.timestamp)}
                        {message.isStreaming && (
                          <span className="ml-2 text-blue-300">Streaming...</span>
                        )}
                      </p>
                    </div>
                    {message.role === 'user' && (
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <User size={16} className="text-white" />
                      </div>
                    )}
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="bg-gray-700 text-white px-4 py-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                        <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            {/* Input */}
            <div className="flex space-x-4">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message here..."
                className="flex-1 bg-white/20 text-white placeholder-white/60 border-white/30 focus:border-white/50"
                disabled={isLoading}
              />
              <Button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-500 text-white px-6 py-2 font-semibold transition-colors flex items-center space-x-2"
              >
                <Send size={20} />
                <span>Send</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StreamingChatPage;
