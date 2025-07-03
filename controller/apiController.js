import {
    home,
    upload,
    manager

} from './allRequests.js';

export default function (app) {
  //set up routes
  app.use('/', home);
  app.use('/upload', upload);
  app.use('/manager', manager);
}
