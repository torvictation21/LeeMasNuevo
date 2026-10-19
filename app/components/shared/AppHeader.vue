<script setup lang="ts">
const streakOpen = ref(false)
const notificationsOpen = ref(false)
const profileOpen = ref(false)
const profilePhoto = ref('')
const { signOut } = useLeeSession()
const { profile } = useGamification()
const { isDark, toggleTheme } = useTheme()

onMounted(() => { 
  if (import.meta.client) {
    profilePhoto.value = localStorage.getItem('leemas-profile-photo') || '' 
  }
})

function choosePhoto(event: Event) { 
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = () => { 
    profilePhoto.value = String(reader.result)
    localStorage.setItem('leemas-profile-photo', profilePhoto.value) 
  }
  reader.readAsDataURL(file) 
}

function leave() { 
  signOut()
  navigateTo('/') 
}
</script>
<template>
  <header class="topbar">
    <NuxtLink class="brand" to="/inicio">
      <span class="brand-mark">Lee<span>+</span></span>
      <span class="brand-subtitle">un hábito que se abre</span>
    </NuxtLink>

    <div class="streak-control">
      <button class="daily-status" type="button" :aria-expanded="streakOpen" @click="streakOpen = !streakOpen">
        <span>🔥</span>
        <strong>{{ profile.streak.current }}</strong>
        <span>días</span>
        <span class="status-arrow" :class="{ rotated: streakOpen }">⌄</span>
      </button>

      <Transition name="streak">
        <section v-if="streakOpen" class="streak-summary glass-panel">
          <div>
            <span class="chapter-label">RACHA ACTUAL</span>
            <strong>{{ profile.streak.current }} días leyendo</strong>
            <p>¡Gran constancia! Tu récord histórico es de {{ profile.streak.max }} días.</p>
          </div>
          <div class="week">
            <span :class="profile.streak.current >= 1 ? 'done' : ''">L</span>
            <span :class="profile.streak.current >= 2 ? 'done' : ''">M</span>
            <span :class="profile.streak.current >= 3 ? 'done' : ''">X</span>
            <span :class="profile.streak.current >= 4 ? 'done' : ''">J</span>
            <span :class="profile.streak.current >= 5 ? 'done' : ''">V</span>
            <span :class="profile.streak.current >= 6 ? 'done' : ''">S</span>
            <span class="today" :class="profile.streak.current >= 7 ? 'done' : ''">D</span>
          </div>
        </section>
      </Transition>
    </div>

    <div class="top-actions glass-panel">
      <button 
        class="theme-toggle-btn" 
        type="button" 
        :title="isDark ? 'Cambiar a modo diurno' : 'Cambiar a modo nocturno'" 
        :aria-label="isDark ? 'Modo diurno' : 'Modo nocturno'"
        @click="toggleTheme"
      >
        <span class="theme-icon">{{ isDark ? '☀️' : '🌙' }}</span>
      </button>
      <button class="notification-button" type="button" aria-label="Notificaciones" @click="notificationsOpen = !notificationsOpen; profileOpen = false">
        <span class="bell-icon"></span><i></i>
      </button>
      <button class="avatar" type="button" aria-label="Menú de perfil" @click="profileOpen = !profileOpen; notificationsOpen = false">
        <img v-if="profilePhoto" :src="profilePhoto" alt="Foto de perfil">
        <span v-else>{{ (profile.name || 'V')[0].toUpperCase() }}</span>
      </button>

      <section v-if="notificationsOpen" class="notification-menu desktop-popup glass-panel">
        <strong>Notificaciones</strong>
        <p>✦ ¡Racha de {{ profile.streak.current }} días activa! Sigue así.</p>
        <p>✎ Hay nuevas historias en la sección Explorar.</p>
        <button type="button" @click="notificationsOpen = false">Marcar como leídas</button>
      </section>

      <section v-if="profileOpen" class="profile-menu desktop-popup glass-panel">
        <div class="menu-profile">
          <span class="avatar">
            <img v-if="profilePhoto" :src="profilePhoto" alt="Foto de perfil">
            <span v-else>{{ (profile.name || 'V')[0].toUpperCase() }}</span>
          </span>
          <div>
            <strong>{{ profile.name }}</strong>
            <small>Nivel {{ profile.level }} · {{ profile.leaves }} 🍃 hojas</small>
          </div>
        </div>
        <label class="profile-photo-option">Cambiar foto <span>›</span><input type="file" accept="image/*" @change="choosePhoto"></label>
        <NuxtLink to="/progreso" class="menu-item-link" @click="profileOpen = false">Mi progreso y medallas <span>›</span></NuxtLink>
        <NuxtLink to="/biblioteca" class="menu-item-link" @click="profileOpen = false">Mis lecturas y guardados <span>›</span></NuxtLink>
        <NuxtLink to="/configuracion" class="menu-item-link" @click="profileOpen = false">Configuración <span>›</span></NuxtLink>
        <hr>
        <button class="sign-out" type="button" @click="leave">Cerrar sesión</button>
      </section>
    </div>
  </header>

  <div v-if="notificationsOpen || profileOpen" class="mobile-menu-backdrop" @click="notificationsOpen = false; profileOpen = false"></div>
  <section v-if="notificationsOpen" class="mobile-sheet notification-sheet glass-panel">
    <button class="sheet-close" type="button" @click="notificationsOpen = false">×</button>
    <strong>Notificaciones</strong>
    <p>✦ ¡Racha de {{ profile.streak.current }} días activa! Sigue así.</p>
    <p>✎ Hay nuevas historias en la sección Explorar.</p>
    <button type="button" @click="notificationsOpen = false">Marcar como leídas</button>
  </section>

  <section v-if="profileOpen" class="mobile-sheet profile-sheet glass-panel">
    <button class="sheet-close" type="button" @click="profileOpen = false">×</button>
    <div class="menu-profile">
      <span class="avatar">
        <img v-if="profilePhoto" :src="profilePhoto" alt="Foto de perfil">
        <span v-else>{{ (profile.name || 'V')[0].toUpperCase() }}</span>
      </span>
      <div>
        <strong>{{ profile.name }}</strong>
        <small>Nivel {{ profile.level }} · {{ profile.leaves }} 🍃 hojas</small>
      </div>
    </div>
    <label class="profile-photo-option">Cambiar foto <span>›</span><input type="file" accept="image/*" @change="choosePhoto"></label>
    <NuxtLink to="/progreso" class="menu-item-link" @click="profileOpen = false">Mi progreso y medallas <span>›</span></NuxtLink>
    <NuxtLink to="/biblioteca" class="menu-item-link" @click="profileOpen = false">Mis lecturas y guardados <span>›</span></NuxtLink>
    <NuxtLink to="/configuracion" class="menu-item-link" @click="profileOpen = false">Configuración <span>›</span></NuxtLink>
    <hr>
    <button class="sign-out" type="button" @click="leave">Cerrar sesión</button>
  </section>
</template>

<style scoped>
.topbar { z-index: 50 !important; }
</style>
