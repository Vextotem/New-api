const express = require('express');
const axios = require('axios');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();
const router = express.Router();

const TMDB_API_KEY = process.env.TMDB_API_KEY;

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
    res.status(error.response?.status || 500).json({ error: error.message });
  }
});

app.use('/api/tmdb', router);

module.exports = app;
module.exports.handler = serverless(app);
