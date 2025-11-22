<template>
  <ManagerLayout
    page-title="Painel Principal"
    breadcrumb="Início > Painel Principal"
  >
    <div class="management-container">
      <!-- Stats Overview -->
      <div class="stats-grid">
        <StatCard title="Total de Artefatos" value="12,450" color="#3498db" />
        <StatCard title="Coleções" value="24" color="#2ecc71" />
        <StatCard title="Sítios Arqueológicos" value="18" color="#e74c3c" />
        <StatCard title="Materiais Catalogados" value="8" color="#f39c12" />
      </div>

      <!-- Main Content Grid -->
      <div class="content-grid">
        <!-- Left Column - Quick Actions -->
        <div class="left-column">
          <section class="card">
            <h2>Ações Rápidas</h2>
            <div class="action-buttons">
              <ActionButton
                label="Novo Artefato"
                description="Cadastrar um novo item no acervo"
                @click="navigateTo('/management/add')"
              />

              <ActionButton
                label="Buscar Artefato"
                description="Localizar item no acervo"
                @click="navigateTo('management/artefactsList')"
              />
              <ActionButton
                label="Gestão de Coleções"
                description="Gerenciar coleções e colecionadores"
                @click="navigateTo('collection')"
              />
            </div>
          </section>

          <!-- Vocabulary Management -->
          <section class="card">
            <h2>Vocabulário Controlado</h2>
            <div class="vocab-section">
              <VocabCard
                title="Matéria-Prima"
                items="Animal, Vegetal, Mineral, Outro"
                @click="navigateTo('/management/raw-materials')"
              />
              <VocabCard
                title="Sub-Tipos"
                items="Gerenciar categorias de materiais"
                @click="navigateTo('/management/sub-types')"
              />
            </div>
          </section>
        </div>

        <!-- Right Column - Recent Activity & Status -->
        <div class="right-column">
          <!-- Recent Items -->
          <section class="card">
            <h2>Itens Recentes</h2>
            <div class="recent-items">
              <RecentItemCard
                v-for="item in recentItems"
                :key="item.id"
                :item="item"
              />
            </div>
            <a href="#" class="view-all">Ver todos →</a>
          </section>
        </div>
      </div>

      <!-- Location & Movement Control -->
      <section class="card full-width">
        <h2>Controle de Localização e Movimentação</h2>
        <div class="location-controls">
          <LocationControl
            title="Atualizar Localização"
            description="Registrar mudança de localização física"
            @click="navigateTo('update-location')"
          />
          <LocationControl
            title="Registrar Movimentação"
            description="Documentar movimentação de itens"
            @click="navigateTo('register-movement')"
          />
          <LocationControl
            title="Retirada de Acervo"
            description="Registrar saída de itens"
            @click="navigateTo('item-removal')"
          />
        </div>
      </section>
    </div>
  </ManagerLayout>
</template>

<script setup>
import { ref } from 'vue'
import ManagerLayout from '@/layouts/ManagerLayout.vue'
import StatCard from '@/components/StatCard.vue'
import ActionButton from '@/components/ActionButton.vue'
import VocabCard from '@/components/VocabCard.vue'
import RecentItemCard from '@/components/RecentItemCard.vue'
import LocationControl from '@/components/LocationControl.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const navigateTo = (path) => {
  router.push(path)
}

const recentItems = ref([
  {
    id: 1,
    name: 'Cerâmica Tupiguarani',
    collection: 'Tiburtius',
    date: '2024-11-20',
    status: 'Catalogado'
  },
  {
    id: 2,
    name: 'Osso de Fauna',
    collection: 'Tiburtius',
    date: '2024-11-19',
    status: 'Pendente'
  },
  {
    id: 3,
    name: 'Fragmento Cerâmico',
    collection: 'Joinville',
    date: '2024-11-18',
    status: 'Catalogado'
  }
])
</script>

<style scoped>
.management-container {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

/* Content Grid */
.content-grid {
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
  transition: box-shadow 0.3s;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.card h2 {
  font-size: 1.3rem;
  color: #737373;
  margin: 0 0 1rem 0;
  padding-bottom: 0.5rem;
}

.card.full-width {
  grid-column: 1 / -1;
}

/* Action Buttons */
.action-buttons {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Vocabulary Section */
.vocab-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* Recent Items */
.recent-items {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.view-all {
  color: #737373;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.view-all:hover {
  color: #2980b9;
}

/* Location Controls */
.location-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 1rem;
  }

  .location-controls,
  .audit-controls {
    grid-template-columns: 1fr;
  }
}
</style>
