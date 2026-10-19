<script setup lang="ts">
import type { Story } from '~/types/leemas'

const { profile, allStories, isFavorite, toggleFavorite } = useGamification()

const activeTab = ref<'en_curso' | 'favoritas' | 'terminadas'>('en_curso')

const storiesInProgress = computed(() => {
  return allStories.value.filter((s) => {
    const prog = profile.value.storyProgress[s.id]
    return prog && !prog.completed && prog.currentSegment > 0
  })
})

const favoriteStories = computed(() => {
  return allStories.value.filter((s) => isFavorite(s.id))
})

const completedStories = computed(() => {
  return allStories.value.filter((s) => {
    return profile.value.completedStoryIds.includes(s.id) || profile.value.storyProgress[s.id]?.completed
  })
})

function getStoryProgressPercent(storyId: string, totalSegments: number): number {
  const prog = profile.value.storyProgress[storyId]
  if (!prog) return 0
  if (prog.completed) return 100
  return Math.round((prog.currentSegment / totalSegments) * 100)
}
</script>

<template>
  <main class="app-shell desktop-page">
    <AppHeader />

    <div class="content library-page">
      <div class="library-header-row">
        <div>
          <p class="eyebrow">TU RINCÓN PERSONAL</p>
          <h1>Mi <em>biblioteca.</em></h1>
          <p class="library-subtitle">Todas tus lecturas, tus favoritas y tu camino recorrido en un solo lugar.</p>
        </div>
      </div>

      <!-- Resumen Cuantitativo en Vivo -->
      <section class="library-summary glass-panel">
        <button 
          class="summary-stat-box" 
          :class="{ active: activeTab === 'en_curso' }"
          type="button" 
          @click="activeTab = 'en_curso'"
        >
          <strong>{{ storiesInProgress.length }}</strong>
          <span>En curso</span>
        </button>
        <button 
          class="summary-stat-box" 
          :class="{ active: activeTab === 'favoritas' }"
          type="button" 
          @click="activeTab = 'favoritas'"
        >
          <strong>{{ favoriteStories.length }}</strong>
          <span>Favoritas</span>
        </button>
        <button 
          class="summary-stat-box" 
          :class="{ active: activeTab === 'terminadas' }"
          type="button" 
          @click="activeTab = 'terminadas'"
        >
          <strong>{{ completedStories.length }}</strong>
          <span>Terminadas</span>
        </button>
      </section>

      <!-- Pestañas de Navegación -->
      <nav class="library-tabs-nav" aria-label="Filtro de biblioteca">
        <button 
          type="button" 
          class="tab-btn" 
          :class="{ active: activeTab === 'en_curso' }"
          @click="activeTab = 'en_curso'"
        >
          📖 En curso ({{ storiesInProgress.length }})
        </button>
        <button 
          type="button" 
          class="tab-btn" 
          :class="{ active: activeTab === 'favoritas' }"
          @click="activeTab = 'favoritas'"
        >
          ♥ Guardadas ({{ favoriteStories.length }})
        </button>
        <button 
          type="button" 
          class="tab-btn" 
          :class="{ active: activeTab === 'terminadas' }"
          @click="activeTab = 'terminadas'"
        >
          ✓ Terminadas ({{ completedStories.length }})
        </button>
      </nav>

      <!-- Contenido según la pestaña activa -->
      <section class="tab-content-area">
        <!-- Pestaña: En Curso -->
        <div v-if="activeTab === 'en_curso'">
          <div v-if="storiesInProgress.length === 0" class="empty-library-state glass-panel">
            <span class="empty-icon">⏳</span>
            <h3>No tienes lecturas a medias</h3>
            <p>Elige cualquier historia para empezar tu ritual del día.</p>
            <NuxtLink to="/explorar" class="primary-button">Explorar historias →</NuxtLink>
          </div>

          <div v-else class="stories-list">
            <article 
              v-for="story in storiesInProgress" 
              :key="story.id" 
              class="reading-item-card glass-panel"
            >
              <div class="mini-cover" :style="{ background: story.coverColor }">
                <span>{{ story.coverIcon }}</span>
              </div>

              <div class="reading-info">
                <div class="info-top">
                  <span class="genre-tag">{{ story.genre }} · {{ story.readingTimeMin }} min</span>
                  <button 
                    type="button" 
                    class="card-fav-btn" 
                    :class="{ active: isFavorite(story.id) }"
                    @click="toggleFavorite(story.id)"
                  >
                    {{ isFavorite(story.id) ? '♥' : '♡' }}
                  </button>
                </div>
                <h2>{{ story.title }}</h2>
                <p class="story-byline">Por {{ story.author }}</p>

                <!-- Barra de Progreso Específica -->
                <div class="card-progress-wrapper">
                  <div class="card-progress-track">
                    <span :style="{ width: `${getStoryProgressPercent(story.id, story.segments.length)}%` }"></span>
                  </div>
                  <small>{{ getStoryProgressPercent(story.id, story.segments.length) }}% completado</small>
                </div>
              </div>

              <NuxtLink :to="`/leer/${story.id}`" class="read-button continue-btn">
                Continuar →
              </NuxtLink>
            </article>
          </div>
        </div>

        <!-- Pestaña: Favoritas -->
        <div v-else-if="activeTab === 'favoritas'">
          <div v-if="favoriteStories.length === 0" class="empty-library-state glass-panel">
            <span class="empty-icon">♡</span>
            <h3>Aún no tienes historias favoritas</h3>
            <p>Haz clic en el corazón de cualquier historia para guardarla aquí.</p>
            <NuxtLink to="/explorar" class="primary-button">Descubrir relatos →</NuxtLink>
          </div>

          <div v-else class="stories-list">
            <article 
              v-for="story in favoriteStories" 
              :key="story.id" 
              class="reading-item-card glass-panel"
            >
              <div class="mini-cover" :style="{ background: story.coverColor }">
                <span>{{ story.coverIcon }}</span>
              </div>

              <div class="reading-info">
                <div class="info-top">
                  <span class="genre-tag">{{ story.genre }} · {{ story.readingTimeMin }} min</span>
                  <button 
                    type="button" 
                    class="card-fav-btn active" 
                    title="Quitar de favoritos"
                    @click="toggleFavorite(story.id)"
                  >
                    ♥
                  </button>
                </div>
                <h2>{{ story.title }}</h2>
                <p class="story-byline">Por {{ story.author }}</p>
                <p class="story-desc-short">{{ story.synopsis }}</p>
              </div>

              <NuxtLink :to="`/leer/${story.id}`" class="read-button">
                Leer ahora →
              </NuxtLink>
            </article>
          </div>
        </div>

        <!-- Pestaña: Terminadas -->
        <div v-else-if="activeTab === 'terminadas'">
          <div v-if="completedStories.length === 0" class="empty-library-state glass-panel">
            <span class="empty-icon">🏆</span>
            <h3>Aún no has completado ninguna historia</h3>
            <p>¡Completa tu primera historia para desbloquear la medalla Primera Página!</p>
            <NuxtLink to="/inicio" class="primary-button">Ir al inicio →</NuxtLink>
          </div>

          <div v-else class="stories-list">
            <article 
              v-for="story in completedStories" 
              :key="story.id" 
              class="reading-item-card glass-panel completed-card"
            >
              <div class="mini-cover" :style="{ background: story.coverColor }">
                <span>{{ story.coverIcon }}</span>
              </div>

              <div class="reading-info">
                <div class="info-top">
                  <span class="genre-tag completed-tag">✓ Completada · 100%</span>
                </div>
                <h2>{{ story.title }}</h2>
                <p class="story-byline">Por {{ story.author }} · {{ story.genre }}</p>
                <p class="story-desc-short">{{ story.synopsis }}</p>
              </div>

              <NuxtLink :to="`/leer/${story.id}`" class="read-button replay-btn">
                Releer ↺
              </NuxtLink>
            </article>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.library-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.library-header-row h1 {
  font-family: "Fredoka", sans-serif;
  font-size: clamp(34px, 5vw, 48px);
  margin: 6px 0;
  color: #102a56;
}
.library-header-row em {
  color: #7357ed;
  font-style: normal;
}
.library-subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0;
}

