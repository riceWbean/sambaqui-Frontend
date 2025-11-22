<template>
  <div v-if="modelValue" class="rm-modal-overlay" @click.self="close">
    <div class="rm-modal">
      <header class="rm-modal-header">
        <h3>{{ editing ? 'Editar Matéria-Prima' : 'Nova Matéria-Prima' }}</h3>
      </header>

      <div class="rm-modal-body">
        <label class="rm-label">Nome</label>
        <input v-model="form.name" type="text" placeholder="Ex: Cerâmica" class="rm-input" />

        <div v-if="error" class="rm-error">{{ error }}</div>
      </div>

      <footer class="rm-modal-footer">
        <button class="btn-secondary" @click="close">Cancelar</button>
        <button class="btn-primary" @click="save" :disabled="saving">
          {{ saving ? 'Salvando...' : (editing ? 'Atualizar' : 'Criar') }}
        </button>
      </footer>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRawMaterialStore } from '@/stores/useRawMaterialStore'

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  editing: { type: Object, default: null }
})

const emit = defineEmits(['update:modelValue','saved'])

const store = useRawMaterialStore()

// Formulário só tem "name" porque description NÃO existe na modelagem
const form = ref({ name: '' })

const saving = ref(false)
const error = ref('')

// Preenche o formulário ao abrir o modal
watch(() => props.editing, v => {
  form.value = v
    ? { name: v.name ?? '' }
    : { name: '' }
}, { immediate: true })

function close() {
  emit('update:modelValue', false)
  error.value = ''
}

async function save() {
  if (!form.value.name || !form.value.name.trim()) {
    error.value = 'Nome é obrigatório'
    return
  }

  saving.value = true
  error.value = ''

  try {
    const payload = { name: form.value.name.trim() }

    if (props.editing && props.editing.idRawMaterial) {
      // UPDATE
      await store.update(props.editing.idRawMaterial, payload)
    } else {
      // CREATE
      await store.create(payload)
    }

    emit('saved')
    close()
  } catch (err) {
    console.error(err)
    error.value = 'Erro ao salvar. Tente novamente.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.rm-modal-overlay{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display:flex;
  align-items:center;
  justify-content:center;
  z-index: 1200;
}

.rm-modal{
  width: 540px;
  background: #1f1f1f;
  border-radius: 8px;
  padding: 18px;
  box-shadow: 0 6px 30px rgba(0,0,0,0.6);
  color: #fff;
}

.rm-modal-header h3{
  margin:0 0 8px 0;
  font-size: 18px;
}

.rm-modal-body{
  display:flex;
  flex-direction:column;
  gap:10px;
  margin-bottom: 12px;
}

.rm-label{
  font-size: 13px;
  color: #cfcfcf;
}

.rm-input, .rm-textarea{
  background:#121212;
  border:1px solid #333;
  color:#fff;
  padding:10px;
  border-radius:6px;
  font-size:14px;
  outline:none;
}

.rm-input:focus, .rm-textarea:focus {
  border-color: #6b6b6b;
  box-shadow: 0 0 0 3px rgba(115,115,115,0.06);
}

.rm-error {
  color: #ff7979;
  font-size: 13px;
}

.rm-modal-footer{
  display:flex;
  justify-content:flex-end;
  gap:10px;
}

.btn-primary {
  background-color: #1e1e1e;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  border: 1px solid transparent;
}

.btn-secondary {
  background-color: #737373;
  color: white;
  border: none;
  padding: 0.55rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
}
</style>