<template>
  <section class="movement-timeline">
    <h2>{{ title }}</h2>
    
    <div v-if="movements && movements.length > 0" class="timeline">
      <div v-for="(movement, index) in movements" :key="index" class="timeline-item">
        <div class="timeline-marker"></div>
        <div class="timeline-content">
          <div class="timeline-header">
            <span class="timeline-date">{{ formatDate(movement.date) }}</span>
            <span class="timeline-type" :class="movement.type.toLowerCase()">
              {{ movement.type }}
            </span>
          </div>
          <p class="timeline-description">{{ movement.description }}</p>
          <p v-if="movement.user" class="timeline-user">Por: {{ movement.user }}</p>
        </div>
      </div>
    </div>

    <div v-else class="no-data">
      <p>{{ emptyMessage }}</p>
    </div>
  </section>
</template>

<script setup>
defineProps({
  movements: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: 'Histórico de Movimentações'
  },
  emptyMessage: {
    type: String,
    default: 'Nenhuma movimentação registrada'
  }
})

const formatDate = (date) => {
  if (!date) return 'Data não informada'
  return new Date(date).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}
</script>

<style scoped>
.movement-timeline {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.movement-timeline h2 {
  margin: 0 0 1.5rem 0;
  font-size: 1.2rem;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.timeline {
  position: relative;
  padding-left: 2rem;
}

.timeline::before {
  content: '';
  position: absolute;
  left: 0.5rem;
  top: 0;
  bottom: 0;
  width: 2px;
  background: linear-gradient(to bottom, #3498db, #ecf0f1);
}

.timeline-item {
  position: relative;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
}

.timeline-item:last-child {
  margin-bottom: 0;
}

.timeline-marker {
  position: absolute;
  left: -1.25rem;
  top: 0.25rem;
  width: 12px;
  height: 12px;
  background: #3498db;
  border: 3px solid white;
  border-radius: 50%;
  box-shadow: 0 0 0 2px #3498db;
}

.timeline-content {
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 6px;
  border-left: 3px solid #3498db;
}

.timeline-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.timeline-date {
  font-weight: 600;
  color: #2c3e50;
  font-size: 0.95rem;
}

.timeline-type {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: #3498db;
  color: white;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.timeline-type.entrada {
  background: #27ae60;
}

.timeline-type.saida {
  background: #e74c3c;
}

.timeline-type.transferencia {
  background: #f39c12;
}

.timeline-type.devolucao {
  background: #2980b9;
}

.timeline-description {
  margin: 0.5rem 0 0 0;
  color: #2c3e50;
  font-size: 0.95rem;
  line-height: 1.5;
}

.timeline-user {
  margin: 0.5rem 0 0 0;
  color: #7f8c8d;
  font-size: 0.85rem;
  font-style: italic;
}

.no-data {
  padding: 2rem;
  text-align: center;
  background: #f8f9fa;
  border-radius: 6px;
}

.no-data p {
  margin: 0;
  color: #7f8c8d;
}
</style>
