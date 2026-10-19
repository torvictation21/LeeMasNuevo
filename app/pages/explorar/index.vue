<script setup lang="ts">
import type { Story, StoryGenre } from '~/types/leemas'

const { allStories, isFavorite, toggleFavorite } = useGamification()

const searchQuery = ref('')
const selectedGenre = ref<string>('Todos')

const genresList = [
  'Todos',
  'Aventura',
  'Ciencia Ficción',
  'Fantasía',
  'Misterio',
  'Terror',
  'Microcuento',
  'Humor'
]

const filteredStories = computed(() => {
  return allStories.value.filter((story) => {
    // Filtro por género
    const matchesGenre = selectedGenre.value === 'Todos' || story.genre === selectedGenre.value

    // Filtro por texto de búsqueda
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return matchesGenre

    const matchesQuery = 
      story.title.toLowerCase().includes(query) ||
      story.author.toLowerCase().includes(query) ||
      story.synopsis.toLowerCase().includes(query) ||
      story.genre.toLowerCase().includes(query)

    return matchesGenre && matchesQuery
  })
})

const spotlightStory = computed(() => {
  return allStories.value.find((s) => s.id === 'cartas-desde-marte') || allStories.value[0]
})
</script>

<template>
  <main class="app-shell desktop-page">
    <AppHeader />

    <div class="content explore-page">
      <div class="explore-hero">
        <p class="eyebrow">BIBLIOTECA VIVA</p>
        <h1>Encuentra tu<br><em>próxima obsesión.</em></h1>
        <p class="explore-subtitle">Historias diseñadas para leer en minutos y despertar tu imaginación con retos didácticos.</p>
      </div>

      <!-- Buscador en tiempo real -->
      <div class="search-bar-wrapper glass-panel">
        <span class="search-icon">🔍</span>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Busca por título, autor, género o tema..." 
          class="search-input"
        >
        <button v-if="searchQuery" class="clear-search-btn" type="button" @click="searchQuery = ''">
          ✕
        </button>
      </div>

      <!-- Selector de Géneros (Chips) -->
      <section class="genre-chips-scroll" aria-label="Filtro por géneros">
        <button 
          v-for="g in genresList" 
          :key="g"
          type="button"
          class="genre-chip-btn"
          :class="{ active: selectedGenre === g }"
          @click="selectedGenre = g"
        >
          {{ g === 'Todos' ? '✨ Todos los géneros' : g }}
        </button>
      </section>

      <!-- Historia Destacada del Día (Spotlight) -->
      <section v-if="!searchQuery && selectedGenre === 'Todos' && spotlightStory" class="spotlight-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">SELECCIÓN RECOMENDADA</p>
            <h2>Historia destacada</h2>
          </div>
        </div>

        <article class="spotlight-card glass-panel">
          <div class="spotlight-cover" :style="{ background: spotlightStory.coverColor }">
            <span class="spotlight-icon">{{ spotlightStory.coverIcon }}</span>
            <span class="spotlight-badge">★ Selección Lee+</span>
          </div>

          <div class="spotlight-details">
            <div class="spotlight-meta">
              <span class="genre-tag">{{ spotlightStory.genre }}</span>
              <span class="difficulty-tag">{{ spotlightStory.difficulty }}</span>
              <span class="time-tag">⏱ {{ spotlightStory.readingTimeMin }} min</span>
            </div>
            <h2>{{ spotlightStory.title }}</h2>
            <p class="spotlight-author">Por <strong>{{ spotlightStory.author }}</strong></p>
            <p class="spotlight-synopsis">{{ spotlightStory.synopsis }}</p>

            <div class="spotlight-actions">
              <NuxtLink :to="`/leer/${spotlightStory.id}`" class="primary-button">
                Comenzar lectura guiada →
              </NuxtLink>
              <button 
                type="button" 
                class="spotlight-fav-btn"
                :class="{ active: isFavorite(spotlightStory.id) }"
                @click="toggleFavorite(spotlightStory.id)"
              >
                {{ isFavorite(spotlightStory.id) ? '♥ En favoritos' : '♡ Guardar' }}
              </button>
            </div>
          </div>
        </article>
      </section>

      <!-- Lista / Grid de Resultados -->
      <section class="results-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">RESULTADOS ({{ filteredStories.length }})</p>
            <h2>
              {{ selectedGenre === 'Todos' ? 'Todas las historias' : `Historias de ${selectedGenre}` }}
            </h2>
          </div>
        </div>

        <div v-if="filteredStories.length === 0" class="no-results-card glass-panel">
          <span class="no-results-icon">🔎</span>
          <h3>No encontramos historias con esos términos</h3>
          <p>Prueba con otra palabra clave o selecciona un género diferente.</p>
          <button class="primary-button" type="button" @click="searchQuery = ''; selectedGenre = 'Todos'">
            Ver todas las historias
          </button>
        </div>

        <div v-else class="explore-grid">
          <article 
            v-for="story in filteredStories" 
            :key="story.id"
            class="explore-card glass-panel"
          >
            <div class="card-cover" :style="{ background: story.coverColor }">
              <span class="cover-emoji">{{ story.coverIcon }}</span>
              <button 
                type="button" 
                class="card-heart-btn"
                :class="{ active: isFavorite(story.id) }"
                :title="isFavorite(story.id) ? 'En favoritos' : 'Añadir a favoritos'"
                @click.stop="toggleFavorite(story.id)"
              >
                {{ isFavorite(story.id) ? '♥' : '♡' }}
              </button>
            </div>

            <div class="card-info">
              <div class="card-tags">
                <span class="genre-pill">{{ story.genre }}</span>
                <span v-if="story.isCommunity" class="community-pill">✍️ Comunidad</span>
                <span class="time-pill">⏱ {{ story.readingTimeMin }}m</span>
              </div>

              <h3>{{ story.title }}</h3>
              <p class="author-name">Por {{ story.author }}</p>
              <p class="synopsis-snippet">{{ story.synopsis }}</p>

              <NuxtLink :to="`/leer/${story.id}`" class="card-cta-btn">
                Leer con preguntas →
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.explore-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.explore-hero h1 {
  font-family: "Fredoka", sans-serif;
  font-size: clamp(34px, 5vw, 48px);
  margin: 6px 0;
  color: #102a56;
}
.explore-hero em {
  color: #7357ed;
  font-style: normal;
}
.explore-subtitle {
  color: #64748b;
  font-size: 16px;
  margin: 0;
  max-width: 600px;
}

