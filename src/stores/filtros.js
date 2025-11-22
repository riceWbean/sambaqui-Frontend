import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
export const useFiltroStore = defineStore('filtro', () => {
  const dataMin = ref("")
  const dataMax = ref("")
  const conservacao = ref([])
  const colecao = ref([])
  const material = ref([])
  const localizacao = ref([])

  const filtro = computed(() => {
    let arr = ProdutosStore.produtos
    if (dataMin.value) arr = arr.filter(e => e.data >= dataMin.value)
    if (dataMax.value) arr = arr.filter(e => e.data <= dataMax.value)

    if (conservacao.value.length)
      arr = arr.filter(e => conservacao.value.includes(e.conservacao))

    if (colecao.value.length)
      arr = arr.filter(e => colecao.value.includes(e.colecao))

    if (material.value.length)
      arr = arr.filter(e => material.value.includes(e.material))

    if (localizacao.value.length)
      arr = arr.filter(e => localizacao.value.includes(e.localizacao))

    return arr
  })

  return {
    dataMin,
    dataMax,
    conservacao,
    colecao,
    material,
    localizacao,
    filtro,
  }
})
