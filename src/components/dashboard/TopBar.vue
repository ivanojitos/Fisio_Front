<template>
  <header class="topbar">
    <button class="menu" @click="$emit('toggle')">☰</button>

    <div class="spacer"></div>

    <div class="user">
      <div class="avatar">
        {{ auth.user?.Foto?.charAt(0) }}
      </div>

      <div class="info">
        <p class="name">{{ auth.user?.Nombre }}</p>
        <p class="role">Paciente</p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { useAuthStore } from '@/stores/authStore'

const auth = useAuthStore()
</script>

<style scoped>
.topbar {
  height: 60px;
  background: white;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  align-items: center;
  padding: 0 18px;
}

/* empuja contenido a la derecha */
.spacer {
  flex: 1;
}

.menu {
  font-size: 22px;
  border: none;
  background: none;
  cursor: pointer;
  margin-right: 10px;
}

.user {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* avatar mejorado */
.avatar {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: linear-gradient(135deg, #0ea5e9, #14b8a6);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

/* texto usuario */
.name {
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  color: #1e293b;
}

.role {
  margin: 0;
  font-size: 12px;
  color: #64748b;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .name {
    font-size: 12px;
  }

  .role {
    font-size: 10px;
  }
}
</style>
