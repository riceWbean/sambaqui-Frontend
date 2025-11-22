import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useFiltroStore } from './filtros'
import { useRoute } from 'vue-router'

export const useCategoriaFiltroStore = defineStore('categoriaFiltro', () => {
  const FiltrosStore = useFiltroStore()
  const route = useRoute()

  // 🔹 MODELS → sempre numeros (IDs ou ENUMs)
  const dataMin = ref("")
  const dataMax = ref("")

  const conservacao = ref([])            // ENUM → numeric
  const collectionCategory = ref([])     // ENUM → numeric
  const rawMaterial = ref([])            // raw_material id
  const localizacao = ref([])            // localization id
  const subType = ref([])                // sub_type id
  const archaeological = ref([])         // archaeological_site id

  // 🔹 WATCHERS → manda para o filtroStore
  watch(conservacao, v => FiltrosStore.conservation_status = v)
  watch(collectionCategory, v => FiltrosStore.collection_category = v)
  watch(rawMaterial, v => FiltrosStore.raw_material = v)
  watch(localizacao, v => FiltrosStore.localization = v)
  watch(subType, v => FiltrosStore.sub_type = v)
  watch(archaeological, v => FiltrosStore.archaeological_site = v)

  // 🔹 Controle de abrir/fechar
  const dataAberto = ref(true)
  const conservacaoAberto = ref(true)
  const colecaoAberto = ref(true)
  const materialAberto = ref(true)
  const localAberto = ref(true)
  const subtypeAberto = ref(true)
  const siteAberto = ref(true)

  // 🔹 Reset ao mudar rota
  const resetFilters = () => {
    dataMin.value = ""
    dataMax.value = ""
    FiltrosStore.dataMin = ""
    FiltrosStore.dataMax = ""

    conservacao.value = []
    collectionCategory.value = []
    rawMaterial.value = []
    localizacao.value = []
    subType.value = []
    archaeological.value = []
  }
  watch(route, resetFilters)

  // 🔹 Filtro por data (register_date)
  const filtroData = ref({
    titulo: "Data",
    aberto: dataAberto,
    precoMin: dataMin,
    precoMax: dataMax,

    funcaoFechar: () => {
      dataMin.value = ""
      dataMax.value = ""
      FiltrosStore.dataMin = ""
      FiltrosStore.dataMax = ""
    },

    funcaoClicked: () => {
      FiltrosStore.dataMin = dataMin.value
      FiltrosStore.dataMax = dataMax.value
    },
  })

  // 🔹 LISTA DE FILTROS (pronta para o componente ItensSelect)
  const bigArray = ref([
    {
      titulo: "Estado de Conservação",
      funcao: () => { conservacao.value = []; conservacaoAberto.value = false },
      aberto: conservacaoAberto,
      model: conservacao,
      array: [
        { nome: "Excelente",    value: 1 },
        { nome: "Regular",      value: 2 },
        { nome: "Ruim",         value: 3 },
        { nome: "Crítico",      value: 4 },
        { nome: "Irrecuperável",value: 5 },
      ]
    },
    {
      titulo: "Categoria da Coleção",
      funcao: () => { collectionCategory.value = []; colecaoAberto.value = false },
      aberto: colecaoAberto,
      model: collectionCategory,
      array: [
        { nome: "Antropologia", value: 1 },
        { nome: "Arqueologia",  value: 2 },
        { nome: "História",     value: 3 },
        { nome: "Outros",       value: 4 },
      ]
    },
    {
      titulo: "Material",
      funcao: () => { rawMaterial.value = []; materialAberto.value = false },
      aberto: materialAberto,
      model: rawMaterial,
      array: [
        { nome: "Osso", value: 1 },
        { nome: "Cerâmica", value: 2 },
        { nome: "Metal", value: 3 },
        { nome: "Pedra", value: 4 },
      ]
    },
    {
      titulo: "Subtipo",
      funcao: () => { subType.value = []; subtypeAberto.value = false },
      aberto: subtypeAberto,
      model: subType,
      array: [
        { nome: "Crânio", value: 1 },
        { nome: "Ferramenta", value: 2 },
        { nome: "Fóssil", value: 3 },
      ]
    },
    {
      titulo: "Localização Física",
      funcao: () => { localizacao.value = []; localAberto.value = false },
      aberto: localAberto,
      model: localizacao,
      array: [
        { nome: "Sala 01", value: 1 },
        { nome: "Sala 02", value: 2 },
        { nome: "Depósito", value: 3 },
      ]
    },
    {
      titulo: "Sítio Arqueológico",
      funcao: () => { archaeological.value = []; siteAberto.value = false },
      aberto: siteAberto,
      model: archaeological,
      array: [
        { nome: "Juréia", value: 1 },
        { nome: "Capivara", value: 2 },
        { nome: "Itacoara", value: 3 },
      ]
    },
  ])

  return {
    bigArray,
    filtroData,
  }
})