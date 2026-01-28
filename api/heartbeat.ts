
export default function handler(req, res) {
  // Absolute CORS vrijheid voor debugging
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  
  // Deze log zie je in je Vercel Dashboard
  console.log(`[BACKEND LOG] Heartbeat van: ${req.body?.source || 'Onbekend'} om ${timestamp}`);

  return res.status(200).json({ 
    status: "ok", 
    message: "Verbinding met GuardianSwitch Cloud is actief!",
    serverTime: timestamp,
    receivedFrom: req.body?.source || 'direct'
  });
}
