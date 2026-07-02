import { type Handle, error } from '@sveltejs/kit';
import { sequence } from '@sveltejs/kit/hooks';
import { building } from '$app/environment';
import { auth } from '$lib/server/auth';
import { svelteKitHandler } from 'better-auth/svelte-kit';

/**
 * Best-effort in-memory rate limiter for public POST endpoints. Note: on
 * serverless (Netlify) this state is per-warm-instance and resets on cold
 * starts, so it mitigates bursts rather than providing hard guarantees. For
 * strict limits, move this to an edge/KV-backed store.
 */
const RATE_LIMIT = 20; // requests
const RATE_WINDOW_MS = 60_000; // per minute
const RATE_LIMITED_PATHS = ['/api/checkout', '/api/discount'];
const hits = new Map<string, { count: number; resetAt: number }>();

function isRateLimited(key: string): boolean {
	const now = Date.now();
	const entry = hits.get(key);
	if (!entry || now > entry.resetAt) {
		hits.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS });
		return false;
	}
	entry.count += 1;
	return entry.count > RATE_LIMIT;
}

const handleRateLimit: Handle = async ({ event, resolve }) => {
	if (event.request.method === 'POST' && RATE_LIMITED_PATHS.includes(event.url.pathname)) {
		const ip = event.getClientAddress();
		if (isRateLimited(`${ip}:${event.url.pathname}`)) {
			error(429, 'Too many requests. Please slow down and try again shortly.');
		}
	}
	return resolve(event);
};

const handleBetterAuth: Handle = async ({ event, resolve }) => {
	const session = await auth.api.getSession({ headers: event.request.headers });

	if (session) {
		event.locals.session = session.session;
		event.locals.user = session.user as App.Locals['user'];
	}

	return svelteKitHandler({ event, resolve, auth, building });
};

export const handle: Handle = sequence(handleRateLimit, handleBetterAuth);
