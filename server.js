import express from 'express';
import dotenv from 'dotenv';
import apiController from './controller/apiController.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

apiController(app);

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
