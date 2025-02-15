import { defineBoot } from '#q-app/wrappers'

import * as Sentry from "@sentry/vue";

import type { Router } from 'vue-router';
import type { App } from 'vue';

export default defineBoot(({ app, router }: { app: App, router: Router }) => {
    Sentry.init({
        app,
        dsn: "https://6a97d3459a5a993d2d5e3689784bb70c@o4508824465637376.ingest.de.sentry.io/4508825630605392",
        integrations: [
          Sentry.browserTracingIntegration({ router }),
          Sentry.replayIntegration(),
        ],
        // Tracing
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        tracePropagationTargets: ["localhost", /^https:\/\/yourserver\.io\/api/],
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
      });
});