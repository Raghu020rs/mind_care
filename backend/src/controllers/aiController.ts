import { Request, Response } from 'express';

export const mentalHealthChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to basic responses if no API key
      return handleBasicResponse(message, res);
    }

    // Use OpenAI API for advanced responses
    const openAIResponse = await fetch('https://api.openai极.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate mental health assistant. Provide supportive, empathetic responses to users seeking mental health guidance. Offer practical advice, coping strategies, and resources. Always encourage seeking professional help when needed. Keep responses concise and helpful.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const data = await openAIResponse.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiResponse = data.choices[0]?.message?.content || "I'm here to help. Could you tell me more about how you're feeling?";
    
    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: 'openai'
    });
 
   
  } catch (error) {
    console.error('AI Chat error:', error);
    res.status(500).json({ 
      error: 'Sorry, I encountered an error. Please try again.',
      timestamp: new Date().toISOString()
    });
  }
};

export const mentalHealthChat = async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is available
    if (!process.env.OPENAI_API_KEY) {
      // Fallback to basic responses if no API key
      return handleBasicResponse(message, res);
    }

    // Use OpenAI API for advanced responses
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a compassionate mental health assistant. Provide supportive, empathetic responses to users seeking mental health guidance. Offer practical advice, coping strategies, and resources. Always encourage seeking professional help when needed. Keep responses concise and helpful.'
          },
          {
            role: 'user',
            content: message
          }
        ],
        max_tokens: 150,
        temperature: 0.7
      })
    });

    const data = await openAIResponse.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiResponse = data.choices[0]?.message?.content || "I'm here to help. Could you tell me more about how you're feeling?";
    
    res.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString(),
      source: 'openai'
    });
 
   
  } catch (error) {
    console.error('AI Chat error:', error);
    // Fallback to basic response if OpenAI fails
    handleBasicResponse(message, res);
  }
};

// Basic response fallback when OpenAI is not available
const handleBasicResponse = (message: string, res: Response) => {
  const responses: { [key: string]: string } = {
    stress: "I understand you're feeling stressed. Try the 4-7-8 breathing technique: Breathe in for 4 seconds, hold for 7 seconds, exhale for 8 seconds. Repeat 3-4 times.",
    anxiety: "For anxiety, try grounding techniques. Name 5 things you can see, 4 you can touch, 3 you can hear, 2 you can smell, and 1 you can taste.",
    depressed: "If you're feeling depressed, remember that small activities can help. Even a 10-minute walk or listening to music can improve your mood. Would you like to talk about what's been bothering you?",
    sleep: "For better sleep, try maintaining a consistent sleep schedule and avoid screens 1 hour before bed. A warm shower before bed can also help relax your body.",
    panic: "During panic attacks, focus on your breathing. Breathe in slowly through your nose for 4 counts, hold for 2 counts, and exhale slowly through your mouth for 6 counts.",
    default: "I'm here to support your mental wellbeing. You can talk to me about stress, anxiety, depression, sleep issues, or anything else that's on your mind. How are you feeling today?"
  };

  const lowerMessage = message.toLowerCase();
  let response = responses.default;

  // More comprehensive keyword matching
  if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelm')) response = responses.stress;
  if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('nervous')) response = responses.anxiety;
  if (lowerMessage.includes('depress') || lowerMessage.includes('sad') || lowerMessage.includes('hopeless')) response = responses.depressed;
  if (lowerMessage.includes('sleep') || lowerMessage.includes('insomnia') || lowerMessage.includes('tired')) response = responses.sleep;
  if (lowerMessage.includes('panic') || lowerMessage.includes('attack') || lowerMessage.includes('scared')) response = responses.panic;

  // Add empathetic opening
  const empatheticOpenings = [
    "I hear you. ",
    "That sounds difficult. ",
    "I understand. ",
    "Thank you for sharing that. "
  ];
  
  const randomOpening = empatheticOpenings[Math.floor(Math.random() * empatheticOpenings.length)];

  res.json({ 
    response: randomOpening + response,
    timestamp: new Date().toISOString(),
    source: 'basic'
  });
};
