import express from 'express';
import { logger } from './middleware/logger.js';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
app.use(logger);

let urlStore = {};  // In-memory DB (you can replace with Mongo later)

// Create short URL
app.post('/api/shorten', (req, res) => {
  let { destination, shortcode, validityMinutes } = req.body;
  if (!destination) return res.status(400).json({ error: "Destination required" });

  if (!shortcode) shortcode = uuidv4().slice(0, 6);
  if (urlStore[shortcode]) return res.status(409).json({ error: "Shortcode already exists" });

  const createdAt = Date.now();
  const expiryAt = createdAt + (parseInt(validityMinutes) || 30) * 60 * 1000;

  urlStore[shortcode] = {
    code: shortcode,
    destination,
    createdAt,
    expiryAt,
    clicks: 0,
    history: []
  };

  res.json(urlStore[shortcode]);
});

// Redirect
app.get('/:shortcode', (req, res) => {
  const code = req.params.shortcode;
  const record = urlStore[code];
  if (!record) return res.status(404).send("Shortcode not found");

  if (Date.now() > record.expiryAt) return res.status(410).send("Short link expired");

  record.clicks++;
  record.history.push({ ts: Date.now(), referer: req.get('referer') });

  res.redirect(record.destination);
});

// Get all
app.get('/api/list', (req, res) => {
  res.json(Object.values(urlStore));
});

// Get logs
app.get('/api/logs', (req, res) => {
  res.sendFile(process.cwd() + '/logs.txt');
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Middleware server running at http://localhost:${PORT}`);
});
