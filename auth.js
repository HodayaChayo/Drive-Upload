import fs from 'fs/promises';
import path from 'path';
import { google } from 'googleapis';
import readline from 'readline';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCOPES = ['https://www.googleapis.com/auth/drive.file'];
const TOKEN_PATH = path.join(__dirname, 'token.json');

// שימוש ב-web במקום installed
export default async function authorize() {
  const content = await fs.readFile(path.join(__dirname, 'credentials.json'));
  const credentials = JSON.parse(content);
  const { client_secret, client_id, redirect_uris } = credentials.web;

  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);

  try {
    const token = await fs.readFile(TOKEN_PATH);
    oAuth2Client.setCredentials(JSON.parse(token));
    console.log('🔐 קיימת גישה עם טוקן קיים');
    return oAuth2Client;
  } catch (err) {
    return getNewToken(oAuth2Client);
  }
}

async function getNewToken(oAuth2Client) {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });

  console.log('🔑 פתחי את הקישור הבא בדפדפן כדי לאשר גישה לחשבון שלך:');
  console.log(authUrl);

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const code = await new Promise(resolve =>
    rl.question('📥 הדביקי כאן את הקוד מהדפדפן: ', answer => {
      rl.close();
      resolve(answer);
    }));

  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);
  await fs.writeFile(TOKEN_PATH, JSON.stringify(tokens));
  console.log('✅ הטוקן נשמר בהצלחה ב־token.json');
  return oAuth2Client;
}

// חשוב! להריץ את הפונקציה
authorize();
