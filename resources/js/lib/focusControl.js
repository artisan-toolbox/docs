/**
 * Focus an upgraded control while its caller still owns the request.
 * @param {(HTMLElement & { updateComplete?: Promise<unknown> }) | null | undefined} host
 * @param {{ signal: AbortSignal }} options
 */
export async function focusControl(host, { signal }) {
    if (!host || signal.aborted) return false;
    if (host.localName.includes('-')) await customElements.whenDefined(host.localName);
    if (signal.aborted || !host.isConnected) return false;
    await host.updateComplete;
    if (signal.aborted || !host.isConnected) return false;
    host.focus();
    return true;
}
