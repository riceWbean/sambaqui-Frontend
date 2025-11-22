<script setup>
import { ref, onMounted } from "vue";
import { useArtefatosStore } from "@/stores/artefatosStore";
import { useRouter } from "vue-router";

const router = useRouter();
const artefatosStore = useArtefatosStore();

const imagens = ref([]);
const carregando = ref(false);
const pagina = ref(1);
const acabou = ref(false);

// -----------------------------------------
// 🔥 PEGANDO TODAS AS IMAGENS DOS ARTEFATOS
// -----------------------------------------
function montarListaDeImagens() {
  const lista = [];

  artefatosStore.artefatos.forEach((artefato) => {
    artefato.images.forEach((img) => {
      lista.push({
        id_artefato: artefato.id,
        name: artefato.name,
        raw_material: artefato.raw_material?.name,
        sub_type: artefato.sub_type?.name,
        url: img.url_photo,
        public_id: img.public_id_cloudinary,
      });
    });
  });

  return lista;
}

// -----------------------------------------
// 🔥 FUNÇÃO DE PAGE LOAD (APENAS SIMULAÇÃO)
// -----------------------------------------
async function carregarImagens() {
  if (carregando.value || acabou.value) return;
  carregando.value = true;

  const todas = montarListaDeImagens();

  // simula paginação carregando apenas 6 por vez
  const inicio = (pagina.value - 1) * 6;
  const fim = pagina.value * 6;
  const lote = todas.slice(inicio, fim);

  if (lote.length === 0) {
    acabou.value = true;
  } else {
    imagens.value.push(...lote);
    pagina.value++;
  }

  carregando.value = false;
}

// -----------------------------------------
// 🔥 CLICK NA IMAGEM → VAI PARA O ARTEFATO
// -----------------------------------------
function abrirArtefato(id) {
  router.push(`/artefact/${id}`);
}

// scroll infinito
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 300) {
    carregarImagens();
  }
});

onMounted(() => {
  carregarImagens();
});
</script>

<template>
  <div class="masonry" v-motion-slide-visible-once-bottom :delay="300" :duration="500">
    <div 
      class="item" 
      v-for="img in imagens" 
      :key="img.public_id"
      @click="abrirArtefato(img.id_artefato)"
    >
      <img :src="img.url" :alt="img.name" />
      
      <!-- legenda opcional -->
      <div class="overlay">
        <h3>{{ img.name }}</h3>
        <p>{{ img.raw_material }} → {{ img.sub_type }}</p>
      </div>
    </div>

    <div v-if="carregando" class="loading-indicator">
      Carregando mais...
    </div>

    <div v-if="acabou" class="end-indicator">
      Fim das imagens.
    </div>
  </div>
</template>

<style scoped>
@import '@/assets/sass/exhibitions/_galleryExhibitions.scss';

/* extra opcional (caso queira overlay suave) */
.item {
  position: relative;
  cursor: pointer;
  transition: 0.3s;
}

.item:hover {
  transform: scale(1.02);
}

.overlay {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 8px;
  background: linear-gradient(transparent, rgba(0,0,0,0.7));
  color: #fff;
  opacity: 0;
  transition: 0.3s;
}

.item:hover .overlay {
  opacity: 1;
}
.masonry {
  column-count: 4!important;
  column-gap: 1rem;
}

</style>
