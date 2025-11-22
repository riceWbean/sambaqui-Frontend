<template>
  <ManagerLayout :page-title="artefact?.name || 'Carregando...'" :breadcrumb="breadcrumb">
    <div class="artefact-detail-container">
      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Carregando detalhes do artefato...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="error-state">
        <div class="error-icon">⚠️</div>
        <h2>Erro ao carregar artefato</h2>
        <p>{{ error }}</p>
        <button class="btn-primary" @click="goBack">Voltar para Listagem</button>
      </div>

      <!-- Content -->
      <div v-else-if="artefact" class="artefact-content">
        <!-- Header with Actions -->
        <div class="detail-header">
          <div class="header-info">
            <h1>{{ artefact.name }}</h1>
            <p v-if="artefact.other_name" class="other-name">Outro nome: <strong>{{ artefact.other_name }}</strong></p>
            <p class="register-info">Cadastrado em: <strong>{{ formatDate(artefact.register_date) }}</strong></p>
          </div>
          <div class="header-actions">
            <button class="btn-primary" @click="editArtefact">Editar</button>
            <button class="btn-secondary" @click="goBack">Voltar</button>
          </div>
        </div>

        <!-- Main Grid -->
        <div class="detail-grid">
          <!-- Left Column - Images -->
          <div class="left-column">
            <section class="card">
              <h2>Imagens</h2>
              <ImageGallery 
                :images="artefactImages" 
                :alt-text="artefact.name"
                @image-selected="onImageSelected"
              />
            </section>

            <!-- Conservation Status -->
            <section class="card">
              <h2>Estado de Conservação</h2>
              <div class="conservation-detail">
                <div class="status-badge" :class="getConservationStatusClass(artefact.conservation_status)">
                  {{ getConservationStatusLabel(artefact.conservation_status) }}
                </div>
                <div class="conservation-info">
                  <p><strong>Detalhe:</strong> {{ getDetailConservationStatusLabel(artefact.detail_conservation_status) }}</p>
                  <p><strong>Completude:</strong> {{ getCompletenessLabel(artefact.completeness) }}</p>
                </div>
              </div>
            </section>
          </div>

          <!-- Right Column - Details -->
          <div class="right-column">
            <!-- Basic Information -->
            <section class="card">
              <h2>Informações Básicas</h2>
              <div class="info-grid">
                <div class="info-item">
                  <label>Coleção</label>
                  <p>{{ artefact.collection?.name || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Matéria-Prima</label>
                  <p>{{ artefact.raw_material?.name || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Sub-Tipo</label>
                  <p>{{ artefact.sub_type?.name || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Datação</label>
                  <p>{{ artefact.dating ? `${artefact.dating} anos atrás` : 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Categoria da Coleção</label>
                  <p>{{ getCollectionCategoryLabel(artefact.collection_category) }}</p>
                </div>
                <div class="info-item">
                  <label>Grupo Étnico</label>
                  <p>{{ getEthnicGroupLabel(artefact.ethnic_group) }}</p>
                </div>
                <div class="info-item">
                  <label>Técnica</label>
                  <p>{{ getTechniqueLabel(artefact.technique) }}</p>
                </div>
                <div class="info-item">
                  <label>Reservado</label>
                  <p>{{ artefact.reserved ? 'Sim' : 'Não' }}</p>
                </div>
              </div>
            </section>

            <!-- Location Information -->
            <section class="card">
              <h2>Localização</h2>
              <div class="info-grid">
                <div class="info-item">
                  <label>Sala</label>
                  <p>{{ artefact.localization?.room || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Prateleira</label>
                  <p>{{ artefact.localization?.shelf || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Estante</label>
                  <p>{{ artefact.localization?.bookcase || 'Não informado' }}</p>
                </div>
              </div>
            </section>

            <!-- Archaeological Site -->
            <section class="card">
              <h2>Sítio Arqueológico</h2>
              <div class="info-grid">
                <div class="info-item">
                  <label>Sítio</label>
                  <p>{{ artefact.archaeological_site?.site || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Cidade</label>
                  <p>{{ artefact.archaeological_site?.city || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Estado</label>
                  <p>{{ artefact.archaeological_site?.state || 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>País</label>
                  <p>{{ artefact.archaeological_site?.country || 'Não informado' }}</p>
                </div>
              </div>
            </section>

            <!-- Physical Characteristics -->
            <section class="card">
              <h2>Características Físicas</h2>
              <div class="info-grid">
                <div class="info-item">
                  <label>Comprimento</label>
                  <p>{{ artefact.dimension_length ? `${artefact.dimension_length} cm` : 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Largura</label>
                  <p>{{ artefact.dimension_width ? `${artefact.dimension_width} cm` : 'Não informado' }}</p>
                </div>
                <div class="info-item">
                  <label>Peso</label>
                  <p>{{ artefact.weigth ? `${artefact.weigth} g` : 'Não informado' }}</p>
                </div>
              </div>
            </section>
          </div>
        </div>

        <!-- Description -->
        <section class="card full-width">
          <h2>Descrição</h2>
          <p class="description-text">{{ artefact.description }}</p>
        </section>

        <!-- Observation -->
        <section class="card full-width">
          <h2>Observações</h2>
          <p class="description-text">{{ artefact.observation || 'Nenhuma observação registrada' }}</p>
        </section>

        <!-- Bibliographic References -->
        <section v-if="artefact.bibliographic_reference" class="card full-width">
          <h2>Referências Bibliográficas</h2>
          <p class="description-text">{{ artefact.bibliographic_reference }}</p>
        </section>

        <!-- Action Buttons -->
        <div class="action-buttons">
          <button class="btn-primary" @click="editArtefact">Editar Artefato</button>
          <button class="btn-danger" @click="deleteArtefact">Deletar Artefato</button>
          <button class="btn-secondary" @click="goBack">Voltar para Listagem</button>
        </div>
      </div>
    </div>
  </ManagerLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import ManagerLayout from '@/layouts/ManagerLayout.vue'
import ImageGallery from '@/components/ImageGallery-Composition.vue'
import {
  conservationStatusMap,
  completenessMap,
  detailConservationStatusMap,
  collectionCategoryMap,
  ethnicGroupMap,
  techniqueMap,
  formatDate,
  getEnumLabel
} from '@/utils/artefactEnums.js'
import { useArtefactsStore } from '@/stores/useArtefactStore'

const store = useArtefactsStore()

const route = useRoute()
const router = useRouter()

// State
const artefact = ref(null)
const loading = ref(true)
const error = ref(null)

// Computed
const breadcrumb = computed(() => {
  return `Acervo > Listagem de Artefatos > ${artefact.value?.name || 'Carregando...'}`
})

const artefactImages = computed(() => {
  if (artefact.value?.images && artefact.value.images.length > 0) {
    return artefact.value.images.map(img => img.url_photo)
  }
  return []
})

// Methods
const getConservationStatusLabel = (value) => {
  return getEnumLabel(value, conservationStatusMap)
}

const getConservationStatusClass = (value) => {
  const classMap = {
    1: 'excelente',
    2: 'bom',
    3: 'regular',
    4: 'ruim',
    5: 'muito-ruim'
  }
  return classMap[value] || 'regular'
}

const getCompletenessLabel = (value) => {
  return getEnumLabel(value, completenessMap)
}

const getDetailConservationStatusLabel = (value) => {
  return getEnumLabel(value, detailConservationStatusMap)
}

const getCollectionCategoryLabel = (value) => {
  return getEnumLabel(value, collectionCategoryMap)
}

const getEthnicGroupLabel = (value) => {
  return getEnumLabel(value, ethnicGroupMap)
}

const getTechniqueLabel = (value) => {
  return getEnumLabel(value, techniqueMap)
}

const fetchArtefact = async () => {
  try {
    loading.value = true
    error.value = null

    const artefactId = route.params.id


    const response = await store.fetchById(artefactId)
    artefact.value = response
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const editArtefact = () => {
  router.push(`/artefacts/${artefact.value.id}/edit`)
}

const deleteArtefact = () => {
  if (confirm(`Tem certeza que deseja deletar "${artefact.value.name}"?`)) {
    console.log('Deletar artefato:', artefact.value.id)
    // Implementar lógica de deleção
  }
}

const downloadReport = () => {
  console.log('Baixar relatório do artefato:', artefact.value.id)
  // Implementar lógica de download
}

const goBack = () => {
  router.push('/management/artefactsList')
}

const onImageSelected = (data) => {
  console.log('Imagem selecionada:', data)
}

// Lifecycle
onMounted(() => {
  fetchArtefact()
})

// Watchers
watch(
  () => route.params.id,
  () => {
    fetchArtefact()
  }
)
</script>

<style scoped>
.artefact-detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Loading State */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  gap: 1rem;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid #ecf0f1;
  border-top-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-state p {
  color: #7f8c8d;
  font-size: 1.1rem;
}

/* Error State */
.error-state {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.error-state h2 {
  color: #e74c3c;
  margin: 0 0 0.5rem 0;
}

.error-state p {
  color: #7f8c8d;
  margin: 0 0 1.5rem 0;
}

/* Header */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
  padding: 2rem;
  background: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
  color: white;
}

.other-name,
.register-info {
  margin: 0.25rem 0;
  color: #737373;
  font-size: 0.95rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

/* Content Grid */
.artefact-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.left-column,
.right-column {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Card Styles */
.card {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card h2 {
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  color: #737373;
  padding-bottom: 0.5rem;
}

.card.full-width {
  grid-column: 1 / -1;
}

.conservation-detail {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.status-badge {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-weight: 600;
  text-align: center;
  width: fit-content;
}

.status-badge.excelente {
  background-color: #d5f4e6;
  color: #27ae60;
}

.status-badge.bom {
  background-color: #d6eaf8;
  color: #2980b9;
}

.status-badge.regular {
  background-color: #ffeaa7;
  color: #f39c12;
}

.status-badge.ruim {
  background-color: #fadbd8;
  color: #c0392b;
}

.status-badge.muito-ruim {
  background-color: #d7bde2;
  color: #6c3483;
}

.conservation-info {
  padding: 1rem;
  background: #1e1e1e;;
  border-radius: 4px;
}

.conservation-info p {
  margin: 0.5rem 0;
  color: white;
  font-size: 0.95rem;
}

.conservation-info p:first-child {
  margin-top: 0;
}

/* Info Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item label {
  font-weight: 600;
  color: #7f8c8d;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.info-item p {
  margin: 0;
  color: white;
  font-size: 1rem;
}

/* Description Text */
.description-text {
  margin: 0;
  color: white;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  border: none;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #737373;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #ecf0f1;
  color: #2c3e50;
  border: 1px solid transparent;
}

.btn-secondary:hover {
  background-color: #d5dbdb;
  border: 1px solid #737373
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* Responsive */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    flex-direction: column;
  }

  .header-actions {
    width: 100%;
    flex-direction: column;
  }

  .header-actions button {
    width: 100%;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-buttons button {
    width: 100%;
  }
}
</style>
