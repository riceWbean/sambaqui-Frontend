<script setup>
import { ref, onMounted } from 'vue'
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
const infoSection = ref(null)
onMounted(() => {
    if (infoSection.value) {
        infoSection.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        })
    }
})
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

                <div class="info-box">
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
                    <span class="value">{{ artefato.conservation_status }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Completude</span>
                    <span class="value">{{ artefato.completeness }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Detalhe de conservação</span>
                    <span class="value">{{ artefato.detail_conservation_status }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Data de registro</span>
                    <span class="value">{{ artefato.register_date }}</span>
                </div>

                <div class="info-box">
                    <span class="label">Reservado?</span>
                    <span class="value">{{ artefato.reserved ? 'Sim' : 'Não' }}</span>
                </div>

                <button class="reservar">Reservar</button>
            </div>
            <div class="right">
                <h3>Descrição</h3>
                <p>{{ artefato.description }}</p>
                <h3 style="margin-top: 1.5rem;">Observações</h3>
                <p>{{ artefato.observation }}</p>
            </div>
        </div>
    </div>
</template>
<style scoped lang="scss">
.acervo-page {
    width: 100%;
    min-height: 100vh;
    padding: 40px 60px;
    color: #fff;
    font-family: Inter, sans-serif;
}

.back {
    background: #363636;
    border: none;
    padding: 12px 25px;
    border-radius: 6px;
    color: #fff;
    margin-bottom: 40px;
    cursor: pointer;
    font-size: 16px;
}

.content {
    display: flex;
    gap: 60px;
}

.left {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.main-image {
    width: 350px;
    height: 350px;
    overflow: hidden;
    border-radius: 6px;

    img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
}

.thumbs {
    display: flex;
    gap: 15px;

    img {
        width: 100px;
        height: 100px;
        border-radius: 4px;
        object-fit: cover;
        cursor: pointer;
        opacity: 0.7;
        transition: .2s;

        &.active,
        &:hover {
            opacity: 1;
            transform: scale(1.05);
        }
    }
}

.middle {
    border-left: 2px solid #3c3c3c;
    padding-left: 40px;
    width: 260px;

    .tag {
        background: #3a3a3a;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
    }

    .title {
        margin-top: 12px;
        margin-bottom: 20px;
    }

    .info-box {
        display: flex;
        flex-direction: column;
        margin-bottom: 14px;

        .label {
            font-size: 13px;
            color: #adadad;
        }

        .value {
            font-size: 15px;
        }
    }

    .reservar {
        margin-top: 20px;
        background: #a26e4b;
        border: none;
        padding: 12px 30px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 15px;
        color: #fff;
    }
}

.right {
    flex: 1;

    h3 {
        margin-bottom: 10px;
        font-size: 20px;
    }

    p {
        width: 500px;
        line-height: 1.5rem;
        color: #d3d3d3;
    }
}
</style>
