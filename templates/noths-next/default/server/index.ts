import dotEnv from 'dotenv';
import express from 'express';
import path from 'path';
import next from 'next';
import StatsD from 'hot-shots';
import ddTrace from 'dd-trace';

import logger from './logger';

dotEnv.config();

const { NODE_ENV, ENV_TYPE, SERVER_PORT } = process.env;
const env = ENV_TYPE || 'development';
const dev = NODE_ENV !== 'production';
const isDev = env === 'development';
const port = parseInt(SERVER_PORT!, 10) || 8080;
const dogstatsd = new StatsD({
  prefix: 'checkout-frontend.',
});

const loggerConfig = {
  service: 'checkout-frontend',
  environment: env,
};

const { MiddlewareLogger } = require('@noths/logger');

ddTrace.init();

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  server.disable('x-powered-by');
  server.use(MiddlewareLogger(loggerConfig));
  server.use('/public', express.static(path.join(__dirname, '../public')));
  server.use('/_next', express.static(path.join(__dirname, '../build/_next')));

  server.get('/', (req, res) => {
    return handle(req, res);
  });

  server.get('/health', (req, res) => {
    return res.status(200).send('👌');
  });

  server.get('*', (req, res) => {
    if (isDev) return handle(req, res);
    return res.redirect(301, '/404.html');
  });

  server.listen(port, err => {
    if (err) throw err;

    // eslint-disable-next-line no-console
    logger.info(`🚀 Server ready at http://localhost:${port} in env ${env}`);
    dogstatsd.increment('checkout-frontend.startup');
  });
});
