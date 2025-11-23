<script setup>
import { onMounted, ref } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// CAMPOS DO FORMULÁRIO
const rua = ref("")
const numero = ref("")
const cidade = ref("")
const estado = ref("SC") 
const latitude = ref(null)
const longitude = ref(null)

const estados = [
  "AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG",
  "PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"
]

// ÍCONES
const iconMuseuSambaqui = L.divIcon({
  html: `
    <div style="width: 60px; height: 60px; overflow: hidden; box-shadow: 0 0 10px rgba(0,0,0,0.3);">
      <img src="/imagens/museu.png" style="width:100%; height:100%; object-fit:cover;"/>
    </div>
  `,
  className: '',
  iconSize: [60, 60],
  iconAnchor: [30, 60]
})

const casaUsuario = L.divIcon({
  html: `
    <div style="width:65px; height:65px; overflow:hidden; box-shadow:0 0 10px rgba(0,0,0,0.3);">
      <img src="/imagens/casa.png" style="width:100%; height:100%; object-fit:cover;"/>
    </div>
  `,
  className: '',
  iconSize: [60, 60],
  iconAnchor: [30, 60]
})

// INICIALIZA MAPA
onMounted(() => {
  window.map = L.map('map').setView([-26.2925984, -48.8486605], 16)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
    attribution: '&copy; CARTO | © OpenStreetMap'
  }).addTo(window.map)

  L.marker([-26.2964648, -48.8429115], { icon: iconMuseuSambaqui }).addTo(window.map)
})

// BUSCA COORDENADAS
async function buscarCoordenadas() {
  if (!rua.value || !numero.value || !cidade.value || !estado.value) {
    alert("Preencha rua, número, cidade e estado")
    return
  }

  const endereco = `${rua.value}, ${numero.value}, ${cidade.value}, ${estado.value}`
  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(endereco)}`

  const response = await fetch(url)
  const data = await response.json()

  if (data.length > 0) {
    latitude.value = parseFloat(data[0].lat)
    longitude.value = parseFloat(data[0].lon)

    const markerMuseu = L.marker([-26.2964648, -48.8429115], { icon: iconMuseuSambaqui }).addTo(window.map)
    const markerUser = L.marker([latitude.value, longitude.value], { icon: casaUsuario }).addTo(window.map)

    window.map.setView([latitude.value, longitude.value], 16)

    // linha ligando os dois
    L.polyline(
      [markerMuseu.getLatLng(), markerUser.getLatLng()],
      { color: '#2E2E2E', weight: 4 }
    ).addTo(window.map)
  } else {
    alert("Endereço não encontrado")
  }
}
</script>

<template>
  <div class="distanceContainer">

    <div class="distanceForm">
      <h2>Descubra sua distância até o Museu</h2>

      <div class="inputs">
        <input type="text" placeholder="Rua" v-model="rua" />
        <input type="number" placeholder="Número" v-model="numero" />
        <input type="text" placeholder="Cidade" v-model="cidade" />

        <select v-model="estado">
          <option value="" disabled>Estado (UF)</option>
          <option v-for="uf in estados" :key="uf" :value="uf">{{ uf }}</option>
        </select>
      </div>

      <button @click="buscarCoordenadas">
        Calcular Distância
      </button>
    </div>

    <!-- MAPA -->
    <div class="map">
      <div id="map"></div>
    </div>

  </div>
</template>


<style scoped>
/* contêiner principal */
.distanceContainer{
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(43, 43, 43, 0.692);
    gap: 40px;
    height: auto;
    padding: 2rem;
    border-radius: 10px;
    flex-wrap: wrap;
}

/* coluna do formulário */
.distanceForm{
    display: flex;
    flex-direction: column;
    width: 350px;
    gap: 15px;
}

.distanceForm h2{
    font-size: 18px;
    font-weight: 500;
    color: #fff;
    text-align: center;
    margin: 10px;
}

.inputs{
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.inputs input,
.inputs select{
    border: none;
    border-radius: 5px;
    padding: 10px;
    font-size: 1em;
}

/* botão */
.distanceForm button{
    height: 2.4rem;
    background-color: #846247;
    border: none;
    color: #FFF;
    border-radius: 5px;
    cursor: pointer;
    transition: 0.2s;
}

.distanceForm button:hover{
    opacity: 0.8;
}

/* MAPA */
#map {
  height: 400px;
  width: 40vw;
  min-width: 320px;
  border-radius: 8px;
}

.map{
    display: flex;
    justify-content: center;
}

/* MOBILE */
@media (max-width: 900px){
  #map{
    width: 90vw;
  }
}
h2{
    font-size: 18px;
}
</style>
