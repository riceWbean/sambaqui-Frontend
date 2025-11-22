<template>
  <div class="artifact-card">
    <!-- Image Placeholder -->
    <div class="card-image">
      <div class="image-placeholder">🖼️</div>
      <div class="card-badges">
        <span class="badge-material" :class="artifact.rawMaterial.toLowerCase()">
          {{ artifact.rawMaterial }}
        </span>
        <span class="badge-status" :class="artifact.conservationStatus.toLowerCase()">
          {{ artifact.conservationStatus }}
        </span>
      </div>
    </div>

    <!-- Card Content -->
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ artifact.name }}</h3>
        <span class="accession-badge">{{ artifact.accessionNumber }}</span>
      </div>

      <div class="card-meta">
        <div class="meta-row">
          <span class="meta-label">Coleção:</span>
          <span class="meta-value">{{ artifact.collection }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Sub-Tipo:</span>
          <span class="meta-value">{{ artifact.subType }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Localização:</span>
          <span class="meta-value">{{ artifact.location }}</span>
        </div>
        <div class="meta-row">
          <span class="meta-label">Datação:</span>
          <span class="meta-value">{{ artifact.dating }}</span>
        </div>
      </div>

      <p class="card-description">{{ artifact.description }}</p>

      <div class="card-actions">
        <button class="action-btn view" title="Visualizar" @click="$emit('view', artifact)">
          👁️ Ver
        </button>
        <button class="action-btn edit" title="Editar" @click="$emit('edit', artifact)">
          ✏️ Editar
        </button>
        <button class="action-btn delete" title="Deletar" @click="$emit('delete', artifact)">
          🗑️ Deletar
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ArtifactCard',
  props: {
    artifact: {
      type: Object,
      required: true
    }
  },
  emits: ['view', 'edit', 'delete']
}
</script>

<style scoped>
.artifact-card {
  background: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
  display: flex;
  flex-direction: column;
  height: 100%;
}

.artifact-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
}

/* Card Image */
.card-image {
  position: relative;
  width: 100%;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.image-placeholder {
  font-size: 4rem;
  opacity: 0.8;
}

.card-badges {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.badge-material,
.badge-status {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.badge-material.animal {
  color: #27ae60;
}

.badge-material.vegetal {
  color: #f39c12;
}

.badge-material.mineral {
  color: #2980b9;
}

.badge-material.cerâmica {
  color: #c0392b;
}

.badge-status.excelente {
  color: #27ae60;
}

.badge-status.bom {
  color: #2980b9;
}

.badge-status.regular {
  color: #f39c12;
}

.badge-status.ruim {
  color: #c0392b;
}

/* Card Content */
.card-content {
  padding: 1rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.card-title {
  margin: 0;
  font-size: 1.1rem;
  color: #2c3e50;
  font-weight: 700;
  line-height: 1.3;
}

.accession-badge {
  background-color: #ecf0f1;
  color: #2c3e50;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Card Meta */
.card-meta {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
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
  min-width: 80px;
}

.meta-value {
  color: #2c3e50;
  text-align: right;
}

/* Card Description */
.card-description {
  margin: 0 0 1rem 0;
  font-size: 0.9rem;
  color: #7f8c8d;
  line-height: 1.4;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

/* Card Actions */
.card-actions {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 0.5rem;
  margin-top: auto;
}

.action-btn {
  padding: 0.5rem;
  border: 1px solid #ecf0f1;
  border-radius: 4px;
  background: white;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 600;
  transition: all 0.3s;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

/* Responsive */
@media (max-width: 480px) {
  .card-image {
    height: 150px;
  }

  .image-placeholder {
    font-size: 3rem;
  }

  .card-content {
    padding: 0.75rem;
  }

  .card-actions {
    grid-template-columns: 1fr;
  }

  .card-meta {
    gap: 0.25rem;
  }

  .meta-row {
    flex-direction: column;
  }

  .meta-value {
    text-align: left;
  }
}
</style>
