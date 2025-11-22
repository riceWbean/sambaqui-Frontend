<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import ManagerLayout from '@/layouts/ManagerLayout.vue'
import { useArtefatosStore, useDashboardStore } from '@/stores'
import { getSubTypes } from '@/utils/artefacts'

const router = useRouter()

const artefatosStores = useArtefatosStore()
const dashboardStore = useDashboardStore()

const searchQuery = ref('')
const showFilters = ref(false)
const viewMode = ref('table')
const sortBy = ref('recent')
const showNewArtefactsModal = ref(false)
const showComponent = ref(false)
const inputField = ref(null)

function stateConverter(item) {
  switch(item) {
    case 1:
      return 'Perfeito'
    case 2:
      return 'Bom'
    case 3:
      return 'Regular'
    case 4:
      return 'Ruim'
    case 5:
      return 'Crítico'
    case 6:
      return 'Irreversível'
    default:
      return 'Desconhecido'
  }
}

const activeFiltersCount = computed(() => {
  const count = Object.values(artefatosStores.filters)
    .filter(v => v !== '' && v !== 10 && v !== 1)
    .length
  return count
})

function clearFilters() {
  artefatosStores.filters.collection = ''
  artefatosStores.filters.raw_material = ''
  artefatosStores.filters.sub_type = ''
  artefatosStores.filters.conservation_status = ''
  artefatosStores.filters.location = ''
  artefatosStores.filters.dating_from = ''
  artefatosStores.filters.dating_to = ''
  artefatosStores.filters.search = ''
  artefatosStores.filters.page = 1
  artefatosStores.filteredArtefacts = []
  artefatosStores.getAllArtefacts()
}

function viewArtefacts(artefact) {
  router.push({ name: 'managementArtefact', params: { id: artefact.id } })
}


function editArtefact(artefact) {
  router.push({ name: 'managementArtefact', params: { id: artefact.id } })
}

async function deleteArtefact(artefact) {
  if (!confirm(`Tem certeza que deseja deletar "${artefact.name}"?`)) return
  try {
    await artefatosStores.deleteArtefact(artefact.id)
    await artefatosStores.getAllArtefacts()
  } catch (e) {
    console.error('Erro ao deletar artefato:', e)
  }
}

const totalPages = computed(() => {
  const total = dashboardStore.dashboard.total_artefacts || 0
  const perPage = artefatosStores.filters.num_artefacts
  return total % perPage === 0 
    ? Math.floor(total / perPage) 
    : Math.floor(total / perPage) + 1
})

function previousPage() {
  if (artefatosStores.filters.page > 1) {
    artefatosStores.filters.page--
    artefatosStores.getAllArtefacts()
  }
}

function nextPage() {
  if (artefatosStores.filters.page < totalPages.value) {
    artefatosStores.filters.page++
    artefatosStores.getAllArtefacts()
  }
}

watch(() => artefatosStores.filters.num_artefacts, () => {
  artefatosStores.filters.page = 1
  artefatosStores.getAllArtefacts()
})

onMounted(async () => {
  if (inputField.value) {
    inputField.value.focus()
  }
  
  if (Object.keys(dashboardStore.dashboard).length === 0) {
    await dashboardStore.getDashboard()
  }
  
  if (Object.keys(artefatosStores.categories).length === 0) {
    await artefatosStores.getCategories()
  }
  
  if (artefatosStores.artefatos.length === 0) {
    await artefatosStores.getAllArtefacts()
  }
  
  showComponent.value = true
})
</script>



