import { defineStore } from 'pinia'
import axios from 'axios'

export const useRawMaterialStore = defineStore('rawMaterial', {
  state: () => ({
    list: []
  }),

  actions: {
    async fetchAll() {
      const res = await axios.get('/api/raw-materials/')
      this.list = res.data
    },

    async create(payload) {
      const res = await axios.post('/api/raw-materials/', payload)
      await this.fetchAll()
      return res.data
    },

    async update(id, payload) {
      await axios.put(`/api/raw-materials/${id}/`, payload)
      await this.fetchAll()
    },

    async remove(id) {
      await axios.delete(`/api/raw-materials/${id}/`)
      await this.fetchAll()
    }
  }
})