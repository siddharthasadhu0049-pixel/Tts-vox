import express from "express";
import dotenv from "dotenv";
import { GoogleGenAI, ThinkingLevel } from "@google/genai";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || "3000", 10);

app.use(express.json({ limit: "50mb" }));

// Standard Gemini client for scriptwriting and assistant (v1beta)
const textAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Dedicated client for Gemini 3.8 Studio TTS models (requires v1alpha for speechConfig and speechMetadata)
const ttsAi = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  apiVersion: "v1alpha",
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Supported prebuilt voices in Gemini Studio TTS
export const SUPPORTED_VOICES = ["Kore", "Puck", "Charon", "Fenrir", "Zephyr"] as const;

/**
 * Health check endpoint
 */
app.get("/api/health", (_req, res) => {
  res.json({
    status: "ok",
    hasApiKey: Boolean(process.env.GEMINI_API_KEY),
    supportedModels: ["gemini-3.8-flash-lite-tts", "gemini-3.8-flash-tts"],
    supportedVoices: SUPPORTED_VOICES,
  });
});

/**
 * Text-to-Speech Generation endpoint
 * Supports:
 * - Single Speaker mode via gemini-3.8-flash-lite-tts or gemini-3.8-flash-tts
 * - Dual-Speaker Dialogue/Screenplay mode via gemini-3.8-flash-tts with multiSpeakerVoiceConfig
 * - Bengali, English, Hindi, Spanish, French, Arabic, and all other languages
 * - Natural vocal bursts: <laugh>, <gasp>, <breath>, <sigh>, <cough>
 * - Natural conversational backchannels: |mhm|, |yeah|, |right|
 */
app.post("/api/tts/generate", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured. Please ensure it is set in Settings > Secrets.",
      });
    }

    const {
      mode = "single", // "single" | "dialogue"
      model = "gemini-3.8-flash-lite-tts", // "gemini-3.8-flash-lite-tts" | "gemini-3.8-flash-tts"
      text,
      voice = "Kore",
      style,
      dialogueTurns,
      speakers,
      language = "bn-IN",
    } = req.body;

    const languageCode = language === "bn-IN" ? "bn-IN" : language === "bn-BD" ? "bn-BD" : language;

    if (mode === "dialogue") {
      // Validate dual-speaker requirements
      if (!Array.isArray(speakers) || speakers.length !== 2) {
        return res.status(400).json({
          error: "Dual-speaker dialogue requires exactly 2 speaker definitions.",
        });
      }

      if (!Array.isArray(dialogueTurns) || dialogueTurns.length === 0) {
        return res.status(400).json({
          error: "Dialogue mode requires at least one dialogue line.",
        });
      }

      const speaker1 = speakers[0];
      const speaker2 = speakers[1];

      // Format dialogue parts for multi-speaker synthesis with speechMetadata
      const parts = dialogueTurns.map((turn: { speaker: string; text: string; style?: string }) => {
        const turnText = turn.text.trim();
        const speakerPrefix = turnText.startsWith(`${turn.speaker}:`)
          ? turnText
          : `${turn.speaker}: ${turnText}`;

        return {
          text: speakerPrefix,
          speechMetadata: {
            speaker: turn.speaker,
            ...(turn.style ? { style: turn.style } : {}),
          },
        };
      });

      // Always use flagship gemini-3.8-flash-tts for dual speaker screenplay
      const response = await ttsAi.models.generateContent({
        model: "gemini-3.8-flash-tts",
        contents: [
          {
            role: "user",
            parts,
          },
        ],
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            languageCode,
            multiSpeakerVoiceConfig: {
              speakerVoiceConfigs: [
                {
                  speaker: speaker1.name,
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: speaker1.voiceName || "Puck" },
                  },
                },
                {
                  speaker: speaker2.name,
                  voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: speaker2.voiceName || "Kore" },
                  },
                },
              ],
            },
          },
        },
      });

      const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

      if (!base64Audio) {
        const textFallback = response.candidates?.[0]?.content?.parts?.[0]?.text;
        throw new Error(
          textFallback
            ? `Audio generation failed: ${textFallback}`
            : "No audio stream returned from Gemini TTS. Please verify script formatting."
        );
      }

      return res.json({
        success: true,
        mode: "dialogue",
        model: "gemini-3.8-flash-tts",
        audioBase64: base64Audio,
        mimeType: "audio/wav",
        format: "wav",
        sampleRate: 24000,
        language: languageCode,
      });
    }

    // Single Speaker Mode
    if (!text || typeof text !== "string" || !text.trim()) {
      return res.status(400).json({ error: "Text is required for TTS generation." });
    }

    const selectedModel = model === "gemini-3.8-flash-tts" ? "gemini-3.8-flash-tts" : "gemini-3.8-flash-lite-tts";
    const selectedVoice = SUPPORTED_VOICES.includes(voice) ? voice : "Kore";

    // Clean & clear pronunciation guidance for Bengali (India) and general languages
    let promptText = text.trim();
    if (language === "bn-IN" || languageCode === "bn-IN") {
      const indianBengaliStyle = style && style.trim()
        ? `Indian Bengali (পশ্চিমবঙ্গ প্রমিত বাংলা), clean, crisp and clear pronunciation, ${style.trim()}`
        : "Indian Bengali (পশ্চিমবঙ্গ প্রমিত বাংলা), crystal clear and clean pronunciation, Akashvani Kolkata / Shantiniketan standard articulate enunciation";
      promptText = `[Pronunciation: ${indianBengaliStyle}]\n${promptText}`;
    } else if (style && typeof style === "string" && style.trim()) {
      promptText = `[Style: ${style.trim()}]\n${promptText}`;
    }

    const response = await ttsAi.models.generateContent({
      model: selectedModel,
      contents: [
        {
          role: "user",
          parts: [{ text: promptText }],
        },
      ],
      config: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          languageCode,
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: selectedVoice },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      const textFallback = response.candidates?.[0]?.content?.parts?.[0]?.text;
      throw new Error(
        textFallback
          ? `Audio generation failed: ${textFallback}`
          : "No audio data returned from Gemini TTS. Please check your text prompt."
      );
    }

    return res.json({
      success: true,
      mode: "single",
      model: selectedModel,
      voice: selectedVoice,
      audioBase64: base64Audio,
      mimeType: "audio/wav",
      format: "wav",
      sampleRate: 24000,
    });
  } catch (error: any) {
    console.error("Gemini TTS Error:", error);
    const errorMessage = error?.message || "Internal audio generation error.";
    return res.status(500).json({
      error: errorMessage,
      details: error?.status || error?.code || undefined,
    });
  }
});

