<script setup lang="ts">
import AppHeader from '~/components/shared/AppHeader.vue'
import DesktopProgressLayout from '~/components/desktop/progreso/DesktopProgressLayout.vue'
import MobileProgressLayout from '~/components/mobile/progreso/MobileProgressLayout.vue'
</script>
<template>
  <main class="app-shell">
    <div class="aurora" aria-hidden="true"></div>
    <AppHeader />
    <div class="desktop-only"><DesktopProgressLayout /></div>
    <div class="mobile-only"><MobileProgressLayout /></div>
  </main>
</template>
