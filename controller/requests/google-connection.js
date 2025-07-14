import fs from 'fs/promises';
import path from 'path';
import { google } from 'googleapis';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(__dirname, '../tokens/token.json');

async function getAuthObj() {
    const content = await fs.readFile(path.join(__dirname, '../tokens/credentials.json'));
    const credentials = JSON.parse(content);
    const { client_secret, client_id, redirect_uris } = credentials.web;

    return new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

}

// שימוש ב-web במקום installed
async function clientOuthorize() {
    const oAuth2Client = await getAuthObj();
    try {
        const token = await fs.readFile(TOKEN_PATH);
        oAuth2Client.setCredentials(JSON.parse(token));
        // ננסה לבדוק אם יש באמת גישה
        const drive = google.drive({ version: 'v3', auth: oAuth2Client });
        await drive.files.list({ pageSize: 1 });

        console.log('🔐 קיימת גישה עם טוקן תקף');
        return oAuth2Client;
    } catch (err) {
        return false;
    }
}

async function getUrlToConnect() {
    const oAuth2Client = await getAuthObj();
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
        prompt: 'consent',
    });
    return authUrl;
}

async function saveNewToken(code) {
    const oAuth2Client = await getAuthObj();
    const { tokens } = await oAuth2Client.getToken(code);
    oAuth2Client.setCredentials(tokens);
    await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
    console.log('✅ הטוקן נשמר בהצלחה ב־token.json');
    return oAuth2Client;
}


export { clientOuthorize, getUrlToConnect, saveNewToken };