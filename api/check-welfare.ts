
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  const targetEmail = "aldo.huizinga@gmail.com";

  if (!process.env.RESEND_API_KEY || !process.env.API_KEY) {
    return res.status(500).json({ error: "CONFIG_ERROR: API sleutels ontbreken." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `URGENT WELZIJNS ALARM. 
      De gebruiker heeft zich niet gemeld. 
      Bericht voor Aldo Huizinga. 
      Toon: Ernstig maar beheerst. 
      Vraag hem onmiddellijk contact op te nemen of de locatie te controleren.`,
    });

    const alarmContent = aiResponse.text;

    const { error } = await resend.emails.send({
      from: 'GuardianSwitch ALERT <onboarding@resend.dev>',
      to: [targetEmail],
      subject: `🚨 URGENT: GuardianSwitch Alarm (${timestamp})`,
      text: alarmContent,
    });

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      content: alarmContent 
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
}
