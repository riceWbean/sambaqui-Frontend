<template>
  <div class="pagination">
    <button
      :disabled="currentPage === 1"
      @click="$emit('update:currentPage', currentPage - 1)"
      class="pagination-btn prev-btn"
    >
      ← Anterior
    </button>

    <div class="pagination-info">
      <span>Página</span>
      <input
        :value="currentPage"
        @input="$emit('update:currentPage', parseInt($event.target.value) || 1)"
        type="number"
        min="1"
        :max="totalPages"
        class="page-input"
      />
      <span>de <strong>{{ totalPages }}</strong></span>
    </div>

    <button
      :disabled="currentPage === totalPages"
      @click="$emit('update:currentPage', currentPage + 1)"
      class="pagination-btn next-btn"
    >
      Próxima →
    </button>

    <div class="items-info">
      Mostrando {{ startItem }} a {{ endItem }} de {{ totalItems }}
    </div>
  </div>
</template>

<script>
export default {
  name: 'Pagination',
  props: {
    currentPage: {
      type: Number,
      required: true
    },
    totalPages: {
      type: Number,
      required: true
    },
    totalItems: {
      type: Number,
      required: true
    },
    itemsPerPage: {
      type: Number,
      required: true
    }
  },
  emits: ['update:currentPage'],
  computed: {
    startItem() {
      return (this.currentPage - 1) * this.itemsPerPage + 1
    },
    endItem() {
      return Math.min(this.currentPage * this.itemsPerPage, this.totalItems)
    }
  }
}
</script>

<style scoped>
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex-wrap: wrap;
}

.pagination-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #2980b9;
  transform: translateY(-2px);
}

.pagination-btn:disabled {
  background-color: #bdc3c7;
  cursor: not-allowed;
  opacity: 0.6;
}

.pagination-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #2c3e50;
  font-weight: 600;
}

.page-input {
  width: 50px;
  padding: 0.25rem 0.5rem;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  text-align: center;
  font-weight: 600;
}

.page-input:focus {
  outline: none;
  border-color: #3498db;
}

.items-info {
  color: #7f8c8d;
  font-size: 0.9rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .pagination {
    gap: 1rem;
  }

  .items-info {
    flex-basis: 100%;
    text-align: center;
  }
}
</style>
