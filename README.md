# Circular count down timer
This library is a count down timer for Vue js framework. You can add as many as timers you need and fully customize them.

![fully customized timer mode](raw/1.png)

## Installation
```
npm install vue-circular-count-down-timer
```
After installation, you can import component and register it in the main.js:
```
import Vue from 'vue';
import CircularCountDownTimer from 'vue-circular-count-down-timer';
Vue.use(CircularCountDownTimer);
```

## Examples
You can see some sample implementations in [this](https://github.com/noorzaie/vue-circular-count-down-timer/blob/examples/src/App.vue) page. You can also check out the live demo in [this](https://noorzaie.github.io/vue-circular-count-down-timer/) link.


## How to use
You should pass an array of circles configurations to the component as props. You can also pass circle's configs directly to the component in order to apply them to all circles.

Each circle must have an `id`, You should also determine id of main circle using `main-circle-id` props. This is the circle that counting starts with that.


### Dependent circles
By default, circles are independent of each other, if you want to make them related (minutes, seconds, ... for example) you should set id of related circles in `dependentCircles` field of a circle.


### Circles arrangement
By default, circles will be placed in a row (flex row), but if you want to change default arrangement, you can pass `container-classes` and `circle-classes` props and change their styles.


### Stop conditions
If you want to stop counting after reaching a certain value, you can use `stop-conditions` props. It is an object that contains values for each circle. For example consider you have two circles with id `circle-1` and `circle-2`, you want to stop counting when circle-1 reaches to 5 and circle-2 reaches to 12:
```text
stop-conditions = { 'circle-1': 5, 'circle-2': 12 }
```
After finish counting, a `finish` event will be emitted.


### Incremental or decremental
By default, counting is incremental, but if you want to make it counting downward, pass a negative value for `stepLength` field of circle.


### Props
| Props | Description | Possible values | Default value |
| --- | --- | --- | --- |
| circles | A list of circles config objects | [Circle](#circle-props) | [] |
| interval | Timer change interval in ms | A positive number | 1000 |
| main-circle-id | Id of the circle that counting should start with that | A string |  |
| size | Width and height of circles in px | A positive number | Container size |
| container-classes | A list of classes to set to circles container element | An array of strings | [] |
| circle-classes | A list of classes to set to a circle element | An array of strings | [] |
| stop-conditions | An object that contains values for each circle to stop timer after reaching to those values | An object with circle ids as key, and a number as value | {} |
| trigger-update | Emit an event for each value change or not | A boolean | true |
| stroke-width | Thickness of circle strokes in px | A positive number | 10 |
| stroke-color | Circle stroke color | A color string | #9d989b |
| underneath-stroke-color | Stroke color of empty parts of circles | A color string | #eee |
| fill-color | Circle background color | A color string | #ffffff |
| value-font-size | Font size of counter value in px | A positive number | 20 |
| label-font-size | Font size of counter label in px | A positive number | 15 |
| label-position | Position of counter label | bottom or top | bottom |
| show-value | Whether to show counter value or not | A boolean | true |


### Circle props
| Props | Description | Possible values | Default value |
| --- | --- | --- | --- |
| id | Id of circle | A string |  |
| classList | A list of classes to set to the circle element | An array of strings | [] |
| startValue | The number to start counting from, after reaching to the en of circle | A number | zero |
| value | Initial value of circle | A number | zero |
| size | Width and height of circles in px | A positive number | Container size |
| strokeWidth | Thickness of circle strokes in px | A positive number | 10 |
| strokeColor | Circle stroke color | A color string | #9d989b |
| underneathStrokeColor | Stroke color of empty parts of circle | A color string | #eee |
| fillColor | Circle background color | A color string | #ffffff |
| valueFontSize | Font size of counter value in px | A positive number | 20 |
| labelFontSize | Position of counter label | A positive number | 15 |
| steps | The number circle partitions | A positive number |  |
| stepLength | How many step should be passed in each move | A non zero number | 1 |
| label | Label of circle | A string |  |
| labelPosition | Position of label | bottom or top | bottom |
| showValue | Whether to show counter value or not | A boolean | true |

### events
| Events | Description |
| --- | --- |
| finish | Fires when counter reaches to stop conditions. |
| update | Fires on each counting. |
