<template>
  <DashboardLayout>
    <div class="content">
      <!-- HEADER -->
      <header class="header">
        <div>
          <h1>Dashboard de Fisioterapia</h1>
          <p>Gestión inteligente de citas y pacientes</p>
        </div>
        <button
          class="btn-icon"
          @click="
            async () => {
              await fetchPacientes()
              openCreate = true
            }
          "
        >
          ➕
        </button>
      </header>
      <br />

      <!-- STATS -->
      <section class="stats">
        <div class="card">
          <span class="number">{{ citas.length }}</span>
          <span class="label">Total citas</span>
        </div>

        <div class="card">
          <span class="number">{{ citasDelDia.length }}</span>
          <span class="label">Hoy</span>
        </div>

        <div class="card">
          <span class="number">2</span>
          <span class="label">Confirmadas</span>
        </div>
      </section>
      <br />
      <!-- CONTENT -->
      <section class="grid">
        <!-- CALENDAR -->
        <div class="card calendar">
          <div class="calendar-header">
            <button class="nav-btn" @click="prevDay">‹</button>

            <div class="date">
              <h2>{{ selectedDateLabel }}</h2>
              <p>Agenda del día</p>
            </div>

            <button class="nav-btn" @click="nextDay">›</button>
          </div>

          <div class="list">
            <div class="item" v-for="cita in citasDelDia" :key="cita.id">
              <div class="time">
                {{ cita.hora }}
              </div>

              <div class="info">
                <strong>{{ cita.paciente_nombre || 'Paciente #' + cita.paciente_id }}</strong>
                <p>{{ cita.tipo }}</p>
              </div>

              <span class="badge" :class="cita.estatus">
                {{ cita.estatus }}
              </span>
            </div>

            <div v-if="citasDelDia.length === 0" class="empty">No hay citas programadas</div>
          </div>
        </div>

        <!-- DETAIL -->
        <div class="card detail">
          <h2>Detalle de cita</h2>

          <div v-if="selectedCita" class="detail-box">
            <h3>{{ selectedCita.paciente_nombre || 'Paciente #' + selectedCita.paciente_id }}</h3>

            <div class="row">
              <span>Hora</span>
              <b>{{ selectedCita.hora }}</b>
            </div>

            <div class="row">
              <span>Tipo</span>
              <b>{{ selectedCita.tipo }}</b>
            </div>
            <div class="notes">
              {{ selectedCita.notas || 'Sin notas' }}
            </div>
          </div>

          <div v-else class="empty-detail">Selecciona una cita</div>
        </div>
      </section>

      <!-- modal -->
      <div v-if="openCreate" class="modal-overlay" @click.self="openCreate = false">
        <div class="modal">
          <div class="modal-header">
            <h2>Nueva cita</h2>
            <button class="close" @click="openCreate = false">✕</button>
          </div>

          <form class="form" @submit.prevent="createCita">
            <div class="grid-form">
              <div class="field">
                <label>Paciente</label>
                <input
                  v-model="searchPaciente"
                  type="text"
                  placeholder="Buscar paciente..."
                  @input="filterPacientes"
                  @blur="hideResults"
                />

                <div v-if="showResults" class="results">
                  <div
                    v-for="p in pacientesFiltrados"
                    :key="p.Paciente_Id"
                    class="result-item"
                    @click="selectPaciente(p)"
                  >
                    {{ p.Nombre }}
                  </div>
                </div>
              </div>

              <div class="field">
                <label>Fecha</label>
                <input v-model="form.fecha" type="date" :min="minDate" />
              </div>

              <div class="field">
                <label>Hora</label>
                <input v-model="form.hora" type="time" :min="minHora" max="20:00" />
              </div>

              <div class="field">
                <label>Tipo</label>
                <input
                  v-model="form.tipo"
                  type="text"
                  placeholder="Consulta / Terapia / Revisión"
                />
              </div>

              <div class="field full">
                <label>Notas</label>
                <textarea v-model="form.notas" placeholder="Observaciones..."></textarea>
              </div>

              <div class="field">
                <label>Estatus</label>
                <select v-model="form.estatus">
                  <option>Pendiente</option>
                  <option>Confirmada</option>
                  <option>Cancelada</option>
                </select>
              </div>
            </div>

            <div class="actions">
              <button type="button" class="btn-secondary" @click="openCreate = false">
                Cancelar
              </button>

              <button type="submit" class="btn-primary" :disabled="saving">
                {{ saving ? 'Guardando...' : 'Guardar cita' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import axios from 'axios'
import API from '@/config/api'

/* ===========================
   ESTADO
=========================== */

const selectedDate = ref(new Date())
const selectedCita = ref(null)
const openCreate = ref(false)

const searchPaciente = ref('')
const showResults = ref(false)

const pacientes = ref([])
const pacientesFiltrados = ref([])
const citas = ref([])
const saving = ref(false)
const minDate = new Date().toISOString().split('T')[0]

/* ===========================
   FORMULARIO
=========================== */

const form = ref({
  paciente_id: '',
  paciente_nombre: '',
  fecha: '',
  hora: '',
  tipo: '',
  notas: '',
  estatus: 'Pendiente',
})

/* ===========================
   CARGAR PACIENTES
=========================== */

const fetchPacientes = async () => {
  try {
    const res = await axios.post(`${API}/api/pacientes`)

    pacientes.value = res.data.data || []
  } catch (error) {
    console.error('Error obteniendo pacientes:', error)
  }
}

/* ===========================
   CITAS MOCK
=========================== */

/* ===========================
   COMPUTED
=========================== */

const citasDelDia = computed(() => {
  const selected =
    selectedDate.value.getFullYear() +
    '-' +
    String(selectedDate.value.getMonth() + 1).padStart(2, '0') +
    '-' +
    String(selectedDate.value.getDate()).padStart(2, '0')

  return citas.value.filter((c) => c.fecha === selected)
})

const selectedDateLabel = computed(() =>
  selectedDate.value.toLocaleDateString('es-MX', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }),
)

/* ===========================
   FILTRAR PACIENTES
=========================== */

const filterPacientes = () => {
  const query = searchPaciente.value.trim().toLowerCase()

  if (!query) {
    pacientesFiltrados.value = []
    showResults.value = false
    return
  }

  pacientesFiltrados.value = pacientes.value.filter((p) => p.Nombre.toLowerCase().includes(query))

  showResults.value = pacientesFiltrados.value.length > 0
}

/* ===========================
   SELECCIONAR PACIENTE
=========================== */

const selectPaciente = (paciente) => {
  searchPaciente.value = paciente.Nombre

  form.value.paciente_id = paciente.Id
  form.value.paciente_nombre = paciente.Nombre

  showResults.value = false
}

/* ===========================
   NAVEGAR FECHAS
=========================== */

const prevDay = () => {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() - 1)

  selectedDate.value = d
}

