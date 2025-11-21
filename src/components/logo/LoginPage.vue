<script setup>
import { ImageRight, InputsVue } from '..';
</script>
<template>
    <div class="container">
        <div class="left">
            <h1>Bem vindo novamente!</h1>
            <InputsVue />
            <button class="btn">Entrar</button>
        </div>
        <div class="right">
            <ImageRight />
        </div>
    </div>
</template>
<style scoped>
@import '@/assets/sass/signIn/_loginPage.scss';
</style>