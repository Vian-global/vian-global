const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title'],
    trim: true,
  },
  slug: {
    type: String,
    required: [true, 'Please provide a slug'],
    unique: true,
    trim: true,
    lowercase: true,
  },
  content: {
    type: String,
    default: '',
  },
  excerpt: {
    type: String,
    default: '',
    trim: true,
  },
  image: {
    type: String, // Cloudinary URL
    default: '',
  },
  featuredVideo: {
    type: String, // YouTube/Vimeo embed URL or direct video URL
    default: '',
    trim: true,
  },
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  // SEO fields
  seo: {
    metaTitle: {
      type: String,
      trim: true,
    },
    metaDescription: {
      type: String,
      trim: true,
    },
    ogImage: {
      type: String, // Optional override image
      trim: true,
    },
    canonicalUrl: {
      type: String,
      trim: true,
    },
  },
  // Future scalability properties
  category: {
    type: String,
    default: 'General',
  },
  tags: {
    type: [String],
    default: [],
  },
  author: {
    type: String,
    default: 'Vian Team',
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  dateCreated: {
    type: Date,
    default: Date.now,
  },
  dateUpdated: {
    type: Date,
    default: Date.now,
  },
});

// Update the dateUpdated field automatically on saving updates
NewsSchema.pre('save', function () {
  this.dateUpdated = Date.now();
});

module.exports = mongoose.models.News || mongoose.model('News', NewsSchema);
