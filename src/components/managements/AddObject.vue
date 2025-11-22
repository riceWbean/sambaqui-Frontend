<script setup>
import { ref, computed } from 'vue'

const formData = ref({
    numeroAcervo: '',
    titulo: '',
    colecao: '',
    materiaPrima: '',
    subTipo: '',
    procedencia: '',
    datacao: '',
    estadoConservacao: '',
    localizacaoFisica: '',
    descricao: '',
    observacoes: ''
})

const images = ref([])
const fileInputRef = ref(null)
const isDragging = ref(false)

const estadosConservacao = [
    'Excelente',
    'Bom',
    'Regular',
    'Ruim',
    'Péssimo'
]
const errors = ref({})

const validateForm = () => {
    errors.value = {}
    let isValid = true

    if (!formData.value.numeroAcervo.trim()) {
        errors.value.numeroAcervo = 'Número de acervo é obrigatório'
        isValid = false
    }

    if (!formData.value.titulo.trim()) {
        errors.value.titulo = 'Título/Nome é obrigatório'
        isValid = false
    }

    if (!formData.value.colecao.trim()) {
        errors.value.colecao = 'Coleção é obrigatória'
        isValid = false
    }

    if (!formData.value.estadoConservacao.trim()) {
        errors.value.estadoConservacao = 'Estado de conservação é obrigatório'
        isValid = false
    }

    return isValid
}

const handleFileSelect = (event) => {
    const files = event.target.files
    if (files) addFiles([...files])
}

const addFiles = (files) => {
    files.forEach(file => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = (e) => {
                images.value.push({
                    id: `${Date.now()}-${Math.random()}`,
                    file,
                    preview: e.target.result,
                    name: file.name
                })
            }
            reader.readAsDataURL(file)
        }
    })
}

const removeImage = (id) => {
    images.value = images.value.filter(img => img.id !== id)
}

const replaceImage = (id, event) => {
    const newFile = event.target.files[0]
    if (!newFile || !newFile.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
        const index = images.value.findIndex(img => img.id === id)
        if (index !== -1) {
            images.value[index] = {
                id,
                file: newFile,
                preview: e.target.result,
                name: newFile.name
            }
        }
    }
    reader.readAsDataURL(newFile)
}

const triggerFileInput = () => {
    fileInputRef.value?.click()
}

const handleDragEnter = (e) => {
    e.preventDefault()
    isDragging.value = true
}

const handleDragLeave = (e) => {
    e.preventDefault()
    isDragging.value = false
}

const handleDragOver = (e) => {
    e.preventDefault()
}

const handleDrop = (e) => {
    e.preventDefault()
    isDragging.value = false

    if (e.dataTransfer?.files) {
        addFiles([...e.dataTransfer.files])
    }
}
const handleSubmit = () => {
    if (!validateForm()) return

    console.log("FORM:", formData.value)
    console.log("IMAGENS:", images.value)

    alert("Cadastro realizado!")
    resetForm()
}

const resetForm = () => {
    formData.value = {
        numeroAcervo: '',
        titulo: '',
        colecao: '',
        materiaPrima: '',
        subTipo: '',
        procedencia: '',
        datacao: '',
        estadoConservacao: '',
        localizacaoFisica: '',
        descricao: '',
        observacoes: ''
    }

    images.value = []
    errors.value = {}
}

const imageCount = computed(() => images.value.length)
</script>

