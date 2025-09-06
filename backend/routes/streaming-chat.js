// Streaming Chat API Route - Real-time AI chat with streaming responses
const express = require('express');
const router = express.Router();
const OpenAIService = require('../services/openaiService');

// Initialize OpenAI service
const openaiService = new OpenAIService();

// Streaming chat endpoint
router.post('/stream', async (req, res) => {
  try {
    const { message, userId, context, userProfile } = req.body;
    
    // Set headers for streaming
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Create a readable stream
    const stream = new ReadableStream({
      start(controller) {
        // Send initial message
        controller.enqueue(new TextEncoder().encode('data: {"type":"start","message":"Starting response..."}\n\n'));
        
        // Generate streaming response
        generateStreamingResponse(message, context, userProfile, controller)
          .then(() => {
            // Send completion signal
            controller.enqueue(new TextEncoder().encode('data: {"type":"complete","message":"Response complete"}\n\n'));
            controller.close();
          })
          .catch((error) => {
            console.error('Streaming error:', error);
            controller.enqueue(new TextEncoder().encode(`data: {"type":"error","message":"Error: ${error.message}"}\n\n`));
            controller.close();
          });
      }
    });
    
    // Pipe the stream to the response
    const reader = stream.getReader();
    
    const pump = async () => {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          res.write(value);
        }
      } catch (error) {
        console.error('Stream pump error:', error);
        res.end();
      }
    };
    
    pump();
    
  } catch (error) {
    console.error('Streaming chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Generate streaming response
async function generateStreamingResponse(message, context, userProfile, controller) {
  try {
    // Simulate streaming by breaking the response into chunks
    const fullResponse = await openaiService.generateConversationalResponse(
      message,
      context || {},
      userProfile || {}
    );
    
    // Split response into words for realistic streaming
    const words = fullResponse.split(' ');
    let currentText = '';
    
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      currentText += (i > 0 ? ' ' : '') + word;
      
      // Send chunk
      const chunk = {
        type: 'chunk',
        content: word + (i < words.length - 1 ? ' ' : ''),
        fullText: currentText,
        progress: (i + 1) / words.length
      };
      
      controller.enqueue(new TextEncoder().encode(`data: ${JSON.stringify(chunk)}\n\n`));
      
      // Simulate realistic typing delay
      await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
    }
    
  } catch (error) {
    console.error('Error generating streaming response:', error);
    throw error;
  }
}

// Fallback non-streaming endpoint
router.post('/chat', async (req, res) => {
  try {
    const { message, userId, context, userProfile } = req.body;
    
    const response = await openaiService.generateConversationalResponse(
      message,
      context || {},
      userProfile || {}
    );
    
    res.json({
      success: true,
      response,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      response: openaiService.getFallbackResponse(message, context || {})
    });
  }
});

// Health check for streaming service
router.get('/health', async (req, res) => {
  try {
    const health = {
      streaming: true,
      openai: openaiService.isConfigured(),
      timestamp: new Date().toISOString()
    };
    
    res.json({
      success: true,
      health,
      status: 'operational'
    });
  } catch (error) {
    console.error('Streaming health check error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      status: 'degraded'
    });
  }
});

module.exports = router;
