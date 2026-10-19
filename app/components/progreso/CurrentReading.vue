<script setup lang="ts">
const { profile, allStories } = useGamification()

const activeStory = computed(() => {
  const inProgressId = Object.keys(profile.value.storyProgress).find(
    (id) => !profile.value.storyProgress[id]?.completed
  )
  return allStories.value.find(s => s.id === inProgressId) || allStories.value[0]
})

const storyProgressInfo = computed(() => {
  if (!activeStory.value) return { current: 1, total: 1, percent: 0 }
  const prog = profile.value.storyProgress[activeStory.value.id]
  const total = activeStory.value.segments.length || 1
  const current = prog ? prog.currentSegment : 0
  const percent = Math.round((current / total) * 100)
  return { current, total, percent }
})
</script>

<template>
  <section v-if="activeStory">
    <div class="section-heading">
      <div>
        <p class="eyebrow">TU PRÓXIMO CAPÍTULO</p>
        <h2>Lectura en curso</h2>
      </div>
      <NuxtLink class="text-action" to="/biblioteca">Ver toda mi biblioteca →</NuxtLink>
    </div>

    <article class="featured-story glass-panel">
      <div class="story-art" :style="{ background: activeStory.coverColor }">
        <span class="cover-big-icon">{{ activeStory.coverIcon }}</span>
      </div>

      <div class="story-content">
        <div class="story-meta">
          <span class="genre-pill">{{ activeStory.genre }}</span>
          <span class="time-pill">⏱ {{ activeStory.readingTimeMin }} min de lectura</span>
        </div>

        <h2>{{ activeStory.title }}</h2>
        <p>{{ activeStory.synopsis }}</p>

        <!-- Barra de avance de esta historia -->
        <div class="reading-progress-row">
          <div class="mini-progress-track">
            <span :style="{ width: `${storyProgressInfo.percent}%` }"></span>
          </div>
          <small>{{ storyProgressInfo.percent }}% completado</small>
        </div>

        <div class="story-footer">
          <div class="author">
            <span class="author-dot">✎</span> {{ activeStory.author }}
          </div>
          <NuxtLink :to="`/leer/${activeStory.id}`" class="read-button">
            {{ storyProgressInfo.current > 0 ? 'Continuar leyendo' : 'Empezar a leer' }} →
          </NuxtLink>
        </div>
      </div>
    </article>
  </section>
</template>

<style scoped>
.story-art {
  display: grid;
  place-items: center;
  min-height: 220px;
}

.cover-big-icon {
  font-size: 64px;
}

.reading-progress-row {
  margin: 12px 0 20px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.mini-progress-track {
  flex: 1;
  height: 6px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}
.mini-progress-track span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #7357ed, #4ade80);
}

.reading-progress-row small {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
  white-space: nowrap;
}

.genre-pill {
  font-size: 11px;
  font-weight: 700;
  color: #7357ed;
  background: #ede9fe;
  padding: 4px 10px;
  border-radius: 99px;
}

.time-pill {
  font-size: 12px;
  color: #64748b;
  margin-left: 8px;
}

.read-button {
  padding: 12px 24px;
  border-radius: 99px;
  background: #7357ed;
  color: #fff;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 0.2s;
  display: inline-block;
}
.read-button:hover {
  transform: translateY(-2px);
}
</style>
