<template>
  <page-layout>
    <main class="main-page">

      <!-- Banner principal -->
      <div class="main-banner">
        <div>
          <h1 class="main-title" v-motion-slide-visible-left :delay="300" :duration="800">
            ACERVO ARQUEOLÓGICO
          </h1>

          <h2 class="main-subtitle" v-motion-slide-visible-left :delay="300" :duration="800">
            Um projeto de modernização de dados que padroniza, unifica e rastreia mais de 100 mil artefatos.
          </h2>

          <router-link 
            to="/acervo" 
            class="guide-button" 
            v-motion-slide-visible-left 
            :delay="300" 
            :duration="800"
          >
            VER ACERVO
          </router-link>
        </div>

        <div class="skulls" v-motion-slide-visible-once-bottom :delay="500" :duration="800">
          <img src="../assets/img/caveira1.png" />
          <img src="../assets/img/caveira2.png" />
        </div>
      </div>

      <!-- 3 artefatos do backend -->
      <div class="main-artefacts">
        <div 
          v-for="item in artefatosStore.artefatos.slice(0, 3)" 
          :key="item.id" 
          class="item"
        >
          <SlideComponent
            @click="router.push(`/artefact/${item.id}`)"
            :id="item.id"
            :nome="item.name"
            :codigo="item.id"
            :material="item.raw_material?.name || '—'"
            :subtitulo="item.sub_type?.name || '—'"
            :img="item.images?.length ? item.images[0].url_photo : ''"
          />
        </div>
      </div>

      <!-- Mapa + imagem interativa -->
      <!-- <div class="main-banner">
        <div class="image-interact">
          <img src="../assets/img/home_interaction_image.png" alt="" />

          <div
            v-for="point in listPoints"
            :key="point.id"
            class="point"
            :style="{ top: point.top, left: point.left }"
            @mouseover="showInfo(point.id)"
          ></div>
        </div>
      </div> -->

      <div class="flex">
        <MapaComponent />
      </div>

    </main>
  </page-layout>
</template>

<script setup>
import { onMounted, ref } from "vue"
import { useRouter } from "vue-router"
import PageLayout from "@/layouts/PageLayout.vue"
import SlideComponent from "@/components/acervo/SlideComponent.vue"
import MapaComponent from "@/components/mapa/MapaComponent.vue"
import { useArtefatosStore } from "@/stores/artefatosStore"

const router = useRouter()
const artefatosStore = useArtefatosStore()

// 🔥 Carrega 5 artefatos ao abrir a Home
onMounted(async () => {
  try {
    await artefatosStore.fetchAll(5, 1)
  } catch (e) {
    console.error("Erro ao carregar artefatos:", e)
  }
})

const listPoints = ref([
  { id: 1, top: "40px", left: "600px", info: "Texto de informação 1" },
])

function showInfo(id) {
  const point = listPoints.value.find((p) => p.id === id)
  if (point) alert(point.info)
}
</script>

<style scoped>
@import "@/assets/sass/home/_homeView.scss";

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.image-interact {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}

.image-interact .point {
  width: 20px;
  height: 20px;
  background-color: #5d5e5b;
  border: 1px solid #d9d9d9;
  border-radius: 50%;
  position: absolute;
}

.card {
  width: 350px;
}
</style>
