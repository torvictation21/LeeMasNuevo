<script setup lang="ts">
const { profile } = useGamification()

const todayFormatted = computed(() => {
  const days = ['DOMINGO', 'LUNES', 'MARTES', 'MIÉRCOLES', 'JUEVES', 'VIERNES', 'SÁBADO']
  return days[new Date().getDay()]
})
</script>

<template>
  <section class="welcome">
    <div class="welcome-meta-row">
      <p class="eyebrow">PERFIL DE {{ (profile.name || 'LECTOR').toUpperCase() }} · {{ todayFormatted }}</p>
      <div class="user-stats-strip">
        <span class="stat-badge">🔥 {{ profile.streak.current }} días de racha</span>
        <span class="stat-badge">🍃 {{ profile.leaves }} hojas</span>
        <span class="stat-badge">🏅 {{ profile.badges.filter(b => b.unlocked).length }} logros</span>
      </div>
    </div>
    <h1>Tu progreso,<br><em>historia a historia.</em></h1>
    <p class="intro">
      Cada página que abres y cada pregunta de comprensión que resuelves fortalece tu hábito lector.
    </p>
  </section>
</template>

<style scoped>
.welcome-meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 8px;
}

.user-stats-strip {
  display: flex;
  gap: 8px;
}

.stat-badge {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  color: #102a56;
}
</style>
