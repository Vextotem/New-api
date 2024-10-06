const express = require('express');
const axios = require('axios');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
const router = express.Router();

// Check if TMDB API Key exists
const TMDB_API_KEY = process.env.TMDB_API_KEY;
if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY is not defined in environment variables");
}

// Handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Proxy requests to TMDB API
router.get('/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const queryParams = req.query;

  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/${endpoint}`, {
      params: {
        api_key: TMDB_API_KEY,
        ...queryParams
      }
    });
    res.json(tmdbResponse.data);
  } catch (error) {
    console.error("Error fetching data from TMDB:", error.message);
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
