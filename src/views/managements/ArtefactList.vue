<template>
  <ManagerLayout
    page-title="Listagem de Artefatos"
    breadcrumb="Acervo > Listagem de Artefatos"
  >
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
          Filtros {{ activeFiltersCount > 0 ? `(${activeFiltersCount})` : "" }}
        </button>
        <button class="btn-primary" @click="showNewArtefactsModal = true">
          Novo Artefato
        </button>
      </div>

      <!-- Filters Panel -->
      <div v-if="showFilters" class="filters-panel">
        <div class="filters-grid">
          <div class="filter-group">
            <label>Coleção</label>
            <select v-model="filters.collection" class="filter-select">
              <option value="">Todas</option>
              <option value="Tibutius">Tibutius</option>
              <option value="Joinville">Joinville</option>
              <option value="Arqueologia">Arqueologia</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Matéria-Prima</label>
            <select v-model="filters.rawMaterial" class="filter-select">
              <option value="">Todas</option>
              <option value="Cerâmica">Cerâmica</option>
              <option value="Animal">Animal</option>
              <option value="Vegetal">Vegetal</option>
              <option value="Mineral">Mineral</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Estado de Conservação</label>
            <select v-model="filters.conservationStatus" class="filter-select">
              <option value="">Todos</option>
              <option :value="1">Perfeito</option>
              <option :value="2">Bom</option>
              <option :value="3">Regular</option>
              <option :value="4">Ruim</option>
              <option :value="5">Crítico</option>
              <option :value="6">Irreversível</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Localização</label>
            <select v-model="filters.location" class="filter-select">
              <option value="">Todas</option>
              <option value="Reserva Antiga">Reserva Antiga</option>
              <option value="Reserva Nova">Reserva Nova</option>
              <option value="Em Exposição">Em Exposição</option>
            </select>
          </div>
        </div>
        <div class="filters-actions">
          <button class="btn-secondary" @click="clearFilters">
            Limpar Filtros
          </button>
        </div>
      </div>

      <!-- View Toggle + Sort + Pagination Options -->
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
        <p>
          Mostrando <strong>{{ paginatedArtefacts.length }}</strong> de
          <strong>{{ filteredArtefacts.length }}</strong> artefatos
        </p>
      </div>

      <!-- TABLE VIEW -->
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
            <tr
              v-for="Artefact in paginatedArtefacts"
              :key="Artefact.id"
              class="Artefacts-row"
            >
              <td class="accession-number">{{ Artefact.id }}</td>
              <td class="Artefacts-name">{{ Artefact.name }}</td>
              <td>{{ Artefact.collection?.name }}</td>
              <td>
                <span
                  class="badge"
                  :class="(Artefact.raw_material?.name || '').toLowerCase()"
                >
                  {{ Artefact.raw_material?.name }}
                </span>
              </td>
              <td>
                <span
                  class="status-badge"
                  :class="
                    stateConverter(Artefact.conservation_status).toLowerCase()
                  "
                >
                  {{ stateConverter(Artefact.conservation_status) }}
                </span>
              </td>
              <td>{{ Artefact.localization?.room }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- GRID VIEW -->
      <div v-else class="grid-container">
        <div
          v-for="Artefact in paginatedArtefacts"
          :key="Artefact.id"
          class="grid-card"
        >
          <div class="card-image-wrapper">
            <img
              v-if="getImageUrl(Artefact)"
              :src="getImageUrl(Artefact)"
              :alt="Artefact.name"
              class="card-image"
              loading="lazy"
              @error="handleImageError"
            />
            <div v-else class="card-image-placeholder">Sem imagem</div>
          </div>
          <div class="card-header">
            <h4 class="card-title">{{ Artefact.name }}</h4>
            <span class="accession-badge">{{ Artefact.id }}</span>
          </div>
          <div class="card-meta">
            <div class="meta-row">
              <span class="meta-label">Coleção:</span>
              <span class="meta-value">{{ Artefact.collection?.name }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Matéria-Prima:</span>
              <span class="meta-value">{{ Artefact.raw_material?.name }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Estado:</span>
              <span class="meta-value">{{
                stateConverter(Artefact.conservation_status)
              }}</span>
            </div>
            <div class="meta-row">
              <span class="meta-label">Localização:</span>
              <span class="meta-value">{{ Artefact.localization?.room }}</span>
            </div>
          </div>
          <div class="card-actions">
            <button class="action-btn view" @click="viewArtefact(Artefact)">
              Ver
            </button>
            <button class="action-btn edit" @click="editArtefact(Artefact)">
              Editar
            </button>
            <button class="action-btn delete" @click="deleteArtefact(Artefact)">
              Deletar
            </button>
          </div>
        </div>
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
  </ManagerLayout>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from "vue";
import ManagerLayout from "@/layouts/ManagerLayout.vue";
import { useArtefactsStore } from "@/stores/useArtefactStore";

const store = useArtefactsStore();

// REFS
const artefactsList = ref([]);
const searchQuery = ref("");
const showFilters = ref(false);
const viewMode = ref("table");
const sortBy = ref("recent");
const currentPage = ref(1);
const itemsPerPage = ref(25);
const showNewArtefactsModal = ref(false);
const showEditModal = ref(false);
const currentEditingArtefact = ref(null);

// FILTERS
const filters = reactive({
  collection: "",
  rawMaterial: "",
  conservationStatus: "",
  location: "",
});

// CONVERTER
function stateConverter(item) {
  switch (item) {
    case 1:
      return "Perfeito";
    case 2:
      return "Bom";
    case 3:
      return "Regular";
    case 4:
      return "Ruim";
    case 5:
      return "Crítico";
    case 6:
      return "Irreversível";
    default:
      return "Desconhecido";
  }
}

// IMAGE FUNCTIONS
function getImageUrl(artefact) {
  try {
    if (artefact.images?.length > 0) {
      const image = artefact.images[0];
      if (image.secure_url) {
        return optimizeImageUrl(image.secure_url);
      }
      if (image.url) {
        return optimizeImageUrl(image.url);
      }
    }

    if (artefact.image_url) {
      return optimizeImageUrl(artefact.image_url);
    }

    if (artefact.photo) {
      return optimizeImageUrl(artefact.photo);
    }

    return null;
  } catch (e) {
    console.error("Erro ao obter URL da imagem:", e);
    return null;
  }
}

function optimizeImageUrl(url) {
  if (!url) return null;

  if (url.includes("cloudinary") || url.includes("/upload/")) {
    return url.replace("/upload/", "/upload/f_auto,q_auto,w_400,h_300,c_fill/");
  }

  return url;
}

function handleImageError(event) {
  event.target.src = "/fallback-image.png";
  event.target.style.opacity = "0.5";
}

// COMPUTED - FILTRADOS + ORDENADOS
const filteredArtefacts = computed(() => {
  let result = artefactsList.value;

  // BUSCA
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    result = result.filter(
      (a) =>
        (a.name || "").toLowerCase().includes(q) ||
        (a.id || "").toLowerCase().includes(q)
    );
  }

  // FILTROS
  if (filters.collection) {
    result = result.filter((a) => a.collection?.name === filters.collection);
  }
  if (filters.rawMaterial) {
    result = result.filter((a) => a.raw_material?.name === filters.rawMaterial);
  }
  if (filters.conservationStatus) {
    result = result.filter(
      (a) => a.conservation_status == filters.conservationStatus
    );
  }
  if (filters.location) {
    result = result.filter((a) => a.localization?.room === filters.location);
  }

  // ORDENAÇÃO
  if (sortBy.value === "recent") {
    result.sort((a, b) => {
      const dateA = new Date(a.created_at || 0);
      const dateB = new Date(b.created_at || 0);
      return dateB - dateA;
    });
  } else if (sortBy.value === "name") {
    result.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  } else if (sortBy.value === "id") {
    result.sort((a, b) => (a.id || "").localeCompare(b.id || ""));
  }

  return result;
});

// COMPUTED - PAGINADOS
const paginatedArtefacts = computed(() => {
  if (!filteredArtefacts.value || filteredArtefacts.value.length === 0) {
    return [];
  }
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredArtefacts.value.slice(start, end);
});

// COMPUTED - TOTAL DE PÁGINAS
const totalPages = computed(() => {
  return Math.max(
    1,
    Math.ceil(filteredArtefacts.value.length / itemsPerPage.value)
  );
});

// COMPUTED - CONTAGEM DE FILTROS ATIVOS
const activeFiltersCount = computed(() => {
  return Object.values(filters).filter((v) => v !== "").length;
});

// METHODS
function clearFilters() {
  filters.collection = "";
  filters.rawMaterial = "";
  filters.conservationStatus = "";
  filters.location = "";
  searchQuery.value = "";
  currentPage.value = 1;
}

function viewArtefact(artefact) {
  console.log("Visualizar artefato:", artefact);
}

function editArtefact(artefact) {
  currentEditingArtefact.value = artefact;
  showEditModal.value = true;
}

async function deleteArtefact(artefact) {
  if (!confirm(`Tem certeza que deseja deletar "${artefact.name}"?`)) return;

  try {
    await store.remove(artefact.id);
    artefactsList.value = artefactsList.value.filter(
      (a) => a.id !== artefact.id
    );
    console.log("Artefato deletado com sucesso");
  } catch (e) {
    console.error("Erro ao deletar artefato:", e);
    alert("Erro ao deletar artefato");
  }
}

async function loadArtefacts() {
  try {
    const data = await store.fetchAll();

    if (!Array.isArray(data)) {
      console.warn("Dados retornados não são um array");
      artefactsList.value = [];
      return;
    }

    artefactsList.value = data;
    console.log(`${data.length} artefatos carregados`);
  } catch (e) {
    console.error("Erro ao carregar artefatos:", e);
    artefactsList.value = [];
    alert("Erro ao carregar artefatos");
  }
}

// LIFECYCLE
onMounted(() => {
  loadArtefacts();
});

// WATCHERS
watch([searchQuery, filters], () => {
  currentPage.value = 1;
});

watch(itemsPerPage, () => {
  currentPage.value = 1;
});
</script>

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
