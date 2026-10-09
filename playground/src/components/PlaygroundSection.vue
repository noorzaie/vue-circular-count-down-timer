<template>
	<section
		id="playground"
		class="section"
	>
		<div class="container">
			<header class="section__header">
				<p class="section__eyebrow">
					Playground
				</p>
				<h2 class="section__title">
					Configure a timer and copy the code
				</h2>
				<p class="section__lead">
					Every option you change is applied live and reflected in the generated code below.
				</p>
			</header>

			<div class="playground card">
				<aside
					class="panel"
					aria-label="Timer options"
				>
					<FieldSegmented
						v-model="kind"
						label="Component"
						:options="[
							{ value: 'time', label: 'Time countdown' },
							{ value: 'steps', label: 'Step timer' }
						]"
					/>
					<p class="panel__hint">
						{{ kind === 'time'
							? 'Counts down to a date or for a duration, in days, hours, minutes and seconds.'
							: 'Moves circles step by step, with dependent circles and stop conditions.' }}
						<code>{{ kind === 'time' ? '<CircularTimeCountDown>' : '<CircularCountDownTimer>' }}</code>
					</p>

					<fieldset class="group">
						<legend class="group__title">
							Timer
						</legend>

						<template v-if="kind === 'time'">
							<FieldSegmented
								v-model="time.source"
								label="Count down"
								:options="[
									{ value: 'duration', label: 'For a duration' },
									{ value: 'end', label: 'To a date' }
								]"
							/>
							<div
								v-if="time.source === 'duration'"
								class="duration"
							>
								<label
									v-for="part in DURATION_PARTS"
									:key="part.key"
									class="field"
								>
									<span class="field__label">{{ part.label }}</span>
									<input
										v-model.number="time[part.key]"
										class="input"
										type="number"
										min="0"
										:max="part.max"
									>
								</label>
							</div>
							<label
								v-else
								class="field"
							>
								<span class="field__label">End date</span>
								<input
									v-model="time.end"
									class="input"
									type="datetime-local"
								>
							</label>
							<div class="field">
								<span class="field__label">Units</span>
								<div class="chips">
									<label
										v-for="unit in TIME_UNIT_OPTIONS"
										:key="unit"
										:class="[ 'chip', { 'chip--active': time.units.includes(unit) } ]"
									>
										<input
											type="checkbox"
											class="chip__input"
											:checked="time.units.includes(unit)"
											:disabled="time.units.length === 1 && time.units.includes(unit)"
											@change="toggleUnit(unit)"
										>
										{{ unit }}
									</label>
								</div>
							</div>
						</template>

						<template v-else>
							<label class="field">
								<span class="field__label">Preset</span>
								<select
									class="input"
									:value="steps.preset"
									@change="applyPreset(($event.target as HTMLSelectElement).value)"
								>
									<option
										v-for="preset in STEP_PRESETS"
										:key="preset.id"
										:value="preset.id"
									>
										{{ preset.name }}
									</option>
									<option
										v-if="steps.preset === 'custom'"
										value="custom"
									>
										Custom
									</option>
								</select>
							</label>
							<FieldRange
								v-model="steps.interval"
								label="Interval"
								:min="100"
								:max="2000"
								:step="100"
								unit=" ms"
							/>
							<label class="field">
								<span class="field__label">Configuration (JSON)</span>
								<textarea
									v-model="stepJson"
									class="input json"
									spellcheck="false"
									rows="9"
									:aria-invalid="Boolean(jsonError)"
									aria-describedby="json-status"
								/>
								<span
									id="json-status"
									:class="[ 'json__status', { 'json__status--error': jsonError } ]"
								>
									{{ jsonError || 'Edit circles, mainCircleId and stopConditions.' }}
								</span>
							</label>
						</template>

						<FieldToggle
							v-model="look.autostart"
							label="Start automatically"
						/>
					</fieldset>

					<fieldset class="group">
						<legend class="group__title">
							Appearance
						</legend>
						<FieldRange
							v-model="look.size"
							label="Size"
							:min="48"
							:max="200"
							unit="px"
						/>
						<FieldRange
							v-model="look.strokeWidth"
							label="Stroke width"
							:min="1"
							:max="30"
							unit="px"
						/>
						<FieldSegmented
							v-model="look.strokeLinecap"
							label="Line cap"
							:options="[
								{ value: 'butt', label: 'Butt' },
								{ value: 'round', label: 'Round' },
								{ value: 'square', label: 'Square' }
							]"
						/>
						<FieldSegmented
							v-model="look.direction"
							label="Direction"
							:options="[
								{ value: 'clockwise', label: 'Clockwise' },
								{ value: 'counterclockwise', label: 'Counterclockwise' }
							]"
						/>
						<FieldSegmented
							v-model="look.labelPosition"
							label="Label position"
							:options="[
								{ value: 'bottom', label: 'Bottom' },
								{ value: 'top', label: 'Top' }
							]"
						/>
						<FieldRange
							v-model="look.valueFontSize"
							label="Value font size"
							:min="10"
							:max="56"
							unit="px"
						/>
						<FieldRange
							v-model="look.labelFontSize"
							label="Label font size"
							:min="8"
							:max="28"
							unit="px"
						/>
						<FieldToggle
							v-model="look.showValue"
							label="Show value"
						/>
						<FieldToggle
							v-model="look.padValues"
							label="Pad values to two digits"
						/>
					</fieldset>

					<fieldset class="group">
						<legend class="group__title">
							Colors
						</legend>
						<FieldColor
							v-model="look.strokeColor"
							label="Stroke"
							fallback="#6d5dfc"
						/>
						<FieldColor
							v-model="look.underneathStrokeColor"
							label="Underneath stroke"
							fallback="#ecebff"
						/>
						<FieldColor
							v-model="look.fillColor"
							label="Fill"
							fallback="#ffffff"
						/>
					</fieldset>
				</aside>

				<div class="preview">
					<div class="toolbar">
						<span :class="[ 'status', `status--${status}` ]">
							<span class="status__dot" />
							{{ STATUS_LABELS[status] }}
						</span>
						<div class="toolbar__actions">
							<button
								type="button"
								class="btn btn--primary btn--sm"
								@click="toggleRunning"
							>
								<AppIcon :name="status === 'running' ? 'pause' : 'play'" />
								{{ status === 'running' ? 'Pause' : status === 'paused' ? 'Resume' : 'Start' }}
							</button>
							<button
								type="button"
								class="btn btn--sm"
								@click="timer?.reset()"
							>
								<AppIcon name="reset" />
								Reset
							</button>
						</div>
					</div>

					<div class="stage">
						<CircularTimeCountDown
							v-if="kind === 'time'"
							:key="`time-${configVersion}`"
							ref="timer"
							v-bind="{ ...sharedProps, ...timeProps }"
							:container-classes="[ 'stage__circles' ]"
							@update="onUpdate"
							@started="onEvent('started')"
							@paused="onEvent('paused')"
							@reset="onEvent('reset')"
							@finished="onEvent('finished')"
						/>
						<CircularCountDownTimer
							v-else
							:key="`steps-${configVersion}`"
							ref="timer"
							v-bind="sharedProps"
							:circles="steps.circles"
							:main-circle-id="steps.mainCircleId"
							:stop-conditions="steps.stopConditions"
							:interval="steps.interval"
							:container-classes="[ 'stage__circles' ]"
							@update="onUpdate"
							@started="onEvent('started')"
							@paused="onEvent('paused')"
							@reset="onEvent('reset')"
							@finished="onEvent('finished')"
						/>
					</div>

					<div class="readout">
						<div class="readout__block">
							<h3 class="readout__title">
								Last <code>update</code> event
							</h3>
							<code class="readout__values">{{ lastUpdate ?? 'Waiting for the first update…' }}</code>
						</div>
						<div class="readout__block">
							<h3 class="readout__title">
								Events
							</h3>
							<ol
								class="log"
								aria-live="polite"
							>
								<li
									v-for="entry in log"
									:key="entry.id"
									class="log__entry"
								>
									<span class="log__time">{{ entry.time }}</span>
									<code>{{ entry.name }}</code>
								</li>
								<li
									v-if="log.length === 0"
									class="log__empty"
								>
									No events yet
								</li>
							</ol>
						</div>
					</div>
				</div>
			</div>

			<CodeBlock
				class="playground__code"
				:code="code"
				title="Generated code"
			/>
		</div>
	</section>
