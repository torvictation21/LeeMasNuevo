<script setup lang="ts">
const { profile, allStories, isFavorite, toggleFavorite } = useGamification()

// Buscar historia activa en curso o primera disponible
const activeStoryId = computed(() => {
  const inProgressId = Object.keys(profile.value.storyProgress).find(
    (id) => !profile.value.storyProgress[id]?.completed
  )
  return inProgressId || allStories.value[0]?.id || 'el-atlas-de-las-cosas-perdidas'
})

const activeStory = computed(() => {
  return allStories.value.find((s) => s.id === activeStoryId.value) || allStories.value[0]
})

const featuredStories = computed(() => {
  return allStories.value.slice(0, 4)
})

const activeStoryProgress = computed(() => {
  if (!activeStory.value) return { current: 1, total: 1, percent: 0 }
  const prog = profile.value.storyProgress[activeStory.value.id]
  const total = activeStory.value.segments?.length || 1
  const current = prog ? prog.currentSegment : 0
  const percent = Math.round((current / total) * 100)
  return { current, total, percent }
})

// Control para recuadro expandible de estadísticas
const activeStatDetail = ref<'streak' | 'xp' | 'leaves' | 'badges' | null>(null)

function toggleStatDetail(type: 'streak' | 'xp' | 'leaves' | 'badges') {
  if (activeStatDetail.value === type) {
    activeStatDetail.value = null
  } else {
    activeStatDetail.value = type
  }
}
</script>

