<template>
    <ManagerLayout page-title="Listagem de Sub-Tipos" breadcrumb="Acervo > Sub-Tipos">
        <div class="SubTypes-list-container">
            <!-- Search and Filters Bar -->
            <div class="search-filters-bar">
                <div class="search-box">
                    <input v-model="searchQuery" type="text" placeholder="Buscar por nome..."
                        class="search-input" />
                </div>

                <button class="filter-toggle" @click="showFilters = !showFilters">
                    Filtros {{ activeFiltersCount > 0 ? `(${activeFiltersCount})` : '' }}
                </button>

                <button class="btn-primary" @click="openCreateModal">
                    Novo Sub-Tipo
                </button>
            </div>

            <!-- Filters Panel -->
            <div v-if="showFilters" class="filters-panel">
                <div class="filters-grid">
                    <div class="filter-group">
                        <label>Matéria-Prima</label>
                        <select v-model="filters.rawMaterial" class="filter-select">
                            <option value="">Todas</option>
                            <option v-for="rm in rawMaterials" :key="rm.id" :value="rm.id">
                                {{ rm.name }}
                            </option>
                        </select>
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
                    sub-tipos</p>
            </div>

            <!-- TABLE -->
            <div v-if="viewMode === 'table'" class="table-container">
                <table class="subtypes-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nome</th>
                            <th>Matéria-Prima</th>
                            <th style="text-align: end;">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in paginatedList" :key="item.id">
                            <td class="subtype-id">{{ item.id }}</td>
                            <td class="subtype-name">{{ item.name }}</td>
                            <td class="raw-material-name">{{ item.raw_material }}</td>
                            <td class="actions-cell">
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
                    <p><strong>Matéria-Prima:</strong> {{ getRawMaterialName(item.raw_material_id) }}</p>
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
        <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>{{ editingItem ? 'Editar Sub-Tipo' : 'Novo Sub-Tipo' }}</h2>
                    <button class="modal-close" @click="closeModal">×</button>
                </div>

                <div class="modal-body">
                    <div class="form-group">
                        <label for="subtype-name">Nome do Sub-Tipo *</label>
                        <input
                            id="subtype-name"
                            v-model="formData.name"
                            type="text"
                            placeholder="Ex: Cerâmica Polida"
                            class="form-input"
                        />
                    </div>

                    <div class="form-group">
                        <label for="subtype-material">Matéria-Prima *</label>
                        <select v-model="formData.rawMaterialId" id="subtype-material" class="form-select">
                            <option value="">Selecione uma matéria-prima</option>
                            <option v-for="rm in rawMaterials" :key="rm.id" :value="rm.id">
                                {{ rm.name }}
                            </option>
                        </select>
                        <span v-if="formErrors.rawMaterialId" class="error-text">
                            {{ formErrors.rawMaterialId }}
                        </span>
                    </div>
                </div>

                <div class="modal-footer">
                    <button class="btn-secondary" @click="closeModal">Cancelar</button>
                    <button class="btn-primary" @click="saveItem">Salvar</button>
                </div>
            </div>
        </div>
    </ManagerLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import ManagerLayout from '@/layouts/ManagerLayout.vue'
import { useRawMaterialStore } from '@/stores/useRawMaterialStore'
import { useSubTypeStore } from '@/stores/useSubTypeStore'

// stores
const rawMaterialStore = useRawMaterialStore()
const subTypeStore = useSubTypeStore()

// reactive lists from stores
const rawMaterials = rawMaterialStore.list
const subTypes = ref([])

// UI State
const searchQuery = ref('')
const showFilters = ref(false)
const viewMode = ref('table')
const sortBy = ref('recent')
const currentPage = ref(1)
const itemsPerPage = ref(25)
const showModal = ref(false)
const editingItem = ref(null)

// Filters
const filters = reactive({ rawMaterial: '' })

// Form data
const formData = reactive({ name: '', rawMaterialId: '' })
const formErrors = reactive({ name: '', rawMaterialId: '' })

// Computed
const activeFiltersCount = computed(() => Object.values(filters).filter(v => v !== '').length)

const filteredList = computed(() => {
    let result = subTypes.value || []
    const q = (searchQuery.value || '').toLowerCase()

    if (searchQuery.value) {
        result = result.filter(r => (r.name || '').toLowerCase().includes(q))
    }

    if (filters.rawMaterial) {
        const id = parseInt(filters.rawMaterial)
        result = result.filter(r => {
            const rid = r.raw_material ?? r.rawMaterialId ?? r.raw_material_id
            return Number(rid) === id
        })
    }

    return result
})

const paginatedList = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredList.value.slice(start, start + itemsPerPage.value)
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredList.value.length / itemsPerPage.value)))

// Methods
function getRawMaterialName(id) {
    const material = (rawMaterials || []).find(rm => rm.id === id)
    return material ? material.name : 'N/A'
}

function normalizeRawMaterialId(item) {
    return item.raw_material ?? item.rawMaterialId ?? item.raw_material_id ?? null
}