const nextDay = () => {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + 1)

  selectedDate.value = d
}

/* ===========================
   SELECCIONAR CITA
=========================== */

// const selectCita = (cita) => {
//   selectedCita.value = cita
// }

/* ===========================
   CREAR CITA
=========================== */

const createCita = async () => {
  try {
    if (!form.value.paciente_id) {
      alert('Selecciona un paciente')
      return
    }

    if (!form.value.fecha) {
      alert('Selecciona una fecha')
      return
    }

    if (!form.value.hora) {
      alert('Selecciona una hora')
      return
    }

    // validar horario general
    if (form.value.hora < '07:00' || form.value.hora > '20:00') {
      alert('El horario permitido es de 07:00 a 20:00')
      return
    }

    const hoy = new Date().toISOString().split('T')[0]

    // validar hora actual si es HOY
    if (form.value.fecha === hoy && form.value.hora < minHora.value) {
      alert('No puedes seleccionar una hora anterior a la actual')
      return
    }

    saving.value = true

    const payload = {
      paciente_id: form.value.paciente_id,
      fecha: form.value.fecha,
      hora: form.value.hora,
      tipo: form.value.tipo,
      notas: form.value.notas,
      estatus: form.value.estatus,
    }

    const response = await axios.post(`${API}/api/citasave`, payload)

    // 👇 IMPORTANTE: validar respuesta del backend
    if (!response.data.success) {
      alert(response.data.message || 'Error al guardar')
      return
    }

    alert('Cita creada correctamente')

    await fetchCitas()

    openCreate.value = false
    resetForm()
  } catch (error) {
    console.error(error)
    alert(error.response?.data?.message || 'Error al guardar la cita')
  } finally {
    saving.value = false
  }
}