/* Buscador */
.search-bar-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 20px;
  border-radius: 99px;
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  box-shadow: 0 8px 24px #102a5608;
}

.search-icon {
  font-size: 18px;
  color: #64748b;
}

.search-input {
  flex: 1;
  border: 0;
  background: transparent;
  font-size: 16px;
  color: #0f172a;
  outline: none;
  font-family: inherit;
  padding: 6px 0;
}
.search-input::placeholder {
  color: #94a3b8;
}

.clear-search-btn {
  background: #e2e8f0;
  border: 0;
  color: #475569;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  cursor: pointer;
  display: grid;
  place-items: center;
  font-size: 12px;
  font-weight: 700;
}

/* Chips de Géneros con colores vivos */
.genre-chips-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 6px;
}

.genre-chip-btn {
  background: #ffffff;
  border: 1.5px solid #cbd5e1;
  border-radius: 99px;
  padding: 10px 18px;
  font-size: 14px;
  font-weight: 700;
  color: #334155;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s;
}
.genre-chip-btn:hover {
  background: #f8fafc;
  color: #0f172a;
  border-color: #94a3b8;
}
.genre-chip-btn.active {
  background: #7357ed;
  color: #ffffff;
  border-color: #7357ed;
  box-shadow: 0 4px 14px #7357ed40;
}

/* Spotlight Card */
.spotlight-card {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  border-radius: 30px;
  overflow: hidden;
  background: #ffffff;
  border: 1.5px solid #ddd6fe;
  box-shadow: 0 16px 40px #102a560e;
}

