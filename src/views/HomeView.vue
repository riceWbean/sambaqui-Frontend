<template>
  <page-layout>
    <main class="main-page">
      <div class="main-banner">
        <div>
          <h1 class="main-title" v-motion-slide-visible-left :delay="300" :duration="800">ACERVO ARQUEOLÓGICO</h1>
          <h2 class="main-subtitle" v-motion-slide-visible-left :delay="300" :duration="800">Um projeto de modernização de dados que padroniza, unifica e rastreia mais de 100 mil artefatos.</h2>
          <router-link to="/collection" class="guide-button" v-motion-slide-visible-left :delay="300" :duration="800">VER ACERVO</router-link>
        </div>
        <div class="skulls" v-motion-slide-visible-once-bottom :delay="500" :duration="800"> 
          <img src="../assets/img/caveira1.png"> 
          <img src="../assets/img/caveira2.png">        
        </div>
      </div>
      <div class="main-artefacts">
        <div class="artefact" v-motion-slide-visible-once-bottom :delay="300" :duration="500">1</div>
        <div class="artefact" v-motion-slide-visible-once-bottom :delay="400" :duration="500">2</div>
        <div class="artefact" v-motion-slide-visible-once-bottom :delay="500" :duration="500">3</div>
      </div>
      <div class="main-banner">
        <div class="image-interact">
          <img src="../assets/img/home_interaction_image.png" alt="">
          <div 
            v-for="point in listPoints" 
            :key="point.id" 
            class="point" 
            :style="{ top: point.top, left: point.left }"
            @mouseover="showInfo(point.id)">
          </div>
        </div>
      </div>
    </main>
  </page-layout>
</template>

<script setup>
import PageLayout from '@/layouts/PageLayout.vue';
import { ref } from 'vue';

const listPoints = ref([
  { id: 1, top: '40px', left: '600px', info: 'Texto de informação 1' }
]);

function showInfo(id) {
  const point = listPoints.value.find(p => p.id === id);
  if (point) {
    alert(point.info);
  }
}

</script>

<style scoped>
@import '@/assets/sass/home/_homeView.scss';
.image-interact{
  width: 100%;
  display: flex;
  justify-content: center;
}
.image-interact{
  position: relative;
}

.image-interact .point{
  width: 20px;
  height: 20px;
  background-color: #5D5E5B;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  position: absolute;
}
.1{
  top: 10px;
  left: 50px
}
</style>
