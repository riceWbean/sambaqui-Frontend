import { defineStore } from "pinia"
import { ref } from "vue"
import AuditService from "@/services/auditServices"

export const useAuditStore = defineStore("audit", () => {
  const logs = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchAll(options = {}) {
    loading.value = true
    error.value = null
    try {
      const data = await AuditService.getAllLogs(options)
      logs.value = Array.isArray(data.results) ? data.results : []
      return logs.value
    } catch (err) {
      error.value = err.message || "Erro ao carregar logs"
      console.error("Erro em fetchAll:", err)
      throw err
    } finally {
      loading.value = false
    }
  }

  async function fetchByFilters(filters) {
    loading.value = true
    error.value = null
    try {
      const data = await AuditService.getFilteredLogs(filters)
      return Array.isArray(data.results) ? data.results : []
    } catch (err) {
      error.value = err.message || "Erro ao filtrar logs"
      console.error("Erro em fetchByFilters:", err)
      throw err
    } finally {
      loading.value = false
    }
  }

  return {
    logs,
    loading,
    error,
    fetchAll,
    fetchByFilters,
  }
})
