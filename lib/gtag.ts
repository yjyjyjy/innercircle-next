// Google Analytics Enabler

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID

declare global {
    interface Window {
        gtag: any;
    }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview: Pageview = (url) => {
    if (typeof window !== 'undefined') {
        window.gtag('config', GA_TRACKING_ID, {
            page_path: url,
        })
    }
}

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event: Event = ({ action, category, label, value }) => {
    if (typeof window !== 'undefined') {
        window.gtag('event', action, {
            event_category: category,
            event_label: label,
            value: value,
        })
    }
}

type Pageview = (url: string) => void;
type Event = (e: IEvent) => void;

interface IEvent {
    action: string,
    category: string,
    label: string,
    value: Number
}