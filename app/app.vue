<script setup lang="ts">
import AppNavigation from '~/components/shared/AppNavigation.vue'
const { authenticated, restore } = useLeeSession()
const { isDark, initTheme } = useTheme()
const route = useRoute()
const isReadingRoute = computed(() => route.path.startsWith('/leer'))

onMounted(() => {
  restore()
  initTheme()
})
</script>
<template>
  <NuxtRouteAnnouncer />
  <div class="app-root" :class="{ 'dark-mode': isDark }">
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <AppNavigation v-if="authenticated && !isReadingRoute" />
  </div>
</template>

<style>
@import '~/assets/css/leemas.css';
</style>
