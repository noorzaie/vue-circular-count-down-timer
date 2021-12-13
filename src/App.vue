<template>
    <div id="app">
		<circular-count-down-timer
			:container-classes="[ 'container' ]"
			:circles="circles"
			:interval="1000"
			:main-circle-id="'1'"
			:stop-value="{ '1': 3, '2': 4 }"
			:size="180"
		/>
<!--		<count-down-circle-->
<!--			label="hour"-->
<!--			label-position="top"-->
<!--			:label-font-size="30"-->
<!--			:value-font-size="50"-->
<!--		/>-->
<!--        <CircularCountDownTimer-->
<!--            ref="countDown"-->
<!--            :initial-value="360550"-->
<!--            :stroke-width="5"-->
<!--            :seconds-stroke-color="'#f00'"-->
<!--            :minutes-stroke-color="'#0ff'"-->
<!--            :hours-stroke-color="'#0f0'"-->
<!--            :underneath-stroke-color="'lightgrey'"-->
<!--            :seconds-fill-color="'#00ffff66'"-->
<!--            :minutes-fill-color="'#00ff0066'"-->
<!--            :hours-fill-color="'#ff000066'"-->
<!--            :size="200"-->
<!--            :padding="14"-->
<!--            :hour-label="'hours'"-->
<!--            :minute-label="'minutes'"-->
<!--            :second-label="'seconds'"-->
<!--            :show-second="true"-->
<!--            :show-minute="true"-->
<!--            :show-hour="true"-->
<!--            :show-negatives="true"-->
<!--            :paused="some_variable"-->
<!--            :notify-every="'minute'"-->
<!--            @update="updated"-->
<!--        ></CircularCountDownTimer>-->
        <button @click="updateTime">Update</button>
        <!--<CircularCountDownTimer
                :initial-value="200"
                :steps="400"
                @finish="finished"
                @update="updated"
        ></CircularCountDownTimer>-->
    </div>
</template>

<script>
    // import HelloWorld from './components/HelloWorld.vue'
    import CircularCountDownTimer from "./components/CircularCountDownTimer";
    // import CountDownCircle from "./components/CountDownCircle";

    export default {
        name: 'app',
        components: {
            // HelloWorld,
            CircularCountDownTimer,
			// CountDownCircle
        },
        data(){
            return {
                some_variable: false,
				circles: [
					{
						id: '1',
						classList: [ 'item' ],
						startValue: -2,
						value: 1,
						// size: 200,
						strokeWidth: 10,
						// strokeColor: '#db47a0',
						underneathStrokeColor: '#eee',
						// fillColor: '#fff0a0',
						valueFontSize: 30,
						labelFontSize: 30,
						steps: 5,
						stepLength: -1,
						label: 'label',
						labelPosition: 'bottom',
						dependentCircles: [ '2' ]
					},
					{
						id: '2',
						classList: [],
						startValue: -1,
						value: 3,
						// size: 200,
						strokeWidth: 10,
						strokeColor: '#db47a0',
						underneathStrokeColor: '#eee',
						fillColor: '#fff0a0',
						valueFontSize: 30,
						labelFontSize: 30,
						steps: 5,
						stepLength: -1,
						label: 'label',
						labelPosition: 'bottom',
						dependentCircles: [ '3' ]
					},
					{
						id: '3',
						classList: [],
						startValue: 0,
						value: 3,
						// size: 200,
						strokeWidth: 10,
						strokeColor: '#db47a0',
						underneathStrokeColor: '#eee',
						fillColor: '#fff0a0',
						valueFontSize: 30,
						labelFontSize: 30,
						steps: 5,
						stepLength: -1,
						label: 'label',
						labelPosition: 'bottom',
						dependentCircles: []
					}
				]
            };
        },
        mounted(){
            setTimeout(function(){
                this.some_variable = true;
            }.bind(this), 30000);
        },
        methods: {
            updateTime(){
				this.$set(this.circles[0], 'value', 100);
				this.circles = [
					{
						...this.circles[0],
						value: 18
					},
					this.circles[1]
				];
				// this.circles[0].value = 1000;
                // this.$refs.countDown.updateTime(-10);
            },
            finished: () => {
                console.log('finished');
            },
            updated: (status) => {
                console.log(status);
            }
        }
    };
</script>

<style>
    #app {
        width: 100%;
        height: 300px;
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
        background-color: aliceblue;
        overflow: scroll;
    }

	.container {
		display: flex;
		flex-direction: row-reverse !important;
		background-color: yellow !important;
	}

	.item {
		float: right !important;
		background-color: #ea53e6;
	}
</style>
