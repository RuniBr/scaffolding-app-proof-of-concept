require('dotenv').config();
const path = require('path');
const withImages = require('next-images');
const withSourceMaps = require('@zeit/next-source-maps')();
const { webpackExternal: amplifyExternal } = require('@noths/amplify');

const {
  STATIC_FILES_CDN_URL,
  GIT_COMMIT,
  ENV_TYPE,
  NODE_ENV,
  SENTRY_KEY,
  SENTRY_PROJECT,
  TEST,
  LOCAL_DEV_USERNAME,
  LOCAL_DEV_PASSWORD,
  ADYEN_CSE_PUBLIC_KEY,
  SUB_TWO_ENABLED,
} = process.env;

const isDevOrTest = NODE_ENV === 'development' || TEST;

const CDN_PATH = STATIC_FILES_CDN_URL ? `//${STATIC_FILES_CDN_URL}/checkout-frontend` : '';

module.exports = withSourceMaps(
  withImages({
    distDir: 'build/_next',
    ...(CDN_PATH && {
      assetPrefix: CDN_PATH,
    }),
    publicRuntimeConfig: {
      GIT_COMMIT,
      ENV_TYPE,
      NODE_ENV,
      SENTRY_KEY,
      SENTRY_PROJECT,
      CDN_PATH,
      TEST,
      LOCAL_DEV_USERNAME,
      LOCAL_DEV_PASSWORD,
      ADYEN_CSE_PUBLIC_KEY,
      SUB_TWO_ENABLED,
      APP_BASE_PATH: isDevOrTest ? '' : '',
    },
    serverRuntimeConfig: {
      isServer: true,
    },
    webpack: (webpackConfig, { isServer }) => {
      if (isServer) {
        return webpackConfig;
      }

      const { resolve } = webpackConfig || {};
      return {
        ...webpackConfig,
        resolve: {
          ...resolve,
          modules: Array.from(
            new Set([path.resolve(__dirname, '/'), 'node_modules', ...resolve.modules])
          ),
        },
        externals: {
          ...(webpackConfig.externals ? webpackConfig.externals : []),
          ...amplifyExternal,
        },
      };
    },
  })
);
