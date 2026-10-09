<template>
	<div class="code-block">
		<div class="code-block__header">
			<span class="code-block__title">{{ title }}</span>
			<button
				type="button"
				class="btn btn--ghost btn--sm"
				:aria-label="copied ? 'Copied' : `Copy ${title}`"
				@click="copy"
			>
				<AppIcon :name="copied ? 'check' : 'copy'" />
				{{ copied ? 'Copied' : 'Copy' }}
			</button>
		</div>
		<pre class="code-block__pre"><code v-html="highlighted" /></pre>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import AppIcon from './AppIcon.vue';
import { copyText } from '../lib/clipboard';
import { highlight, type CodeLanguage } from '../lib/highlight';

const props = withDefaults(defineProps<{
	code: string;
	language?: CodeLanguage;
	title?: string;
}>(), {
	language: 'vue',
	title: 'Code'
});

const copied = ref(false);
let resetTimeout: ReturnType<typeof setTimeout> | undefined;

const highlighted = computed(() => highlight(props.code.trimEnd(), props.language));

const copy = async () => {
	copied.value = await copyText(props.code);
	clearTimeout(resetTimeout);
	resetTimeout = setTimeout(() => {
		copied.value = false;
	}, 1600);
};
</script>

<style scoped>
.code-block {
	overflow: hidden;
	border: 1px solid var(--border);
	border-radius: var(--radius);
	background: var(--code-bg);
}

.code-block__header {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 8px;
	padding: 4px 6px 4px 14px;
	border-bottom: 1px solid var(--border);
}

.code-block__title {
	color: var(--text-muted);
	font-size: 12px;
	font-weight: 600;
}

.code-block__pre {
	max-height: 420px;
	margin: 0;
	padding: 14px 16px;
	overflow: auto;
	font-family: var(--font-mono);
	font-size: 13px;
	line-height: 1.6;
	tab-size: 4;
}
</style>
