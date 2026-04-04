import Groq from "groq-sdk";
import dotenv from "dotenv";
dotenv.config();

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
const MODEL = process.env.GROQ_MODEL || "llama-3.1-8b-instant";

export async function getYaarResponse(userMessage, personalityProfile, recentMessages) {
  const messages = buildMessages(userMessage, personalityProfile, recentMessages);
  const response = await groq.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 500,
    temperature: 0.85,
  });
  return response.choices[0].message.content;
}

export async function streamYaarResponse(userMessage, personalityProfile, recentMessages, res) {
  const messages = buildMessages(userMessage, personalityProfile, recentMessages);

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const stream = await groq.chat.completions.create({
    model: MODEL,
    messages,
    max_tokens: 300,
    temperature: 0.85,
    stream: true,
  });

  let fullResponse = "";

  for await (const chunk of stream) {
    const token = chunk.choices[0]?.delta?.content || "";
    if (token) {
      fullResponse += token;
      res.write(`data: ${JSON.stringify({ token })}\n\n`);
    }
  }

  res.write("data: [DONE]\n\n");
  res.end();

  return fullResponse;
}

function buildMessages(userMessage, personalityProfile, recentMessages) {
  return [
    { role: "system", content: buildSystemPrompt(personalityProfile) },
    ...recentMessages,
    { role: "user", content: userMessage },
  ];
}

function buildSystemPrompt(profile) {
  const personalitySection = profile
    ? `
WHAT YOU KNOW ABOUT THIS PERSON:
- Language style: ${profile.language_style || "not yet known"}
- Humour type: ${profile.humour_type || "not yet known"}
- Emotional pattern: ${profile.emotional_pattern || "not yet known"}
- Response preference: ${profile.response_pref || "not yet known"}

Adapt your tone, language, and humour naturally to match them.`
    : `You are still getting to know this person. Be warm and neutral.
Observe how they write and gently mirror their style.`;

  return `You are Yaar — a warm, non-judgmental AI best friend for young Indians.
You are NOT a therapist or a doctor. You are a friend who listens, understands, and cares.

YOUR PERSONALITY:
- Warm, present, and genuinely curious about the person
- Never preachy, never lecture, never give unsolicited advice
- Match the user's language naturally — Hindi, Hinglish, English, or mix
- Keep responses short and conversational unless they clearly need more
- Use humour when it fits — but read the room
- Validate feelings first, ask questions second, give advice only when asked
- Remember details they share and bring them up naturally later
${personalitySection}

HARD RULES:
- Never diagnose, prescribe, or give medical/psychological advice
- Never say "have you considered therapy?" as a first response — too cold
- If someone seems in distress (but not crisis), gently ask how they're really doing
- If someone is in crisis, softly mention iCall: 9152987821
- Never pretend to be human if directly and sincerely asked`;
}