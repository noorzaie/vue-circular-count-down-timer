import type { CircleConfig, Direction, LabelPosition, StopConditions, StrokeLinecap, TimeUnit } from 'vue-circular-count-down-timer';

export type TimerKind = 'time' | 'steps';
export type TimeSource = 'duration' | 'end';

export interface TimeSettings {
	source: TimeSource;
	hours: number;
	minutes: number;
	seconds: number;
	/** Value of a datetime-local input, e.g. 2026-12-31T00:00 */
	end: string;
	units: TimeUnit[];
}

export interface StepSettings {
	preset: string;
	interval: number;
	mainCircleId: string;
	circles: CircleConfig[];
	stopConditions: StopConditions;
}

export interface AppearanceSettings {
	autostart: boolean;
	size: number;
	strokeWidth: number;
	strokeLinecap: StrokeLinecap;
	direction: Direction;
	labelPosition: LabelPosition;
	showValue: boolean;
	padValues: boolean;
	valueFontSize: number;
	labelFontSize: number;
	strokeColor?: string;
	underneathStrokeColor?: string;
	fillColor?: string;
}

export interface StepPreset {
	id: string;
	name: string;
	mainCircleId: string;
	circles: CircleConfig[];
	stopConditions: StopConditions;
}

export const STEP_PRESETS: StepPreset[] = [
	{
		id: 'clock',
		name: 'Clock (counts up)',
		mainCircleId: 'seconds',
		stopConditions: {},
		circles: [
			{ id: 'hours', steps: 24, label: 'hours' },
			{ id: 'minutes', steps: 60, label: 'minutes', dependentCircles: [ 'hours' ] },
			{ id: 'seconds', steps: 60, value: 50, label: 'seconds', dependentCircles: [ 'minutes' ] }
		]
	},
	{
		id: 'countdown',
		name: 'Count down from 01:30 and stop',
		mainCircleId: 'seconds',
		stopConditions: { minutes: 0, seconds: 0 },
		circles: [
			{ id: 'minutes', steps: 60, value: 1, stepLength: -1, label: 'minutes' },
			{ id: 'seconds', steps: 60, value: 30, stepLength: -1, label: 'seconds', dependentCircles: [ 'minutes' ] }
		]
	},
	{
		id: 'dial',
		name: '12-hour dial (1 to 12)',
		mainCircleId: 'hour',
		stopConditions: {},
		circles: [
			{ id: 'hour', steps: 12, startValue: 1, value: 9, label: 'hour' }
		]
	},
	{
		id: 'single',
		name: 'Single circle, 10 steps',
		mainCircleId: '1',
		stopConditions: {},
		circles: [
			{ id: '1', steps: 10, label: 'steps' }
		]
	}
];

export const TIME_UNIT_OPTIONS: TimeUnit[] = [ 'days', 'hours', 'minutes', 'seconds' ];

const toDateTimeLocal = (date: Date) => {
	const pad = (n: number) => String(n).padStart(2, '0');
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
};

export const createTimeSettings = (): TimeSettings => ({
	source: 'duration',
	hours: 0,
	minutes: 1,
	seconds: 30,
	end: toDateTimeLocal(new Date(Date.now() + 3 * 86_400_000)),
	units: [ 'minutes', 'seconds' ]
});

export const createStepSettings = (preset = STEP_PRESETS[0]!): StepSettings => ({
	preset: preset.id,
	interval: 1000,
	mainCircleId: preset.mainCircleId,
	circles: structuredClone(preset.circles),
	stopConditions: { ...preset.stopConditions }
});

export const createAppearanceSettings = (): AppearanceSettings => ({
	autostart: true,
	size: 120,
	strokeWidth: 10,
	strokeLinecap: 'round',
	direction: 'clockwise',
	labelPosition: 'bottom',
	showValue: true,
	padValues: true,
	valueFontSize: 26,
	labelFontSize: 13,
	strokeColor: undefined,
	underneathStrokeColor: undefined,
	fillColor: undefined
});

export const durationMs = (time: TimeSettings) => ((time.hours * 60 + time.minutes) * 60 + time.seconds) * 1000;

export const pad = (value: number) => String(value).padStart(2, '0');

// ---- Code generation ----

