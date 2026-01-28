
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  // Voeg CORS headers toe zodat de browser de aanvraag accepteert
  response.setHeader('Access-Control-Allow-Credentials', 'true');
  response.setHeader('Access-Control-Allow-Origin', '*');
  response.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  response.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Reageer direct op preflight requests (OPTIONS)
  if (request.method === 'OPTIONS') {
    return response.status(200).end();
  }

  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  
  // LOGGING DIRECT STARTEN
  console.log("\n\n************************************************");
  console.log("🚀 [SIGNAL RECEIVED] - " + timestamp);
  console.log("🛠  METHOD: " + request.method);
  
  try {
    if (request.method === 'POST') {
      const body = request.body;
      console.log("📦 DATA: ", typeof body === 'string' ? body : JSON.stringify(body));
    }
  } catch (e) {
    console.error("❌ Fout bij loggen van body:", e);
  }
  
  console.log("************************************************\n\n");

  // Geef DIRECT antwoord zodat de browser niet hoeft te wachten
  return response.status(200).json({ 
    status: "ok", 
    serverTime: timestamp,
    received: true
  });
}
