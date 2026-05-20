require('dotenv').config();
const newsHandler = require('./api/news/index.js');
const dbConnect = require('./api/_utils/db.js');

async function run() {
  console.log("Checking DB Connection...");
  console.log("MONGODB_URI exists?", !!process.env.MONGODB_URI);
  
  try {
    await dbConnect();
    console.log("DB connection successful!");
  } catch (err) {
    console.error("DB connection failed:", err.message);
    process.exit(1);
  }
  
  console.log("\nTesting /api/news GET...");
  const req = {
    method: 'GET',
    headers: { cookie: '' }
  };
  const res = {
    status: function(code) {
      this.statusCode = code;
      return this;
    },
    json: function(data) {
      console.log(`Response [${this.statusCode}]:`, JSON.stringify(data, null, 2).slice(0, 500));
    }
  };
  
  try {
    await newsHandler(req, res);
  } catch (err) {
    console.error("API handler failed:", err.message);
  }
}

run();
