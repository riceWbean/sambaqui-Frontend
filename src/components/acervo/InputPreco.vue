<script setup>
import { ref } from "vue";
import { useCategoriaFiltroStore } from "@/stores/categoriaFiltros";
const CategoriaFiltrosStore = useCategoriaFiltroStore();
const DataAberto = ref(true);
const props = defineProps({
  filtroData: {
    type: Array,
    required: true,
  },
});
function fechar() {
  CategoriaFiltrosStore.filtroData.funcaoFechar();
  DataAberto.value = !DataAberto.value;
}
</script>

<template>
  <div class="item">
    <div class="container">
      <span class="subtitulo">{{ CategoriaFiltrosStore.filtroData.titulo }}</span>
      <button v-if="DataAberto" @click="fechar()">-</button>
      <button v-if="!DataAberto" @click="DataAberto = !DataAberto">+</button>
    </div>
    <div class="container inputs" v-if="DataAberto">
      <input class="input-min-max" placeholder="min" v-model="CategoriaFiltrosStore.filtroData.DataMin" />
      <span>-</span>
      <input class="input-min-max" placeholder="max" v-model="CategoriaFiltrosStore.filtroData.DataMax" />
      <button class="filtrar-Data" @click="CategoriaFiltrosStore.filtroData.funcaoClicked">></button>
    </div>
  </div>
</template>
<style scoped>
.close{
  cursor: pointer;
}
button {
  background-color: transparent;
  border: none;
  cursor: pointer;

}

.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0px;
}

.input-min-max {
    height: 35px;
  width: 40%;
  border-radius: 10px;
  background-color: transparent;
  border: 1px solid #d9d9d9;
  color: #bebdbd;
  text-align: center;
}
.subtitulo {
  font-weight: 600;
  padding: 10px 0px;
}
@media (max-width: 768px) {
  .input-min-max {
    width: 105px;
    height: 40px;
  }
  .inputs{
    justify-content: center;
    gap: 15px;
  }
  .filtrar-Data{
    display: none
  }
  .item{
    border-bottom: 1px solid #d9d9d9;
    margin: 0px 15px;
    padding: 0px 10px 10px;
  }
}
span, button{
    color:white;
}
</style>
