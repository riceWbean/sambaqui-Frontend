<template>
    <header>
        <ul class="header-list">
            <li><router-link to="/">Início</router-link></li>
            <li><a href="#mapa">Mapa</a></li>
            <li><router-link to="/exhibitions">Exibições</router-link></li>
            <li><router-link to="/acervo">Acervo</router-link></li>
            <li><img src="/src/assets/icons/search_icon.svg" alt="search"/></li>
            <li><router-link to="/signin">User</router-link></li>
        </ul>
    </header>
</template>
<style scoped>
@import '@/assets/sass/header/_headerComponent.scss';
</style>