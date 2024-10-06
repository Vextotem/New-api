const express = require('express');
const axios = require('axios');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
const router = express.Router();

// Log for debugging
console.log("Serverless function starting...");

const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Log to check if API key is loaded
if (!TMDB_API_KEY) {
  console.error("Error: TMDB_API_KEY is missing in environment variables.");
  throw new Error("TMDB_API_KEY is not defined in environment variables");
} else {
  console.log("TMDB_API_KEY is set successfully.");
}

// Handle CORS
app.use((req, res, next) => {
  console.log("Incoming request:", req.path);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Proxy requests to TMDB API
router.get('/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const queryParams = req.query;

  console.log(`Fetching data for TMDB endpoint: /${endpoint} with queryParams:`, queryParams);

  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...queryParams
      },
      timeout: 5000, // 5 seconds timeout
    });

    console.log("Successfully fetched data from TMDB:", tmdbResponse.data);
    res.json(tmdbResponse.data);
  } catch (error) {
    console.error("Error occurred while fetching from TMDB:", error); // Log the entire error object
    if (error.response) {
      res.status(error.response.status).json({ error: error.response.data });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.use('/api/tmdb', router);

// Export for serverless deployment
module.exports = app;
module.exports.handler = serverless(app);
