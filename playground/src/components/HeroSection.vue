<template>
	<section
		id="top"
		class="hero"
	>
		<div class="container hero__inner">
			<div class="hero__content">
				<p class="hero__badges">
					<span class="badge">Vue 3</span>
					<span class="badge">TypeScript</span>
					<span class="badge">~5 kB gzipped</span>
				</p>
				<h1 class="hero__title">
					Circular count down timers for Vue
				</h1>
				<p class="hero__lead">
					Countdowns to a date, step timers with dependent circles, or your own design built on a composable.
					Fully customizable with props, slots and CSS variables.
				</p>
				<div class="install">
					<code class="install__command"><span class="install__prompt">$</span> {{ INSTALL_COMMAND }}</code>
					<button
						type="button"
						class="btn btn--ghost btn--sm install__copy"
						:aria-label="copied ? 'Copied' : 'Copy install command'"
						@click="copyInstall"
					>
						<AppIcon :name="copied ? 'check' : 'copy'" />
					</button>
				</div>
				<div class="hero__actions">
					<a
						href="#playground"
						class="btn btn--primary"
					>
						Open the playground
						<AppIcon name="arrow" />
					</a>
					<a
						:href="`${REPOSITORY_URL}#readme`"
						class="btn"
						target="_blank"
						rel="noopener"
					>
						<AppIcon name="book" />
						Documentation
					</a>
				</div>
			</div>

			<div class="hero__demo card">
				<svg
					width="0"
					height="0"
					aria-hidden="true"
					class="hero__defs"
				>
					<defs>
						<linearGradient
							id="hero-gradient"
							x1="0"
							y1="0"
							x2="1"
							y2="1"
						>
							<stop
								offset="0%"
								stop-color="#8b7dff"
							/>
							<stop
								offset="100%"
								stop-color="#4fc3f7"
							/>
						</linearGradient>
					</defs>
				</svg>
				<p class="hero__demo-title">
					New Year {{ year }} in
				</p>
				<CircularTimeCountDown
					:end="newYear"
					:size="88"
					:stroke-width="7"
					stroke-linecap="round"
					:value-font-size="24"
					:label-font-size="12"
					:format-value="pad"
					:container-classes="[ 'hero__circles' ]"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { CircularTimeCountDown } from 'vue-circular-count-down-timer';
import AppIcon from './AppIcon.vue';
import { copyText } from '../lib/clipboard';
import { REPOSITORY_URL } from '../lib/links';

const INSTALL_COMMAND = 'npm install vue-circular-count-down-timer';

const year = new Date().getFullYear() + 1;
const newYear = new Date(year, 0, 1);
const pad = (value: number) => String(value).padStart(2, '0');

const copied = ref(false);
const copyInstall = async () => {
	copied.value = await copyText(INSTALL_COMMAND);
	setTimeout(() => {
		copied.value = false;
	}, 1600);
};
</script>

<style scoped>
.hero {
	padding: 72px 0 48px;
	background:
		radial-gradient(60% 60% at 85% 20%, color-mix(in srgb, var(--accent) 14%, transparent), transparent 70%),
		radial-gradient(40% 50% at 0% 0%, color-mix(in srgb, #4fc3f7 10%, transparent), transparent 70%);
}

.hero__inner {
	display: grid;
	grid-template-columns: minmax(0, 1.1fr) minmax(0, 1fr);
	align-items: center;
	gap: 48px;
}

.hero__badges {
	display: flex;
	flex-wrap: wrap;
	gap: 8px;
	margin-bottom: 20px;
}

.badge {
	padding: 3px 10px;
	border: 1px solid var(--border);
	border-radius: 999px;
	background: var(--bg-elevated);
	color: var(--text-muted);
	font-size: 12px;
	font-weight: 500;
}

.hero__title {
	font-size: clamp(34px, 5vw, 52px);
	letter-spacing: -0.035em;
}

.hero__lead {
	max-width: 540px;
	margin-top: 18px;
	color: var(--text-muted);
	font-size: 17px;
}

.install {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	max-width: 460px;
	margin-top: 28px;
	padding: 6px 6px 6px 14px;
	border: 1px solid var(--border);
	border-radius: var(--radius);
	background: var(--bg-elevated);
}

.install__command {
	overflow: hidden;
	font-size: 13px;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.install__prompt {
	color: var(--text-subtle);
	user-select: none;
}

.install__copy {
	width: 32px;
	padding: 0;
	color: var(--text-muted);
}

.hero__actions {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	margin-top: 20px;
}

.hero__demo {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 14px;
	padding: 32px 20px;
	box-shadow: var(--shadow-md);

	--cdt-stroke-color: url(#hero-gradient);
}

.hero__defs {
	position: absolute;
}

.hero__demo-title {
	color: var(--text-muted);
	font-size: 13px;
	font-weight: 600;
	letter-spacing: 0.06em;
	text-transform: uppercase;
}

.hero__demo :deep(.hero__circles) {
	flex-wrap: wrap;
	justify-content: center;
}

@media (max-width: 900px) {
	.hero {
		padding-top: 48px;
	}

	.hero__inner {
		grid-template-columns: minmax(0, 1fr);
		gap: 36px;
	}
}
</style>
