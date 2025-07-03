import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const router = express.Router();

// הגדרות נתיב ל-ESM (כדי שנוכל להשתמש ב__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הגשה של תיקיית client כסטטית
router.use(express.static(path.join(__dirname, '../../client')));

// שליחה של דף הבית כברירת מחדל
router.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

export default router;