<template>
  <main class="app-shell desktop-page">
    <AppHeader />

    <div class="content home-page">
      <!-- Hero Ritual Diario Gamificado -->
      <section class="home-hero">
        <div class="hero-decorative-glow" aria-hidden="true"></div>
        <div class="hero-particles" aria-hidden="true">
          <span class="p-star p1">✦</span>
          <span class="p-star p2">✧</span>
          <span class="p-star p3">✦</span>
        </div>

        <div class="hero-text-col">
          <div class="hero-badge-row">
            <span class="hero-pill-badge">
              <span class="badge-fire">🔥</span> RITUAL DE HOY · ⏱️ {{ activeStory?.readingTimeMin || 5 }} MIN
            </span>
            <span class="hero-genre-pill">{{ activeStory?.genre || 'Aventura' }}</span>
          </div>

          <h1 class="hero-title">
            ¡Hola, {{ profile.name }}! <span class="wave-hand">👋</span>
            <span class="title-sub">¿Listo para leer hoy?</span>
          </h1>

          <p class="hero-desc">
            Estás a un capítulo de mantener viva tu racha de <strong class="streak-highlight">{{ profile.streak.current }} días 🔥</strong> y conseguir <strong class="reward-highlight">+50 XP ⚡ y +10 🍃</strong>.
          </p>

          <!-- Barra de progreso si ya empezó la lectura -->
          <div v-if="activeStoryProgress.percent > 0" class="hero-progress-card">
            <div class="progress-info-row">
              <span class="progress-title">Tu avance en esta historia</span>
              <span class="progress-badge">{{ activeStoryProgress.percent }}% completado</span>
            </div>
            <div class="hero-progress-track">
              <div class="hero-progress-fill" :style="{ width: `${activeStoryProgress.percent}%` }"></div>
            </div>
          </div>

          <div class="hero-actions">
            <NuxtLink :to="`/leer/${activeStory?.id}`" class="duo-3d-button hero-cta-btn">
              <span class="duo-btn-top">
                <span class="duo-btn-play-circle">▶</span>
                <span class="duo-btn-text">
                  <small>{{ activeStoryProgress.current > 0 ? 'CONTINUAR LECTURA' : 'COMENZAR LECTURA' }}</small>
                  <strong>{{ activeStory?.title }}</strong>
                </span>
                <span class="duo-btn-arrow">→</span>
              </span>
            </NuxtLink>

            <NuxtLink to="/explorar" class="hero-catalog-btn">
              <span class="catalog-icon">📚</span>
              <span>Ver catálogo</span>
            </NuxtLink>
          </div>
        </div>

        <!-- Columna de Showcase 3D del Libro -->
        <div class="hero-showcase-col">
          <div class="book-3d-stage">
            <div class="book-3d-aura" :style="{ background: activeStory?.coverColor }"></div>

            <div class="book-3d-object" :style="{ background: activeStory?.coverColor }">
              <div class="book-spine"></div>
              <div class="book-ribbon"></div>
              <div class="book-face">
                <span class="book-cover-emoji">{{ activeStory?.coverIcon || '📖' }}</span>
                <span class="book-cover-genre">{{ activeStory?.genre }}</span>
                <h3 class="book-cover-title">{{ activeStory?.title }}</h3>
                <span class="book-cover-author">Por {{ activeStory?.author }}</span>
              </div>
            </div>

            <!-- Floating Badges -->
            <div class="floating-badge badge-level">
              <span class="badge-star">⭐</span> Nivel {{ profile.level }}
            </div>
            <div class="floating-badge badge-reward">
              <span>⚡ +50 XP</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Grid de Estadísticas Rápidas (Gamificación viva e interactiva) -->
      <section class="quick-grid">
        <article 
          class="quick-card coral-card glass-panel"
          :class="{ 'is-active': activeStatDetail === 'streak' }"
          role="button"
          tabindex="0"
          :aria-expanded="activeStatDetail === 'streak'"
          @click="toggleStatDetail('streak')"
          @keydown.enter="toggleStatDetail('streak')"
        >
          <div class="card-icon">
            <span class="stat-emoji emoji-fire">🔥</span>
          </div>
          <div class="card-info">
            <strong>{{ profile.streak.current }} días</strong>
            <p>Racha récord: {{ profile.streak.max }} días</p>
          </div>
          <span class="card-expand-indicator" :class="{ 'is-open': activeStatDetail === 'streak' }">
            {{ activeStatDetail === 'streak' ? '▲' : '▼' }}
          </span>
        </article>

        <article 
          class="quick-card mint-card glass-panel"
          :class="{ 'is-active': activeStatDetail === 'xp' }"
          role="button"
          tabindex="0"
          :aria-expanded="activeStatDetail === 'xp'"
          @click="toggleStatDetail('xp')"
          @keydown.enter="toggleStatDetail('xp')"
        >
          <div class="card-icon">
            <span class="stat-emoji emoji-lightning">⚡</span>
          </div>
          <div class="card-info">
            <strong>{{ profile.xp }} / {{ profile.xpNextLevel }} XP</strong>
            <p>Para Nivel {{ profile.level + 1 }}</p>
          </div>
          <span class="card-expand-indicator" :class="{ 'is-open': activeStatDetail === 'xp' }">
            {{ activeStatDetail === 'xp' ? '▲' : '▼' }}
          </span>
        </article>

        <article 
          class="quick-card gold-card glass-panel"
          :class="{ 'is-active': activeStatDetail === 'leaves' }"
          role="button"
          tabindex="0"
          :aria-expanded="activeStatDetail === 'leaves'"
          @click="toggleStatDetail('leaves')"
          @keydown.enter="toggleStatDetail('leaves')"
        >
          <div class="card-icon">
            <span class="stat-emoji emoji-leaves">🍃</span>
          </div>
          <div class="card-info">
            <strong>{{ profile.leaves }} Hojas</strong>
            <p>Monedas acumuladas</p>
          </div>
          <span class="card-expand-indicator" :class="{ 'is-open': activeStatDetail === 'leaves' }">
            {{ activeStatDetail === 'leaves' ? '▲' : '▼' }}
          </span>
        </article>

        <article 
          class="quick-card purple-card glass-panel"
          :class="{ 'is-active': activeStatDetail === 'badges' }"
          role="button"
          tabindex="0"
          :aria-expanded="activeStatDetail === 'badges'"
          @click="toggleStatDetail('badges')"
          @keydown.enter="toggleStatDetail('badges')"
        >
          <div class="card-icon">
            <span class="stat-emoji emoji-medal">🏅</span>
          </div>
          <div class="card-info">
            <strong>{{ profile.badges.filter(b => b.unlocked).length }} Medallas</strong>
            <p>Logros de perfil</p>
          </div>
          <span class="card-expand-indicator" :class="{ 'is-open': activeStatDetail === 'badges' }">
            {{ activeStatDetail === 'badges' ? '▲' : '▼' }}
          </span>
        </article>
      </section>

      <!-- Recuadro Expandible con información detallada de la estadística seleccionada -->
      <Transition name="drawer-fade">
        <div v-if="activeStatDetail" class="stat-detail-drawer" :class="`drawer-${activeStatDetail}`">
          <!-- Cabecera del detalle -->
          <div class="drawer-header">
            <div class="drawer-title-group">
              <span class="drawer-icon-badge">
                {{ activeStatDetail === 'streak' ? '🔥' : activeStatDetail === 'xp' ? '⚡' : activeStatDetail === 'leaves' ? '🍃' : '🏅' }}
              </span>
              <div>
                <h3 class="drawer-title">
                  {{ 
                    activeStatDetail === 'streak' ? 'Racha de Lectura Diaria' :
                    activeStatDetail === 'xp' ? 'Nivel y Progreso de Experiencia' :
                    activeStatDetail === 'leaves' ? 'Hojas Mágicas y Economía' :
                    'Medallas y Logros de Perfil'
                  }}
                </h3>
                <p class="drawer-subtitle">
                  {{
                    activeStatDetail === 'streak' ? 'Lee al menos un capítulo al día para mantener viva tu llama.' :
                    activeStatDetail === 'xp' ? 'Gana experiencia leyendo historias y respondiendo desafíos.' :
                    activeStatDetail === 'leaves' ? 'Tu moneda acumulada para la tienda y mejoras de lectura.' :
                    'Recompensas obtenidas por tu constancia y comprensión.'
                  }}
                </p>
              </div>
            </div>
            <button 
              type="button" 
              class="drawer-close-btn" 
              @click="activeStatDetail = null" 
              aria-label="Cerrar detalles"
            >
              ✕ Cerrar
            </button>
          </div>

          <!-- DETALLE: RACHA -->
          <div v-if="activeStatDetail === 'streak'" class="drawer-content-box streak-box">
            <div class="drawer-stats-row">
              <div class="drawer-stat-card">
                <span class="d-stat-val">{{ profile.streak.current }}</span>
                <span class="d-stat-lbl">Días consecutivos</span>
              </div>
              <div class="drawer-stat-card">
                <span class="d-stat-val">{{ profile.streak.max }}</span>
                <span class="d-stat-lbl">Récord histórico</span>
              </div>
              <div class="drawer-stat-card">
                <span class="d-stat-val highlight-val">🛡️ Activo</span>
                <span class="d-stat-lbl">Protector de racha</span>
              </div>
            </div>

            <!-- Días de la semana -->
            <div class="streak-week-view">
              <span class="week-title">Hábito de los últimos 7 días:</span>
              <div class="week-days-row">
                <div 
                  v-for="(day, i) in [
                    { name: 'Lun', done: true },
                    { name: 'Mar', done: true },
                    { name: 'Mié', done: true },
                    { name: 'Jue', done: true },
                    { name: 'Vie', done: profile.streak.current >= 5 },
                    { name: 'Sáb', done: profile.streak.current >= 6 },
                    { name: 'Dom', done: profile.streak.current >= 7 }
                  ]" 
                  :key="day.name" 
                  class="week-day-pill"
                  :class="{ 'is-done': day.done, 'is-today': i === 3 }"
                >
                  <span class="day-icon">{{ day.done ? '🔥' : '○' }}</span>
                  <span class="day-label">{{ day.name }}</span>
                </div>
              </div>
            </div>

            <div class="drawer-footer-actions">
              <NuxtLink :to="`/leer/${activeStory?.id}`" class="duo-3d-button duo-streak-btn">
                <span class="duo-btn-top">
                  <span class="duo-btn-play-circle">🔥</span>
                  <span class="duo-btn-text">
                    <small>MANTENER RACHA DE HOY</small>
                    <strong>Continuar mi lectura ahora</strong>
                  </span>
                  <span class="duo-btn-arrow">→</span>
                </span>
              </NuxtLink>
            </div>
          </div>

          <!-- DETALLE: EXPERIENCIA (XP) -->
          <div v-else-if="activeStatDetail === 'xp'" class="drawer-content-box xp-box">
            <div class="xp-progress-overview">
              <div class="xp-level-banner">
                <span class="xp-level-chip">⭐ NIVEL {{ profile.level }}</span>
                <span class="xp-next-target">
                  Próxima meta: <strong>Nivel {{ profile.level + 1 }}</strong> (Faltan {{ Math.max(0, profile.xpNextLevel - profile.xp) }} XP)
                </span>
              </div>

              <div class="xp-bar-track">
                <div 
                  class="xp-bar-fill" 
                  :style="{ width: `${Math.min(100, Math.round((profile.xp / profile.xpNextLevel) * 100))}%` }"
                ></div>
              </div>
              <div class="xp-bar-labels">
                <span>{{ profile.xp }} XP actuales</span>
                <span>{{ profile.xpNextLevel }} XP requeridos</span>
              </div>
            </div>

            <div class="xp-sources-grid">
              <div class="xp-source-item">
                <span class="source-icon">📖</span>
                <div>
                  <strong>+50 XP</strong>
                  <p>Por cada historia completada</p>
                </div>
              </div>
              <div class="xp-source-item">
                <span class="source-icon">🎯</span>
                <div>
                  <strong>+10 XP</strong>
                  <p>Por cada respuesta acertada</p>
                </div>
              </div>
              <div class="xp-source-item">
                <span class="source-icon">⚡</span>
                <div>
                  <strong>+50 XP</strong>
                  <p>Por el desafío diario</p>
                </div>
              </div>
            </div>

            <!-- Botón que lleva a Explorar historias según lo pedido -->
            <div class="drawer-footer-actions">
              <NuxtLink to="/explorar" class="duo-3d-button duo-xp-btn">
                <span class="duo-btn-top">
                  <span class="duo-btn-play-circle">📚</span>
                  <span class="duo-btn-text">
                    <small>CONSEGUIR MÁS EXPERIENCIA</small>
                    <strong>Explorar historias del catálogo</strong>
                  </span>
                  <span class="duo-btn-arrow">→</span>
                </span>
              </NuxtLink>
            </div>
          </div>

          <!-- DETALLE: MONEDAS (HOJAS) -->
          <div v-else-if="activeStatDetail === 'leaves'" class="drawer-content-box leaves-box">
            <div class="leaves-balance-banner">
              <div class="leaves-big-display">
                <span class="leaves-icon-symbol">🍃</span>
                <div>
                  <strong class="leaves-counter">{{ profile.leaves }}</strong>
                  <span class="leaves-counter-label">Hojas mágicas en tu balance</span>
                </div>
              </div>
              <p class="leaves-use-summary">
                Las hojas son la moneda del reino. Puedes usarlas en la tienda para canjear protectores de racha, comprar avatares legendarios y desbloquear temas visuales de lectura.
              </p>
            </div>

            <div class="leaves-gain-tips">
              <div class="tip-badge">
                <span class="tip-coin">🍃 +10</span>
                <span>Por historia leída</span>
              </div>
              <div class="tip-badge">
                <span class="tip-coin">🍃 +15</span>
                <span>Por desafío diario</span>
              </div>
              <div class="tip-badge">
                <span class="tip-coin">🍃 +25</span>
                <span>Al subir de nivel</span>
              </div>
            </div>

            <!-- 2 Botones solicitados: Ir a la tienda y Conseguir más monedas -->
            <div class="drawer-footer-actions two-buttons-row">
              <NuxtLink to="/tienda" class="duo-3d-button duo-store-btn">
                <span class="duo-btn-top">
                  <span class="duo-btn-play-circle">🛍️</span>
                  <span class="duo-btn-text">
                    <small>CANJEAR HOJAS</small>
                    <strong>Ir a la Tienda</strong>
                  </span>
                  <span class="duo-btn-arrow">→</span>
                </span>
              </NuxtLink>

              <NuxtLink to="/explorar" class="duo-3d-button duo-earn-leaves-btn">
                <span class="duo-btn-top">
                  <span class="duo-btn-play-circle">🍃</span>
                  <span class="duo-btn-text">
                    <small>LEER HISTORIAS</small>
                    <strong>Conseguir más monedas</strong>
                  </span>
                  <span class="duo-btn-arrow">→</span>
                </span>
              </NuxtLink>
            </div>
          </div>

          <!-- DETALLE: MEDALLAS (BADGES) -->
          <div v-else-if="activeStatDetail === 'badges'" class="drawer-content-box badges-box">
            <div class="badges-counter-header">
              <span class="badges-unlocked-badge">
                🏅 {{ profile.badges.filter(b => b.unlocked).length }} de {{ profile.badges.length }} Desbloqueadas
              </span>
              <p class="badges-hint">
                Completa lecturas y demuestra tu comprensión para desbloquear todas las medallas de tu vitrina.
              </p>
            </div>

            <div class="drawer-badges-preview">
              <div 
                v-for="badge in profile.badges.slice(0, 4)" 
                :key="badge.id" 
                class="drawer-mini-badge"
                :class="{ 'is-unlocked': badge.unlocked }"
              >
                <span class="mini-badge-icon">{{ badge.icon }}</span>
                <div class="mini-badge-texts">
                  <strong>{{ badge.title }}</strong>
                  <span>{{ badge.unlocked ? '✅ Desbloqueada' : '🔒 Bloqueada' }}</span>
                </div>
              </div>
            </div>

            <!-- Botón solicitado que lleva a Progreso para ver medallas en detalle -->
            <div class="drawer-footer-actions">
              <NuxtLink to="/progreso" class="duo-3d-button duo-badges-btn">
                <span class="duo-btn-top">
                  <span class="duo-btn-play-circle">🏆</span>
                  <span class="duo-btn-text">
                    <small>VITRINA COMPLETA</small>
                    <strong>Ver todas las medallas en Progreso</strong>
                  </span>
                  <span class="duo-btn-arrow">→</span>
                </span>
              </NuxtLink>
            </div>
          </div>
        </div>
      </Transition>

      <!-- Desafío del Día con Botón 3D Duolingo -->
      <section class="daily-quest-banner glass-panel">
        <div class="quest-content">
          <span class="quest-pill">🎯 Desafío Diario</span>
          <h3>Completa 1 historia con comprensión perfecta</h3>
          <p>Obtén una bonificación de <strong>+50 XP</strong> y <strong>+15 hojas</strong> para tu perfil.</p>
        </div>
        <NuxtLink :to="`/leer/${activeStory?.id}`" class="duo-3d-button quest-3d-btn">
          <span class="duo-btn-top">
            <span class="duo-btn-play-circle">🎯</span>
            <span class="duo-btn-text">
              <small>BONIFICACIÓN ESPECIAL</small>
              <strong>Comenzar desafío</strong>
            </span>
            <span class="duo-btn-arrow">→</span>
          </span>
        </NuxtLink>
      </section>

      <!-- Sección de Historias Recomendadas -->
      <section class="section-heading">
        <div>
          <p class="eyebrow">HECHO PARA TI</p>
          <h2>Elige tu próxima lectura</h2>
        </div>
        <NuxtLink to="/explorar" class="text-action">Explorar todo el catálogo →</NuxtLink>
      </section>

      <section class="stories-grid">
        <article 
          v-for="story in featuredStories" 
          :key="story.id" 
          class="story-card glass-panel"
        >
          <div class="story-card-top" :style="{ background: story.coverColor }">
            <span class="story-icon">{{ story.coverIcon }}</span>
            <button 
              type="button" 
              class="fav-btn" 
              :class="{ active: isFavorite(story.id) }"
              :title="isFavorite(story.id) ? 'En favoritos' : 'Añadir a favoritos'"
              @click.stop="toggleFavorite(story.id)"
            >
              {{ isFavorite(story.id) ? '♥' : '♡' }}
            </button>
          </div>

          <div class="story-card-body">
            <div class="story-tags">
              <span class="genre-badge">{{ story.genre }}</span>
              <span class="time-badge">⏱ {{ story.readingTimeMin }} min</span>
            </div>
            <h3 class="story-title">{{ story.title }}</h3>
            <p class="story-author-name">Por {{ story.author }}</p>
            <p class="story-synopsis-preview">{{ story.synopsis }}</p>

            <NuxtLink :to="`/leer/${story.id}`" class="read-card-btn">
              Leer con preguntas →
            </NuxtLink>
          </div>
        </article>
      </section>
    </div>
  </main>
