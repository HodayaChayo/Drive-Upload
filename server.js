import express from 'express';
import multer from 'multer';
import dotenv from 'dotenv';
import path from 'path';
import { google } from 'googleapis';
import { fileURLToPath } from 'url';
import authorize from './auth.js';
import { Readable } from 'stream';
import iconv from 'iconv-lite';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// הגדרות נתיב ל-ESM (כדי שנוכל להשתמש ב__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הגשה של תיקיית client כסטטית
app.use(express.static(path.join(__dirname, 'client')));

// שליחה של דף הבית כברירת מחדל
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'index.html'));
});

// הגדרה זמנית לאחסון קבצים
const upload = multer({ storage: multer.memoryStorage() });

app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const auth = await authorize();
    const drive = google.drive({ version: 'v3', auth });

    const rawName = req.file.originalname;
    const fileName = iconv.decode(Buffer.from(rawName, 'binary'), 'utf8');

    const fileMetadata = {
      name: fileName,
      parents: ['1UMZk5Mx06-qumq9oSlu_veoTZshuJcDY'],
    };

    const media = {
      mimeType: req.file.mimetype,
      body: Readable.from(req.file.buffer),
    };

    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
      fields: 'id, name',
    });

    console.log(`✅ "${fileName}" הועלה`);
    res.json({ success: true, name: response.data.name, id: response.data.id });

  } catch (error) {
    console.error('❌ שגיאה בהעלאה:', error.message);
    res.json({ success: false, error: error.message });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
