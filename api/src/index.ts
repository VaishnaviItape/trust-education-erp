export { app } from './app.js';

if (process.env.NODE_ENV !== 'test') {
  import('./server.js');
}
