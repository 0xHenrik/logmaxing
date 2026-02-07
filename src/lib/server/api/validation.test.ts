import { it, expect, describe } from 'vitest';

import { parseId, requireJson, escapeLikePattern } from './validation';

// ============ parseId ============

describe('parseId', () => {
	it('parses valid positive integers', () => {
		expect(parseId('1')).toBe(1);
		expect(parseId('10')).toBe(10);
		expect(parseId('999')).toBe(999);
	});

	it('returns null for zero', () => {
		expect(parseId('0')).toBeNull();
	});

	it('returns null for negative numbers', () => {
		expect(parseId('-1')).toBeNull();
		expect(parseId('-5')).toBeNull();
	});

	it('returns null for non-integer numbers', () => {
		expect(parseId('1.5')).toBeNull();
		expect(parseId('3.14')).toBeNull();
	});

	it('returns null for non-numeric strings', () => {
		expect(parseId('abc')).toBeNull();
		expect(parseId('')).toBeNull();
		expect(parseId('hello')).toBeNull();
	});

	it('returns null for undefined', () => {
		expect(parseId(undefined)).toBeNull();
	});

	it('returns null for NaN-producing values', () => {
		expect(parseId('NaN')).toBeNull();
		expect(parseId('Infinity')).toBeNull();
	});

	it('handles MAX_SAFE_INTEGER', () => {
		expect(parseId(String(Number.MAX_SAFE_INTEGER))).toBe(Number.MAX_SAFE_INTEGER);
	});
});

// ============ escapeLikePattern ============

describe('escapeLikePattern', () => {
	it('escapes percent wildcard', () => {
		expect(escapeLikePattern('100%')).toBe('100\\%');
		expect(escapeLikePattern('%match%')).toBe('\\%match\\%');
	});

	it('escapes underscore wildcard', () => {
		expect(escapeLikePattern('user_name')).toBe('user\\_name');
	});

	it('escapes backslash', () => {
		expect(escapeLikePattern('path\\to')).toBe('path\\\\to');
	});

	it('escapes combined wildcards', () => {
		expect(escapeLikePattern('%_\\')).toBe('\\%\\_\\\\');
	});

	it('passes through normal text unchanged', () => {
		expect(escapeLikePattern('bench press')).toBe('bench press');
		expect(escapeLikePattern('hello world')).toBe('hello world');
	});

	it('handles empty string', () => {
		expect(escapeLikePattern('')).toBe('');
	});
});

// ============ requireJson ============

describe('requireJson', () => {
	it('returns null for valid application/json', () => {
		const request = new Request('http://localhost', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' }
		});
		expect(requireJson(request)).toBeNull();
	});

	it('returns null for application/json with charset', () => {
		const request = new Request('http://localhost', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json; charset=utf-8' }
		});
		expect(requireJson(request)).toBeNull();
	});

	it('returns 415 response for missing Content-Type', () => {
		const request = new Request('http://localhost', { method: 'POST' });
		const result = requireJson(request);
		expect(result).not.toBeNull();
		expect(result!.status).toBe(415);
	});

	it('returns 415 response for wrong Content-Type', () => {
		const request = new Request('http://localhost', {
			method: 'POST',
			headers: { 'Content-Type': 'text/html' }
		});
		const result = requireJson(request);
		expect(result).not.toBeNull();
		expect(result!.status).toBe(415);
	});

	it('returns error message in 415 response body', async () => {
		const request = new Request('http://localhost', {
			method: 'POST',
			headers: { 'Content-Type': 'text/plain' }
		});
		const result = requireJson(request);
		const body = await result!.json();
		expect(body.error).toBe('Content-Type must be application/json');
	});
});
