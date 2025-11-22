<template>
    <header>
        <ul class="header-list">
            <li><router-link to="/">Início</router-link></li>
            <li><router-link to="/about">Sobre</router-link></li>
            <li><router-link to="/exhibitions">Exibições</router-link></li>
            <li><router-link to="/acervo">Acervo</router-link></li>
            <li>
                <img src="/src/assets/icons/search_icon.svg" alt="search" @click="irParaBusca"
                    style="cursor: pointer" />
            </li>

            <li><router-link to="/signin"><svg width="24" height="26" viewBox="0 0 24 26" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M23 25C23 23.1392 23 22.2089 22.7632 21.4519C22.23 19.7473 20.8543 18.4133 19.0965 17.8963C18.3158 17.6667 17.3564 17.6667 15.4375 17.6667H8.5625C6.6436 17.6667 5.68414 17.6667 4.90343 17.8963C3.14562 18.4133 1.77006 19.7473 1.23683 21.4519C1 22.2089 1 23.1392 1 25M18.1875 7C18.1875 10.3137 15.4173 13 12 13C8.58274 13 5.8125 10.3137 5.8125 7C5.8125 3.68629 8.58274 1 12 1C15.4173 1 18.1875 3.68629 18.1875 7Z"
                            stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </router-link></li>
        </ul>
    </header>
</template>
<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

function irParaBusca() {
  router.push("/acervo");
}
</script>

<style scoped>
@import '@/assets/sass/header/_headerComponent.scss';
</style>