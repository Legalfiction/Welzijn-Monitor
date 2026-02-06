
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';

export default async function handler(req, res) {
  // CORS instellingen toevoegen voor Dashboard interactie
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  const targetEmail = "aldo.huizinga@gmail.com";

  console.log(`[AUTOMATISCHE CHECK] Controle gestart op ${timestamp}`);

  if (!process.env.RESEND_API_KEY) {
    return res.status(500).json({ error: "SYSTEEMFOUT: RESEND_API_KEY niet gevonden in Vercel settings." });
  }
  
  if (!process.env.API_KEY) {
    return res.status(500).json({ error: "SYSTEEMFOUT: Gemini API_KEY niet gevonden." });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const aiResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `GENEREER EEN NOODBERICHT. 
      De gebruiker (Systeem Operator) heeft zich de afgelopen 24 uur niet gemeld bij het GuardianSwitch systeem. 
      Dit is een officieel welzijns-alarm. 
      Ontvanger: Aldo Huizinga.
      Taal: Nederlands. 
      Toon: Urgent, serieus, maar kalm. 
      Instructie: Verzoek Aldo om onmiddellijk poolshoogte te nemen.`,
    });

    const alarmContent = aiResponse.text;

    // VERSTUUR HET ECHTE ALARM
    const { data, error } = await resend.emails.send({
      from: 'GuardianSwitch ALERT <onboarding@resend.dev>',
      to: [targetEmail],
      subject: `🚨 URGENT: GuardianSwitch Welzijns-Alarm (${timestamp})`,
      text: alarmContent,
    });

    if (error) throw error;

    return res.status(200).json({ 
      success: true, 
      type: "ALARM_SENT",
      message: "Het nood-protocol is succesvol uitgevoerd.",
      content: alarmContent 
    });
  } catch (error: any) {
    console.error("Fout tijdens check:", error);
    return res.status(500).json({ error: `CRITIEKE_FOUT: ${error.message}` });
  }
}
