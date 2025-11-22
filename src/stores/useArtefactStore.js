import { defineStore } from 'pinia'
import { ref } from 'vue'
import ArtefactsService from '@/services/artefactsServices'

export const useArtefactsStore = defineStore('artefacts', () => {

    const loading = ref(false)
    const error = ref(null)

    async function fetchAll(options = {}) {
        loading.value = true
        error.value = null
        try {
            if (options && options.filters) {
                const data = await ArtefactsService.getFilteredArtefacts(options.filters)
                return data.results
            }
            const data = await ArtefactsService.getAllArtefacts(options)
            return data.results
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    async function fetchById(id) {
        loading.value = true
        error.value = null
        try {
            const data = await ArtefactsService.getArtefact(id)
            return data
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    async function update(id, payload) {
        loading.value = true
        error.value = null
        try {
            await ArtefactsService.updateArtefact(id, payload)
            return true
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    async function remove (id) {
        loading.value = true
        error.value = null
        try {
            await ArtefactsService.deleteArtefact(id)
            return true
        } catch (err) {
            error.value = err
            throw err
        } finally {
            loading.value = false
        }
    }

    return {
        loading,
        fetchAll,
        fetchById,
        update,
        remove,
    }
})