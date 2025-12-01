<template>
    <ManagerLayout pageTitle="Mapas interativos" >
        <div id="app">
            <header class="header">
                <div class="header-content">
                    <h1>Mapa Interativo de Sambaquis</h1>
                    <p>Explore parques e reservas naturais com indícios de sambaqui no Brasil</p>
                </div>
            </header>

            <div class="main-content">
                <div class="map-container">
                    <div id="map"></div>
                </div>

                <!-- Sidebar -->
                <aside class="sidebar">
                    <div class="sidebar-header">
                        <h2>Sítios Arqueológicos</h2>
                        <p>{{ locations.length }} locais</p>
                    </div>

                    <div class="locations-list">
                        <div v-for="location in locations" :key="location.id" class="location-item"
                            :class="{ active: selectedLocation && selectedLocation.id === location.id }"
                            @click="selectLocation(location)">
                            <div class="location-marker"></div>
                            <div class="location-info">
                                <h3>{{ location.name }}</h3>
                                <p class="park-name">{{ location.park }}</p>
                                <p class="state">{{ location.state }}</p>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    </ManagerLayout>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import ManagerLayout from '@/layouts/ManagerLayout.vue';

// Dados dos sambaquis
const locations = ref([
    {
        id: "1",
        name: "Sambaqui do Rio Comprido",
        lat: -28.2769,
        lng: -48.8486,
        park: "Parque Estadual da Serra Geral",
        state: "SC",
        description: "Sítio arqueológico com restos de sambaqui pré-histórico",
    },
    {
        id: "2",
        name: "Sambaqui de Araçá",
        lat: -23.8241,
        lng: -45.4144,
        park: "Reserva da Biosfera da Mata Atlântica",
        state: "SP",
        description: "Importante sítio arqueológico costeiro",
    },
    {
        id: "3",
        name: "Sambaqui da Barra do Saí",
        lat: -29.0452,
        lng: -49.5231,
        park: "Parque Estadual da Lagoa do Peri",
        state: "SC",
        description: "Depósito conchífero com artefatos cerâmicos",
    },
    {
        id: "4",
        name: "Sambaqui de Cabeçuda",
        lat: -28.2769,
        lng: -48.6486,
        park: "Área de Proteção Ambiental da Lagoa",
        state: "SC",
        description: "Um dos maiores sambaquis do sul do Brasil",
    },
    {
        id: "5",
        name: "Sambaqui do Forte",
        lat: -23.9505,
        lng: -46.3056,
        park: "Parque Estadual da Ilha do Cardoso",
        state: "SP",
        description: "Sítio com evidências de ocupação humana antiga",
    },
    {
        id: "6",
        name: "Sambaqui da Praia Grande",
        lat: -28.4789,
        lng: -48.7234,
        park: "Reserva Particular do Patrimônio Natural",
        state: "SC",
        description: "Depósito arqueológico com restos de fauna marinha",
    },
    {
        id: "7",
        name: "Sambaqui do Morro Azul",
        lat: -27.1123,
        lng: -48.5321,
        park: "Parque Estadual do Morro Azul",
        state: "SC",
        description: "Sítio com conchas fossilizadas e restos de cerâmica antiga",
    },
    {
        id: "8",
        name: "Sambaqui de Guaratuba",
        lat: -25.8720,
        lng: -48.5580,
        park: "Reserva Ambiental de Guaratuba",
        state: "PR",
        description: "Depósito arqueológico com vestígios de ocupação indígena",
    },
    {
        id: "9",
        name: "Sambaqui da Praia do Forte",
        lat: -23.8120,
        lng: -45.4170,
        park: "Parque Estadual da Praia do Forte",
        state: "SP",
        description: "Acúmulo de conchas e restos de fauna marinha pré-histórica",
    },
    {
        id: "10",
        name: "Sambaqui do Rio do Meio",
        lat: -26.5250,
        lng: -48.9220,
        park: "Parque Natural do Rio do Meio",
        state: "SC",
        description: "Sítio com ossos e cerâmicas antigos",
    },
    {
        id: "11",
        name: "Sambaqui do Litoral Norte",
        lat: -23.4220,
        lng: -45.6020,
        park: "Reserva da Mata Atlântica",
        state: "SP",
        description: "Depósito costeiro com vestígios de fauna e ferramentas de pedra",
    },
    {
        id: "12",
        name: "Sambaqui do Canto Verde",
        lat: -28.7860,
        lng: -48.9140,
        park: "Área de Proteção Ambiental Canto Verde",
        state: "SC",
        description: "Grande concentração de conchas e fragmentos arqueológicos",
    },
    {
        id: "13",
        name: "Sambaqui da Ilha do Sol",
        lat: -23.9520,
        lng: -46.3100,
        park: "Parque Estadual da Ilha do Sol",
        state: "SP",
        description: "Depósitos de conchas e vestígios de pesca antiga",
    },
    {
        id: "14",
        name: "Sambaqui do Morro do Meio",
        lat: -27.5560,
        lng: -48.8350,
        park: "Parque Estadual Morro do Meio",
        state: "SC",
        description: "Sítio arqueológico com restos de habitações indígenas",
    },
    {
        id: "15",
        name: "Sambaqui de Itapoá",
        lat: -26.1250,
        lng: -48.6370,
        park: "Reserva Ecológica de Itapoá",
        state: "SC",
        description: "Depósito com conchas, ossos e cerâmicas pré-históricas",
    },
    {
        id: "16",
        name: "Sambaqui do Forte Velho",
        lat: -23.9920,
        lng: -46.3420,
        park: "Parque Estadual Forte Velho",
        state: "SP",
        description: "Sítio costeiro com vestígios arqueológicos de ocupação humana antiga",
    },
    {
        id: "17",
        name: "Sambaqui do Cassino",
        lat: -32.1650,
        lng: -52.1120,
        park: "Parque Natural do Cassino",
        state: "RS",
        description: "Depósito pré-histórico com conchas e ossos marinhos",
    },
    {
        id: "18",
        name: "Sambaqui de Tramandaí",
        lat: -29.9350,
        lng: -50.0880,
        park: "Reserva Ambiental de Tramandaí",
        state: "RS",
        description: "Vestígios de habitação indígena antiga",
    },
    {
        id: "19",
        name: "Sambaqui de São Francisco do Sul",
        lat: -26.2470,
        lng: -48.6480,
        park: "Parque Histórico e Natural",
        state: "SC",
        description: "Conjunto de conchas e fragmentos arqueológicos costeiros",
    },
    {
        id: "20",
        name: "Sambaqui de Paraty",
        lat: -23.2180,
        lng: -44.7100,
        park: "Parque Nacional da Serra da Bocaina",
        state: "RJ",
        description: "Depósitos costeiros com artefatos cerâmicos",
    },
    {
        id: "21",
        name: "Sambaqui de Mangaratiba",
        lat: -23.0140,
        lng: -44.5250,
        park: "Reserva Ambiental da Costa Verde",
        state: "RJ",
        description: "Sítio arqueológico com restos de fauna marinha",
    },
    {
        id: "22",
        name: "Sambaqui da Barra de Itapoan",
        lat: -12.9010,
        lng: -38.3210,
        park: "Reserva Marinha de Itapoan",
        state: "BA",
        description: "Depósito pré-histórico costeiro com conchas e fragmentos",
    },
    {
        id: "23",
        name: "Sambaqui do Forte Orange",
        lat: -9.4630,
        lng: -35.7960,
        park: "Área de Proteção Ambiental Forte Orange",
        state: "AL",
        description: "Vestígios arqueológicos de ocupação antiga",
    },
    {
        id: "24",
        name: "Sambaqui de Ipojuca",
        lat: -8.5010,
        lng: -35.0070,
        park: "Reserva Ambiental de Ipojuca",
        state: "PE",
        description: "Depósito de conchas e ossos com cerâmica antiga",
    },
    {
        id: "25",
        name: "Sambaqui do Cabo de Santo Agostinho",
        lat: -8.2800,
        lng: -35.0070,
        park: "Parque Histórico Cabo de Santo Agostinho",
        state: "PE",
        description: "Sítio arqueológico costeiro com vestígios indígenas",
    },
    {
        id: "26",
        name: "Sambaqui de Itapuã",
        lat: -12.9400,
        lng: -38.4560,
        park: "Parque Ambiental de Itapuã",
        state: "BA",
        description: "Acúmulo de conchas e artefatos cerâmicos antigos",
    },
    {
        id: "27",
        name: "Sambaqui do Litoral Norte de SP",
        lat: -23.7520,
        lng: -45.5180,
        park: "Parque Estadual Litoral Norte",
        state: "SP",
        description: "Sítio arqueológico com restos de pesca e conchas",
    },
    {
        id: "28",
        name: "Sambaqui do Rio Itanhaém",
        lat: -24.1770,
        lng: -46.7900,
        park: "Reserva Ambiental do Rio Itanhaém",
        state: "SP",
        description: "Depósito pré-histórico costeiro com ossos e conchas",
    },
    {
        id: "29",
        name: "Sambaqui da Praia do Rosa",
        lat: -28.5420,
        lng: -48.6350,
        park: "Parque Ambiental Praia do Rosa",
        state: "SC",
        description: "Sítio arqueológico com fragmentos de cerâmica e ossos",
    },
    {
        id: "30",
        name: "Sambaqui do Rio Tavares",
        lat: -27.6200,
        lng: -48.5190,
        park: "Área de Proteção Ambiental Rio Tavares",
        state: "SC",
        description: "Depósito costeiro com conchas e restos marinhos",
    },
    {
        id: "31",
        name: "Sambaqui da Praia do Forte (BA)",
        lat: -12.5840,
        lng: -38.0060,
        park: "Reserva Marinha Praia do Forte",
        state: "BA",
        description: "Sítio arqueológico com conchas e vestígios de pesca",
    },
    {
        id: "32",
        name: "Sambaqui de Guarujá",
        lat: -23.9930,
        lng: -46.2570,
        park: "Parque Estadual do Guarujá",
        state: "SP",
        description: "Depósito arqueológico costeiro com fragmentos de cerâmica",
    },
    {
        id: "33",
        name: "Sambaqui de Picinguaba",
        lat: -23.3330,
        lng: -45.0130,
        park: "Parque Nacional da Serra da Bocaina",
        state: "SP",
        description: "Sítio arqueológico com restos de fauna marinha",
    },
    {
        id: "34",
        name: "Sambaqui de Cananéia",
        lat: -25.0200,
        lng: -47.9560,
        park: "Parque Estadual de Cananéia",
        state: "SP",
        description: "Depósito pré-histórico com conchas e cerâmica antiga",
    },
    {
        id: "35",
        name: "Sambaqui do Farol de Santa Marta",
        lat: -28.8680,
        lng: -48.6340,
        park: "Reserva Ambiental Farol de Santa Marta",
        state: "SC",
        description: "Sítio arqueológico costeiro com restos de cerâmica",
    },
    {
        id: "36",
        name: "Sambaqui de Arraial do Cabo",
        lat: -22.9650,
        lng: -42.0240,
        park: "Parque Natural Arraial do Cabo",
        state: "RJ",
        description: "Depósito costeiro com ossos e vestígios de habitação",
    },
    {
        id: "37",
        name: "Sambaqui de Maragogi",
        lat: -9.0020,
        lng: -35.7700,
        park: "Reserva Marinha de Maragogi",
        state: "AL",
        description: "Sítio arqueológico costeiro com conchas e fragmentos de ossos",
    },
    {
        id: "38",
        name: "Sambaqui de Praia do Rosa Norte",
        lat: -28.5410,
        lng: -48.6300,
        park: "Parque Ambiental Praia do Rosa Norte",
        state: "SC",
        description: "Depósito pré-histórico costeiro com cerâmicas e conchas",
    },
    {
        id: "39",
        name: "Sambaqui do Rio Perequê",
        lat: -23.9030,
        lng: -46.2920,
        park: "Parque Estadual do Rio Perequê",
        state: "SP",
        description: "Sítio arqueológico com restos de fauna marinha",
    },
    {
        id: "40",
        name: "Sambaqui da Praia de Itaparica",
        lat: -12.8640,
        lng: -38.6880,
        park: "Reserva Ambiental de Itaparica",
        state: "BA",
        description: "Depósito costeiro com conchas e vestígios de cerâmica",
    }
]);

