
export default function handler(req, res) {
  // Zeer strikte CORS voor browsers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const timestamp = new Date().toISOString();
  
  // Deze log verschijnt in Vercel Logs
  console.log(`[${timestamp}] API Heartbeat aangeroepen via ${req.method}`);

  res.status(200).json({ 
    status: "success", 
    message: "GuardianSwitch Cloud is online",
    serverTime: timestamp,
    method: req.method
  });
}
