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

  // 🔹 Controle de abrir/fechar
  const dataAberto = ref(true)
  const conservacaoAberto = ref(true)
  const colecaoAberto = ref(true)
  const materialAberto = ref(true)
  const localAberto = ref(true)
  const subtypeAberto = ref(true)
  const siteAberto = ref(true)

  // 🔹 Função para limpar todos os filtros exceto o ativo
  const clearOtherFilters = (activeFilter) => {
    if (activeFilter !== 'conservacao') {
      conservacao.value = []
      conservacaoAberto.value = true  // fecha visualmente (true = fechado, mostra +)
    }
    if (activeFilter !== 'collectionCategory') {
      collectionCategory.value = []
      colecaoAberto.value = true
    }
    if (activeFilter !== 'rawMaterial') {
      rawMaterial.value = []
      materialAberto.value = true
    }
    if (activeFilter !== 'localizacao') {
      localizacao.value = []
      localAberto.value = true
    }
    if (activeFilter !== 'subType') {
      subType.value = []
      subtypeAberto.value = true
    }
    if (activeFilter !== 'archaeological') {
      archaeological.value = []
      siteAberto.value = true
    }
  }

  // 🔹 WATCHERS → manda para o filtroStore usando $patch (só permite um filtro ativo por vez)
  watch(conservacao, v => {
    if (v.length > 0) clearOtherFilters('conservacao')
    FiltrosStore.$patch({ conservation_status: [...v] })
  }, { deep: true })
  
  watch(collectionCategory, v => {
    if (v.length > 0) clearOtherFilters('collectionCategory')
    FiltrosStore.$patch({ collection_category: [...v] })
  }, { deep: true })
  
  watch(rawMaterial, v => {
    if (v.length > 0) clearOtherFilters('rawMaterial')
    FiltrosStore.$patch({ raw_material: [...v] })
  }, { deep: true })
  
  watch(localizacao, v => {
    if (v.length > 0) clearOtherFilters('localizacao')
    FiltrosStore.$patch({ localization: [...v] })
  }, { deep: true })
  
  watch(subType, v => {
    if (v.length > 0) clearOtherFilters('subType')
    FiltrosStore.$patch({ sub_type: [...v] })
  }, { deep: true })
  
  watch(archaeological, v => {
    if (v.length > 0) clearOtherFilters('archaeological')
    FiltrosStore.$patch({ archaeological_site: [...v] })
  }, { deep: true })

  // 🔹 Reset ao mudar rota
  const resetFilters = () => {
    dataMin.value = ""
    dataMax.value = ""
    FiltrosStore.$patch({ dataMin: "", dataMax: "" })

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
      FiltrosStore.$patch({ dataMin: "", dataMax: "" })
    },

    funcaoClicked: () => {
      FiltrosStore.$patch({ dataMin: dataMin.value, dataMax: dataMax.value })
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
        { nome: "Perfeito",    value: 1 },
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