</template>

<style scoped>
.home-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ========================================================
   HOME HERO (GAMIFICADO / RITUAL DIARIO)
   ======================================================== */
.home-hero {
  position: relative;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1.25fr 0.75fr;
  align-items: center;
  gap: 36px;
  padding: 44px 48px;
  border-radius: 36px;
  background: 
    radial-gradient(circle at 10% 20%, rgba(216, 180, 254, 0.45) 0%, transparent 45%),
    radial-gradient(circle at 90% 80%, rgba(199, 210, 254, 0.5) 0%, transparent 45%),
    linear-gradient(135deg, #f5effe 0%, #ede5ff 40%, #e0e7ff 100%);
  border: 2.5px solid #c4b5fd;
  box-shadow: 0 24px 50px -12px rgba(115, 87, 237, 0.25), inset 0 2px 0 rgba(255, 255, 255, 0.9);
  transition: all 0.3s ease;
}

.hero-decorative-glow {
  position: absolute;
  top: -80px;
  right: -60px;
  width: 380px;
  height: 380px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(192, 132, 252, 0.3) 0%, transparent 70%);
  filter: blur(40px);
  pointer-events: none;
  animation: float-glow 6s ease-in-out infinite alternate;
}

@keyframes float-glow {
  0% { transform: scale(1) translate(0, 0); }
  100% { transform: scale(1.15) translate(-20px, 20px); }
}

