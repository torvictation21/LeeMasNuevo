<script setup lang="ts">
const { profile } = useGamification()
</script>

<template>
  <main class="app-shell desktop-page">
    <AppHeader />

    <div class="content store-page">
      <section class="store-hero glass-panel">
        <div class="store-badge">🛍️ TIENDA LEEMÁS · PRÓXIMAMENTE</div>
        <h1 class="store-title">Canjea tus Hojas Mágicas</h1>
        <p class="store-subtitle">
          Acumula hojas leyendo cada día y muy pronto podrás desbloquear protectores de racha, avatares legendarios y temas visuales exclusivos.
        </p>

        <div class="store-balance-card">
          <span class="balance-icon">🍃</span>
          <div>
            <strong class="balance-amount">{{ profile.leaves }} Hojas</strong>
            <p class="balance-label">Tu saldo acumulado actual</p>
          </div>
        </div>
      </section>

      <!-- Vista previa de artículos que estarán disponibles -->
      <section class="store-preview-section">
        <h2 class="section-title">Próximos artículos en catálogo</h2>
        <div class="store-items-grid">
          <article class="store-item-card glass-panel">
            <div class="item-icon-wrapper">🛡️</div>
            <div class="item-info">
              <h3>Protector de Racha</h3>
              <p>Evita perder tu racha si un día no alcanzas a completar tu lectura diaria.</p>
              <div class="item-price">
                <span class="leaf-coin">🍃</span> 50 Hojas
              </div>
            </div>
            <button class="store-item-btn" disabled>Próximamente</button>
          </article>

          <article class="store-item-card glass-panel">
            <div class="item-icon-wrapper">🦉</div>
            <div class="item-info">
              <h3>Avatar Búho Erudito</h3>
              <p>Muestra tu sabiduría lectora en tu perfil con este avatar animado.</p>
              <div class="item-price">
                <span class="leaf-coin">🍃</span> 120 Hojas
              </div>
            </div>
            <button class="store-item-btn" disabled>Próximamente</button>
          </article>

          <article class="store-item-card glass-panel">
            <div class="item-icon-wrapper">✨</div>
            <div class="item-info">
              <h3>Tema Aurora Borealis</h3>
              <p>Paleta de colores boreal brillante para la interfaz de lectura nocturna.</p>
              <div class="item-price">
                <span class="leaf-coin">🍃</span> 80 Hojas
              </div>
            </div>
            <button class="store-item-btn" disabled>Próximamente</button>
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

.store-item-btn {
  padding: 10px 18px;
  border-radius: 99px;
  border: 0;
  background: #f1f5f9;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 700;
  cursor: not-allowed;
  margin-top: auto;
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
