const isClient = process.browser;

interface PageLoadTrackingData {
  event: string;
  eventCategory: string;
  eventAction: string;
  eventLabel?: string;
}

type Event = PageLoadTrackingData | Record<string, string>;
type PageLoadData = Event;
interface SiteSpect {
  Require: (callback: () => void) => void;
  EventTrack: {
    rp: (metricName: string) => void;
  };
}

declare global {
  interface Window {
    dataLayer?: Event[];
    SS: SiteSpect;
  }
}

class GTM {
  pageLoadTracked: boolean;

  pageLoadTrackingData: PageLoadTrackingData | null;

  pageLoadData: PageLoadData;

  fatalErrorTracked: boolean;

  constructor() {
    this.pageLoadTracked = false;
    this.pageLoadTrackingData = {
      event: 'checkout_state',
      eventCategory: 'Checkout',
      eventAction: 'Checkout state',
      eventLabel: undefined,
    };
    this.pageLoadData = {};
    this.fatalErrorTracked = false;
  }

  sendEvent(event: Event) {
    if (isClient && window.dataLayer) {
      window.dataLayer.push(event);
    }
  }

  addEventToQueue(event: Event, dependencyCb: () => boolean) {
    let id: number;

    const tryFulFil = () => {
      if (dependencyCb()) {
        this.sendEvent(event);
      } else {
        this.addEventToQueue(event, dependencyCb);
      }
      clearTimeout(id);
    };

    id = setTimeout(() => tryFulFil(), 500);
  }

  isStateInitialised = () => this.pageLoadTrackingData == null;

  trackSiteSpectMetric(metricName: string) {
    if (!window.SS) {
      // eslint-disable-next-line no-console
      console.warn(
        "Window.SS (SiteSpect) unavailable. Make sure you're not calling from the server, and that the library has loaded successfully."
      );
    } else {
      window.SS.Require(() => {
        window.SS.EventTrack.rp(metricName);
      });
    }
  }

  trackPageLoad() {
    this.sendEvent(this.pageLoadTrackingData!);
    this.pageLoadData = {};
    this.pageLoadTrackingData = null;
  }

  trackFatalError() {
    if (!this.fatalErrorTracked) {
      this.sendEvent({
        event: 'checkout_events',
        eventCategory: 'Checkout',
        eventAction: 'Error',
        eventLabel: 'Fatal error',
      });

      this.fatalErrorTracked = true;
    }
  }
}

export default new GTM();
