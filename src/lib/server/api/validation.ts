/**
 * Shared validation utilities for API route handlers.
 */

/**
 * Parse and validate a route parameter ID.
 * Returns null if the value is not a positive integer.
 */
export function parseId(raw: string | undefined): number | null {
	const n = Number(raw);
	if (!Number.isInteger(n) || n < 1) return null;
	return n;
}

/**
 * Escape SQL ILIKE/LIKE wildcard characters (%, _, \)
 * to prevent wildcard injection in search patterns.
 */
export function escapeLikePattern(input: string): string {
	return input.replace(/[%_\\]/g, '\\$&');
}

/**
 * Require Content-Type: application/json on request.
 * Returns a 415 Response if invalid, or null if OK.
 */
export function requireJson(request: Request): Response | null {
	const ct = request.headers.get('Content-Type');
	if (!ct || !ct.includes('application/json')) {
		return Response.json({ error: 'Content-Type must be application/json' }, { status: 415 });
	}
	return null;
}
