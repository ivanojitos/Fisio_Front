<template>
  <DashboardLayout>
    <div class="record">
      <!-- TOP SUMMARY -->
      <div class="summary card">
        <div class="summary-header">
          <button class="edit-btn" @click="isEditing = !isEditing">
            {{ isEditing ? 'Guardar' : 'Editar' }}
          </button>
        </div>
        <div class="patient">
          <div class="avatar">
            <span>{{ form.name?.charAt(0) }}</span>
          </div>

          <div>
            <div v-if="!isEditing">
              <h2>{{ form.name }}</h2>
              <p>{{ form.condition }}</p>
            </div>

            <div v-else class="edit-form">
              <input v-model="form.name" />
              <input v-model="form.condition" />
            </div>

            <div class="chips">
              <span class="chip">{{ form.age }} años</span>
              <span class="chip green">Seguimiento activo</span>
            </div>
          </div>
        </div>
      </div>

      <!-- GRID -->
      <div class="grid">
        <!-- LEFT -->
        <div class="left">
          <!-- TIMELINE -->
          <div class="card">
            <h3>📅 Historial clínico</h3>

            <div class="timeline">
              <div class="event" v-for="(item, i) in historial" :key="i">
                <div class="dot"></div>
                <div>
                  <p class="title">{{ item.title }}</p>
                  <p class="desc">{{ item.desc }}</p>
                  <span class="date">{{ item.date }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- DIAGNOSTICOS -->
          <div class="card">
            <h3>🧠 Diagnósticos</h3>

            <ul>
              <li v-for="(d, i) in diagnosticos" :key="i">
                {{ d }}
              </li>
            </ul>
          </div>
        </div>

        <!-- RIGHT -->
        <div class="right">
          <!-- 🟦 PRÓXIMA CITA (DINÁMICA) -->
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

          <!-- EVOLUCION -->
          <div class="card">
            <h3>📈 Evolución</h3>

            <div class="progress">
              <div class="bar" style="width: 70%"></div>
            </div>

            <p class="muted">Mejora general: 70%</p>
          </div>

          <!-- NOTAS -->
          <div class="card">
            <h3>📝 Notas médicas</h3>

            <p class="note">
              Paciente presenta mejoría en movilidad lumbar. Continuar terapia 2 veces por semana.
            </p>
          </div>

          <!-- ARCHIVOS -->
          <div class="card">
            <h3>📁 Archivos médicos</h3>

            <div class="files">
              <div class="file">📄 RX_Lumbar.pdf</div>
              <div class="file">📄 Evaluación_2026.pdf</div>
              <div class="file">📄 Progreso.docx</div>
            </div>
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

const isEditing = ref(false)

const loading = ref(true)

const data = ref({
  proximaCita: '',
})

const form = {
  name: 'Ivan Alvarez',
  age: 28,
  condition: 'Dolor lumbar / lesión de rodilla',
}

const getExpediente = async () => {
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

onMounted(getExpediente)

const historial = [
  { title: 'Evaluación inicial', desc: 'Dolor lumbar moderado', date: '10 Jun 2026' },
  { title: 'Inicio tratamiento', desc: 'Terapia física 2 veces/semana', date: '12 Jun 2026' },
  { title: 'Revisión', desc: 'Mejora en movilidad', date: '16 Jun 2026' },
]

const diagnosticos = [
  'Lumbalgia mecánica',
  'Inflamación leve en rodilla derecha',
  'Tensión muscular lumbar',
]
</script>

<style scoped>
.edit-form input {
  display: block;
  width: 100%;
  margin-top: 6px;
  padding: 8px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}
.summary-header {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
}

.edit-btn {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 12px;
}

.edit-btn:hover {
  background: #0284c7;
}
.highlight {
  border-left: 4px solid #3b82f6;
  background: linear-gradient(180deg, #ffffff, #f8fafc);
}

.appointment .date {
  font-size: 18px;
  font-weight: 600;
  color: #0f172a;
}

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
/* BASE */
.record {
  padding: 40px;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header h1 {
  margin: 0;
  font-size: 28px;
}

.header p {
  color: #6b7280;
}

.status {
  background: #ecfdf5;
  color: #059669;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
}

/* CARD */
.card {
  background: #fff;
  border: 1px solid #e5e7eb;
  border-radius: 16px;
  padding: 20px;
}

/* SUMMARY */
.patient {
  display: flex;
  gap: 16px;
  align-items: center;
}

.avatar {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background: #f3f4f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: bold;
}

/* CHIPS */
.chips {
  display: flex;
  gap: 8px;
  margin-top: 6px;
}

.chip {
  font-size: 12px;
  padding: 4px 10px;
  border-radius: 999px;
  background: #f3f4f6;
}

.chip.green {
  background: #ecfdf5;
  color: #059669;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 16px;
}

/* TIMELINE */
.timeline {
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.event {
  display: flex;
  gap: 10px;
}

.dot {
  width: 10px;
  height: 10px;
  background: #3b82f6;
  border-radius: 50%;
  margin-top: 6px;
}

.title {
  font-weight: 600;
}

.desc {
  color: #6b7280;
  font-size: 13px;
}

.date {
  font-size: 11px;
  color: #9ca3af;
}

/* PROGRESS */
.progress {
  height: 10px;
  background: #f3f4f6;
  border-radius: 999px;
  overflow: hidden;
}

.bar {
  height: 100%;
  background: #3b82f6;
}

/* NOTE */
.note {
  color: #374151;
  line-height: 1.5;
}

/* FILES */
.files {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file {
  background: #f9fafb;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
}
</style>
