/**
 * / - Root endpoint
 * 
 * GET  -> "hello world"
 * POST -> auth check
 */

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET -> hello world
  if (req.method === 'GET') {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    return res.status(200).send('hello world');
  }

  // POST -> auth (redirect to /api/auth)
  if (req.method === 'POST') {
    return res.status(200).json({
      status: false,
      reason: "Use /api/auth endpoint instead"
    });
  }

  return res.status(405).json({ status: false, reason: "Method not allowed" });
};
