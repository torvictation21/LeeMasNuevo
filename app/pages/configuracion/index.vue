<script setup lang="ts">
const { profile } = useGamification()
const { isDark, toggleTheme } = useTheme()

const editName = ref(profile.value.name)
const dailyGoalMinutes = ref(10)
const soundEffectsEnabled = ref(true)
const saveSuccess = ref(false)

function saveSettings() {
  if (editName.value.trim()) {
    profile.value.name = editName.value.trim()
  }
  saveSuccess.value = true
  setTimeout(() => {
    saveSuccess.value = false
  }, 2500)
}

function resetAllData() {
  if (confirm('¿Estás seguro de que deseas reiniciar tu progreso? Esto restablecerá tu nivel, XP, racha y favoritos a los valores predeterminados.')) {
    localStorage.clear()
    sessionStorage.clear()
    window.location.href = '/'
  }
}
</script>

<template>
  <main class="app-shell settings-page">
    <section class="settings-page-card glass-panel">
      <NuxtLink to="/inicio" class="back-link">← Volver al inicio</NuxtLink>

      <p class="eyebrow">TU ESPACIO</p>
      <h1>Configuración</h1>
      <p class="settings-intro">Ajusta Lee+ para que leer se adapte perfectamente a tu ritmo y comodidad.</p>

      <!-- Grupo Perfil -->
      <section class="settings-group">
        <h2>Mi Perfil</h2>
        <div class="setting-field">
          <label>Nombre de lector/a</label>
          <div class="input-action-row">
            <input v-model="editName" type="text" class="setting-input" placeholder="Tu nombre">
            <button class="save-small-btn" type="button" @click="saveSettings">Guardar</button>
          </div>
        </div>
      </section>

      <!-- Grupo Apariencia y Lectura Cómoda -->
      <section class="settings-group">
        <h2>Apariencia y Visualización</h2>

        <div class="setting-row">
          <div>
            <strong>Modo nocturno (Lectura cómoda)</strong>
            <p>Reduce la fatiga ocular con una paleta oscura y contraste equilibrado.</p>
          </div>
          <button 
            type="button" 
            class="setting-switch" 
            :aria-pressed="isDark" 
            @click="toggleTheme"
          >
            <span></span>
          </button>
        </div>
      </section>

      <!-- Grupo Ritual de Lectura -->
      <section class="settings-group">
        <h2>Ritual de lectura</h2>

        <div class="setting-row">
          <div>
            <strong>Meta diaria de lectura</strong>
            <p>Tiempo objetivo para mantener encendida tu racha de fuego.</p>
          </div>
          <div class="pill-selector">
            <button 
              type="button" 
              class="pill-btn" 
              :class="{ active: dailyGoalMinutes === 5 }" 
              @click="dailyGoalMinutes = 5"
            >
              5 min
            </button>
            <button 
              type="button" 
              class="pill-btn" 
              :class="{ active: dailyGoalMinutes === 10 }" 
              @click="dailyGoalMinutes = 10"
            >
              10 min
            </button>
            <button 
              type="button" 
              class="pill-btn" 
              :class="{ active: dailyGoalMinutes === 15 }" 
              @click="dailyGoalMinutes = 15"
            >
              15 min
            </button>
          </div>
        </div>

        <div class="setting-row">
          <div>
            <strong>Efectos sonoros didácticos</strong>
            <p>Sonidos al acertar preguntas y completar historias.</p>
          </div>
          <button 
            type="button" 
            class="setting-switch" 
            :aria-pressed="soundEffectsEnabled" 
            @click="soundEffectsEnabled = !soundEffectsEnabled"
          >
            <span></span>
          </button>
        </div>
      </section>

      <!-- Zona de Reinicio / Debug -->
      <section class="settings-group danger-zone">
        <h2>Datos y almacenamiento</h2>
        <div class="setting-row">
          <div>
            <strong>Reiniciar progreso local</strong>
            <p>Restablece el progreso de gamificación para comenzar desde cero.</p>
          </div>
          <button class="danger-btn" type="button" @click="resetAllData">
            Reiniciar
          </button>
        </div>
      </section>

      <div v-if="saveSuccess" class="toast-success">
        ✓ Cambios guardados correctamente
      </div>
    </section>
  </main>
</template>

<style scoped>
.setting-field {
  margin-top: 14px;
}
.setting-field label {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: #334155;
  margin-bottom: 6px;
}

.input-action-row {
  display: flex;
  gap: 10px;
}

.setting-input {
  flex: 1;
  padding: 10px 16px;
  border-radius: 12px;
  border: 1px solid #cbd5e1;
  font-family: inherit;
  font-size: 15px;
  color: #102a56;
  outline: none;
}
.setting-input:focus {
  border-color: #7357ed;
}

.save-small-btn {
  padding: 10px 18px;
  border-radius: 12px;
  background: #7357ed;
  color: #fff;
  border: 0;
  font-weight: 700;
  cursor: pointer;
}

.pill-selector {
  display: flex;
  gap: 6px;
}
.pill-btn {
  background: #f1f5f9;
  border: 1px solid #cbd5e1;
  padding: 6px 12px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  color: #475569;
  cursor: pointer;
}
.pill-btn.active {
  background: #7357ed;
  color: #fff;
  border-color: #7357ed;
}

.danger-zone h2 {
  color: #b91c1c;
}
.danger-btn {
  padding: 8px 16px;
  border-radius: 99px;
  background: #fee2e2;
  border: 1px solid #fca5a5;
  color: #dc2626;
  font-weight: 700;
  font-size: 13px;
  cursor: pointer;
}
.danger-btn:hover {
  background: #fecaca;
}

.toast-success {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background: #16a34a;
  color: #fff;
  padding: 12px 24px;
  border-radius: 99px;
  font-weight: 700;
  font-size: 14px;
  box-shadow: 0 10px 25px #00000020;
}
</style>
