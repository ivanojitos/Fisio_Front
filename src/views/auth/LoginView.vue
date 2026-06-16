<template>
  <div class="login-wrapper">
    <!-- Lado izquierdo (branding) -->
    <div class="left-panel">
      <div class="brand">
        <h1>FisioCare</h1>
        <p>Tu salud en movimiento</p>
      </div>

      <div class="illustration">💙</div>
    </div>

    <!-- Lado derecho (formulario) -->
    <div class="right-panel">
      <div class="card">
        <h2>Bienvenido de nuevo</h2>
        <p class="subtitle">Inicia sesión en tu cuenta</p>

        <form>
          <div class="input-group">
            <label>Correo</label>
            <input v-model="email" type="email" placeholder="tucorreo@email.com" />
          </div>

          <div class="input-group">
            <label>Contraseña</label>
            <input v-model="password" type="password" placeholder="••••••••" />
          </div>

          <button class="btn-primary" @click.prevent="handleLogin">Iniciar sesión</button>

          <p class="footer-text">
            ¿No tienes cuenta?
            <router-link to="/register">Regístrate</router-link>
          </p>
        </form>
      </div>
      <!-- MODAL ERROR -->
      <div v-if="error" class="modal-overlay">
        <div class="modal">
          <div class="modal-icon">⚠️</div>

          <h3>Error de acceso</h3>

          <p>{{ error }}</p>

          <button class="modal-btn" @click="error = ''">Entendido</button>
        </div>
      </div>

      <div v-if="successModal" class="modal-overlay">
        <div class="modal">
          <div class="success-icon">✅</div>

          <h3>Bienvenido</h3>

          <p>Acceso correcto. Redirigiendo...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import API from '@/config/api'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref('')
const successModal = ref(false)

const roleRedirect = {
  // admin: { name: 'DashAdministrador' },
  paciente: '/dashboard',
}

const handleLogin = async () => {
  error.value = ''

  try {
    const response = await axios.post(`${API}/api/login`, {
      correo: email.value,
      password: password.value,
    })

    if (response.data.ok) {
      const user = response.data.user
      const rol = response.data.rol

      localStorage.setItem('auth', 'true')
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('role', rol)

      router.push(roleRedirect[rol] || { name: '/login' })
    }
  } catch (err) {
    if (err.response.data.ok) {
      const user = err.response.data.user
      const rol = err.response.data.rol

      localStorage.setItem('auth', 'true')
      localStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('role', rol)

      successModal.value = true

      setTimeout(() => {
        router.push('/dashboard')
      }, 1500)
    } else if (err.response?.status === 404) {
      error.value = 'Usuario no existe'
    } else if (err.response?.status === 422) {
      error.value = 'Datos inválidos'
    } else {
      error.value = 'Error del servidor'
    }
  }
}
</script>

<style scoped>
/* ==================================
   LOGIN
================================== */

.login-wrapper {
  min-height: 100vh;
  display: flex;
  font-family: 'Poppins', sans-serif;
  background: #ffffff;
}

/* ==================================
   PANEL IZQUIERDO
================================== */

.left-panel {
  flex: 1;
  background: linear-gradient(135deg, #0ea5e9, #14b8a6);
  color: white;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  padding: 40px;
  text-align: center;
}

.brand h1 {
  margin: 0;
  font-size: 42px;
  font-weight: 700;
}

.brand p {
  margin-top: 10px;
  opacity: 0.9;
  font-size: 16px;
}

.illustration {
  font-size: 90px;
  margin-top: 30px;
}

/* ==================================
   PANEL DERECHO
================================== */

.right-panel {
  flex: 1;
  background: white;

  display: flex;
  justify-content: center;
  align-items: center;

  padding: 30px;
}

/* ==================================
   CARD LOGIN
================================== */

.card {
  width: 100%;
  max-width: 420px;

  background: white;

  padding: 40px;

  border-radius: 24px;

  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.08);

  border: 1px solid #e2e8f0;
}

