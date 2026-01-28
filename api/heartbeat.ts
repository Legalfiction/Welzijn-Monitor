
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const timestamp = new Date().toLocaleString('nl-NL');
  const clientIp = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  const userAgent = request.headers['user-agent'] || 'Onbekend';

  // DIT VERSCHIJNT IN JE VERCEL LOGS
  console.log("------------------------------------------------");
  console.log("🚨 [INCOMING SIGNAL] Hartslag gedetecteerd!");
  console.log("📅 Tijd: " + timestamp);
  console.log("🌐 IP: " + clientIp);
  console.log("📱 Device: " + userAgent);
  console.log("🛠 Methode: " + request.method);
  console.log("------------------------------------------------");

  // Reageer op alles om te bevestigen dat de endpoint leeft
  if (request.method === 'POST') {
    return response.status(200).json({ 
      status: "ontvangen", 
      time: timestamp 
    });
  }

  return response.status(200).send(`Systeem Online. IP geregistreerd: ${clientIp}`);
}