<template>
    <div class="cadastro-arqueologico">
        <div class="cadastro-container">
            <header class="cadastro-header">
                <h1>Cadastro de Objeto Arqueológico</h1>
                <p class="subtitle">Preencha os dados do objeto para registro no acervo</p>
            </header>

            <form @submit.prevent="handleSubmit" class="cadastro-form">
                <section class="form-section">
                    <h2 class="section-title">Identificação</h2>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="numeroAcervo" class="required">Número de Acervo</label>
                            <input id="numeroAcervo" v-model="formData.numeroAcervo" type="text"
                                placeholder="Ex: ACR-2024-001" :class="{ 'error': errors.numeroAcervo }" class="input" />
                            <span v-if="errors.numeroAcervo" class="error-message">{{ errors.numeroAcervo }}</span>
                        </div>

                        <div class="form-group">
                            <label for="titulo" class="required">Título/Nome</label>
                            <input id="titulo" v-model="formData.titulo" type="text" placeholder="Nome do objeto"
                                :class="{ 'error': errors.titulo }" />
                            <span v-if="errors.titulo" class="error-message">{{ errors.titulo }}</span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="colecao" class="required">Coleção</label>
                            <input id="colecao" v-model="formData.colecao" type="text" placeholder="Nome da coleção"
                                :class="{ 'error': errors.colecao }" />
                            <span v-if="errors.colecao" class="error-message">{{ errors.colecao }}</span>
                        </div>

                        <div class="form-group">
                            <label for="subTipo">Sub-tipo</label>
                            <input id="subTipo" v-model="formData.subTipo" type="text"
                                placeholder="Classificação específica" />
                        </div>
                    </div>
                </section>
                <section class="form-section">
                    <h2 class="section-title">Características</h2>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="materiaPrima">Matéria-prima</label>
                            <input id="materiaPrima" v-model="formData.materiaPrima" type="text"
                                placeholder="Ex: Cerâmica, Pedra, Metal" />
                        </div>

                        <div class="form-group">
                            <label for="estadoConservacao" class="required">Estado de Conservação</label>
                            <select id="estadoConservacao" v-model="formData.estadoConservacao"
                                :class="{ 'error': errors.estadoConservacao }">
                                <option value="">Selecione...</option>
                                <option v-for="estado in estadosConservacao" :key="estado" :value="estado">
                                    {{ estado }}
                                </option>
                            </select>
                            <span v-if="errors.estadoConservacao" class="error-message">{{ errors.estadoConservacao
                                }}</span>
                        </div>
                    </div>
                </section>
                <section class="form-section">
                    <h2 class="section-title">Origem e Localização</h2>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="procedencia">Procedência/Origem</label>
                            <input id="procedencia" v-model="formData.procedencia" type="text"
                                placeholder="Local de origem" />
                        </div>

                        <div class="form-group">
                            <label for="datacao">Datação</label>
                            <input id="datacao" v-model="formData.datacao" type="text"
                                placeholder="Ex: Século XIX, 1850-1900" />
                        </div>
                    </div>

                    <div class="form-group full-width">
                        <label for="localizacaoFisica">Localização Física</label>
                        <input id="localizacaoFisica" v-model="formData.localizacaoFisica" type="text"
                            placeholder="Local de armazenamento atual" />
                    </div>
                </section>
                <section class="form-section">
                    <h2 class="section-title">Descrição</h2>

                    <div class="form-group full-width">
                        <label for="descricao">Descrição</label>
                        <textarea id="descricao" v-model="formData.descricao" rows="4"
                            placeholder="Descrição detalhada do objeto"></textarea>
                    </div>

                    <div class="form-group full-width">
                        <label for="observacoes">Observações</label>
                        <textarea id="observacoes" v-model="formData.observacoes" rows="3"
                            placeholder="Observações adicionais"></textarea>
                    </div>
                </section>
                <section class="form-section">
                    <h2 class="section-title">
                        Imagens
                        <span v-if="imageCount > 0" class="image-count">({{ imageCount }})</span>
                    </h2>

                    <div class="upload-area" :class="{ 'dragging': isDragging }" @dragenter="handleDragEnter"
                        @dragleave="handleDragLeave" @dragover="handleDragOver" @drop="handleDrop"
                        @click="triggerFileInput">
                        <input ref="fileInputRef" type="file" multiple accept="image/*" @change="handleFileSelect"
                            style="display: none" />

                        <div class="upload-content">
                            <svg class="upload-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <p class="upload-text">
                                <strong>Clique para selecionar</strong> ou arraste imagens aqui
                            </p>
                            <p class="upload-hint">Formatos aceitos: JPG, PNG, GIF</p>
                        </div>
                    </div>

                    <div v-if="images.length > 0" class="images-grid">
                        <div v-for="image in images" :key="image.id" class="image-item">
                            <div class="image-preview">
                                <img :src="image.preview" :alt="image.name" />
                            </div>

                            <div class="image-info">
                                <p class="image-name">{{ image.name }}</p>

                                <div class="image-actions">
                                    <label :for="`replace-${image.id}`" class="btn-replace">
                                        Substituir
                                        <input :id="`replace-${image.id}`" type="file" accept="image/*"
                                            @change="replaceImage(image.id, $event)" style="display: none" />
                                    </label>

                                    <button type="button" @click="removeImage(image.id)" class="btn-remove">
                                        Remover
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <div class="form-actions">
                    <button type="button" @click="resetForm" class="btn btn-secondary">
                        Limpar Formulário
                    </button>
                    <button type="submit" class="btn btn-primary">
                        Cadastrar Objeto
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>
<style scoped>
@import '@/assets/sass/managements/_addObject.scss';
</style>