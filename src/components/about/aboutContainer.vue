<script setup>
import { topSection, distanceSection, bottomSection } from '..';
import DistanceMuseum from '@/components/popUpLoc/DistanceMuseum.vue';
</script>

<template>
    <div class="aboutContainer">
        <h1>SOBRE</h1>
        <topSection />
        <DistanceMuseum />
        <bottomSection />
    </div>
</template>

<style scoped>
@import '@/assets/sass/about/_aboutContainer.scss';

</style>