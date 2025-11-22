<script setup>
import { reactive } from 'vue';
import { useSignInStore } from '@/stores';

const user = reactive({
    email: '',
    password: ''
});

const signInStore = useSignInStore();
</script>
<template>
    <div class="container">
        <form @submit.prevent="signInStore.login(user)">
            <div class="input">
                <div class="form-group inputBox">
                    <input v-model="user.email" type="email" class="form-control" id="email" placeholder=" ">
                    <label for="email" class="labelInput">Email</label>
                </div>
            </div>
            <div class="input">
                <div class="form-group inputBox">
                    <input v-model="user.password" type="password" class="form-control" id="senha" placeholder=" ">
                    <label for="senha" class="labelInput">Senha</label>
                </div>
            </div>
            <button class="btn">Entrar</button>
        </form>
    </div>
</template>
<style scoped>
@import '@/assets/sass/signIn/_inputsVue.scss';
</style>