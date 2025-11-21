<template>
  <div class="location-control" @click="$emit('click')">
    <div class="control-icon">📍</div>
    <div class="control-content">
      <h4 class="control-title">{{ title }}</h4>
      <p class="control-description">{{ description }}</p>
    </div>
    <div class="control-arrow">→</div>
  </div>
</template>

<script>
export default {
  name: 'LocationControl',
  props: {
    title: {
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
.location-control {
  background: white;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.location-control:hover {
  border-color: #e74c3c;
  background-color: #fff5f5;
  box-shadow: 0 2px 8px rgba(231, 76, 60, 0.1);
}

.control-icon {
  font-size: 1.8rem;
  min-width: 50px;
  text-align: center;
}

.control-content {
  flex: 1;
}

.control-title {
  margin: 0;
  font-size: 1rem;
  color: #2c3e50;
  font-weight: 600;
}

.control-description {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #7f8c8d;
}

.control-arrow {
  color: #e74c3c;
  font-weight: 600;
  opacity: 0;
  transition: opacity 0.3s;
}

.location-control:hover .control-arrow {
  opacity: 1;
}
</style>
