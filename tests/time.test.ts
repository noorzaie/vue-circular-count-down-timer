import { describe, expect, it } from 'vitest';
import { normalizeUnits, splitTime, toTimestamp } from '../src/core/time';
import type { TimeUnit } from '../src/types';

describe('splitTime', () => {
	it('splits into all units by default', () => {
		const ms = ((2 * 24 + 3) * 60 + 4) * 60_000 + 5_000;
		expect(splitTime(ms)).toEqual({ days: 2, hours: 3, minutes: 4, seconds: 5 });
	});

	it('rounds the smallest unit up', () => {
		expect(splitTime(1, [ 'seconds' ])).toEqual({ seconds: 1 });
		expect(splitTime(1)).toEqual({ days: 0, hours: 0, minutes: 0, seconds: 1 });
		expect(splitTime(61_000, [ 'minutes', 'seconds' ])).toEqual({ minutes: 1, seconds: 1 });
		expect(splitTime(60_001, [ 'minutes', 'seconds' ])).toEqual({ minutes: 1, seconds: 1 });
		expect(splitTime(59_001, [ 'minutes', 'seconds' ])).toEqual({ minutes: 1, seconds: 0 });
		expect(splitTime(1, [ 'hours', 'minutes' ])).toEqual({ hours: 0, minutes: 1 });
	});

	it('returns zeros for 0, negative and invalid durations', () => {
		expect(splitTime(0, [ 'minutes', 'seconds' ])).toEqual({ minutes: 0, seconds: 0 });
		expect(splitTime(-5_000, [ 'minutes', 'seconds' ])).toEqual({ minutes: 0, seconds: 0 });
		expect(splitTime(Number.NaN, [ 'minutes', 'seconds' ])).toEqual({ minutes: 0, seconds: 0 });
	});

	it('puts the overflow into the largest unit', () => {
		expect(splitTime(50 * 3_600_000, [ 'hours', 'minutes' ])).toEqual({ hours: 50, minutes: 0 });
		expect(splitTime(90 * 60_000, [ 'minutes' ])).toEqual({ minutes: 90 });
	});

	it('normalizes the units', () => {
		expect(splitTime(90_000, [ 'seconds', 'minutes', 'seconds' ])).toEqual({ minutes: 1, seconds: 30 });
		expect(Object.keys(splitTime(90_000, [ 'seconds', 'minutes' ]))).toEqual([ 'minutes', 'seconds' ]);
		expect(splitTime(90_000, [])).toEqual({ days: 0, hours: 0, minutes: 1, seconds: 30 });
	});
});

describe('normalizeUnits', () => {
	it('dedupes and sorts units from largest to smallest', () => {
		expect(normalizeUnits([ 'seconds', 'days', 'seconds', 'hours' ])).toEqual([ 'days', 'hours', 'seconds' ]);
	});

	it('falls back to all units for empty or invalid input', () => {
		expect(normalizeUnits([])).toEqual([ 'days', 'hours', 'minutes', 'seconds' ]);
		expect(normalizeUnits([ 'weeks' as TimeUnit ])).toEqual([ 'days', 'hours', 'minutes', 'seconds' ]);
	});

	it('drops invalid units mixed with valid ones', () => {
		expect(normalizeUnits([ 'weeks' as TimeUnit, 'minutes' ])).toEqual([ 'minutes' ]);
	});
});

describe('toTimestamp', () => {
	it('accepts a Date, a number and an ISO string', () => {
		const ms = Date.UTC(2030, 0, 2, 3, 4, 5);
		expect(toTimestamp(new Date(ms))).toBe(ms);
		expect(toTimestamp(ms)).toBe(ms);
		expect(toTimestamp('2030-01-02T03:04:05.000Z')).toBe(ms);
	});
});
