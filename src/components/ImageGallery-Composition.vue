<template>
  <div class="image-gallery">
    <div class="main-image">
      <img v-if="currentImage" :src="currentImage" :alt="altText" />
      <div v-else class="no-image">Nenhuma imagem disponível</div>
    </div>

    <div v-if="images && images.length > 0" class="thumbnail-list">
      <button
        v-for="(image, index) in images"
        :key="index"
        :class="['thumbnail', { active: currentIndex === index }]"
        @click="selectImage(index)"
        :title="`Imagem ${index + 1}`"
      >
        <img :src="image" :alt="`Thumbnail ${index + 1}`" />
      </button>
    </div>

    <div v-if="images && images.length > 0" class="image-counter">
      {{ currentIndex + 1 }} de {{ images.length }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  images: {
    type: Array,
    default: () => []
  },
  altText: {
    type: String,
    default: 'Imagem do artefato'
  }
})

const emit = defineEmits(['image-selected'])

const currentIndex = ref(0)

const currentImage = computed(() => {
  if (props.images && props.images.length > 0) {
    return props.images[currentIndex.value]
  }
  return null
})

const selectImage = (index) => {
  currentIndex.value = index
  emit('image-selected', { index, image: props.images[index] })
}
</script>

<style scoped>
.image-gallery {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.main-image {
  width: 100%;
  height: 400px;
  background: #f8f9fa;
  border-radius: 6px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ecf0f1;
}

.main-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.no-image {
  color: #7f8c8d;
  font-size: 1rem;
}

.thumbnail-list {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.thumbnail {
  width: 80px;
  height: 80px;
  border: 2px solid #ecf0f1;
  border-radius: 6px;
  padding: 0;
  cursor: pointer;
  transition: all 0.3s;
  overflow: hidden;
  background: transparent;
  flex-shrink: 0;
}

.thumbnail:hover {
  border-color: #3498db;
  box-shadow: 0 2px 4px rgba(52, 152, 219, 0.2);
}

.thumbnail.active {
  border-color: #3498db;
  box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.image-counter {
  text-align: center;
  color: #7f8c8d;
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
