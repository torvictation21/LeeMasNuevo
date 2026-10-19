export function useLeeSession() {
  const authenticated = useState<boolean>('leemas-authenticated', () => false)
  function restore() { if (import.meta.client) authenticated.value = sessionStorage.getItem('leemas-session') === 'active' }
  function signIn() { authenticated.value = true; sessionStorage.setItem('leemas-session', 'active') }
  function signOut() { authenticated.value = false; sessionStorage.removeItem('leemas-session') }
  return { authenticated, restore, signIn, signOut }
}
