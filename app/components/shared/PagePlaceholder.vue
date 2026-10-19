<script setup lang="ts">
defineProps<{ title: string, text: string }>()
</script>
<template><main class="app-shell placeholder-page"><div class="placeholder-card glass-panel"><span class="brand-mark">Lee<span>+</span></span><p class="eyebrow">PRÓXIMAMENTE</p><h1>{{ title }}</h1><p>{{ text }}</p><NuxtLink to="/progreso" class="primary-link">Volver a mi progreso</NuxtLink></div></main></template>
