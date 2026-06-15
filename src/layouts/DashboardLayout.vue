<template>
  <div class="layout">
    <Sidebar :mobileOpen="mobileOpen" @close="mobileOpen = false" />

    <div class="main">
      <Topbar @toggle="toggleSidebar" />

      <div class="overlay" v-if="mobileOpen" @click="mobileOpen = false" />

      <div class="content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Sidebar from '@/components/dashboard/Sidebar.vue'
import Topbar from '@/components/dashboard/TopBar.vue'

const mobileOpen = ref(false)

const toggleSidebar = () => {
  mobileOpen.value = !mobileOpen.value
}
</script>

<style scoped>
.layout {
  display: flex;
  height: 100vh;
  background: #f8fafc;
  font-family: 'Poppins', sans-serif;
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.content {
  padding: 22px;
  overflow-y: auto;
}

/* overlay móvil real */
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  backdrop-filter: blur(2px);
  z-index: 50;
}
</style>
