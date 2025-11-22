<template>
  <ManagerLayout page-title="Listagem de Artefatos" breadcrumb="Acervo > Listagem de Artefatos">
    <div class="Artefacts-list-container">
      <!-- Search and Filters Bar -->
      <div class="search-filters-bar">
        <div class="search-box">
          <input
            v-model="searchQuery"
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

      <!-- Filters Panel -->
      <div v-if="showFilters" class="filters-panel">
        <div class="filters-grid">
          <!-- Collection Filter -->
          <div class="filter-group">
            <label>Coleção</label>
            <select v-model="filters.collection" class="filter-select">
              <option value="">Todas</option>
              <option value="tiburtius">Tiburtius</option>
              <option value="joinville">Joinville</option>
              <option value="arqueologia">Arqueologia</option>
            </select>
          </div>

          <!-- Raw Material Filter -->
          <div class="filter-group">
            <label>Matéria-Prima</label>
            <select v-model="filters.rawMaterial" class="filter-select">
              <option value="">Todas</option>
              <option value="animal">Animal</option>
              <option value="vegetal">Vegetal</option>
              <option value="mineral">Mineral</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <!-- Sub-Type Filter -->
          <div class="filter-group">
            <label>Sub-Tipo</label>
            <select v-model="filters.subType" class="filter-select">
              <option value="">Todos</option>
              <option value="ceramica">Cerâmica</option>
              <option value="osso">Osso</option>
              <option value="concha">Concha</option>
              <option value="pedra">Pedra</option>
            </select>
          </div>

          <!-- Conservation Status Filter -->
          <div class="filter-group">
            <label>Estado de Conservação</label>
            <select v-model="filters.conservationStatus" class="filter-select">
              <option value="">Todos</option>
              <option value="excelente">Excelente</option>
              <option value="bom">Bom</option>
              <option value="regular">Regular</option>
              <option value="ruim">Ruim</option>
            </select>
          </div>

          <!-- Location Filter -->
          <div class="filter-group">
            <label>Localização</label>
            <select v-model="filters.location" class="filter-select">
              <option value="">Todas</option>
              <option value="reserva-antiga">Reserva Antiga</option>
              <option value="reserva-nova">Reserva Nova</option>
              <option value="exposicao">Em Exposição</option>
              <option value="emprestimo">Em Empréstimo</option>
            </select>
          </div>

          <!-- Dating Filter -->
          <div class="filter-group">
            <label>Período de Datação</label>
            <div class="dating-inputs">
              <input
                v-model="filters.datingFrom"
                type="number"
                placeholder="De"
                class="filter-input"
              />
              <input
                v-model="filters.datingTo"
                type="number"
                placeholder="Até"
                class="filter-input"
              />
            </div>
          </div>
        </div>

        <div class="filters-actions">
          <button class="btn-secondary" @click="clearFilters">Limpar Filtros</button>
          <button class="btn-primary" @click="applyFilters">Aplicar Filtros</button>
        </div>
      </div>

      <!-- View Options -->
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
            <option value="accession">Número de Acervo</option>
            <option value="collection">Coleção</option>
          </select>
        </div>

        <div class="items-per-page">
          <label>Itens por página:</label>
          <select v-model.number="itemsPerPage" class="items-select">
            <option value="10">10</option>
            <option value="25">25</option>
            <option value="50">50</option>
            <option value="100">100</option>
          </select>
        </div>
      </div>

      <!-- Results Info -->
      <div class="results-info">
        <p>Mostrando <strong>{{ 0 }}</strong> de <strong>{{ 0 }}</strong> artefatos</p>
      </div>

      <!-- Table View -->
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
          <tbody>
            <tr v-for="Artefact in Artefacts" :key="Artefact.id" class="Artefacts-row">
              <td class="accession-number">{{ Artefact.id }}</td>
              <td class="Artefacts-name">{{ Artefact.name }}</td>
              <td>{{ Artefact.collection.name }}</td>
              <td>
                <span class="badge" :class="(Artefact.rawMaterial || '').toString().toLowerCase()">
                  {{ Artefact.raw_material.name }}
                </span>
              </td>
              <td>
                <span class="status-badge" :class="(Artefact.conservationStatus || '').toString().toLowerCase()">
                  {{ stateConverter(Artefact.conservation_status) }}
                </span>
              </td>
              <td>{{ Artefact.localization.room }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <!-- Grid View -->
      <div v-else class="grid-container">
        <ArtefactsCard
          v-for="Artefacts in paginatedArtefacts"
          :key="Artefacts.id"
          :Artefacts="Artefacts"
          @view="viewArtefacts"
          @edit="editArtefacts"
          @delete="deleteArtefacts"
        />
      </div>

      <!-- Pagination -->
      <div class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="pagination-btn"
        >
          Anterior
        </button>

        <div class="pagination-info">
          Página <strong>{{ currentPage }}</strong> de <strong>{{ totalPages }}</strong>
        </div>

        <button
          :disabled="currentPage === totalPages"
          @click="currentPage++"
          class="pagination-btn"
        >
          Próxima
        </button>
      </div>
    </div>
  </ManagerLayout>
</template>

<script setup>
import { ref, reactive, computed, watch, onMounted } from 'vue'
import ManagerLayout from '@/layouts/ManagerLayout.vue'
import ArtefactCard from '@/components/ArtefactCard.vue'
import { useArtefactsStore } from '@/stores/useArtefactStore'

const Artefacts = ref([])

const store = useArtefactsStore()

const searchQuery = ref('')
const showFilters = ref(false)
const viewMode = ref('table')
const sortBy = ref('recent')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const showNewArtefactsModal = ref(false)
const filters = reactive({
  collection: '',
  rawMaterial: '',
  subType: '',
  conservationStatus: '',
  location: '',
  datingFrom: '',
  datingTo: '',
})

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
  }
}

