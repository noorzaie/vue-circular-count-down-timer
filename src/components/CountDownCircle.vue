<template>
	<div
		ref="container"
		class="circle__container"
		:style="{ width: `${circleSize}px`, flexDirection: labelPosition === 'bottom' ? 'column' : 'column-reverse' }"
	>
		<div
			class="circle__circle"
			:style="{ width: `${circleSize}px`, height: `${circleSize}px`, fontSize: `${valueFontSize}px` }"
		>
			<div
				v-if="showValue"
				class="circle__value"
			>
				{{ value }}
			</div>
			<svg
				:width="circleSize"
				:height="circleSize"
				xmlns="http://www.w3.org/2000/svg"
			>
				<circle
					:r="r"
					:cy="cx"
					:cx="cy"
					:stroke-width="strokeWidth"
					:stroke="underneathStrokeColor"
					:fill="fillColor"
				/>
				<circle
					:transform='`rotate(-90, ${cx}, ${cy})`'
					:style="{strokeDasharray, strokeDashoffset}"
					class="circle_animation"
					:r="r"
					:cy="cx"
					:cx="cy"
					:stroke-width="strokeWidth"
					:stroke="strokeColor"
					fill="transparent"
				/>
			</svg>
		</div>
		<div
			v-if="label"
			class="circle__label"
			ref="label"
			:style="{ fontSize: `${labelFontSize}px` }"
		>
			{{ label }}
		</div>
	</div>
</template>

<script>
export default {
	name: 'CountDownCircle',
	props: {
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
		steps: {
			type: Number,
			default: 60
		},
		value: {
			type: Number,
			default: 10
		},
		label: {
			type: String,
			default: ''
		},
		labelPosition: {
			validator: function (value) {
				return [ 'top', 'bottom' ].indexOf(value) !== -1;
			},
			default: 'bottom'
		},
		showValue: {
			type: Boolean,
			default: true
		}
	},
	data () {
		return {
			isMounted: false
		};
	},
	computed: {
		circleSize () {
			return this.size === 0 && this.isMounted ?
				this.label ? this.$refs.container.parentElement.clientHeight - this.$refs.label.clientHeight : this.$refs.container.parentElement.clientHeight :
				this.size;
		},
		cx () {
			return this.circleSize / 2;
		},
		cy () {
			return this.circleSize / 2;
		},
		r () {
			return (this.circleSize - this.strokeWidth) / 2;
		},
		circleLength () {
			return 2 * Math.PI * this.r;
		},
		stepLength () {
			return this.circleLength / this.steps;
		},
		strokeDasharray () {
			return this.circleLength;
		},
		strokeDashoffset () {
			return this.circleLength - this.value * this.stepLength;
		}
	},
	mounted () {
		this.$nextTick(() => {
			this.isMounted = true;
		});
	}
};
</script>

<style scoped>
	.circle__container {
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.circle__circle {
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	.circle__value {
		position: absolute;
	}

	circle {
		-webkit-transition: all 0.5s ease;
		-moz-transition: all 0.5s ease;
		-ms-transition: all 0.5s ease;
		-o-transition: all 0.5s ease;
		transition: all 0.5s ease;
	}
</style>
