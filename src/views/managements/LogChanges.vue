<template>
  <ManagerLayout
    page-title="Log de Auditoria"
    breadcrumb="Acervo > Log de Auditoria"
  >
    <div class="audit-log-container">
      
      <div class="search-filters-bar">
        <div class="search-box">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar por usuário, tabela ou ID do registro..."
            class="search-input"
          />
        </div>
        <button class="filter-toggle" @click="showFilters = !showFilters">
          Filtros {{ activeFiltersCount > 0 ? `(${activeFiltersCount})` : "" }}
        </button>
      </div>

      <div v-if="showFilters" class="filters-panel">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Tipo de Mudança</label>
            <select v-model="filters.changeType" class="filter-select">
              <option value="">Todos</option>
              <option :value="1">Criação</option>
              <option :value="2">Atualização</option>
              <option :value="3">Exclusão</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Tabela</label>
            <select v-model="filters.tableName" class="filter-select">
              <option value="">Todas</option>
              <option value="artefatos">Artefatos</option>
              <option value="usuarios">Usuários</option>
              <option value="colecoes">Coleções</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Usuário</label>
            <input
              v-model="filters.user"
              type="text"
              placeholder="Nome do usuário"
              class="filter-input"
            />
          </div>
          <div class="filter-group">
            <label>Data Inicial</label>
            <input
              v-model="filters.dateFrom"
              type="date"
              class="filter-input"
            />
          </div>
          <div class="filter-group">
            <label>Data Final</label>
            <input
              v-model="filters.dateTo"
              type="date"
              class="filter-input"
            />
          </div>
        </div>
        <div class="filters-actions">
          <button class="btn-secondary" @click="clearFilters">
            Limpar Filtros
          </button>
        </div>
      </div>

      <div class="view-options">
        <div class="sort-options">
          <label>Ordenar por:</label>
          <select v-model="sortBy" class="sort-select">
            <option value="recent">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
            <option value="user">Usuário (A-Z)</option>
            <option value="action">Tipo de Ação</option>
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

      <div class="results-info">
        <p>
          Mostrando <strong>{{ paginatedLogs.length }}</strong> de
          <strong>{{ filteredLogs.length }}</strong> registros
        </p>
      </div>

      <div class="table-container">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Data/Hora</th>
              <th>Usuário</th>
              <th>Tipo de Ação</th>
              <th>Tabela</th>
              <th>ID do Registro</th>
              <th>Resumo da Alteração</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="log in paginatedLogs"
              :key="log.id"
              class="audit-row"
              :class="changeTypeClass(log.change)"
            >
              <td class="date-time">
                {{ formatDateTime(log.date_time) }}
              </td>
              <td class="user-cell">
                <span class="user-badge">{{ log.user }}</span>
              </td>
              <td class="change-type">
                <span :class="`badge-${getChangeType(log.change).toLowerCase()}`">
                  {{ getChangeType(log.change) }}
                </span>
              </td>
              <td class="table-name">{{ log.table_name }}</td>
              <td class="record-id">
                <code>{{ log.record_id }}</code>
              </td>
              <td class="reason-cell">
                <span class="reason-text" :title="log.reason">
                  {{ truncateText(log.reason, 50) }}
                </span>
              </td>
              <td class="actions">
                <button class="action-btn view" @click="viewDetails(log)">
                  Ver
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div v-if="filteredLogs.length === 0" class="empty-state">
        <p>Nenhum registro de auditoria encontrado</p>
      </div>

      <div v-if="totalPages > 1" class="pagination">
        <button
          :disabled="currentPage === 1"
          @click="currentPage--"
          class="pagination-btn"
        >
          Anterior
        </button>
        <div class="pagination-info">
          Página <strong>{{ currentPage }}</strong> de
          <strong>{{ totalPages }}</strong>
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

    <div v-if="showDetailModal" class="modal-overlay" @click="showDetailModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h2>Detalhes da Auditoria</h2>
          <button class="close-btn" @click="showDetailModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="detail-row">
            <span class="detail-label">Data/Hora:</span>
            <span class="detail-value">{{ formatDateTime(selectedLog?.date_time) }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Usuário:</span>
            <span class="detail-value">{{ selectedLog?.user }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tipo de Ação:</span>
            <span class="detail-value">
              <span :class="`badge-${getChangeType(selectedLog?.change).toLowerCase()}`">
                {{ getChangeType(selectedLog?.change) }}
              </span>
            </span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Tabela:</span>
            <span class="detail-value">{{ selectedLog?.table_name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">ID do Registro:</span>
            <span class="detail-value"><code>{{ selectedLog?.record_id }}</code></span>
          </div>
          <div class="detail-row full-width">
            <span class="detail-label">Resumo da Alteração:</span>
            <span class="detail-value detail-reason">{{ selectedLog?.reason }}</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-secondary" @click="showDetailModal = false">Fechar</button>
        </div>
      </div>
    </div>

  </ManagerLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue"
import ManagerLayout from "@/layouts/ManagerLayout.vue"
import { useAuditStore } from "@/stores/useAuditStore"

const store = useAuditStore()

const logsList = ref([])
const searchQuery = ref("")
const showFilters = ref(false)
const sortBy = ref("recent")
const currentPage = ref(1)
const itemsPerPage = ref(25)
const showDetailModal = ref(false)
const selectedLog = ref(null)

const filters = reactive({
  changeType: "",
  tableName: "",
  user: "",
  dateFrom: "",
  dateTo: "",
})

function getChangeType(changeCode) {
  switch (Number(changeCode)) {
    case 1:
      return "Criação"
    case 2:
      return "Atualização"
    case 3:
      return "Exclusão"
    default:
      return "Desconhecido"
  }
}

function changeTypeClass(changeCode) {
  const type = getChangeType(changeCode).toLowerCase()
  return `type-${type}`
}

function formatDateTime(dateString) {
  if (!dateString) return "-"
  const date = new Date(dateString)
  return date.toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}

function truncateText(text, maxLength) {
  if (!text) return "-"
  if (text.length > maxLength) {
    return text.substring(0, maxLength) + "..."
  }
  return text
}

const filteredLogs = computed(() => {
  let result = logsList.value

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(
      (log) =>
        (log.user || "").toLowerCase().includes(q) ||
        (log.table_name || "").toLowerCase().includes(q) ||
        log.record_id.toString().includes(q)
    )
  }

  if (filters.changeType) {
    result = result.filter((log) => log.change == filters.changeType)
  }
  if (filters.tableName) {
    result = result.filter((log) => log.table_name === filters.tableName)
  }
  if (filters.user) {
    result = result.filter((log) =>
      log.user.toLowerCase().includes(filters.user.toLowerCase())
    )
  }
  if (filters.dateFrom) {
    const dateFrom = new Date(filters.dateFrom)
    result = result.filter((log) => new Date(log.date_time) >= dateFrom)
  }
  if (filters.dateTo) {
    const dateTo = new Date(filters.dateTo)
    dateTo.setHours(23, 59, 59, 999)
    result = result.filter((log) => new Date(log.date_time) <= dateTo)
  }

  if (sortBy.value === "recent") {
    result.sort((a, b) => new Date(b.date_time) - new Date(a.date_time))
  } else if (sortBy.value === "oldest") {
    result.sort((a, b) => new Date(a.date_time) - new Date(b.date_time))
  } else if (sortBy.value === "user") {
    result.sort((a, b) => (a.user || "").localeCompare(b.user || ""))
  } else if (sortBy.value === "action") {
    result.sort((a, b) => a.change - b.change)
  }

  return result
})

const paginatedLogs = computed(() => {
  if (!filteredLogs.value || filteredLogs.value.length === 0) {
    return []
  }
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLogs.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.max(1, Math.ceil(filteredLogs.value.length / itemsPerPage.value))
})

const activeFiltersCount = computed(() => {
  return Object.values(filters).filter((v) => v !== "").length
})

function clearFilters() {
  filters.changeType = ""
  filters.tableName = ""
  filters.user = ""
  filters.dateFrom = ""
  filters.dateTo = ""
  searchQuery.value = ""
  currentPage.value = 1
}

function viewDetails(log) {
  selectedLog.value = log
  showDetailModal.value = true
}

  const headers = [
    "Data/Hora",
    "Usuário",
    "Tipo de Ação",
    "Tabela",
    "ID do Registro",
    "Resumo da Alteração",
  ]

  const rows = filteredLogs.value.map((log) => [
    formatDateTime(log.date_time),
    log.user,
    getChangeType(log.change),
    log.table_name,
    log.record_id,
    log.reason,
  ])

async function loadLogs() {
  try {
    const data = await store.fetchAll()

    if (!Array.isArray(data)) {
      console.warn("Dados retornados não são um array")
      logsList.value = []
      return
    }

    logsList.value = data
    console.log(`${data.length} registros de auditoria carregados`)
  } catch (e) {
    console.error("Erro ao carregar logs:", e)
    logsList.value = []
  }
}

onMounted(() => {
  loadLogs()
})

watch([searchQuery, filters], () => {
  currentPage.value = 1
})

watch(itemsPerPage, () => {
  currentPage.value = 1
})
</script>

<style scoped>
.audit-log-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

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
.btn-export {
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
.btn-export:hover {
  border-color: #2980b9;
  background-color: #262626;
}

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

.filter-select,
.filter-input {
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

.view-options {
  display: flex;
  gap: 2rem;
  align-items: center;
  flex-wrap: wrap;
  padding: 1rem;
  background: #1e1e1e;
  border-radius: 6px;
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

.results-info {
  color: #7f8c8d;
  font-size: 0.95rem;
}

.table-container {
  background: #1e1e1e;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}

.audit-table {
  width: 100%;
  border-collapse: collapse;
  color: white;
}

.audit-table thead {
  background-color: #262626;
}

.audit-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.9rem;
  border-bottom: 1px solid #313131;
}

.audit-table td {
  padding: 1rem;
  border-bottom: 1px solid #313131;
}

.audit-row:hover {
  background-color: #262626;
}

.audit-row.type-criação {
  border-left: 4px solid #2baa71;
}

.audit-row.type-atualização {
  border-left: 4px solid #3498db;
}

.audit-row.type-exclusão {
  border-left: 4px solid #c0392b;
}

.date-time {
  font-weight: 600;
  color: #ecf0f1;
  white-space: nowrap;
}

.user-cell {
  font-weight: 600;
}

.user-badge {
  background-color: #262626;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  border: 1px solid #737373;
}

.badge-criação {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #2baa71;
  color: #2baa71;
}

.badge-atualização {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #3498db;
  color: #3498db;
}

.badge-exclusão {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  border: 1px solid #c0392b;
  color: #c0392b;
}

.table-name {
  font-family: monospace;
  color: #bdc3c7;
}

.record-id {
  font-family: monospace;
  background-color: #262626;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
}

code {
  color: #ecf0f1;
}

.reason-cell {
  max-width: 300px;
}

.reason-text {
  display: block;
  color: #bdc3c7;
  word-break: break-word;
  cursor: help;
}

.actions {
  text-align: center;
}

.action-btn {
  padding: 0.5rem;
  border: 1px solid #1a91e6;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  color: #1a91e6;
  transition: all 0.3s;
}

.action-btn:hover {
  background-color: rgba(26, 145, 230, 0.1);
}

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

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #7f8c8d;
  font-size: 1.1rem;
}

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
}

.modal-content {
  background-color: #1e1e1e;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
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
}

.close-btn:hover {
  color: #3498db;
}

.modal-body {
  padding: 1.5rem;
}

.detail-row {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
  align-items: flex-start;
}

.detail-row.full-width {
  flex-direction: column;
}

.detail-label {
  font-weight: 600;
  color: #7f8c8d;
  min-width: 150px;
  flex-shrink: 0;
}

.detail-value {
  color: white;
  word-break: break-word;
  flex: 1;
}

.detail-reason {
  background-color: #262626;
  padding: 1rem;
  border-radius: 4px;
  border-left: 3px solid #3498db;
  white-space: pre-wrap;
  word-break: break-word;
}

.modal-footer {
  padding: 1.5rem;
  border-top: 1px solid #313131;
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

@media (max-width: 768px) {
  .search-filters-bar {
    flex-direction: column;
  }

  .view-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }

  .audit-table {
    font-size: 0.85rem;
  }

  .audit-table th,
  .audit-table td {
    padding: 0.5rem;
  }

  .detail-row {
    flex-direction: column;
  }

  .detail-label {
    min-width: auto;
  }

  .modal-content {
    width: 95%;
  }
}
</style>
