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

    async updateArtefact(id, ArtefactsData) {
        try {
            await api.put(`/artefacts/${id}`, ArtefactsData);
            console.log('artefato atualizado com sucesso');
        } catch (error) {
            throw new Error('Falha ao atualizar artefato: ' + error.message);
        }
    }

    async deleteArtefact(id) {
        try {
            await api.delete(`/artefacts/${id}/`);
            console.log('artefato deletado com sucesso');
        } catch (error) {
            throw new Error('Falha ao deletar artefato: ' + error.message);
        }
    }
}

export default new ArtefactsService();