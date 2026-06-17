<template>
  <DashboardLayout>
    <div class="content">
      <header class="header">
        <div>
          <h1>Configuración de Horarios</h1>
          <p></p>
        </div>
      </header>

      <section class="grid">
        <!-- DÍAS -->
        <div class="card days">
          <h2>Días de la semana</h2>

          <div
            v-for="day in days"
            :key="day.key"
            class="day"
            :class="{ active: selectedDay === day.key }"
            @click="selectedDay = day.key"
          >
            <span>
              {{ day.label }}
              ({{ formatDate(weekDates[day.key]) }})
            </span>

            <input type="checkbox" v-model="schedule[day.key].enabled" />
          </div>
        </div>

        <!-- HORARIOS -->
        <div class="card schedule">
          <h2>
            Horarios -
            <span>{{ getDayLabel(selectedDay) }}</span>
          </h2>

          <!-- NUEVO CHECK -->
          <div class="edit-toggle">
            <label>
              <input type="checkbox" v-model="editHorarios" />
              Editar horarios
            </label>
          </div>

          <div v-if="schedule[selectedDay].enabled">
            <div v-for="(slot, index) in schedule[selectedDay].slots" :key="index" class="slot">
              <input type="time" v-model="slot.start" />
              <span>a</span>
              <input type="time" v-model="slot.end" />

              <button class="delete" @click="removeSlot(index)">✕</button>
            </div>

            <button class="add" @click="addSlot">+ Agregar horario</button>
          </div>

          <div v-else class="disabled">Este día no está habilitado</div>
        </div>

        <!-- PREVIEW -->
        <div class="card preview">
          <h2>Vista previa</h2>

          <div v-for="(lista, dia) in horariosAgrupados" :key="dia" class="preview-day">
            <div class="preview-header">
              <strong>{{ getDayLabel(dia) }}</strong>

              <button class="delete-day" @click="eliminarDia(dia)">🗑️</button>
            </div>

            <div v-for="horario in lista" :key="horario.Id">
              <div class="preview-slot">
                🕒 {{ formatTime(horario.Hora_Inicio) }} - {{ formatTime(horario.Hora_Fin) }}
              </div>
            </div>
          </div>
        </div>
      </section>
      <div class="actions">
        <button v-if="!editHorarios" class="btn btn-primary" @click="saveSchedule">
          💾 Guardar días
        </button>

        <button v-if="editHorarios" class="btn btn-secondary" @click="saveScheduleHours">
          ⏱️ Editar horarios
        </button>
      </div>
    </div>

    <div v-if="showSuccessModal" class="modal-overlay">
      <div class="modal">
        <h3>✅ Horarios guardados</h3>

        <p>{{ successMessage }}</p>

        <button @click="showSuccessModal = false">Aceptar</button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import axios from 'axios'
import API from '@/config/api'

const days = [
  { key: 'mon', label: 'Lunes' },
  { key: 'tue', label: 'Martes' },
  { key: 'wed', label: 'Miércoles' },
  { key: 'thu', label: 'Jueves' },
  { key: 'fri', label: 'Viernes' },
  { key: 'sat', label: 'Sábado' },
  { key: 'sun', label: 'Domingo' },
]

const selectedDay = ref('mon')
const showSuccessModal = ref(false)
const successMessage = ref('')
const horariosGuardados = ref([])
const editHorarios = ref(false)

const schedule = ref({
  mon: { enabled: true, slots: [{ start: '07:00', end: '08:00' }] },
  tue: { enabled: true, slots: [{ start: '07:00', end: '08:00' }] },
  wed: { enabled: true, slots: [{ start: '07:00', end: '08:00' }] },
  thu: { enabled: true, slots: [{ start: '07:00', end: '08:00' }] },
  fri: { enabled: true, slots: [{ start: '07:00', end: '08:00' }] },
  sat: { enabled: false, slots: [] },
  sun: { enabled: false, slots: [] },
})

const addSlot = () => {
  schedule.value[selectedDay.value].slots.push({
    start: '07:00',
    end: '08:00',
  })
}

const removeSlot = (index) => {
  schedule.value[selectedDay.value].slots.splice(index, 1)
}

const eliminarDia = async (dia) => {
  const fecha = formatDate(weekDates[dia])

  // deshabilitar día
  schedule.value[dia].enabled = false

  // borrar horarios visuales
  schedule.value[dia].slots = []

  // quitar de la vista previa inmediatamente
  horariosGuardados.value = horariosGuardados.value.filter((h) => h.Dia_Semana !== dia)

  // llamar API
  await deleteHorarios(fecha, dia)
}

const deleteHorarios = async (fecha, dia) => {
  try {
    await axios.post(`${API}/api/deleteDia`, {
      fecha,
      dia_semana: dia,
    })

    await obtenerHorarios()
  } catch (error) {
    console.error(error)
  }
}

const getDayLabel = (key) => {
  return days.find((d) => d.key === key)?.label
}

