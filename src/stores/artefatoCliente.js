import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import ArtefactsService from '@/services/artefactsServices'

export const useArtefatosStore = defineStore('artefatos_cliente', () => {
  const artefatos = ref([])
  const loading = ref(false)
  const error = ref(null)

  const count = computed(() => artefatos.value.length)

  // 👉 método que você chama no componente
  async function fetchAll(num_artefacts = 20, page = 1) {
    loading.value = true
    error.value = null

    try {
      const data = await ArtefactsService.getAllArtefacts(num_artefacts, page)

      // seu backend provavelmente retorna:
      // { results: [ ... ], count: xx }
      artefatos.value = Array.isArray(data.results) ? data.results : data
    } catch (err) {
      console.error("Erro no store:", err)
      error.value = 'Falha ao buscar artefatos'
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    artefatos,
    loading,
    error,
    count,
    fetchAll         // ← IMPORTANTE: GARANTIR QUE ESTÁ RETORNANDO
  }
})
