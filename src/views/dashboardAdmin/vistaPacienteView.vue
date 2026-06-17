<template>
  <DashboardLayout>
    <!-- 🧑 PACIENTE (FULL WIDTH ARRIBA) -->
    <section class="patient-header">
      <div class="patient">
        <div class="avatar">
          {{ paciente.nombre.charAt(0) }}
        </div>

        <div>
          <h2>IVAN ALVAREZ</h2>
          <p>{{ paciente.id }} • {{ paciente.estado }}</p>
        </div>
      </div>
    </section>

    <!-- 📦 RESTO DEL CONTENIDO -->
    <div class="layout">
      <aside class="panel">
        <h3>📁 Expediente</h3>

        <div class="box">
          <p><b>Estado:</b> {{ paciente.estado }}</p>
          <p><b>ID:</b> {{ paciente.id }}</p>
        </div>

        <div class="hint">Seguimiento clínico activo</div>
      </aside>

      <section class="panel main">
        <h3>🧾 Notas clínicas</h3>

        <div class="timeline">
          <div v-for="(c, i) in comentarios" :key="i" class="note">
            {{ c }}
          </div>
        </div>

        <textarea v-model="nuevoComentario" placeholder="Agregar nota clínica..." />
        <button @click="agregarComentario">Guardar nota</button>
      </section>

      <section class="panel">
        <h3>💡 Indicaciones</h3>

        <div class="list">
          <div v-for="(r, i) in recomendaciones" :key="i" class="item">
            {{ r }}
          </div>
        </div>

        <input v-model="nuevaRecomendacion" placeholder="Nueva indicación" />
        <button @click="agregarRecomendacion">Agregar</button>
      </section>

      <section class="panel full">
        <h3>🏃 Plan terapéutico</h3>

        <div class="grid-ex">
          <div v-for="(e, i) in ejercicios" :key="i" class="ex">
            <h4>{{ e.nombre }}</h4>
            <p>{{ e.descripcion }}</p>
            <span>{{ e.frecuencia }}</span>
          </div>
        </div>

        <div class="form">
          <input v-model="nuevoEjercicio.nombre" placeholder="Ejercicio" />
          <input v-model="nuevoEjercicio.descripcion" placeholder="Descripción" />
          <input v-model="nuevoEjercicio.frecuencia" placeholder="Frecuencia" />
          <button @click="agregarEjercicio">Agregar ejercicio</button>
        </div>
      </section>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '@/layouts/DashboardLayout.vue'
import { reactive, ref } from 'vue'

/* PACIENTE FICTICIO */
const paciente = reactive({
  id: 'P-10293',
  nombre: 'María González',
  estado: 'Post-terapia',
})

/* DATOS FICTICIOS */
const comentarios = ref([
  'Paciente muestra mejoría en movilidad.',
  'Dolor disminuyó significativamente después de la sesión.',
  'Se recomienda continuar seguimiento semanal.',
])

const recomendaciones = ref([
  'Evitar cargas pesadas por 7 días.',
  'Aplicar compresas frías 2 veces al día.',
  'Mantener postura correcta al sentarse.',
])

const ejercicios = ref([
  {
    nombre: 'Estiramiento lumbar',
    descripcion: 'Flexión suave de espalda baja en posición acostada.',
    frecuencia: '2 veces al día',
  },
  {
    nombre: 'Movilidad de cuello',
    descripcion: 'Rotaciones lentas en ambas direcciones.',
    frecuencia: '3 series de 10',
  },
])

/* FORMULARIOS */
const nuevoComentario = ref('')
const nuevaRecomendacion = ref('')

const nuevoEjercicio = reactive({
  nombre: '',
  descripcion: '',
  frecuencia: '',
})

/* ACCIONES */
const agregarComentario = () => {
  if (!nuevoComentario.value) return
  comentarios.value.push(nuevoComentario.value)
  nuevoComentario.value = ''
}

const agregarRecomendacion = () => {
  if (!nuevaRecomendacion.value) return
  recomendaciones.value.push(nuevaRecomendacion.value)
  nuevaRecomendacion.value = ''
}

const agregarEjercicio = () => {
  if (!nuevoEjercicio.nombre) return

  ejercicios.value.push({
    nombre: nuevoEjercicio.nombre,
    descripcion: nuevoEjercicio.descripcion,
    frecuencia: nuevoEjercicio.frecuencia,
  })

  nuevoEjercicio.nombre = ''
  nuevoEjercicio.descripcion = ''
  nuevoEjercicio.frecuencia = ''
}
</script>

<style>
.patient-header {
  background: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* IMPORTANTE: no max-width centrado */
.grid {
  display: grid;
  grid-template-columns: 0.8fr 1.4fr 1fr;
  gap: 16px;
}
.patient-header {
  background: white;
  padding: 16px;
  border-radius: 16px;
  margin-bottom: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

/* TOPBAR */
.topbar {
  background: white;
  padding: 14px 18px;
  border-radius: 14px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  margin-bottom: 18px;
}

.patient {
  display: flex;
  gap: 12px;
  align-items: center;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 12px;

  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  color: white;

  display: flex;
  align-items: center;
  justify-content: center;

  font-weight: bold;
}

/* LAYOUT */
.layout {
  display: grid;
  grid-template-columns: 0.8fr 1.4fr 1fr;
  gap: 16px;
}

/* PANEL */
.panel {
  background: white;
  border-radius: 16px;
  padding: 16px;

  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.panel h3 {
  margin-bottom: 12px;
  font-size: 14px;
}

/* LEFT BOX */
.box {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
  font-size: 13px;
}

.hint {
  margin-top: 10px;
  font-size: 12px;
  color: #64748b;
}

/* MAIN */
.main {
  min-height: 420px;
}

.timeline {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.note {
  background: #f1f5f9;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
}

/* LIST */
.list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.item {
  background: #ecfeff;
  padding: 10px;
  border-radius: 10px;
  font-size: 13px;
}

/* EXERCISES */
.full {
  grid-column: 1 / -1;
}

.grid-ex {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 12px;
}

.ex {
  background: #f8fafc;
  padding: 14px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.ex h4 {
  margin: 0;
}

.ex p {
  font-size: 12px;
  color: #64748b;
}

/* INPUTS */
textarea,
input {
  width: 100%;
  margin-top: 10px;
  padding: 10px;

  border-radius: 10px;
  border: 1px solid #e2e8f0;
  outline: none;
}

button {
  width: 100%;
  margin-top: 10px;

  padding: 10px;
  border: none;

  border-radius: 10px;

  background: linear-gradient(135deg, #0ea5e9, #3b82f6);
  color: white;

  font-weight: 600;
  cursor: pointer;
}

/* RESPONSIVE */
@media (max-width: 900px) {
  .layout {
    grid-template-columns: 1fr;
  }
}
</style>
