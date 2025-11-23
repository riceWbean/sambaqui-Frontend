<template>
    <div class="container">
        <header class="header">
            <h1>Distância até Museu Arqueológico de Sambaqui</h1>
            <p class="subtitle">Joinville, Santa Catarina</p>
        </header>

        <main class="main-content">
            <!-- Seção de Localização do Usuário -->
            <section class="location-section">
                <h2>Sua Localização</h2>

                <div class="location-input">
                    <button class="btn btn-primary" :disabled="carregando" @click="obterGeolocalização">
                        {{ carregando ? 'Obtendo localização...' : 'Usar Minha Localização' }}
                    </button>

                    <button class="btn btn-secondary" @click="usarCoordenadasTeste">
                        Usar coords teste
                    </button>

                    <div v-if="erro" class="erro-message">
                        {{ erro }}
                    </div>
                </div>

                <div class="coordenadas-form">
                    <div class="input-group">
                        <label>Latitude</label>
                        <input v-model.number="userLat" type="number" step="0.000001" placeholder="-26.2247" />
                    </div>
                    <div class="input-group">
                        <label>Longitude</label>
                        <input v-model.number="userLon" type="number" step="0.000001" placeholder="-48.8452" />
                    </div>
                </div>

                <div v-if="hasUserCoords" class="coords-display">
                    <p>
                        Sua localização:
                        <strong>{{ formatCoord(userLat) }}, {{ formatCoord(userLon) }}</strong>
                    </p>
                </div>
            </section>

            <!-- Seção do Museu -->
            <section class="museum-section">
                <h2>Museu Arqueológico de Sambaqui</h2>

                <div class="museum-card">
                    <div class="museum-info">
                        <h3>Sambaqui de Joinville</h3>
                        <p class="location">Joinville, Santa Catarina</p>
                        <p class="coords">{{ museuLat.toFixed(4) }}, {{ museuLon.toFixed(4) }}</p>
                    </div>

                    <div v-if="hasUserCoords" class="distance-display">
                        <div class="distance-value" :class="classeDistancia">
                            {{ distanciaDisplay }}
                            <span class="unit">km</span>
                        </div>
                    </div>

                    <div v-else class="sem-localizacao">
                        <p>Insira suas coordenadas ou use "Usar Minha Localização" para calcular a distância</p>
                    </div>
                </div>
            </section>

            <section v-if="hasUserCoords" class="mapa-section">
                <h2>Direção</h2>
                <a :href="linkGoogleMaps" target="_blank" class="btn btn-secondary">
                    Abrir no Google Maps
                </a>
            </section>
        </main>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'

// Coordenadas do Museu (constantes)
const museuLat = ref(-26.2247)
const museuLon = ref(-48.8452)

// Localização do usuário (inicialmente null)
const userLat = ref(null)
const userLon = ref(null)

// Estados
const carregando = ref(false)
const erro = ref(null)

// Função utilitária: checa se temos coords válidas
const hasUserCoords = computed(() => {
    return userLat.value !== null && userLon.value !== null && !Number.isNaN(userLat.value) && !Number.isNaN(userLon.value)
})

// Converter graus -> radianos
const toRad = (deg) => (deg * Math.PI) / 180

// Haversine (retorna distância em km)
const calcularDistancia = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // km
    const φ1 = toRad(lat1)
    const φ2 = toRad(lat2)
    const Δφ = toRad(lat2 - lat1)
    const Δλ = toRad(lon2 - lon1)

    const a = Math.sin(Δφ / 2) ** 2 + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
}

// Computed: distância (null se não há coords)
const distancia = computed(() => {
    if (!hasUserCoords.value) return null
    return calcularDistancia(userLat.value, userLon.value, museuLat.value, museuLon.value)
})

// Apresentação da distância (string segura)
const distanciaDisplay = computed(() => {
    if (distancia.value === null) return '--'
    return distancia.value.toFixed(2)
})

// Classe para estilizar a distância
const classeDistancia = computed(() => {
    if (distancia.value === null) return ''
    if (distancia.value <= 2) return 'perto'
    if (distancia.value <= 5) return 'medio'
    return 'longe'
})

// Label descritivo
const labelDistancia = computed(() => {
    if (distancia.value === null) return ''
    if (distancia.value <= 2) return 'Perto'
    if (distancia.value <= 5) return 'Médio'
    return '🔴 Longe'
})

// Link Google Maps (protege contra null)
const linkGoogleMaps = computed(() => {
    if (!hasUserCoords.value) return '#'
    return `https://www.google.com/maps/dir/${userLat.value},${userLon.value}/${museuLat.value},${museuLon.value}`
})

