<template>
  <div class="page-layout">
    <Header />
    <section class="page-body">
      <slot />
    </section>
  </div>
</template>

<script setup>
import Header from '@/components/Header.vue'
</script>

<style scoped>
@import '@/assets/sass/layouts/_pageLayout.scss';
</style>
