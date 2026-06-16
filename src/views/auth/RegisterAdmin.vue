<template>
  <div class="page">
    <div class="card">
      <h1>Crear administrador</h1>
      <p class="subtitle">Registra un nuevo usuario con rol de administrador</p>

      <form @submit.prevent="handleSubmit" class="form">
        <!-- FOTO UPLOAD -->
        <div class="photo-box">
          <div class="photo-preview">
            <img v-if="previewImage" :src="previewImage" />
            <div v-else class="placeholder">📷</div>
          </div>

          <label class="upload-btn">
            Subir foto
            <input type="file" accept="image/*" @change="handleFile" hidden />
          </label>
        </div>

        <div class="grid">
          <div class="field">
            <label>Nombre</label>
            <input v-model="form.Nombre" type="text" placeholder="Nombre completo" required />
          </div>

          <div class="field">
            <label>Correo</label>
            <input v-model="form.Correo" type="email" placeholder="correo@ejemplo.com" required />
          </div>

          <div class="field">
            <label>Contraseña</label>
            <input v-model="form.Password" type="password" placeholder="••••••••" required />
          </div>

          <div class="field">
            <label>Fecha de nacimiento</label>
            <input v-model="form.Fecha_nacimiento" type="date" required />
          </div>

          <div class="field">
            <label>Estatus</label>
            <select v-model="form.Estatus" required>
              <option value="Activo">Activo</option>
              <option value="Inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <button :disabled="loading" type="submit">
          {{ loading ? 'Creando...' : 'Crear administrador' }}
        </button>

        <p v-if="message" class="msg">{{ message }}</p>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import axios from 'axios'
import API from '@/config/api'
import { useRouter } from 'vue-router'

const loading = ref(false)
const message = ref('')
const previewImage = ref('')
const fileImage = ref(null)
const router = useRouter()

const form = reactive({
  Nombre: '',
  Correo: '',
  Password: '',
  Estatus: 'Activo',
  Rol: 'Admin',
  Fecha_nacimiento: '',
  Foto: null,
})

// 📸 manejar archivo
const handleFile = (e) => {
  const file = e.target.files[0]
  if (!file) return

  fileImage.value = file
  previewImage.value = URL.createObjectURL(file)
}

// 🚀 submit
const handleSubmit = async () => {
  loading.value = true
  message.value = ''

  try {
    const data = new FormData()

    data.append('nombre', form.Nombre)
    data.append('correo', form.Correo)
    data.append('password', form.Password)
    data.append('estatus', form.Estatus)
    data.append('rol', form.Rol)
    data.append('fechaN', form.Fecha_nacimiento)

    if (fileImage.value) {
      data.append('foto', fileImage.value)
    }

    await axios.post(`${API}/api/createAdmin`, data)

    message.value = 'Administrador creado correctamente 🎉'

    Object.assign(form, {
      Nombre: '',
      Correo: '',
      Password: '',
      Estatus: 'Activo',
      Rol: 'Admin',
      Fecha_nacimiento: '',
    })

    previewImage.value = ''
    fileImage.value = null
    router.push('/login')
  } catch (err) {
    message.value = err.response?.data?.error || 'Error al crear admin'
  } finally {
    loading.value = false
  }
}
</script>

<style>
.page {
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ffffff;
  padding: 30px;
  font-family: system-ui;
}

.card {
  width: 100%;
  max-width: 780px;
  background: #fff;
  border: 1px solid #eee;
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

h1 {
  margin: 0;
  font-size: 28px;
  color: #111;
}

.subtitle {
  color: #666;
  margin-bottom: 25px;
}

/* FOTO */
.photo-box {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 25px;
}

.photo-preview {
  width: 110px;
  height: 110px;
  border-radius: 18px;
  border: 2px dashed #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: #fafafa;
}

.photo-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 30px;
  color: #aaa;
}

.upload-btn {
  padding: 10px 16px;
  background: #111827;
  color: white;
  border-radius: 10px;
  cursor: pointer;
  font-size: 14px;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

label {
  font-size: 13px;
  color: #444;
}

input,
select {
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e5e7eb;
  outline: none;
  transition: 0.2s;
}

input:focus,
select:focus {
  border-color: #111827;
  box-shadow: 0 0 0 3px rgba(17, 24, 39, 0.1);
}

/* BOTON */
button {
  margin-top: 20px;
  width: 100%;
  padding: 14px;
  background: #111827;
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
}

button:hover {
  transform: translateY(-2px);
  background: #000;
}

.msg {
  margin-top: 12px;
  text-align: center;
  color: #333;
}

/* RESPONSIVE */
@media (max-width: 700px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .photo-box {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
