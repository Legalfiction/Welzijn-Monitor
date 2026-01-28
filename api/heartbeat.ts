
import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  const source = req.body?.source || 'Onbekend/Direct';
  const isPhone = source.includes('Telefoon') || source.includes('MacroDroid');

  console.log("========================================");
  console.log(`📡 SIGNAAL ONTVANGEN: ${timestamp}`);
  console.log(`📱 BRON: ${source}`);

  let aiReport = "";

  if (isPhone) {
    console.log("⚡ TEST-MODUS ACTIEF: EMAIL VERZENDEN...");
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Je bent een welzijns-monitor. De gebruiker heeft zojuist zijn telefoon ontgrendeld. 
        Schrijf een kort, geruststellend bericht voor de contactpersoon 'Willem de Boer'. 
        Meld dat de gebruiker actief is gezien op ${timestamp}. 
        Sluit af met: 'Dit is een automatische test van de GuardianSwitch.'`,
      });

      aiReport = response.text || "Geen tekst gegenereerd.";

      console.log("----------------------------------------");
      console.log("📧 GESIMULEERDE EMAIL VERZONDEN:");
      console.log(`AAN: willem.demo@example.com`);
      console.log(`ONDERWERP: Welzijns-Update: Gebruiker is Actief`);
      console.log(`INHOUD:\n${aiReport}`);
      console.log("----------------------------------------");
      console.log("✅ PROTOCOL VOLTOOID");
    } catch (err) {
      console.error("Fout bij aanroepen Gemini:", err);
      aiReport = "Fout bij genereren van test-notificatie.";
    }
  }

  console.log("========================================");

  return res.status(200).json({ 
    status: "ok", 
    received: true,
    source: source,
    time: timestamp,
    notification_sent: isPhone,
    simulated_message: aiReport
  });
}
