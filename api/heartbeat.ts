
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS instellingen voor MacroDroid en Dashboard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const source = req.body?.source || req.query?.source || 'Onbekende_Bron';
  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  const targetEmail = "aldo.huizinga@gmail.com";
  
  // Controleer Keys
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "SYSTEEMFOUT: RESEND_API_KEY niet gevonden in Vercel settings." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    let messageContent = "Systeem-update: Gebruiker is actief.";
    
    // Probeer AI tekst te genereren
    if (process.env.API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Schrijf een super kort (max 10 woorden) bericht voor Aldo Huizinga. De gebruiker is zojuist gedetecteerd via ${source} om ${timestamp}. Geen aanhef, wees direct.`,
        });
        messageContent = aiResponse.text || messageContent;
      } catch (e) {
        console.error("AI_GEN_FAIL", e);
      }
    }

    // Verzend Mail
    const { data, error } = await resend.emails.send({
      from: 'GuardianSwitch <onboarding@resend.dev>',
      to: [targetEmail],
      subject: `Activiteit Gedetecteerd (${timestamp})`,
      text: messageContent,
    });

    if (error) {
      console.error("RESEND_REJECTION:", error);
      return res.status(400).json({ 
        error: `Mail geweigerd door Resend: ${error.message}`,
        details: "Controleer of je naar het juiste mailadres stuurt (Resend Sandbox restrictie)."
      });
    }

    return res.status(200).json({ 
      status: "success", 
      message: "Mail succesvol verzonden via Resend.",
      content: messageContent 
    });

  } catch (err: any) {
    return res.status(500).json({ error: `CRITIEKE_FOUT: ${err.message}` });
  }
}
