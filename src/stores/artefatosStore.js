import { defineStore } from 'pinia'
import { ref, reactive, computed, toRaw } from 'vue'
import { useDashboardStore, useToastStore } from '@/stores';
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
  const toastStore = useToastStore();

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

  async function createArtefact(form) {
    const fd = new FormData()

    const raw = toRaw(form)

    console.log(raw);

    const files = raw.files || []

    for (const [key, value] of Object.entries(raw)) {
        if (key === 'files') continue
        fd.append(key, value ?? '')
    }

    for (const file of files) {
        fd.append('files', file)
    }

    try {
        for (const [key, value] of fd) {
            console.log(key, value);
        }
        const response = await ArtefactsService.createArtefact(fd);
        await getAllArtefacts();
        toastStore.notify("Artefato adicionado com sucesso!", "success");
    }
    catch(error) {
        console.error('Error in POST Artefact: ', error);
    }
  }

  return { artefatos, filteredArtefacts, categories, filters, dashboardStore, getCategories, getAllArtefacts, getFilteredArtefacts, createArtefact }
})
