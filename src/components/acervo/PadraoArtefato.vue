<script setup>
import { useRoute, useRouter } from 'vue-router'
import { ref, computed, onMounted } from "vue";
import { useArtefatosStore } from "@/stores/artefatosStore";
import SlideComponent from "./SlideComponent.vue";

const artefatosStore = useArtefatosStore()
const busca = ref(null)
// ✔ Agora chamamos o método novo
onMounted(async () => {
    try {
        await artefatosStore.fetchAll(5, 1)
    } catch (e) {
        console.error("Erro ao carregar artefatos:", e)
    }
})
onMounted(() => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    })
     setTimeout(() => {
    busca.value?.focus()
  }, 200)
})

const route = useRoute()
const router = useRouter()

const ordenar = ref("popular")

const listaFiltrada = computed(() => {
    // ✔ TESTE: se ainda não carregou, retorna array vazio
    if (!Array.isArray(artefatosStore.artefatos)) return []

    let dados = [...artefatosStore.artefatos]

    // ✔ TESTE: garantir que name exista
    // FILTRO POR BUSCA
   if ((busca.value || "").trim() !== "") {
        dados = dados.filter(item =>
            (item.name || "").toLowerCase().includes(busca.value.toLowerCase())
        )
    }

    // ✔ TESTE: prevenir quebra em register_date
    if (ordenar.value === "nome") {
        dados.sort((a, b) =>
            (a.name || "").localeCompare(b.name || "")
        )
    } else if (ordenar.value === "recente") {
        dados.sort((a, b) =>
            new Date(b.register_date || 0) - new Date(a.register_date || 0)
        )
    }

    return dados
})
</script>

<template>
    <div class="container-geral">

        <!-- Barra superior -->
        <div class="top-bar">
            <div class="input-area">
                <span class="icon"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                        xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M17.5 17.5L13.875 13.875M15.8333 9.16667C15.8333 12.8486 12.8486 15.8333 9.16667 15.8333C5.48477 15.8333 2.5 12.8486 2.5 9.16667C2.5 5.48477 5.48477 2.5 9.16667 2.5C12.8486 2.5 15.8333 5.48477 15.8333 9.16667Z"
                            stroke="#D9D9D9" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                </span>
                <input type="text" placeholder="Pesquisar" v-model="busca" />
            </div>

            <div class="ordenar">
                <span>Ordenar por:</span>
                <select v-model="ordenar">
                    <option value="popular">Popular</option>
                    <option value="nome">Nome</option>
                    <option value="recente">Mais recente</option>
                </select>
            </div>
        </div>

        <!-- LISTA -->
        <div class="lista-artefatos">
            <div v-for="item in listaFiltrada" :key="item.id" class="item">
                
                <SlideComponent @click="router.push(`/artefact/${item.id}`)" 
                    :id="item.id" 
                    :nome="item.name" 
                    :codigo="item.id" 
                    :material="item.raw_material?.name || '—'"
                    :subtitulo="item.sub_type?.name || '—'" 
                    :img="item.images?.length ? item.images[0]?.url_photo : ''" 
                />
               
            </div>
        </div>
    </div>
</template>


<style scoped>
/* Container geral */
.container-geral {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 25px;
    height: 90%;
}

/* 🔍 Área superior */
.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 50vw;
    color: #ccc;
}

/* Campo de busca */
.input-area {
    display: flex;
    align-items: center;
    border-bottom: 1px solid #666;
    padding: 5px 0;
    width: 60%;
}

.input-area input {
    background: transparent;
    border: none;
    outline: none;
    color: white;
    width: 100%;
    font-size: 14px;
}

.icon {
    margin-right: 8px;
    opacity: 0.8;
}

/* Select de ordenar */
.ordenar {
    display: flex;
    align-items: center;
    gap: 8px;
}

.ordenar select {
    background: #2e2e2e;
    color: #ddd;
    border: 1px solid #444;
    padding: 6px 10px;
    border-radius: 6px;
}

/* Lista */
.lista-artefatos {
    width: 60vw;
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
    justify-content: center;
}

.item {
    width: 250px;
}
</style>