const selectedLocation = ref(null);
const map = ref(null);
const currentPopup = ref(null);

onMounted(() => {
    initMap();
});

function initMap() {
    const center = [-14.2350, -51.9253]; // Brasil
    map.value = L.map('map').setView(center, 5);

    // Tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 19,
    }).addTo(map.value);

    // Marcadores
    locations.value.forEach(location => {
        const marker = L.circleMarker([location.lat, location.lng], {
            radius: 8,
            fillColor: "#BFA78D",
            color: "#fff",
            weight: 2,
            opacity: 1,
            fillOpacity: 0.8,
        }).addTo(map.value);

        const popupContent = `
      <h3>${location.name}</h3>
      <p><strong>Parque/Reserva:</strong> ${location.park}</p>
      <p><strong>Estado:</strong> ${location.state}</p>
      <p><strong>Descrição:</strong> ${location.description}</p>
      <p><strong>Coordenadas:</strong> ${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}</p>
    `;
        marker.bindPopup(popupContent);

        marker.on('click', () => selectLocation(location));

        location.marker = marker;
    });
}

function selectLocation(location) {
    selectedLocation.value = location;
    if (location.marker) {
        if (currentPopup.value) {
            currentPopup.value.closePopup();
        }
        location.marker.openPopup();
        currentPopup.value = location.marker;

        map.value.setView([location.lat, location.lng], 8, { animate: true, duration: 0.5 });
    }
}
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

