<template>
    <ManagerLayout page-title="Listagem de Matérias-Primas" breadcrumb="Acervo > Matérias-Primas">
        <div class="Artefacts-list-container">
            <!-- Search and Filters Bar -->
            <div class="search-filters-bar">
                <div class="search-box">
                    <input v-model="searchQuery" type="text" placeholder="Buscar por nome, descrição..."
                        class="search-input" />
                </div>

                <button class="filter-toggle" @click="showFilters = !showFilters">
                    Filtros {{ activeFiltersCount > 0 ? `(${activeFiltersCount})` : '' }}
                </button>

                <button class="btn-primary" @click="openCreateModal">
                    Nova Matéria-Prima
                </button>
            </div>

            <!-- Filters Panel -->
            <div v-if="showFilters" class="filters-panel">
                <div class="filters-grid">
                    <div class="filter-group">
                        <label>Coleção</label>
                        <select v-model="filters.collection" class="filter-select">
                            <option value="">Todas</option>
                            <option value="tiburtius">Tiburtius</option>
                            <option value="joinville">Joinville</option>
                            <option value="arqueologia">Arqueologia</option>
                        </select>
                    </div>

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

                    <div class="filter-group">
                        <label>Período de Datação</label>
                        <div class="dating-inputs">
                            <input v-model="filters.datingFrom" type="number" placeholder="De" class="filter-input" />
                            <input v-model="filters.datingTo" type="number" placeholder="Até" class="filter-input" />
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
                    <button :class="['view-btn', { active: viewMode === 'table' }]"
                        @click="viewMode = 'table'">Tabela</button>
                    <button :class="['view-btn', { active: viewMode === 'grid' }]"
                        @click="viewMode = 'grid'">Grade</button>
                </div>

                <div class="sort-options">
                    <label>Ordenar por:</label>
                    <select v-model="sortBy" class="sort-select">
                        <option value="recent">Mais Recentes</option>
                        <option value="name">Nome (A-Z)</option>
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

            <!-- Results -->
            <div class="results-info">
                <p>Mostrando <strong>{{ paginatedList.length }}</strong> de <strong>{{ filteredList.length }}</strong>
                    matérias-primas</p>
            </div>

            <!-- TABLE -->
            <div v-if="viewMode === 'table'" class="table-container">
                <table class="Artefactss-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Descrição</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in paginatedList" :key="item.idRawMaterial">
                            <td class="accession-number">{{ item.idRawMaterial }}</td>
                            <td class="Artefacts-name">{{ item.name }}</td>
                            <td class="description-cell">{{ item.description }}</td>
                            <td class="actions-cell">
                                <button class="action-btn view" @click="viewItem(item)">Ver</button>
                                <button class="action-btn edit" @click="openEditModal(item)">Editar</button>
                                <button class="action-btn delete" @click="deleteItem(item)">Excluir</button>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- GRID -->
            <div v-else class="grid-container">
                <div v-for="item in paginatedList" :key="item.id" class="card">
                    <h4>{{ item.name }}</h4>
                    <p>{{ item.description }}</p>
                </div>
            </div>

            <!-- PAGINATION -->
            <div class="pagination">
                <button :disabled="currentPage === 1" @click="currentPage--" class="pagination-btn">Anterior</button>
                <div class="pagination-info">
                    Página <strong>{{ currentPage }}</strong> de <strong>{{ totalPages }}</strong>
                </div>
                <button :disabled="currentPage === totalPages" @click="currentPage++"
                    class="pagination-btn">Próxima</button>
            </div>
        </div>

        <!-- MODAL -->
        <RawMaterialModal v-model="showModal" :editing="editingItem" @saved="reload" />
    </ManagerLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import ManagerLayout from '@/layouts/ManagerLayout.vue'
import RawMaterialModal from '@/components/vocabulary/RawMaterialModal.vue'

