<script setup lang="ts">
const { profile } = useGamification()

const levelTitles = [
  'Iniciador de Relatos',
  'Lector Curioso',
  'Navegante de Páginas',
  'Exploradora de Mundos',
  'Viajero Literario',
  'Maestro de Letras',
  'Sabio de Historias',
  'Leyenda Lectora'
]

const currentTitle = computed(() => {
  return levelTitles[profile.value.level - 1] || 'Gran Lector Legendario'
})

const xpPercent = computed(() => {
  return Math.min(100, Math.round((profile.value.xp / profile.value.xpNextLevel) * 100))
})
</script>

<template>
  <section class="journey-card glass-panel" aria-labelledby="journey-title">
    <div class="journey-copy">
      <span class="chapter-label">TU VIAJE · NIVEL {{ profile.level }}</span>
      <h2 id="journey-title">{{ currentTitle }}</h2>
      <p>
        <strong>{{ profile.xp }}</strong> de <strong>{{ profile.xpNextLevel }} XP</strong> para alcanzar el Nivel {{ profile.level + 1 }}.
      </p>
      <div class="progress-track" :aria-label="`Progreso de nivel: ${xpPercent}%`">
        <span :style="{ width: `${xpPercent}%` }"></span>
      </div>
    </div>
    <div class="level-orbit" aria-hidden="true">
      <span>{{ profile.level }}</span>
      <small>nivel</small>
    </div>
  </section>
</template>

<style scoped>
.journey-copy strong {
  color: #102a56;
}
</style>
