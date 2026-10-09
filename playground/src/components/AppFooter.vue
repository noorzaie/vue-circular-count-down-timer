<template>
	<footer class="footer">
		<div class="container footer__inner">
			<p>
				Released under the MIT License. Made by
				<a
					href="https://github.com/noorzaie"
					target="_blank"
					rel="noopener"
				>AzizAhmad Noorzaie</a>.
			</p>
			<nav
				class="footer__links"
				aria-label="Footer"
			>
				<a
					:href="REPOSITORY_URL"
					target="_blank"
					rel="noopener"
				>GitHub</a>
				<a
					:href="NPM_URL"
					target="_blank"
					rel="noopener"
				>npm</a>
				<a
					:href="`${REPOSITORY_URL}/blob/master/CHANGELOG.md`"
					target="_blank"
					rel="noopener"
				>Changelog</a>
				<a
					:href="`${REPOSITORY_URL}/issues`"
					target="_blank"
					rel="noopener"
				>Issues</a>
			</nav>
		</div>
	</footer>
</template>

<script setup lang="ts">
import { NPM_URL, REPOSITORY_URL } from '../lib/links';
</script>

<style scoped>
.footer {
	padding: 28px 0;
	border-top: 1px solid var(--border);
	color: var(--text-muted);
	font-size: 14px;
}

.footer__inner {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-between;
	gap: 12px 24px;
}

.footer__links {
	display: flex;
	flex-wrap: wrap;
	gap: 18px;
}

.footer__links a {
	color: var(--text-muted);
}

.footer__links a:hover {
	color: var(--text);
}
</style>
