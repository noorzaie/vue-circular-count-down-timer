import { describe, expect, it } from 'vitest';
import { advanceCircle, createStepState, getValues, shouldStop, type StepState } from '../src/core/steps';
import type { CircleConfig } from '../src/types';

const advance = (state: StepState, id: string, times = 1) => {
	for (let i = 0; i < times; i++) {
		advanceCircle(state, id);
	}
};

describe('createStepState', () => {
	it('uses defaults for missing options', () => {
		const state = createStepState([ { id: 'a', steps: 10 } ]);
		expect(state.a).toEqual({ value: 0, steps: 10, startValue: 0, stepLength: 1, dependentCircles: [] });
	});

	it('defaults stepLength 0 and undefined to 1', () => {
		const state = createStepState([
			{ id: 'zero', steps: 10, stepLength: 0 },
			{ id: 'undef', steps: 10, stepLength: undefined }
		]);
		advance(state, 'zero');
		advance(state, 'undef');
		expect(getValues(state)).toEqual({ zero: 1, undef: 1 });
	});

	it('keys numeric ids as strings', () => {
		const state = createStepState([
			{ id: 1, steps: 10, value: 9, dependentCircles: [ 2 ] },
			{ id: 2, steps: 10, value: 3 }
		]);
		expect(Object.keys(state)).toEqual([ '1', '2' ]);
		advance(state, '1');
		expect(getValues(state)).toEqual({ 1: 0, 2: 4 });
	});
});

describe('advanceCircle', () => {
	it('counts up through every value from startValue to startValue + steps - 1', () => {
		const state = createStepState([ { id: 'h', steps: 12, startValue: 1, value: 10 } ]);
		const seen: number[] = [];
		for (let i = 0; i < 4; i++) {
			advance(state, 'h');
			seen.push(state.h!.value);
		}
		expect(seen).toEqual([ 11, 12, 1, 2 ]);
	});

	it('counts down from 0 wrapping to 59 and moves dependents by their own stepLength', () => {
		const state = createStepState([
			{ id: 's', steps: 60, value: 0, stepLength: -1, dependentCircles: [ 'm' ] },
			{ id: 'm', steps: 60, value: 5, stepLength: -1 }
		]);
		advance(state, 's');
		expect(getValues(state)).toEqual({ s: 59, m: 4 });
		advance(state, 's');
		expect(getValues(state)).toEqual({ s: 58, m: 4 });
	});

	it('counts down with a startValue', () => {
		const state = createStepState([ { id: 'h', steps: 12, startValue: 1, value: 2, stepLength: -1 } ]);
		const seen: number[] = [];
		for (let i = 0; i < 3; i++) {
			advance(state, 'h');
			seen.push(state.h!.value);
		}
		expect(seen).toEqual([ 1, 12, 11 ]);
	});

	it('moves dependents once per wrap', () => {
		const state = createStepState([
			{ id: 's', steps: 60, value: 0, dependentCircles: [ 'm' ] },
			{ id: 'm', steps: 60, value: 0, dependentCircles: [ 'h' ] },
			{ id: 'h', steps: 24, value: 0 }
		]);
		advance(state, 's', 60);
		expect(getValues(state)).toEqual({ s: 0, m: 1, h: 0 });
		advance(state, 's', 59 * 60);
		expect(getValues(state)).toEqual({ s: 0, m: 0, h: 1 });
	});

	it('wraps multiple times when stepLength is larger than steps', () => {
		const state = createStepState([
			{ id: 'a', steps: 10, value: 0, stepLength: 25, dependentCircles: [ 'b' ] },
			{ id: 'b', steps: 100, value: 0 }
		]);
		advance(state, 'a');
		expect(getValues(state)).toEqual({ a: 5, b: 2 });
	});

	it('wraps multiple times when counting down with a large stepLength', () => {
		const state = createStepState([
			{ id: 'a', steps: 10, value: 0, stepLength: -25, dependentCircles: [ 'b' ] },
			{ id: 'b', steps: 100, value: 50, stepLength: -1 }
		]);
		advance(state, 'a');
		// 0 -> 9 (wrap), ... -> 9 (wrap), ... -> 9 (wrap), ... -> 5
		expect(getValues(state)).toEqual({ a: 5, b: 47 });
	});

	it('ignores missing circle ids', () => {
		const state = createStepState([ { id: 'a', steps: 2, value: 1, dependentCircles: [ 'missing' ] } ]);
		expect(() => advance(state, 'nope')).not.toThrow();
		expect(() => advance(state, 'a')).not.toThrow();
		expect(getValues(state)).toEqual({ a: 0 });
	});

	it('does not loop forever on a simple cyclic dependency', () => {
		const state = createStepState([
			{ id: 'a', steps: 1, dependentCircles: [ 'b' ] },
			{ id: 'b', steps: 1, dependentCircles: [ 'a' ] }
		]);
		expect(() => advance(state, 'a')).not.toThrow();
		expect(getValues(state)).toEqual({ a: 0, b: 0 });
	});

	// When a cycle fans out (a circle with two dependents that both depend back on it), the work would
	// grow exponentially without a limit on the moves per step.
	// The state is wrapped in a proxy that throws after many reads, so a regression fails instead of hanging.
	it('does not do unbounded work on a cyclic dependency that fans out', () => {
		const circles: CircleConfig[] = [
			{ id: 'a', steps: 1, dependentCircles: [ 'b', 'c' ] },
			{ id: 'b', steps: 1, dependentCircles: [ 'a' ] },
			{ id: 'c', steps: 1, dependentCircles: [ 'a' ] }
		];
		let reads = 0;
		const state = new Proxy(createStepState(circles), {
			get (target, key, receiver) {
				if (++reads > 1_000_000) {
					throw new Error('advanceCircle did more than 1,000,000 state reads');
				}
				return Reflect.get(target, key, receiver);
			}
		});
		advance(state, 'a');
	});
});

describe('shouldStop', () => {
	const state = createStepState([
		{ id: 'a', steps: 10, value: 0 },
		{ id: 'b', steps: 10, value: 5 }
	]);

	it('is false without stop conditions', () => {
		expect(shouldStop(state, {})).toBe(false);
	});

	it('is true only when all listed circles match', () => {
		expect(shouldStop(state, { a: 0 })).toBe(true);
		expect(shouldStop(state, { a: 0, b: 5 })).toBe(true);
		expect(shouldStop(state, { a: 0, b: 4 })).toBe(false);
		expect(shouldStop(state, { a: 1 })).toBe(false);
	});

	it('is false when a listed circle does not exist', () => {
		expect(shouldStop(state, { a: 0, missing: 0 })).toBe(false);
	});
});
