<template>
	<AppHeader />
	<main>
		<HeroSection />
		<PlaygroundSection />
		<ExamplesSection />
	</main>
	<AppFooter />
</template>

<script setup lang="ts">
import AppFooter from './components/AppFooter.vue';
import AppHeader from './components/AppHeader.vue';
import ExamplesSection from './components/ExamplesSection.vue';
import HeroSection from './components/HeroSection.vue';
import PlaygroundSection from './components/PlaygroundSection.vue';
</script>
