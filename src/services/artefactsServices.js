import api from '@/plugins/api'

class ArtefactsService {
    async getCategories() {
        const response = await api.get('/artefacts/list_categories/');
        return response.data;
    }
    async getAllArtefacts(num_artefacts, page) {
        try {
            const { data } = await api.get(`/artefacts?num_artefacts=${num_artefacts}&page=${page}`);
            return data;
        } catch (error) {
            throw new Error('Falha ao buscar artefatos: ' + error.message);
        }
    }

    async getFilteredArtefacts(filterParams) {
        let url = `artefacts?`;
        for (const [key, value] of Object.entries(filterParams)) {
            if (value != '') {
                if (url == 'artefacts?') {
                    url += `${key}=${value}`;
                    continue;
                }
                url += `&${key}=${value}`;
            }
        }
        const { data } = await api.get(url);
        return data;
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