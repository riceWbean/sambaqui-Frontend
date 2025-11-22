import { defineStore } from 'pinia'
import subTypeService from '@/services/subTypeServices'

export const useSubTypeStore = defineStore('subType', () => {
	// Nota: esta store não mantém uma lista interna — fetchAll retorna os dados
	async function fetchAll(params = {}) {
		const data = await subTypeService.getSubTypes(params)
		return Array.isArray(data) ? data : (data.results ?? data.data ?? [])
	}

	async function create(payload) {
		const created = await subTypeService.create(payload)
		return created
	}

	async function update(id, payload) {
		const updated = await subTypeService.update(id, payload)
		return updated
	}

	async function remove(id) {
		const res = await subTypeService.remove(id)
		return res
	}

	return { fetchAll, create, update, remove }
})
