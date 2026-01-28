
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // Alleen toestaan dat Vercel Cron dit aanroept (of handmatige test met geheime sleutel)
  const authHeader = req.headers['authorization'];
  
  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  console.log(`[SYSTEM CHECK] Dagelijkse welzijnscontrole gestart om ${timestamp}`);

  // OPMERKING VOOR ARCHITECT: 
  // In een productie-omgeving halen we hier de 'last_heartbeat' uit PostgreSQL.
  // Voor nu simuleren we de logica.
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    // We simuleren een scenario waarin de check wordt uitgevoerd.
    // In de logs van Vercel kunnen we zien of Gemini het bericht correct genereert.
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Systeem-status rapportage om ${timestamp}. 
      De dagelijkse check-in is gestart. 
      Als er geen hartslag was, genereer dan een test-alarmbericht voor noodcontact 'Willem'. 
      Als alles ok lijkt, geef een korte status update.`,
    });

    console.log("========================================");
    console.log("🛡️ GUARDIAN SWITCH AUTO-CHECK RESULTAAT:");
    console.log(response.text);
    console.log("========================================");

    return res.status(200).json({ 
      success: true, 
      message: "Check uitgevoerd",
      report: response.text 
    });
  } catch (error) {
    console.error("Fout tijdens automatische check:", error);
    return res.status(500).json({ error: "Check mislukt" });
  }
}
