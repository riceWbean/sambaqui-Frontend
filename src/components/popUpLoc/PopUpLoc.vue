<template>
    <Teleport to="body">
        <div v-if="isOpen" class="popup-overlay" @click.self="fecharDirecto">
            <div class="popup">
                <div class="popup-header">
                    <h2>Definir Localização</h2>
                    <button class="close-btn" @click="fecharDirecto">✕</button>
                </div>

                <p v-if="loading" class="loading">Obtendo localização...</p>

                <p v-if="erro" class="erro">{{ erro }}</p>

                <div v-if="coords" class="coords-display">
                    <p class="coord-item" @click="copiarCoordenada">
                        <strong>Latitude:</strong> {{ coords.lat.toFixed(6) }}
                    </p>
                    <p class="coord-item" @click="copiarCoordenada">
                        <strong>Longitude:</strong> {{ coords.lng.toFixed(6) }}
                    </p>

                    <p class="texto-info" @click="copiarCoordenada">
                        Clique para copiar:
                        <strong>{{ coords.lat.toFixed(6) }}, {{ coords.lng.toFixed(6) }}</strong>
                    </p>

                    <p v-if="copiado" class="copiado-msg">✓ Coordenadas copiadas!</p>
                </div>

                <div class="button-group">
                    <button @click="obterLocalizacao" :disabled="loading" class="btn btn-primary">
                        {{ loading ? 'Obtendo...' : 'Obter Localização' }}
                    </button>
                    <button v-if="coords" @click="confirmarDirecto" class="btn btn-success">Confirmar</button>
                    <button @click="fecharDirecto" class="btn btn-secondary">{{ coords ? 'Cancelar' : 'Fechar' }}</button>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['update:modelValue', 'coordenadas'])

const isOpen = ref(false)
const coords = ref(null)
const erro = ref(null)
const loading = ref(false)
const copiado = ref(false)

// Sincroniza com o modelValue da HomeView
watch(() => props.modelValue, (newVal) => {
    isOpen.value = newVal
})

function obterLocalizacao() {
    loading.value = true
    erro.value = null
    coords.value = null
    copiado.value = false

    if (!navigator.geolocation) {
        erro.value = "Seu navegador não suporta geolocalização."
        loading.value = false
        return
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const latitude = pos.coords.latitude
            const longitude = pos.coords.longitude

            coords.value = { lat: latitude, lng: longitude }
            erro.value = null
            loading.value = false
        },
        (error) => {
            console.error('Erro de geolocalização:', error)
            
            if (error.code === error.PERMISSION_DENIED) {
                erro.value = "Permissão de localização negada. Verifique as configurações do seu navegador."
            } else if (error.code === error.POSITION_UNAVAILABLE) {
                erro.value = "Informação de localização não está disponível."
            } else if (error.code === error.TIMEOUT) {
                erro.value = "A solicitação de localização expirou."
            } else {
                erro.value = "Não foi possível obter sua localização."
            }
            
            loading.value = false
        }
    )
}

function copiarCoordenada() {
    if (coords.value) {
        const texto = `${coords.value.lat.toFixed(6)}, ${coords.value.lng.toFixed(6)}`
        navigator.clipboard.writeText(texto)
        copiado.value = true
        
        setTimeout(() => {
            copiado.value = false
        }, 2000)
    }
}

function confirmarDirecto() {
    if (coords.value) {
        emit('coordenadas', coords.value)
    }
    fecharDirecto()
}

function fecharDirecto() {
    coords.value = null
    erro.value = null
    loading.value = false
    copiado.value = false
    isOpen.value = false
    emit('update:modelValue', false)
}
</script>

<style scoped>
.popup-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }
    to {
        opacity: 1;
    }
}

.popup {
    background: #333;
    padding: 24px;
    border-radius: 12px;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.popup-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.popup-header h2 {
    margin: 0;
    font-size: 18px;
    color: #fff;
}

.close-btn {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #999;
    transition: color 0.3s ease;
    padding: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.close-btn:hover {
    color: #fff;
}

.loading {
    text-align: center;
    color: #bbb;
    font-style: italic;
}

.erro {
    color: #ff6b6b;
    background-color: #2c2c2c;
    padding: 12px;
    border-radius: 8px;
    border-left: 4px solid #d32f2f;
    margin: 12px 0;
}

.coords-display {
    background: #2c2c2c;
    padding: 16px;
    border-radius: 8px;
    margin: 16px 0;
}

.coord-item {
    margin: 8px 0;
    font-size: 14px;
    cursor: pointer;
    padding: 8px;
    border-radius: 6px;
    color: #fff;
    transition: all 0.2s ease;
}

.coord-item:hover {
    background-color: #3d3d3d;
    transform: translateX(4px);
}

.texto-info {
    margin-top: 12px !important;
    background: #3d4d5c !important;
    padding: 12px !important;
    border-radius: 8px !important;
    border-left: 4px solid #1976d2 !important;
    cursor: pointer !important;
    color: #fff !important;
    transition: all 0.2s ease !important;
}

.texto-info:hover {
    background: #4d5d6c !important;
    transform: translateX(4px) !important;
}

.copiado-msg {
    margin-top: 8px !important;
    color: #4caf50;
    font-weight: 600;
    text-align: center;
    animation: fadeIn 0.3s ease;
}

.button-group {
    display: flex;
    gap: 10px;
    flex-direction: column;
    margin-top: 20px;
}

.btn {
    padding: 10px 16px;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    font-weight: 500;
    transition: all 0.3s ease;
}

.btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-primary {
    background-color: #5D5E5B;
    color: white;
}

.btn-primary:hover:not(:disabled) {
    background-color: #3d3e3b;
    transform: translateY(-2px);
}

.btn-success {
    background-color: #4caf50;
    color: white;
}

.btn-success:hover {
    background-color: #45a049;
    transform: translateY(-2px);
}

.btn-secondary {
    background-color: #e0e0e0;
    color: #333;
}

.btn-secondary:hover {
    background-color: #d0d0d0;
}
</style>
