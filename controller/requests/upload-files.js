import { google } from 'googleapis';
import authorize from './google-connection.js';
import { Readable } from 'stream';
import iconv from 'iconv-lite';
import multer from 'multer';
import express from 'express';

const router = express.Router();


const upload = multer({ storage: multer.memoryStorage() });

router.post('/', upload.single('file'), async (req, res) => {
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

export default router;