<template>
  <div class="status-item">
    <div class="status-indicator" :class="status"></div>
    <span class="status-label">{{ label }}</span>
  </div>
</template>

<script>
export default {
  name: 'StatusItem',
  props: {
    label: {
      type: String,
      required: true
    },
    status: {
      type: String,
      required: true,
      validator: (value) => ['online', 'offline', 'processing'].includes(value)
    },
    icon: {
      type: String,
      default: '●'
    }
  }
}
</script>

<style scoped>
.status-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.status-indicator {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-indicator.online {
  background-color: #27ae60;
}

.status-indicator.offline {
  background-color: #e74c3c;
  animation: none;
}

.status-indicator.processing {
  background-color: #f39c12;
}

.status-label {
  flex: 1;
  color: #2c3e50;
  font-weight: 500;
}

.status-icon {
  color: #7f8c8d;
  font-size: 0.9rem;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}
</style>
