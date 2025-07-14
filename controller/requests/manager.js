import {getUrlToConnect, saveNewToken} from './google-connection.js';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';

const router = express.Router();

// הגדרות נתיב ל-ESM (כדי שנוכל להשתמש ב__dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// הגשה של תיקיית client כסטטית
router.use('/static', express.static(path.join(__dirname, '../../client/static')));

router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../client/manager.html'));
});

router.get('/reconnect', async (req, res) => {
    try {
        const authUrl = await getUrlToConnect();
        // console.log(authUrl);
        
        res.json({ url: authUrl });
    } catch (error) {
        console.error('Error in get url connection:', error);
        res.status(500).send('Error in get url connection');
    }
});

router.post('/GDcode', async (req, res) => {
    const { GDcode } = req.body;
    try{
        const oAuth2Client = await saveNewToken(GDcode);
        res.json({ message: 'OK' });
    }catch (error) {
        console.error('Error saving new token:', error);
        res.status(500).json({ error: 'Error saving new token' });
    }
});

export default router;