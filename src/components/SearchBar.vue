<template>
  <div class="search-bar">
    <div class="search-input-wrapper">
      <input
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        type="text"
        :placeholder="placeholder"
        class="search-input"
        @keyup.enter="$emit('search')"
      />
      <span class="search-icon">🔍</span>
      <button
        v-if="modelValue"
        @click="$emit('update:modelValue', '')"
        class="clear-btn"
        title="Limpar busca"
      >
        ✕
      </button>
    </div>
    <button class="search-btn" @click="$emit('search')">
      Buscar
    </button>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    modelValue: {
      type: String,
      default: ''
    },
    placeholder: {
      type: String,
      default: 'Buscar...'
    }
  },
  emits: ['update:modelValue', 'search']
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 0.5rem;
  width: 100%;
}

.search-input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: center;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ecf0f1;
  border-radius: 6px;
  font-size: 1rem;
  transition: all 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.search-icon {
  position: absolute;
  left: 0.75rem;
  color: #7f8c8d;
  pointer-events: none;
}

.clear-btn {
  position: absolute;
  right: 0.5rem;
  background: transparent;
  border: none;
  color: #7f8c8d;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.25rem 0.5rem;
  transition: color 0.3s;
}

.clear-btn:hover {
  color: #2c3e50;
}

.search-btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
}

.search-btn:hover {
  background-color: #2980b9;
}

@media (max-width: 480px) {
  .search-bar {
    flex-direction: column;
  }

  .search-btn {
    width: 100%;
  }
}
</style>