const filteredArtefacts = computed(() => {
  let result = Artefacts.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(a =>
      (a.name || '').toLowerCase().includes(q) ||
      (a.accessionNumber || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q)
    )
  }

  if (filters.collection) result = result.filter(a => a.collection === filters.collection)
  if (filters.rawMaterial) result = result.filter(a => a.rawMaterial === filters.rawMaterial)
  if (filters.subType) result = result.filter(a => a.subType === filters.subType)
  if (filters.conservationStatus) result = result.filter(a => a.conservationStatus === filters.conservationStatus)
  if (filters.location) result = result.filter(a => a.location === filters.location)

  return result
})

const paginatedArtefacts = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredArtefacts.value.slice(start, end)
})

const totalPages = computed(() => Math.ceil(filteredArtefacts.value.length / itemsPerPage.value))
const activeFiltersCount = computed(() => Object.values(filters).filter(v => v !== '').length)

function applyFilters() {
  currentPage.value = 1
  loadArtefacts({ filters: { ...filters, q: searchQuery.value }, page: currentPage.value })
}

function clearFilters() {
  filters.collection = ''
  filters.rawMaterial = ''
  filters.subType = ''
  filters.conservationStatus = ''
  filters.location = ''
  filters.datingFrom = ''
  filters.datingTo = ''
  searchQuery.value = ''
  currentPage.value = 1
  loadArtefacts()
}

function viewArtefacts(Artefacts) {
  console.log('Visualizar artefato:', Artefacts)
}

function editArtefact(Artefacts) {
  console.log('Editar artefato:', Artefacts)
}

async function deleteArtefact(Artefacts) {
  if (!confirm(`Tem certeza que deseja deletar \"${Artefacts.name}\"?`)) return
  try {
    await store.remove(Artefacts.id)
    Artefactss.value = Artefactss.value.filter(a => a.id !== Artefacts.id)
  } catch (e) {
    console.error('Erro ao deletar artefato:', e)
  }
}

async function loadArtefacts(options) {
  try {
  const data = await store.fetchAll(options)
    const list = Array.isArray(data) ? data : (data && (data.results ?? data.data))
    console.log('[ArtefactList] normalized list:', list)
    Artefacts.value = Array.isArray(list) ? list : []
  } catch (e) {
    console.error('Erro ao carregar artefatos:', e)
  }
}

