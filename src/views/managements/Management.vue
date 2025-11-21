<template>
  <ManagerLayout page-title="Painel Principal" breadcrumb="Início > Painel Principal">
    <div class="management-container">
      <!-- Stats Overview -->
      <div class="stats-grid">
        <StatCard
          title="Total de Artefatos"
          value="12,450"
          color="#3498db"
        />
        <StatCard
          title="Coleções"
          value="24"
          color="#2ecc71"
        />
        <StatCard
          title="Sítios Arqueológicos"
          value="18"
          color="#e74c3c"
        />
        <StatCard
          title="Materiais Catalogados"
          value="8"
          color="#f39c12"
        />
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
                @click="navigateTo('new-artifact')"
              />
              <ActionButton
                label="Upload de Imagens"
                description="Adicionar imagens a artefatos"
                @click="navigateTo('upload-images')"
              />
              <ActionButton
                label="Buscar Artefato"
                description="Localizar item no acervo"
                @click="navigateTo('search')"
              />
              <ActionButton
                label="Gestão de Coleções"
                description="Gerenciar coleções e colecionadores"
                @click="navigateTo('collections')"
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
                @click="navigateTo('raw-materials')"
              />
              <VocabCard
                title="Sub-Tipos"
                items="Gerenciar categorias de materiais"
                @click="navigateTo('subtypes')"
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

          <!-- System Status -->
          <section class="card">
            <h2>Status do Sistema</h2>
            <div class="status-list">
              <StatusItem
                label="Banco de Dados"
                status="online"
              />
              <StatusItem
                label="Armazenamento de Imagens"
                status="online"
              />
              <StatusItem
                label="Sincronização"
                status="processing"
              />
              <StatusItem
                label="Backup"
                status="online"
              />
            </div>
          </section>

          <!-- Quick Stats -->
          <section class="card">
            <h2>Resumo de Atividades</h2>
            <div class="activity-stats">
              <div class="stat-row">
                <span>Cadastros hoje:</span>
                <strong>12</strong>
              </div>
              <div class="stat-row">
                <span>Imagens processadas:</span>
                <strong>45</strong>
              </div>
              <div class="stat-row">
                <span>Pendências:</span>
                <strong>8</strong>
              </div>
            </div>
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

      <!-- Audit & Access Control -->
      <section class="card full-width">
        <h2>Auditoria e Controle de Acesso</h2>
        <div class="audit-controls">
          <div class="audit-item">
            <h3>Histórico de Alterações</h3>
            <p>Visualizar quem criou, alterou ou excluiu registros</p>
            <button class="btn-secondary">Ver Histórico</button>
          </div>
          <div class="audit-item">
            <h3>Perfis de Acesso</h3>
            <p>Gerenciar permissões: Cadastro (editar) e Consulta (leitura)</p>
            <button class="btn-secondary">Gerenciar Perfis</button>
          </div>
          <div class="audit-item">
            <h3>Relatórios</h3>
            <p>Gerar relatórios de acervo e movimentações</p>
            <button class="btn-secondary">Gerar Relatório</button>
          </div>
        </div>
      </section>
    </div>
  </ManagerLayout>
</template>

<script>
import ManagerLayout from '@/layouts/ManagerLayout.vue'
import StatCard from '@/components/StatCard.vue'
import ActionButton from '@/components/ActionButton.vue'
import VocabCard from '@/components/VocabCard.vue'
import RecentItemCard from '@/components/RecentItemCard.vue'
import StatusItem from '@/components/StatusItem.vue'
import LocationControl from '@/components/LocationControl.vue'

export default {
  name: 'Management',
  components: {
    ManagerLayout,
    StatCard,
    ActionButton,
    VocabCard,
    RecentItemCard,
    StatusItem,
    LocationControl
  },
  data() {
    return {
      recentItems: [
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
      ]
    }
  },
  methods: {
    navigateTo(route) {
      console.log('Navegar para:', route)
    }
  }
}
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
  background: white;
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
  color: #2c3e50;
  margin: 0 0 1rem 0;
  border-bottom: 2px solid #3498db;
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
  color: #3498db;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s;
}

.view-all:hover {
  color: #2980b9;
}

/* Status List */
.status-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Activity Stats */
.activity-stats {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.stat-row span {
  color: #7f8c8d;
}

.stat-row strong {
  color: #2c3e50;
  font-size: 1.1rem;
}

/* Location Controls */
.location-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

/* Audit Controls */
.audit-controls {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.audit-item {
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 6px;
  border-left: 4px solid #3498db;
}

.audit-item h3 {
  margin: 0 0 0.5rem 0;
  color: #2c3e50;
}

.audit-item p {
  margin: 0 0 1rem 0;
  color: #7f8c8d;
  font-size: 0.95rem;
}

.btn-secondary {
  background-color: #ecf0f1;
  color: #2c3e50;
  border: 1px solid #bdc3c7;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s;
}

.btn-secondary:hover {
  background-color: #d5dbdb;
  border-color: #95a5a6;
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