const getWeekDates = () => {
  const today = new Date()

  // Obtener lunes de la semana actual
  const monday = new Date(today)

  const day = today.getDay() // 0=domingo

  const diff = day === 0 ? -6 : 1 - day

  monday.setDate(today.getDate() + diff)

  return {
    mon: new Date(monday),
    tue: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 1),
    wed: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 2),
    thu: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 3),
    fri: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 4),
    sat: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 5),
    sun: new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 6),
  }
}

const formatDate = (date) => {
  if (!date) return ''

  const d = new Date(date)

  if (isNaN(d.getTime())) return ''

  return d.toLocaleDateString('es-MX')
}

const weekDates = getWeekDates()

const saveSchedule = async () => {
  try {
    const horarios = []

    Object.entries(schedule.value).forEach(([dia, config]) => {
      if (config.enabled) {
        config.slots.forEach((slot) => {
          horarios.push({
            fecha: formatDate(weekDates[dia]),
            dia_semana: dia,
            hora_inicio: slot.start,
            hora_fin: slot.end,
          })
        })
      }
    })

    await axios.post(`${API}/api/horarios`, {
      horarios,
    })
    await obtenerHorarios()
    successMessage.value = 'Los horarios se guardaron correctamente.'
    showSuccessModal.value = true
  } catch (error) {
    successMessage.value = error
    showSuccessModal.value = false
  }
}

const saveScheduleHours = async () => {
  try {
    const horarios = []

    Object.entries(schedule.value).forEach(([dia, config]) => {
      if (config.enabled) {
        config.slots.forEach((slot) => {
          horarios.push({
            fecha: formatDate(weekDates[dia]),
            dia_semana: dia,
            hora_inicio: slot.start,
            hora_fin: slot.end,
          })
        })
      }
    })

    await axios.post(`${API}/api/updateHorarios`, {
      horarios,
    })
    await obtenerHorarios()
    successMessage.value = 'Los horarios se editaron correctamente.'
    showSuccessModal.value = true
  } catch (error) {
    successMessage.value = error
    showSuccessModal.value = false
  }
}

//OBTENER HORARIOS
const obtenerHorarios = async () => {
  try {
    const response = await axios.get(`${API}/api/gethorariosSemana`, {
      params: {
        fechaInicio: weekDates.mon.toISOString().split('T')[0],
        fechaFin: weekDates.sun.toISOString().split('T')[0],
      },
    })

    horariosGuardados.value = response.data.data
  } catch (error) {
    successMessage.value = error
    showSuccessModal.value = false
  }
}

const formatTime = (dateString) => {
  if (!dateString) return ''

  return dateString.substring(11, 16)
}

const horariosAgrupados = computed(() => {
  const grupos = {}

  horariosGuardados.value
    .filter((h) => h.Activo === true || h.Activo === 1)
    .forEach((h) => {
      if (!grupos[h.Dia_Semana]) {
        grupos[h.Dia_Semana] = []
      }

      grupos[h.Dia_Semana].push(h)
    })

  return grupos
})

onMounted(() => {
  obtenerHorarios()
})
</script>

<style scoped>
.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.delete-day {
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  transition: 0.2s;
}

.delete-day:hover {
  transform: scale(1.15);
}
.edit-toggle {
  margin-top: 10px;
  margin-bottom: 15px;

  display: flex;
  align-items: center;
  gap: 10px;

  padding: 10px 14px;

  background: linear-gradient(135deg, #eff6ff, #f0f9ff);
  border: 1px solid #bfdbfe;
  border-radius: 12px;

  font-size: 13px;
  font-weight: 600;
  color: #1e3a8a;

  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.08);

  transition: all 0.25s ease;
}

/* hover elegante */
.edit-toggle:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.15);
  border-color: #60a5fa;
}

/* checkbox más moderno */
.edit-toggle input {
  width: 16px;
  height: 16px;
  accent-color: #2563eb;
  cursor: pointer;
}

.edit-toggle input {
  accent-color: #0ea5e9;
}
.actions {
  display: flex;
  flex-direction: row; /* 👈 en fila */
  gap: 12px;
  justify-content: center; /* o center si quieres centrado */
  align-items: center;
  margin-top: 20px;
  flex-wrap: nowrap; /* 👈 evita que se vayan a otra línea */
}

/* BOTÓN BASE MÁS BONITO Y COMPACTO */
.btn {
  padding: 15px 50px; /* 👈 menos ancho */
  font-size: 13px;
  font-weight: 600;

  border-radius: 10px;
  cursor: pointer;
  border: none;

  display: inline-flex;
  align-items: center;
  gap: 6px;

  width: auto; /* 👈 evita que se estire */
  min-width: 160px; /* 👈 tamaño consistente pero no gigante */
  justify-content: center;

  transition: all 0.25s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* EFECTO HOVER PRO */
.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 14px rgba(0, 0, 0, 0.12);
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
    max-width: 260px;
  }
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
}

.modal {
  background: white;
  width: 400px;
  max-width: 90%;
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}

.modal h3 {
  margin-bottom: 12px;
  color: #16a34a;
}

