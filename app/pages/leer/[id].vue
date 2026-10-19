<script setup lang="ts">
import type { Story, StorySegment } from '~/types/leemas'

const route = useRoute()
const router = useRouter()
const storyId = computed(() => String(route.params.id))

const { getStoryById, updateStoryProgress, completeStory, isFavorite, toggleFavorite, profile } = useGamification()

const story = computed<Story | undefined>(() => getStoryById(storyId.value))

const currentSegmentIndex = ref(0)
const selectedOptionIndex = ref<number | null>(null)
const answerChecked = ref(false)
const isAnswerCorrect = ref(false)
const correctCount = ref(0)
const totalQuestions = ref(0)
const isStoryCompleted = ref(false)
const fontSizeMode = ref<'normal' | 'large' | 'xlarge'>('normal')
const showExitModal = ref(false)

// Inicializar progreso previo si existe
onMounted(() => {
  if (!story.value) return

  // Contar preguntas
  totalQuestions.value = story.value.segments.filter(s => s.type === 'question').length

  const savedProg = profile.value.storyProgress[storyId.value]
  if (savedProg && !savedProg.completed && savedProg.currentSegment < story.value.segments.length) {
    currentSegmentIndex.value = savedProg.currentSegment
  }
})

const currentSegment = computed<StorySegment | null>(() => {
  if (!story.value || !story.value.segments) return null
  return story.value.segments[currentSegmentIndex.value] || null
})

const totalSegments = computed(() => story.value?.segments.length || 1)

const progressPercent = computed(() => {
  if (isStoryCompleted.value) return 100
  return Math.round(((currentSegmentIndex.value) / totalSegments.value) * 100)
})

function selectOption(index: number) {
  if (answerChecked.value) return
  selectedOptionIndex.value = index
}

function checkAnswer() {
  if (selectedOptionIndex.value === null || !currentSegment.value || currentSegment.value.type !== 'question') return
  const q = currentSegment.value.question
  isAnswerCorrect.value = (selectedOptionIndex.value === q.correctIndex)
  if (isAnswerCorrect.value) {
    correctCount.value += 1
  }
  answerChecked.value = true
}

function nextStep() {
  if (!story.value) return

  // Guardar avance intermedio
  updateStoryProgress(storyId.value, currentSegmentIndex.value + 1, totalSegments.value, false)

  if (currentSegmentIndex.value < totalSegments.value - 1) {
    currentSegmentIndex.value += 1
    selectedOptionIndex.value = null
    answerChecked.value = false
    isAnswerCorrect.value = false
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    // Lectura completada
    finishStory()
  }
}

function finishStory() {
  if (!story.value) return
  isStoryCompleted.value = true

  const perfect = totalQuestions.value > 0 ? correctCount.value === totalQuestions.value : true
  const xpEarned = 50 + (correctCount.value * 15)
  const leavesEarned = 10 + (correctCount.value * 5)

  completeStory(storyId.value, {
    xpEarned,
    leavesEarned,
    perfectScore: perfect
  })
}

function exitReader() {
  router.push('/biblioteca')
}

function cycleFontSize() {
  if (fontSizeMode.value === 'normal') fontSizeMode.value = 'large'
  else if (fontSizeMode.value === 'large') fontSizeMode.value = 'xlarge'
  else fontSizeMode.value = 'normal'
}
</script>

