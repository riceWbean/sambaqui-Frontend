import api from '@/plugins/api'

class ArtefactssService {
    async getAllArtefacts() {
        try {
            const { data } = await api.get('/artefacts');
            return data;
        } catch (error) {
            throw new Error('Falha ao buscar artefatos: ' + error.message);
        }
    }

    async getFilteredArtefacts(filterParams) {
        url = `artefacts?`;
        for (const [key, value] of Object.entries(filterParams)) {
            if (url == 'artefacts?') {
                url += `${key}=${value}`;
                continue;
            }
            url += `&${key}=${value}`;
        }
        try {
            const { data } = await api.get(url);
            return data;
        } catch (error) {
            throw new Error('Falha ao buscar artefatos filtrados: ' + error.message);
        }
    }

    async getArtefact(id) {
        try {
            const { data } = await api.get(`/artefacts/${id}`);
            return data;
        } catch (error) {
            throw new Error('Falha ao buscar artefato: ' + error.message);
        }
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

export default new ArtefactssService();