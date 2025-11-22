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

  const count = computed(() => artefatos.value.length)

  // 👉 método que você chama no componente
  async function fetchAll(num_artefacts = 20, page = 1) {
    loading.value = true
    error.value = null

    try {
      const data = await ArtefactsService.getAllArtefacts(num_artefacts, page)

      // seu backend provavelmente retorna:
      // { results: [ ... ], count: xx }
      artefatos.value = Array.isArray(data.results) ? data.results : data
    } catch (err) {
      console.error("Erro no store:", err)
      error.value = 'Falha ao buscar artefatos'
      throw err
    } finally {
      loading.value = false
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