/* Summary Stats */
.library-summary {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  padding: 16px;
  border-radius: 24px;
}

.summary-stat-box {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  padding: 20px;
  border-radius: 18px;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 14px #102a5606;
}
.summary-stat-box:hover {
  transform: translateY(-2px);
  border-color: #cbd5e1;
}

.summary-stat-box:nth-child(1) {
  background: linear-gradient(135deg, #ffffff, #faf5ff);
  border-color: #ddd6fe;
}
.summary-stat-box:nth-child(1) strong {
  color: #6d28d9 !important;
}

.summary-stat-box:nth-child(2) {
  background: linear-gradient(135deg, #ffffff, #fff1f2);
  border-color: #fecdd3;
}
.summary-stat-box:nth-child(2) strong {
  color: #e11d48 !important;
}

.summary-stat-box:nth-child(3) {
  background: linear-gradient(135deg, #ffffff, #f0fdf4);
  border-color: #bbf7d0;
}
.summary-stat-box:nth-child(3) strong {
  color: #059669 !important;
}

.summary-stat-box.active {
  box-shadow: 0 8px 24px #7357ed22;
  transform: translateY(-2px);
  border-width: 2px;
}

.summary-stat-box strong {
  display: block;
  font-size: 32px;
  font-family: "Fredoka", sans-serif;
}
.summary-stat-box span {
  font-size: 13px;
  color: #475569 !important;
  font-weight: 700;
}

/* Tabs */
.library-tabs-nav {
  display: flex;
  gap: 10px;
  border-bottom: 2px solid #e2e8f0;
  padding-bottom: 12px;
  overflow-x: auto;
}

.tab-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 10px 18px;
  border-radius: 99px;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}
.tab-btn:hover {
  color: #0f172a;
  background: #e2e8f0;
}
.tab-btn.active {
  background: #7357ed;
  color: #ffffff !important;
  border-color: #7357ed;
  box-shadow: 0 4px 14px #7357ed33;
}

/* Stories List */
.stories-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.reading-item-card {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 24px;
  border-radius: 24px;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  box-shadow: 0 8px 24px #102a5608;
  transition: transform 0.2s, box-shadow 0.2s;
}
.reading-item-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px #102a5612;
}

.mini-cover {
  width: 90px;
  height: 110px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 38px;
  flex-shrink: 0;
  box-shadow: 0 8px 16px #00000010;
}

.reading-info {
  flex: 1;
}

.info-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 6px;
}

