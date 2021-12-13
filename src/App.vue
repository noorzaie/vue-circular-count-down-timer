<template>
	<div id="app">
		<h1>
			Vue circular count down
			<a
				href="https://github.com/noorzaie/vue-circular-count-down-timer/tree/examples"
				target="_blank"
			>examples</a>
		</h1>

		<div
			class="example__container"
			v-for="example in examples"
			:key="example.title"
		>
			<h1>{{ example.title }}</h1>
			<circular-count-down-timer
				:circles="example.circles"
				:interval="example.interval"
				:main-circle-id="example.mainCircleId || '1'"
				:size="example.size"
				:container-classes="example.containerClasses"
				:circle-classes="example.circleClasses"
				:stop-conditions="example.stopConditions"
				:trigger-update="example.triggerUpdate"
				:stroke-width="example.strokeWidth"
				:stroke-color="example.strokeColor"
				:underneath-stroke-color="example.underneathStrokeColor"
				:fill-color="example.fillColor"
				:value-font-size="example.valueFontSize"
				:label-font-size="example.labelFontSize"
				:label-position="example.labelPosition"
			/>
		</div>
	</div>
</template>

<script>
export default {
	name: 'app',
	data(){
		return {
			examples: [
				{
					title: 'Simple',
					circles: [
						{
							id: '1',
							steps: 10,
							size: 200,
							label: 'label'
						}
					]
				},
				{
					title: 'Full configuration',
					containerClasses: [],
					circleClasses: [],
					interval: 1000,
					mainCircleId: '1',
					stopConditions: {},
					triggerUpdate: false,
					circles: [
						{
							id: '1',
							classList: [ 'item' ],
							startValue: -2,
							value: 1,
							size: 200,
							strokeWidth: 20,
							strokeColor: '#db47a0',
							underneathStrokeColor: 'orange',
							fillColor: '#fff0a0',
							valueFontSize: 30,
							labelFontSize: 30,
							steps: 10,
							stepLength: 1,
							label: 'label',
							labelPosition: 'bottom'
						}
					]
				},
				{
					title: 'Dependent circles',
					circles: [
						{
							id: '3',
							steps: 24,
							size: 200,
							label: 'hours'
						},
						{
							id: '2',
							steps: 60,
							size: 200,
							label: 'minutes',
							dependentCircles: [ '3' ]
						},
						{
							id: '1',
							steps: 60,
							size: 200,
							value: 50,
							label: 'seconds',
							dependentCircles: [ '2' ]
						}
					]
				},
				{
					title: 'Stop conditions (stops at 01:05)',
					stopConditions: { '1': 5, '2': 1 },
					mainCircleId: '1',
					circles: [
						{
							id: '2',
							steps: 60,
							size: 200,
							label: 'minutes'
						},
						{
							id: '1',
							steps: 60,
							size: 200,
							value: 55,
							label: 'seconds',
							dependentCircles: [ '2' ]
						}
					]
				},
				{
					title: 'Decremental counter',
					circles: [
						{
							id: '2',
							steps: 60,
							size: 200,
							value: 20,
							stepLength: -1,
							label: 'minutes'
						},
						{
							id: '1',
							steps: 60,
							size: 200,
							value: 30,
							stepLength: -1,
							label: 'seconds',
							dependentCircles: [ '2' ]
						}
					]
				},
				{
					title: 'Circles arrangement',
					containerClasses: [ 'circle__container--1' ],
					circles: [
						{
							id: '1',
							steps: 10,
							size: 200,
							label: 'circle 1'
						},
						{
							id: '2',
							steps: 10,
							size: 200,
							label: 'circle 2'
						},
						{
							id: '3',
							steps: 10,
							size: 200,
							label: 'circle 3'
						},
						{
							id: '4',
							steps: 10,
							size: 200,
							label: 'circle 4'
						}
					]
				},
				{
					title: 'Shared circle props',
					interval: 400,
					size: 150,
					strokeWidth: 15,
					strokeColor: 'blue',
					underneathStrokeColor: 'green',
					fillColor: 'cyan',
					valueFontSize: 40,
					labelFontSize: 30,
					labelPosition: 'bottom',
					circles: [
						{
							id: '3',
							steps: 24,
							size: 200,
							label: 'hours'
						},
						{
							id: '2',
							steps: 60,
							size: 200,
							label: 'minutes',
							dependentCircles: [ '3' ]
						},
						{
							id: '1',
							steps: 60,
							size: 200,
							value: 50,
							label: 'seconds',
							dependentCircles: [ '2' ]
						}
					]
				}
			]
		};
	}
};
</script>

<style>
#app {
	width: 100%;
	font-family: 'Avenir', Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	display: flex;
	flex-direction: column;
	align-items: center;
	color: #2c3e50;
	background-color: aliceblue;
}

.example__container {
	text-align: center;
	margin-bottom: 50px;
	background-color: #6de0f3;
	width: 100%;
	display: flex;
	flex-direction: column;
	align-items: center;
}

.circle__container--1 {
	width: 420px;
	display: flex;
	flex-direction: row-reverse !important;
	flex-wrap: wrap;
}
</style>
