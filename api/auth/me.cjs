const { verifyToken } = require('../_utils/auth.cjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  try {
    const decoded = verifyToken(req);
    if (!decoded) {
      return res.status(401).json({ success: false, authenticated: false, message: 'Unauthorized' });
    }

    return res.status(200).json({
      success: true,
      authenticated: true,
      user: {
        username: decoded.username,
        role: decoded.role,
      },
    });
  } catch (error) {
    console.error('Session verification Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
