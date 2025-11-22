// stores/filtros.js
import { defineStore } from 'pinia'
import { ref, computed, watch } from 'vue'
import ArtefactsService from '@/services/artefactsServices'
import { useArtefatosStore } from './artefatosStore'

export const useFiltroStore = defineStore('filtro', () => {
  const artefatosStore = useArtefatosStore()

  // 🔹 valores dos filtros
  const dataMin = ref("")
  const dataMax = ref("")
  const conservation_status = ref([])
  const collection_category = ref([])
  const raw_material = ref([])
  const localization = ref([])
  const sub_type = ref([])
  const archaeological_site = ref([])

  // -----------------------------
  // 🔥 Monta objeto para API
  // -----------------------------
  const filterParams = computed(() => {
    const obj = {}

    if (dataMin.value) obj.register_date__gte = dataMin.value
    if (dataMax.value) obj.register_date__lte = dataMax.value

    if (conservation_status.value.length) obj.conservation_status = conservation_status.value.join(',')
    if (collection_category.value.length) obj.collection_category = collection_category.value.join(',')
    if (raw_material.value.length) obj.raw_material = raw_material.value.join(',')
    if (localization.value.length) obj.localization = localization.value.join(',')
    if (sub_type.value.length) obj.sub_type = sub_type.value.join(',')
    if (archaeological_site.value.length) obj.archaeological_site = archaeological_site.value.join(',')

    return obj
  })

  // -----------------------------
  // 🔥 Sempre que os filtros mudarem → chama backend
  // -----------------------------
  watch(filterParams, async () => {
    const data = await ArtefactsService.getFilteredArtefacts(filterParams.value)
    artefatosStore.artefatos = data.results
  })

  return {
    // valores
    dataMin,
    dataMax,
    conservation_status,
    collection_category,
    raw_material,
    localization,
    sub_type,
    archaeological_site,

    // params prontos
    filterParams,
  }
})
