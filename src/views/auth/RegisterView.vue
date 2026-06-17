<template>
  <div class="register-wrapper">
    <!-- Panel izquierdo -->
    <div class="left-panel">
      <div class="brand">
        <h1>FisioCare</h1>
        <p>Crea tu cuenta y empieza tu recuperación</p>
      </div>

      <div class="illustration">🧠💙</div>
    </div>

    <!-- LOADING -->
    <div v-if="loading" class="loading-overlay">
      <div class="loader"></div>
      <p>Creando Paciente...</p>
    </div>

    <!-- Panel derecho -->
    <div class="right-panel">
      <div class="card">
        <h2>Crear cuenta</h2>
        <p class="subtitle">Regístrate como paciente</p>

        <form @submit.prevent="guardarUsuario">
          <div class="row">
            <div class="input-group">
              <label>Nombre</label>
              <input v-model="form.nombre" type="text" />
            </div>

            <div class="input-group">
              <label>Edad</label>
              <input v-model="form.edad" type="number" />
            </div>
          </div>

          <div class="input-group">
            <label>Teléfono</label>
            <input v-model="form.telefono" type="text" />
          </div>

          <div class="input-group">
            <label>Correo</label>
            <input v-model="form.correo" type="email" />
          </div>

          <div class="input-group">
            <label>Dirección</label>
            <input v-model="form.direccion" type="text" />
          </div>

          <div class="input-group">
            <label>Código Postal</label>
            <input v-model="form.cp" type="text" />
          </div>

          <div class="input-group">
            <label>Condición Médica</label>
            <input v-model="form.condicion_medica" type="text" />
          </div>

          <div class="input-group">
            <label>Lesión</label>
            <input v-model="form.lesion" type="text" />
          </div>

          <div class="input-group">
            <label>Contraseña</label>
            <input v-model="form.password" type="password" />
          </div>

          <div class="input-group">
            <label>Foto</label>
            <input type="file" @change="onFileChange" />
          </div>

          <button class="btn-primary">Crear cuenta</button>

          <p class="footer-text">
            ¿Ya tienes cuenta?
            <router-link to="/login">Inicia sesión</router-link>
          </p>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)

const form = ref({
  nombre: '',
  edad: '',
  telefono: '',
  correo: '',
  direccion: '',
  cp: '',
  condicion_medica: '',
  password: '',
  lesion: '',
  foto: null,
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  form.value.foto = file
}

import axios from 'axios'
import API from '@/config/api'

const guardarUsuario = async () => {
  try {
    loading.value = true
    const formData = new FormData()

    formData.append('nombre', form.value.nombre)
    formData.append('edad', form.value.edad)
    formData.append('telefono', form.value.telefono)
    formData.append('correo', form.value.correo)
    formData.append('direccion', form.value.direccion)
    formData.append('cp', form.value.cp)
    formData.append('condicion_medica', form.value.condicion_medica)
    formData.append('password', form.value.password)
    formData.append('lesion', form.value.lesion)
    formData.append('foto', form.value.foto)

    const response = await axios.post(`${API}/api/createPaciente`, formData)

    if (response.data.ok) {
      alert('Paciente creado correctamente')

      limpiarFormulario()
      router.push('/login')
    }
  } catch (error) {
    console.log(error)
    alert('Error al registrar Paciente')
  }
}

/* =========================
   LIMPIAR
========================= */
const limpiarFormulario = () => {
  form.value = {
    nombre: '',
    edad: '',
    telefono: '',
    correo: '',
    direccion: '',
    cp: '',
    condicion_medica: '',
    password: '',
    lesion: '',
    foto: null,
  }
}
</script>

<style scoped>
/* Wrapper general */
.register-wrapper {
  height: 100vh;
  display: flex;
  font-family: 'Poppins', sans-serif;
}

/* Panel izquierdo */
.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #14b8a6, #0ea5e9);
  color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  text-align: center;
}

.brand h1 {
  font-size: 42px;
  margin: 0;
}

.brand p {
  margin-top: 10px;
  opacity: 0.9;
}

.illustration {
  font-size: 80px;
  margin-top: 30px;
}

/* Panel derecho */
.right-panel {
  flex: 1;
  background: #ffffff;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

/* Card */
.card {
  width: 100%;
  max-width: 450px;
  background: white;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
}

h2 {
  margin-bottom: 5px;
  color: #1e293b;
}

.subtitle {
  color: #64748b;
  margin-bottom: 25px;
}

/* Inputs */
.input-group {
  margin-bottom: 15px;
  display: flex;
  flex-direction: column;
}

label {
  font-size: 14px;
  color: #475569;
  margin-bottom: 6px;
}

input {
  width: 100%;
  padding: 12px;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  transition: 0.2s;
}

input:focus {
  border-color: #0ea5e9;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

/* fila nombre/apellido */
.row {
  display: flex;
  gap: 10px;
}

/* botón */
.btn-primary {
  width: 100%;
  padding: 12px;
  margin-top: 10px;
  background: linear-gradient(135deg, #14b8a6, #0ea5e9);
  border: none;
  color: white;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}

.btn-primary:hover {
  transform: translateY(-2px);
}

/* footer */
.footer-text {
  margin-top: 15px;
  text-align: center;
  font-size: 14px;
  color: #64748b;
}

.footer-text a {
  color: #0ea5e9;
  font-weight: 600;
  text-decoration: none;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .register-wrapper {
    flex-direction: column;
  }

  .left-panel {
    display: none;
  }

  .right-panel {
    height: 100vh;
  }

  .card {
    box-shadow: none;
    border: 1px solid #e2e8f0;
  }

  .row {
    flex-direction: column;
  }
}
</style>
