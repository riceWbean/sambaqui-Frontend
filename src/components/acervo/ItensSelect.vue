<script setup>
const props = defineProps({
  filtroLista: {
    type: Array,
    required: true,
  },
});

// Função para fechar todos os outros filtros e abrir apenas o clicado
const toggleFiltro = (itemClicado) => {
  props.filtroLista.forEach(item => {
    if (item !== itemClicado) {
      item.aberto = true  // true = fechado (mostra +)
    }
  })
  itemClicado.aberto = !itemClicado.aberto
}
</script>

<template>
  <div>
    <div v-for="(item, index) in filtroLista" :key="index" class="item">
      <div class="container">
        <span class="subtitulo">{{ item.titulo }}</span>
        <button class="pointer" @click="() => { item.funcao(); toggleFiltro(item) }" v-if="!item.aberto">-</button>
        <button class="pointer" @click="toggleFiltro(item)" v-else>+</button>
      </div>
    <div class="opcoes" v-if="!item.aberto">
      <div v-for="(item2, idx) in item.array" :key="idx" class="opcao-input">
        <input
          class="opcao"
          type="radio"
          :id="`${item.titulo}-${item2.nome}`"
          :name="item.titulo"
          :value="item2.value"
          :checked="item.model.includes(item2.value)"
          @change="item.model = [item2.value]"
        />
        <label class="opcao-input-label" :for="`${item.titulo}-${item2.nome}`"> {{ item2.nome }} </label>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.opcao-input-label{
    color:white;
}
.pointer{
  cursor: pointer;
}
button {
  background-color: transparent;
  border: none;
}
option {
  background-color: transparent;
  border-radius: 10px;
}

.opcao-input {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  cursor: pointer;
}

.opcao-input input[type="radio"]:checked,
input[type="radio"]:checked {
  background-color: #846247;
}

.opcao-input input[type="radio"] {
  all: unset;
  border: 1.5px solid #d9d9d9;
  border-radius: 50%;
  width: 15px;
  height: 15px;
  margin: 0px 8px;
}

.opcao {
  margin: 0px 15px;
}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
}

.subtitulo {
  font-weight: 600;
  padding: 10px 0px;
}

.opcao-input-label{
  cursor: pointer;
}

@media (max-width: 768px) {
  .item{
    margin: 0px 15px;
    padding: 10px 10px;
    border-bottom: 1px solid #d9d9d9;
  }
}
span, button{
    color:white;
}
</style>