const formatHora = (horaISO) => {
  const d = new Date(horaISO)

  return `${String(d.getUTCHours()).padStart(2, '0')}:${String(d.getUTCMinutes()).padStart(2, '0')}`
}

const fetchCitas = async () => {
  try {
    const response = await axios.get(`${API}/api/citas`)
    console.log(response.data.data)
    citas.value = response.data.data.map((c) => ({
      id: c.Id,
      fecha: c.Fecha.slice(0, 10), // <-- IMPORTANTE
      hora: formatHora(c.Hora),
      tipo: c.Tipo,
      notas: c.Notas,
      paciente_id: c.Paciente_Id,
      estatus: c.Estatus,
    }))
  } catch (error) {
    console.error('Error obteniendo citas:', error)
  }
}

const resetForm = () => {
  form.value = {
    paciente_id: '',
    paciente_nombre: '',
    fecha: '',
    hora: '',
    tipo: '',
    notas: '',
    estatus: 'Pendiente',
  }

  searchPaciente.value = ''
  pacientesFiltrados.value = []
  showResults.value = false
}

const hideResults = () => {
  setTimeout(() => {
    showResults.value = false
  }, 150)
}

const minHora = computed(() => {
  if (!form.value.fecha) return '07:00'

  const hoy = new Date().toISOString().split('T')[0]

  // Si NO es hoy
  if (form.value.fecha !== hoy) {
    return '07:00'
  }

  const now = new Date()

  let horas = now.getHours()
  let minutos = now.getMinutes()

  minutos = Math.ceil(minutos / 5) * 5

  if (minutos === 60) {
    horas++
    minutos = 0
  }

  // si ya pasó el horario laboral
  if (horas >= 20) {
    return '20:00'
  }

  // si es antes de las 7 AM
  if (horas < 7) {
    return '07:00'
  }

  const hh = String(horas).padStart(2, '0')
  const mm = String(minutos).padStart(2, '0')

  return `${hh}:${mm}`
})

watch(
  () => form.value.fecha,
  () => {
    form.value.hora = ''
  },
)

onMounted(async () => {
  await fetchPacientes()
  await fetchCitas()
})
</script>

<style scoped>
@media (max-width: 600px) {
  .results {
    position: absolute;
    left: 0;
    right: 0;
    width: 100%;
    max-height: 160px;
    font-size: 13px;
  }

  .result-item {
    padding: 10px;
  }
}
.results {
  position: absolute;
  top: 100%;
  left: 0;

  width: 100%;
  max-width: 100%;

  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 10px;

  margin-top: 4px;

  max-height: 180px;
  overflow-y: auto;

  z-index: 50;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  box-sizing: border-box;
}

.result-item {
  padding: 8px 10px;
  cursor: pointer;
  font-size: 13px;
}

.result-item:hover {
  background: #f1f5f9;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  z-index: 1000;
}

.modal {
  width: 100%;
  max-width: 520px;
  background: white;
  border-radius: 18px;
  padding: 18px;
  animation: fadeIn 0.2s ease;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
}

