<script setup>
import { ref, computed, onMounted, reactive } from 'vue'
import { useArtefatosStore } from '@/stores'

const artefactStore = useArtefatosStore();

const formData = reactive({
    id: '',
    name: '',
    collection: '',
    raw_material: '',
    sub_type: '',
    dimension_length: '',
    dimension_width: '',
    weigth: '',
    dating: '',
    conservation_status: '',
    completeness: '',
    detail_conservation_status: '',
    collection_category: '',
    ethnic_group: '',
    technique: '',
    description: '',
    observations: '',
    bibliographic_reference: '',
    archaeological_site: '',
    localization: '',
    files: []
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
    for (const file of files) {
        formData.files.push(file);
    }
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
    formData = {
        id: '',
        name: '',
        collection: '',
        raw_material: '',
        sub_type: '',
        dimension_length: '',
        dimension_width: '',
        weigth: '',
        dating: '',
        conservation_status: '',
        completeness: '',
        detail_conservation_status: '',
        collection_category: '',
        ethnic_group: '',
        technique: '',
        description: '',
        observations: '',
        bibliographic_reference: '',
        archaeological_site: '',
        localization: '',
        files: []
    }

    images.value = []
    errors.value = {}
}

const imageCount = computed(() => images.value.length)

onMounted(async() => {
    if (Object.entries(artefactStore.categories).length == 0) {
        await artefactStore.getCategories();
    }
})
</script>

<template>
    <div class="cadastro-arqueologico">
        <div class="cadastro-container">
            <header class="cadastro-header">
                <h1>Cadastro de Objeto Arqueológico</h1>
                <p class="subtitle">Preencha os dados do objeto para registro no acervo</p>
            </header>

            <form @submit.prevent="artefactStore.createArtefact(formData)" class="cadastro-form">
                <section class="form-section">
                    <h2 class="section-title">Identificação</h2>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="numeroAcervo" class="required">Número de Acervo</label>
                            <input id="numeroAcervo" v-model="formData.id" type="text"
                                placeholder="Ex: 8750" :class="{ 'error': errors.numeroAcervo }" class="input" />
                            <span v-if="errors.numeroAcervo" class="error-message">{{ errors.numeroAcervo }}</span>
                        </div>

                        <div class="form-group">
                            <label for="titulo" class="required">Título/Nome</label>
                            <input id="titulo" v-model="formData.name" type="text" placeholder="Nome do objeto"
                                :class="{ 'error': errors.titulo }" />
                            <span v-if="errors.titulo" class="error-message">{{ errors.titulo }}</span>
                        </div>
                    </div>
                    <div class="form-row">
                        <div class="form-group">
                            <label for="colecao" class="required">Coleção</label>
                            <select id="estadoConservacao" v-model="formData.collection"
                                :class="{ 'error': errors.estadoConservacao }">
                                <option value="" sel>Selecione...</option>                                
                                <option v-for="(collection, collectionIndex) in artefactStore.categories.collections" :key="collectionIndex" :value="collection.id">{{ collection.name }}</option>
                            </select>
                            <span v-if="errors.colecao" class="error-message">{{ errors.colecao }}</span>
                        </div>

                        <div class="form-group">
                            <label for="estadoConservacao" class="required">Matéria-Prima</label>
                            <select id="estadoConservacao" v-model="formData.raw_material"
                                :class="{ 'error': errors.estadoConservacao }">
                                <option value="" sel>Selecione...</option>                                
                                <option v-for="(rawMaterial, rawMaterialIndex) in artefactStore.categories.raw_materials" :key="rawMaterialIndex" :value="rawMaterial.id">{{ rawMaterial.name }}</option>
                            </select>
                            <span v-if="errors.estadoConservacao" class="error-message">{{ errors.estadoConservacao
                                }}</span>
                        </div>

                        <div class="form-group">
                            <label for="subTipo" class="required">Sub-tipo</label>
                            <select id="estadoConservacao" v-model="formData.sub_type"
                                :class="{ 'error': errors.estadoConservacao }">
                                <option value="" sel>Selecione...</option>                                
                                <option v-for="(subType, subTypeIndex) in artefactStore.categories.sub_type" :key="subTypeIndex" :value="subType.id">{{ subType.name }}</option>
                            </select>
                            <span v-if="errors.estadoConservacao" class="error-message">{{ errors.estadoConservacao
                                }}</span>
                        </div>
                        <div class="form-group">
                            <label for="subTipo" class="required">Categoria de acervo</label>
                            <select id="estadoConservacao" v-model="formData.collection_category"
                                :class="{ 'error': errors.categoria_acervo }">
                                <option value="" selected>Selecione...</option>                                
                                <option value="1">Arqueológico</option>
                                <option value="2">Etnográfico</option>
                                <option value="3">Paleontológico</option>
                                <option value="4">Histórico</option>
                                <option value="5">Bibliográfico</option>
                                <option value="6">Documental</option>
                                <option value="7">Indeterminado</option>
                            </select>
                            <span v-if="errors.categoria_acervo" class="error-message">{{ errors.categoria_acervo
                                }}</span>
                        </div>
                        <div class="form-group">
                            <label for="subTipo" class="required">Grupo étnico</label>
                            <select id="estadoConservacao" v-model="formData.ethnic_group"
                                :class="{ 'error': errors.grupoEtnico }">
                                <option value="" sel>Selecione...</option>                                
                                <option value="1">Sambaqui</option>
                                <option value="2">Guarani</option>
                                <option value="3">Itararé/Taquara</option>
                                <option value="4">Indeterminado</option>
                            </select>
                            <span v-if="errors.grupoEtnico" class="error-message">{{ errors.estadoConservacao
                                }}</span>
                        </div>
                        <div class="form-group">
                            <label for="subTipo" class="required">Técnica</label>
                            <select id="estadoConservacao" v-model="formData.technique"
                                :class="{ 'error': errors.grupoEtnico }">
                                <option value="" sel>Selecione...</option>                                
                                <option value="1">Percussão</option>
                                <option value="2">Lasqueamento por pressão</option>
                                <option value="3">Abrasão / Polimento</option>
                                <option value="4">Perfuramento</option>
                                <option value="5">Entalhe</option>
                                <option value="6">Raspagem</option>
                                <option value="7">Retoque</option>
                                <option value="8">Friccionamento</option>
                                <option value="9">Não identificada</option>
                            </select>
                            <span v-if="errors.grupoEtnico" class="error-message">{{ errors.estadoConservacao
                                }}</span>
                        </div>
                        <div class="form-group">
                            <label for="numeroAcervo" class="required">Datação</label>
                            <input id="numeroAcervo" v-model="formData.dating" type="number"
                                placeholder="5000 anos" :class="{ 'error': errors.datacao }" class="input" />
                            <span v-if="errors.datacao" class="error-message">{{ errors.datacao }}</span>
                        </div>
                    </div>
                </section>
                <section class="form-section">
                    <h2 class="section-title">Características</h2>

                    <div class="form-row">
                        <div class="form-group">
                            <label for="estadoConservacao" class="required">Estado de Conservação</label>
                            <select id="estadoConservacao" v-model="formData.conservation_status"
                                :class="{ 'error': errors.estadoConservacao }">
                                <option value="" sel>Selecione...</option>                                
                                <option value="1">Excelente</option>
                                <option value="2">Bom</option>
                                <option value="3">Regular</option>
                                <option value="4">Ruim</option>
                                <option value="5">Crítico</option>
                                <option value="6">Irreversível</option>
                            </select>
                            <span v-if="errors.estadoConservacao" class="error-message">{{ errors.estadoConservacao
                                }}</span>
                        </div>
                        <div class="form-group">
                            <label for="estadoConservacao" class="required">Inteireza</label>
                            <select id="estadoConservacao" v-model="formData.completeness"
                                :class="{ 'error': errors.inteireza }">
                                <option value="" sel>Selecione...</option>                                
                                <option value="1">Inteiro</option>
                                <option value="2">Fragmentado</option>
                                <option value="3">Fraturado</option>
                            </select>
                            <span v-if="errors.inteireza" class="error-message">{{ errors.inteireza
                                }}</span>
                        </div>
                        <div class="form-group">
                            <label for="estadoConservacao" class="required">Detalhes do Estado de Conservação</label>
                            <select id="estadoConservacao" v-model="formData.detail_conservation_status"
                                :class="{ 'error': errors.detalhes_estado_conservacao }">
                                <option value="" sel>Selecione...</option>                                
                                <option value="7">Estável</option>
                                <option value="1">Friável</option>
                                <option value="2">Erodido</option>
                                <option value="3">Lascado</option>
                                <option value="4">Incompleto</option>
                                <option value="5">Alterado quimicamente</option>
                                <option value="6">Deformado</option>
                            </select>
                            <span v-if="errors.detalhes_estado_conservacao" class="error-message">{{ errors.detalhes_estado_conservacao
                                }}</span>
                        </div>
                        <div class="form-group">
                            <label for="titulo" class="required">Comprimento (em mm)</label>
                            <input id="titulo" v-model="formData.dimension_length" type="text" placeholder="100mm"
                                :class="{ 'error': errors.comprimento }" />
                            <span v-if="errors.titulo" class="error-message">{{ errors.comprimento }}</span>
                        </div>
                        <div class="form-group">
                            <label for="titulo" class="required">Largura (em mm)</label>
                            <input id="titulo" v-model="formData.dimension_width" type="text" placeholder="50mm"
                                :class="{ 'error': errors.largura }" />
                            <span v-if="errors.titulo" class="error-message">{{ errors.largura }}</span>
                        </div>
                        <div class="form-group">
                            <label for="titulo" class="required">Peso (em g)</label>
                            <input id="titulo" v-model="formData.weigth" type="text" placeholder="500g"
                                :class="{ 'error': errors.peso }" />
                            <span v-if="errors.titulo" class="error-message">{{ errors.peso }}</span>
                        </div>
                    </div>
                </section>
                <section class="form-section">
                    <h2 class="section-title">Origem e Localização</h2>

                    <div class="form-row">
                       <div class="form-group">
                            <label for="origem" class="required">Origem</label>
                            <select id="origem" v-model="formData.archaeological_site"
                                :class="{ 'error': errors.sitio_arqueologico }">
                                <option value="" selected>Selecione...</option>
                                <option v-for="(archaeologicalSite, archaeologicalSiteIndex) in artefactStore.categories.archaeological_sites" :key="archaeologicalSiteIndex" :value="archaeologicalSite.id">
                                    {{ archaeologicalSite.site }}, {{ archaeologicalSite.city }} - {{ archaeologicalSite.state }}, {{ archaeologicalSite.country }}
                                </option>
                            </select>
                            <span v-if="errors.sitio_arqueologico" class="error-message">{{ errors.sitio_arqueologico
                                }}</span>
                        </div>
                        <div class="form-group">
                            <label for="origem" class="required">Localização</label>
                            <select id="origem" v-model="formData.localization"
                                :class="{ 'error': errors.localizacao }">
                                <option value="" selected>Selecione...</option>
                                <option v-for="(localization, localizationIndex) in artefactStore.categories.localizations" :key="localizationIndex" :value="localization.id">
                                    {{ localization.room }}, {{ localization.shelf }}, {{ localization.bookcase }}
                                </option>
                            </select>
                            <span v-if="errors.estadoConservacao" class="error-message">{{ errors.estadoConservacao
                                }}</span>
                        </div>
                    </div>
                </section>
                <section class="form-section">
                    <h2 class="section-title">Descrição</h2>

                    <div class="form-group full-width">
                        <label for="descricao">Descrição</label>
                        <textarea id="descricao" v-model="formData.description" rows="4"
                            placeholder="Descrição detalhada do objeto"></textarea>
                    </div>

                    <div class="form-group full-width" style="margin-top: 15px;">
                        <label for="observacoes">Observações</label>
                        <textarea id="observacoes" v-model="formData.observations" rows="3"
                            placeholder="Observações adicionais"></textarea>
                    </div>

                    <div class="form-group full-width" style="margin-top: 15px;">
                        <label for="observacoes">Referências Bibliográficas</label>
                        <textarea id="observacoes" v-model="formData.bibliographic_reference" rows="3"
                            placeholder="Referências"></textarea>
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