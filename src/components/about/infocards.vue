<script setup>
import { ref } from 'vue';
import 'font-awesome/css/font-awesome.min.css';

const cards = ref([
    {
        title: 'Telefone',
        content: '(47) 98765-6789',
        icon: 'fa-solid fa-phone' 
    },
    {
        title: 'Email',
        content: 'oorunplacassolare@gmail.com',
        icon: 'fa-solid fa-envelope' 
    },
    {
        title: 'Localização',
        content: 'Rua Dona Francisca, 600, no Centro de Joinville, Santa Catarina, Brasil',
        icon: 'fa-solid fa-map-marker-alt' 
    },
    {
        title: 'Horário',
        content: 'Terça a domingo, 10h às 16h',
        icon: 'fa-solid fa-clock' 
    }
]);
</script>

<template>
    <div class="infoCards">
        <div class="card" v-for="(card, index) in cards" :key="index">
            <div>
                <i :class="card.icon" class="icon"></i> 
            </div>
            <div class="textinfo">
                <h3>{{ card.title }}</h3>
                <p>{{ card.content }}</p>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sass/about/_infocards.scss';


</style>