.hero-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.p-star {
  position: absolute;
  color: #c084fc;
  font-size: 16px;
  animation: sparkle-pulse 3s ease-in-out infinite;
  opacity: 0.7;
}
.p1 { top: 22px; right: 38%; animation-delay: 0s; font-size: 20px; color: #a855f7; }
.p2 { bottom: 28px; left: 45%; animation-delay: 1.2s; font-size: 14px; color: #ec4899; }
.p3 { top: 48%; right: 46%; animation-delay: 2.1s; font-size: 16px; color: #8b5cf6; }

@keyframes sparkle-pulse {
  0%, 100% { opacity: 0.3; transform: scale(0.8) rotate(0deg); }
  50% { opacity: 1; transform: scale(1.2) rotate(45deg); }
}

.hero-text-col {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
}

.hero-badge-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.hero-pill-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.6px;
  text-transform: uppercase;
  background: #ede9fe;
  color: #6d28d9;
  border: 1px solid #ddd6fe;
  box-shadow: 0 2px 8px rgba(109, 40, 217, 0.1);
}

.badge-fire {
  font-size: 14px;
  animation: bounce-fire 1.8s infinite;
}

@keyframes bounce-fire {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.2); }
}

.hero-genre-pill {
  display: inline-flex;
  align-items: center;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
  background: #e0f2fe;
  color: #0369a1;
  border: 1px solid #bae6fd;
}

.hero-title {
  font-family: "Fredoka", sans-serif;
  font-size: clamp(32px, 4vw, 48px);
  font-weight: 700;
  line-height: 1.1;
  margin: 6px 0 12px;
  color: #0f172a !important;
}

.wave-hand {
  display: inline-block;
  transform-origin: 70% 70%;
  animation: wave-animation 2.5s infinite;
}

@keyframes wave-animation {
  0% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
  100% { transform: rotate(0deg); }
}

.title-sub {
  display: block;
  color: #7357ed !important;
  margin-top: 4px;
}

.hero-desc {
  color: #334155 !important;
  font-size: 16px;
  line-height: 1.6;
  max-width: 540px;
  margin: 0 0 22px;
}

.streak-highlight {
  color: #c2410c;
  background: #ffedd5;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  border: 1px solid #fed7aa;
}

.reward-highlight {
  color: #047857;
  background: #d1fae5;
  padding: 2px 8px;
  border-radius: 6px;
  font-weight: 700;
  border: 1px solid #a7f3d0;
}

/* Barra de progreso rápida */
.hero-progress-card {
  background: rgba(255, 255, 255, 0.7);
  border: 1.5px solid #e9d5ff;
  border-radius: 16px;
  padding: 12px 16px;
  margin-bottom: 22px;
  max-width: 480px;
  box-shadow: 0 4px 12px rgba(115, 87, 237, 0.08);
}

.progress-info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.progress-title {
  font-size: 12px;
  font-weight: 700;
  color: #475569;
}

.progress-badge {
  font-size: 11px;
  font-weight: 800;
  color: #7357ed;
  background: #ede9fe;
  padding: 2px 8px;
  border-radius: 99px;
}

.hero-progress-track {
  height: 8px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
}

.hero-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7357ed, #10b981);
  border-radius: 99px;
  transition: width 0.4s ease;
}

/* Acciones Hero */
.hero-actions {
  display: flex;
  gap: 16px;
  align-items: center;
  flex-wrap: wrap;
}

/* BOTÓN DUOLINGO 3D PREMIUM */
.duo-3d-button {
  display: inline-flex;
  text-decoration: none !important;
  border: 0;
  border-radius: 20px;
  background: #4c1d95;
  padding-bottom: 6px;
  box-shadow: 0 12px 24px -6px rgba(115, 87, 237, 0.4);
  transition: all 0.15s ease-out;
  cursor: pointer;
  user-select: none;
}

.duo-btn-top {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 12px 24px;
  border-radius: 18px;
  background: linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%);
  color: #ffffff !important;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: transform 0.15s ease-out, background 0.15s;
}

.duo-3d-button:hover {
  transform: translateY(-2px);
  padding-bottom: 8px;
  box-shadow: 0 16px 30px -4px rgba(115, 87, 237, 0.55);
}
.duo-3d-button:hover .duo-btn-top {
  background: linear-gradient(180deg, #9333ea 0%, #7c3aed 100%);
}
.duo-3d-button:hover .duo-btn-arrow {
  transform: translateX(4px);
}

.duo-3d-button:active {
  transform: translateY(4px);
  padding-bottom: 2px;
  box-shadow: 0 4px 10px rgba(115, 87, 237, 0.3);
}

.duo-btn-play-circle {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #ffffff;
  color: #7c3aed;
  display: grid;
  place-items: center;
  font-size: 14px;
  font-weight: 900;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.duo-btn-text {
  display: flex;
  flex-direction: column;
  text-align: left;
}
.duo-btn-text small {
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
  color: #e9d5ff;
  text-transform: uppercase;
}
.duo-btn-text strong {
  font-size: 16px;
  font-weight: 700;
  color: #ffffff;
  white-space: nowrap;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.duo-btn-arrow {
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  transition: transform 0.2s ease;
  margin-left: 4px;
}

/* Botón secundario Catálogo */
.hero-catalog-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 14px 24px;
  border-radius: 99px;
  background: #ffffff;
  border: 2px solid #ddd6fe;
  color: #6d28d9 !important;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none !important;
  box-shadow: 0 4px 14px rgba(115, 87, 237, 0.1);
  transition: all 0.2s ease;
}
.hero-catalog-btn:hover {
  background: #f5f3ff;
  border-color: #a78bfa;
  color: #5b21b6 !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(115, 87, 237, 0.2);
}
.catalog-icon {
  font-size: 18px;
}

/* ========================================================
   SHOWCASE 3D DEL LIBRO EN HERO
   ======================================================== */
.hero-showcase-col {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 260px;
}

.book-3d-stage {
  position: relative;
  perspective: 900px;
  display: grid;
  place-items: center;
  width: 100%;
}

.book-3d-aura {
  position: absolute;
  width: 220px;
  height: 220px;
  border-radius: 50%;
  filter: blur(35px);
  opacity: 0.55;
  animation: pulse-aura 4s ease-in-out infinite alternate;
}

@keyframes pulse-aura {
  0% { transform: scale(0.9); opacity: 0.4; }
  100% { transform: scale(1.15); opacity: 0.7; }
}

.book-3d-object {
  position: relative;
  width: 170px;
  height: 230px;
  border-radius: 12px 22px 22px 12px;
  box-shadow: 
    16px 20px 35px -5px rgba(0, 0, 0, 0.3),
    0 0 0 1px rgba(255, 255, 255, 0.2) inset;
  transform: rotateY(-14deg) rotateX(6deg) translateZ(10px);
  transform-style: preserve-3d;
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  cursor: pointer;
  color: #ffffff;
}

.book-3d-object:hover {
  transform: rotateY(-4deg) rotateX(2deg) scale(1.04) translateY(-6px);
  box-shadow: 
    20px 28px 45px -5px rgba(0, 0, 0, 0.4),
    0 0 0 1.5px rgba(255, 255, 255, 0.4) inset;
}

.book-spine {
  position: absolute;
  top: 0;
  left: 0;
  width: 18px;
  height: 100%;
  background: rgba(0, 0, 0, 0.25);
  border-right: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px 0 0 12px;
}

.book-ribbon {
  position: absolute;
  top: 0;
  right: 28px;
  width: 14px;
  height: 48px;
  background: #facc15;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  clip-path: polygon(0 0, 100% 0, 100% 100%, 50% 80%, 0 100%);
}

.book-face {
  padding: 24px 16px 16px 28px;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  text-align: left;
}

.book-cover-emoji {
  font-size: 52px;
  filter: drop-shadow(0 6px 10px rgba(0, 0, 0, 0.25));
}

.book-cover-genre {
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 1px;
  background: rgba(0, 0, 0, 0.3);
  padding: 3px 8px;
  border-radius: 99px;
  display: inline-block;
  align-self: flex-start;
  backdrop-filter: blur(4px);
}

.book-cover-title {
  font-family: "Fredoka", sans-serif;
  font-size: 15px;
  line-height: 1.25;
  margin: 4px 0 2px;
  color: #ffffff;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.4);
}

.book-cover-author {
  font-size: 11px;
  opacity: 0.85;
  color: #ffffff;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.floating-badge {
  position: absolute;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 7px 16px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 800;
  z-index: 5;
  animation: float-badge 3.5s ease-in-out infinite alternate;
}

.badge-level {
  bottom: -10px;
  left: 10px;
  background: #ffffff;
  color: #1e1b4b;
  border: 2px solid #fde047;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.badge-reward {
  top: -10px;
  right: 10px;
  background: #ecfdf5;
  color: #047857;
  border: 2px solid #6ee7b7;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
  animation-delay: 1.5s;
}

@keyframes float-badge {
  0% { transform: translateY(0); }
  100% { transform: translateY(-8px); }
}

/* ========================================================
   QUICK GRID & EMOJIS CON ANIMACIÓN VIVA
   ======================================================== */
.quick-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 16px;
}

.quick-card {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 20px;
  border-radius: 22px;
  border: 2px solid #e2e8f0;
  box-shadow: 0 8px 24px rgba(16, 42, 86, 0.06);
  background: #ffffff;
  cursor: pointer;
  user-select: none;
  transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s, border-color 0.2s;
}

.quick-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 14px 30px rgba(16, 42, 86, 0.12);
}

