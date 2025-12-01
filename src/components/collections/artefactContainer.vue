// ArtefactView.vue

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import ArtefactsService from '@/services/artefactsServices'

const route = useRoute()
const id = Number(route.params.id)

// Estado local
const artefato = ref(null)
const photos = ref([])
const mainImage = ref('')

// Estado do modal
const showModal = ref(false)
const formData = ref({
    nome: '',
    email: '',
    cpf: ''
})

// troca de imagem
const selectImage = (src) => {
    mainImage.value = src
}

// Abrir modal
const openModal = () => {
    showModal.value = true
}

// Fechar modal
const closeModal = () => {
    showModal.value = false
    // Limpar formulário ao fechar
    formData.value = {
        nome: '',
        email: '',
        cpf: ''
    }
}

// Submeter formulário
const submitReservation = async () => {
    // Validação básica
    if (!formData.value.nome || !formData.value.email || !formData.value.cpf) {
        alert('Por favor, preencha todos os campos.')
        return
    }

    // Aqui você pode adicionar a lógica para enviar os dados ao backend
    console.log('Dados da reserva:', {
        artefatoId: id,
        ...formData.value
    })

    // Exemplo de chamada ao serviço (adapte conforme sua API)
    // try {
    //     await ArtefactsService.createReservation({
    //         artefact_id: id,
    //         ...formData.value
    //     })
    //     alert('Reserva solicitada! Verifique seu email para confirmação.')
    //     closeModal()
    // } catch (err) {
    //     console.error('Erro ao criar reserva:', err)
    //     alert('Erro ao processar reserva. Tente novamente.')
    // }

    alert('Reserva solicitada! Verifique seu email para confirmação.')
    closeModal()
}

onMounted(async () => {
    // 1) Buscar do backend
    try {
        const data = await ArtefactsService.getArtefact(id)
        artefato.value = data

        // 2) Preparar lista de fotos
        photos.value = data.images?.map(img => img.url_photo) ?? []

        // 3) Imagem principal
        mainImage.value = photos.value[0] ?? ''

    } catch (err) {
        console.error("Erro ao carregar artefato:", err)
    }
})
</script>

