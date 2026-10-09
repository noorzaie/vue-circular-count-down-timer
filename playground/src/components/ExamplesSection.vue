<template>
	<section
		id="examples"
		class="section examples"
	>
		<div class="container">
			<header class="section__header">
				<p class="section__eyebrow">
					Examples
				</p>
				<h2 class="section__title">
					Ready-made recipes
				</h2>
				<p class="section__lead">
					Each demo below is a complete component. Open its code to see exactly what is running.
				</p>
			</header>
			<div class="examples__grid">
				<ExampleCard
					v-for="example in examples"
					:key="example.id"
					:example="example"
				/>
			</div>
		</div>
	</section>
</template>

<script setup lang="ts">
import ExampleCard from './ExampleCard.vue';
import { examples } from '../examples';
</script>

<style scoped>
.examples {
	border-top: 1px solid var(--border);
	background: var(--bg-elevated);
}

.examples__grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(min(100%, 460px), 1fr));
	align-items: start;
	gap: 20px;
}

.examples :deep(.card) {
	background: var(--bg);
}
</style>
