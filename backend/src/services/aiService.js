const axios = require('axios');
const cache = require('../utils/cache');
require('dotenv').config();

const GEMINI_API_KEY = process.env.GOOGLE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent';

class AIService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    this.baseUrl = GEMINI_API_URL;
  }

  async callGeminiAPI(prompt) {
    if (!this.apiKey) {
      throw new Error('Gemini API key not configured');
    }

    try {
      const requestData = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.9,
          topK: 1,
          topP: 1,
          maxOutputTokens: 2048,
        }
      };

      const response = await axios.post(
        `${this.baseUrl}?key=${this.apiKey}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000 
        }
      );

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        console.error('Invalid response structure:', response.data);
        throw new Error('Invalid response format from Gemini API');
      }

      return content.trim();
    } catch (error) {
      console.error('Gemini API Error:', error.message);

      if (error.response?.status === 404) {
        console.log('Trying with gemini-1.5-flash model...');
        return this.callGeminiAPIFallback(prompt);
      }

      throw error;
    }
  }

  async callGeminiAPIFallback(prompt) {
    const fallbackUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent';
    
    try {
      const requestData = {
        contents: [{
          parts: [{
            text: prompt
          }]
        }]
      };

      const response = await axios.post(
        `${fallbackUrl}?key=${this.apiKey}`,
        requestData,
        {
          headers: {
            'Content-Type': 'application/json'
          },
          timeout: 30000
        }
      );

      const content = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) {
        throw new Error('Invalid response format from fallback Gemini API');
      }

      return content.trim();
    } catch (fallbackError) {
      console.error('Fallback API also failed:', fallbackError.response?.data);
      throw fallbackError;
    }
  }

  async generateCaption(tags) {    
    const key = `caption:${tags.sort().join(',')}`;
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }

    if (!this.apiKey) {
      console.warn('Gemini API key not configured, using fallback');
      const caption = this.fallbackCaption(tags);
      cache.set(key, caption);
      return caption;
    }

    try {
      const prompt = `Generate a witty, funny meme caption based on these tags: ${tags.join(', ')}. 
      Make it relatable, humorous, and under 100 characters. 
      Don't include quotes or extra formatting, just return the caption text.`;

      const caption = await this.callGeminiAPI(prompt);
      cache.set(key, caption, 300000); 
      return caption;
    } catch (error) {
      console.error('Caption generation failed:', error.message);
      const fallback = this.fallbackCaption(tags);
      cache.set(key, fallback, 60000); 
      return fallback;
    }
  }

  async generateVibe(tags) {    
    const key = `vibe:${tags.sort().join(',')}`;
    const cached = cache.get(key);
    if (cached) {
      return cached;
    }

    if (!this.apiKey) {
      console.warn('Gemini API key not configured, using fallback');
      const vibe = this.fallbackVibe(tags);
      cache.set(key, vibe);
      return vibe;
    }

    try {
      const prompt = `Analyze the vibe/mood of a meme with these tags: ${tags.join(', ')}. 
      Respond with a short 2-4 word phrase that captures the aesthetic or mood. 
      Examples: "Chaotic energy", "Wholesome vibes", "Dark humor", "Nostalgic feels".`;

      const vibe = await this.callGeminiAPI(prompt);
      cache.set(key, vibe, 300000); 
      return vibe;
    } catch (error) {
      console.error('Vibe generation failed:', error.message);
      const fallback = this.fallbackVibe(tags);
      cache.set(key, fallback, 60000); 
      return fallback;
    }
  }

  fallbackCaption(tags) {
    const tagBasedCaptions = {
      funny: ["When life gives you lemons, make memes", "That awkward moment when..."],
      coding: ["When your code works on the first try", "Debugging: 1% coding, 99% crying"],
      work: ["Monday mood activated", "Coffee dependency loading..."],
      gaming: ["When the boss has 1 HP left", "Achievement unlocked: Procrastination"],
      default: [
        "When the caffeine kicks in but deadlines remain the same.",
        "Mood: I need more coffee and fewer meetings.",
        "That feeling when code works on first run... just kidding.",
        "Debugging: because punching the keyboard is frowned upon."
      ]
    };

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (tagBasedCaptions[lowerTag]) {
        const options = tagBasedCaptions[lowerTag];
        return options[Math.floor(Math.random() * options.length)];
      }
    }

    const defaultCaptions = tagBasedCaptions.default;
    return defaultCaptions[Math.floor(Math.random() * defaultCaptions.length)];
  }

  fallbackVibe(tags) {
    const tagBasedVibes = {
      funny: ["Comedy gold", "Laughs incoming", "Humor zone"],
      dark: ["Dark humor", "Edgy vibes", "Shadow realm"],
      wholesome: ["Pure wholesomeness", "Warm feels", "Good vibes"],
      coding: ["Tech chaos", "Code life", "Developer mood"],
      gaming: ["Gamer energy", "Play mode", "Level up"],
      work: ["Grind mode", "Office life", "Work struggles"],
      default: ["Neon-noir chaos", "Digital rebellion", "Cyber-lolz", "Hackathon fever"]
    };

    for (const tag of tags) {
      const lowerTag = tag.toLowerCase();
      if (tagBasedVibes[lowerTag]) {
        const options = tagBasedVibes[lowerTag];
        return options[Math.floor(Math.random() * options.length)];
      }
    }

    const defaultVibes = tagBasedVibes.default;
    return defaultVibes[Math.floor(Math.random() * defaultVibes.length)];
  }
}

const aiService = new AIService();

module.exports = {
  generateCaption: (tags) => aiService.generateCaption(tags),
  generateVibe: (tags) => aiService.generateVibe(tags)
};