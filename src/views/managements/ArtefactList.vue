<template>
  <ManagerLayout page-title="Listagem de Artefatos" breadcrumb="Acervo > Listagem de Artefatos">
    <div class="artifact-list-container">
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

        <button class="btn-primary" @click="showNewArtifactModal = true">
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
        <p>Mostrando <strong>{{ paginatedArtifacts.length }}</strong> de <strong>{{ filteredArtifacts.length }}</strong> artefatos</p>
      </div>

      <!-- Table View -->
      <div v-if="viewMode === 'table'" class="table-container">
        <table class="artifacts-table">
          <thead>
            <tr>
              <th>Número de Acervo</th>
              <th>Nome</th>
              <th>Coleção</th>
              <th>Matéria-Prima</th>
              <th>Estado</th>
              <th>Localização</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="artifact in paginatedArtifacts" :key="artifact.id" class="artifact-row">
              <td class="accession-number">{{ artifact.accessionNumber }}</td>
              <td class="artifact-name">{{ artifact.name }}</td>
              <td>{{ artifact.collection }}</td>
              <td>
                <span class="badge" :class="artifact.rawMaterial.toLowerCase()">
                  {{ artifact.rawMaterial }}
                </span>
              </td>
              <td>
                <span class="status-badge" :class="artifact.conservationStatus.toLowerCase()">
                  {{ artifact.conservationStatus }}
                </span>
              </td>
              <td>{{ artifact.location }}</td>
              <td class="actions-cell">
                <button class="action-btn view" title="Visualizar" @click="viewArtifact(artifact)">Ver</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Grid View -->
      <div v-else class="grid-container">
        <ArtifactCard
          v-for="artifact in paginatedArtifacts"
          :key="artifact.id"
          :artifact="artifact"
          @view="viewArtifact"
          @edit="editArtifact"
          @delete="deleteArtifact"
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

<script>
import ManagerLayout from '@/layouts/ManagerLayout.vue'
import ArtifactCard from '@/components/ArtifactCard.vue'

