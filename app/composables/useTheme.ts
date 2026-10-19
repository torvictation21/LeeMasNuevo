import { ref, onMounted } from 'vue'

const THEME_STORAGE_KEY = 'leemas_theme_dark'

export function useTheme() {
  const isDark = useState<boolean>('leemas-dark-mode', () => true) // Default to true as user requested dark reading theme

  function initTheme() {
    if (!import.meta.client) return
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    if (saved !== null) {
      isDark.value = saved === 'true'
    } else {
      // Por defecto activamos el modo nocturno solicitado
      isDark.value = true
      localStorage.setItem(THEME_STORAGE_KEY, 'true')
    }
    applyHtmlClass()
  }

  function toggleTheme() {
    isDark.value = !isDark.value
    if (import.meta.client) {
      localStorage.setItem(THEME_STORAGE_KEY, String(isDark.value))
      applyHtmlClass()
    }
  }

  function setDark(val: boolean) {
    isDark.value = val
    if (import.meta.client) {
      localStorage.setItem(THEME_STORAGE_KEY, String(val))
      applyHtmlClass()
    }
  }

  function applyHtmlClass() {
    if (!import.meta.client) return
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return {
    isDark,
    initTheme,
    toggleTheme,
    setDark
  }
}
