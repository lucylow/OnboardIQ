// Streaming Chat Service - Real-time AI chat with streaming responses
interface StreamingMessage {
  type: 'start' | 'chunk' | 'complete' | 'error';
  content?: string;
  fullText?: string;
  progress?: number;
  message?: string;
}

interface ChatContext {
  messages?: Array<{ role: string; content: string }>;
  userProfile?: {
    firstName?: string;
    companyName?: string;
    planTier?: string;
  };
}

class StreamingChatService {
  private baseUrl: string;

  constructor() {
    this.baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3001';
  }

  /**
   * Send a message and get a streaming response
   */
  async sendStreamingMessage(
    message: string,
    context: ChatContext = {},
    onChunk?: (chunk: string, fullText: string, progress: number) => void,
    onComplete?: (fullText: string) => void,
    onError?: (error: string) => void
  ): Promise<string> {
    try {
      console.log('Attempting to connect to streaming endpoint:', `${this.baseUrl}/api/streaming-chat/stream`);
      
      const response = await fetch(`${this.baseUrl}/api/streaming-chat/stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
          userProfile: context.userProfile || {}
        }),
      });

      console.log('Response status:', response.status, response.statusText);

      if (!response.ok) {
        console.error('HTTP error response:', await response.text());
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('No reader available');
      }

      const decoder = new TextDecoder();
      let fullText = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) break;
          
          const chunk = decoder.decode(value, { stream: true });
          console.log('Received chunk:', chunk);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data: StreamingMessage = JSON.parse(line.slice(6));
                console.log('Parsed streaming data:', data);
                
                switch (data.type) {
                  case 'start':
                    console.log('Streaming started');
                    break;
                    
                  case 'chunk':
                    if (data.content && data.fullText !== undefined) {
                      fullText = data.fullText;
                      onChunk?.(data.content, data.fullText, data.progress || 0);
                    }
                    break;
                    
                  case 'complete':
                    console.log('Streaming completed');
                    onComplete?.(fullText);
                    break;
                    
                  case 'error':
                    console.error('Streaming error:', data.message);
                    onError?.(data.message || 'Unknown error');
                    break;
                }
              } catch (parseError) {
                console.warn('Failed to parse streaming data:', parseError, 'Raw line:', line);
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }

      return fullText;
    } catch (error) {
      console.error('Streaming chat service error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      onError?.(errorMessage);
      
      // Fallback to simulation for demo purposes
      console.log('Falling back to simulation mode');
      return await this.simulateStreaming(message, onChunk, onComplete);
    }
  }

  /**
   * Send a regular (non-streaming) message
   */
  async sendMessage(message: string, context: ChatContext = {}): Promise<string> {
    try {
      const response = await fetch(`${this.baseUrl}/api/streaming-chat/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context,
          userProfile: context.userProfile || {}
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.success) {
        throw new Error(data.error || 'Failed to get response');
      }

      return data.response;
    } catch (error) {
      console.error('Chat service error:', error);
      throw error;
    }
  }

  /**
   * Check if the streaming service is healthy
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseUrl}/api/streaming-chat/health`);
      const data = await response.json();
      return data.success && data.health?.streaming === true;
    } catch (error) {
      console.error('Health check failed:', error);
      return false;
    }
  }

  /**
   * Simulate streaming for demo purposes when backend is not available
   */
  async simulateStreaming(
    message: string,
    onChunk?: (chunk: string, fullText: string, progress: number) => void,
    onComplete?: (fullText: string) => void
  ): Promise<string> {
    const responses = [
      "I'm here to help you with OnboardIQ! I can assist with onboarding, document generation, video sessions, and more.",
      "Let me help you with that. I can guide you through the onboarding process, generate documents, or schedule video calls.",
      "Great question! I can provide personalized assistance for your onboarding journey. What specific help do you need?",
      "I understand you're looking for help. I'm equipped to assist with various aspects of the OnboardIQ platform.",
      "I'm ready to help! Whether it's onboarding guidance, document creation, or technical support, I'm here for you."
    ];

    const fullResponse = responses[Math.floor(Math.random() * responses.length)];
    const words = fullResponse.split(' ');
    let currentText = '';

    return new Promise((resolve) => {
      let index = 0;
      
      const streamNext = () => {
        if (index < words.length) {
          const word = words[index];
          currentText += (index > 0 ? ' ' : '') + word;
          
          onChunk?.(word + ' ', currentText, (index + 1) / words.length);
          
          index++;
          setTimeout(streamNext, 100 + Math.random() * 200);
        } else {
          onComplete?.(currentText);
          resolve(currentText);
        }
      };
      
      streamNext();
    });
  }
}

export const streamingChatService = new StreamingChatService();
export default streamingChatService;
