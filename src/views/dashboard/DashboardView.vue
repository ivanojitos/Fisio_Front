<template>
  <DashboardLayout>
    <div class="dashboard">
      <!-- HEADER -->
      <div class="header">
        <div>
          <h1>Dashboard Médico</h1>
          <p>Resumen clínico del paciente en tiempo real</p>
        </div>

        <div class="badge">Paciente activo</div>
      </div>

      <!-- LOADING -->
      <div v-if="loading" class="loading">Cargando información clínica...</div>

      <!-- CONTENT -->
      <div v-else class="content">
        <!-- KPI ROW -->
        <div class="kpi-grid">
          <div class="kpi card">
            <div class="kpi-icon blue">📅</div>
            <div>
              <span class="label">Citas</span>
              <h2>{{ data.citas }}</h2>
            </div>
          </div>

          <div class="kpi card">
            <div class="kpi-icon green">💪</div>
            <div>
              <span class="label">Sesiones</span>
              <h2>{{ data.sesiones }}</h2>
            </div>
          </div>

          <div class="kpi card">
            <div class="kpi-icon purple">📄</div>
            <div>
              <span class="label">Diagnósticos</span>
              <h2>{{ data.diagnosticos }}</h2>
            </div>
          </div>

          <div class="kpi card">
            <div class="kpi-icon orange">💡</div>
            <div>
              <span class="label">Recomendaciones</span>
              <h2>{{ data.recomendaciones }}</h2>
            </div>
          </div>
        </div>
        <br />
        <!-- MAIN GRID -->
        <div class="main-grid">
          <!-- NEXT APPOINTMENT -->
          <div class="card highlight">
            <div class="card-header">
              <h3>Próxima cita</h3>
              <span class="chip">Programada</span>
            </div>

            <div class="appointment">
              <div class="date">
                {{ formatearFecha(data.proximaCita) }}
              </div>
              <p>Consulta médica general</p>
            </div>

            <div class="status-row">
              <span class="status green">Confirmada</span>
              <span class="status gray">Sin incidencias</span>
            </div>
          </div>

          <!-- ACTIVITY -->
          <div class="card">
            <div class="card-header">
              <h3>Actividad clínica</h3>
              <span class="chip gray">Últimos registros</span>
            </div>

            <ul>
              <li v-for="(item, i) in data.actividad" :key="i">
                <span class="dot"></span>
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import API from '@/config/api'

const loading = ref(true)

const data = ref({
  citas: 0,
  sesiones: 0,
  diagnosticos: 0,
  recomendaciones: 0,
  proximaCita: '',
  actividad: [],
})

const getDashboard = async () => {
  try {
    const usuario = JSON.parse(localStorage.getItem('user'))

    const res = await fetch(`${API}/api/dashboard/${usuario.Id}`)
    const json = await res.json()

    data.value = json
  } catch (err) {
    console.error(err)
  } finally {
    loading.value = false
  }
}

const formatearFecha = (fecha) => {
  if (!fecha) return 'Sin citas'

  return new Date(fecha).toLocaleString('es-MX', {
    timeZone: 'America/Mexico_City',
    dateStyle: 'full',
    timeStyle: 'short',
  })
}

onMounted(getDashboard)
</script>

<style scoped>
/* BASE */
.dashboard {
  padding: 30px;
  background: #ffffff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 22px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 30px;
  font-weight: 700;
}

.header p {
  margin: 4px 0 0;
  color: #6b7280;
}

.badge {
  background: #ecfdf5;
  color: #059669;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 600;
}

/* LOADING */
.loading {
  color: #6b7280;
  padding: 20px;
}

/* KPI GRID */
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.kpi {
  display: flex;
  align-items: center;
  gap: 14px;
}

.kpi h2 {
  margin: 0;
  font-size: 24px;
}

.label {
  font-size: 12px;
  color: #6b7280;
}

.kpi-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

/* ICON COLORS */
.blue {
  background: #eff6ff;
}
.green {
  background: #ecfdf5;
}
.purple {
  background: #f5f3ff;
}
.orange {
  background: #fff7ed;
}

/* MAIN GRID */
.main-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

/* CARD */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 18px;
  transition: 0.2s;
}

.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  transform: translateY(-2px);
}

/* HEADER CARD */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

/* CHIP */
.chip {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #e0f2fe;
  color: #0369a1;
}

.chip.gray {
  background: #f3f4f6;
  color: #6b7280;
}

/* APPOINTMENT */
.appointment .date {
  font-size: 18px;
  font-weight: 600;
}

.appointment p {
  color: #6b7280;
  margin-top: 4px;
}

/* STATUS */
.status-row {
  display: flex;
  gap: 10px;
  margin-top: 12px;
}

.status {
  font-size: 11px;
  padding: 4px 10px;
  border-radius: 999px;
}

.status.green {
  background: #ecfdf5;
  color: #059669;
}

.status.gray {
  background: #f3f4f6;
  color: #6b7280;
}

/* ACTIVITY */
ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

li {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  color: #374151;
}

.dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
}

/* RESPONSIVE */
@media (max-width: 1024px) {
  .kpi-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .main-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 640px) {
  .dashboard {
    padding: 16px;
  }

  .kpi-grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
