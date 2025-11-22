<template>
  <div class="stat-card">
    <div class="stat-content">
      <h3 class="stat-title">{{ title }}</h3>
      <p class="stat-value">{{ value }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    icon: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: true
    },
    color: {
      type: String,
    }
  }
}
</script>

<style scoped>
.stat-card {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.3s, box-shadow 0.3s;
  cursor: pointer;
}


.stat-icon {
  font-size: 2rem;
  min-width: 50px;
  text-align: center;
}

.stat-content {
  flex: 1;
}

.stat-title {
  margin: 0;
  font-size: 0.9rem;
  color: #7f8c8d;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-value {
  margin: 0.5rem 0 0 0;
  font-size: 1.8rem;
  color: white;
  font-weight: 700;
}
</style>
