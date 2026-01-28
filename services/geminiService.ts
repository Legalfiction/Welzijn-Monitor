
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateRefinedAlert(userName: string, contactName: string, lastSeenStr: string) {
  try {
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
    return response.text;
  } catch (error) {
    console.error("Gemini kon bericht niet genereren:", error);
    return null;
  }
}

export async function auditSafetyLogs(logs: any[]) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Audit deze systeem logs op patronen van falen of onregelmatige activiteit: ${JSON.stringify(logs)}. 
      Geef een korte samenvatting van de systeemgezondheid in het Nederlands.`,
      config: {
        temperature: 0.4,
        maxOutputTokens: 300,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini audit mislukt:", error);
    return "Audit mislukt. Systeem is operationeel op basis van laatste controles.";
  }
}
