<template>
	<div class="app-shell">
		<SiteNavbar />
		<main class="app-content">
			<NuxtPage />
		</main>
		<SiteFooter />
	</div>
</template>

<script setup lang="ts">
onMounted(() => {
	console.log(
		'%c\n' +
		'  Curious minds are always welcome here.\n' +
		'  Try the terminal' +
    '%c\n',
		'color: #4edea3; font: 700 20px/1.5 monospace;'
	)
})
</script>

<style scoped>
.app-shell {
	display: flex;
	min-height: 100vh;
	flex-direction: column;
}

.app-content {
	flex: 1;
}
</style>
