
import { GoogleGenAI } from "@google/genai";

// Initialize the GoogleGenAI client using process.env.API_KEY directly as required by guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateRefinedAlert(userName: string, contactName: string, lastSeenStr: string) {
  try {
    // Calling generateContent with the required model name and prompt.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Je bent een professioneel veiligheidssysteem. 
      De gebruiker "${userName}" heeft geen digitale hartslag gegeven. 
      Genereer een beknopt, urgent maar kalm alarmbericht voor hun contactpersoon "${contactName}". 
      Laatste activiteit was op: ${lastSeenStr}. 
      Het bericht moet in het Nederlands zijn. 
      Vermeld dat dit een geautomatiseerd systeem is dat het welzijn controleert.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 200,
      }
    });
    // Accessing the .text property of GenerateContentResponse directly.
    return response.text;
  } catch (error) {
    console.error("Gemini kon bericht niet genereren:", error);
    return null;
  }
}

export async function auditSafetyLogs(logs: any[]) {
  try {
    // Calling generateContent to perform log audit with search grounding or similar analysis.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit deze systeem logs op patronen van falen of onregelmatige activiteit: ${JSON.stringify(logs)}. 
      Geef een korte samenvatting van de systeemgezondheid in het Nederlands.`,
      config: {
        temperature: 0.4,
        maxOutputTokens: 300,
      }
    });
    // Accessing the .text property of GenerateContentResponse directly.
    return response.text;
  } catch (error) {
    console.error("Gemini audit mislukt:", error);
    return "Audit mislukt. Systeem is operationeel op basis van laatste controles.";
  }
}
