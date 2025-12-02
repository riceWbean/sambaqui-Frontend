import api from '@/plugins/api'

class ArtefactsService {
    async getCategories() {
        const response = await api.get('/artefacts/list_categories/');
        return response.data;
    }
    async getAllArtefacts(num_artefacts, page) {
        const { data } = await api.get(`/artefacts?num_artefacts=${num_artefacts}&page=${page}`, { headers: { skipAuth: true } });
        console.log(data);
        console.log(import.meta.env.VITE_DJANGO_URL)
        return data;
    }

async getFilteredArtefacts(params) {

    // transforma arrays assim:
    // { conservation_status: [1,2,3] }
    // em:
    // conservation_status=1&conservation_status=2&conservation_status=3

    const searchParams = new URLSearchParams()

    for (const [key, value] of Object.entries(params)) {
        if (Array.isArray(value)) {
            value.forEach(v => searchParams.append(key, v))
        } else {
            searchParams.append(key, value)
        }
    }

    const { data } = await api.get(`/artefacts?${searchParams.toString()}`)
    return data
}

    async getArtefact(id) {
        try {
            const { data } = await api.get(`/artefacts/${id}`);
            return data;
        } catch (error) {
            throw new Error('Falha ao buscar artefato: ' + error.message);
        }
    }

    async createArtefact(formData) {
        const response = await api.post('/artefacts/', formData);
        return response.data;
    }

    async deleteArtefact(id) {
        try {
            await api.delete(`/artefacts/${id}/`);
            console.log('artefato deletado com sucesso');
        } catch (error) {
            throw new Error('Falha ao deletar artefato: ' + error.message);
        }
    }
    async getFilteredArtefacts(params) {
        const query = new URLSearchParams(params).toString()
        const { data } = await api.get(`/artefacts?${query}`)
        return data
    }
    async updateArtefact(form) {
        console.log(form.id);
        const response = await api.patch(`/artefacts/${form.id}/`);
        return response.data
    }

}

export default new ArtefactsService();