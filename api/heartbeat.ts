
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS instellingen voor MacroDroid en Dashboard
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const source = req.body?.source || req.query?.source || 'Automatisering';
  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  const targetEmail = "aldo.huizinga@gmail.com";
  
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "SYSTEEMFOUT: RESEND_API_KEY niet geconfigureerd." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    let messageContent = `Systeem-status update: Gebruiker is gedetecteerd via ${source}. Alles lijkt in orde op ${timestamp}.`;
    
    if (process.env.API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Je bent een professioneel zorg-monitoringsysteem genaamd GuardianSwitch. 
          Stel een zeer kort (max 12 woorden) geruststellend bericht op voor Aldo Huizinga. 
          Meld dat de gebruiker zojuist activiteit heeft getoond via het kanaal: ${source}. 
          Tijdstip: ${timestamp}. 
          Gebruik een kalme, betrouwbare toon. Nederlands.`,
        });
        messageContent = aiResponse.text || messageContent;
      } catch (e) {
        console.error("AI_GEN_FAIL", e);
      }
    }

    const { data, error } = await resend.emails.send({
      from: 'GuardianSwitch <onboarding@resend.dev>',
      to: [targetEmail],
      subject: `Welfare Check: ${source} (${timestamp})`,
      text: messageContent,
    });

    if (error) {
      return res.status(400).json({ 
        error: `Mail geweigerd: ${error.message}`
      });
    }

    return res.status(200).json({ 
      status: "success", 
      message: "Monitoring-update afgeleverd.",
      content: messageContent 
    });

  } catch (err: any) {
    return res.status(500).json({ error: `INTERNAL_DAEMON_ERROR: ${err.message}` });
  }
}
