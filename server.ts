import express from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json());

// Fallback response engine for domain questions when API key is not set or network fails
function getSmartFallbackReply(message: string): string {
  const query = message.toLowerCase();

  if (query.includes('size') || query.includes('weight') || query.includes('small') || query.includes('large') || query.includes('medium')) {
    return `🐰 *RabbitNest Size Guide:*
• *Small (1.5 kg – 2.2 kg):* Compact, lively, ideal for indoor apartments with cozy enclosures.
• *Medium (2.3 kg – 3.2 kg):* Perfect family companions, very calm and easy to handle.
• *Large (3.5 kg – 4.5 kg):* Gentle giants, calm lap-sitters, majestic and loving.

All sizes receive full health checks, deworming, and a starter diet pack!`;
  }

  if (query.includes('offer') || query.includes('discount') || query.includes('coupon') || query.includes('bulk') || query.includes('price')) {
    return `🎁 *Active Savings & Offers:*
• *Bulk Discount Tiers:*
  - 3 to 4 Rabbits: *5% OFF*
  - 5 Rabbits: *10% OFF*
  - 6 Rabbits: *12% OFF*
  - 7+ Rabbits: *15% Special Bulk Offer*
• *Promo Coupons:*
  - Use code **RABBIT10** for 10% OFF
  - Use code **HOPPY50** for Flat ₹50 OFF
  - Use code **BUNNY100** for Flat ₹100 OFF on orders ₹1,000+
• Safe climate-controlled delivery is *FREE* across India!`;
  }

  if (query.includes('eat') || query.includes('food') || query.includes('diet') || query.includes('care') || query.includes('feed')) {
    return `🌿 *Essential Rabbit Care & Diet Tips:*
• *80% Hay:* Unlimited Timothy or meadow hay keeps digestion healthy and trims teeth.
• *Fresh Greens:* Daily cilantro, mint, romaine lettuce, and basil.
• *Clean Drinking Water:* Heavy ceramic bowl or ball-point sipper changed daily.
• *Temperature:* Keep indoor temperature between 15°C and 23°C; avoid direct harsh sun.
• *Gentle Handling:* Always support both hind legs and chest (the 'football hold'). Never pick up by the ears!`;
  }

  if (query.includes('contact') || query.includes('support') || query.includes('email') || query.includes('phone') || query.includes('call')) {
    return `📞 *RabbitNest Official Contact Details:*
• *WhatsApp:* 8134991695
• *Phone:* 8134991695
• *Email:* rahuldeyr8@gmail.com
Feel free to contact us anytime for rabbit care questions or adoption orders!`;
  }

  if (query.includes('payment') || query.includes('order') || query.includes('whatsapp') || query.includes('how to buy') || query.includes('delivery')) {
    return `🚚 *How to Order at RabbitNest:*
1. Select your rabbit (Pure White or Black & White) and preferred size.
2. Click **Add to Cart** or **Buy Now**.
3. Fill your delivery address and confirm the order.
4. An automated verification screen will prepare your adoption reference.
5. You will be directed to our official WhatsApp (8134991695) to confirm delivery dispatch. No payment gateway needed—we coordinate directly with you!`;
  }

  if (query.includes('pure white') || query.includes('white') || query.includes('black') || query.includes('breed') || query.includes('color')) {
    return `🐇 *Our Pure Rabbit Breeds:*
We specialize exclusively in two pure rabbit lines:
1. **Pure White Rabbits:** Silky, spotless snow-white coats with gentle pink inner ears. Extremely cuddly and serene.
2. **Black & White Rabbits:** Classic Dutch and tuxedo patterns with symmetrical markings and playful, inquisitive personalities.

Both breeds are strictly indoor-raised, litter trained, and vet certified!`;
  }

  return `🐰 *Welcome to RabbitNest Assistant!*
I am here to help you choose between our **Pure White** and **Black & White** rabbits, understand size tiers (Small, Medium, Large), apply bulk discounts & coupons, or review rabbit care and diet advice.

How can I help you with your bunny adoption today?`;
}

// AI Shopping Assistant Chat API Proxy
app.post('/api/chat', async (req, res) => {
  try {
    const { message, history } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const apiKey = process.env.GEMINI_API_KEY;

    // If no API key is provided, use the smart local domain engine
    if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
      const fallbackReply = getSmartFallbackReply(message);
      return res.json({ reply: fallbackReply });
    }

    const ai = new GoogleGenAI({ apiKey });

    const systemInstruction = `You are BunnyAssist, the official AI Shopping & Care Assistant for RabbitNest (India's premier ethical rabbit adoption store).
Store Knowledge:
- Breeds Available: STRICTLY ONLY two rabbit types: 'Pure White Rabbit' and 'Black & White Rabbit'. Never suggest any other breeds or colors.
- Sizes: Small (1.5 - 2.2 kg), Medium (2.3 - 3.2 kg), Large (3.5 - 4.5 kg).
- Bulk Savings: 3-4 rabbits (5% off), 5 rabbits (10% off), 6 rabbits (12% off), 7+ rabbits (15% off).
- Active Coupons: RABBIT10 (10% off), HOPPY50 (Flat ₹50 off), BUNNY100 (Flat ₹100 off on ₹1000+).
- Delivery: Free climate-controlled safe doorstep delivery across India with 7-day health guarantee and starter timothy hay pack.
- Ordering Flow: Customers order directly via our official WhatsApp (8134991695). There are NO online payment gateways or cash-on-delivery options; everything is coordinated directly on WhatsApp for animal safety.
- Contact Details: WhatsApp: 8134991695, Phone: 8134991695, Email: rahuldeyr8@gmail.com.
- Diet & Care: 80% hay (unlimited), leafy greens (coriander, mint, basil), clean water in bowls, never lift by ears, keep between 15-23°C.
- STRICT LIMITATION: You are an informational assistant only. You CANNOT change prices, alter existing orders, create payment methods, or override store discounts.
Tone: Warm, welcoming, helpful, concise, well-formatted with bullet points and friendly rabbit emojis.`;

    // Construct conversation contents
    const contents: any[] = [];
    if (Array.isArray(history)) {
      for (const msg of history.slice(-6)) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          contents.push({
            role: msg.role === 'assistant' ? 'model' : 'user',
            parts: [{ text: msg.text }],
          });
        }
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || getSmartFallbackReply(message);
    res.json({ reply });
  } catch (error: any) {
    console.error('Gemini API error, falling back to local domain reply:', error?.message);
    const fallback = getSmartFallbackReply(req.body?.message || '');
    res.json({ reply: fallback });
  }
});

// Setup Vite middleware in dev or static in prod
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: 3000 },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`RabbitNest server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
