/* eslint-disable no-console */
const isSentryAvailable = process.browser && window && window.Sentry;
const logMissing = () =>
  console.warn(
    "Sentry unavailable. Make sure you're not calling from the server, and that the library has loaded successfully."
  );

// allow method calls on Server because we don't want to throw if we've already hit an error
// but they all just warn you to make sure you do it on the client 👍
export default isSentryAvailable
  ? window.Sentry
  : {
      // this should be enough...
      captureEvent: logMissing,
      captureException: logMissing,
      captureMessage: logMissing,
      withScope: logMissing,
    };

declare global {
  interface Window {
    Sentry: Record<string, any>;
  }
}
