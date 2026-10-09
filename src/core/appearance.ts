import type { CircleAppearance } from '../types';

const APPEARANCE_KEYS = [
	'size',
	'strokeWidth',
	'strokeColor',
	'underneathStrokeColor',
	'fillColor',
	'valueFontSize',
	'labelFontSize',
	'labelPosition',
	'showValue',
	'strokeLinecap',
	'direction',
	'formatValue'
] as const satisfies readonly (keyof CircleAppearance)[];

/** Merges circle options over shared options; `undefined` options fall back to the shared ones. */
export function mergeAppearance (shared: CircleAppearance, own: CircleAppearance = {}): CircleAppearance {
	const result: Record<string, unknown> = {};
	for (const key of APPEARANCE_KEYS) {
		result[key] = own[key] !== undefined ? own[key] : shared[key];
	}
	return result as CircleAppearance;
}

export function formatValue (value: number, formatter?: CircleAppearance['formatValue']): string {
	return String(formatter ? formatter(value) : value);
}
