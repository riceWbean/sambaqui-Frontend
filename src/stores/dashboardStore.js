import { defineStore } from "pinia";
import { ref } from "vue";
import { DashboardService } from "@/services";

export const useDashboardStore = defineStore('dashboard', () => {
    const dashboard = ref({});

    async function getDashboard() {
        try {
            const response = await DashboardService.getDashboard();
            dashboard.value = response;
        }
        catch(error) {
            console.error('Error in GET dashboard: ', error);
        }
    }

    return {
        dashboard,
        getDashboard
    };
})