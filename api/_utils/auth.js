const jwt = require('jsonwebtoken');
const cookie = require('cookie');

const COOKIE_NAME = 'vian_admin_token';

function signToken(user) {
  const JWT_SECRET = process.env.JWT_SECRET;
  if (!JWT_SECRET) throw new Error('JWT_SECRET is missing');
  
  return jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

/**
 * Parse the cookie and verify the JWT token
 */
function verifyToken(req) {
  try {
    const cookiesHeader = req.headers.cookie || '';
    const cookies = cookie.parse(cookiesHeader);
    const token = cookies[COOKIE_NAME];

    if (!token) {
      return null;
    }

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) return null;
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    console.error('JWT Verification Error:', error);
    return null;
  }
}

/**
 * Set HttpOnly secure cookie on the response
 */
function setCookie(res, token) {
  const serializedCookie = cookie.serialize(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    path: '/',
  });
  res.setHeader('Set-Cookie', serializedCookie);
}

/**
 * Clear the admin token cookie on logout
 */
function clearCookie(res) {
  const serializedCookie = cookie.serialize(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    expires: new Date(0),
    path: '/',
  });
  res.setHeader('Set-Cookie', serializedCookie);
}

module.exports = {
  signToken,
  verifyToken,
  setCookie,
  clearCookie
};

