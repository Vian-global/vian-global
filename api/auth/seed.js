const dbConnect = require('../_utils/db');
const User = require('../_models/User');
const bcrypt = require('bcryptjs');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const seedSecret = req.headers['x-seed-secret'];
  const envSeedSecret = process.env.SEED_SECRET;
  const adminUsername = process.env.ADMIN_USERNAME || 'admin';
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!envSeedSecret || seedSecret !== envSeedSecret) {
    return res.status(401).json({ success: false, message: 'Unauthorized seed secret passphrase' });
  }

  if (!adminPassword) {
    return res.status(500).json({ success: false, message: 'ADMIN_PASSWORD environment variable is not defined' });
  }

  try {
    await dbConnect();

    // Check if any admin already exists
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (existingAdmin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Admin seeding blocked: An admin user already exists.' 
      });
    }

    // Hash the password securely
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(adminPassword, salt);

    // Create the admin user
    const adminUser = await User.create({
      username: adminUsername,
      password: hashedPassword,
      role: 'admin'
    });

    return res.status(201).json({ 
      success: true, 
      message: 'Admin user created successfully', 
      user: {
        id: adminUser._id,
        username: adminUser.username,
        role: adminUser.role
      }
    });

  } catch (error) {
    console.error('Seeding Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
}
