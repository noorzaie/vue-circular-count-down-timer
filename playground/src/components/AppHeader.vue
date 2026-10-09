<template>
	<header class="header">
		<div class="container header__inner">
			<a
				href="#top"
				class="brand"
			>
				<svg
					width="26"
					height="26"
					viewBox="0 0 32 32"
					aria-hidden="true"
				>
					<circle
						cx="16"
						cy="16"
						r="12"
						fill="none"
						stroke="var(--accent-soft)"
						stroke-width="5"
					/>
					<circle
						cx="16"
						cy="16"
						r="12"
						fill="none"
						stroke="var(--accent)"
						stroke-width="5"
						stroke-linecap="round"
						stroke-dasharray="75.4"
						stroke-dashoffset="22"
						transform="rotate(-90 16 16)"
					/>
				</svg>
				<span class="brand__name">vue-circular-count-down-timer</span>
				<span class="brand__version">v{{ version }}</span>
			</a>
			<nav
				class="nav"
				aria-label="Main"
			>
				<a
					href="#playground"
					class="nav__link nav__link--optional"
				>Playground</a>
				<a
					href="#examples"
					class="nav__link nav__link--optional"
				>Examples</a>
				<a
					:href="`${REPOSITORY_URL}#readme`"
					class="nav__link nav__link--optional"
					target="_blank"
					rel="noopener"
				>Docs</a>
				<a
					:href="REPOSITORY_URL"
					class="btn btn--ghost btn--sm nav__icon"
					target="_blank"
					rel="noopener"
					aria-label="GitHub repository"
				>
					<AppIcon
						name="github"
						:size="18"
					/>
				</a>
				<button
					type="button"
					class="btn btn--ghost btn--sm nav__icon"
					:aria-label="theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'"
					@click="toggleTheme"
				>
					<AppIcon
						:name="theme === 'dark' ? 'sun' : 'moon'"
						:size="18"
					/>
				</button>
			</nav>
		</div>
	</header>
</template>

<script setup lang="ts">
import { version } from '../../../package.json';
import AppIcon from './AppIcon.vue';
import { REPOSITORY_URL } from '../lib/links';
import { useTheme } from '../lib/theme';

const { theme, toggleTheme } = useTheme();
</script>

<style scoped>
.header {
	position: sticky;
	top: 0;
	z-index: 10;
	border-bottom: 1px solid var(--border);
	background: color-mix(in srgb, var(--bg) 82%, transparent);
	backdrop-filter: saturate(1.4) blur(12px);
}

.header__inner {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
	height: 60px;
}

.brand {
	display: flex;
	align-items: center;
	gap: 10px;
	min-width: 0;
	color: var(--text);
	font-weight: 600;
}

.brand:hover {
	text-decoration: none;
}

.brand svg {
	flex-shrink: 0;
}

.brand__name {
	overflow: hidden;
	font-size: 15px;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.brand__version {
	flex-shrink: 0;
	padding: 2px 8px;
	border-radius: 999px;
	background: var(--accent-soft);
	color: var(--accent-text);
	font-size: 12px;
	font-weight: 600;
}

.nav {
	display: flex;
	flex-shrink: 0;
	align-items: center;
	gap: 4px;
}

.nav__link {
	padding: 6px 10px;
	border-radius: var(--radius-sm);
	color: var(--text-muted);
	font-size: 14px;
	font-weight: 500;
}

.nav__link:hover {
	background: var(--bg-subtle);
	color: var(--text);
	text-decoration: none;
}

.nav__icon {
	width: 36px;
	padding: 0;
	color: var(--text-muted);
}

.nav__icon:hover {
	color: var(--text);
}

@media (max-width: 760px) {
	.nav__link--optional {
		display: none;
	}
}

@media (max-width: 420px) {
	.brand__name {
		font-size: 14px;
	}
}
</style>
