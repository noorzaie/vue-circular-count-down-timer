<template>
	<article
		:id="`example-${example.id}`"
		class="example card"
	>
		<header class="example__header">
			<div class="example__heading">
				<h3 class="example__title">
					{{ example.title }}
				</h3>
				<span :class="[ 'example__tag', { 'example__tag--new': example.tag === 'New in v3' } ]">{{ example.tag }}</span>
			</div>
			<p
				class="example__description"
				v-html="formatDescription(example.description)"
			/>
		</header>
		<div class="example__demo">
			<component :is="example.component" />
		</div>
		<footer class="example__footer">
			<button
				type="button"
				class="btn btn--ghost btn--sm"
				:aria-expanded="showCode"
				:aria-controls="`example-code-${example.id}`"
				@click="showCode = !showCode"
			>
				<AppIcon name="code" />
				{{ showCode ? 'Hide code' : 'Show code' }}
			</button>
		</footer>
		<div
			v-if="showCode"
			:id="`example-code-${example.id}`"
			class="example__code"
		>
			<CodeBlock
				:code="example.source"
				:title="`${example.id}.vue`"
			/>
		</div>
	</article>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import AppIcon from './AppIcon.vue';
import CodeBlock from './CodeBlock.vue';
import type { Example } from '../examples';

defineProps<{ example: Example }>();

const showCode = ref(false);

const escapeHtml = (text: string) => text.replace(/[&<>"']/g, char => `&#${char.charCodeAt(0)};`);

// Descriptions are plain text with `inline code`
const formatDescription = (text: string) => escapeHtml(text).replace(/`([^`]+)`/g, '<code>$1</code>');
</script>

<style scoped>
.example {
	display: flex;
	flex-direction: column;
	min-width: 0;
	overflow: hidden;
}

.example__header {
	padding: 20px 20px 0;
}

.example__heading {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
}

.example__title {
	font-size: 17px;
}

.example__tag {
	flex-shrink: 0;
	padding: 2px 8px;
	border-radius: 999px;
	background: var(--bg-subtle);
	color: var(--text-muted);
	font-size: 11px;
	font-weight: 600;
}

.example__tag--new {
	background: var(--accent-soft);
	color: var(--accent-text);
}

.example__description {
	margin-top: 6px;
	color: var(--text-muted);
	font-size: 14px;
}

.example__demo {
	display: flex;
	flex: 1;
	align-items: center;
	justify-content: center;
	min-height: 240px;
	margin: 16px 20px 0;
	padding: 24px 12px;
	overflow-x: auto;
	border-radius: var(--radius);
	background: var(--bg-stage);
}

.example__footer {
	display: flex;
	justify-content: flex-end;
	padding: 8px 12px;
}

.example__code {
	padding: 0 20px 20px;
}
</style>
