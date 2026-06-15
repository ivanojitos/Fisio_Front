<template>
  <aside :class="['sidebar', { open: mobileOpen }]">
    <div class="logo">🏥 FisioCare</div>

    <nav>
      <router-link to="/dashboard">🏠 Dashboard</router-link>
      <router-link to="/profile">👤 Perfil</router-link>
      <router-link to="/appointments">📅 Citas</router-link>
      <router-link to="/clinical-history">📄 Historial</router-link>
      <!-- <router-link to="/recommendations">💡 Recomendaciones</router-link> -->
    </nav>

    <button class="logout" @click="logout">🚪 Cerrar sesión</button>
  </aside>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()

const logout = () => {
  auth.logout()
  router.push('/login')
}

defineProps({
  mobileOpen: Boolean,
})
</script>

<style scoped>
.sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid #e2e8f0;
  padding: 20px;
  transition: 0.3s;
}

.logo {
  font-weight: bold;
  font-size: 18px;
  margin-bottom: 25px;
  color: #0ea5e9;
}

nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

a {
  text-decoration: none;
  color: #475569;
  padding: 10px;
  border-radius: 10px;
  transition: 0.2s;
}

a:hover {
  background: #f1f5f9;
}

.logout {
  margin-top: 20px;
  width: 100%;
  padding: 10px;
  border: none;
  background: #fee2e2;
  color: #b91c1c;
  border-radius: 10px;
  cursor: pointer;
}

/* MÓVIL REAL */
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    left: -280px;
    top: 0;
    height: 100%;
    z-index: 100;
  }

  .sidebar.open {
    left: 0;
  }
}
</style>
