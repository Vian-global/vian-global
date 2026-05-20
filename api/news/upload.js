const cloudinary = require('cloudinary').v2;
const { verifyToken } = require('../_utils/auth.js');

const handler = async function (req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });

  // Increase the payload size limit config for Vercel serverless
  // (Vercel allows body limit configs for large base64 uploads)
  const decoded = verifyToken(req);
  if (!decoded) {
    return res.status(401).json({ success: false, message: 'Unauthorized action' });
  }

  const { image } = req.body;

  if (!image) {
    return res.status(400).json({ success: false, message: 'No image data provided' });
  }

  try {
    // Upload base64 image securely to Cloudinary inside "vian_news" folder
    // Automatically optimizes quality and applies modern auto-formatting transformations
    const uploadResponse = await cloudinary.uploader.upload(image, {
      folder: 'vian_news',
      resource_type: 'image',
      overwrite: true,
      invalidate: true,
    });

    return res.status(200).json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });

  } catch (error) {
    console.error('Image Upload Error:', error);
    return res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = handler;

module.exports.config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Supports larger base64 images securely
    },
  },
};
