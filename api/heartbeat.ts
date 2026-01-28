
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const timestamp = new Date().toLocaleString('nl-NL');
  
  // Deze logging is bedoeld om DIRECT op te vallen in de zwarte Vercel console
  console.log("================================================");
  console.log("🔴 HARTSLAG ONTVANGEN OP: " + timestamp);
  console.log("METHODE: " + request.method);
  console.log("SOURCE: " + (request.headers['user-agent'] || 'Onbekend'));
  console.log("================================================");

  if (request.method === 'POST') {
    return response.status(200).json({ 
      success: true, 
      server_received: timestamp 
    });
  }

  // Ook even reageren op GET voor browser-tests
  return response.status(200).send(`Systeem is online. Stuur een POST request voor een echte hartslag.`);
}
