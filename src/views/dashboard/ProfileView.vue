<template>
  <DashboardLayout>
    <div class="profile">
      <div class="header">
        <h1>Perfil del paciente</h1>

        <button class="edit-btn" @click="editMode = !editMode">
          {{ editMode ? 'Guardar' : 'Editar' }}
        </button>
      </div>

      <div class="card">
        <!-- FOTO -->
        <div class="photo-section">
          <div class="avatar">
            <img v-if="previewImage" :src="previewImage" />

            <div v-else class="placeholder">
              {{ form.name?.charAt(0) }}
            </div>
          </div>

          <input v-if="editMode" type="file" accept="image/*" @change="onFileChange" />
        </div>

        <!-- INFO -->
        <div class="grid">
          <div class="item">
            <label>Nombre</label>
            <input v-if="editMode" v-model="form.name" />
            <p v-else>{{ form.name }}</p>
          </div>

          <div class="item">
            <label>Edad</label>
            <input v-if="editMode" v-model="form.age" />
            <p v-else>{{ form.age }}</p>
          </div>

          <div class="item">
            <label>Teléfono</label>
            <input v-if="editMode" v-model="form.phone" />
            <p v-else>{{ form.phone }}</p>
          </div>

          <div class="item">
            <label>Correo</label>
            <input v-if="editMode" v-model="form.email" />
            <p v-else>{{ form.email }}</p>
          </div>

          <div class="item full">
            <label>Dirección completa</label>
            <textarea v-if="editMode" v-model="form.address" />
            <p v-else>{{ form.address }}</p>
          </div>

          <div class="item full">
            <label>Condición médica</label>
            <textarea v-if="editMode" v-model="form.condition" />
            <p v-else>{{ form.condition }}</p>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue'
import DashboardLayout from '@/layouts/DashboardLayout.vue'

const editMode = ref(false)
const previewImage = ref(null)

const form = ref({
  name: 'Ivan Alvarez',
  age: 28,
  phone: '222 000 0000',
  email: 'ivan@email.com',
  address: 'Av. Reforma 123, Col. Centro, Puebla, CP 72000',
  condition: 'Dolor lumbar / lesión de rodilla',
})

const onFileChange = (e) => {
  const file = e.target.files[0]
  if (file) {
    previewImage.value = URL.createObjectURL(file)
  }
}
</script>

<style scoped>
.profile {
  padding: 25px;
  background: #f8fafc;
  min-height: 100vh;
  font-family: 'Poppins', sans-serif;
}

/* HEADER */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.edit-btn {
  padding: 10px 15px;
  border: none;
  background: linear-gradient(135deg, #0ea5e9, #14b8a6);
  color: white;
  border-radius: 10px;
  cursor: pointer;
}

/* CARD */
.card {
  margin-top: 20px;
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 18px;
  padding: 25px;
}

/* FOTO */
.photo-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
}

.avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  overflow: hidden;
  border: 3px solid #0ea5e9;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #e2e8f0;
}

.avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder {
  font-size: 34px;
  font-weight: bold;
  color: #0ea5e9;
}

/* GRID */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.item {
  background: #f8fafc;
  padding: 12px;
  border-radius: 12px;
}

/* full width */
.full {
  grid-column: span 2;
}

label {
  font-size: 12px;
  color: #64748b;
}

p {
  margin: 5px 0 0;
  font-weight: 500;
  color: #0f172a;
}

/* inputs edit mode */
input,
textarea {
  width: 100%;
  margin-top: 5px;
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  outline: none;
}

textarea {
  resize: none;
  height: 80px;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .grid {
    grid-template-columns: 1fr;
  }

  .full {
    grid-column: span 1;
  }
}
</style>
