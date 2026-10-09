import type { CircleConfig, CircleValues, StopConditions } from '../types';

export interface CircleState {
	value: number;
	steps: number;
	startValue: number;
	stepLength: number;
	dependentCircles: string[];
}

export type StepState = Record<string, CircleState>;

export function createStepState (circles: CircleConfig[]): StepState {
	const state: StepState = {};
	for (const circle of circles) {
		state[String(circle.id)] = {
			value: circle.value ?? 0,
			steps: circle.steps,
			startValue: circle.startValue ?? 0,
			stepLength: circle.stepLength || 1,
			dependentCircles: (circle.dependentCircles ?? []).map(String)
		};
	}
	return state;
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

// Limits the circles moved in one step, so cyclic `dependentCircles` can't hang the page
const MAX_MOVES_PER_STEP = 10_000;

/**
 * Moves a circle one step. A circle holds `steps` values from `startValue` to `startValue + steps - 1`;
 * each time it wraps around, its dependent circles move one step too.
 */
export function advanceCircle (state: StepState, id: string): void {
	// A queue instead of recursion; each circle only depends on its own value, so the order doesn't matter
	const queue = [ id ];
	let moves = 0;

	for (let next = 0; next < queue.length && moves < MAX_MOVES_PER_STEP; next++) {
		const circle = state[queue[next]!];
		if (!circle || circle.steps <= 0) {
			continue;
		}
		moves++;

		const offset = circle.value + circle.stepLength - circle.startValue;
		const wraps = Math.floor(offset / circle.steps);
		circle.value = circle.startValue + mod(offset, circle.steps);

		for (let i = 0; i < Math.abs(wraps); i++) {
			queue.push(...circle.dependentCircles);
		}
	}
}

export function shouldStop (state: StepState, stopConditions: StopConditions): boolean {
	const ids = Object.keys(stopConditions);
	return ids.length > 0 && ids.every(id => state[id]?.value === stopConditions[id]);
}

export function getValues (state: StepState): CircleValues {
	const values: CircleValues = {};
	for (const id in state) {
		values[id] = state[id]!.value;
	}
	return values;
}
