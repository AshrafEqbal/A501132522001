import fs from 'fs';
import path from 'path';

const logFile = path.join(process.cwd(), 'logs.txt');

export function logger(req, res, next) {
  const entry = {
    ts: new Date().toISOString(),
    method: req.method,
    url: req.originalUrl,
    body: req.body,
    headers: req.headers
  };

  // Write to file
  fs.appendFileSync(logFile, JSON.stringify(entry) + '\n');
  console.log('[LOG]', entry);

  next();
}
