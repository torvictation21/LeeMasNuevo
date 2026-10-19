<script setup lang="ts">
definePageMeta({ layout: false })
const { signIn } = useLeeSession()
const { profile } = useGamification()
const name = ref(profile.value.name || '')

function enter() { 
  if (name.value.trim()) {
    profile.value.name = name.value.trim()
  }
  signIn()
  navigateTo('/inicio') 
}
</script>
<template><main class="login-page"><section class="login-visual"><div class="login-orbit orbit-one"></div><div class="login-orbit orbit-two"></div><div class="login-book">Lee<span>+</span></div><div class="login-stars">✦ ✧ ✦</div><p>Tu próxima historia comienza aquí.</p></section><section class="login-panel"><div class="login-form"><span class="brand-mark">Lee<span>+</span></span><p class="eyebrow">BIENVENIDA</p><h1>Vuelve a disfrutar<br>de <em>leer.</em></h1><p>Guarda tu progreso, descubre historias y haz de la lectura un hábito.</p><label>Tu nombre<input v-model="name" placeholder="¿Cómo te llamas?" @keyup.enter="enter"></label><button class="login-button" type="button" @click="enter">Entrar a Lee+ <span>→</span></button><small>Al continuar, tu sesión se mantiene mientras esta pestaña esté abierta.</small></div></section></main></template>