html,
body {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #1e1e1e;
    color: #fff;
    height: 100%;
}

#app {
    display: flex;
    flex-direction: column;
    height: 84.7vh;
    background-color: #1e1e1e;
}

/* Header */
.header {
    background-color: #1e1e1e;
    border-bottom: 1px solid #414141;
    padding: 2rem 1rem;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);

    .header-content {
        max-width: 1400px;
        margin: 0 auto;
        text-align: center;

        h1 {
            color: #fff;
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.75rem;
            letter-spacing: -0.5px;
        }

        p {
            font-size: 1rem;
            opacity: 0.95;
            color: #aaa;
            font-weight: 300;
        }
    }
}

/* Main Content */
.main-content {
    display: flex;
    flex: 1;
    max-width: 1400px;
    margin: 0 auto;
    width: 100%;
    max-height: 70vh;

    .map-container {
        flex: 1;
        background-color: #333;
        border-right: 1px solid #414141;
        position: relative;
        overflow: hidden;

        #map {
            width: 60vw;
            height: 70vh;
        }
    }

    .sidebar {
        width: 350px;
        background-color: #333;
        border-left: 1px solid #414141;
        display: flex;
        flex-direction: column;
        overflow: hidden;

        .sidebar-header {
            padding: 1.5rem;
            border-bottom: 1px solid #414141;
            background-color: #1e1e1e;

            h2 {
                font-size: 1.25rem;
                color: #fff;
                font-weight: 600;
                margin-bottom: 0.5rem;
            }

            p {
                font-size: 0.875rem;
                color: #BFA78D;
                font-weight: 500;
                margin: 0;
            }
        }

        .locations-list {
            flex: 1;
            overflow-y: auto;
            padding: 0;

            &::-webkit-scrollbar {
                width: 6px;
            }

            &::-webkit-scrollbar-track {
                background-color: #333;
            }

            &::-webkit-scrollbar-thumb {
                background-color: #414141;
                border-radius: 3px;
            }

            &::-webkit-scrollbar-thumb:hover {
                background-color: #BFA78D;
            }

            .location-item {
                display: flex;
                gap: 1rem;
                padding: 1rem;
                border-bottom: 1px solid #414141;
                cursor: pointer;
                transition: all 0.3s ease;
                background-color: #333;

                &:hover {
                    background-color: #1e1e1e;
                }

                &.active {
                    background-color: #1e1e1e;
                    border-left: 3px solid #BFA78D;
                    padding-left: calc(1rem - 3px);

                    .location-marker {
                        background-color: #BFA78D;
                        box-shadow: 0 0 8px rgba(191, 167, 141, 0.5);
                        opacity: 1;
                    }

                    h3 {
                        color: #BFA78D;
                    }
                }

                .location-marker {
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background-color: #BFA78D;
                    flex-shrink: 0;
                    margin-top: 0.25rem;
                    transition: all 0.3s ease;
                    opacity: 0.6;
                }

                .location-info {
                    flex: 1;
                    min-width: 0;

                    h3 {
                        font-size: 0.95rem;
                        font-weight: 600;
                        margin-bottom: 0.25rem;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        transition: color 0.3s ease;
                        color: #fff;
                    }

                    .park-name {
                        font-size: 0.8rem;
                        color: #aaa;
                        margin-bottom: 0.25rem;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                    }

                    .state {
                        font-size: 0.75rem;
                        color: #BFA78D;
                        font-weight: 500;
                    }
                }
            }
        }
    }
}

