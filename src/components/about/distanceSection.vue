<script setup>
import inputForm from './inputForm.vue';

const inputs = ["Número", "Rua", "Cidade", "Estado"];

</script>

<template>
    <div class="distanceContainer">
        <div class="distanceForm">
            <h2>Descubra sua distância até o Museu</h2>
            <div class="inputs">
                <inputForm v-for="(input, index) in inputs" :key="index" :placeholder="input" />
            </div>
            <button>Calcular Distância</button>
        </div>
        <div class="map" >
            <img src="@/assets/img/about/mapimg.png" alt="">
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sass/about/_distanceSection.scss';

</style>