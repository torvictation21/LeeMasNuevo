<script setup lang="ts">
import type { Badge } from '~/types/leemas'

const { profile } = useGamification()

const selectedFilter = ref<'all' | 'unlocked' | 'locked'>('all')
const activeBadgeModal = ref<Badge | null>(null)

const filteredBadges = computed(() => {
  if (selectedFilter.value === 'unlocked') {
    return profile.value.badges.filter(b => b.unlocked)
  }
  if (selectedFilter.value === 'locked') {
    return profile.value.badges.filter(b => !b.unlocked)
  }
  return profile.value.badges
})

const unlockedCount = computed(() => profile.value.badges.filter(b => b.unlocked).length)
const totalCount = computed(() => profile.value.badges.length)
</script>

<template>
  <section class="achievement-panel glass-panel" aria-label="Vitrina de medallas">
    <div class="panel-heading">
      <div>
        <p class="eyebrow">VITRINA DE LOGROS</p>
        <h2>Medallas e Insignias</h2>
      </div>
      <span class="reward-counter">{{ unlockedCount }} de {{ totalCount }} desbloqueadas</span>
    </div>

    <!-- Filtros de Medallas -->
    <div class="badges-filter-bar">
      <button 
        type="button" 
        class="filter-chip"
        :class="{ active: selectedFilter === 'all' }"
        @click="selectedFilter = 'all'"
      >
        Todas
      </button>
      <button 
        type="button" 
        class="filter-chip"
        :class="{ active: selectedFilter === 'unlocked' }"
        @click="selectedFilter = 'unlocked'"
      >
        Obtenidas ({{ unlockedCount }})
      </button>
      <button 
        type="button" 
        class="filter-chip"
        :class="{ active: selectedFilter === 'locked' }"
        @click="selectedFilter = 'locked'"
      >
        Por desbloquear
      </button>
    </div>

    <!-- Grid de Medallas -->
    <div class="medals-showcase-grid">
      <article 
        v-for="badge in filteredBadges" 
        :key="badge.id"
        class="medal-badge-card"
        :class="{ unlocked: badge.unlocked, locked: !badge.unlocked }"
        @click="activeBadgeModal = badge"
      >
        <div class="medal-icon-circle">
          <span>{{ badge.icon }}</span>
          <span v-if="badge.unlocked" class="check-dot">✓</span>
        </div>
        <strong>{{ badge.title }}</strong>
        <small v-if="badge.unlocked">Desbloqueada</small>
        <small v-else-if="badge.progress !== undefined">{{ badge.progress }}/{{ badge.maxProgress }}</small>
        <small v-else>Bloqueada</small>
      </article>
    </div>

    <!-- Modal Detalle de Medalla -->
    <div v-if="activeBadgeModal" class="badge-modal-backdrop" @click="activeBadgeModal = null">
      <div class="badge-modal glass-panel" @click.stop>
        <div class="modal-badge-icon" :class="{ 'gold-glow': activeBadgeModal.unlocked }">
          {{ activeBadgeModal.icon }}
        </div>
        <span class="badge-status-tag" :class="activeBadgeModal.unlocked ? 'tag-unlocked' : 'tag-locked'">
          {{ activeBadgeModal.unlocked ? '✓ Desbloqueada' : '🔒 Por desbloquear' }}
        </span>
        <h3>{{ activeBadgeModal.title }}</h3>
        <p class="modal-badge-desc">{{ activeBadgeModal.description }}</p>

        <div v-if="activeBadgeModal.unlockedAt" class="modal-date-note">
          Obtenida el {{ activeBadgeModal.unlockedAt }}
        </div>

        <button class="modal-close-btn" type="button" @click="activeBadgeModal = null">
          Cerrar
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.reward-counter {
  font-size: 13px;
  font-weight: 700;
  color: #7357ed;
  background: #ede9fe;
  padding: 4px 10px;
  border-radius: 99px;
}

.badges-filter-bar {
  display: flex;
  gap: 8px;
  margin: 16px 0 18px;
}

.filter-chip {
  background: transparent;
  border: 1px solid #dbe2ef;
  padding: 6px 14px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}
.filter-chip.active {
  background: #7357ed;
  color: #fff;
  border-color: #7357ed;
}

.medals-showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(95px, 1fr));
  gap: 12px;
}

.medal-badge-card {
  padding: 14px 8px;
  border-radius: 16px;
  background: #fffffffa;
  border: 1px solid #e2e8f0;
  text-align: center;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.medal-badge-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px #102a5610;
}

.medal-badge-card.unlocked {
  border-color: #fde68a;
  background: linear-gradient(135deg, #ffffff, #fffdf0);
}
.medal-badge-card.locked {
  opacity: 0.6;
  filter: grayscale(0.5);
}

.medal-icon-circle {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #f1f5f9;
  display: grid;
  place-items: center;
  font-size: 22px;
  margin-bottom: 8px;
  position: relative;
}
.medal-badge-card.unlocked .medal-icon-circle {
  background: #fef3c7;
}

.check-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 16px;
  height: 16px;
  background: #22c55e;
  color: #fff;
  font-size: 10px;
  font-weight: 900;
  border-radius: 50%;
  display: grid;
  place-items: center;
  border: 2px solid #fff;
}

.medal-badge-card strong {
  font-size: 11px;
  color: #102a56;
  display: block;
  line-height: 1.2;
  margin-bottom: 4px;
}

.medal-badge-card small {
  font-size: 10px;
  color: #64748b;
}

/* Modal */
.badge-modal-backdrop {
  position: fixed;
  inset: 0;
  background: #00000045;
  backdrop-filter: blur(4px);
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 20px;
}

.badge-modal {
  max-width: 360px;
  width: 100%;
  padding: 30px;
  border-radius: 24px;
  background: #ffffff;
  text-align: center;
}

.modal-badge-icon {
  font-size: 56px;
  margin-bottom: 12px;
}
.gold-glow {
  filter: drop-shadow(0 0 16px #f59e0b88);
}

.badge-status-tag {
  display: inline-block;
  font-size: 11px;
  font-weight: 700;
  padding: 4px 10px;
  border-radius: 99px;
  margin-bottom: 10px;
}
.tag-unlocked {
  background: #dcfce7;
  color: #16a34a;
}
.tag-locked {
  background: #f1f5f9;
  color: #64748b;
}

.badge-modal h3 {
  font-family: "Fredoka", sans-serif;
  font-size: 22px;
  margin: 0 0 8px;
  color: #102a56;
}

.modal-badge-desc {
  font-size: 14px;
  color: #475569;
  line-height: 1.5;
  margin: 0 0 16px;
}

.modal-date-note {
  font-size: 12px;
  color: #059669;
  font-weight: 600;
  margin-bottom: 20px;
}

.modal-close-btn {
  width: 100%;
  padding: 12px;
  border-radius: 99px;
  background: #7357ed;
  color: #fff;
  border: 0;
  font-weight: 700;
  cursor: pointer;
}
</style>
