import { defineStore } from 'pinia'
import { ref, reactive, computed } from 'vue'
import { useDashboardStore } from './dashboardStore';
import { ArtefactsService } from '@/services';

export const useArtefatosStore = defineStore('artefatos', () => {
  const artefatos = ref([]);
  const filteredArtefacts = ref([]);
  const categories = ref({});
  const filters = reactive({
    collection: '',
    raw_material: '',
    sub_type: '',
    conservation_status: '',
    location: '',
    dating_from: '',
    dating_to: '',
    search: '',
    num_artefacts: 10,
    page: 1
  });
  const dashboardStore = useDashboardStore();

  async function getCategories() {
    try {
        const response = await ArtefactsService.getCategories();
        categories.value = response;
    }
    catch(error) {
        console.error('Error in GET categories: ', error);
    }
  }

  async function getAllArtefacts() {
    try {
        const response = await ArtefactsService.getAllArtefacts(filters.num_artefacts, filters.page);
        artefatos.value = response;
    }
    catch(error) {
        console.error('Error in GET All Artefacts: ', error);
    }
  }

  async function getFilteredArtefacts() {
    try {
        const response = await ArtefactsService.getFilteredArtefacts(filters);
        filteredArtefacts.value = response;
    }
    catch(error) {
        console.error('Error in GET filtered artefacts: ', error);
    }
  }

  return { artefatos, filteredArtefacts, categories, filters, dashboardStore, getCategories, getAllArtefacts, getFilteredArtefacts }
})