<template>
    <div class="acervo-page" v-if="artefato">
        <router-link to="/acervo" class="back">Retornar</router-link>

        <div class="content">
            <!-- LADO ESQUERDO -->
            <div class="left">
                <div class="main-image">
                    <img :src="mainImage" alt="" />
                </div>

                <div class="thumbs">
                    <img 
                        v-for="(img, i) in photos" 
                        :key="i" 
                        :src="img" 
                        @click="selectImage(img)"
                        :class="{ active: mainImage === img }" 
                    />
                </div>
            </div>

            <!-- MEIO -->
            <div class="middle" ref="infoSection">
                <h2 class="title">{{ artefato.name }}</h2>

                <div class="info-box">
                    <span class="label">Outro nome</span>
                    <span class="value">{{ artefato.other_name || 'Nenhum' }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Identificação</span>
                    <span class="value">#{{ artefato.id }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Material</span>
                    <span class="value">{{ artefato.raw_material?.name }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Subtipo</span>
                    <span class="value">{{ artefato.sub_type?.name }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Coleção</span>
                    <span class="value">{{ artefato.collection?.name }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Quantidade total na coleção</span>
                    <span class="value">{{ artefato.collection?.quantity_artefacts }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Localização</span>
                    <span class="value">
                        {{ artefato.localization?.room }},
                        {{ artefato.localization?.shelf }},
                        {{ artefato.localization?.bookcase }}
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Sítio arqueológico</span>
                    <span class="value">
                        {{ artefato.archaeological_site?.site }} —
                        {{ artefato.archaeological_site?.city }}/{{ artefato.archaeological_site?.state }}
                        ({{ artefato.archaeological_site?.country }})
                    </span>
                </div>

                <div class="info-box" ref="targetScroll">
                    <span class="label">Dimensões</span>
                    <span class="value">
                        {{ artefato.dimension_width }} × {{ artefato.dimension_length }} mm
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Peso</span>
                    <span class="value">{{ artefato.weigth }} g</span>
                </div>

                <div class="info-box">
                    <span class="label">Período</span>
                    <span class="value">{{ artefato.dating }} anos</span>
                </div>

                <div class="info-box">
                    <span class="label">Estado de conservação</span>
                    <span class="value">
                        {{
                            (
                                { 1: 'Perfeito', 2: 'Bom', 3: 'Regular', 4: 'Ruim', 5: 'Critical', 6: 'Irreversível' }
                            )[artefato.conservation_status]
                        }}
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Completude</span>
                    <span class="value">
                        {{
                            (
                                { 1: 'Inteiro', 2: 'Fragmentado', 3: 'Fraturado' }
                            )[artefato.completeness]
                        }}
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Detalhe de conservação</span>
                    <span class="value">
                        {{
                            {
                                1: 'Friável',
                                2: 'Erodido',
                                3: 'Lascado',
                                4: 'Incompleto',
                                5: 'Alterado quimicamente',
                                6: 'Deformado',
                                7: 'Estável'
                            }[artefato.detail_conservation_status]
                        }}
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Data de registro</span>
                    <span class="value">{{ artefato.register_date }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Reservado?</span>
                    <span class="value">{{ artefato.reserved ? 'Sim' : 'Não' }}</span>
                </div>

            </div>

            <!-- DIREITA -->
            <div class="right">
                <h3>Descrição</h3>
                <p>{{ artefato.description }}</p>

                <h3 style="margin-top: 1.5rem;">Observações</h3>
                <p>{{ artefato.observation }}</p>

                <button class="reservar" style="margin-top: 1.5rem;" @click="openModal">Reservar</button>
            </div>
        </div>

        <!-- MODAL DE RESERVA -->
        <div class="modal-overlay" v-if="showModal" @click="closeModal">
            <div class="modal-container" @click.stop>
                <div class="modal-header">
                    <h2>Solicitar Reserva</h2>
                    <button class="close-btn" @click="closeModal">&times;</button>
                </div>

                <div class="modal-body">
                    <p class="modal-subtitle">
                        Preencha os dados abaixo para receber um email de verificação e qualificação.
                    </p>

                    <form @submit.prevent="submitReservation">
                        <div class="form-group">
                            <label class="required">Nome completo</label>
                            <input 
                                type="text" 
                                v-model="formData.nome" 
                                placeholder="Digite seu nome completo"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label class="required">Email</label>
                            <input 
                                type="email" 
                                v-model="formData.email" 
                                placeholder="Digite seu email"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label class="required">CPF</label>
                            <input 
                                type="text" 
                                v-model="formData.cpf" 
                                placeholder="000.000.000-00"
                                maxlength="14"
                                required
                            />
                        </div>

                        <div class="modal-actions">
                            <button type="button" class="btn-cancel" @click="closeModal">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-submit">
                                Enviar Solicitação
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import '@/assets/sass/collections/_artefactCollections.scss';

/* ESTILOS DO MODAL */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    align-items: center;
    justify-content: center;
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

.modal-container {
    background: #1e1e1e;
    border-radius: 16px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        transform: translateY(50px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

.modal-header {
    background-color: #1e1e1e;
    color: white;
    padding: 2rem;
    text-align: center;
    border-bottom: 1px solid #333;
    position: relative;
}

.modal-header h2 {
    margin: 0;
    font-size: 1.75rem;
    font-weight: 700;
    letter-spacing: -0.5px;
}

.close-btn {
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background: none;
    border: none;
    color: #aaa;
    font-size: 2rem;
    cursor: pointer;
    transition: color 0.3s ease;
    line-height: 1;
    padding: 0;
    width: 30px;
    height: 30px;
}

.close-btn:hover {
    color: #fff;
}

.modal-body {
    padding: 2rem;
}

.modal-subtitle {
    margin: 0 0 1.5rem;
    font-size: 0.95rem;
    color: #aaa;
    text-align: center;
}

.form-group {
    display: flex;
    flex-direction: column;
    margin-bottom: 1.5rem;
}

.form-group label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.5rem;
}

.form-group label.required::after {
    content: ' *';
    color: #e74c3c;
}

.form-group input {
    padding: 0.75rem 1rem;
    border: 2px solid #414141;
    border-radius: 8px;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    font-family: inherit;
    background-color: #333;
    color: #fff;
}

.form-group input:focus {
    outline: none;
    border-color: #BFA78D;
    box-shadow: 0 0 0 3px rgba(191, 167, 141, 0.1);
}

.form-group input::placeholder {
    color: #aaa;
}

.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 1rem;
    margin-top: 2rem;
}

.btn-cancel,
.btn-submit {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.btn-cancel {
    background: #474747;
    color: #fff;
}

.btn-cancel:hover {
    background: #5a5a5a;
}

.btn-submit {
    background: #BFA78D;
    color: #1e1e1e;
}

.btn-submit:hover {
    background: #d4bda7;
    transform: translateY(-2px);
}
</style>