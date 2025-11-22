<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const imagens = ref([]);
const pagina = ref(1);
const carregando = ref(false);
const acabou = ref(false);

// --------------------------------------------------------------------------------
// JSON DE MOCK (DESCOMENTE PARA USAR EM VEZ DA API)

const mockImagens = [
  { attachment_key: "mock-1", url: "https://picsum.photos/400/600", description: "Mock Imagem 1" },
  { attachment_key: "mock-2", url: "https://picsum.photos/600/400", description: "Mock Imagem 2" },
  { attachment_key: "mock-3", url: "https://picsum.photos/500/800", description: "Mock Imagem 3" },
  { attachment_key: "mock-4", url: "https://picsum.photos/800/500", description: "Mock Imagem 4" },
  { attachment_key: "mock-5", url: "https://picsum.photos/450/700", description: "Mock Imagem 5" },
  { attachment_key: "mock-6", url: "https://picsum.photos/700/450", description: "Mock Imagem 6" },
  { attachment_key: "mock-7", url: "https://picsum.photos/550/900", description: "Mock Imagem 7" },
  { attachment_key: "mock-8", url: "https://picsum.photos/900/550", description: "Mock Imagem 8" },
  { attachment_key: "mock-9", url: "https://picsum.photos/420/680", description: "Mock Imagem 9" },
  { attachment_key: "mock-10", url: "https://picsum.photos/680/420", description: "Mock Imagem 10" },
];

// --------------------------------------------------------------------------------


// função para carregar imagens do backend
async function carregarImagens() {
  if (carregando.value || acabou.value) return;
  carregando.value = true;

  try {
    // --------------------------------------------------------------------------------
    // LÓGICA DA API (DEIXE COMENTADO PARA USAR O MOCK)
    // const response = await axios.get(`media/images/?descricao=1&page=${pagina.value}`);
    // const novosDados = response.data.results || response.data;
    // --------------------------------------------------------------------------------

    // --------------------------------------------------------------------------------
    // LÓGICA DO MOCK (DESCOMENTE A LINHA ABAIXO PARA USAR O MOCK)
    const novosDados = mockImagens;
    // --------------------------------------------------------------------------------

    if (novosDados.length === 0) {
      acabou.value = true;
    } else {
      imagens.value.push(...novosDados);
      // No modo mock, incrementamos a página apenas para simular,
      // mas os dados serão sempre os mesmos.
      pagina.value++;
      
      // No modo mock, se a página for maior que 1, simulamos o fim dos dados
      // para evitar loop infinito com os dados estáticos do mock.
      // if (pagina.value > 1 && mockImagens) {
      //   acabou.value = true;
      // }
    }
  } catch (err) {
    console.error("Erro ao carregar imagens:", err);
    // Se ocorrer um erro com a API, você pode adicionar uma lógica aqui
    // para tentar carregar o mock como fallback, se desejar.
  } finally {
    carregando.value = false;
  }
}
// infinite scroll
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >=
    document.body.offsetHeight - 300
  ) {
    carregarImagens();
  }
});

onMounted(() => {
  carregarImagens();
});
</script>

<template>
  <div class="masonry" v-motion-slide-visible-once-bottom :delay="300" :duration="500">
    <div class="item" v-for="img in imagens" :key="img.attachment_key">
      <img :src="img.url" :alt="img.description || 'imagem'" />
    </div>
    <div v-if="carregando && pagina > 1" class="loading-indicator">Carregando mais...</div>
    <div v-else-if="acabou" class="end-indicator">Fim das imagens.</div>
    
  </div>
</template>
<style scoped>
@import '@/assets/sass/exhibitions/_galleryExhibitions.scss';
</style>