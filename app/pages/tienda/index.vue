<script setup lang="ts">
import type { ShopItem } from '~/types/leemas'

const shopStore = useShopStore()
const userStore = useUserStore()

const purchaseFeedback = ref<{ success: boolean; message: string } | null>(null)

onMounted(async () => {
  await Promise.all([
    shopStore.fetchCatalog(),
    userStore.loadProfile()
  ])
})

async function handlePurchase(item: ShopItem) {
  const result = await shopStore.buyItem(item)
  purchaseFeedback.value = result
  setTimeout(() => {
    purchaseFeedback.value = null
  }, 4000)
}
</script>

<template>
  <main class="app-shell desktop-page">
    <AppHeader />

    <div class="content store-page">
      <section class="store-hero glass-panel">
        <div class="store-badge">🛍️ TIENDA LEEMÁS · CANJES DISPONIBLES</div>
        <h1 class="store-title">Canjea tus Hojas Mágicas</h1>
        <p class="store-subtitle">
          Acumula hojas leyendo cada día y desbloquea protectores de racha, avatares legendarios y temas visuales exclusivos para tu experiencia lectora.
        </p>

        <div class="store-balance-card">
          <span class="balance-icon">🍃</span>
          <div>
            <strong class="balance-amount">{{ userStore.profile.value.leaves }} Hojas</strong>
            <p class="balance-label">Tu saldo acumulado actual</p>
          </div>
        </div>

        <!-- Mensaje de feedback de compra -->
        <transition name="fade">
          <div 
            v-if="purchaseFeedback" 
            class="purchase-alert" 
            :class="{ success: purchaseFeedback.success, error: !purchaseFeedback.success }"
          >
            {{ purchaseFeedback.success ? '🎉 ' : '⚠️ ' }}{{ purchaseFeedback.message }}
          </div>
        </transition>
      </section>

      <!-- Catálogo de Artículos de la Store -->
      <section class="store-preview-section">
        <h2 class="section-title">Artículos en catálogo (Servidor)</h2>
        
        <div v-if="shopStore.isLoading.value && shopStore.items.value.length === 0" class="store-loading">
          <p>Cargando catálogo de artículos mágicos...</p>
        </div>

        <div v-else class="store-items-grid">
          <article 
            v-for="item in shopStore.items.value" 
            :key="item.id" 
            class="store-item-card glass-panel"
            :class="{ 'item-owned': shopStore.isItemPurchased(item.id) }"
          >
            <div class="item-header-row">
              <div class="item-icon-wrapper">{{ item.icon }}</div>
              <span v-if="item.badgeText" class="item-category-badge">{{ item.badgeText }}</span>
            </div>

            <div class="item-info">
              <h3>{{ item.name }}</h3>
              <p>{{ item.description }}</p>
              <div class="item-price">
                <span class="leaf-coin">🍃</span> {{ item.price }} Hojas
              </div>
            </div>

            <button 
              v-if="shopStore.isItemPurchased(item.id)" 
              class="store-item-btn btn-owned" 
              disabled
            >
              ✓ Adquirido
            </button>
            <button 
              v-else 
              class="store-item-btn btn-buy" 
              :disabled="userStore.profile.value.leaves < item.price || shopStore.isPurchasing.value"
              @click="handlePurchase(item)"
            >
              {{ userStore.profile.value.leaves >= item.price ? `Canjear por ${item.price} Hojas` : 'Hojas insuficientes' }}
            </button>
          </article>
        </div>
      </section>

      <div class="store-back-row">
        <NuxtLink to="/inicio" class="back-home-btn">
          ← Volver al Inicio
        </NuxtLink>
      </div>
    </div>
  </main>
</template>

<style scoped>
.store-page {
  display: flex;
  flex-direction: column;
  gap: 32px;
  padding-bottom: 60px;
}

.store-hero {
  text-align: center;
  padding: 48px 24px;
  border-radius: 32px;
  background: 
    radial-gradient(circle at 10% 20%, rgba(254, 240, 138, 0.3) 0%, transparent 40%),
    radial-gradient(circle at 90% 80%, rgba(167, 243, 208, 0.35) 0%, transparent 40%),
    linear-gradient(135deg, #fefce8 0%, #f0fdf4 50%, #ecfdf5 100%);
  border: 2px solid #bbf7d0;
  box-shadow: 0 16px 40px -10px rgba(16, 185, 129, 0.15);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.store-badge {
  display: inline-flex;
  padding: 6px 16px;
  border-radius: 99px;
  background: #dcfce7;
  color: #15803d;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  margin-bottom: 16px;
  border: 1px solid #86efac;
}

.store-title {
  font-family: "Fredoka", sans-serif;
  font-size: clamp(28px, 4vw, 42px);
  color: #064e3b;
  margin: 0 0 12px;
}

.store-subtitle {
  max-width: 580px;
  font-size: 16px;
  color: #374151;
  line-height: 1.6;
  margin: 0 0 24px;
}

.store-balance-card {
  display: inline-flex;
  align-items: center;
  gap: 16px;
  padding: 12px 28px;
  border-radius: 20px;
  background: #ffffff;
  border: 2px solid #86efac;
  box-shadow: 0 8px 24px rgba(16, 185, 129, 0.12);
  text-align: left;
}

.balance-icon {
  font-size: 36px;
}

.balance-amount {
  font-size: 22px;
  font-weight: 800;
  color: #047857;
  display: block;
}

.balance-label {
  font-size: 12px;
  color: #6b7280;
  margin: 0;
}

.section-title {
  font-family: "Fredoka", sans-serif;
  font-size: 22px;
  color: #1e1b4b;
  margin-bottom: 18px;
}

.store-items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 20px;
}

.store-item-card {
  padding: 24px;
  border-radius: 24px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  gap: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s, box-shadow 0.2s;
}

.store-item-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.08);
}

