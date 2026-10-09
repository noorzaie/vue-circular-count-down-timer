<template>
	<div class="sunset">
		<!-- A gradient defined once in the page can be used as a stroke color -->
		<svg
			width="0"
			height="0"
			aria-hidden="true"
			class="defs"
		>
			<defs>
				<linearGradient
					id="sunset-gradient"
					x1="0"
					y1="0"
					x2="1"
					y2="1"
				>
					<stop
						offset="0%"
						stop-color="#ff7a59"
					/>
					<stop
						offset="100%"
						stop-color="#ff3d8b"
					/>
				</linearGradient>
			</defs>
		</svg>
		<CircularTimeCountDown
			:duration="10 * 60 * 1000"
			:units="[ 'minutes', 'seconds' ]"
			:size="104"
			:stroke-width="12"
			stroke-linecap="round"
		/>
	</div>
</template>

<script setup lang="ts">
import { CircularTimeCountDown } from 'vue-circular-count-down-timer';
</script>

<style scoped>
/* Every timer inside .sunset uses this theme, without passing any props */
.sunset {
	--cdt-stroke-color: url(#sunset-gradient);
	--cdt-underneath-stroke-color: rgb(255 122 89 / 15%);
	--cdt-fill-color: rgb(255 122 89 / 6%);
	--cdt-value-color: #ff5a6e;
	--cdt-label-color: #e06d5a;
	--cdt-value-font-size: 30px;
	--cdt-label-font-size: 12px;
	--cdt-transition-duration: 0.8s;
	--cdt-circle-margin: 8px;
}

.defs {
	position: absolute;
}
</style>