<template>
  <main class="reader-shell" :class="[`font-${fontSizeMode}`]">
    <!-- Not Found -->
    <div v-if="!story" class="story-not-found glass-panel">
      <h2>Historia no encontrada</h2>
      <p>No pudimos cargar esta historia. Es posible que haya sido eliminada o el enlace no sea correcto.</p>
      <NuxtLink to="/explorar" class="primary-button">Explorar otras historias →</NuxtLink>
    </div>

    <!-- Reader Active -->
    <div v-else-if="!isStoryCompleted" class="reader-container">
      <!-- Top Navigation Bar -->
      <header class="reader-header">
        <button class="reader-close-btn" type="button" aria-label="Salir de la lectura" @click="showExitModal = true">
          ✕
        </button>

        <!-- Progress Track -->
        <div class="reader-progress-bar" role="progressbar" :aria-valuenow="progressPercent" aria-valuemin="0" aria-valuemax="100">
          <div class="reader-progress-fill" :style="{ width: `${progressPercent}%` }">
            <span class="progress-glow"></span>
          </div>
        </div>

        <!-- Controls & Stats -->
        <div class="reader-header-meta">
          <button class="font-toggle-btn" type="button" title="Ajustar tamaño de letra" @click="cycleFontSize">
            A{{ fontSizeMode === 'normal' ? '' : (fontSizeMode === 'large' ? '+' : '++') }}
          </button>
          <div class="reader-streak-pill" title="Racha activa">
            🔥 <span>{{ profile.streak.current }}</span>
          </div>
          <button 
            class="favorite-toggle-btn" 
            :class="{ active: isFavorite(story.id) }" 
            type="button" 
            :title="isFavorite(story.id) ? 'En favoritos' : 'Guardar en favoritos'"
            @click="toggleFavorite(story.id)"
          >
            {{ isFavorite(story.id) ? '♥' : '♡' }}
          </button>
        </div>
      </header>

      <!-- Reader Body Area -->
      <section class="reader-content-area">
        <!-- Segmento de Texto -->
        <article v-if="currentSegment?.type === 'text'" class="text-segment-card glass-panel">
          <div class="segment-badge">
            <span class="genre-pill">{{ story.genre }}</span>
            <span v-if="currentSegment.label" class="chapter-pill">{{ currentSegment.label }}</span>
          </div>
          <h1 class="segment-title">{{ story.title }}</h1>
          <p class="story-author">Por <strong>{{ story.author }}</strong></p>

          <div class="text-body-flow">
            <p>{{ currentSegment.content }}</p>
          </div>

          <div class="reading-hint">
            <span>💡</span> Lee con atención. A continuación pondremos a prueba tu comprensión de este pasaje.
          </div>

          <div class="segment-actions">
            <button class="continue-reading-btn" type="button" @click="nextStep">
              Continuar al desafío <span>→</span>
            </button>
          </div>
        </article>

        <!-- Segmento de Pregunta de Comprensión -->
        <article v-else-if="currentSegment?.type === 'question'" class="question-segment-card glass-panel">
          <div class="question-header">
            <span class="question-type-tag">
              <span v-if="currentSegment.question.type === 'vocabulary'">📖 Vocabulario en contexto</span>
              <span v-else-if="currentSegment.question.type === 'inference'">🧠 Inferencia e interpretación</span>
              <span v-else>🎯 Comprensión de lectura</span>
            </span>
            <span class="question-step-count">Pregunta de comprensión</span>
          </div>

          <h2 class="question-prompt">{{ currentSegment.question.prompt }}</h2>

          <div class="options-list">
            <button 
              v-for="(opt, idx) in currentSegment.question.options" 
              :key="idx"
              type="button"
              class="option-item"
              :class="{ 
                selected: selectedOptionIndex === idx,
                correct: answerChecked && idx === currentSegment.question.correctIndex,
                incorrect: answerChecked && selectedOptionIndex === idx && idx !== currentSegment.question.correctIndex,
                disabled: answerChecked
              }"
              @click="selectOption(idx)"
            >
              <span class="option-bullet">{{ ['A', 'B', 'C', 'D'][idx] || idx + 1 }}</span>
              <span class="option-text">{{ opt }}</span>
            </button>
          </div>

          <!-- Bottom Action when not checked yet -->
          <div v-if="!answerChecked" class="question-check-footer">
            <button 
              class="check-btn" 
              type="button" 
              :disabled="selectedOptionIndex === null"
              @click="checkAnswer"
            >
              Comprobar respuesta
            </button>
          </div>
        </article>
      </section>

      <!-- Feedback Banner (Duolingo Style Bottom Drawer) -->
      <Transition name="feedback-slide">
        <aside 
          v-if="answerChecked && currentSegment?.type === 'question'" 
          class="feedback-drawer"
          :class="isAnswerCorrect ? 'feedback-correct' : 'feedback-incorrect'"
        >
          <div class="feedback-inner">
            <div class="feedback-message">
              <div class="feedback-icon">{{ isAnswerCorrect ? '✓' : '✕' }}</div>
              <div>
                <strong>{{ isAnswerCorrect ? '¡Excelente deducción!' : 'No exactamente' }}</strong>
                <p>{{ currentSegment.question.explanation }}</p>
              </div>
            </div>
            <button class="feedback-continue-btn" type="button" @click="nextStep">
              {{ currentSegmentIndex < totalSegments - 1 ? 'Continuar →' : 'Ver resultados →' }}
            </button>
          </div>
        </aside>
      </Transition>
    </div>

    <!-- Victory / Completed Celebration Screen -->
    <section v-else class="victory-screen glass-panel">
      <div class="victory-confetti-art">🎉 📚 ✨</div>
      <p class="eyebrow">¡MISIÓN CUMPLIDA!</p>
      <h1>Has completado<br><em>{{ story.title }}</em></h1>
      <p class="victory-subtitle">Cada historia que terminas expande tu mundo y fortalece tu mente.</p>

      <div class="victory-stats-grid">
        <div class="victory-stat-card xp-stat">
          <span class="stat-icon">⚡</span>
          <strong>+{{ 50 + (correctCount * 15) }} XP</strong>
          <small>Puntos de experiencia</small>
        </div>
        <div class="victory-stat-card leaves-stat">
          <span class="stat-icon">🍃</span>
          <strong>+{{ 10 + (correctCount * 5) }} Hojas</strong>
          <small>Monedas ganadas</small>
        </div>
        <div class="victory-stat-card streak-stat">
          <span class="stat-icon">🔥</span>
          <strong>{{ profile.streak.current }} Días</strong>
          <small>Racha de lectura activa</small>
        </div>
        <div class="victory-stat-card score-stat">
          <span class="stat-icon">🎯</span>
          <strong>{{ correctCount }} / {{ totalQuestions }}</strong>
          <small>Preguntas acertadas</small>
        </div>
      </div>

      <div class="victory-actions">
        <NuxtLink to="/biblioteca" class="primary-button">Ir a mi biblioteca →</NuxtLink>
        <NuxtLink to="/explorar" class="secondary-button">Descubrir otra historia</NuxtLink>
      </div>
    </section>

    <!-- Modal de confirmación al salir -->
    <div v-if="showExitModal" class="modal-backdrop" @click="showExitModal = false">
      <div class="exit-modal glass-panel" @click.stop>
        <h3>¿Quieres pausar tu lectura?</h3>
        <p>Tu avance quedará guardado para que puedas continuar exactamente donde lo dejaste.</p>
        <div class="modal-actions">
          <button class="cancel-modal-btn" type="button" @click="showExitModal = false">Seguir leyendo</button>
          <button class="confirm-modal-btn" type="button" @click="exitReader">Guardar y salir</button>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