h2 {
  margin-bottom: 5px;
  color: #0f172a;
  font-size: 30px;
}

.subtitle {
  color: #64748b;
  margin-bottom: 25px;
}

/* ==================================
   INPUTS
================================== */

.input-group {
  margin-bottom: 16px;
}

label {
  display: block;

  margin-bottom: 6px;

  font-size: 14px;
  font-weight: 500;

  color: #334155;
}

input {
  width: 100%;

  padding: 14px;

  border-radius: 12px;

  border: 1px solid #e2e8f0;

  outline: none;

  transition: 0.25s;

  font-size: 14px;
}

input:focus {
  border-color: #0ea5e9;

  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.12);
}

/* ==================================
   BOTON
================================== */

.btn-primary {
  width: 100%;

  margin-top: 10px;

  padding: 14px;

  border: none;

  border-radius: 12px;

  background: linear-gradient(135deg, #0ea5e9, #14b8a6);

  color: white;

  font-size: 15px;
  font-weight: 600;

  cursor: pointer;

  transition: all 0.25s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);

  box-shadow: 0 12px 24px rgba(20, 184, 166, 0.25);
}

/* ==================================
   FOOTER
================================== */

.footer-text {
  margin-top: 18px;

  text-align: center;

  color: #64748b;

  font-size: 14px;
}

.footer-text a {
  color: #0ea5e9;
  font-weight: 600;
  text-decoration: none;
}

/* ==================================
   MODAL
================================== */

.modal-overlay {
  position: fixed;
  inset: 0;

  background: rgba(15, 23, 42, 0.45);

  backdrop-filter: blur(6px);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 9999;

  animation: fadeIn 0.25s ease;
}

.modal {
  width: 90%;
  max-width: 420px;

  background: white;

  border-radius: 24px;

  padding: 35px;

  text-align: center;

  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.15);

  animation: scaleIn 0.25s ease;
}

.modal-icon {
  width: 80px;
  height: 80px;

  margin: auto auto 20px;

  border-radius: 50%;

  background: #fee2e2;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 36px;
}

.success-icon {
  width: 80px;
  height: 80px;

  margin: auto auto 20px;

  border-radius: 50%;

  background: #dcfce7;

  display: flex;
  justify-content: center;
  align-items: center;

  font-size: 36px;
}

.modal h3 {
  margin-bottom: 10px;

  color: #0f172a;

  font-size: 24px;
}

.modal p {
  color: #64748b;

  line-height: 1.5;

  margin-bottom: 25px;
}

.modal-btn {
  width: 100%;

  padding: 14px;

  border: none;

  border-radius: 12px;

  background: linear-gradient(135deg, #0ea5e9, #14b8a6);

  color: white;

  font-weight: 600;

  cursor: pointer;

  transition: all 0.25s ease;
}

.modal-btn:hover {
  transform: translateY(-2px);
}

/* ==================================
   ANIMACIONES
================================== */

@keyframes fadeIn {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

/* ==================================
   TABLET
================================== */

@media (max-width: 1024px) {
  .card {
    max-width: 400px;
  }
}

/* ==================================
   MOVIL
================================== */

@media (max-width: 768px) {
  .login-wrapper {
    flex-direction: column;
  }

  .left-panel {
    display: none;
  }

  .right-panel {
    height: 100vh;
    padding: 20px;
  }

  .card {
    max-width: 100%;
    padding: 30px;
    box-shadow: none;
  }

  h2 {
    font-size: 26px;
  }

  .modal {
    width: 92%;
    padding: 25px;
  }
}

/* ==================================
   MOVIL PEQUEÑO
================================== */

@media (max-width: 480px) {
  .card {
    padding: 25px;
  }

  input {
    padding: 12px;
  }

  .btn-primary {
    padding: 13px;
  }

  .modal-icon,
  .success-icon {
    width: 70px;
    height: 70px;
    font-size: 30px;
  }

  .modal h3 {
    font-size: 20px;
  }
}
</style>
