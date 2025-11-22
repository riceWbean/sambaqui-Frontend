<script setup>
import { onMounted } from 'vue'
// import { useRouter } from 'vue-router'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// const router = useRouter()

// -------- LISTA COMPLETA DE LOCAIS --------
const locais = [
  {
    nome: "Museu do Sambaqui",
    descricao: "O principal ponto arqueológico urbano de Joinville.",
    lat: -26.2964648,
    lon: -48.8429115,
    rota: "/local/museu-sambaqui",
    imagem: "/imagens/museu-sambaqui.png"
  },
  {
    nome: "Sambaqui Morro do Ouro",
    descricao: "Importante sítio arqueológico com vista elevada da região.",
    lat: -26.314582785414053,
    lon: -48.82787405563743,
    rota: "/local/morro-do-ouro",
    imagem: "/imagens/morro-ouro.png"
  },
  {
    nome: "Sambaqui Cubatão 1",
    descricao: "Sítio arqueológico importante no bairro Cubatão.",
    lat: -26.223454994243866,
    lon: -48.78351830794846,
    rota: "/local/cubatao-1",
    imagem: "/imagens/cubatao-1.png"
  },
  {
    nome: "Sambaqui Ilha dos Espinheiros IV",
    descricao: "Sambaqui localizado na área da Baía da Babitonga.",
    lat: -26.28526226103773,
    lon: -48.786937839594145,
    rota: "/local/espinheiros",
    imagem: "/imagens/espinheiros.png"
  },
  {
    nome: "Ilha do Morro do Amaral",
    descricao: "Região insular com rica história e biodiversidade.",
    lat: -26.301081009390963,
    lon: -48.76402505624275,
    rota: "/local/morro-do-amaral",
    imagem: "/imagens/morro-amaral.png"
  }
]

// -------- FUNÇÃO PARA CRIAR ÍCONES --------
function criarIcone(imagem) {
  return L.divIcon({
    html: `
      <div style="
        width: 55px;
        height: 55px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
      ">
        <img src="${imagem}" style="width:100%; height:100%; object-fit:cover;"/>
      </div>
    `,
    className: '',
    iconSize: [55, 55],
    iconAnchor: [27, 55]
  })
}

onMounted(() => {
  // cria o mapa
  window.map = L.map("map").setView([-26.290, -48.820], 12)

  L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png", {
    attribution: "© CARTO | © OpenStreetMap"
  }).addTo(window.map)

  // ---------- ADICIONAR TODOS OS LOCAIS ----------
  
  locais.forEach(local => {
    const marker = L.marker([local.lat, local.lon], {
      icon: criarIcone(local.imagem)
    }).addTo(window.map)

    // POPUP BONITO COM IMAGEM + NOME + DESCRIÇÃO + BOTÃO
    const popupHTML = `
      <div style="
          width: 180px;
          font-family: Arial;
      ">
        <img src="${local.imagem}" style="
            width: 100%;
            height: 110px;
            object-fit: cover;
            border-radius: 6px;
            margin-bottom: 6px;
        "/>

        <h3 style="
            margin: 0;
            font-size: 16px;
            font-weight: bold;
        ">${local.nome}</h3>

        <p style="
            margin: 5px 0 10px;
            font-size: 13px;
            color: #444;
        ">${local.descricao}</p>

      </div>
    `

    marker.bindPopup(popupHTML)

    // clique também pode redirecionar (se quiser)
    // marker.on("click", () => {
    //   router.push(local.rota)
    // })
  })
})
</script>
<template>
  <div>
    <h1>SAMBAQUIS EM JOINVILLE</h1>
    <p>Encontre no mapa abaixo os pricipais Sambaquis do municipio de Joinville, Santa Catarina!</p>
  </div>

  <div id="map"></div>
</template>
<style scoped>
p{
    width: 100%;
}
h1{
        text-align: center;
        margin: 30px;
        color: #FFF;
        font-weight: 400;
        font-size: 32px;
    }
#map {
  height: 400px;
  width: 1000px;
  margin-top: 10px;
}
</style> 