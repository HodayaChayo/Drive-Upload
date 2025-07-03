import {
    home,
    googleCon,
    upload,

} from './allRequests.js';

export default function (app) {
  //set up routes
  app.use('/', home);
  app.use('/google', googleCon);
  app.use('/upload', upload);
}
