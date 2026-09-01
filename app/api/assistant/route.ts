import OpenAI from "openai";

type Message = { role: "assistant" | "user"; content: string };

const catalogue = `Haojue NK150 — UGX 8,430,000
Haojue DK150 — UGX 8,130,000
Haojue Express — UGX 5,780,000
Haojue Express Plus — UGX 5,980,000
Haojue EG150 — UGX 6,330,000
Haojue EG125 — UGX 5,980,000
Example Express financing: deposit from UGX 950,000, UGX 105,000 weekly, duration 2 years.
Sales locations: Iganga and Kamuli. Phone/WhatsApp: 0745 400 500.`;

const instructions = `You are Luuba AI, the concise bilingual English and Luganda motorcycle sales assistant for Luuba TV 256 in Uganda.
Use only the verified catalogue below. Never invent specifications, stock, lender names, approval outcomes, interest rates, or loan requirements.
Make clear that prices and financing terms can change and must be confirmed by a sales representative.
Help customers compare models by intended use, budget, and the limited descriptions supplied. If you do not know, say so and direct them to WhatsApp 0745 400 500.
Do not collect sensitive identity documents or promise loan approval. Keep answers under 120 words unless the customer asks for detail.

${catalogue}`;

function fallbackReply(input: string) {
  const text = input.toLowerCase();
  if (text.includes("6m") || text.includes("6 m") || text.includes("6,000,000") || text.includes("budget")) {
    return "Around UGX 6 million, compare the Haojue Express (UGX 5,780,000), Express Plus (UGX 5,980,000), and EG125 (UGX 5,980,000). Express models are positioned for business use; EG125 is an accessible everyday option. Prices can change—WhatsApp 0745 400 500 to confirm stock and the current offer.";
  }
  if (text.includes("loan") || text.includes("deposit") || text.includes("weekly") || text.includes("finance")) {
    return "The listed Express example starts from UGX 950,000 deposit, UGX 105,000 weekly for 2 years. Final terms, requirements, and approval depend on the current lender. Use the loan form on this page or WhatsApp 0745 400 500 to confirm before paying.";
  }
  if (text.includes("express") && text.includes("eg125")) {
    return "Express is listed at UGX 5,780,000 and is positioned for daily business use. EG125 is UGX 5,980,000 and is positioned as an accessible everyday motorcycle. Your best choice depends on work load, distance and roads. Confirm availability on WhatsApp: 0745 400 500.";
  }
  if (text.includes("price") || text.includes("cost") || text.includes("model")) {
    return "Listed prices: NK150 UGX 8.43m; DK150 UGX 8.13m; Express UGX 5.78m; Express Plus UGX 5.98m; EG150 UGX 6.33m; EG125 UGX 5.98m. Prices can change, so confirm today’s offer on WhatsApp 0745 400 500.";
  }
  return "I can help compare the listed Haojue models, prices and the Express financing example. Tell me your budget and whether the motorcycle is mainly for business or everyday travel. For current stock and final terms, WhatsApp 0745 400 500.";
}

export async function POST(request: Request) {
  let body: { messages?: Message[] };
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request." }, { status: 400 });
  }

  const messages = Array.isArray(body.messages)
    ? body.messages.filter((item) => item && (item.role === "user" || item.role === "assistant") && typeof item.content === "string").slice(-8)
    : [];
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content?.trim();

  if (!lastUserMessage || lastUserMessage.length > 800) {
    return Response.json({ error: "Please send a shorter question." }, { status: 400 });
  }
  if (!process.env.OPENAI_API_KEY) {
    return Response.json({ reply: fallbackReply(lastUserMessage), mode: "catalogue" });
  }

  try {
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.responses.create({
      model: process.env.OPENAI_MODEL || "gpt-5.5",
      instructions,
      input: messages.map((message) => ({ role: message.role, content: message.content })),
      store: false,
      max_output_tokens: 350,
    });
    const reply = response.output_text?.trim();
    if (!reply) throw new Error("Empty assistant response");
    return Response.json({ reply, mode: "openai" });
  } catch (error) {
    console.error("Luuba AI request failed", error);
    return Response.json({ reply: fallbackReply(lastUserMessage), mode: "catalogue" });
  }
}
