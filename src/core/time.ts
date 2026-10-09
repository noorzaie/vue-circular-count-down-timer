import type { TimeParts, TimeUnit } from '../types';

export const TIME_UNITS: readonly TimeUnit[] = [ 'days', 'hours', 'minutes', 'seconds' ];

export const UNIT_MS: Readonly<Record<TimeUnit, number>> = {
	days: 86_400_000,
	hours: 3_600_000,
	minutes: 60_000,
	seconds: 1_000
};

/** Removes unknown and duplicate units and sorts them from largest to smallest. */
export function normalizeUnits (units: readonly TimeUnit[]): TimeUnit[] {
	const result = TIME_UNITS.filter(unit => units.includes(unit));
	return result.length > 0 ? result : [ ...TIME_UNITS ];
}

/**
 * Splits a duration in ms into the given units. The smallest unit is rounded up,
 * so a countdown shows its full starting value and reaches zero exactly when it ends.
 * The largest unit holds everything above it, e.g. 50 hours when `days` is not used.
 */
export function splitTime (ms: number, units: readonly TimeUnit[] = TIME_UNITS): TimeParts {
	const sorted = normalizeUnits(units);
	const smallest = UNIT_MS[sorted[sorted.length - 1]!];
	let rest = Number.isFinite(ms) ? Math.ceil(Math.max(0, ms) / smallest) * smallest : 0;

	const parts: TimeParts = {};
	for (const unit of sorted) {
		parts[unit] = Math.floor(rest / UNIT_MS[unit]);
		rest -= parts[unit] * UNIT_MS[unit];
	}
	return parts;
}

export function toTimestamp (value: Date | number | string): number {
	return value instanceof Date ? value.getTime() : typeof value === 'number' ? value : Date.parse(value);
}
