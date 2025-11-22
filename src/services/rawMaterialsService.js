import api from "@/plugins/api";

class RawMaterialsService {
    async getrawMaterials() {
        const response = await api.get('/raw-materials/');
        return response.data;
    }

    async create(payload) {
        const response = await api.post('/raw-materials/', payload);
        return response.data;
    }

    async update(id, payload) {
        const response = await api.patch(`/raw-materials/${id}/`, payload);
        return response.data;
    }

    async remove(id) {
        const response = await api.delete(`/raw-materials/${id}/`);
        return response.data;
    }
}

export default new RawMaterialsService();