.item-icon-wrapper {
  width: 56px;
  height: 56px;
  border-radius: 18px;
  background: #f0fdf4;
  border: 1.5px solid #bbf7d0;
  display: grid;
  place-items: center;
  font-size: 28px;
}

.item-info h3 {
  font-size: 18px;
  margin: 0 0 6px;
  color: #0f172a;
}

.item-info p {
  font-size: 13px;
  color: #64748b;
  line-height: 1.5;
  margin: 0 0 12px;
}

.item-price {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-weight: 800;
  color: #047857;
  font-size: 14px;
}

.purchase-alert {
  margin-top: 20px;
  padding: 12px 24px;
  border-radius: 99px;
  font-weight: 700;
  font-size: 14px;
  animation: slideDown 0.3s ease-out;
}
.purchase-alert.success {
  background: #dcfce7;
  color: #15803d;
  border: 1px solid #86efac;
}
.purchase-alert.error {
  background: #fee2e2;
  color: #b91c1c;
  border: 1px solid #fca5a5;
}

.item-header-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.item-category-badge {
  font-size: 11px;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: 99px;
  background: #fef08a;
  color: #854d0e;
  text-transform: uppercase;
}

.item-owned {
  border-color: #86efac !important;
  background: #f0fdf4 !important;
}

.store-loading {
  text-align: center;
  padding: 40px;
  color: #64748b;
  font-size: 16px;
}

.store-item-btn {
  padding: 12px 18px;
  border-radius: 99px;
  border: 0;
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;
  margin-top: auto;
  transition: all 0.2s;
}

.btn-buy {
  background: #10b981;
  color: #ffffff;
}
.btn-buy:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}
.btn-buy:disabled {
  background: #e2e8f0;
  color: #94a3b8;
  cursor: not-allowed;
}

.btn-owned {
  background: #dcfce7;
  color: #166534;
  cursor: default;
  border: 1px solid #bbf7d0;
}

.store-back-row {
  display: flex;
  justify-content: center;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 24px;
  border-radius: 99px;
  background: #ede9fe;
  color: #6d28d9;
  font-weight: 700;
  text-decoration: none;
  border: 1.5px solid #ddd6fe;
  transition: all 0.2s;
}

.back-home-btn:hover {
  background: #ddd6fe;
  transform: translateY(-2px);
}

/* Modo Oscuro para Tienda */
:global(.dark-mode) .store-hero {
  background: 
    radial-gradient(circle at 10% 20%, rgba(16, 185, 129, 0.2) 0%, transparent 45%),
    radial-gradient(circle at 90% 80%, rgba(202, 138, 4, 0.15) 0%, transparent 45%),
    linear-gradient(135deg, #09211c 0%, #0d2d24 50%, #09201f 100%);
  border-color: #065f46;
  box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
}

:global(.dark-mode) .store-title {
  color: #6ee7b7;
}

:global(.dark-mode) .store-subtitle {
  color: #cbd5e1;
}

:global(.dark-mode) .store-balance-card {
  background: #064e3b;
  border-color: #10b981;
}

:global(.dark-mode) .balance-amount {
  color: #a7f3d0;
}

:global(.dark-mode) .balance-label {
  color: #6ee7b7;
}

:global(.dark-mode) .section-title {
  color: #f8fafc;
}

:global(.dark-mode) .store-item-card {
  background: #131d33;
  border-color: #273756;
}

:global(.dark-mode) .store-item-card:hover {
  border-color: #3b82f677;
}

:global(.dark-mode) .item-icon-wrapper {
  background: #064e3b;
  border-color: #047857;
}

:global(.dark-mode) .item-info h3 {
  color: #f8fafc;
}

:global(.dark-mode) .item-info p {
  color: #94a3b8;
}

:global(.dark-mode) .item-price {
  color: #34d399;
}

:global(.dark-mode) .store-item-btn {
  background: #1e293b;
  color: #64748b;
}

:global(.dark-mode) .back-home-btn {
  background: #2e1065;
  color: #d8b4fe;
  border-color: #6d28d9;
}

:global(.dark-mode) .back-home-btn:hover {
  background: #3b0764;
}
</style>
