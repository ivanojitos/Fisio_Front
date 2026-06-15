<template>
  <DashboardLayout>
    <div class="appointments">
      <!-- HEADER -->
      <div class="header">
        <h1>Citas</h1>
        <p>Agenda tu próxima sesión de fisioterapia</p>
      </div>

      <div class="container">
        <!-- CALENDARIO -->
        <div class="calendar-card">
          <h2>Selecciona un día</h2>

          <div class="calendar">
            <div
              v-for="day in days"
              :key="day.date"
              class="day"
              :class="{ selected: selectedDay === day.date }"
              @click="selectDay(day.date)"
            >
              <p class="label">{{ day.label }}</p>
              <span class="number">{{ day.number }}</span>
            </div>
          </div>
        </div>

        <!-- FORMULARIO -->
        <div class="form-card" v-if="selectedDay">
          <h2>Agendar cita</h2>

          <p class="selected-date">📅 {{ selectedDay }}</p>

          <!-- TIPO DE CITA -->
          <label>Tipo de cita</label>
          <select v-model="form.type">
            <option disabled value="">Selecciona una opción</option>

            <option>Evaluación inicial</option>
            <option>Rehabilitación muscular</option>
            <option>Terapia de espalda</option>
            <option>Terapia de rodilla</option>
            <option>Terapia cervical</option>
            <option>Dolor crónico</option>
            <option>Recuperación post-operatoria</option>
            <option>Consulta general</option>
            <option>Seguimiento clínico</option>
            <option>Electroterapia</option>
          </select>

          <!-- HORARIO -->
          <label>Horario disponible</label>
          <select v-model="form.time">
            <option disabled value="">Selecciona hora</option>

            <option v-for="time in availableHours" :key="time" :value="time">
              {{ time }}
            </option>
          </select>

          <!-- NOTAS -->
          <label>Notas (opcional)</label>
          <textarea v-model="form.notes" />

          <button class="btn" @click="saveAppointment">Agendar cita</button>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

/* =========================
   ESTADO SEMANA
========================= */
const days = ref([])

const selectedDay = ref(null)

const form = ref({
  type: '',
  time: '',
  notes: '',
})

/* =========================
   HORARIOS DISPONIBLES
========================= */
const allHours = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
]

/* =========================
   GENERAR SEMANA (LUN - DOM)
========================= */
const getWeekDays = () => {
  const today = new Date()
  const currentDay = today.getDay() // 0 domingo - 6 sábado

  const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay

  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)

  const week = []

  const labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday)
    d.setDate(monday.getDate() + i)

    week.push({
      date: d.toISOString().split('T')[0],
      label: labels[i],
      number: d.getDate(),
    })
  }

  return week
}

/* =========================
   CARGAR SEMANA
========================= */
const loadWeek = () => {
  days.value = getWeekDays()
  selectedDay.value = null
  form.value.time = ''
  form.value.type = ''
  form.value.notes = ''
}

/* =========================
   HORARIOS DISPONIBLES DINÁMICOS
========================= */
const availableHours = computed(() => {
  if (!selectedDay.value) return []

  const now = new Date()
  const today = now.toISOString().split('T')[0]

  if (selectedDay.value !== today) {
    return allHours
  }

  const currentHour = now.getHours()

  return allHours.filter((h) => {
    const hour = parseInt(h.split(':')[0])
    return hour > currentHour
  })
})

/* =========================
   SELECCIONAR DÍA
========================= */
const selectDay = (date) => {
  selectedDay.value = date
  form.value.time = ''
}

/* =========================
   GUARDAR CITA
========================= */
const saveAppointment = () => {
  if (!form.value.type || !form.value.time) {
    alert('Completa todos los campos')
    return
  }

  alert(`Cita agendada para ${selectedDay.value} a las ${form.value.time}`)
}

/* =========================
   VISIBILITY CHANGE (PRO FIX)
========================= */
const handleVisibility = () => {
  if (!document.hidden) {
    loadWeek()
  }
}

/* =========================
   LIFECYCLE VUE 3
========================= */
onMounted(() => {
  loadWeek()
  document.addEventListener('visibilitychange', handleVisibility)
})

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibility)
})
</script>

<style scoped>
.appointments {
  padding: 25px;
  background: white;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* =======================
   HEADER
======================= */
.header h1 {
  margin: 0;
}

.header p {
  color: #64748b;
}

/* =======================
   LAYOUT PRINCIPAL
======================= */
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-top: 20px;
}

/* =======================
   CALENDARIO
======================= */
.calendar-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
}

.calendar {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 10px;
  margin-top: 15px;
}

/* Día base */
.day {
  padding: 15px;
  border-radius: 14px;
  background: #f8fafc;
  text-align: center;
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid transparent;
}

/* hover pro */
.day:hover {
  transform: translateY(-2px);
  border-color: #0ea5e9;
  background: #e0f2fe;
}

/* seleccionado */
.selected {
  background: linear-gradient(135deg, #0ea5e9, #14b8a6);
  color: white;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.25);
}

/* texto calendario */
.label {
  font-size: 12px;
  opacity: 0.8;
}

.number {
  font-size: 18px;
  font-weight: bold;
}

/* =======================
   FORMULARIO
======================= */
.form-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
}

.selected-date {
  color: #0ea5e9;
  font-weight: 600;
  margin-bottom: 10px;
}

/* labels */
label {
  display: block;
  margin-top: 12px;
  font-size: 12px;
  color: #64748b;
}

/* inputs global */
select,
textarea {
  width: 100%;
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  outline: none;
  transition: 0.2s;
  background: #fff;
}

/* focus pro */
select:focus,
textarea:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

/* textarea */
textarea {
  height: 80px;
  resize: none;
}

/* botón */
.btn {
  margin-top: 15px;
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(135deg, #0ea5e9, #14b8a6);
  color: white;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(20, 184, 166, 0.25);
}

/* =======================
   RESPONSIVE
======================= */

/* tablet */
@media (max-width: 1024px) {
  .calendar {
    grid-template-columns: repeat(4, 1fr);
  }
}

/* tablet pequeña / móvil grande */
@media (max-width: 768px) {
  .container {
    grid-template-columns: 1fr;
  }

  .calendar {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* móvil */
@media (max-width: 480px) {
  .calendar {
    grid-template-columns: repeat(2, 1fr);
  }

  .day {
    padding: 12px;
  }
}
</style>