.quick-card:active {
  transform: scale(0.98);
}

.quick-card.is-active {
  box-shadow: 0 14px 36px rgba(115, 87, 237, 0.2);
}

.coral-card.is-active {
  border-color: #f97316;
  background: linear-gradient(135deg, #fff7ed, #ffedd5);
}

.mint-card.is-active {
  border-color: #10b981;
  background: linear-gradient(135deg, #f0fdf4, #dcfce7);
}

.gold-card.is-active {
  border-color: #eab308;
  background: linear-gradient(135deg, #fefce8, #fef9c3);
}

.purple-card.is-active {
  border-color: #8b5cf6;
  background: linear-gradient(135deg, #faf5ff, #f3e8ff);
}

.card-expand-indicator {
  margin-left: auto;
  font-size: 11px;
  color: #94a3b8;
  transition: transform 0.25s ease, color 0.2s;
  padding: 4px;
}

.quick-card:hover .card-expand-indicator,
.quick-card.is-active .card-expand-indicator {
  color: #6366f1;
}

.card-icon {
  width: 50px;
  height: 50px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  font-size: 26px;
  flex-shrink: 0;
}

/* Emojis con animaciones vivas */
.stat-emoji {
  display: inline-block;
  transform-origin: center bottom;
  will-change: transform;
}

.emoji-fire {
  animation: fire-flicker 1.8s ease-in-out infinite alternate;
}

@keyframes fire-flicker {
  0% { transform: scale(1) translateY(0) rotate(0deg); }
  25% { transform: scale(1.18) translateY(-3px) rotate(-6deg); }
  50% { transform: scale(1.05) translateY(-4px) rotate(4deg); }
  75% { transform: scale(1.22) translateY(-2px) rotate(-4deg); }
  100% { transform: scale(1.12) translateY(-5px) rotate(2deg); }
}

.emoji-lightning {
  animation: lightning-surge 2.6s ease-in-out infinite;
}

@keyframes lightning-surge {
  0%, 75%, 100% { transform: scale(1) rotate(0deg); filter: drop-shadow(0 0 0 transparent); }
  80% { transform: scale(1.3) rotate(-14deg); filter: drop-shadow(0 0 10px rgba(234, 179, 8, 0.9)); }
  86% { transform: scale(1.1) rotate(10deg); filter: drop-shadow(0 0 5px rgba(234, 179, 8, 0.6)); }
  92% { transform: scale(1.25) rotate(-6deg); filter: drop-shadow(0 0 12px rgba(234, 179, 8, 1)); }
}

.emoji-leaves {
  animation: leaf-sway 3s ease-in-out infinite alternate;
}

@keyframes leaf-sway {
  0% { transform: rotate(0deg) translateY(0); }
  30% { transform: rotate(14deg) translateY(-5px) translateX(3px); }
  70% { transform: rotate(-10deg) translateY(-2px) translateX(-3px); }
  100% { transform: rotate(8deg) translateY(-6px) translateX(2px); }
}

.emoji-medal {
  animation: medal-wobble 2.8s ease-in-out infinite;
}

@keyframes medal-wobble {
  0%, 100% { transform: rotate(0deg) scale(1); }
  15% { transform: rotate(14deg) scale(1.18); filter: drop-shadow(0 4px 10px rgba(168, 85, 247, 0.4)); }
  30% { transform: rotate(-10deg) scale(1.12); }
  45% { transform: rotate(8deg) scale(1.06); }
  60% { transform: rotate(-4deg) scale(1.02); }
  75% { transform: rotate(0deg) scale(1); }
}

.coral-card {
  background: linear-gradient(135deg, #ffffff, #fff7ed);
  border-color: #fed7aa;
}
.coral-card .card-icon { background: #ffedd5; color: #ea580c; }

.mint-card {
  background: linear-gradient(135deg, #ffffff, #f0fdf4);
  border-color: #bbf7d0;
}
.mint-card .card-icon { background: #dcfce7; color: #16a34a; }

.gold-card {
  background: linear-gradient(135deg, #ffffff, #fefce8);
  border-color: #fef08a;
}
.gold-card .card-icon { background: #fef9c3; color: #ca8a04; }

.purple-card {
  background: linear-gradient(135deg, #ffffff, #faf5ff);
  border-color: #e9d5ff;
}
.purple-card .card-icon { background: #ede9fe; color: #7357ed; }

.card-info strong {
  display: block;
  font-size: 19px;
  color: #0f172a !important;
  font-family: "Fredoka", sans-serif;
}

.card-info p {
  margin: 3px 0 0;
  font-size: 13px;
  color: #475569 !important;
  font-weight: 500;
}

/* ========================================================
   RECUADRO EXPANDIBLE DE ESTADÍSTICAS
   ======================================================== */
.stat-detail-drawer {
  border-radius: 28px;
  padding: 28px 32px;
  border: 2px solid #ddd6fe;
  background: #ffffff;
  box-shadow: 0 20px 45px -10px rgba(115, 87, 237, 0.18);
  animation: slide-drawer-in 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes slide-drawer-in {
  from {
    opacity: 0;
    transform: translateY(-12px) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

.drawer-streak {
  background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 60%, #fed7aa 100%);
  border-color: #fb923c;
  box-shadow: 0 20px 45px -10px rgba(234, 88, 12, 0.2);
}

.drawer-xp {
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 60%, #bbf7d0 100%);
  border-color: #4ade80;
  box-shadow: 0 20px 45px -10px rgba(16, 185, 129, 0.2);
}

.drawer-leaves {
  background: linear-gradient(135deg, #fefce8 0%, #fef9c3 60%, #fef08a 100%);
  border-color: #facc15;
  box-shadow: 0 20px 45px -10px rgba(202, 138, 4, 0.2);
}

.drawer-badges {
  background: linear-gradient(135deg, #faf5ff 0%, #f3e8ff 60%, #e9d5ff 100%);
  border-color: #c084fc;
  box-shadow: 0 20px 45px -10px rgba(147, 51, 234, 0.2);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 22px;
  border-bottom: 1.5px solid rgba(0, 0, 0, 0.07);
  padding-bottom: 16px;
}

.drawer-title-group {
  display: flex;
  align-items: center;
  gap: 16px;
}

.drawer-icon-badge {
  width: 52px;
  height: 52px;
  border-radius: 18px;
  background: #ffffff;
  display: grid;
  place-items: center;
  font-size: 28px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
  flex-shrink: 0;
}

.drawer-title {
  font-family: "Fredoka", sans-serif;
  font-size: 22px;
  margin: 0 0 4px;
  color: #0f172a;
}

.drawer-subtitle {
  font-size: 14px;
  color: #475569;
  margin: 0;
}

.drawer-close-btn {
  padding: 8px 16px;
  border-radius: 99px;
  border: 1.5px solid rgba(0, 0, 0, 0.15);
  background: rgba(255, 255, 255, 0.85);
  color: #334155;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
}

.drawer-close-btn:hover {
  background: #ffffff;
  border-color: #000000;
  transform: scale(1.04);
}

/* Contenido Racha */
.drawer-stats-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
}

.drawer-stat-card {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  padding: 14px 18px;
  text-align: center;
  border: 1px solid rgba(0, 0, 0, 0.06);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
}

.d-stat-val {
  display: block;
  font-family: "Fredoka", sans-serif;
  font-size: 26px;
  font-weight: 700;
  color: #ea580c;
}

.d-stat-val.highlight-val {
  color: #0284c7;
  font-size: 20px;
}

.d-stat-lbl {
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.streak-week-view {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  padding: 16px 20px;
  margin-bottom: 22px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.week-title {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #475569;
  margin-bottom: 10px;
}

.week-days-row {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.week-day-pill {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px 4px;
  border-radius: 14px;
  background: #f8fafc;
  border: 1.5px solid #e2e8f0;
  font-size: 12px;
}

.week-day-pill.is-done {
  background: #fff7ed;
  border-color: #fdba74;
}

.week-day-pill.is-today {
  box-shadow: 0 0 0 2px #f97316;
  font-weight: 800;
}

.day-icon {
  font-size: 18px;
}

.day-label {
  font-size: 11px;
  color: #475569;
}

/* Contenido XP */
.xp-progress-overview {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  padding: 20px 24px;
  margin-bottom: 20px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.xp-level-banner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  margin-bottom: 12px;
}

.xp-level-chip {
  padding: 4px 14px;
  border-radius: 99px;
  background: #dcfce7;
  color: #15803d;
  font-size: 12px;
  font-weight: 800;
  letter-spacing: 0.6px;
}

.xp-next-target {
  font-size: 13px;
  color: #374151;
}

.xp-bar-track {
  height: 12px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
  margin-bottom: 8px;
}

.xp-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
  border-radius: 99px;
  transition: width 0.4s ease;
}

.xp-bar-labels {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #64748b;
  font-weight: 600;
}

.xp-sources-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: 12px;
  margin-bottom: 22px;
}

.xp-source-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.source-icon {
  font-size: 24px;
}

.xp-source-item strong {
  display: block;
  font-size: 15px;
  color: #047857;
}

.xp-source-item p {
  margin: 2px 0 0;
  font-size: 11px;
  color: #64748b;
}

/* Contenido Monedas (Hojas) */
.leaves-balance-banner {
  background: rgba(255, 255, 255, 0.85);
  border-radius: 18px;
  padding: 20px 24px;
  margin-bottom: 16px;
  border: 1px solid rgba(0, 0, 0, 0.06);
}

.leaves-big-display {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 10px;
}

.leaves-icon-symbol {
  font-size: 40px;
}

.leaves-counter {
  font-family: "Fredoka", sans-serif;
  font-size: 32px;
  color: #a16207;
  display: block;
  line-height: 1;
}

.leaves-counter-label {
  font-size: 13px;
  color: #713f12;
  font-weight: 600;
}

.leaves-use-summary {
  font-size: 14px;
  color: #4b5563;
  line-height: 1.5;
  margin: 0;
}

.leaves-gain-tips {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  margin-bottom: 22px;
}

.tip-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border-radius: 99px;
  background: rgba(255, 255, 255, 0.85);
  border: 1.5px solid #fde047;
  font-size: 12px;
  font-weight: 600;
  color: #713f12;
}

.tip-coin {
  font-weight: 800;
  color: #a16207;
}

/* Contenido Medallas */
.badges-counter-header {
  margin-bottom: 16px;
}

.badges-unlocked-badge {
  display: inline-flex;
  padding: 6px 16px;
  border-radius: 99px;
  background: #ede9fe;
  color: #6d28d9;
  font-size: 13px;
  font-weight: 800;
  border: 1.5px solid #ddd6fe;
}

.badges-hint {
  font-size: 14px;
  color: #475569;
  margin: 8px 0 0;
}

.drawer-badges-preview {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
  margin-bottom: 22px;
}

.drawer-mini-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.85);
  border: 1.5px solid #e2e8f0;
  opacity: 0.6;
}

.drawer-mini-badge.is-unlocked {
  opacity: 1;
  border-color: #c084fc;
  background: #ffffff;
  box-shadow: 0 4px 12px rgba(115, 87, 237, 0.08);
}

.mini-badge-icon {
  font-size: 26px;
}

.mini-badge-texts strong {
  display: block;
  font-size: 13px;
  color: #0f172a;
}

.mini-badge-texts span {
  font-size: 11px;
  color: #64748b;
}

.drawer-footer-actions {
  display: flex;
  gap: 14px;
  align-items: center;
}

.two-buttons-row {
  display: flex;
  gap: 14px;
  flex-wrap: wrap;
}

/* BOTONES 3D ESPECIALIZADOS PARA ESTADÍSTICAS */
.duo-streak-btn {
  background: #9a3412 !important;
  box-shadow: 0 10px 22px -4px rgba(234, 88, 12, 0.4) !important;
}
.duo-streak-btn .duo-btn-top {
  background: linear-gradient(180deg, #f97316 0%, #ea580c 100%) !important;
}
.duo-streak-btn:hover .duo-btn-top {
  background: linear-gradient(180deg, #fb923c 0%, #f97316 100%) !important;
}
.duo-streak-btn .duo-btn-play-circle {
  color: #ea580c !important;
}

.duo-xp-btn {
  background: #065f46 !important;
  box-shadow: 0 10px 22px -4px rgba(16, 185, 129, 0.4) !important;
}
.duo-xp-btn .duo-btn-top {
  background: linear-gradient(180deg, #10b981 0%, #059669 100%) !important;
}
.duo-xp-btn:hover .duo-btn-top {
  background: linear-gradient(180deg, #34d399 0%, #10b981 100%) !important;
}
.duo-xp-btn .duo-btn-play-circle {
  color: #059669 !important;
}

.duo-store-btn {
  background: #115e59 !important;
  box-shadow: 0 10px 22px -4px rgba(20, 184, 166, 0.4) !important;
}
.duo-store-btn .duo-btn-top {
  background: linear-gradient(180deg, #14b8a6 0%, #0d9488 100%) !important;
}
.duo-store-btn:hover .duo-btn-top {
  background: linear-gradient(180deg, #2dd4bf 0%, #14b8a6 100%) !important;
}
.duo-store-btn .duo-btn-play-circle {
  color: #0d9488 !important;
}

.duo-earn-leaves-btn {
  background: #854d0e !important;
  box-shadow: 0 10px 22px -4px rgba(234, 179, 8, 0.4) !important;
}
.duo-earn-leaves-btn .duo-btn-top {
  background: linear-gradient(180deg, #eab308 0%, #ca8a04 100%) !important;
}
.duo-earn-leaves-btn:hover .duo-btn-top {
  background: linear-gradient(180deg, #facc15 0%, #eab308 100%) !important;
}
.duo-earn-leaves-btn .duo-btn-play-circle {
  color: #ca8a04 !important;
}

.duo-badges-btn {
  background: #581c87 !important;
  box-shadow: 0 10px 22px -4px rgba(147, 51, 234, 0.4) !important;
}
.duo-badges-btn .duo-btn-top {
  background: linear-gradient(180deg, #9333ea 0%, #7e22ce 100%) !important;
}
.duo-badges-btn:hover .duo-btn-top {
  background: linear-gradient(180deg, #a855f7 0%, #9333ea 100%) !important;
}
.duo-badges-btn .duo-btn-play-circle {
  color: #7e22ce !important;
}

/* ========================================================
   DAILY QUEST (DESAFÍO DEL DÍA)
   ======================================================== */
.daily-quest-banner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  padding: 26px 34px;
  border-radius: 28px;
  background: linear-gradient(135deg, #fdf4ff 0%, #fae8ff 100%);
  border: 2px solid #f0abfc;
  box-shadow: 0 12px 28px rgba(217, 70, 239, 0.15);
}

.quest-pill {
  font-size: 12px;
  font-weight: 800;
  color: #86198f !important;
  text-transform: uppercase;
  letter-spacing: 0.8px;
}

.quest-content h3 {
  margin: 6px 0 4px;
  font-family: "Fredoka", sans-serif;
  font-size: 21px;
  color: #701a75 !important;
}

.quest-content p {
  margin: 0;
  color: #86198f !important;
  font-size: 14px;
}
.quest-content p strong {
  color: #701a75 !important;
}

/* BOTÓN 3D PARA DESAFÍO DEL DÍA */
.quest-3d-btn {
  background: #701a75 !important;
  box-shadow: 0 10px 24px -4px rgba(217, 70, 239, 0.45) !important;
  flex-shrink: 0;
}
.quest-3d-btn .duo-btn-top {
  background: linear-gradient(180deg, #c026d3 0%, #a21caf 100%) !important;
}
.quest-3d-btn:hover .duo-btn-top {
  background: linear-gradient(180deg, #d946ef 0%, #c026d3 100%) !important;
}
.quest-3d-btn .duo-btn-play-circle {
  color: #a21caf !important;
}

/* Story Cards Grid */
.stories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 22px;
}

.story-card {
  border-radius: 24px;
  overflow: hidden;
  border: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: transform 0.2s, box-shadow 0.2s;
  background: #ffffff;
  box-shadow: 0 8px 24px #102a5608;
}
.story-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 36px #102a5612;
}

.story-card-top {
  height: 120px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.story-icon {
  font-size: 46px;
}

.fav-btn {
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
.fav-btn.active {
  color: #ef4444;
  background: #ffffff;
}

.story-card-body {
  padding: 20px;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.story-tags {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.genre-badge {
  font-size: 11px;
  font-weight: 700;
  color: #6d28d9 !important;
  background: #ede9fe;
  padding: 3px 8px;
  border-radius: 99px;
}

.time-badge {
  font-size: 11px;
  color: #64748b !important;
  font-weight: 600;
}

.story-title {
  font-family: "Fredoka", sans-serif;
  font-size: 18px;
  margin: 0 0 4px;
  color: #0f172a !important;
}

.story-author-name {
  font-size: 13px;
  color: #64748b !important;
  margin: 0 0 10px;
}

.story-synopsis-preview {
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

.read-card-btn {
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
.read-card-btn:hover {
  background: #5b3bd9;
  transform: translateY(-1px);
}

@media (max-width: 768px) {
  .home-hero {
    grid-template-columns: 1fr;
    padding: 24px;
  }
  .hero-showcase-col {
    display: none;
  }
  .daily-quest-banner {
    flex-direction: column;
    align-items: stretch;
  }
}

/* ========================================================
   MODO NOCTURNO / LECTURA CÓMODA (/inicio)
   ======================================================== */
:global(.dark-mode) .home-hero {
  background: 
    radial-gradient(circle at 15% 20%, rgba(124, 58, 237, 0.35) 0%, transparent 45%),
    radial-gradient(circle at 85% 75%, rgba(59, 130, 246, 0.25) 0%, transparent 45%),
    linear-gradient(135deg, #120e29 0%, #1e1645 50%, #151a3a 100%);
  border: 2px solid rgba(139, 92, 246, 0.4);
  box-shadow: 0 24px 60px -10px rgba(0, 0, 0, 0.7), inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

:global(.dark-mode) .hero-pill-badge {
  background: #2e1065;
  color: #d8b4fe;
  border-color: #7c3aed;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

:global(.dark-mode) .hero-genre-pill {
  background: #082f49;
  color: #38bdf8;
  border-color: #0284c7;
}

:global(.dark-mode) .hero-title {
  color: #f8fafc !important;
}

:global(.dark-mode) .title-sub {
  color: #a78bfa !important;
}

:global(.dark-mode) .hero-desc {
  color: #cbd5e1 !important;
}

:global(.dark-mode) .streak-highlight {
  color: #fdba74;
  background: rgba(154, 52, 18, 0.45);
  border-color: #ea580c;
}

:global(.dark-mode) .reward-highlight {
  color: #6ee7b7;
  background: rgba(6, 95, 70, 0.45);
  border-color: #059669;
}

:global(.dark-mode) .hero-progress-card {
  background: rgba(22, 18, 48, 0.75);
  border-color: #6d28d9;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
}

:global(.dark-mode) .progress-title {
  color: #cbd5e1;
}

:global(.dark-mode) .progress-badge {
  color: #d8b4fe;
  background: #3b0764;
}

:global(.dark-mode) .hero-progress-track {
  background: #1e293b;
}

/* Botón 3D Duolingo en Modo Oscuro */
:global(.dark-mode) .duo-3d-button {
  background: #2e1065;
  box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.6);
}

:global(.dark-mode) .duo-btn-top {
  background: linear-gradient(180deg, #7c3aed 0%, #581c87 100%);
  border: 1px solid rgba(255, 255, 255, 0.22);
}

:global(.dark-mode) .duo-3d-button:hover .duo-btn-top {
  background: linear-gradient(180deg, #8b5cf6 0%, #6d28d9 100%);
}

:global(.dark-mode) .duo-btn-play-circle {
  background: #ffffff;
  color: #6d28d9;
}

:global(.dark-mode) .hero-catalog-btn {
  background: rgba(30, 41, 59, 0.75);
  border: 2px solid #475569;
  color: #f1f5f9 !important;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
}

:global(.dark-mode) .hero-catalog-btn:hover {
  background: #334155;
  border-color: #818cf8;
  color: #ffffff !important;
}

:global(.dark-mode) .badge-level {
  background: #1e1b4b;
  color: #fef08a;
  border: 2px solid #ca8a04;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

:global(.dark-mode) .badge-reward {
  background: #064e3b;
  color: #6ee7b7;
  border: 2px solid #059669;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
}

/* Tarjetas rápidas de gamificación en Modo Oscuro */
:global(.dark-mode) .quick-card {
  background: #131d33;
  box-shadow: 0 8px 24px #00000040;
  border-color: #273756;
}
:global(.dark-mode) .quick-card:hover {
  border-color: #475f8a;
}
:global(.dark-mode) .coral-card {
  background: linear-gradient(135deg, #18192b, #24141e);
  border-color: #9a341277;
}
:global(.dark-mode) .coral-card.is-active {
  border-color: #ea580c;
  box-shadow: 0 0 0 2px #ea580c66;
}
:global(.dark-mode) .coral-card .card-icon {
  background: #451a03;
  color: #fb923c;
}

:global(.dark-mode) .mint-card {
  background: linear-gradient(135deg, #111e26, #0e241f);
  border-color: #065f4677;
}
:global(.dark-mode) .mint-card.is-active {
  border-color: #10b981;
  box-shadow: 0 0 0 2px #10b98166;
}
:global(.dark-mode) .mint-card .card-icon {
  background: #064e3b;
  color: #34d399;
}

:global(.dark-mode) .gold-card {
  background: linear-gradient(135deg, #1c1c17, #222013);
  border-color: #854d0e77;
}
:global(.dark-mode) .gold-card.is-active {
  border-color: #eab308;
  box-shadow: 0 0 0 2px #eab30866;
}
:global(.dark-mode) .gold-card .card-icon {
  background: #713f12;
  color: #facc15;
}

:global(.dark-mode) .purple-card {
  background: linear-gradient(135deg, #1a1730, #211636);
  border-color: #6b21a877;
}
:global(.dark-mode) .purple-card.is-active {
  border-color: #a855f7;
  box-shadow: 0 0 0 2px #a855f766;
}
:global(.dark-mode) .purple-card .card-icon {
  background: #581c87;
  color: #c084fc;
}

:global(.dark-mode) .card-info strong {
  color: #f8fafc !important;
}
:global(.dark-mode) .card-info p {
  color: #94a3b8 !important;
}

/* Recuadro Expandible en Modo Oscuro */
:global(.dark-mode) .stat-detail-drawer {
  background: #11162a;
  border-color: #334155;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.7);
}
:global(.dark-mode) .drawer-streak {
  background: linear-gradient(135deg, #241410 0%, #1e110c 100%);
  border-color: #ea580c88;
}
:global(.dark-mode) .drawer-xp {
  background: linear-gradient(135deg, #0e1e18 0%, #091712 100%);
  border-color: #05966988;
}
:global(.dark-mode) .drawer-leaves {
  background: linear-gradient(135deg, #201d0d 0%, #181509 100%);
  border-color: #ca8a0488;
}
:global(.dark-mode) .drawer-badges {
  background: linear-gradient(135deg, #1c1333 0%, #150d29 100%);
  border-color: #7c3aed88;
}
:global(.dark-mode) .drawer-title {
  color: #f8fafc !important;
}
:global(.dark-mode) .drawer-subtitle {
  color: #94a3b8 !important;
}
:global(.dark-mode) .drawer-icon-badge {
  background: #1e293b;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.4);
}
:global(.dark-mode) .drawer-close-btn {
  background: #1e293b;
  color: #e2e8f0;
  border-color: #475569;
}
:global(.dark-mode) .drawer-close-btn:hover {
  background: #334155;
  color: #ffffff;
  border-color: #94a3b8;
}
:global(.dark-mode) .drawer-stat-card,
:global(.dark-mode) .streak-week-view,
:global(.dark-mode) .xp-progress-overview,
:global(.dark-mode) .xp-source-item,
:global(.dark-mode) .leaves-balance-banner,
:global(.dark-mode) .tip-badge,
:global(.dark-mode) .drawer-mini-badge {
  background: #182238;
  border-color: #273756;
}
:global(.dark-mode) .week-title {
  color: #cbd5e1;
}
:global(.dark-mode) .week-day-pill {
  background: #131d33;
  border-color: #273756;
}
:global(.dark-mode) .week-day-pill.is-done {
  background: #331508;
  border-color: #ea580c;
}
:global(.dark-mode) .day-label {
  color: #cbd5e1;
}
:global(.dark-mode) .xp-next-target {
  color: #cbd5e1;
}
:global(.dark-mode) .xp-bar-track {
  background: #1e293b;
}
:global(.dark-mode) .leaves-counter {
  color: #facc15;
}
:global(.dark-mode) .leaves-counter-label {
  color: #fde047;
}
:global(.dark-mode) .leaves-use-summary {
  color: #cbd5e1;
}
:global(.dark-mode) .tip-badge {
  color: #fef08a;
  border-color: #854d0e;
}
:global(.dark-mode) .tip-coin {
  color: #facc15;
}
:global(.dark-mode) .drawer-mini-badge.is-unlocked {
  background: #241640;
  border-color: #9333ea;
}
:global(.dark-mode) .mini-badge-texts strong {
  color: #f8fafc;
}

/* Desafío Diario en Modo Oscuro */
:global(.dark-mode) .daily-quest-banner {
  background: linear-gradient(135deg, #260a3d 0%, #36075c 100%);
  border-color: #a21caf77;
  box-shadow: 0 10px 30px #701a7530;
}
:global(.dark-mode) .quest-pill {
  color: #f0abfc !important;
}
:global(.dark-mode) .quest-content h3 {
  color: #fae8ff !important;
}
:global(.dark-mode) .quest-content p {
  color: #e879f9 !important;
}
:global(.dark-mode) .quest-content p strong {
  color: #ffffff !important;
}
:global(.dark-mode) .quest-3d-btn {
  background: #4a044e !important;
  box-shadow: 0 10px 24px -4px rgba(0, 0, 0, 0.7) !important;
}
:global(.dark-mode) .quest-3d-btn .duo-btn-top {
  background: linear-gradient(180deg, #a21caf 0%, #701a75 100%) !important;
}
:global(.dark-mode) .quest-3d-btn:hover .duo-btn-top {
  background: linear-gradient(180deg, #c026d3 0%, #86198f 100%) !important;
}

/* Sección de historias */
:global(.dark-mode) .section-heading h2 {
  color: #f8fafc !important;
}
:global(.dark-mode) .section-heading .eyebrow {
  color: #a78bfa !important;
}
:global(.dark-mode) .text-action {
  color: #c084fc !important;
}
:global(.dark-mode) .text-action:hover {
  color: #e9d5ff !important;
}

:global(.dark-mode) .story-card {
  background: #131d33;
  border-color: #273756;
  box-shadow: 0 8px 24px #00000030;
}
:global(.dark-mode) .story-card:hover {
  border-color: #475f8a;
  box-shadow: 0 16px 36px #00000050;
}
:global(.dark-mode) .fav-btn {
  background: #1e293bcc;
  color: #94a3b8;
}
:global(.dark-mode) .fav-btn.active {
  background: #1e293b;
  color: #ef4444;
}
:global(.dark-mode) .genre-badge {
  background: #2e1065;
  color: #c4b5fd !important;
}
:global(.dark-mode) .time-badge {
  color: #94a3b8 !important;
}
:global(.dark-mode) .story-title {
  color: #f8fafc !important;
}
:global(.dark-mode) .story-author-name {
  color: #94a3b8 !important;
}
:global(.dark-mode) .story-synopsis-preview {
  color: #cbd5e1 !important;
}
:global(.dark-mode) .read-card-btn {
  background: #7357ed;
  color: #ffffff !important;
}
:global(.dark-mode) .read-card-btn:hover {
  background: #5b3bd9;
}
</style>
