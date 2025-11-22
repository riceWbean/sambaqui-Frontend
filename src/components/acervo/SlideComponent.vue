<script setup>
const props = defineProps({
    id: Number,
    nome: String,
    codigo: String,
    material: String,
    subtitulo: String,
    img: String
});
</script>

<template>
    <div class="card">
        <img :src="img" class="foto" />

        <div class="info">
            <div class="flex">
                <h3>{{ nome }}</h3>
                <p class="cod">#{{ codigo }}</p>
            </div>
            <div class="end">
                <p class="material">Matéria prima: {{ material }}</p>
                <p class="sub">Subtipo: {{ subtitulo }}</p></div>
        </div>
    </div>
</template>

<style scoped>
.end{
   margin-top: 10px;
}
.cod {
    font-weight: 600;
}

.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.card {
    width: 240px;
    padding: 15px;
    border-radius: 10px;
    background: #ffffff00;
    transition: 0.3s;
    height: 350px;
}

.card:hover {
    transform: translateY(-3px);
    box-shadow: 0 0 6px #ccc;
}

.foto {
    width: 100%;
    height: 180px;
    object-fit: cover;
    border-radius: 8px;
}
.info {
    font-size: 18px;
    margin: 20px 0 4px;
    color: #ffffff;
    /* Remova a altura fixa ou defina como auto */
    /* height: 120px; */ 
    height: auto; 
    
    /* Use Flexbox para que o conteúdo preencha o espaço corretamente */
    display: flex;
    flex-direction: column; 
    justify-content: space-between; /* Distribui o conteúdo verticalmente */
}

.info h3 {
    /* Mantenha o tamanho da fonte, mas remova o margin-top */
    /* margin-top: 20px; */ 
    margin-top: 0; /* Remove o espaçamento superior que empurrava o conteúdo */
    font-size: 18px;
    color: #ffffff;
    height: max-content;
    /* align-items: end;  <-- Isso é redundante aqui, remova se não for necessário */
}
/* Mantenha o restante do seu CSS. */
.cod,
.material,
.sub {
    margin: 2px 0;
    font-size: 13px;
    color: #ffffff;
}
</style>
