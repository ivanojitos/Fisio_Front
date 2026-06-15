<template>
  <DashboardLayout>
    <div class="history">
      <!-- HEADER -->
      <div class="header">
        <h1>Historial Clínico</h1>
        <p>Revisa tu evolución y sesiones de fisioterapia</p>
      </div>

      <div class="container">
        <!-- TIMELINE -->
        <div class="timeline">
          <div v-for="item in history" :key="item.id" class="card">
            <div class="top">
              <div class="date">📅 {{ item.date }}</div>

              <span class="tag">{{ item.type }}</span>
            </div>

            <h3>{{ item.title }}</h3>

            <p class="diagnosis">🩺 {{ item.diagnosis }}</p>

            <p class="notes">
              {{ item.notes }}
            </p>

            <div class="footer">
              <span>💊 {{ item.treatment }}</span>
              <span>📈 {{ item.progress }}</span>
            </div>
          </div>
        </div>

        <!-- RESUMEN -->
        <div class="summary">
          <h2>Resumen clínico</h2>

          <div class="box">
            <p>Sesiones totales</p>
            <h3>12</h3>
          </div>

          <div class="box">
            <p>Mejora estimada</p>
            <h3>78%</h3>
          </div>

          <div class="box">
            <p>Diagnóstico actual</p>
            <h3>Dolor lumbar</h3>
          </div>

          <div class="box highlight">
            <p>Recomendación</p>
            <h3>Continuar terapia 2 semanas más</h3>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const history = [
  {
    id: 1,
    date: '2026-06-10',
    type: 'Evaluación',
    title: 'Primera consulta',
    diagnosis: 'Dolor lumbar moderado',
    notes: 'Paciente refiere dolor al estar sentado mucho tiempo.',
    treatment: 'Ejercicios de movilidad',
    progress: 'Inicio tratamiento',
  },
  {
    id: 2,
    date: '2026-06-12',
    type: 'Terapia',
    title: 'Sesión de rehabilitación',
    diagnosis: 'Tensión muscular lumbar',
    notes: 'Mejoría ligera en movilidad.',
    treatment: 'Terapia manual',
    progress: '+15%',
  },
  {
    id: 3,
    date: '2026-06-15',
    type: 'Seguimiento',
    title: 'Control clínico',
    diagnosis: 'Reducción de dolor',
    notes: 'Paciente reporta menos dolor al caminar.',
    treatment: 'Ejercicios guiados',
    progress: '+35%',
  },
]
</script>

<style scoped>
.history {
  padding: 25px;
  background: white;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* HEADER */
.header h1 {
  margin: 0;
}

.header p {
  color: #64748b;
}

/* LAYOUT */
.container {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

/* TIMELINE */
.timeline {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

/* CARD */
.card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 18px;
  transition: 0.2s;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
}

/* TOP */
.top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date {
  font-size: 12px;
  color: #64748b;
}

.tag {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0284c7;
}

/* TEXT */
h3 {
  margin: 10px 0 5px;
}

.diagnosis {
  color: #0ea5e9;
  font-weight: 500;
}

.notes {
  font-size: 14px;
  color: #475569;
  margin: 10px 0;
}

/* FOOTER */
.footer {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #64748b;
}

/* SUMMARY */
.summary {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  height: fit-content;
}

.summary h2 {
  margin-bottom: 15px;
}

.box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  margin-bottom: 10px;
}

.box h3 {
  margin: 5px 0 0;
}

.highlight {
  background: linear-gradient(135deg, #0ea5e9, #14b8a6);
  color: white;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }
}
</style>