</template>

<script setup lang="ts">
import { computed, reactive, ref, useTemplateRef, watch } from 'vue';
import { CircularCountDownTimer, CircularTimeCountDown, type CircleConfig, type TimeUnit } from 'vue-circular-count-down-timer';
import AppIcon from './AppIcon.vue';
import CodeBlock from './CodeBlock.vue';
import FieldColor from './FieldColor.vue';
import FieldRange from './FieldRange.vue';
import FieldSegmented from './FieldSegmented.vue';
import FieldToggle from './FieldToggle.vue';
import {
	createAppearanceSettings,
	createStepSettings,
	createTimeSettings,
	durationMs,
	generateStepCode,
	generateTimeCode,
	pad,
	STEP_PRESETS,
	TIME_UNIT_OPTIONS,
	type TimerKind
} from '../lib/config';

type Status = 'idle' | 'running' | 'paused' | 'finished';
type TimerEvent = 'started' | 'paused' | 'reset' | 'finished';

interface TimerControls {
	start: () => void;
	pause: () => void;
	resume: () => void;
	reset: () => void;
}

const DURATION_PARTS = [
	{ key: 'hours', label: 'Hours', max: 999 },
	{ key: 'minutes', label: 'Minutes', max: 59 },
	{ key: 'seconds', label: 'Seconds', max: 59 }
] as const;

