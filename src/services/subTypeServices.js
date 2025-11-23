import api from '@/plugins/api'

class SubTypeServices {
	async getSubTypes(params = {}) {
		const response = await api.get('/sub-types/', { params })
		return response.data
	}

	async getSubType(id) {
		const response = await api.get(`/sub-types/${id}/`)
		return response.data
	}

	async create(payload) {
		const response = await api.post('/sub-types/', payload)
		return response.data
	}

	async update(id, payload) {
		const response = await api.patch(`/sub-types/${id}/`, payload)
		return response.data
	}

	async remove(id) {
		const response = await api.delete(`/sub-types/${id}/`)
		return response.data
	}
}

export default new SubTypeServices()
