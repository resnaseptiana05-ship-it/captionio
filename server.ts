import express, { Request, Response } from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

// Load environment variables for local testing
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialize Gemini client to avoid crashes if API key is not yet set
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not defined. Please add it via Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// API endpoint for generating captions using Gemini
app.post("/api/generate", async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      topic,
      platform,
      tone,
      framework,
      length,
      includeHashtags,
      hashtagCount,
      includeEmojis,
      language,
    } = req.body;

    if (!topic || typeof topic !== "string" || topic.trim() === "") {
      res.status(400).json({ error: "Layanan membutuhkan deskripsi topik atau produk yang jelas." });
      return;
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (err: any) {
      res.status(500).json({ 
        error: "Kunci API Gemini tidak ditemukan. " + err.message 
      });
      return;
    }

    const platformGuidelines: Record<string, string> = {
      instagram: "Instagram: Aesthetic, engaging, relies heavily on strong hooks as visual captions. Keep spacing clean using single line breaks. Include aesthetic emojis.",
      tiktok: "TikTok: Short, extremely punchy, casual, trendy. Relies on very catchy copywriting that inspires viewers to comment or watch the full video. Maximize loop-inducing phrases.",
      twitter: "Twitter/X: Strict character limit. Must be short, precise, opinionated, or witty. Use maximum 280 characters. Limit spacing, maximize speed of reading.",
      linkedin: "LinkedIn: Professional, thought-provoking, conversational but educational. Uses double spaces between punchy insights. No excessive slangs, great for business and personal branding.",
      facebook: "Facebook: Informative, community-focused, interactive. Good for storytelling, inviting community dialogue, asking questions, or sharing detailed updates.",
    };

    const frameworkGuidelines: Record<string, string> = {
      simple: "Simple Copy: Direct, clean, easily understandable social media description.",
      aida: "AIDA style: Attention (intriguing opening), Interest (contextual interest details), Desire (benefit/outcome), Action (clear next steps).",
      pas: "PAS style: Problem (identify user's paint-point), Agitate (expand on why it is frustrating), Solve (offer this solution/topic as the answer).",
      storytelling: "Storytelling: Immersive narrative opening, personal/relatable struggle or event, key revelation, and inspiring takeaway.",
      "hook-body-cta": "Hook-Body-CTA structure: A hyper-engaging first line, a highly readable spaced main body with features/details, and a precise single call-to-action.",
    };

    const lengthGuidelines: Record<string, string> = {
      short: "Ultra short: Max 1-2 snappy sentences. Ideal for fast reading.",
      medium: "Standard length: 1-2 short paragraphs. Great balance of details and speed.",
      long: "Detailed/Long-form: Comprehensive, detailed description with bullet points or formatted key takeaways.",
    };

    const langLabel = language === "id" ? "Indonesian (Bahasa Indonesia)" : "English";

    const systemInstruction = `You are a premium AI social media strategist, copywriter, and digital marketing expert. 
You excel at writing high-converting social media posts designed to boost metrics (likes, shares, click-through-rates, bookmarks).
Your text formatting is always clean and styled uniquely for each platform (e.g. bold hooks, tidy line breaks).`;

    const userPrompt = `Generate 3 distinct, high-converting social media caption options for this topic or product: "${topic}".

Platform instructions: ${platformGuidelines[platform] || ""}
Tone style: ${tone}
Copywriting Framework: ${frameworkGuidelines[framework] || ""}
Caption Length requirement: ${lengthGuidelines[length] || ""}
Include Emojis: ${includeEmojis ? "Yes, place them natively and contextually throughout the captions." : "No, do not use any emojis at all."}
Include Hashtags: ${includeHashtags ? `Yes, please suggest exactly ${hashtagCount} highly keyword-relevant hashtags appended at the end.` : "No hashtags. Do not append any hashtags."}
Output Language: ${langLabel}. ALL string content inside the JSON response MUST be entirely written in ${langLabel}.

Return the response in JSON matching this schema:
{
  "captions": [
    {
      "id": "A unique identifier (e.g. option-1, option-2, option-3)",
      "text": "The full caption ready to copy, structured with paragraphs, emojis, hooks, body, and hashtags if requested.",
      "hook": "The single starting line designed to capture immediate attention.",
      "body": "The middle part detailing features, story, or benefits.",
      "cta": "The specific ending call-to-action phrase."
    }
  ],
  "alternativeHooks": ["Alternative hook 1", "Alternative hook 2", "Alternative hook 3"],
  "alternativeCtas": ["Alternative CTA 1", "Alternative CTA 2", "Alternative CTA 3"],
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"]
}`;

    const geminiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.8,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            captions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  text: { type: Type.STRING, description: "Fully localized caption in chosen language including hook, body, CTA, and final hashtags if configured." },
                  hook: { type: Type.STRING, description: "High-impact hook sentence." },
                  body: { type: Type.STRING, description: "Informative body copy." },
                  cta: { type: Type.STRING, description: "Direct Action Phrase to tell users what to do next." }
                },
                required: ["id", "text", "hook", "body", "cta"]
              }
            },
            alternativeHooks: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 3 engaging alternative opening hooks in the target language."
            },
            alternativeCtas: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Array of 3 action-centered alternative call-to-actions in the target language."
            },
            hashtags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Suggested trending hashtags (without the hash symbol as individual strings)."
            }
          },
          required: ["captions", "alternativeHooks", "alternativeCtas", "hashtags"]
        }
      }
    });

    const textOutput = geminiResponse.text;
    if (!textOutput) {
      throw new Error("Model failed to return output text.");
    }

    const parsedData = JSON.parse(textOutput.trim());
    res.json(parsedData);
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ 
      error: "Gagal membuat caption. Silakan coba deskripsi yang lebih spesifik atau periksa sambungan internet Anda.",
      details: error.message 
    });
  }
});

// Configure Vite integration or static file serving
const setupApp = async () => {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

setupApp();