.spotlight-cover {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 220px;
}
.spotlight-icon {
  font-size: 72px;
}
.spotlight-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background: #00000055;
  backdrop-filter: blur(8px);
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 99px;
}

.spotlight-details {
  padding: 32px;
  display: flex;
  flex-direction: column;
}

.spotlight-meta {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.genre-tag {
  font-size: 11px;
  font-weight: 700;
  color: #6d28d9 !important;
  background: #ede9fe;
  padding: 4px 10px;
  border-radius: 99px;
}

.difficulty-tag {
  font-size: 11px;
  font-weight: 700;
  color: #0369a1 !important;
  background: #e0f2fe;
  padding: 4px 10px;
  border-radius: 99px;
}

.time-tag {
  font-size: 12px;
  color: #475569 !important;
  font-weight: 600;
  padding: 4px 6px;
}

.spotlight-details h2 {
  font-family: "Fredoka", sans-serif;
  font-size: 26px;
  margin: 0 0 4px;
  color: #0f172a !important;
}

.spotlight-author {
  font-size: 14px;
  color: #475569 !important;
  margin: 0 0 14px;
}

.spotlight-synopsis {
  font-size: 15px;
  color: #334155 !important;
  line-height: 1.6;
  margin-bottom: 24px;
  flex: 1;
}

.spotlight-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.spotlight-fav-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 14px 20px;
  border-radius: 99px;
  font-weight: 700;
  font-size: 14px;
  color: #334155;
  cursor: pointer;
  transition: all 0.2s;
}
.spotlight-fav-btn.active {
  color: #dc2626;
  background: #fee2e2;
  border-color: #fca5a5;
}

/* Explore Grid */
.explore-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 22px;
}

.explore-card {
  border-radius: 24px;
  overflow: hidden;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px #102a5608;
  transition: transform 0.2s, box-shadow 0.2s;
}
.explore-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px #102a5612;
}

.card-cover {
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}
.cover-emoji {
  font-size: 46px;
}

.card-heart-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ffffffcc;
  border: 0;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 16px;
  color: #94a3b8;
  display: grid;
  place-items: center;
  transition: all 0.2s;
}
.card-heart-btn.active {
  color: #ef4444;
  background: #ffffff;
}

.card-info {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

.genre-pill {
  font-size: 11px;
  font-weight: 700;
  color: #6d28d9 !important;
  background: #ede9fe;
  padding: 3px 8px;
  border-radius: 99px;
}

.community-pill {
  font-size: 11px;
  font-weight: 700;
  color: #047857 !important;
  background: #d1fae5;
  padding: 3px 8px;
  border-radius: 99px;
}

.time-pill {
  font-size: 11px;
  color: #64748b !important;
  font-weight: 600;
}

.card-info h3 {
  font-family: "Fredoka", sans-serif;
  font-size: 18px;
  margin: 0 0 4px;
  color: #0f172a !important;
}

.author-name {
  font-size: 13px;
  color: #64748b !important;
  margin: 0 0 10px;
}

.synopsis-snippet {
  font-size: 13px;
  color: #334155 !important;
  line-height: 1.5;
  margin: 0 0 20px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
}

.card-cta-btn {
  display: inline-block;
  text-align: center;
  padding: 12px 18px;
  border-radius: 99px;
  background: #7357ed;
  color: #ffffff !important;
  font-weight: 700;
  font-size: 14px;
  text-decoration: none;
  transition: all 0.2s;
}
.card-cta-btn:hover {
  background: #5b3bd9;
  transform: translateY(-1px);
}

/* No results */
.no-results-card {
  text-align: center;
  padding: 50px 30px;
  border-radius: 28px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
}
.no-results-icon {
  font-size: 48px;
  display: block;
  margin-bottom: 12px;
}

@media (max-width: 768px) {
  .spotlight-card {
    grid-template-columns: 1fr;
  }
}
</style>
