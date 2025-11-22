import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ArtefactsService from '@/services/artefactsServices'

export const useArtefactsStore = defineStore('artefacts', () => {
  // STATE
  const artefacts = ref([])
  const loading = ref(false)
  const error = ref(null)
  const currentArtefact = ref(null)

  // COMPUTED
  const artefactsCount = computed(() => artefacts.value.length)
  const isLoading = computed(() => loading.value)
  const hasError = computed(() => error.value !== null)

  // METHODS - FETCH ALL
  async function fetchAll(options = {}) {
    loading.value = true
    error.value = null
    try {
      let data
      if (options && options.filters) {
        data = await ArtefactsService.getFilteredArtefacts(options.filters)
      } else {
        data = await ArtefactsService.getAllArtefacts(options)
      }

      artefacts.value = Array.isArray(data.results) ? data.results : []
      return artefacts.value
    } catch (err) {
      error.value = err.message || 'Erro ao carregar artefatos'
      console.error('Erro em fetchAll:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // METHODS - FETCH BY ID
  async function fetchById(id) {
    loading.value = true
    error.value = null
    try {
      const data = await ArtefactsService.getArtefact(id)
      currentArtefact.value = data
      return data
    } catch (err) {
      error.value = err.message || 'Erro ao carregar artefato'
      console.error('Erro em fetchById:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // METHODS - FETCH IMAGES
  async function fetchArtefactImages(id) {
    try {
      const images = await ArtefactsService.getArtefactImages(id)
      // Atualizar o artefato local com as imagens
      const index = artefacts.value.findIndex(a => a.id === id)
      if (index !== -1) {
        artefacts.value[index].images = images
      }
      return images
    } catch (err) {
      error.value = err.message || 'Erro ao carregar imagens'
      console.error('Erro em fetchArtefactImages:', err)
      throw err
    }
  }

  // METHODS - CREATE
  async function create(payload) {
    loading.value = true
    error.value = null
    try {
      const data = await ArtefactsService.createArtefact(payload)
      artefacts.value.push(data)
      return data
    } catch (err) {
      error.value = err.message || 'Erro ao criar artefato'
      console.error('Erro em create:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // METHODS - UPDATE
  async function update(id, payload) {
    loading.value = true
    error.value = null
    try {
      const data = await ArtefactsService.updateArtefact(id, payload)
      // Atualizar na lista local
      const index = artefacts.value.findIndex(a => a.id === id)
      if (index !== -1) {
        artefacts.value[index] = { ...artefacts.value[index], ...data }
      }
      return data
    } catch (err) {
      error.value = err.message || 'Erro ao atualizar artefato'
      console.error('Erro em update:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // METHODS - DELETE
  async function remove(id) {
    loading.value = true
    error.value = null
    try {
      await ArtefactsService.deleteArtefact(id)
      artefacts.value = artefacts.value.filter(a => a.id !== id)
      return true
    } catch (err) {
      error.value = err.message || 'Erro ao deletar artefato'
      console.error('Erro em remove:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // METHODS - UPLOAD IMAGES
  async function uploadImages(id, files) {
    loading.value = true
    error.value = null
    try {
      const formData = new FormData()
      files.forEach(file => {
        formData.append('images', file)
      })

      const images = await ArtefactsService.uploadArtefactImages(id, formData)
      // Atualizar o artefato local
      const index = artefacts.value.findIndex(a => a.id === id)
      if (index !== -1) {
        artefacts.value[index].images = images
      }
      return images
    } catch (err) {
      error.value = err.message || 'Erro ao fazer upload de imagens'
      console.error('Erro em uploadImages:', err)
      throw err
    } finally {
      loading.value = false
    }
  }

  // METHODS - CLEAR ERROR
  function clearError() {
    error.value = null
  }

  // METHODS - CLEAR CURRENT
  function clearCurrent() {
    currentArtefact.value = null
  }

  return {
    // STATE
    artefacts,
    loading,
    error,
    currentArtefact,
    // COMPUTED
    artefactsCount,
    isLoading,
    hasError,
    // METHODS
    fetchAll,
    fetchById,
    fetchArtefactImages,
    create,
    update,
    remove,
    uploadImages,
    clearError,
    clearCurrent,
  }
})