export default {
  name: 'ArtifactList',
  components: {
    ManagerLayout,
    ArtifactCard
  },
  data() {
    return {
      searchQuery: '',
      showFilters: false,
      viewMode: 'table',
      sortBy: 'recent',
      currentPage: 1,
      itemsPerPage: 25,
      showNewArtifactModal: false,
      filters: {
        collection: '',
        rawMaterial: '',
        subType: '',
        conservationStatus: '',
        location: '',
        datingFrom: '',
        datingTo: ''
      },
      artifacts: [
        {
          id: 1,
          accessionNumber: 'TIB-001',
          name: 'Cerâmica Tupiguarani',
          collection: 'Tiburtius',
          rawMaterial: 'Cerâmica',
          subType: 'Cerâmica',
          conservationStatus: 'Bom',
          location: 'Reserva Nova',
          dating: '1500-1700',
          description: 'Fragmento de cerâmica com decoração geométrica'
        },
        {
          id: 2,
          accessionNumber: 'TIB-002',
          name: 'Osso de Fauna',
          collection: 'Tiburtius',
          rawMaterial: 'Animal',
          subType: 'Osso',
          conservationStatus: 'Regular',
          location: 'Reserva Antiga',
          dating: '1200-1400',
          description: 'Osso de fauna marinha com marcas de corte'
        },
        {
          id: 3,
          accessionNumber: 'TIB-003',
          name: 'Fragmento Cerâmico',
          collection: 'Joinville',
          rawMaterial: 'Cerâmica',
          subType: 'Cerâmica',
          conservationStatus: 'Excelente',
          location: 'Em Exposição',
          dating: '1300-1600',
          description: 'Fragmento com pintura vermelha'
        },
        {
          id: 4,
          accessionNumber: 'ARQ-001',
          name: 'Concha de Molusco',
          collection: 'Arqueologia',
          rawMaterial: 'Animal',
          subType: 'Concha',
          conservationStatus: 'Bom',
          location: 'Reserva Nova',
          dating: '800-1200',
          description: 'Concha de molusco marinho'
        },
        {
          id: 5,
          accessionNumber: 'ARQ-002',
          name: 'Artefato de Pedra',
          collection: 'Arqueologia',
          rawMaterial: 'Mineral',
          subType: 'Pedra',
          conservationStatus: 'Excelente',
          location: 'Em Exposição',
          dating: '2000-1500',
          description: 'Ferramenta de pedra polida'
        },
        {
          id: 6,
          accessionNumber: 'JOI-001',
          name: 'Vaso Cerâmico',
          collection: 'Joinville',
          rawMaterial: 'Cerâmica',
          subType: 'Cerâmica',
          conservationStatus: 'Regular',
          location: 'Reserva Nova',
          dating: '1400-1700',
          description: 'Vaso com decoração incisa'
        },
        {
          id: 7,
          accessionNumber: 'TIB-004',
          name: 'Dente de Fauna',
          collection: 'Tiburtius',
          rawMaterial: 'Animal',
          subType: 'Osso',
          conservationStatus: 'Bom',
          location: 'Reserva Antiga',
          dating: '1000-1400',
          description: 'Dente de fauna com desgaste natural'
        },
        {
          id: 8,
          accessionNumber: 'ARQ-003',
          name: 'Lâmina de Sílex',
          collection: 'Arqueologia',
          rawMaterial: 'Mineral',
          subType: 'Pedra',
          conservationStatus: 'Excelente',
          location: 'Em Exposição',
          dating: '3000-2000',
          description: 'Lâmina de sílex com gume aguçado'
        }
      ]
    }
  },
  computed: {
    filteredArtifacts() {
      let result = this.artifacts

      if (this.searchQuery) {
        const query = this.searchQuery.toLowerCase()
        result = result.filter(artifact =>
          artifact.name.toLowerCase().includes(query) ||
          artifact.accessionNumber.toLowerCase().includes(query) ||
          artifact.description.toLowerCase().includes(query)
        )
      }

      if (this.filters.collection) {
        result = result.filter(a => a.collection === this.filters.collection)
      }
      if (this.filters.rawMaterial) {
        result = result.filter(a => a.rawMaterial === this.filters.rawMaterial)
      }
      if (this.filters.subType) {
        result = result.filter(a => a.subType === this.filters.subType)
      }
      if (this.filters.conservationStatus) {
        result = result.filter(a => a.conservationStatus === this.filters.conservationStatus)
      }
      if (this.filters.location) {
        result = result.filter(a => a.location === this.filters.location)
      }

      switch (this.sortBy) {
        case 'name':
          result.sort((a, b) => a.name.localeCompare(b.name))
          break
        case 'accession':
          result.sort((a, b) => a.accessionNumber.localeCompare(b.accessionNumber))
          break
        case 'collection':
          result.sort((a, b) => a.collection.localeCompare(b.collection))
          break
        case 'recent':
        default:
          result.sort((a, b) => b.id - a.id)
      }

      return result
    },
    paginatedArtifacts() {
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.filteredArtifacts.slice(start, end)
    },
    totalPages() {
      return Math.ceil(this.filteredArtifacts.length / this.itemsPerPage)
    },
    activeFiltersCount() {
      return Object.values(this.filters).filter(v => v !== '').length
    }
  },
  methods: {
    applyFilters() {
      this.currentPage = 1
    },
    clearFilters() {
      this.filters = {
        collection: '',
        rawMaterial: '',
        subType: '',
        conservationStatus: '',
        location: '',
        datingFrom: '',
        datingTo: ''
      }
      this.searchQuery = ''
      this.currentPage = 1
    },
    viewArtifact(artifact) {
      console.log('Visualizar artefato:', artifact)
    },
    editArtifact(artifact) {
      console.log('Editar artefato:', artifact)
    },
    deleteArtifact(artifact) {
      if (confirm(`Tem certeza que deseja deletar "${artifact.name}"?`)) {
        this.artifacts = this.artifacts.filter(a => a.id !== artifact.id)
      }
    }
  },
  watch: {
    itemsPerPage() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.artifact-list-container {
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

.artifacts-table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

.artifacts-table thead {
  background-color: #1e1e1e;
  color: white;
}

.artifacts-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
}

.artifacts-table td {
  padding: 1rem;
  border-bottom: 1px solid #313131;
}

.accession-number {
  font-weight: 600;
  color: white;
}

.artifact-name {
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
  background-color: #d5f4e6;
  color: #1e1e1e;
}

.badge.vegetal {
  background-color: #ffeaa7;
  color: #1e1e1e;
}

.badge.mineral {
  background-color: #d6eaf8;
  color: #1e1e1e;
}

.badge.cerâmica {
  background-color: hsl(5, 77%, 91%);
  color: #1e1e1e;
}

.status-badge.excelente {
  background-color: #d5f4e6;
  color: #1e1e1e;
}

.status-badge.bom {
  background-color: #d6eaf8;
  color: #1e1e1e;
}

.status-badge.regular {
  background-color: #ffeaa7;
  color: #1e1e1e;
}

.status-badge.ruim {
  background-color: #fadbd8;
  color: #1e1e1e;
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
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s;
}

.action-btn.view {
  color: #2980b9;
  border-color: #d6eaf8;
  background-color: #ecf7ff;
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

  .artifacts-table {
    font-size: 0.85rem;
  }

  .artifacts-table th,
  .artifacts-table td {
    padding: 0.5rem;
  }
}
</style>
