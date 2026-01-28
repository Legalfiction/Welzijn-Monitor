
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method === 'POST') {
    // In een productie-omgeving zou je dit hier naar een database (bijv. Supabase) schrijven.
    console.log("Hartslag ontvangen op:", new Date().toISOString());
    return response.status(200).json({ 
      status: 'success', 
      message: 'Hartslag geregistreerd door GuardianSwitch server.',
      timestamp: Date.now()
    });
  }

  return response.status(405).json({ error: 'Alleen POST-requests toegestaan.' });
}
