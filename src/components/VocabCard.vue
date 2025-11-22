<template>
  <div class="vocab-card" @click="$emit('click')">
    <div class="vocab-content">
      <h4 class="vocab-title">{{ title }}</h4>
      <p class="vocab-items">{{ items }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'VocabCard',
  props: {
    title: {
      type: String,
      required: true
    },
    items: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    }
  },
  emits: ['click']
}
</script>

<style scoped>
.vocab-card {
  background: linear-gradient(135deg, #202020  0%, #292929 100%);
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  cursor: pointer;
  transition: all 0.3s;
  color: white;
}

.vocab-card:hover {
  transform: translateY(-2px);
}

.vocab-icon {
  font-size: 1.5rem;
  min-width: 40px;
  text-align: center;
}

.vocab-content {
  flex: 1;
}

.vocab-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
}

.vocab-items {
  margin: 0.25rem 0 0 0;
  font-size: 0.85rem;
  opacity: 0.9;
}



</style>
