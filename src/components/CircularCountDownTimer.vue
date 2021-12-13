<template>
	<div :class="[ 'circles__container', ...containerClasses ]">
		<div
			v-for="(circle, index) in circles"
			:key="index"
			:class="[ 'circle__item', ...('classList' in circle ? circle.classList : circleClasses) ]"
		>
			<count-down-circle
				v-bind="{
					value: values[circle.id].value,
					size: 'size' in circle ? circle.size : size,
					strokeWidth: 'strokeWidth' in circle ? circle.strokeWidth : strokeWidth,
					strokeColor: 'strokeColor' in circle ? circle.strokeColor : strokeColor,
					underneathStrokeColor: 'underneathStrokeColor' in circle ? circle.underneathStrokeColor : underneathStrokeColor,
					fillColor: 'fillColor' in circle ? circle.fillColor : fillColor,
					valueFontSize: 'valueFontSize' in circle ? circle.valueFontSize : valueFontSize,
					labelFontSize: 'labelFontSize' in circle ? circle.labelFontSize : labelFontSize,
					labelPosition: 'labelPosition' in circle ? circle.labelPosition : labelPosition,
					steps: circle.steps,
					label: circle.label
				}"
			/>
		</div>
	</div>
</template>

<script>
import CountDownCircle from '@/components/CountDownCircle';

let expected;

export default {
	name: 'CircularCountDownTimer',
	components: { CountDownCircle },
	props: {
		containerClasses: {
			type: Array,
			default: () => []
		},
		circleClasses: {
			type: Array,
			default: () => []
		},
		interval: {
			type: Number,
			default: 1000
		},
		mainCircleId: {
			type: [ String, Number ],
			required: true
		},
		stopValue: {	// { '1': 0, '2': 1 }
			type: Object,
			required: true
		},
		triggerUpdate: {
			type: Boolean,
			default: true
		},
		// Circle props
		size: {
			type: Number,
			default: 0
		},
		strokeWidth: {
			type: Number,
			default: 10
		},
		strokeColor: {
			type: String,
			default: '#9d989b'
		},
		underneathStrokeColor: {
			type: String,
			default: '#eee'
		},
		fillColor: {
			type: String,
			default: '#ffffff'
		},
		valueFontSize: {
			type: Number,
			default: 20
		},
		labelFontSize: {
			type: Number,
			default: 15
		},
		labelPosition: {
			validator: function (value) {
				return [ 'top', 'bottom' ].indexOf(value) !== -1;
			},
			default: 'bottom'
		},
		circles: {
			type: Array,
			default: () => []
		}
	},
	data () {
		return {
			// circlesLocal: getCirclesData({ circleClasses: this.circleClasses }, this.circles),
			values: getCircleValues(this.circles),
			timeOutId: undefined
		};
	},
	watch: {
		circles () {
			this.values = getCircleValues(this.circles);
			this.startTimer();
		}
	},
	methods: {
		nextStep () {
			this.updateCircleValue(this.mainCircleId);
			this.notifyUpdateValues();

			if (!this.shouldStop()) {
				const dt = Date.now() - expected;
				expected += this.interval;
				this.timeOutId = setTimeout(this.nextStep, Math.max(0, this.interval - dt));
			} else {
				this.$emit('finished');
			}
		},
		updateCircleValue (circleId) {
			const circle = this.values[circleId];

			if (
				circle.stepLength > 0 && circle.value + circle.stepLength >= circle.steps
			) {
				circle.value = (circle.value + circle.stepLength) % circle.steps + circle.startValue;
				for (const dc of circle.dependentCircles) {
					this.updateCircleValue(dc);
				}
			} else if (circle.stepLength < 0 && circle.value + circle.stepLength < circle.startValue) {
				circle.value = (circle.value + circle.stepLength) % circle.steps + circle.steps;
				for (const dc of circle.dependentCircles) {
					this.updateCircleValue(dc);
				}
			} else {
				circle.value += circle.stepLength;
			}
		},
		shouldStop () {
			let stop = true;
			for (const id in this.stopValue) {
				if (this.values[id].value !== this.stopValue[id]) {
					stop = false;
					break;
				}
			}
			return stop;
		},
		notifyUpdateValues () {
			if (this.triggerUpdate) {
				const output = {};
				for (const id in this.values) {
					output[id] = this.values[id].value;
				}
				this.$emit('update', output);
			}
		},
		getCircleProps (circle) {
			return {
				value: circle.value,
				size: circle.size,
				strokeWidth: circle.strokeWidth,
				strokeColor: circle.strokeColor,
				underneathStrokeColor: circle.underneathStrokeColor,
				fillColor: circle.fillColor,
				valueFontSize: circle.valueFontSize,
				labelFontSize: circle.labelFontSize,
				steps: circle.steps,
				label: circle.label,
				labelPosition: circle.labelPosition
			};
		},
		startTimer () {
			clearTimeout(this.timeOutId);
			expected = Date.now() + this.interval;
			this.timeOutId = setTimeout(this.nextStep, this.interval);
		}
	},
	mounted () {
		this.$nextTick(this.startTimer);
	}
};

const getCircleValues = (circles) => {
	const values = {};
	for (const circle of circles) {
		values[circle.id] = {
			value: circle.value,
			stepLength: circle.stepLength,
			steps: circle.steps,
			startValue: circle.startValue,
			dependentCircles: circle.dependentCircles
		};
	}
	return values;
};
</script>

<style scoped>
	.circles__container {
		display: flex;
		flex-direction: row;
	}

	.circle__item {
		margin: 5px;
		height: 100%;
	}
</style>
