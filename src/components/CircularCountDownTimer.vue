<template>
    <div
            id="wrapper"
            ref="wrapper"
            :style="{width: 'auto', height: container_height+'px', boxSizing: 'border-box', display: 'flex', justifyContent: 'center', 'alignItems': 'center'}"
    >
        <div
                id="container"
                :style="{width: container_width+'px', height: container_height+'px', paddingTop: padding+'px', margin: '0 auto', boxSizing: 'border-box'}"
        >
            <div
                    v-if="!is_single && showHour"
                    class="item"
                    :style="{width: inner_size+'px', height: inner_size+'px', paddingLeft: padding+'px', paddingRight: padding+'px', float: 'left', direction: 'ltr', position: 'relative'}"
            >
                <div :style="{width: inner_size+'px', height: inner_size+'px', lineHeight: inner_size+'px', position: 'absolute', fontSize: number_font_size+'px'}">
                    {{ factor * hours }}
                </div>
                <svg
                        :width="inner_size"
                        :height="inner_size"
                        xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                            :r="r"
                            :cy="cx"
                            :cx="cy"
                            :stroke-width="strokeWidth"
                            :stroke="underneathStrokeColor"
                            :fill="hoursFillColor"
                    />
                    <circle
                            :transform="'rotate(-90, '+cx+', '+cy+')'"
                            :style="{strokeDasharray: stroke_dasharray_hour, strokeDashoffset: stroke_dashoffset_hour}"
                            class="circle_animation"
                            :r="r"
                            :cy="cx"
                            :cx="cy"
                            :stroke-width="strokeWidth"
                            :stroke="hoursStrokeColor"
                            fill="transparent"
                    />
                </svg>
                <div v-if="hourLabel" ref="label" :style="{height: label_font_size+'px', fontSize: label_font_size+'px'}">
                    {{hourLabel}}
                </div>
            </div>

            <div
                    v-if="!is_single && showMinute"
                    class="item"
                    :style="{width: inner_size+'px', height: inner_size+'px', paddingLeft: padding+'px', paddingRight: padding+'px', float: 'left', direction: 'ltr', position: 'relative'}"
            >
                <div :style="{width: inner_size+'px', height: inner_size+'px', lineHeight: inner_size+'px', position: 'absolute', fontSize: number_font_size+'px'}">
                    {{ factor * minutes }}
                </div>
                <svg
                        :width="inner_size"
                        :height="inner_size"
                        xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                            :r="r"
                            :cy="cx"
                            :cx="cy"
                            :stroke-width="strokeWidth"
                            :stroke="underneathStrokeColor"
                            :fill="minutesFillColor"
                    />
                    <circle
                            :transform="'rotate(-90, '+cx+', '+cy+')'"
                            :style="{strokeDasharray: stroke_dasharray_minute, strokeDashoffset: stroke_dashoffset_minute}"
                            class="circle_animation"
                            :r="r"
                            :cy="cx"
                            :cx="cy"
                            :stroke-width="strokeWidth"
                            :stroke="minutesStrokeColor"
                            fill="transparent"
                    />
                </svg>
                <div v-if="minuteLabel" :style="{fontSize: label_font_size+'px'}">
                    {{minuteLabel}}
                </div>
            </div>

            <div
                    v-if="showSecond"
                    class="item"
                    :style="{width: inner_size+'px', height: inner_size+'px', paddingLeft: padding+'px', paddingRight: padding+'px', float: 'left', direction: 'ltr', position: 'relative'}"
            >
                <div :style="{width: inner_size+'px', height: inner_size+'px', lineHeight: inner_size+'px', position: 'absolute', fontSize: number_font_size+'px'}">
                    {{ factor * seconds }}
                </div>
                <svg
                        :width="inner_size"
                        :height="inner_size"
                        xmlns="http://www.w3.org/2000/svg"
                >
                    <circle
                            :r="r"
                            :cy="cx"
                            :cx="cy"
                            :stroke-width="strokeWidth"
                            :stroke="underneathStrokeColor"
                            :fill="secondsFillColor"
                    />
                    <circle
                            :transform="'rotate(-90, '+cx+', '+cy+')'"
                            :style="{strokeDasharray: stroke_dasharray_second, strokeDashoffset: stroke_dashoffset_second}"
                            class="circle_animation"
                            :r="r"
                            :cy="cx"
                            :cx="cy"
                            :stroke-width="strokeWidth"
                            :stroke="secondsStrokeColor"
                            fill="transparent"
                    />
                </svg>
                <div v-if="secondLabel" :style="{fontSize: label_font_size+'px'}">
                    {{secondLabel}}
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            initialValue: {
                type: Number,
                required: true,
                default: 0
            },
            strokeWidth: {
                type: Number,
                default: 5
            },
            secondsStrokeColor: {
                type: String,
                default: "#acdb28"
            },
            minutesStrokeColor: {
                type: String,
                default: "#729adb"
            },
            hoursStrokeColor: {
                type: String,
                default: "#db47a0"
            },
            underneathStrokeColor: {
                type: String,
                default: "#eee"
            },
            secondsFillColor: {
                type: String,
                default: 'none'
            },
            minutesFillColor: {
                type: String,
                default: 'none'
            },
            hoursFillColor: {
                type: String,
                default: 'none'
            },
            size: {
                type: Number,
                default: 0
            },
            padding: {
                type: Number,
                default: 5
            },
            hourLabel: {
                type: String,
                default: "hours"
            },
            minuteLabel: {
                type: String,
                default: "minutes"
            },
            secondLabel: {
                type: String,
                default: "seconds"
            },
            showSecond: {
                type: Boolean,
                default: true
            },
            showMinute: {
                type: Boolean,
                default: true
            },
            showHour: {
                type: Boolean,
                default: true
            },
            showNegatives: {
                type: Boolean,
                default: false
            },
            steps: {
                type: Number,
                default: undefined
            },
            paused: {
                type: Boolean,
                default: false
            },
            notifyEvery: {
                type: String,
                default: 'second',
                validator: (val) => ['second', 'minute', 'hour', 'none'].includes(val)
            }
        },
        data() {
            return {
                isMounted: false,
                value: this.initialValue,
                labelFontRatio: 0.15,
                numberFontRatio: 0.2,
                baseTime: 0
            };
        },
        computed: {
            seconds_step() {
                return this.is_single ? this.steps ? (Math.max(this.steps, this.initialValue)) : this.initialValue : 60
            },
            is_single() {
                return this.steps !== undefined || (!this.showHour && !this.showMinute)
            },
            hours() {
                return Math.floor(Math.abs(this.value) / 3600);
            },
            minutes() {
                return Math.floor((Math.abs(this.value) - this.hours * 3600) / 60);
            },
            seconds() {
                return this.is_single ? this.value : Math.abs(this.value) % 60;
            },
            factor() {
                return this.value >= 0 ? 1 : -1
            },
            circle_length() {
                return 2 * Math.PI * this.r
            },
            hour_step_length() {
                return this.circle_length / 24
            },
            minute_step_length() {
                return this.circle_length / 60
            },
            second_step_length() {
                return this.circle_length / this.seconds_step
            },
            stroke_dasharray_hour() {
                return this.circle_length
            },
            stroke_dasharray_minute() {
                return this.circle_length
            },
            stroke_dasharray_second() {
                return this.circle_length
            },
            stroke_dashoffset_hour(){
                return this.circle_length - this.hours * this.hour_step_length;
            },
            stroke_dashoffset_minute(){
                return this.circle_length - this.minutes * this.minute_step_length;
            },
            stroke_dashoffset_second(){
                return this.circle_length - this.seconds * this.second_step_length;
            },
            cx(){
                return this.inner_size/2;
            },
            cy(){
                return this.inner_size/2;
            },
            r(){
                return (this.inner_size - this.strokeWidth)/2;
            },
            inner_size(){
                return this.circle_size - this.padding*2;
            },
            circle_size(){
                const size = this.size === 0 && this.isMounted ? this.$refs.wrapper.parentElement.clientHeight : this.size;
                return this.has_label ? size - size * this.labelFontRatio : size;
            },
            container_height(){
                return this.size === 0 && this.isMounted ? this.$refs.wrapper.parentElement.clientHeight : this.size;
            },
            container_width(){
                let circles = 0;
                if(this.showSecond){
                    circles++;
                }
                if(!this.is_single && this.showMinute){
                    circles++;
                }
                if(!this.is_single && this.showHour){
                    circles++;
                }
                return this.inner_size * circles + this.padding * (circles * 2);
            },
            has_label(){
                return this.hourLabel !== "" || this.minuteLabel !== "" || this.secondLabel !== "" ;
            },
            label_font_size(){
                return this.circle_size * this.labelFontRatio;
            },
            number_font_size(){
                return this.circle_size * this.numberFontRatio;
            }
        },
        methods: {
            notifyChange() {
                let output = {value: this.value};
                if(!this.is_single){
                    output = {...output, ...{seconds: this.seconds, minutes: this.minutes, hours: this.hours}}
                }
                this.$emit('update', output);
            },
            updateTime(seconds){
                if(this.value)
                    this.value+=seconds;
                if(this.value<0){
                    this.$emit('finish')
                }
            }
        },
        watch: {
            seconds(){
                if(this.notifyEvery === 'second'){
                    this.notifyChange();
                }
            },
            minutes(){
                if(this.notifyEvery === 'minute' && !this.is_single){
                    this.notifyChange();
                }
            },
            hours(){
                if(this.notifyEvery === 'hour' && !this.is_single){
                    this.notifyChange();
                }
            }
        },
        mounted: function () {
            this.$nextTick(() => {
                this.isMounted = true;
                if(this.value){
                    const interval = setInterval(function () {
                        if(this.paused){
                            return;
                        }
                        const delta = 1;
                        this.value -= delta;
                        if(this.value === 0){
                            this.$emit('finish');
                        }
                        if(this.value <= 0 && !this.showNegatives){
                            this.value = 0;
                            clearInterval(interval);
                        }
                    }.bind(this), 1000);
                }
            });
        }
    }
</script>

<style scoped>
    circle{
        -webkit-transition: all 0.5s ease;
        -moz-transition: all 0.5s ease;
        -ms-transition: all 0.5s ease;
        -o-transition: all 0.5s ease;
        transition: all 0.5s ease;
    }
</style>