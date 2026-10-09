import type { Component } from 'vue';

export interface Example {
	id: string;
	title: string;
	description: string;
	tag: 'New in v3' | 'Classic';
	component: Component;
	/** Source code of the example file, shown next to the live demo */
	source: string;
}

const components = import.meta.glob<Component>('./*.vue', { eager: true, import: 'default' });
const sources = import.meta.glob<string>('./*.vue', { eager: true, query: '?raw', import: 'default' });

const EXAMPLES: Omit<Example, 'component' | 'source'>[] = [
	{
		id: 'CountdownToDate',
		title: 'Countdown to a date',
		description: 'Pass an `end` date and the units to show. The countdown is based on the clock, so it stays accurate in background tabs.',
		tag: 'New in v3'
	},
	{
		id: 'PomodoroTimer',
		title: 'Pomodoro timer with controls',
		description: 'Start, pause, resume and reset through a template ref, and react to the timer events.',
		tag: 'New in v3'
	},
	{
		id: 'CustomLayout',
		title: 'Build your own with useCountdown',
		description: 'Use the `useCountdown` composable with `CountDownCircle`, or any markup of your own.',
		tag: 'New in v3'
	},
	{
		id: 'CustomSlots',
		title: 'Custom value slot',
		description: 'Render anything inside the circles with the `value` and `label` slots.',
		tag: 'New in v3'
	},
	{
		id: 'CssVariables',
		title: 'Theming with CSS variables',
		description: 'Style every timer on a page with `--cdt-*` custom properties, even with SVG gradients.',
		tag: 'New in v3'
	},
	{
		id: 'PerCircleOptions',
		title: 'Per-circle options',
		description: 'Shared options go on the component, and each circle can override any of them.',
		tag: 'Classic'
	},
	{
		id: 'DependentCircles',
		title: 'Dependent circles',
		description: 'A circle moves one step each time the circle it depends on completes a round.',
		tag: 'Classic'
	},
	{
		id: 'StopConditions',
		title: 'Stop conditions',
		description: 'Stop the timer when the circles reach the given values, then start it again.',
		tag: 'Classic'
	},
	{
		id: 'CountingDown',
		title: 'Counting down',
		description: 'A negative `stepLength` makes circles count down.',
		tag: 'Classic'
	},
	{
		id: 'CirclesArrangement',
		title: 'Circles arrangement',
		description: 'Lay the circles out with your own classes through `container-classes`.',
		tag: 'Classic'
	},
	{
		id: 'SimpleCircle',
		title: 'Simple',
		description: 'A single circle with 10 steps.',
		tag: 'Classic'
	}
];

export const examples: Example[] = EXAMPLES.map(example => ({
	...example,
	component: components[`./${example.id}.vue`]!,
	source: sources[`./${example.id}.vue`]!
}));
