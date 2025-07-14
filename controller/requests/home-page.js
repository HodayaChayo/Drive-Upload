import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import {clientOuthorize} from './google-connection.js';

const router = express.Router();

// הגדרות נתיב ל-ESM (כדי שנוכל להשתמש ב__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הגשה של תיקיית client כסטטית
router.use('/static', express.static(path.join(__dirname, '../../client/static')));
router.use('/assets', express.static(path.join(__dirname, '../../client/assets')));

// 2. שליחה של דף הבית בהתנייה
router.get('/', async (req, res) => {
  try {
    const auth = await clientOuthorize();

    if (!auth) {
      return res.sendFile(path.join(__dirname, '../../client', 'no-access.html'));
    }

    return res.sendFile(path.join(__dirname, '../../client', 'index.html'));
  } catch (error) {
    console.error('Error in / route:', error);
    res.status(500).send('Server error');
  }
});

export default router;