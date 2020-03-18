const Logger = require('@noths/logger').default;

const { ENV_TYPE, SENTRY_PROJECT_ID, SENTRY_CLIENT_KEY, GIT_COMMIT } = process.env;

const config = {
  service: 'checkout-frontend',
  sentry: {
    project: SENTRY_PROJECT_ID,
    keys: {
      public: SENTRY_CLIENT_KEY,
    },
    release: `checkout-frontend/${GIT_COMMIT}`,
  },
  environment: ENV_TYPE || 'development',
};

const logger = new Logger(config);

export default logger;