// Diferenças para detalhes (strings seguras)
const differenceLatDisplay = computed(() => {
    if (!hasUserCoords.value) return '--'
    return (museuLat.value - userLat.value).toFixed(4)
})
const differenceLonDisplay = computed(() => {
    if (!hasUserCoords.value) return '--'
    return (museuLon.value - userLon.value).toFixed(4)
})

// Formatação de coordenada segura para exibição
function formatCoord(val) {
    if (val === null || Number.isNaN(val)) return '--'
    return Number(val).toFixed(6)
}

// Obter geolocalização do navegador
const obterGeolocalização = () => {
    carregando.value = true
    erro.value = null

    if (!navigator.geolocation) {
        erro.value = 'Geolocalização não é suportada neste navegador.'
        carregando.value = false
        return
    }

    navigator.geolocation.getCurrentPosition(
        (position) => {
            userLat.value = position.coords.latitude
            userLon.value = position.coords.longitude
            carregando.value = false
            erro.value = null
        },
        (err) => {
            erro.value = 'Não foi possível obter sua localização. Permita o acesso ou digite manualmente.'
            carregando.value = false
            console.error('Geolocation error:', err)
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
        }
    )
}

// Botão de teste: carrega as coordenadas que você passou (-26.395129, -48.737448)
const usarCoordenadasTeste = () => {
    userLat.value = -26.395129
    userLon.value = -48.737448
    erro.value = null
}
</script>

<style scoped>
* {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
}

.container {
    max-width: 900px;
    margin: 2rem auto;
    padding: 20px;
    font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
    background-color: #333;
    min-height: 100vh;
}

.header {
    text-align: center;
    color: white;
    margin-bottom: 40px;
    padding: 20px;
}

.header h1 {
    font-size: 2.2rem;
    margin-bottom: 10px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
    font-size: 1.05rem;
    opacity: 0.9;
}

.main-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

section {
    background: #2E2E2E;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

section h2 {
    color: white;
    margin-bottom: 18px;
    font-size: 1.25rem;
    border-bottom: 3px solid #E4DFDB;
    padding-bottom: 10px;
}

.location-input {
    margin-bottom: 16px;
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.btn {
    padding: 10px 18px;
    border: none;
    border-radius: 8px;
    font-size: 0.98rem;
    font-weight: 600;
    cursor: pointer;
    transition: all .2s ease;
}

.btn-primary {
    background-color: #E4DFDB;
    color: #333;
}

.btn-primary[disabled] {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
}

.btn-secondary {
    background: #E4DFDB;
    color: #333;
}

.erro-message {
    background: #fff0f0;
    color: #c33;
    padding: 10px;
    border-radius: 8px;
    border-left: 4px solid #c33;
}

.coordenadas-form {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    margin-bottom: 12px;
}

.input-group label {
    font-weight: 600;
    color: #333;
    margin-bottom: 6px;
    display: block;
}

.input-group input {
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #e6e6e6;
    width: 100%;
}

.coords-display {
    background: #f0f4ff;
    padding: 12px;
    border-radius: 8px;
    color: #333;
    border-left: 4px solid #667eea;
    margin-top: 8px;
}

.museum-card {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    align-items: center;
}

.museum-info h3 {
    font-size: 1.25rem;
    color: white;
    margin-bottom: 6px;
}

.location {
    color: white;
    font-size: 0.95rem;
    margin-bottom: 10px;
}

.coords {
    color: white;
    font-family: monospace;
}

.distance-display {
    text-align: center;
    padding: 18px;
    background-color: #3f3f3f;
    border-radius: 12px;
    color: #fff;
}

.distance-value {
    font-size: 2.6rem;
    font-weight: 700;
    margin-bottom: 8px;
    display: inline-block;
    padding: 12px;
    border-radius: 8px;
}

.unit {
    font-size: 1rem;
    margin-left: 8px;
}

.distance-label {
    font-size: 1.05rem;
    font-weight: 600;
}

.sem-localizacao {
    text-align: center;
    padding: 30px;
    background: #f9fafb;
    border-radius: 8px;
    color: #666;
}

.detalhes-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 12px;
    margin-bottom: 12px;
}

.detalhe-item {
    background: #f9fafb;
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
}

.detalhe-item label {
    display: block;
    font-weight: 700;
    color: #667eea;
    margin-bottom: 6px;
    font-size: 0.82rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
}

.detalhe-item span {
    display: block;
    font-size: 1rem;
    color: #333;
    font-weight: 500;
}

.formula-info {
    background: #f0f4ff;
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #667eea;
    font-family: monospace;
}

.formula-info p {
    color: #333;
    margin-bottom: 8px;
    font-size: 0.9rem;
}

.mapa-section {
    text-align: center;
}

@media (max-width:768px) {
    .coordenadas-form {
        grid-template-columns: 1fr;
    }

    .museum-card {
        grid-template-columns: 1fr;
    }

    .distance-value {
        font-size: 1.8rem;
    }
}
</style>
