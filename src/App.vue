<template>
    <div id="app">
        <CircularCountDownTimer
            ref="countDown"
            :initial-value="360550"
            :stroke-width="5"
            :seconds-stroke-color="'#f00'"
            :minutes-stroke-color="'#0ff'"
            :hours-stroke-color="'#0f0'"
            :underneath-stroke-color="'lightgrey'"
            :seconds-fill-color="'#00ffff66'"
            :minutes-fill-color="'#00ff0066'"
            :hours-fill-color="'#ff000066'"
            :size="200"
            :padding="14"
            :hour-label="'hours'"
            :minute-label="'minutes'"
            :second-label="'seconds'"
            :show-second="true"
            :show-minute="true"
            :show-hour="true"
            :show-negatives="true"
            :paused="some_variable"
            :notify-every="'minute'"
            @update="updated"
        ></CircularCountDownTimer>
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

    export default {
        name: 'app',
        components: {
            // HelloWorld,
            CircularCountDownTimer
        },
        data(){
            return {
                some_variable: false
            }
        },
        mounted(){
            setTimeout(function(){
                this.some_variable = true;
            }.bind(this), 30000);
        },
        methods: {
            updateTime(){
                this.$refs.countDown.updateTime(-10)
            },
            finished: () => {
                console.log('finished')
            },
            updated: (status) => {
                console.log(status)
            }
        }
    }
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
</style>