/* Footer */
.footer {
    background-color: #1e1e1e;
    border-top: 1px solid #414141;
    padding: 1.5rem;
    text-align: center;
    color: #aaa;
    font-size: 0.875rem;
}

/* Leaflet Popup */
.leaflet-popup-content-wrapper {
    background-color: #333 !important;
    color: #fff !important;
    border-radius: 8px !important;
}

.leaflet-popup-content h3 {
    color: #BFA78D !important;
    margin-bottom: 0.75rem !important;
}

.leaflet-popup-content p {
    margin: 0.5rem 0 !important;
    line-height: 1.5 !important;
}

.leaflet-popup-content strong {
    color: #BFA78D !important;
}

/* Responsive */
@media (max-width: 1024px) {
    .main-content {
        flex-direction: column;
    }

    .map-container {
        min-height: 400px;
        border-right: none;
        border-bottom: 1px solid #414141;
    }

    .sidebar {
        width: 100%;
        border-left: none;
        border-top: 1px solid #414141;
        max-height: 300px;
    }
}

@media (max-width: 768px) {
    .header h1 {
        font-size: 1.75rem;
    }

    .header p {
        font-size: 0.9rem;
    }

    .map-container {
        min-height: 300px;
    }

    .sidebar {
        max-height: 250px;
    }

    .location-item {
        padding: 0.75rem;
    }

    .location-info h3 {
        font-size: 0.85rem;
    }
}

.sidebar {
    width: 350px;
    background-color: #333;
    border-left: 1px solid #414141;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 70vh;

    .sidebar-header {
        padding: 1.5rem;
        border-bottom: 1px solid #414141;
        background-color: #1e1e1e;
    }

    .locations-list {
        flex: 1;
        /* ocupa toda a altura restante */
        overflow-y: auto;
        /* habilita scroll vertical */
        padding: 0;

        max-height: calc(100vh - 100px);
        /* define limite máximo de altura */

        &::-webkit-scrollbar {
            width: 6px;
        }

        &::-webkit-scrollbar-track {
            background-color: #333;
        }

        &::-webkit-scrollbar-thumb {
            background-color: #414141;
            border-radius: 3px;
        }

        &::-webkit-scrollbar-thumb:hover {
            background-color: #BFA78D;
        }
    }
}
</style>
