<script setup>
import { ref, onMounted, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import artefactData from '@/data/artefact.json'

const route = useRoute()
const id = Number(route.params.id)
const artefato = artefactData.find(a => a.id === id) || null
const photos = artefato?.images?.map(img => img.url_photo) ?? []
const mainImage = ref(photos[0] ?? '')
const selectImage = (src) => {
    mainImage.value = src
}

// REF PARA O DÉCIMO ELEMENTO
const targetScroll = ref(null)

onMounted(async () => {
    await nextTick(); // espera o DOM terminar de montar

    if (targetScroll.value) {
        targetScroll.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
});
</script>
<template>
    <div class="acervo-page" v-if="artefato">
        <button class="back">Retornar</button>
        <div class="content">
            <div class="left">
                <div class="main-image">
                    <img :src="mainImage" alt="" />
                </div>
                <div class="thumbs">
                    <img v-for="(img, i) in photos" :key="i" :src="img" @click="selectImage(img)"
                        :class="{ active: mainImage === img }" />
                </div>
            </div>
            <div class="middle" ref="infoSection">
                <h2 class="title">{{ artefato.name }}</h2>

                <div class="info-box">
                    <span class="label">Outro nome</span>
                    <span class="value">{{ artefato.other_name || 'Nenhum' }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Identificação</span>
                    <span class="value">#{{ artefato.id }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Material</span>
                    <span class="value">{{ artefato.raw_material.name }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Subtipo</span>
                    <span class="value">{{ artefato.sub_type.name }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Coleção</span>
                    <span class="value">{{ artefato.collection.name }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Quantidade total na coleção</span>
                    <span class="value">{{ artefato.collection.quantity_artefacts }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Localização</span>
                    <span class="value">
                        {{ artefato.localization.room }},
                        {{ artefato.localization.shelf }},
                        {{ artefato.localization.bookcase }}
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Sítio arqueológico</span>
                    <span class="value">
                        {{ artefato.archaeological_site.site }} —
                        {{ artefato.archaeological_site.city }}/{{ artefato.archaeological_site.state }}
                        ({{ artefato.archaeological_site.country }})
                    </span>
                </div>

                <div class="info-box" ref="targetScroll">
                    <span class="label">Dimensões</span>
                    <span class="value">
                        {{ artefato.dimension_width }} × {{ artefato.dimension_length }} mm
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Peso</span>
                    <span class="value">{{ artefato.weigth }} g</span>
                </div>

                <div class="info-box">
                    <span class="label">Período (Idade aproximada)</span>
                    <span class="value">{{ artefato.dating }} anos</span>
                </div>

                <div class="info-box">
                    <span class="label">Estado de conservação</span>
                    <span class="value">
                        {{
                            (
                                { 1: 'Perfeito', 2: 'Bom', 3: 'Regular', 4: 'Ruim', 5: 'Critical', 6: 'Irreversível' }
                            )[artefato.conservation_status] || artefato.conservation_status
                        }}
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Completude</span>
                    <span class="value">
                        {{
                            (
                                { 1: 'Inteiro', 2: 'Fragmentado', 3: 'Fraturado' }
                            )[artefato.completeness] || artefato.completeness
                        }}
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Detalhe de conservação</span>
                    <span class="value">
                        {{
                            (
                                {
                                    1: 'Friável',
                                    2: 'Erodido',
                                    3: 'Lascado',
                                    4: 'Incompleto',
                                    5: 'Alterado quimicamente',
                                    6: 'Deformado',
                                    7: 'Estável'
                                }
                            )[artefato.detail_conservation_status] || artefato.detail_conservation_status
                        }}
                    </span>
                </div>

                <div class="info-box">
                    <span class="label">Data de registro</span>
                    <span class="value">{{ artefato.register_date }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Reservado?</span>
                    <span class="value">{{ artefato.reserved ? 'Sim' : 'Não' }}</span>
                </div>

                
            </div>
            <div class="right">
                <h3>Descrição</h3>
                <p>{{ artefato.description }}</p>
                <h3 style="margin-top: 1.5rem;">Observações</h3>
                <p>{{ artefato.observation }}</p>
                <button class="reservar" style="margin-top: 1.5rem;">Reservar</button>
            </div>
        </div>
    </div>
</template>
<style scoped>
@import '@/assets/sass/collections/_artefactCollections.scss';
</style>
