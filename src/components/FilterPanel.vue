<template>
  <div class="filter-panel">
    <div class="filter-header">
      <h3>Filtros Avançados</h3>
      <button class="close-btn" @click="$emit('close')">✕</button>
    </div>

    <div class="filter-content">
      <slot></slot>
    </div>

    <div class="filter-footer">
      <button class="btn-secondary" @click="$emit('clear')">
        Limpar Filtros
      </button>
      <button class="btn-primary" @click="$emit('apply')">
        Aplicar Filtros
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FilterPanel',
  emits: ['close', 'clear', 'apply']
}
</script>

<style scoped>
.filter-panel {
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
}

.filter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ecf0f1;
  background-color: #f8f9fa;
}

.filter-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
}

.close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #7f8c8d;
  transition: color 0.3s;
}

.close-btn:hover {
  color: #2c3e50;
}

.filter-content {
  padding: 1.5rem;
}

.filter-footer {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #ecf0f1;
  background-color: #f8f9fa;
  justify-content: flex-end;
}

.btn-primary,
.btn-secondary {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  border: none;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #ecf0f1;
  color: #2c3e50;
  border: 1px solid #bdc3c7;
}

.btn-secondary:hover {
  background-color: #d5dbdb;
}
</style>
