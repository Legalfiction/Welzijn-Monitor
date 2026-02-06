
import { GoogleGenAI } from "@google/genai";
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  const targetEmail = "aldo.huizinga@gmail.com";

  console.log(`[AUTOMATISCHE CHECK] Controle gestart op ${timestamp}`);

  if (!process.env.RESEND_API_KEY || !process.env.API_KEY) {
    return res.status(500).json({ error: "Configuratie ontbreekt (API keys)." });
  }

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // De 'Dodemansknop' logica: 
    // In een live omgeving met DB checken we hier 'last_heartbeat < 24h'.
    // Voor de werking van de app sturen we nu het GEGENEREERDE ALARM uit als deze actie wordt getriggerd.
    
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
    return res.status(500).json({ error: error.message });
  }
}
