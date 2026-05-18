import dbConnect from '../_utils/db';
import User from '../_models/User';
import LoginAttempt from '../_models/LoginAttempt';
import bcrypt from 'bcryptjs';
import { signToken, setCookie } from '../_utils/auth';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { username, password } = req.body;
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || '127.0.0.1';

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required' });
  }

  try {
    await dbConnect();

    // Check rate limit: max 5 failed login attempts in 15 minutes per IP
    const recentAttempts = await LoginAttempt.countDocuments({ ip });
    if (recentAttempts >= 5) {
      return res.status(429).json({ 
        success: false, 
        message: 'Too many login attempts. Please try again in 15 minutes.' 
      });
    }

    // Find the user
    const user = await User.findOne({ username });
    if (!user) {
      // Record failed attempt
      await LoginAttempt.create({ ip });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      // Record failed attempt
      await LoginAttempt.create({ ip });
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Successful login: clean up past failed attempts for this IP
    await LoginAttempt.deleteMany({ ip });

    // Generate JWT and set HttpOnly Cookie
    const token = signToken(user);
    setCookie(res, token);

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      user: {
        username: user.username,
        role: user.role,
      },
    });

  } catch (error) {
    console.error('Login Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
