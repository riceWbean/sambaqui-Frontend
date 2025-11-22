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
                <p class="material">Matéria prima: {{ material }}</p>
                <p class="sub">Subtipo: {{ subtitulo }}</p>
        </div>
    </div>
</template>

<style scoped>
.cod {
    font-weight: 600;
}

.flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 30px;
}

.card {
    width: 240px;
    padding: 15px;
    border-radius: 10px;
    background: #ffffff00;
    transition: 0.3s;
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
}

.info h3 {
    font-size: 18px;
    color: #ffffff;
}

.cod,
.material,
.sub {
    margin: 2px 0;
    font-size: 13px;
    color: #ffffff;
}
</style>