/** Formats a value as a JavaScript literal with single quotes and unquoted keys. */
export function toJs (value: unknown, indent = ''): string {
	if (Array.isArray(value)) {
		if (value.length === 0) {
			return '[]';
		}
		const simple = value.every(item => typeof item !== 'object' || item === null);
		if (simple) {
			return `[ ${value.map(item => toJs(item)).join(', ')} ]`;
		}
		const inner = `${indent}\t`;
		return `[\n${value.map(item => inner + toJs(item, inner)).join(',\n')}\n${indent}]`;
	}
	if (value && typeof value === 'object') {
		const entries = Object.entries(value).filter(([ , v ]) => v !== undefined);
		if (entries.length === 0) {
			return '{}';
		}
		const key = (k: string) => /^[A-Za-z_$][\w$]*$/.test(k) ? k : `'${k}'`;
		return `{ ${entries.map(([ k, v ]) => `${key(k)}: ${toJs(v, indent)}`).join(', ')} }`;
	}
	if (typeof value === 'string') {
		return `'${value.replace(/\\/g, '\\\\').replace(/'/g, '\\\'')}'`;
	}
	return String(value);
}

const appearanceAttributes = (look: AppearanceSettings): string[] => {
	const attrs: string[] = [ `:size="${look.size}"` ];
	if (look.strokeWidth !== 10) {
		attrs.push(`:stroke-width="${look.strokeWidth}"`);
	}
	if (look.strokeLinecap !== 'butt') {
		attrs.push(`stroke-linecap="${look.strokeLinecap}"`);
	}
	if (look.direction !== 'clockwise') {
		attrs.push(`direction="${look.direction}"`);
	}
	if (look.labelPosition !== 'bottom') {
		attrs.push(`label-position="${look.labelPosition}"`);
	}
	if (!look.showValue) {
		attrs.push(':show-value="false"');
	}
	if (look.valueFontSize !== 20) {
		attrs.push(`:value-font-size="${look.valueFontSize}"`);
	}
	if (look.labelFontSize !== 15) {
		attrs.push(`:label-font-size="${look.labelFontSize}"`);
	}
	if (look.strokeColor) {
		attrs.push(`stroke-color="${look.strokeColor}"`);
	}
	if (look.underneathStrokeColor) {
		attrs.push(`underneath-stroke-color="${look.underneathStrokeColor}"`);
	}
	if (look.fillColor) {
		attrs.push(`fill-color="${look.fillColor}"`);
	}
	if (look.padValues) {
		attrs.push(':format-value="pad"');
	}
	if (!look.autostart) {
		attrs.push(':autostart="false"');
	}
	return attrs;
};

const renderComponent = (name: string, attrs: string[]) =>
	`<template>\n\t<${name}\n${attrs.map(attr => `\t\t${attr}`).join('\n')}\n\t/>\n</template>`;

const renderScript = (component: string, lines: string[]) => [
	'<script setup>',
	`import { ${component} } from 'vue-circular-count-down-timer';`,
	...(lines.length > 0 ? [ '', ...lines ] : []),
	'</script>'
].join('\n');

export function generateTimeCode (time: TimeSettings, look: AppearanceSettings): string {
	const attrs: string[] = [];
	if (time.source === 'end') {
		attrs.push(`end="${time.end}"`);
	} else {
		attrs.push(`:duration="${durationMs(time) / 1000} * 1000"`);
	}
	const units = TIME_UNIT_OPTIONS.filter(unit => time.units.includes(unit));
	if (units.length !== TIME_UNIT_OPTIONS.length) {
		attrs.push(`:units="${toJs(units)}"`);
	}
	attrs.push(...appearanceAttributes(look), '@finished="onFinished"');

	const lines = [
		...(look.padValues ? [ 'const pad = (value) => String(value).padStart(2, \'0\');' ] : []),
		'const onFinished = () => console.log(\'Time is up!\');'
	];
	return `${renderComponent('CircularTimeCountDown', attrs)}\n\n${renderScript('CircularTimeCountDown', lines)}\n`;
}

export function generateStepCode (steps: StepSettings, look: AppearanceSettings): string {
	const attrs = [ ':circles="circles"', `main-circle-id="${steps.mainCircleId}"` ];
	if (steps.interval !== 1000) {
		attrs.push(`:interval="${steps.interval}"`);
	}
	const hasStopConditions = Object.keys(steps.stopConditions).length > 0;
	if (hasStopConditions) {
		attrs.push(':stop-conditions="stopConditions"');
	}
	attrs.push(...appearanceAttributes(look), '@update="onUpdate"');

	const lines = [
		`const circles = ${toJs(steps.circles)};`,
		...(hasStopConditions ? [ `const stopConditions = ${toJs(steps.stopConditions)};` ] : []),
		...(look.padValues ? [ 'const pad = (value) => String(value).padStart(2, \'0\');' ] : []),
		'const onUpdate = (values) => console.log(values);'
	];
	return `${renderComponent('CircularCountDownTimer', attrs)}\n\n${renderScript('CircularCountDownTimer', lines)}\n`;
}
