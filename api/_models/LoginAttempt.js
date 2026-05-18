import mongoose from 'mongoose';

const LoginAttemptSchema = new mongoose.Schema({
  ip: {
    type: String,
    required: true,
    index: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
    expires: 900, // 900 seconds = 15 minutes TTL index
  },
});

export default mongoose.models.LoginAttempt || mongoose.model('LoginAttempt', LoginAttemptSchema);
