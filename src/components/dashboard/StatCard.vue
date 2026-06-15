<template>
  <div class="card">
    <h3>{{ title }}</h3>
    <p>{{ value }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: String,
  value: String,
})
</script>

<style scoped>
.card {
  background: white;
  border: 1px solid #e2e8f0;
  padding: 20px;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.04);
}

h3 {
  color: #64748b;
  font-size: 14px;
}

p {
  font-size: 22px;
  font-weight: bold;
  color: #0f172a;
}
</style>
