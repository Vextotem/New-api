const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Load TMDB API key from environment variables
const TMDB_API_KEY = process.env.TMDB_API_KEY;

// Handle CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Proxy requests to TMDB API
app.get('/tmdb/:endpoint', async (req, res) => {
  const { endpoint } = req.params;
  const queryParams = req.query;

  try {
    const tmdbResponse = await axios.get(`https://api.themoviedb.org/3/${endpoint}`,
