
export default function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const timestamp = new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' });
  
  console.log("************************************************");
  console.log("🚀 SIGNAAL ONTVANGEN: " + timestamp);
  console.log("🛠  METHODE: " + req.method);
  console.log("************************************************");

  return res.status(200).json({ 
    status: "ok", 
    serverTime: timestamp,
    received: true 
  });
}
