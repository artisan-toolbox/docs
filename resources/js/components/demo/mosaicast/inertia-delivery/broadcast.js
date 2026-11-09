import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

const key = import.meta.env.VITE_REVERB_APP_KEY;
const host = import.meta.env.VITE_REVERB_HOST;
const port = Number(import.meta.env.VITE_REVERB_PORT || 443);
const scheme = import.meta.env.VITE_REVERB_SCHEME || 'https';

export const demoEcho =
    key && host
        ? new Echo({
              broadcaster: 'reverb',
              Pusher,
              key,
              wsHost: host,
              wsPort: port,
              wssPort: port,
              forceTLS: scheme === 'https',
              enabledTransports: ['ws', 'wss'],
          })
        : undefined;

export function hasDemoBroadcast() {
    return demoEcho !== undefined;
}

export function connectDemoBroadcast(sessionIdentifier, channelPrefix) {
    if (
        !demoEcho ||
        typeof sessionIdentifier !== 'string' ||
        !/^[a-f0-9]{64}$/.test(sessionIdentifier)
    ) {
        return Promise.reject(new Error('Broadcasting requires a configured session.'));
    }

    const channel = demoEcho.private(`${channelPrefix}.${sessionIdentifier}`);
    if (channel.subscription.subscribed) return Promise.resolve();

    return new Promise((resolve, reject) => {
        function cleanup() {
            clearTimeout(timeout);
            channel.subscription.unbind('pusher:subscription_succeeded', subscribed);
            channel.subscription.unbind('pusher:subscription_error', denied);
        }
        function subscribed() {
            cleanup();
            resolve();
        }
        function denied() {
            cleanup();
            reject(new Error('The private subscription was denied.'));
        }
        const timeout = setTimeout(() => {
            cleanup();
            reject(new Error('The private subscription timed out.'));
        }, 10000);
        channel.subscription.bind('pusher:subscription_succeeded', subscribed);
        channel.subscription.bind('pusher:subscription_error', denied);
    });
}
