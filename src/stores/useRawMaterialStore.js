import { defineStore } from 'pinia'
import { ref } from 'vue'
import rawMaterialsService from '@/services/rawMaterialsService'
import api from '@/plugins/api'

export const useRawMaterialStore = defineStore('rawMaterial', () => {
  const list = ref([])

  async function fetchAll() {
    try {
      const data = await rawMaterialsService.getrawMaterials()
      list.value = Array.isArray(data) ? data : (data.results ?? data.data ?? [])
      return list.value
    } catch (err) {
      // fallback direto ao endpoint, caso o service dê erro
      const resp = await api.get('/raw-materials/')
      list.value = resp.data ?? []
      return list.value
    }
  }

  async function create(payload) {
    const resp = await api.post('/raw-materials/', payload)
    const created = resp.data
    await fetchAll()
    return created
  }

  async function update(id, payload) {
    const resp = await api.patch(`/raw-materials/${id}/`, payload)
    const updated = resp.data
    await fetchAll()
    return updated
  }

  async function remove(id) {
    const resp = await api.delete(`/raw-materials/${id}/`)
    await fetchAll()
    return resp.data
  }

  return {
    list,
    fetchAll,
    create,
    update,
    remove,
  }
})