<template>
  <ManagerLayout
    page-title="Listagem de Artefatos"
    breadcrumb="Acervo > Listagem de Artefatos"
  >
    <div class="Artefacts-list-container">
      <div class="search-filters-bar">
        <div class="search-box">
          <input
            ref="inputField" 
            v-model="artefatosStores.filters.search"
            @keyup.enter="artefatosStores.getFilteredArtefacts()"
            type="text"
            placeholder="Buscar por nome, número de acervo..."
            class="search-input"
          />
        </div>
        <button class="filter-toggle" @click="showFilters = !showFilters">
          Filtros {{ activeFiltersCount > 0 ? `(${activeFiltersCount})` : '' }}
        </button>
        <button class="btn-primary" @click="showNewArtefactsModal = true">
          Novo Artefato
        </button>
      </div>

      <div v-if="showFilters" class="filters-panel">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Coleção</label>
            <select v-model="artefatosStores.filters.collection" class="filter-select">
              <option value="">Todas</option>
              <option 
                v-for="collection in artefatosStores.categories.collections" 
                :key="collection.id" 
                :value="collection.id"
              >
                {{ collection.name }}
              </option>
            </select>
          </div>
          
          <div class="filter-group">
            <label>Matéria-Prima</label>
            <select v-model="artefatosStores.filters.raw_material" class="filter-select">
              <option value="">Todas</option>
              <option 
                v-for="rawMaterial in artefatosStores.categories.raw_materials" 
                :key="rawMaterial.id" 
                :value="rawMaterial.id"
              >
                {{ rawMaterial.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Sub-Tipo</label>
            <select 
              v-model="artefatosStores.filters.sub_type" 
              :disabled="artefatosStores.filters.raw_material === ''" 
              class="filter-select"
            >
              <option value="">Todos</option>
              <option 
                v-for="subType in getSubTypes(artefatosStores.categories.sub_type, artefatosStores.filters.raw_material)" 
                :key="subType.id" 
                :value="subType.id"
              >
                {{ subType.name }}
              </option>
            </select>
          </div>

          <div class="filter-group">
            <label>Estado de Conservação</label>
            <select v-model="artefatosStores.filters.conservation_status" class="filter-select">
              <option value="">Todos</option>
              <option value="1">Excelente</option>
              <option value="2">Bom</option>
              <option value="3">Regular</option>
              <option value="4">Ruim</option>
              <option value="5">Crítico</option>
              <option value="6">Irreversível</option>
            </select>
          </div>

          <div class="filter-group">
            <label>Período de Datação</label>
            <div class="dating-inputs">
              <input
                v-model="artefatosStores.filters.dating_from"
                type="number"
                placeholder="De"
                class="filter-input"
              />
              <input
                v-model="artefatosStores.filters.dating_to"
                type="number"
                placeholder="Até"
                class="filter-input"
              />
            </div>
          </div>
        </div>
        
        <div class="filters-actions">
          <button class="btn-secondary" @click="clearFilters">Limpar Filtros</button>
          <button class="btn-primary" @click="artefatosStores.getFilteredArtefacts()">Aplicar Filtros</button>
        </div>
      </div>

      <div class="view-options">
        <div class="view-toggle">
          <button
            :class="['view-btn', { active: viewMode === 'table' }]"
            @click="viewMode = 'table'"
          >
            Tabela
          </button>
          <button
            :class="['view-btn', { active: viewMode === 'grid' }]"
            @click="viewMode = 'grid'"
          >
            Grade
          </button>
        </div>
        <div class="sort-options">
          <label>Ordenar por:</label>
          <select v-model="sortBy" class="sort-select">
            <option value="recent">Mais Recentes</option>
            <option value="name">Nome (A-Z)</option>
            <option value="id">Número de Acervo</option>
          </select>
        </div>
        <div class="items-per-page">
          <label>Itens por página:</label>
          <select v-model.number="artefatosStores.filters.num_artefacts" class="items-select">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <div class="results-info" v-if="showComponent">
        <p v-if="artefatosStores.filteredArtefacts.length === 0">
          Mostrando <strong>{{ artefatosStores.artefatos.results?.length || 0 }}</strong> de 
          <strong>{{ dashboardStore.dashboard.total_artefacts || 0 }}</strong> artefatos
        </p>
        <p v-else>
          Mostrando <strong>{{ artefatosStores.filteredArtefacts.results?.length || 0 }}</strong> de 
          <strong>{{ artefatosStores.artefatos.length }}</strong> artefatos
        </p>
      </div>

      <div v-if="viewMode === 'table'" class="table-container">
        <table class="Artefactss-table">
          <thead>
            <tr>
              <th>Número de Acervo</th>
              <th>Nome</th>
              <th>Coleção</th>
              <th>Matéria-Prima</th>
              <th>Estado</th>
              <th>Localização</th>
            </tr>
          </thead>
          <tbody v-if="artefatosStores.filteredArtefacts.length === 0">
            <tr 
              v-for="artefact in artefatosStores.artefatos.results" 
              :key="artefact.id" 
              class="Artefacts-row"
              @click="viewArtefacts(artefact)"
            >
              <td class="accession-number">{{ artefact.id }}</td>
              <td class="Artefacts-name">{{ artefact.name }}</td>
              <td>{{ artefact.collection?.name }}</td>
              <td>
                <span class="badge" :class="(artefact.raw_material?.name || '').toLowerCase()">
                  {{ artefact.raw_material?.name }}
                </span>
              </td>
              <td>
                <span class="status-badge" :class="stateConverter(artefact.conservation_status).toLowerCase()">
                  {{ stateConverter(artefact.conservation_status) }}
                </span>
              </td>
              <td>{{ artefact.localization?.room }}</td>
            </tr>
          </tbody>
          <tbody v-else>
            <tr 
              v-for="artefact in artefatosStores.filteredArtefacts.results" 
              :key="artefact.id" 
              class="Artefacts-row"
              @click="viewArtefacts(artefact)"
            >
              <td class="accession-number">{{ artefact.id }}</td>
              <td class="Artefacts-name">{{ artefact.name }}</td>
              <td>{{ artefact.collection?.name }}</td>
              <td>
                <span class="badge" :class="(artefact.raw_material?.name || '').toLowerCase()">
                  {{ artefact.raw_material?.name }}
                </span>
              </td>
              <td>
                <span class="status-badge" :class="stateConverter(artefact.conservation_status).toLowerCase()">
                  {{ stateConverter(artefact.conservation_status) }}
                </span>
              </td>
              <td>{{ artefact.localization?.room }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-else class="grid-container">
        <div v-for="artefact in artefatosStores.artefatos.results" :key="artefact.id" class="grid-card" @click="viewArtefacts(artefact)">
          <div class="card-image-wrapper">
            <img
              v-if="artefact.images?.length > 0"
              :src="artefact.images[0].secure_url || artefact.images[0].url"
              :alt="artefact.name"
              class="card-image"
              loading="lazy"
            />
            <div v-else class="card-image-placeholder">Sem imagem</div>
          </div>
          <div class="card-header">
            <h4 class="card-title">{{ artefact.name }}</h4>
            <span class="accession-badge">{{ artefact.id }}</span>
          </div>
          <div class="card-meta">
            <div class="meta-row">
              <span class="meta-label">Coleção:</span>
              <span class="meta-value">{{ artefact.collection?.name }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Matéria-Prima:</span>
              <span class="meta-value">{{ artefact.raw_material?.name }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Estado:</span>
              <span class="meta-value">{{ stateConverter(artefact.conservation_status) }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Localização:</span>
              <span class="meta-value">{{ artefact.localization?.room }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="action-btn view" @click.stop="viewArtefacts(artefact)">Ver</button>
            <button class="action-btn edit" @click.stop="editArtefact(artefact)">Editar</button>
            <button class="action-btn delete" @click.stop="deleteArtefact(artefact)">Deletar</button>
          </div>
        </div>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          :disabled="artefatosStores.filters.page === 1"
          @click="previousPage"
          class="pagination-btn"
        >
          Anterior
        </button>
        <div class="pagination-info">
          Página <strong>{{ artefatosStores.filters.page }}</strong> de <strong>{{ totalPages }}</strong>
        </div>
        <button
          :disabled="artefatosStores.filters.page === totalPages"
          @click="nextPage"
          class="pagination-btn"
        >
          Próxima
        </button>
      </div>
    </div>
  </ManagerLayout>
</template>


<style scoped>
.Artefacts-list-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Search and Filters Bar */
.search-filters-bar {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #737373;
  background-color: #1e1e1e;
  color: white;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #2980b9;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.filter-toggle,
.btn-primary {
  background-color: #1e1e1e;
  color: white;
  border: 1px solid #737373;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.filter-toggle:hover,
.btn-primary:hover {
  border-color: #2980b9;
  background-color: #262626;
}

/* Filters Panel */
.filters-panel {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
}

.filter-select {
  padding: 0.5rem;
  border: 1px solid #737373;
  border-radius: 4px;
  font-size: 0.9rem;
  background-color: #262626;
  color: white;
}

.filters-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-secondary {
  background-color: #737373;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #5a5a5a;
}

/* View Options */
.view-options {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  background: #1e1e1e;
  border-radius: 6px;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: #262626;
  border-radius: 6px;
  padding: 0.25rem;
}

.view-btn {
  background: transparent;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.3s;
  font-weight: 600;
  color: white;
}

.view-btn.active {
  background-color: #737373;
  color: white;
}

.sort-options,
.items-per-page {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.sort-options label,
.items-per-page label {
  font-weight: 600;
  color: white;
  font-size: 0.9rem;
}

.sort-select,
.items-select {
  padding: 0.5rem;
  border: 1px solid #737373;
  border-radius: 4px;
  background-color: #262626;
  color: white;
}

/* Results Info */
.results-info {
  color: #7f8c8d;
  font-size: 0.95rem;
}

/* TABLE VIEW */
.table-container {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.Artefactss-table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

.Artefactss-table thead {
  background-color: #262626;
}

.Artefactss-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid #313131;
}

.Artefactss-table td {
  padding: 1rem;
  border-bottom: 1px solid #313131;
}

.Artefacts-row:hover {
  background-color: #262626;
  cursor: pointer;
}

.accession-number,
.Artefacts-name {
  font-weight: 600;
  color: white;
}

.badge,
.status-badge {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid;
}

.badge.cerâmica {
  border-color: hsl(9, 55%, 62%);
  color: hsl(9, 55%, 62%);
}

.badge.animal {
  border-color: #2baa71;
  color: #2baa71;
}

.badge.vegetal {
  border-color: #ffeaa7;
  color: #ffeaa7;
}

.badge.mineral {
  border-color: #d193e9;
  color: #d193e9;
}

.status-badge.perfeito {
  border-color: #2baa71;
  color: #2baa71;
}

.status-badge.bom {
  border-color: #6e86d6;
  color: #6e86d6;
}

.status-badge.regular {
  border-color: #ffeaa7;
  color: #ffeaa7;
}

.status-badge.ruim {
  border-color: #fadbd8;
  color: #fadbd8;
}

.status-badge.crítico {
  border-color: #f39c12;
  color: #f39c12;
}

.status-badge.irreversível {
  border-color: #c0392b;
  color: #c0392b;
}

/* GRID VIEW */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.grid-card {
  background: #1e1e1e;
  border-radius: 8px;
  border: 1px solid #313131;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.grid-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  border-color: #737373;
}

.card-image-wrapper {
  width: 100%;
  height: 200px;
  border-radius: 6px;
  overflow: hidden;
  background-color: #262626;
  margin-bottom: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-image-placeholder {
  color: #7f8c8d;
  font-size: 0.9rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.card-title {
  margin: 0;
  font-size: 1.1rem;
  color: white;
  font-weight: 700;
  flex: 1;
}

.accession-badge {
  background-color: #262626;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  gap: 0.5rem;
}

.meta-label {
  font-weight: 600;
  color: #7f8c8d;
  min-width: 100px;
}

.meta-value {
  color: white;
  text-align: right;
}

.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
}

.action-btn {
  padding: 0.5rem;
  border: 1px solid;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-btn.view {
  color: #1a91e6;
  border-color: #1a91e6;
}

.action-btn.view:hover {
  background-color: rgba(26, 145, 230, 0.1);
}

.action-btn.edit {
  color: #ddec07;
  border-color: #ddec07;
}

.action-btn.edit:hover {
  background-color: rgba(221, 236, 7, 0.1);
}

.action-btn.delete {
  color: #c0392b;
  border-color: #c0392b;
}

.action-btn.delete:hover {
  background-color: rgba(192, 57, 43, 0.1);
}

/* PAGINATION */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
}

.pagination-btn {
  background-color: #737373;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #2980b9;
}

.pagination-btn:disabled {
  background-color: #4a4a4a;
  cursor: not-allowed;
  opacity: 0.5;
}

.pagination-info {
  color: white;
  font-weight: 600;
}

/* RESPONSIVE */
@media (max-width: 768px) {
  .search-filters-bar {
    flex-direction: column;
  }

  .view-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .grid-container {
    grid-template-columns: 1fr;
  }

  .Artefactss-table {
    font-size: 0.85rem;
  }

  .Artefactss-table th,
  .Artefactss-table td {
    padding: 0.5rem;
  }
}
</style>
