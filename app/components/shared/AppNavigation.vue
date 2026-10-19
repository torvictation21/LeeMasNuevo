<script setup lang="ts">
const open = ref(false)
const links = [
  { label: 'Inicio', to: '/inicio', icon: '⌂' },
  { label: 'Progreso', to: '/progreso', icon: '◔' },
  { label: 'Explorar', to: '/explorar', icon: '◌' },
  { label: 'Crear', to: '/crear', icon: '+' },
  { label: 'Mi biblioteca', to: '/biblioteca', icon: '▤' },
  { label: 'Tienda', to: '/tienda', icon: '🛍️' },
]
</script>
<template><div class="nav-dock" :class="{ 'is-open': open }"><div class="nav-hover-zone"></div><nav class="floating-nav glass-panel" aria-label="Navegación principal"><NuxtLink v-for="link in links" :key="link.to" :to="link.to" @click="open = false"><span class="nav-icon">{{ link.icon }}</span><span>{{ link.label }}</span></NuxtLink></nav></div><button class="mobile-nav-trigger" type="button" @click="open = !open">{{ open ? '× Cerrar' : '☰ Menú' }}</button></template>