function openCreateModal() {
    editingItem.value = null
    formData.name = ''
    formData.rawMaterialId = ''
    clearFormErrors()
    showModal.value = true
}

function openEditModal(item) {
    editingItem.value = { ...item }
    formData.name = item.name
    formData.rawMaterialId = normalizeRawMaterialId(item)
    clearFormErrors()
    showModal.value = true
}

function viewItem(item) { console.log('Ver:', item) }

async function deleteItem(item) {
    if (!confirm(`Deseja excluir "${item.name}"?`)) return
    try {
        const id = item.id
        await subTypeStore.remove(id)
    } catch (err) {
        console.error('Erro ao excluir', err)
        alert('Erro ao excluir.')
    }
}

function clearFormErrors() { formErrors.name = ''; formErrors.rawMaterialId = '' }

function validateForm() {
    clearFormErrors()
    let isValid = true
    if (!formData.name || !formData.name.trim()) { formErrors.name = 'Nome é obrigatório'; isValid = false }
    if (!formData.rawMaterialId) { formErrors.rawMaterialId = 'Matéria-Prima é obrigatória'; isValid = false }
    return isValid
}

async function saveItem() {
    if (!validateForm()) return

    const payload = { name: formData.name.trim(), raw_material: Number(formData.rawMaterialId) }

    try {
        if (editingItem.value) {
            const id = editingItem.value.id
            await subTypeStore.update(id, payload)
        } else {
            await subTypeStore.create(payload)
        }

        closeModal()
    } catch (err) {
        console.error('Erro ao salvar', err)
        alert('Erro ao salvar. Veja console.')
    }
}

function closeModal() {
    showModal.value = false
    editingItem.value = null
    formData.name = ''
    formData.rawMaterialId = ''
    clearFormErrors()
}

function applyFilters() { currentPage.value = 1 }

function clearFilters() { Object.keys(filters).forEach(k => filters[k] = ''); searchQuery.value = ''; currentPage.value = 1 }

// load data
onMounted(async () => {
    await rawMaterialStore.fetchAll()
    // store.fetchAll agora retorna os dados — armazenar localmente
    subTypes.value = await subTypeStore.fetchAll()
})
</script>

<style scoped>
.SubTypes-list-container {
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
}

.filter-select {
    padding: 0.5rem;
    border: 1px solid #737373;
    border-radius: 4px;
    font-size: 0.9rem;
    background-color: white;
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
}

.sort-options,
.items-per-page {
    display: flex;
    gap: 0.5rem;
    align-items: center;
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

.subtypes-table {
    width: 100%;
    border-collapse: collapse;
    color: white;
}

.subtypes-table thead {
    background-color: #1e1e1e;
}

.subtypes-table th {
    padding: 1rem;
    text-align: left;
    font-weight: 600;
    font-size: 0.9rem;
}

.subtypes-table td {
    padding: 1rem;
    border-bottom: 1px solid #313131;
}

.subtype-id {
    font-weight: 600;
    width: 60px;
}

.subtype-name {
    font-weight: 600;
}

.raw-material-name {
    color: #bdc3c7;
}

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
}

.action-btn.view:hover {
    background-color: #d6eaf8;
    color: #1e1e1e;
}

.action-btn.edit {
    color: #f39c12;
    border-color: #f39c12;
}

.action-btn.edit:hover {
    background-color: #f39c12;
    color: #1e1e1e;
}

.action-btn.delete {
    color: #c0392b;
    border-color: #c0392b;
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

/* Modal */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background: #1e1e1e;
    border-radius: 8px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    max-width: 500px;
    width: 90%;
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
    font-size: 1.25rem;
}

.modal-close {
    background: none;
    border: none;
    color: white;
    font-size: 2rem;
    cursor: pointer;
    line-height: 1;
    padding: 0;
}

.modal-body {
    padding: 1.5rem;
}

.form-group {
    margin-bottom: 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    color: white;
    font-weight: 600;
    font-size: 0.95rem;
}

.form-input,
.form-select {
    padding: 0.75rem;
    border: 1px solid #737373;
    border-radius: 4px;
    font-size: 1rem;
    background-color: white;
    color: #1e1e1e;
}

.form-input:focus,
.form-select:focus {
    outline: none;
    border-color: #2980b9;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
}

.error-text {
    color: #c0392b;
    font-size: 0.85rem;
    margin-top: -0.5rem;
}

.modal-footer {
    display: flex;
    gap: 1rem;
    justify-content: flex-end;
    padding: 1.5rem;
    border-top: 1px solid #313131;
}

/* Responsive */
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

    .subtypes-table {
        font-size: 0.85rem;
    }

    .subtypes-table th,
    .subtypes-table td {
        padding: 0.5rem;
    }

    .actions-cell {
        flex-direction: column;
        gap: 0.25rem;
    }

    .modal-content {
        width: 95%;
    }
}
</style>
