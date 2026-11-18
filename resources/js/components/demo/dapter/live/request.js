import { route } from 'ziggy-js';
export async function fixtureRequest(action, body = {}) {
    const response = await fetch(route(`demo.dapter.live.${action}`, undefined, false), {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-XSRF-TOKEN': decodeURIComponent(
                document.cookie
                    .split('; ')
                    .find((cookie) => cookie.startsWith('XSRF-TOKEN='))
                    ?.slice(11) ?? '',
            ),
        },
        body: JSON.stringify(body),
    });
    if (!response.ok)
        throw new Error('The fictional session could not update. Reset and try again.');
    return response.json();
}