const STATUS_LABELS: Record<Status, string> = {
	idle: 'Not started',
	running: 'Running',
	paused: 'Paused',
	finished: 'Finished'
};

const kind = ref<TimerKind>('time');
const time = reactive(createTimeSettings());
const steps = reactive(createStepSettings());
const look = reactive(createAppearanceSettings());

const timer = useTemplateRef<TimerControls>('timer');

// ---- Timer settings ----

const toggleUnit = (unit: TimeUnit) => {
	time.units = time.units.includes(unit) ? time.units.filter(u => u !== unit) : [ ...time.units, unit ];
};

const toJson = () => JSON.stringify({
	mainCircleId: steps.mainCircleId,
	stopConditions: steps.stopConditions,
	circles: steps.circles
}, null, 2);

const stepJson = ref(toJson());
const jsonError = ref('');

const applyPreset = (id: string) => {
	const preset = STEP_PRESETS.find(p => p.id === id);
	if (preset) {
		Object.assign(steps, createStepSettings(preset), { interval: steps.interval });
		stepJson.value = toJson();
	}
};

const parseStepJson = (text: string): string => {
	let config: { mainCircleId?: unknown; stopConditions?: unknown; circles?: unknown };
	try {
		config = JSON.parse(text);
	} catch {
		return 'Invalid JSON';
	}
	const circles = config.circles;
	if (!Array.isArray(circles) || circles.length === 0) {
		return '"circles" must be a non-empty array';
	}
	const invalid = circles.find(c => !c || (typeof c.id !== 'string' && typeof c.id !== 'number') || !(c.steps > 0));
	if (invalid) {
		return 'Every circle needs an "id" and a positive "steps"';
	}
	const ids = circles.map(c => String(c.id));
	if (!ids.includes(String(config.mainCircleId))) {
		return '"mainCircleId" must be the id of one of the circles';
	}
	const stopConditions = config.stopConditions ?? {};
	if (typeof stopConditions !== 'object' || Array.isArray(stopConditions)) {
		return '"stopConditions" must be an object';
	}
	if (stepJson.value !== toJson()) {
		steps.preset = 'custom';
	}
	steps.circles = circles as CircleConfig[];
	steps.mainCircleId = String(config.mainCircleId);
	steps.stopConditions = stopConditions as Record<string, number>;
	return '';
};

