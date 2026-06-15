<template>
  <DashboardLayout>
    <div class="header">
      <h1>Dashboard</h1>
      <p>Resumen clínico del paciente</p>
    </div>

    <div class="stats">
      <div class="card">📅 <b>3</b> Citas</div>
      <div class="card">💪 <b>12</b> Sesiones</div>
      <div class="card">📄 <b>5</b> Diagnósticos</div>
      <div class="card">💡 <b>4</b> Recomendaciones</div>
    </div>

    <div class="grid">
      <div class="card big">
        <h3>Próxima cita</h3>
        <p>20 Junio 2026 - 10:00 AM</p>
      </div>

      <div class="card">
        <h3>Actividad reciente</h3>
        <ul>
          <li>✔ Sesión lumbar</li>
          <li>✔ Evaluación inicial</li>
          <li>✔ Nueva recomendación</li>
        </ul>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
</script>

<style scoped>
.header h1 {
  margin: 0;
}

.header p {
  color: #64748b;
}

.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin: 20px 0;
}

.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 15px;
}

.card {
  background: white;
  padding: 18px;
  border-radius: 14px;
  border: 1px solid #e2e8f0;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-3px);
}

.big {
  font-size: 16px;
}

/* TABLET */
@media (max-width: 1024px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }

  .grid {
    grid-template-columns: 1fr;
  }
}

/* MOBILE */
@media (max-width: 768px) {
  .stats {
    grid-template-columns: 1fr;
  }
}
</style>
