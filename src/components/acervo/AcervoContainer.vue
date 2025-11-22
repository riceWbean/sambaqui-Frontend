<script setup>
import AsideFiltro from './AsideFiltro.vue'
import PadraoArtefato from './PadraoArtefato.vue'
</script>
<template>
  <div class="acervo-container">
    <div class="titulo"><h1>ACERVO</h1></div>
    <main>
      <AsideFiltro />
      <PadraoArtefato />
    </main>
  </div>
</template>
<style scoped>
    h1{
        text-align: center;
        margin: 80px;
        color: #FFF;
        font-weight: 400;
        font-size: 32px;
        font-family:;
    }
.titulo{
    width: 100%;
    height: 150px;
    display: flex;
    align-items: center;
    justify-content: center;
}
.acervo-container{
    background-color: #2E2E2E;
    padding: 20px 60px;
}
main {
  display: flex;
  justify-content: space-between;
  width: 90vw;
}
@media (max-width: 768px) {
  main{
    flex-direction: column;
  }
}
h1{
    color:white;
}
</style>
