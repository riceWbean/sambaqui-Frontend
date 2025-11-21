<template>
  <div class="page-layout">
    <Header />
    <section class="page-body">
      <slot />
    </section>
  </div>
  <Footer />
</template>

<script setup>
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
</script>

<style scoped>
@import '@/assets/sass/layouts/_pageLayout.scss';
</style>