.genre-tag {
  font-size: 11px;
  font-weight: 700;
  color: #6d28d9 !important;
  background: #ede9fe;
  padding: 3px 8px;
  border-radius: 99px;
}
.completed-tag {
  color: #166534 !important;
  background: #dcfce7;
}

.card-fav-btn {
  background: transparent;
  border: 0;
  font-size: 18px;
  color: #cbd5e1;
  cursor: pointer;
}
.card-fav-btn.active {
  color: #ef4444;
}

.reading-info h2 {
  font-family: "Fredoka", sans-serif;
  font-size: 20px;
  margin: 0 0 4px;
  color: #0f172a !important;
}

.story-byline {
  font-size: 13px;
  color: #64748b !important;
  margin: 0 0 10px;
}

.story-desc-short {
  font-size: 13px;
  color: #334155 !important;
  margin: 0;
  line-height: 1.5;
}

.card-progress-wrapper {
  margin-top: 8px;
}
.card-progress-track {
  height: 6px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 4px;
}
.card-progress-track span {
  display: block;
  height: 100%;
  background: linear-gradient(90deg, #7357ed, #4ade80);
  border-radius: inherit;
}
.card-progress-wrapper small {
  font-size: 11px;
  color: #64748b !important;
  font-weight: 600;
}

.read-button {
  padding: 12px 24px;
  border-radius: 99px;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  white-space: nowrap;
  background: #7357ed;
  color: #ffffff !important;
  transition: transform 0.2s, box-shadow 0.2s;
}
.read-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px #7357ed40;
}
.replay-btn {
  background: #f1f5f9;
  color: #334155;
}
.replay-btn:hover {
  background: #e2e8f0;
}

/* Empty State */
.empty-library-state {
  text-align: center;
  padding: 50px 30px;
  border-radius: 28px;
  background: #fffffffa;
}
.empty-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}
.empty-library-state h3 {
  font-family: "Fredoka", sans-serif;
  font-size: 24px;
  margin: 0 0 8px;
  color: #102a56;
}
.empty-library-state p {
  color: #64748b;
  margin-bottom: 24px;
}

@media (max-width: 680px) {
  .reading-item-card {
    flex-direction: column;
    align-items: stretch;
  }
  .mini-cover {
    width: 100%;
    height: 90px;
  }
  .read-button {
    text-align: center;
  }
  .library-summary {
    grid-template-columns: 1fr;
  }
}
</style>
