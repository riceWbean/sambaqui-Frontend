import api from "@/plugins/api";

class DashboardService {
    async getDashboard() {
        const response = await api.get('/artefacts/list_dashboard/');
        return response.data;
    }
}

export default new DashboardService();