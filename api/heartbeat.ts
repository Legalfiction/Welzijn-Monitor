
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const source = req.body?.source || req.query?.source || 'Automatisering';
  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  const targetEmail = "aldo.huizinga@gmail.com";
  
  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "CONFIG_ERROR: RESEND_API_KEY ontbreekt." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    let messageContent = `Guardian-update: Activiteit waargenomen via ${source}. Systeemstatus nominaal op ${timestamp}.`;
    
    if (process.env.API_KEY) {
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const aiResponse = await ai.models.generateContent({
          model: 'gemini-3-flash-preview',
          contents: `Je bent GuardianSwitch, een senior welzijnsmonitor. 
          Genereer een zeer kort (max 10 woorden) geruststellend bericht voor Aldo Huizinga. 
          Context: Activiteit gedetecteerd via ${source}. 
          Tijd: ${timestamp}. 
          Toon: Professioneel en betrouwbaar.`,
        });
        messageContent = aiResponse.text || messageContent;
      } catch (e) {
        console.error("AI_FAIL", e);
      }
    }

    const { error } = await resend.emails.send({
      from: 'GuardianSwitch <onboarding@resend.dev>',
      to: [targetEmail],
      subject: `[OK] Welfare Check: ${source}`,
      text: messageContent,
    });

    if (error) return res.status(400).json({ error: error.message });

    return res.status(200).json({ 
      status: "success", 
      content: messageContent 
    });

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
}
