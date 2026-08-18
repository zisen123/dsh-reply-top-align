/**
 * Host half for dsh-reply-top-align.
 *
 * The plugin has no host-side behavior. The empty apply exists so Cordis can
 * mount this row from a host composition; the browser half is discovered via
 * package.json exports["./client"] and dsh.client.
 */
export function apply() {}
