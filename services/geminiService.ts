import { GoogleGenAI } from "@google/genai";

export async function generateSafetyResponse(prompt: string) {
  // Strikte instantie-creatie om race conditions met API-sleutels te voorkomen
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Je bent de kern-logica van GuardianSwitch v2.1. Je spreekt als een betrouwbare, senior safety-engine. Geen humor, alleen feiten en rust.",
        temperature: 0.1, // Maximaal determinisme
      }
    });

    // Conform SDK: property access .text
    return response.text || "PROTOCOL_NOMINAL: Systeem operationeel.";
  } catch (error) {
    console.error("AI_KERNEL_FATAL:", error);
    return "ERROR_AI_OFFLINE: Systeem draait op basis-protocol.";
  }
}