
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const timestamp = new Date().toLocaleString('nl-NL');
  const clientIp = request.headers['x-forwarded-for'] || request.socket.remoteAddress;
  const userAgent = request.headers['user-agent'] || 'Onbekend';

  // Uitgebreide logging voor debuggen via Vercel Logs
  console.log("------------------------------------------------");
  console.log("🚨 [HARTBEAT ONTVANGEN]");
  console.log("📅 TIJD: " + timestamp);
  console.log("🌐 BRON-IP: " + clientIp);
  console.log("📱 APPARAAT: " + userAgent);
  console.log("🛠 METHODE: " + request.method);
  
  if (request.method === 'POST') {
    const body = request.body;
    console.log("📦 DATA: ", JSON.stringify(body));
  }
  console.log("------------------------------------------------");

  // Altijd een succes response sturen naar MacroDroid
  return response.status(200).json({ 
    status: "ok", 
    message: "Signaal ontvangen door GuardianSwitch Cloud",
    received_at: timestamp 
  });
}
