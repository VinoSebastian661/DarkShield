/**
 * /api/auth - POST endpoint for MLHERZFIXLOG.sh
 * 
 * curl -X POST -d "login_key=TEST&package_name=com.mobile.legends&java_json_device_id=test123" https://your-domain.vercel.app/api/auth
 */

const crypto = require('crypto');

const API_KEY = "NCZ_7fK9xP2mQ8vL4sR6nT1zW5cB";

const REGISTERED_KEYS = {
  "NUSANTARA-1DAY":  { days: 1,   title: "MLBB Nusantara 1 Day" },
  "NUSANTARA-7DAY":  { days: 7,   title: "MLBB Nusantara 7 Day" },
  "NUSANTARA-30DAY": { days: 30,  title: "MLBB Nusantara 30 Day" },
  "PREMIUM":         { days: 90,  title: "MLBB Premium" },
  "TEST":            { days: 365, title: "MLBB Test" },
  "ADMIN":           { days: 999, title: "MLBB Admin" },
  "NCZ":             { days: 365, title: "MLBB NCZ" },
  "default":         { days: 30,  title: "MLBB Default" },
};

const MONTHS_ID = [
  "", "Jan", "Feb", "Mar", "Apr", "Mei", "Jun",
  "Jul", "Agu", "Sep", "Okt", "Nov", "Des"
];

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Client-Key');
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ status: false, reason: "Method not allowed" });
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  const params = {};
  body.split('&').forEach(pair => {
    const [k, v] = pair.split('=');
    if (k) params[decodeURIComponent(k)] = decodeURIComponent(v || '');
  });

  let userKey = params.user_key || params.key || '';
  const loginKey = params.login_key || '';
  const serial = params.serial || '';
  const deviceId = params.java_json_device_id || params.device_id || '';

  if (!userKey && loginKey) userKey = loginKey;

  if (!userKey) {
    return res.status(200).json({ status: false, reason: "Key kosong" });
  }
  if (!deviceId && !serial) {
    return res.status(200).json({ status: false, reason: "Device ID kosong" });
  }
  if (!REGISTERED_KEYS[userKey]) {
    return res.status(200).json({ status: false, reason: "MEMBER KEY NOT REGISTERED" });
  }

  const keyInfo = REGISTERED_KEYS[userKey];
  const rng = Math.floor(Date.now() / 1000);
  const token = crypto.createHash('md5').update(`${Date.now()}${rng}`).digest('hex');
  const expiredTs = rng + (keyInfo.days * 86400);
  const seal = crypto.createHash('md5').update(`${API_KEY}${rng}${token}`).digest('hex');

  const expDate = new Date(expiredTs * 1000);
  const expired = `${expDate.getDate()} - ${MONTHS_ID[expDate.getMonth() + 1]} - ${expDate.getFullYear()} ${expDate.toTimeString().split(' ')[0]}`;

  return res.status(200).json({
    status: true,
    reason: "success",
    rng,
    tittle: keyInfo.title,
    token,
    expired,
    seal,
  });
};
