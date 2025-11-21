<template>
  <div class="location-control" @click="$emit('click')">
    <div class="control-content">
      <h4 class="control-title">{{ title }}</h4>
      <p class="control-description">{{ description }}</p>
    </div>
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
  background: #1e1e1e;
  border-radius: 6px;
  border: 1px solid black;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s;
}

.location-control:hover {
  border-color: #e74c3c;
  border: 1px solid #737373;
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
  color: white;
  font-weight: 600;
}

.control-description {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  color: #737373;
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
