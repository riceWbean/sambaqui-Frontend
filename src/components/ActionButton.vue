<template>
  <button class="action-button" @click="$emit('click')">
    <div class="button-icon">{{ icon }}</div>
    <div class="button-content">
      <h4 class="button-label">{{ label }}</h4>
      <p class="button-description">{{ description }}</p>
    </div>
    <div class="button-arrow">→</div>
  </button>
</template>

<script>
export default {
  name: 'ActionButton',
  props: {
    icon: {
      type: String,
      required: true
    },
    label: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.action-button {
  background: white;
  border: 1px solid #ecf0f1;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  text-align: left;
  width: 100%;
}

.action-button:hover {
  background-color: #f8f9fa;
  border-color: #3498db;
  box-shadow: 0 2px 8px rgba(52, 152, 219, 0.1);
}

.button-icon {
  font-size: 1.5rem;
  min-width: 40px;
  text-align: center;
}

.button-content {
  flex: 1;
}

.button-label {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.button-description {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.button-arrow {
  color: #3498db;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s;
}

.action-button:hover .button-arrow {
  opacity: 1;
}
</style>