watch(stepJson, (text) => {
	jsonError.value = parseStepJson(text);
});

// Recreate the timer when its configuration changes, so it starts over cleanly
const configVersion = ref(0);
watch(
	() => [ kind.value, time.source, durationMs(time), time.end, [ ...time.units ], steps.circles, steps.mainCircleId, steps.stopConditions, look.autostart ],
	() => {
		configVersion.value++;
	}
);

// ---- Props ----

const sharedProps = computed(() => ({
	autostart: look.autostart,
	size: look.size,
	strokeWidth: look.strokeWidth,
	strokeLinecap: look.strokeLinecap,
	direction: look.direction,
	labelPosition: look.labelPosition,
	showValue: look.showValue,
	valueFontSize: look.valueFontSize,
	labelFontSize: look.labelFontSize,
	strokeColor: look.strokeColor,
	underneathStrokeColor: look.underneathStrokeColor,
	fillColor: look.fillColor,
	formatValue: look.padValues ? pad : undefined
}));

const timeProps = computed(() => ({
	units: time.units,
	...(time.source === 'end' ? { end: time.end } : { duration: durationMs(time) })
}));

const code = computed(() => kind.value === 'time' ? generateTimeCode(time, look) : generateStepCode(steps, look));

// ---- Status and events ----

const status = ref<Status>('idle');
const lastUpdate = ref<string>();
const log = ref<{ id: number; time: string; name: string }[]>([]);
let logId = 0;

watch(configVersion, () => {
	status.value = 'idle';
	lastUpdate.value = undefined;
	log.value = [];
});

const NEXT_STATUS: Record<TimerEvent, Status> = {
	started: 'running',
	paused: 'paused',
	reset: 'idle',
	finished: 'finished'
};

const onEvent = (name: TimerEvent) => {
	status.value = NEXT_STATUS[name];
	const now = new Date();
	log.value = [
		{ id: logId++, time: now.toLocaleTimeString([], { hour12: false }), name },
		...log.value
	].slice(0, 6);
};

