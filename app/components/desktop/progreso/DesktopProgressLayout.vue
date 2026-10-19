<script setup lang="ts">
import ProgressHero from '~/components/progreso/ProgressHero.vue'
import ProgressJourney from '~/components/progreso/ProgressJourney.vue'
import ProgressAchievements from '~/components/progreso/ProgressAchievements.vue'
import CurrentReading from '~/components/progreso/CurrentReading.vue'
</script>

<template>
  <div class="content desktop-progress">
    <ProgressHero />
    <div class="profile-modules">
      <ProgressJourney />
      <ProgressAchievements />
    </div>
    <CurrentReading />
  </div>
</template>
