<script setup lang="ts">
import type { Story, StoryGenre, StoryDifficulty, StorySegment } from '~/types/leemas'

const router = useRouter()
const { createUserStory, profile, allStories } = useGamification()

const isCreating = ref(false)
const currentStep = ref(1) // 1: Datos, 2: Bloques/Preguntas, 3: Vista Previa

const genresList: StoryGenre[] = [
  'Aventura',
  'Ciencia Ficción',
  'Fantasía',
  'Misterio',
  'Terror',
  'Microcuento',
  'Historia',
  'Humor'
]

const coverPalette = [
  { color: 'linear-gradient(135deg, #7357ed 0%, #3b82f6 100%)', icon: '🗺️' },
  { color: 'linear-gradient(135deg, #f06f59 0%, #db2777 100%)', icon: '🚀' },
  { color: 'linear-gradient(135deg, #10b981 0%, #047857 100%)', icon: '🌿' },
  { color: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', icon: '✨' },
  { color: 'linear-gradient(135deg, #0ea5e9 0%, #1e293b 100%)', icon: '🏮' },
  { color: 'linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)', icon: '🔮' }
]

// Estado del formulario
const storyForm = ref<{
  title: string
  author: string
  genre: StoryGenre
  difficulty: StoryDifficulty
  readingTimeMin: number
  synopsis: string
  coverColor: string
  coverIcon: string
  segments: StorySegment[]
}>({
  title: '',
  author: profile.value.name || 'Autor Lee+',
  genre: 'Fantasía',
  difficulty: 'Fácil',
  readingTimeMin: 5,
  synopsis: '',
  coverColor: coverPalette[0].color,
  coverIcon: coverPalette[0].icon,
  segments: [
    {
      type: 'text',
      label: 'Capítulo 1: El comienzo',
      content: ''
    },
    {
      type: 'question',
      question: {
        id: 'q-custom-1',
        prompt: '',
        type: 'choice',
        options: ['', '', ''],
        correctIndex: 0,
        explanation: ''
      }
    }
  ]
})

// Historias creadas por la comunidad/usuario actual
const userCreatedStories = computed(() => {
  return allStories.value.filter(s => s.isCommunity)
})

function startNewStory() {
  isCreating.value = true
  currentStep.value = 1
  storyForm.value.author = profile.value.name || 'Autor Lee+'
}

function cancelCreation() {
  if (confirm('¿Deseas cancelar la creación de esta historia? Los cambios no guardados se perderán.')) {
    isCreating.value = false
  }
}

function selectCoverTheme(paletteItem: typeof coverPalette[0]) {
  storyForm.value.coverColor = paletteItem.color
  storyForm.value.coverIcon = paletteItem.icon
}

function addTextSegment() {
  storyForm.value.segments.push({
    type: 'text',
    label: `Capítulo ${storyForm.value.segments.filter(s => s.type === 'text').length + 1}`,
    content: ''
  })
}

function addQuestionSegment() {
  storyForm.value.segments.push({
    type: 'question',
    question: {
      id: 'q-custom-' + Date.now(),
      prompt: '',
      type: 'choice',
      options: ['', '', ''],
      correctIndex: 0,
      explanation: ''
    }
  })
}

function removeSegment(index: number) {
  if (storyForm.value.segments.length <= 1) {
    alert('Tu historia debe contener al menos un bloque.')
    return
  }
  storyForm.value.segments.splice(index, 1)
}

function validateStep1(): boolean {
  if (!storyForm.value.title.trim()) {
    alert('Por favor ingresa un título para tu historia.')
    return false
  }
  if (!storyForm.value.synopsis.trim()) {
    alert('Por favor ingresa una breve sinopsis para los lectores.')
    return false
  }
  return true
}

function validateStep2(): boolean {
  for (let i = 0; i < storyForm.value.segments.length; i++) {
    const seg = storyForm.value.segments[i]
    if (seg.type === 'text') {
      if (!seg.content.trim()) {
        alert(`Por favor redacta el texto del bloque #${i + 1}`)
        return false
      }
    } else if (seg.type === 'question') {
      if (!seg.question.prompt.trim()) {
        alert(`Por favor escribe el enunciado de la pregunta del bloque #${i + 1}`)
        return false
      }
      const emptyOpt = seg.question.options.some(opt => !opt.trim())
      if (emptyOpt) {
        alert(`Por favor completa todas las opciones de la pregunta del bloque #${i + 1}`)
        return false
      }
      if (!seg.question.explanation.trim()) {
        alert(`Por favor escribe una explicación pedagógica para la pregunta del bloque #${i + 1}`)
        return false
      }
    }
  }
  return true
}

function nextStep() {
  if (currentStep.value === 1 && validateStep1()) {
    currentStep.value = 2
  } else if (currentStep.value === 2 && validateStep2()) {
    currentStep.value = 3
  }
}

function publishStory() {
  const newStory = createUserStory({
    title: storyForm.value.title.trim(),
    author: storyForm.value.author.trim() || profile.value.name,
    genre: storyForm.value.genre,
    difficulty: storyForm.value.difficulty,
    readingTimeMin: Number(storyForm.value.readingTimeMin) || 5,
    synopsis: storyForm.value.synopsis.trim(),
    coverColor: storyForm.value.coverColor,
    coverIcon: storyForm.value.coverIcon,
    segments: JSON.parse(JSON.stringify(storyForm.value.segments))
  })

  alert(`¡Felicitaciones! Tu historia "${newStory.title}" ha sido publicada. Ganaste +100 XP y +50 Hojas.`)
  isCreating.value = false
  router.push(`/leer/${newStory.id}`)
}
</script>

<template>
  <main class="app-shell desktop-page">
    <AppHeader />

    <!-- Modo 1: Pantalla Principal del Taller / Mis Publicaciones -->
    <div v-if="!isCreating" class="content create-page">
      <section class="create-hero glass-panel">
        <div class="create-hero-text">
          <p class="eyebrow">COMPARTE TU VOZ CON LA COMUNIDAD</p>
          <h1>Crea historias que<br><em>inspiren a leer.</em></h1>
          <p class="create-hero-desc">
            En Lee+, cualquiera puede convertirse en autor. Redacta relatos cautivadores y desafía a otros lectores con preguntas didácticas interactivas.
          </p>
          <button class="primary-button create-cta-btn" type="button" @click="startNewStory">
            + Crear una nueva historia
          </button>
        </div>

        <div class="create-illustration-box">
          <span class="create-art-icon">✍️</span>
          <span class="sparkle-one">✦</span>
          <span class="sparkle-two">✧</span>
        </div>
      </section>

      <!-- Pasos de Creación Didáctica -->
      <section class="creator-steps-grid">
        <article class="step-card glass-panel">
          <span class="step-num">01</span>
          <h3>Escribe por fragmentos</h3>
          <p>Divide tu relato en pasajes cómodos de leer en 2 a 3 minutos para atrapar la atención.</p>
        </article>
        <article class="step-card glass-panel">
          <span class="step-num">02</span>
          <h3>Añade preguntas didácticas</h3>
          <p>Intercala retos de inferencia, deducción o vocabulario para ejercitar la comprensión.</p>
        </article>
        <article class="step-card glass-panel">
          <span class="step-num">03</span>
          <h3>Publica y gana recompensas</h3>
          <p>Tu historia estará disponible en el catálogo comunitario y desbloquearás la medalla <em>Voz Propia</em>.</p>
        </article>
      </section>

      <!-- Historias creadas por la comunidad -->
      <section class="community-stories-section">
        <div class="section-heading">
          <div>
            <p class="eyebrow">HISTORIAS PUBLICADAS</p>
            <h2>Historias de la comunidad ({{ userCreatedStories.length }})</h2>
          </div>
        </div>

        <div v-if="userCreatedStories.length === 0" class="no-community-box glass-panel">
          <span>🌱</span>
          <h3>Aún no se han publicado historias en esta sesión</h3>
          <p>¡Sé la primera persona en compartir una historia didáctica con la comunidad!</p>
          <button class="primary-button" type="button" @click="startNewStory">
            Comenzar mi relato ahora →
          </button>
        </div>

        <div v-else class="community-grid">
          <article 
            v-for="story in userCreatedStories" 
            :key="story.id"
            class="community-card glass-panel"
          >
            <div class="community-card-cover" :style="{ background: story.coverColor }">
              <span class="cover-icon">{{ story.coverIcon }}</span>
            </div>
            <div class="community-card-body">
              <span class="genre-pill">{{ story.genre }}</span>
              <h3>{{ story.title }}</h3>
              <p class="author-label">Por {{ story.author }}</p>
              <p class="synopsis-label">{{ story.synopsis }}</p>
              <NuxtLink :to="`/leer/${story.id}`" class="read-card-btn">
                Leer historia →
              </NuxtLink>
            </div>
          </article>
        </div>
      </section>
    </div>

    <!-- Modo 2: Asistente de Creación por Pasos (Wizard) -->
    <div v-else class="content create-wizard-page">
      <div class="wizard-header glass-panel">
        <div class="wizard-title-col">
          <button class="back-link-btn" type="button" @click="cancelCreation">← Salir del editor</button>
          <h2>Taller de Creadores Lee+</h2>
        </div>

        <!-- Indicador de Pasos -->
        <div class="wizard-steps-indicator">
          <div class="wizard-step-node" :class="{ active: currentStep === 1, done: currentStep > 1 }">
            <span>1</span> <small>Identidad</small>
          </div>
          <div class="step-connector"></div>
          <div class="wizard-step-node" :class="{ active: currentStep === 2, done: currentStep > 2 }">
            <span>2</span> <small>Contenido & Retos</small>
          </div>
          <div class="step-connector"></div>
          <div class="wizard-step-node" :class="{ active: currentStep === 3 }">
            <span>3</span> <small>Publicación</small>
          </div>
        </div>
      </div>

      <!-- PASO 1: Identidad y Portada -->
      <section v-if="currentStep === 1" class="wizard-body glass-panel">
        <h3 class="step-title">Paso 1: Datos de tu historia</h3>
        <p class="step-desc">Elige un título sugerente, selecciona el género y dale una identidad visual.</p>

        <div class="form-group">
          <label>Título de la historia *</label>
          <input 
            v-model="storyForm.title" 
            type="text" 
            placeholder="Ejemplo: El secreto de la isla flotante" 
            class="form-input"
          >
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label>Género literario</label>
            <select v-model="storyForm.genre" class="form-input">
              <option v-for="g in genresList" :key="g" :value="g">{{ g }}</option>
            </select>
          </div>

          <div class="form-group">
            <label>Dificultad de lectura</label>
            <select v-model="storyForm.difficulty" class="form-input">
              <option value="Fácil">Fácil (Lectores iniciales)</option>
              <option value="Intermedio">Intermedio (Lectores habituales)</option>
              <option value="Avanzado">Avanzado (Lectores expertos)</option>
            </select>
          </div>
        </div>

        <div class="form-row-2">
          <div class="form-group">
            <label>Tiempo estimado de lectura (minutos)</label>
            <input 
              v-model="storyForm.readingTimeMin" 
              type="number" 
              min="2" 
              max="30" 
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label>Nombre del autor/a</label>
            <input 
              v-model="storyForm.author" 
              type="text" 
              class="form-input"
            >
          </div>
        </div>

        <div class="form-group">
          <label>Sinopsis breve (atrapa al lector en 2 líneas) *</label>
          <textarea 
            v-model="storyForm.synopsis" 
            rows="3" 
            placeholder="Cuenta de qué trata tu historia sin revelar el final..."
            class="form-input"
          ></textarea>
        </div>

        <div class="form-group">
          <label>Estilo de portada</label>
          <div class="palette-picker">
            <button 
              v-for="(p, i) in coverPalette" 
              :key="i"
              type="button"
              class="palette-swatch"
              :class="{ selected: storyForm.coverColor === p.color }"
              :style="{ background: p.color }"
              @click="selectCoverTheme(p)"
            >
              <span>{{ p.icon }}</span>
            </button>
          </div>
        </div>

        <div class="wizard-actions">
          <button class="primary-button" type="button" @click="nextStep">
            Siguiente: Escribir contenido y retos →
          </button>
        </div>
      </section>

      <!-- PASO 2: Contenido y Preguntas Didácticas -->
      <section v-else-if="currentStep === 2" class="wizard-body glass-panel">
        <h3 class="step-title">Paso 2: Capítulos y preguntas de comprensión</h3>
        <p class="step-desc">Intercala pasajes de texto con preguntas de comprensión para que la lectura sea activa y didáctica.</p>

        <div class="blocks-container">
          <div 
            v-for="(seg, idx) in storyForm.segments" 
            :key="idx"
            class="segment-editor-card"
            :class="seg.type === 'text' ? 'text-block-theme' : 'question-block-theme'"
          >
            <div class="block-header">
              <span class="block-badge">
                {{ seg.type === 'text' ? '📖 Bloque de Lectura' : '🎯 Reto de Comprensión' }} #{{ idx + 1 }}
              </span>
              <button 
                type="button" 
                class="remove-block-btn" 
                title="Eliminar bloque"
                @click="removeSegment(idx)"
              >
                Eliminar bloque ✕
              </button>
            </div>

            <!-- Editor Bloque de Texto -->
            <div v-if="seg.type === 'text'" class="block-body">
              <div class="form-group">
                <label>Etiqueta del capítulo (opcional)</label>
                <input 
                  v-model="seg.label" 
                  type="text" 
                  placeholder="Ej: Capítulo 1: La misteriosa carta"
                  class="form-input"
                >
              </div>
              <div class="form-group">
                <label>Contenido del fragmento *</label>
                <textarea 
                  v-model="seg.content" 
                  rows="5" 
                  placeholder="Escribe aquí el texto que leerá el usuario en este paso..."
                  class="form-input"
                ></textarea>
              </div>
            </div>

            <!-- Editor Bloque de Pregunta -->
            <div v-else-if="seg.type === 'question'" class="block-body">
              <div class="form-group">
                <label>Pregunta o reto didáctico *</label>
                <input 
                  v-model="seg.question.prompt" 
                  type="text" 
                  placeholder="Ej: ¿Por qué el personaje decidió regresar al bosque?"
                  class="form-input"
                >
              </div>

              <div class="form-group">
                <label>Tipo de reto</label>
                <select v-model="seg.question.type" class="form-input">
                  <option value="choice">Comprensión general (Opción múltiple)</option>
                  <option value="vocabulary">Vocabulario en contexto</option>
                  <option value="inference">Inferencia y deducción</option>
                </select>
              </div>

              <div class="options-editor">
                <label>Opciones de respuesta (Marca el botón circular de la correcta) *</label>
                <div 
                  v-for="(opt, optIdx) in seg.question.options" 
                  :key="optIdx"
                  class="option-edit-row"
                >
                  <button 
                    type="button"
                    class="correct-radio-btn"
                    :class="{ checked: seg.question.correctIndex === optIdx }"
                    :title="seg.question.correctIndex === optIdx ? 'Respuesta correcta' : 'Marcar como correcta'"
                    @click="seg.question.correctIndex = optIdx"
                  >
                    {{ seg.question.correctIndex === optIdx ? '✓' : '' }}
                  </button>
                  <input 
                    v-model="seg.question.options[optIdx]" 
                    type="text" 
                    :placeholder="`Opción ${['A', 'B', 'C', 'D'][optIdx]}`"
                    class="form-input"
                  >
                </div>
              </div>

              <div class="form-group">
                <label>Explicación didáctica (se mostrará cuando el lector responda) *</label>
                <input 
                  v-model="seg.question.explanation" 
                  type="text" 
                  placeholder="Ej: Correcto. En el segundo párrafo se menciona que..."
                  class="form-input"
                >
              </div>
            </div>
          </div>
        </div>

        <div class="add-blocks-bar">
          <button class="add-block-btn" type="button" @click="addTextSegment">
            + Añadir fragmento de texto
          </button>
          <button class="add-block-btn question-btn" type="button" @click="addQuestionSegment">
            + Añadir reto de comprensión
          </button>
        </div>

        <div class="wizard-actions">
          <button class="secondary-button" type="button" @click="currentStep = 1">← Volver a Datos</button>
          <button class="primary-button" type="button" @click="nextStep">Siguiente: Previsualizar y Publicar →</button>
        </div>
      </section>

      <!-- PASO 3: Vista Previa y Publicación -->
      <section v-else-if="currentStep === 3" class="wizard-body glass-panel">
        <h3 class="step-title">Paso 3: Vista previa de tu historia</h3>
        <p class="step-desc">Revisa cómo se verá la ficha de tu historia antes de compartirla con la comunidad.</p>

        <div class="preview-card-showcase">
          <div class="preview-cover" :style="{ background: storyForm.coverColor }">
            <span class="preview-emoji">{{ storyForm.coverIcon }}</span>
            <span class="preview-badge">Comunidad Lee+</span>
          </div>

          <div class="preview-info">
            <div class="preview-tags">
              <span class="genre-pill">{{ storyForm.genre }}</span>
              <span class="time-pill">⏱ {{ storyForm.readingTimeMin }} min</span>
              <span class="diff-pill">{{ storyForm.difficulty }}</span>
            </div>
            <h2>{{ storyForm.title }}</h2>
            <p class="author-lead">Escrita por <strong>{{ storyForm.author }}</strong></p>
            <p class="synopsis-lead">{{ storyForm.synopsis }}</p>

            <div class="summary-stats-box">
              <div>
                <strong>{{ storyForm.segments.filter(s => s.type === 'text').length }}</strong>
                <span>Capítulos</span>
              </div>
              <div>
                <strong>{{ storyForm.segments.filter(s => s.type === 'question').length }}</strong>
                <span>Retos didácticos</span>
              </div>
            </div>
          </div>
        </div>

        <div class="reward-notice-card">
          <span>🎁</span>
          <div>
            <strong>Recompensas por publicar</strong>
            <p>Al hacer clic en publicar, recibirás automáticamente <strong>+100 XP</strong>, <strong>+50 Hojas 🍃</strong> y la insignia <strong>Voz Propia ✍️</strong>.</p>
          </div>
        </div>

        <div class="wizard-actions">
          <button class="secondary-button" type="button" @click="currentStep = 2">← Modificar contenido</button>
          <button class="primary-button publish-btn" type="button" @click="publishStory">
            🚀 Publicar historia en Lee+
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.create-page,
.create-wizard-page {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

/* Hero */
.create-hero {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  align-items: center;
  gap: 30px;
  padding: 40px;
  border-radius: 32px;
  background: linear-gradient(135deg, #fffffffa, #f4edfffa);
  border: 1.5px solid #ddd6fe;
  box-shadow: 0 16px 40px #7357ed14;
}

.create-hero h1 {
  font-family: "Fredoka", sans-serif;
  font-size: clamp(34px, 5vw, 48px);
  margin: 6px 0 12px;
  color: #0f172a;
}
.create-hero em {
  color: #7357ed;
  font-style: normal;
}
.create-hero-desc {
  color: #334155;
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 24px;
}

.create-illustration-box {
  position: relative;
  display: grid;
  place-items: center;
  min-height: 180px;
}

.create-art-icon {
  font-size: 80px;
  filter: drop-shadow(0 12px 20px #7357ed33);
}

.sparkle-one, .sparkle-two {
  position: absolute;
  color: #7357ed;
  font-size: 24px;
}
.sparkle-one { top: 20px; right: 40px; }
.sparkle-two { bottom: 20px; left: 40px; }

/* Steps Grid con colores vivos y agradables */
.creator-steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}

.step-card {
  padding: 24px;
  border-radius: 20px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 8px 24px #102a5608;
  transition: transform 0.2s, box-shadow 0.2s;
}
.step-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px #102a5612;
}

.step-card:nth-child(1) {
  background: linear-gradient(135deg, #ffffff, #faf5ff);
  border-color: #ddd6fe;
}
.step-card:nth-child(1) .step-num {
  color: #7c3aed;
}

.step-card:nth-child(2) {
  background: linear-gradient(135deg, #ffffff, #f0fdf4);
  border-color: #a7f3d0;
}
.step-card:nth-child(2) .step-num {
  color: #059669;
}

.step-card:nth-child(3) {
  background: linear-gradient(135deg, #ffffff, #eff6ff);
  border-color: #bfdbfe;
}
.step-card:nth-child(3) .step-num {
  color: #2563eb;
}

.step-num {
  font-family: "Fredoka", sans-serif;
  font-size: 28px;
  font-weight: 700;
  display: block;
  margin-bottom: 8px;
}

.step-card h3 {
  font-family: "Fredoka", sans-serif;
  font-size: 19px;
  margin: 0 0 6px;
  color: #0f172a !important;
}

.step-card p {
  color: #475569 !important;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* Community Section */
.no-community-box {
  text-align: center;
  padding: 40px 20px;
  border-radius: 24px;
  background: #fffffffa;
  border: 1.5px solid #e2e8f0;
}
.no-community-box span {
  font-size: 40px;
  display: block;
  margin-bottom: 10px;
}
.no-community-box h3 {
  font-family: "Fredoka", sans-serif;
  font-size: 20px;
  margin: 0 0 6px;
  color: #0f172a;
}
.no-community-box p {
  color: #475569;
  font-size: 14px;
  margin-bottom: 20px;
}

.community-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 20px;
}

.community-card {
  border-radius: 24px;
  overflow: hidden;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  box-shadow: 0 8px 24px #102a5608;
  transition: transform 0.2s, box-shadow 0.2s;
}
.community-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 14px 32px #102a5612;
}

.community-card-cover {
  height: 110px;
  display: grid;
  place-items: center;
  font-size: 42px;
}

.community-card-body {
  padding: 20px;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.community-card h3 {
  font-family: "Fredoka", sans-serif;
  font-size: 18px;
  color: #0f172a !important;
  margin: 8px 0 4px;
}

.author-label {
  font-size: 12px;
  color: #64748b !important;
  margin: 0 0 8px;
}

.synopsis-label {
  font-size: 13px;
  color: #334155 !important;
  line-height: 1.5;
  margin-bottom: 16px;
  flex: 1;
}

/* Wizard Header */
.wizard-header {
  padding: 24px 30px;
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 8px 24px #102a5608;
}

.back-link-btn {
  background: transparent;
  border: 0;
  color: #7357ed;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  margin-bottom: 4px;
}

.wizard-title-col h2 {
  font-family: "Fredoka", sans-serif;
  margin: 0;
  font-size: 24px;
  color: #0f172a !important;
}

.wizard-steps-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wizard-step-node {
  display: flex;
  align-items: center;
  gap: 6px;
  opacity: 0.6;
}
.wizard-step-node.active,
.wizard-step-node.done {
  opacity: 1;
}

.wizard-step-node span {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #e2e8f0;
  color: #334155;
  display: grid;
  place-items: center;
  font-weight: 700;
  font-size: 13px;
}
.wizard-step-node.active span {
  background: #7357ed;
  color: #fff;
}
.wizard-step-node.done span {
  background: #16a34a;
  color: #fff;
}

.wizard-step-node small {
  font-weight: 700;
  font-size: 12px;
  color: #0f172a;
}

.step-connector {
  width: 24px;
  height: 2px;
  background: #cbd5e1;
}

/* Wizard Body */
.wizard-body {
  padding: 36px;
  border-radius: 28px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  box-shadow: 0 12px 36px #102a560a;
}

.step-title {
  font-family: "Fredoka", sans-serif;
  font-size: 24px;
  margin: 0 0 6px;
  color: #0f172a !important;
}
.step-desc {
  color: #475569 !important;
  margin: 0 0 28px;
  font-size: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 20px;
}
.form-group label {
  font-weight: 700;
  font-size: 14px;
  color: #0f172a !important;
}

.form-input {
  padding: 12px 16px;
  border-radius: 12px;
  border: 1.5px solid #cbd5e1;
  font-family: inherit;
  font-size: 15px;
  color: #0f172a;
  outline: none;
  background: #ffffff;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input::placeholder {
  color: #94a3b8;
}
.form-input:focus {
  border-color: #7357ed;
  background: #fff;
  box-shadow: 0 0 0 3px #7357ed20;
}

.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.palette-picker {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.palette-swatch {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  border: 3px solid transparent;
  display: grid;
  place-items: center;
  font-size: 24px;
  cursor: pointer;
  transition: transform 0.2s;
}
.palette-swatch.selected {
  border-color: #0f172a;
  transform: scale(1.1);
}

.wizard-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 32px;
  border-top: 1px solid #e2e8f0;
  padding-top: 24px;
}

/* Blocks Editor */
.blocks-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.segment-editor-card {
  padding: 24px;
  border-radius: 20px;
  border: 1.5px solid #cbd5e1;
  background: #f8fafc;
}

.text-block-theme {
  border-left: 6px solid #7357ed;
  background: linear-gradient(135deg, #ffffff, #faf8ff);
}
.question-block-theme {
  border-left: 6px solid #059669;
  background: linear-gradient(135deg, #ffffff, #f0fdf4);
}

.block-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.block-badge {
  font-weight: 700;
  font-size: 13px;
  color: #0f172a;
  background: #ffffff;
  padding: 4px 10px;
  border-radius: 99px;
  border: 1px solid #cbd5e1;
}

.remove-block-btn {
  background: transparent;
  border: 0;
  color: #dc2626;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
}

.options-editor {
  margin-bottom: 16px;
}
.options-editor label {
  display: block;
  font-weight: 700;
  font-size: 13px;
  color: #0f172a !important;
  margin-bottom: 8px;
}

.option-edit-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.correct-radio-btn {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid #cbd5e1;
  background: #fff;
  display: grid;
  place-items: center;
  font-weight: 900;
  cursor: pointer;
  flex-shrink: 0;
  color: #102a56;
}
.correct-radio-btn.checked {
  background: #16a34a;
  border-color: #16a34a;
  color: #fff;
}

.add-blocks-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.add-block-btn {
  padding: 12px 20px;
  border-radius: 99px;
  border: 1.5px dashed #7357ed;
  background: #f5f3ff;
  color: #6d28d9;
  font-weight: 700;
  font-size: 14px;
  cursor: pointer;
}
.add-block-btn.question-btn {
  border-color: #059669;
  background: #ecfdf5;
  color: #047857;
}

/* Step 3 Preview */
.preview-card-showcase {
  display: grid;
  grid-template-columns: 0.8fr 1.2fr;
  border-radius: 24px;
  overflow: hidden;
  border: 1.5px solid #e2e8f0;
  background: #ffffff;
  margin-bottom: 24px;
  box-shadow: 0 10px 30px #102a5608;
}

.preview-cover {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  min-height: 200px;
}
.preview-emoji { font-size: 64px; }
.preview-badge {
  position: absolute;
  bottom: 12px;
  background: #00000055;
  color: #fff;
  padding: 4px 10px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 700;
}

.preview-info {
  padding: 24px;
}
.preview-info h2 {
  font-family: "Fredoka", sans-serif;
  font-size: 24px;
  margin: 8px 0 4px;
  color: #0f172a !important;
}
.preview-tags {
  display: flex;
  gap: 6px;
  margin-bottom: 8px;
}

.author-lead {
  font-size: 13px;
  color: #64748b !important;
  margin: 0 0 10px;
}
.synopsis-lead {
  font-size: 14px;
  color: #334155 !important;
  line-height: 1.5;
  margin-bottom: 20px;
}

.summary-stats-box {
  display: flex;
  gap: 20px;
  padding-top: 14px;
  border-top: 1px solid #e2e8f0;
}
.summary-stats-box div strong {
  display: block;
  font-size: 20px;
  color: #0f172a !important;
}
.summary-stats-box div span {
  font-size: 12px;
  color: #64748b !important;
}

.reward-notice-card {
  display: flex;
  align-items: center;
  gap: 14px;
  background: #fdf4ff;
  border: 1.5px solid #f0abfc;
  padding: 16px 20px;
  border-radius: 16px;
  color: #701a75;
}
.reward-notice-card span { font-size: 28px; }
.reward-notice-card strong { color: #701a75 !important; }
.reward-notice-card p { margin: 2px 0 0; font-size: 13px; color: #86198f !important; }

.publish-btn {
  background: linear-gradient(135deg, #16a34a, #15803d);
}

@media (max-width: 768px) {
  .create-hero,
  .preview-card-showcase {
    grid-template-columns: 1fr;
  }
  .form-row-2 {
    grid-template-columns: 1fr;
  }
  .wizard-header {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
