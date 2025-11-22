<template>
  <section class="info-section">
    <h2>{{ title }}</h2>
    <div class="info-grid">
      <div v-for="item in items" :key="item.label" class="info-item">
        <label>{{ item.label }}</label>
        <p>{{ item.value || 'Não informado' }}</p>
      </div>
    </div>
  </section>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true,
    validator: (items) => {
      return items.every(item => 'label' in item && 'value' in item)
    }
  }
})
</script>

<style scoped>
.info-section {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.info-section h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  margin: 0;
  color: #2c3e50;
  font-size: 1rem;
}

@media (max-width: 768px) {
  .info-grid {
    grid-template-columns: 1fr;
  }
}
</style>
