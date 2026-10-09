export type LabelPosition = 'top' | 'bottom';
export type StrokeLinecap = 'butt' | 'round' | 'square';
export type Direction = 'clockwise' | 'counterclockwise';
export type ValueFormatter = (value: number) => string | number;

/** Visual options of a circle. Every option can be set for all circles or per circle. */
export interface CircleAppearance {
	/** Width and height of the circle in px. `0` fits the circle to its container height. */
	size?: number;
	/** Thickness of the circle strokes in px. */
	strokeWidth?: number;
	/** Color of the filled part of the circle. Defaults to `var(--cdt-stroke-color, #9d989b)`. */
	strokeColor?: string;
	/** Color of the empty part of the circle. Defaults to `var(--cdt-underneath-stroke-color, #eee)`. */
	underneathStrokeColor?: string;
	/** Background color of the circle. Defaults to `var(--cdt-fill-color, #ffffff)`. */
	fillColor?: string;
	/** Font size of the value in px. Defaults to `var(--cdt-value-font-size, 20px)`. */
	valueFontSize?: number;
	/** Font size of the label in px. Defaults to `var(--cdt-label-font-size, 15px)`. */
	labelFontSize?: number;
	labelPosition?: LabelPosition;
	showValue?: boolean;
	/** Shape of the ends of the filled part of the circle. */
	strokeLinecap?: StrokeLinecap;
	/** Direction the circle fills in. */
	direction?: Direction;
	/** Formats the displayed value, e.g. `v => String(v).padStart(2, '0')`. */
	formatValue?: ValueFormatter;
}

export type CircleId = string | number;

export interface CircleConfig extends CircleAppearance {
	id: CircleId;
	/** Number of values in the circle. The circle counts from `startValue` to `startValue + steps - 1`. */
	steps: number;
	/** Initial value. */
	value?: number;
	/** First value of the circle, used after the circle wraps around. */
	startValue?: number;
	/** How much the value changes on each step. Use a negative number to count down. */
	stepLength?: number;
	/** Circles that move one step each time this circle wraps around. */
	dependentCircles?: CircleId[];
	label?: string;
	/** Classes of the circle item element. Replaces the `circleClasses` prop for this circle. */
	classList?: string[];
}

/** Current value of each circle, by circle id. */
export type CircleValues = Record<string, number>;

/** Values of circles (by circle id) at which the timer stops. */
export type StopConditions = Record<string, number>;

export type TimeUnit = 'days' | 'hours' | 'minutes' | 'seconds';

export type TimeParts = Partial<Record<TimeUnit, number>>;

export interface TimeUpdate extends TimeParts {
	/** Remaining time in ms. */
	remaining: number;
}

/** Options of a single unit circle of `CircularTimeCountDown`. */
export interface TimeUnitCircleOptions extends CircleAppearance {
	/** Number of values in the circle. Defaults to 24 for hours and 60 for minutes and seconds.
	 * The largest unit defaults to its initial value, so the circle starts full. */
	steps?: number;
	label?: string;
	classList?: string[];
}