watch(itemsPerPage, () => { currentPage.value = 1 })

onMounted( async () => {
  await loadArtefacts()
})

</script>

<style scoped>
.Artefacts-list-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Search and Filters */
.search-filters-bar {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-box {
  flex: 1;
  min-width: 250px;
  position: relative;
}

.search-input {
  width: 100%;
  padding: 0.75rem 1rem 0.75rem;
  border: 1px solid transparent;
  background-color: #1e1e1e;
  color: white;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #737373;
  box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}
.filter-toggle {
  background-color: #1e1e1e;
  border: 1px solid transparent;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  color: white;
  transition: all 0.3s;
}

.filter-toggle:hover {
  border-color: #737373;
}

.btn-primary {
  background-color: #1e1e1e;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
  border: 1px solid transparent
}

.btn-primary:hover {
  border: 1px solid #737373;
}

tr:hover{
  background-color: #1b1b1b;
  cursor: pointer;
}

/* Filters Panel */
.filters-panel {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.filters-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 30px;
  margin-bottom: 25px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: 600;
  color: white;
  font-size: 1rem;
}

.filter-select,
.filter-input {
  padding: 0.5rem;
  border: 1px solid #737373;
  border-radius: 4px;
  font-size: 0.9rem;
}

.dating-inputs {
  display: flex;
  gap: 0.5rem;
}

.filter-input {
  flex: 1;
}

.filters-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

.btn-secondary {
  background-color: #737373;
  color: white;
  border: 1px solid transparent;
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
  border-radius: 6px;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  color: white;
  background: #1e1e1e;
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
}

.sort-select,
.items-select {
  padding: 0.5rem;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  background: white;
}

/* Results Info */
.results-info {
  color: #7f8c8d;
  font-size: 0.95rem;
}

/* Table View */
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
  background-color: #1e1e1e;
  color: white;
}

.Artefactss-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.Artefactss-table td {
  padding: 1rem;
  border-bottom: 1px solid #313131;
}

.accession-number {
  font-weight: 600;
  color: white;
}

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
}

.badge.animal {
  border: 1px solid #d5f4e6;
  color: #d5f4e6;
}

.badge.vegetal {
  border: 1px solid #ffeaa7;
  color: #1e1e1e;
}

.badge.mineral {
  border: 1px solid #d193e9;
  color: #d193e9;
}

.badge.cerâmica {
  border: 1px solid hsl(9, 55%, 62%);
  color: hsl(9, 55%, 62%);
}

.status-badge.excelente {
  border: 1px solid #2baa71;
  color: #2baa71;
}

.status-badge.bom {
  border: 1px solid #6e86d6;
  color: #6e86d6;
}

.status-badge.regular {
  border: 1px solid #ffeaa7;
  color: #ffeaa7;
}

.status-badge.ruim {
  border: 1px solid #fadbd8;
  color: #fadbd8;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: transparent;
  border: 1px solid #ecf0f1;
  cursor: pointer;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s;
}

.action-btn.view {
  color: #ffffffd7;
  border-color: #daeaf5d0;
  background-color: transparent;
  
}

.action-btn.view:hover {
  background-color: #d6eaf8;
}

.action-btn.edit {
  color: #f39c12;
  border-color: #ffeaa7;
  background-color: #fffbf0;
}

.action-btn.edit:hover {
  background-color: #ffeaa7;
}

.action-btn.delete {
  color: #c0392b;
  border-color: #fadbd8;
  background-color: #fff5f5;
}

.action-btn.delete:hover {
  background-color: #fadbd8;
}

/* Grid View */
.grid-container {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: transparent;
  border-radius: 8px;
}

.pagination-btn {
  background-color: #737373;
  color: #1e1e1e;
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
  background-color: #bdc3c7;
  cursor: not-allowed;
}

.pagination-info {
  color: white;
  font-weight: 600;
}

/* Responsive */
@media (max-width: 768px) {
  .search-filters-bar {
    flex-direction: column;
  }

  .search-box {
    min-width: auto;
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
