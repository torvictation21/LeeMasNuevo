export default defineNuxtRouteMiddleware((to) => {
  if (import.meta.server || to.path === '/') return
  if (sessionStorage.getItem('leemas-session') !== 'active') return navigateTo('/')
})