@keyframes fadeIn {
  from {
    transform: translateY(10px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

/* HEADER MODAL */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.modal-header h2 {
  font-size: 18px;
  margin: 0;
  color: #0f172a;
}

.close {
  background: #f1f5f9;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  cursor: pointer;
}

/* FORM GRID */
.form {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.grid-form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.field {
  display: flex;
  flex-direction: column;
  position: relative;
  gap: 5px;
}

.field.full {
  grid-column: span 2;
}

label {
  font-size: 12px;
  color: #64748b;
}

input,
select,
textarea {
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 8px 10px;
  font-size: 13px;
  outline: none;
}

textarea {
  min-height: 80px;
  resize: none;
}

/* ACTIONS */
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 10px;
}

.btn-primary {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

.btn-secondary {
  background: #f1f5f9;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  cursor: pointer;
}

/* RESPONSIVE */
@media (max-width: 600px) {
  .grid-form {
    grid-template-columns: 1fr;
  }

  .field.full {
    grid-column: span 1;
  }

  .modal {
    padding: 14px;
  }
}
.btn-icon {
  width: 36px;
  height: 36px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  background: #ffffff;
  color: #0ea5e9;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s ease;
}

.btn-icon:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}
.page {
  padding: 28px;
  max-width: 1300px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: #ffffff;
  box-sizing: border-box;
  font-family:
    system-ui,
    -apple-system,
    sans-serif;
}

/* RESET */
* {
  box-sizing: border-box;
}

/* HEADER MODERNO */
.header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 12px;
}

.header h1 {
  font-size: 26px;
  margin: 0;
  color: #0f172a;
}

.header p {
  margin: 4px 0 0;
  color: #64748b;
  font-size: 14px;
}

/* BOTÓN LIMPIO */
.btn {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  cursor: pointer;
  transition: 0.2s ease;
  height: 36px;
}

.btn:hover {
  background: #0284c7;
}

/* STATS NUEVAS (LOOK MODERNO) */
.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.stats .card {
  background: #ffffff;
  border: 1px solid #eef2f7;
  border-radius: 14px;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: 0.2s;
}

.stats .card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.05);
}

.number {
  font-size: 20px;
  font-weight: 700;
  color: #0f172a;
}

.label {
  font-size: 12px;
  color: #64748b;
}

/* GRID PRINCIPAL */
.grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr;
  gap: 16px;
  align-items: start;
}

/* CARD BASE */
.card {
  background: #ffffff;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 16px;
}

/* CALENDAR HEADER */
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.date h2 {
  font-size: 16px;
  margin: 0;
  color: #0f172a;
}

.date p {
  font-size: 12px;
  color: #94a3b8;
}

.nav-btn {
  width: 50px;
  height: 35px;
  background: #6196cc;
  border: 1px solid #eef2f7;
  border-radius: 8px;
  cursor: pointer;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* LISTA MÁS CLÍNICA */
.list {
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-height: 62vh;
  overflow-y: auto;
  padding-right: 4px;
}

.item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border-radius: 12px;
  border: 1px solid #f1f5f9;
  cursor: pointer;
  transition: 0.15s;
}

.item:hover {
  background: #f8fafc;
  transform: translateY(-1px);
}

.time {
  font-weight: 600;
  color: #0f172a;
  width: 60px;
}

.info strong {
  font-size: 14px;
}

.info p {
  margin: 2px 0 0;
  font-size: 12px;
  color: #94a3b8;
}

/* BADGES LIMPIOS */
.badge {
  font-size: 11px;
  padding: 4px 8px;
  border-radius: 999px;
}

.Pendiente {
  background: #fff7ed;
  color: #9a3412;
}

.Confirmada {
  background: #ecfdf5;
  color: #065f46;
}

/* DETAIL MÁS MODERNO */
.detail h2 {
  font-size: 16px;
  margin-bottom: 10px;
}

.detail-box {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-box h3 {
  margin: 0;
  font-size: 18px;
}

.row {
  display: flex;
  justify-content: space-between;
  font-size: 13px;
  color: #475569;
}

.notes {
  margin-top: 10px;
  padding: 10px;
  background: #f8fafc;
  border-radius: 10px;
  font-size: 12px;
  color: #475569;
}

/* EMPTY */
.empty,
.empty-detail {
  text-align: center;
  color: #94a3b8;
  padding: 18px;
  font-size: 13px;
}

/* ======================
   📱 RESPONSIVE
====================== */

@media (max-width: 900px) {
  .page {
    padding: 14px;
  }

  .grid {
    grid-template-columns: 1fr;
  }

  .stats {
    grid-template-columns: 1fr;
  }

  .header {
    flex-direction: column;
    align-items: flex-start;
  }

  .btn {
    width: 100%;
  }

  .item {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
}
</style>