// Mock data - sem backend
const mockRawMaterials = [
    { idRawMaterial: 1, name: 'Cerâmica Vermelha', description: 'Cerâmica com acabamento polido' },
    { idRawMaterial: 2, name: 'Osso de Mamífero', description: 'Osso trabalhado para ferramentas' },
    { idRawMaterial: 3, name: 'Pedra Calcária', description: 'Blocos de pedra para construção' },
    { idRawMaterial: 4, name: 'Concha de Molusco', description: 'Concha marinha trabalhada' },
    { idRawMaterial: 5, name: 'Argila Cinzenta', description: 'Argila fina para cerâmica' },
]

const rawMaterials = ref([])

const searchQuery = ref('')
const showFilters = ref(false)
const viewMode = ref('table')
const sortBy = ref('recent')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const showModal = ref(false)
const editingItem = ref(null)

const filters = reactive({
    collection: '',
    rawMaterial: '',
    subType: '',
    conservationStatus: '',
    location: '',
    datingFrom: '',
    datingTo: '',
})

const activeFiltersCount = computed(() =>
    Object.values(filters).filter(v => v !== '').length
)

// Carregar dados locais (sem backend)
function loadAll() {
    // Filtrar itens vazios (sem nome)
    rawMaterials.value = mockRawMaterials.filter(item => item.name && item.name.trim() !== '')
}

function openCreateModal() {
    editingItem.value = null
    showModal.value = true
}

function openEditModal(item) {
    editingItem.value = { ...item }
    showModal.value = true
}

function viewItem(item) {
    console.log('Ver:', item)
}

function deleteItem(item) {
    if (!confirm(`Deseja excluir "${item.name}"?`)) return
    const index = rawMaterials.value.findIndex(r => r.idRawMaterial === item.idRawMaterial)
    if (index > -1) {
        rawMaterials.value.splice(index, 1)
    }
}

const filteredList = computed(() => {
    let result = rawMaterials.value
    const q = searchQuery.value.toLowerCase()

    if (searchQuery.value) {
        result = result.filter(r =>
            (r.name || '').toLowerCase().includes(q) ||
            (r.description || '').toLowerCase().includes(q)
        )
    }

    return result
})

const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredList.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() =>
    Math.max(1, Math.ceil(filteredList.value.length / itemsPerPage.value))
)

function applyFilters() {
    currentPage.value = 1
}

function clearFilters() {
    Object.keys(filters).forEach(k => filters[k] = '')
    searchQuery.value = ''
    currentPage.value = 1
}

function reload() {
    loadAll()
}

onMounted(loadAll)
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
    padding: 0.75rem 1rem;
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
    border: 1px solid transparent;
    padding: 0.75rem 1.5rem;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-primary:hover {
    border: 1px solid #737373;
}

tr:hover {
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
    width: 60px;
}

.Artefacts-name {
    font-weight: 600;
    color: white;
    flex: 1;
}

.description-cell {
    color: #bdc3c7;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* CRITICAL FIX - Actions cell alinhadas à direita */
.actions-cell {
    display: flex;
    gap: 0.5rem;
    justify-content: flex-end;
    white-space: nowrap;
}

.action-btn {
    background: transparent;
    border: 1px solid;
    cursor: pointer;
    padding: 0.25rem 0.75rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    transition: all 0.3s;
    flex-shrink: 0;
}

.action-btn.view {
    color: #ffffffd7;
    border-color: #daeaf5d0;
    background-color: transparent;
}

.action-btn.view:hover {
    background-color: #d6eaf8;
    color: #1e1e1e;
}

.action-btn.edit {
    color: #f39c12;
    border-color: #f39c12;
    background-color: transparent;
}

.action-btn.edit:hover {
    background-color: #f39c12;
    color: #1e1e1e;
}

.action-btn.delete {
    color: #c0392b;
    border-color: #c0392b;
    background-color: transparent;
}

.action-btn.delete:hover {
    background-color: #c0392b;
    color: white;
}

/* Grid View */
.grid-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 1.5rem;
}

.card {
    background: #1e1e1e;
    border-radius: 8px;
    padding: 1.5rem;
    border: 1px solid #313131;
}

.card h4 {
    color: white;
    margin: 0 0 0.5rem 0;
}

.card p {
    color: #bdc3c7;
    margin: 0;
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

    .actions-cell {
        flex-direction: column;
        gap: 0.25rem;
    }
}
</style>