const onUpdate = (values: object) => {
	lastUpdate.value = JSON.stringify(values).replace(/,"/g, ', "').replace(/":/g, '": ');
};

const toggleRunning = () => {
	if (status.value === 'running') {
		timer.value?.pause();
	} else if (status.value === 'paused') {
		timer.value?.resume();
	} else {
		timer.value?.start();
	}
};
</script>

<style scoped>
.playground {
	display: grid;
	grid-template-columns: 340px minmax(0, 1fr);
	align-items: start;
}

.panel {
	display: flex;
	flex-direction: column;
	gap: 16px;
	min-width: 0;
	padding: 20px;
	border-right: 1px solid var(--border);
}

.panel__hint {
	margin-top: -8px;
	color: var(--text-muted);
	font-size: 13px;
}

.group {
	display: flex;
	flex-direction: column;
	gap: 14px;
	min-width: 0;
	margin: 0;
	padding: 16px 0 0;
	border: 0;
	border-top: 1px solid var(--border);
}

.group__title {
	float: left;
	width: 100%;
	margin-bottom: 2px;
	padding: 0;
	color: var(--text-subtle);
	font-size: 12px;
	font-weight: 600;
	letter-spacing: 0.06em;
	text-transform: uppercase;
}

.duration {
	display: grid;
	grid-template-columns: repeat(3, minmax(0, 1fr));
	gap: 8px;
}

.chips {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
}

.chip {
	position: relative;
	padding: 4px 12px;
	border: 1px solid var(--border-strong);
	border-radius: 999px;
	color: var(--text-muted);
	font-size: 13px;
	cursor: pointer;
	user-select: none;
}

.chip--active {
	border-color: var(--accent);
	background: var(--accent-soft);
	color: var(--accent-text);
}

.chip:has(.chip__input:focus-visible) {
	outline: 2px solid var(--accent);
	outline-offset: 2px;
}

.chip:has(.chip__input:disabled) {
	cursor: not-allowed;
}

.chip__input {
	position: absolute;
	opacity: 0;
	pointer-events: none;
}

.json {
	height: auto;
	padding: 8px 10px;
	font-family: var(--font-mono);
	font-size: 12px;
	line-height: 1.5;
	resize: vertical;
}

.json__status {
	color: var(--text-subtle);
	font-size: 12px;
}

.json__status--error {
	color: var(--danger);
}

/* Keep the timer in view while scrolling through the options */
.preview {
	position: sticky;
	top: 60px;
	display: flex;
	flex-direction: column;
	min-width: 0;
	border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	padding: 14px 20px;
	border-bottom: 1px solid var(--border);
}

.toolbar__actions {
	display: flex;
	gap: 8px;
}

.status {
	display: inline-flex;
	align-items: center;
	gap: 8px;
	padding: 4px 12px;
	border-radius: 999px;
	background: var(--bg-subtle);
	color: var(--text-muted);
	font-size: 13px;
	font-weight: 500;
}

.status__dot {
	width: 8px;
	height: 8px;
	border-radius: 50%;
	background: currentColor;
}

.status--running {
	background: var(--success-soft);
	color: var(--success);
}

.status--running .status__dot {
	animation: pulse 1.4s ease-in-out infinite;
}

.status--paused {
	background: var(--warning-soft);
	color: var(--warning);
}

.status--finished {
	background: var(--accent-soft);
	color: var(--accent-text);
}

@keyframes pulse {
	50% {
		opacity: 0.35;
	}
}

.stage {
	display: flex;
	align-items: center;
	justify-content: center;
	min-height: 400px;
	padding: 40px 20px;
	overflow-x: auto;
	background-color: var(--bg-stage);
	background-image: radial-gradient(var(--border) 1px, transparent 1px);
	background-size: 20px 20px;
}

.stage :deep(.stage__circles) {
	flex-wrap: wrap;
	justify-content: center;
}

.readout {
	display: grid;
	grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
	border-top: 1px solid var(--border);
}

.readout__block {
	min-width: 0;
	padding: 14px 20px 18px;
}

.readout__block + .readout__block {
	border-left: 1px solid var(--border);
}

.readout__title {
	margin-bottom: 8px;
	color: var(--text-subtle);
	font-size: 12px;
	font-weight: 600;
	letter-spacing: 0.06em;
	text-transform: uppercase;
}

.readout__title code {
	text-transform: none;
	letter-spacing: 0;
}

.readout__values {
	display: block;
	color: var(--text-muted);
	font-size: 12px;
	overflow-wrap: anywhere;
}

.log {
	display: flex;
	flex-direction: column;
	gap: 4px;
	margin: 0;
	padding: 0;
	list-style: none;
	font-size: 13px;
}

.log__entry {
	display: flex;
	gap: 10px;
}

.log__time {
	color: var(--text-subtle);
	font-family: var(--font-mono);
	font-size: 12px;
}

.log__empty {
	color: var(--text-subtle);
}

.playground__code {
	margin-top: 20px;
}

@media (max-width: 900px) {
	.playground {
		grid-template-columns: minmax(0, 1fr);
	}

	.panel {
		border-top: 1px solid var(--border);
		border-right: 0;
	}

	.preview {
		position: static;
		order: -1;
	}

	.stage {
		min-height: 280px;
	}
}

@media (max-width: 560px) {
	.readout {
		grid-template-columns: minmax(0, 1fr);
	}

	.readout__block + .readout__block {
		border-top: 1px solid var(--border);
		border-left: 0;
	}

	.panel,
	.toolbar,
	.readout__block {
		padding-left: 16px;
		padding-right: 16px;
	}
}
</style>