/**
 * Script Assistant & Enhancer endpoint
 * Uses gemini-3.8-flash to:
 * - Translate text into natural Bengali (or any other language) with natural conversational cadence
 * - Add natural breath and vocal burst tags (<breath>, <laugh>, <gasp>, <sigh>, |mhm|, |yeah|)
 * - Optimize script for audiobooks, documentaries, news, podcasts, or commercial voiceovers
 * - Polish punctuation for natural spoken pauses
 */
app.post("/api/script/enhance", async (req, res) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({
        error: "GEMINI_API_KEY is not configured.",
      });
    }

    const { action, text, targetLanguage, genre, speakerCount } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required for script enhancement." });
    }

    let prompt = "";
    if (action === "indian_bengali_pronunciation") {
      prompt = `You are a senior Bengali diction coach and audio director specializing in Indian Bengali (পশ্চিমবঙ্গ/কলকাতা প্রমিত চলিত বাংলা - All India Radio / Akashvani & Kolkata audiobook standard).
Refine the following text to ensure crystal clean and clear Indian Bengali pronunciation when spoken by a Text-to-Speech voice:
1. Ensure vocabulary and grammar adhere to modern standard West Bengal Bengali (প্রমিত চলিত ভাষা).
2. Clean up any ambiguous phonetics, ensuring conjuncts (ক্ষ, জ্ঞ, ঙ্গ, শ্র, ত্র, ঙ্ক) and halants are placed for effortless enunciation.
3. Strategically place <breath> tags before long clauses so the voice has natural inhalation pauses and never rushes.
4. Add proper punctuation (কমার , এবং দাঁড়ির । সঠিক ব্যবহার) to establish a dignified, articulate Indian Bengali rhythm.
Return ONLY the polished script ready for pristine TTS delivery.

Text:
${text}`;
    } else if (action === "translate_indian_bengali") {
      prompt = `Translate the following text into immaculate Indian Bengali (পশ্চিমবঙ্গ প্রমিত চলিত বাংলা - Kolkata literary & broadcast standard).
Ensure the phrasing sounds like a refined Akashvani Kolkata or Shantiniketan orator: clean, elegant, melodious, and easy to enunciate with absolute clarity.
Tastefully add <breath> tags where natural pauses occur.
Return ONLY the translated script text with no meta explanations or quotes.

Original Text:
${text}`;
    } else if (action === "translate_bengali") {
      prompt = `Translate the following text into natural, spoken, and evocative Bengali (বাংলা).
Ensure it sounds like a human voiceover artist or narrator speaking in modern standard Bengali (সাধু নয়, বরং প্রমিত চলিত বাংলা).
Preserve any vocal burst tags like <breath>, <laugh>, <gasp> or backchanneling markers if present, or add natural Bengali breath marks where appropriate.
Return ONLY the translated script text with no meta explanations or quotes.

Original Text:
${text}`;
    } else if (action === "inject_vocal_bursts") {
      prompt = `You are a professional voice director preparing a script for Gemini TTS.
The model supports natural vocal bursts:
- <breath> (for natural inhaling pauses before long sentences)
- <laugh> (for amusement or chuckles)
- <gasp> (for shock, surprise, or suspense)
- <sigh> (for relief, resignation, or dramatic release)
- <cough>
And for dialogue:
- |mhm|
- |yeah|
- |right|

Enhance the following text by tastefully placing these cues so it sounds 100% human, alive, and breathing.
Do not overdo it—keep it natural and fitting for ${genre || "narration"}.
Language of text: ${targetLanguage || "keep original language"}.
Return ONLY the enhanced script text with no explanations.

Text:
${text}`;
    } else if (action === "dialogue_split") {
      prompt = `Convert the following text or topic into a 2-speaker screenplay script suitable for Gemini TTS dual-speaker synthesis.
Format rules:
1. Exactly 2 speakers named "${speakerCount?.name1 || "Host"}" and "${speakerCount?.name2 || "Guest"}".
2. Each line must start with "SpeakerName: "
3. Include natural vocal bursts (<breath>, <laugh>, <gasp>) and backchanneling marks (|yeah|, |mhm|, |right|) to create genuine conversational chemistry.
Language: ${targetLanguage || "English or Bengali if requested"}.
Genre: ${genre || "podcast discussion"}.

Text / Topic:
${text}

Return ONLY the dialogue lines formatted as:
${speakerCount?.name1 || "Host"}: ...
${speakerCount?.name2 || "Guest"}: ...`;
    } else if (action === "pacing_punctuation") {
      prompt = `Format and punctuate the following script specifically for speech synthesis pacing.
Add em-dashes (—) and ellipses (...) for dramatic pauses, ensure commas and periods create rhythmic cadence, and insert <breath> marks where an orator would inhale.
Language: preserve original text language (including Bengali if in Bengali).
Genre: ${genre || "audiobook narration"}.
Return ONLY the formatted script with no markdown or introductory text.

Script:
${text}`;
    } else {
      // General rewrite / enhance
      prompt = `You are a master narration scriptwriter. Enhance the following script for a ${genre || "voiceover narration"}.
Make the vocabulary natural to pronounce, the flow melodic and engaging, and rhythmically satisfying when spoken aloud.
Language: ${targetLanguage || "keep original language"}.
Return ONLY the final enhanced script text.

Script:
${text}`;
    }

    const response = await textAi.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    const enhancedText = response.text?.trim() || text;

    res.json({
      success: true,
      action,
      enhancedText,
    });
  } catch (error: any) {
    console.error("Script Enhancement Error:", error);
    res.status(500).json({ error: error?.message || "Failed to enhance script" });
  }
});

/**
 * Generate a complete Narration Script from a prompt or topic
 */
app.post("/api/script/generate-sample", async (req, res) => {
  try {
    const { topic, genre, language } = req.body;
    const prompt = `Write a compelling 60-90 second narration script about "${topic || "The Cosmos and Human Curiosity"}" in ${language || "English"}.
Genre style: ${genre || "Documentary Voiceover"}.
Include natural punctuation for speech delivery, and tastefully include 2-3 <breath> or expressive cues where natural.
If the language is Bengali (বাংলা), use evocative, fluent, beautiful contemporary Bengali suitable for an audiobook, cultural documentary, or podcast.
Return ONLY the script text.`;

    const response = await textAi.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: prompt,
    });

    res.json({
      success: true,
      script: response.text?.trim() || "",
    });
  } catch (error: any) {
    console.error("Script generation error:", error);
    res.status(500).json({ error: error?.message || "Failed to generate script" });
  }
});

// Setup dev server with Vite or static production serving
async function startServer() {
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`VoxStudio server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
