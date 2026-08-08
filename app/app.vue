<template>
	<div class="app-shell">
		<SiteNavbar />
		<main class="app-content">
			<NuxtPage />
		</main>
		<SiteFooter />
	</div>
</template>

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