.modal p {
  margin-bottom: 20px;
  color: #475569;
}

.modal button {
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 10px;
  cursor: pointer;
}
.page {
  padding: 28px;
  background: #ffffff;
  font-family: system-ui;
}

/* HEADER */
.header h1 {
  margin: 0;
  font-size: 24px;
  color: #0f172a;
}

.header p {
  margin: 4px 0 20px;
  color: #64748b;
}

/* GRID PRINCIPAL */
.grid {
  display: grid;
  grid-template-columns: 1fr 1.2fr 1fr;
  gap: 16px;
  align-items: start;
}

/* CARDS */
.card {
  background: #fff;
  border: 1px solid #eef2f7;
  border-radius: 16px;
  padding: 16px;
  transition: 0.2s ease;

  max-width: 320px; /* 👈 controla el ancho */
  width: 100%; /* se adapta en móvil */
}

/* DAYS */
.day {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  border-radius: 10px;
  cursor: pointer;
  margin-bottom: 8px;
  border: 1px solid #f1f5f9;
  transition: 0.2s;
}

.day:hover {
  background: #f8fafc;
}

.day.active {
  background: #e0f2fe;
  border-color: #38bdf8;
}

/* SLOTS */
.slot {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
  flex-wrap: wrap;
}

input[type='time'] {
  border: 1px solid #e2e8f0;
  padding: 8px;
  border-radius: 8px;
  font-size: 13px;
  outline: none;
}

/* BOTONES */
.add {
  margin-top: 10px;
  background: #0ea5e9;
  color: white;
  border: none;
  padding: 10px 12px;
  border-radius: 10px;
  cursor: pointer;
  font-size: 13px;
}

.delete {
  background: #fee2e2;
  border: none;
  color: #b91c1c;
  padding: 6px 8px;
  border-radius: 8px;
  cursor: pointer;
}

/* PREVIEW */
.preview-day {
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 10px;
  background: #f8fafc;
}

.preview-slot {
  font-size: 12px;
  color: #475569;
}

.off {
  font-size: 12px;
  color: #ef4444;
}

/* =========================
   📱 RESPONSIVE TABLET
========================= */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .page {
    padding: 20px;
  }
}

/* =========================
   📱 MOBILE
========================= */
@media (max-width: 768px) {
  .page {
    padding: 14px;
  }

  .header h1 {
    font-size: 20px;
  }

  .header p {
    font-size: 13px;
  }

  /* GRID → STACK */
  .grid {
    grid-template-columns: 1fr;
    gap: 12px;
  }

  /* DAYS EN MOBILE COMO SCROLL HORIZONTAL */
  .days {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 8px;
  }

  .day {
    min-width: 140px;
    flex-shrink: 0;
  }

  /* SLOTS MÁS COMPACTOS */
  .slot {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }

  input[type='time'] {
    width: 100%;
  }

  .add {
    width: 100%;
  }
}

/* =========================
   📱 MOBILE PEQUEÑO
========================= */
@media (max-width: 480px) {
  .card {
    padding: 12px;
  }

  .day {
    min-width: 120px;
    font-size: 13px;
  }

  .preview-day {
    font-size: 13px;
  }
}

/* =====================================
   TABLET
===================================== */
@media (max-width: 1024px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .card {
    max-width: 100%;
  }

  .page {
    padding: 20px;
  }
}

/* =====================================
   MOBILE
===================================== */
@media (max-width: 768px) {
  .page {
    padding: 12px;
  }

  .header h1 {
    font-size: 20px;
  }

  .header p {
    font-size: 13px;
  }

  .card {
    max-width: 100%;
    padding: 14px;
  }

  /* Días */
  .days {
    display: flex;
    overflow-x: auto;
    gap: 10px;
    padding-bottom: 10px;
  }

  .day {
    min-width: 130px;
    flex-shrink: 0;
  }

  /* Horarios */
  .slot {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  input[type='time'] {
    width: 100%;
  }

  .add {
    width: 100%;
  }

  /* Vista previa */
  .preview-header {
    flex-wrap: wrap;
    gap: 8px;
  }

  .preview-slot {
    font-size: 13px;
  }

  /* Botones */
  .actions {
    flex-direction: column;
    width: 100%;
  }

  .btn {
    width: 100%;
    min-width: unset;
  }

  /* Modal */
  .modal {
    width: 95%;
    padding: 18px;
  }
}

/* =====================================
   MOBILE PEQUEÑO
===================================== */
@media (max-width: 480px) {
  .header h1 {
    font-size: 18px;
  }

  .card {
    padding: 12px;
    border-radius: 12px;
  }

  .day {
    min-width: 110px;
    font-size: 13px;
  }

  .preview-day {
    padding: 8px;
  }

  .btn {
    font-size: 12px;
    padding: 12px;
  }

  .delete-day {
    font-size: 18px;
  }

  .modal h3 {
    font-size: 18px;
  }

  .modal p {
    font-size: 14px;
  }
}
</style>
