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
            <button class="btn-primary" @click="showEditModal = true">Editar</button>
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
          <button class="btn-primary" @click="showEditModal = true">Editar Artefato</button>
          <button class="btn-danger" @click="deleteArtefact">Deletar Artefato</button>
          <button class="btn-secondary" @click="goBack">Voltar para Listagem</button>
        </div>
      </div>
    </div>

    <!-- MODAL DE EDIÇÃO -->
    <div v-if="showEditModal" class="modal-overlay" @click="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Editar Artefato</h2>
          <button class="close-btn" @click="showEditModal = false">✕</button>
        </div>

        <div class="modal-body">
          <form @submit.prevent="handleSaveEdit">
            <!-- Basic Information -->
            <section class="form-section">
              <h3>Informações Básicas</h3>
              
              <div class="form-group">
                <label>Nome *</label>
                <input 
                  v-model="editForm.name" 
                  type="text" 
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label>Outro Nome</label>
                <input 
                  v-model="editForm.other_name" 
                  type="text"
                  class="form-input"
                />
              </div>

              <div class="form-row">
                <div class="form-group">
                  <label>Estado de Conservação *</label>
                  <select v-model.number="editForm.conservation_status" required class="form-input">
                    <option value="">Selecione o estado</option>
                    <option :value="1">Excelente</option>
                    <option :value="2">Bom</option>
                    <option :value="3">Regular</option>
                    <option :value="4">Ruim</option>
                    <option :value="5">Crítico</option>
                    <option :value="6">Irreversível</option>
                  </select>
                </div>

                <div class="form-group">
                  <label>Datação</label>
                  <input 
                    v-model.number="editForm.dating" 
                    type="number"
                    placeholder="Anos atrás"
                    class="form-input"
                  />
                </div>
              </div>
            </section>

            <!-- Location Information -->
            <section class="form-section">
              <h3>Localização</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Sala</label>
                  <input 
                    v-model="editForm.localization.room" 
                    type="text"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label>Prateleira</label>
                  <input 
                    v-model="editForm.localization.shelf" 
                    type="text"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label>Estante</label>
                  <input 
                    v-model="editForm.localization.bookcase" 
                    type="text"
                    class="form-input"
                  />
                </div>
              </div>
            </section>

            <!-- Physical Characteristics -->
            <section class="form-section">
              <h3>Características Físicas</h3>
              
              <div class="form-row">
                <div class="form-group">
                  <label>Comprimento (cm)</label>
                  <input 
                    v-model.number="editForm.dimension_length" 
                    type="number"
                    step="0.01"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label>Largura (cm)</label>
                  <input 
                    v-model.number="editForm.dimension_width" 
                    type="number"
                    step="0.01"
                    class="form-input"
                  />
                </div>

                <div class="form-group">
                  <label>Peso (g)</label>
                  <input 
                    v-model.number="editForm.weigth" 
                    type="number"
                    step="0.01"
                    class="form-input"
                  />
                </div>
              </div>
            </section>

            <!-- Descriptions -->
            <section class="form-section">
              <h3>Descrições</h3>
              
              <div class="form-group full-width">
                <label>Descrição</label>
                <textarea 
                  v-model="editForm.description" 
                  rows="4"
                  class="form-input"
                ></textarea>
              </div>

              <div class="form-group full-width">
                <label>Observações</label>
                <textarea 
                  v-model="editForm.observation" 
                  rows="3"
                  class="form-input"
                ></textarea>
              </div>

              <div class="form-group full-width">
                <label>Referências Bibliográficas</label>
                <textarea 
                  v-model="editForm.bibliographic_reference" 
                  rows="3"
                  class="form-input"
                ></textarea>
              </div>
            </section>

            <!-- Form Actions -->
            <div class="form-actions">
              <button type="button" class="btn-secondary" @click="showEditModal = false">
                Cancelar
              </button>
              <button type="submit" class="btn-primary" :disabled="savingEdit">
                {{ savingEdit ? 'Salvando...' : 'Salvar Alterações' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  </ManagerLayout>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue'
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
import { ArtefactsService } from '@/services'

const store = useArtefactsStore()
const route = useRoute()
const router = useRouter()

// State
const artefact = ref(null)
const loading = ref(true)
const error = ref(null)
const showEditModal = ref(false)
const savingEdit = ref(false)

const editForm = reactive({
  name: '',
  other_name: '',
  conservation_status: '',
  dating: null,
  localization: {
    room: '',
    shelf: '',
    bookcase: ''
  },
  dimension_length: null,
  dimension_width: null,
  weigth: null,
  description: '',
  observation: '',
  bibliographic_reference: ''
})

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
    initializeEditForm()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
}

const initializeEditForm = () => {
  if (artefact.value) {
    editForm.name = artefact.value.name || ''
    editForm.other_name = artefact.value.other_name || ''
    editForm.conservation_status = artefact.value.conservation_status || ''
    editForm.dating = artefact.value.dating || null
    editForm.localization = {
      room: artefact.value.localization?.room || '',
      shelf: artefact.value.localization?.shelf || '',
      bookcase: artefact.value.localization?.bookcase || ''
    }
    editForm.dimension_length = artefact.value.dimension_length || null
    editForm.dimension_width = artefact.value.dimension_width || null
    editForm.weigth = artefact.value.weigth || null
    editForm.description = artefact.value.description || ''
    editForm.observation = artefact.value.observation || ''
    editForm.bibliographic_reference = artefact.value.bibliographic_reference || ''
  }
}

async function handleSaveEdit() {
  try {
    savingEdit.value = true
    
    const payload = {
      name: editForm.name,
      other_name: editForm.other_name,
      collection: artefact.value.collection.id,
      raw_material: artefact.value.raw_material.id,
      sub_type: artefact.value.sub_type.id,
      archaeological_site: artefact.value.archaeological_site.id,
      localization: artefact.value.localization.id,
      conservation_status: parseInt(editForm.conservation_status),
      completeness: artefact.value.completeness,
      detail_conservation_status: editForm.detail_conservation_status || artefact.value.detail_conservation_status,
      collection_category: artefact.value.collection_category,
      ethnic_group: artefact.value.ethnic_group,
      technique: artefact.value.technique,
      dating: editForm.dating,
      dimension_length: editForm.dimension_length || artefact.value.dimension_length,
      dimension_width: editForm.dimension_width || artefact.value.dimension_width,
      weigth: editForm.weigth || artefact.value.weigth,
      description: editForm.description || artefact.value.description,
      observation: editForm.observation,
      bibliographic_reference: editForm.bibliographic_reference,
      reserved: artefact.value.reserved
    }

    await ArtefactsService.updateArtefact(artefact.value.id, payload)
    
    await fetchArtefact()
    showEditModal.value = false
    alert('Artefato atualizado com sucesso!')
  } catch (error) {
    console.error('Erro ao salvar:', error)
    alert('Erro ao salvar as alterações: ' + error.message)
  } finally {
    savingEdit.value = false
  }
}


const deleteArtefact = () => {
  if (confirm(`Tem certeza que deseja deletar "${artefact.value.name}"?`)) {
    console.log('Deletar artefato:', artefact.value.id)
  }
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

watch(showEditModal, (newVal) => {
  if (newVal) {
    initializeEditForm()
  }
})
</script>

<style scoped>
/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #1e1e1e;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  max-width: 700px;
  width: 90%;
  max-height: 85vh;
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
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
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #313131;
}

.modal-header h2 {
  margin: 0;
  color: white;
  font-size: 1.5rem;
}

.close-btn {
  background: none;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.3s;
  border-radius: 4px;
}

.close-btn:hover {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

.modal-body {
  overflow-y: auto;
  padding: 1.5rem;
  flex: 1;
}

.form-section {
  margin-bottom: 2rem;
}

.form-section h3 {
  margin: 0 0 1rem 0;
  color: #737373;
  font-size: 0.95rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding-bottom: 0.75rem;
  border-bottom: 1px solid #313131;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.form-group label {
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
}

.form-input {
  padding: 0.75rem;
  background-color: #262626;
  border: 1px solid #313131;
  border-radius: 6px;
  color: white;
  font-size: 0.95rem;
  transition: all 0.3s;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: #3498db;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
  background-color: #1e1e1e;
}

textarea.form-input {
  resize: vertical;
  min-height: 80px;
}

select.form-input {
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding: 1.5rem;
  border-top: 1px solid #313131;
  background-color: #262626;
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
  font-size: 0.95rem;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #2980b9;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #737373;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a5a5a;
}

.btn-danger {
  background-color: #e74c3c;
  color: white;
}

.btn-danger:hover {
  background-color: #c0392b;
}

/* Existing styles */
.artefact-detail-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

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
  background: #1e1e1e;
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

.description-text {
  margin: 0;
  color: white;
  line-height: 1.8;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

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

  .modal-content {
    width: 95%;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .form-actions button {
    width: 100%;
  }
}
</style>
