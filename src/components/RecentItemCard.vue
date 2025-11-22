<template>
  <div class="recent-item-card">
    <div class="item-header">
      <h4 class="item-name">{{ item.name }}</h4>
      <span class="item-status" :class="item.status.toLowerCase()">
        {{ item.status }}
      </span>
    </div>
    <div class="item-meta">
      <span class="meta-item">
        <strong>Coleção:</strong> {{ item.collection }}
      </span>
      <span class="meta-item">
        <strong>Data:</strong> {{ formatDate(item.date) }}
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RecentItemCard',
  props: {
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    formatDate(date) {
      return new Date(date).toLocaleDateString('pt-BR')
    }
  }
}
</script>

<style scoped>
.recent-item-card {
  background: #1e1e1e;
  border: 1px solid black;
  border-radius: 6px;
  padding: 1rem;
  transition: all 0.3s;
}


.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.item-name {
  margin: 0;
  font-size: 1rem;
  color: #737373;
  font-weight: 600;
}

.item-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.item-status.catalogado {
  border: 1px solid #d5f4e6;
  color: #1e1e1e;
  font-weight: bold;
  color: #d5f4e6;
}

.item-status.pendente {
  border: 1px solid #ffeaa7;
  color: #1e1e1e;
  font-weight: bold;
  color: #ffeaa7;
}

.item-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  font-size: 0.85rem;
}

.meta-item {
  color: white;
}

.meta-item strong {
  color: #737373;
}
</style>