.reader-shell {
  min-height: 100vh;
  position: relative;
  background: radial-gradient(circle at 80% 10%, #eae7ff 0, transparent 35%),
              radial-gradient(circle at 10% 60%, #e0f2fe 0, transparent 30%),
              #f8faff;
  color: #102a56;
  font-family: "Atkinson Hyperlegible Next", Arial, sans-serif;
  padding: 16px 20px 140px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.reader-container {
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
}

/* Header */
.reader-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 8px 0 20px;
  width: 100%;
}

.reader-close-btn {
  background: #ffffffc9;
  border: 1px solid #dbe2ef;
  color: #697a91;
  font-size: 18px;
  font-weight: 700;
  width: 42px;
  height: 42px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  transition: all 0.2s;
  cursor: pointer;
  flex-shrink: 0;
}
.reader-close-btn:hover {
  background: #fff;
  color: #102a56;
  transform: scale(1.05);
}

.reader-progress-bar {
  flex: 1;
  height: 14px;
  background: #e2e8f0;
  border-radius: 99px;
  overflow: hidden;
  position: relative;
  box-shadow: inset 0 2px 4px #0000000a;
}

.reader-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #7357ed, #4ade80);
  border-radius: 99px;
  transition: width 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  position: relative;
}

.progress-glow {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 12px;
  background: #ffffffcc;
  filter: blur(2px);
}

.reader-header-meta {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

.font-toggle-btn {
  background: #ffffffb8;
  border: 1px solid #dbe2ef;
  font-weight: 700;
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 99px;
  color: #102a56;
  cursor: pointer;
}

.reader-streak-pill {
  background: #fff0eb;
  border: 1px solid #fed7aa;
  padding: 6px 12px;
  border-radius: 99px;
  font-weight: 700;
  font-size: 13px;
  color: #ea580c;
  display: flex;
  align-items: center;
  gap: 4px;
}

.favorite-toggle-btn {
  background: #ffffffb8;
  border: 1px solid #dbe2ef;
  font-size: 16px;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  cursor: pointer;
  color: #94a3b8;
  transition: all 0.2s;
}
.favorite-toggle-btn.active {
  color: #ef4444;
  background: #fee2e2;
  border-color: #fca5a5;
}

/* Content Area */
.reader-content-area {
  margin-top: 10px;
}

.text-segment-card,
.question-segment-card {
  padding: 32px 36px;
  border-radius: 28px;
  border: 1px solid #ffffffd9;
  background: linear-gradient(135deg, #fffffffa, #f4f3ffcc);
  box-shadow: 0 20px 40px #102a5612;
  backdrop-filter: blur(16px);
}

.segment-badge {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.genre-pill {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  background: #ede9fe;
  color: #7357ed;
  padding: 4px 10px;
  border-radius: 99px;
}

.chapter-pill {
  font-size: 11px;
  font-weight: 600;
  background: #e2e8f0;
  color: #475569;
  padding: 4px 10px;
  border-radius: 99px;
}

.segment-title {
  font-family: "Fredoka", sans-serif;
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #0f172a !important;
}

.story-author {
  font-size: 14px;
  color: #475569 !important;
  margin: 0 0 24px;
}

.text-body-flow {
  line-height: 1.85;
  color: #1e293b !important;
  margin-bottom: 28px;
}

.font-normal .text-body-flow p { font-size: 18px; color: #1e293b !important; }
.font-large .text-body-flow p { font-size: 21px; line-height: 1.9; color: #1e293b !important; }
.font-xlarge .text-body-flow p { font-size: 24px; line-height: 2; color: #1e293b !important; }

.reading-hint {
  display: flex;
  align-items: center;
  gap: 10px;
  background: #f1f5f9;
  border-radius: 14px;
  padding: 12px 16px;
  font-size: 14px;
  color: #334155 !important;
  margin-bottom: 28px;
  border: 1px solid #cbd5e1;
}

.continue-reading-btn,
.primary-button {
  background: linear-gradient(135deg, #7357ed, #4f46e5);
  color: #ffffff !important;
  border: 0;
  border-radius: 99px;
  padding: 16px 28px;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 10px 24px #7357ed40;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s, box-shadow 0.2s;
  text-decoration: none;
}
.continue-reading-btn:hover,
.primary-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 14px 28px #7357ed55;
}

/* Question Styles */
.question-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.question-type-tag {
  font-size: 13px;
  font-weight: 700;
  color: #6d28d9 !important;
  background: #ede9fe;
  padding: 6px 12px;
  border-radius: 99px;
}

.question-step-count {
  font-size: 12px;
  color: #64748b !important;
  font-weight: 700;
}

.question-prompt {
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
  margin: 0 0 24px;
  color: #0f172a !important;
}

.options-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 28px;
}

.option-item {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px 20px;
  border-radius: 18px;
  background: #ffffff;
  border: 2px solid #cbd5e1;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 10px #00000005;
  color: #1e293b !important;
}

.option-item:hover:not(.disabled) {
  border-color: #7357ed;
  background: #faf8ff;
  transform: translateY(-1px);
}

.option-item.selected {
  border-color: #7357ed;
  background: #f5f3ff;
  box-shadow: 0 0 0 3px #7357ed25;
  color: #4338ca !important;
}

.option-item.correct {
  border-color: #16a34a !important;
  background: #f0fdf4 !important;
  color: #14532d !important;
}

.option-item.incorrect {
  border-color: #dc2626 !important;
  background: #fef2f2 !important;
  color: #7f1d1d !important;
}

.option-bullet {
  width: 32px;
  height: 32px;
  border-radius: 10px;
  background: #f1f5f9;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 14px;
  color: #475569;
  flex-shrink: 0;
}

.option-item.selected .option-bullet {
  background: #7357ed;
  color: #fff;
}

.option-item.correct .option-bullet {
  background: #22c55e;
  color: #fff;
}

.option-item.incorrect .option-bullet {
  background: #ef4444;
  color: #fff;
}

.option-text {
  font-size: 16px;
  font-weight: 500;
  color: inherit;
  line-height: 1.4;
}

.check-btn {
  width: 100%;
  padding: 16px;
  border-radius: 99px;
  background: #7357ed;
  color: #fff;
  border: 0;
  font-size: 17px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 8px 20px #7357ed33;
}
.check-btn:disabled {
  background: #cbd5e1;
  color: #94a3b8;
  cursor: not-allowed;
  box-shadow: none;
}

/* Feedback Drawer (Duolingo Style) */
.feedback-drawer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  padding: 24px 20px;
  box-shadow: 0 -10px 30px #00000015;
}

.feedback-correct {
  background: #dcfce7;
  border-top: 3px solid #22c55e;
  color: #14532d;
}

.feedback-incorrect {
  background: #fee2e2;
  border-top: 3px solid #ef4444;
  color: #7f1d1d;
}

.feedback-inner {
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.feedback-message {
  display: flex;
  align-items: center;
  gap: 16px;
}

.feedback-icon {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  font-size: 22px;
  font-weight: 900;
  color: #fff;
  flex-shrink: 0;
}
.feedback-correct .feedback-icon { background: #22c55e; }
.feedback-incorrect .feedback-icon { background: #ef4444; }

.feedback-message strong {
  display: block;
  font-size: 18px;
  margin-bottom: 4px;
}
.feedback-message p {
  margin: 0;
  font-size: 14px;
  opacity: 0.9;
}

.feedback-continue-btn {
  padding: 14px 28px;
  border-radius: 99px;
  font-size: 16px;
  font-weight: 700;
  border: 0;
  cursor: pointer;
  white-space: nowrap;
}
.feedback-correct .feedback-continue-btn {
  background: #16a34a;
  color: #fff;
}
.feedback-incorrect .feedback-continue-btn {
  background: #dc2626;
  color: #fff;
}

/* Feedback Animations */
.feedback-slide-enter-active,
.feedback-slide-leave-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s;
}
.feedback-slide-enter-from,
.feedback-slide-leave-to {
  transform: translateY(100%);
  opacity: 0;
}

/* Victory Screen */
.victory-screen {
  max-width: 640px;
  padding: 48px 36px;
  text-align: center;
  border-radius: 32px;
  margin-top: 40px;
  border: 1px solid #ffffffd9;
  background: linear-gradient(135deg, #fffffffa, #f4f3fffa);
  box-shadow: 0 25px 60px #102a561a;
}

.victory-confetti-art {
  font-size: 48px;
  margin-bottom: 12px;
}

.victory-screen h1 {
  font-family: "Fredoka", sans-serif;
  font-size: 32px;
  margin: 8px 0 12px;
  color: #102a56;
}

.victory-subtitle {
  color: #64748b;
  margin-bottom: 32px;
  font-size: 16px;
}

.victory-stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 36px;
}

.victory-stat-card {
  padding: 18px;
  border-radius: 20px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  text-align: center;
  box-shadow: 0 4px 12px #00000008;
}
.victory-stat-card .stat-icon {
  font-size: 24px;
  display: block;
  margin-bottom: 6px;
}
.victory-stat-card strong {
  display: block;
  font-size: 20px;
  color: #0f172a;
}
.victory-stat-card small {
  color: #64748b;
  font-size: 12px;
}

.victory-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.secondary-button {
  background: #e2e8f0;
  color: #334155;
  border: 0;
  border-radius: 99px;
  padding: 14px 28px;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  display: inline-block;
  transition: all 0.2s;
}
.secondary-button:hover {
  background: #cbd5e1;
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: #00000055;
  backdrop-filter: blur(4px);
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 20px;
}
.exit-modal {
  max-width: 420px;
  width: 100%;
  padding: 28px;
  border-radius: 24px;
  background: #fff;
  text-align: center;
}
.exit-modal h3 {
  margin: 0 0 8px;
  font-size: 20px;
  color: #0f172a;
}
.exit-modal p {
  color: #64748b;
  font-size: 14px;
  margin-bottom: 24px;
}
.modal-actions {
  display: flex;
  gap: 12px;
}
.cancel-modal-btn {
  flex: 1;
  padding: 12px;
  border-radius: 99px;
  border: 1px solid #cbd5e1;
  background: #fff;
  font-weight: 700;
  color: #475569;
}
.confirm-modal-btn {
  flex: 1;
  padding: 12px;
  border-radius: 99px;
  border: 0;
  background: #ef4444;
  font-weight: 700;
  color: #fff;
}

@media (max-width: 640px) {
  .text-segment-card,
  .question-segment-card {
    padding: 20px;
  }
  .feedback-inner {
    flex-direction: column;
    align-items: stretch;
  }
  .victory-stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
