<script setup>
import { ref } from "vue";
import { useRawMaterialStore } from "@/stores/useRawMaterialStore";

const store = useRawMaterialStore();

const props = defineProps({
  modelValue: Boolean,
  editData: { type: Object, default: null }
});

const emit = defineEmits(["update:modelValue"]);

const name = ref("");
const description = ref("");

function close() {
  emit("update:modelValue", false);
}

async function save() {
  const payload = {
    name: name.value,
    description: description.value,
  };

  if (props.editData) {
    await store.update(props.editData.id, payload);
  } else {
    await store.create(payload);
  }

  close();
}
</script>

<template>
  <div v-if="modelValue" class="modal">
    <div class="modal-content">
      <h2>{{ editData ? "Editar Matéria-Prima" : "Nova Matéria-Prima" }}</h2>

      <input v-model="name" placeholder="Nome da matéria-prima" />
      <textarea v-model="description" placeholder="Descrição"></textarea>

      <button @click="save">Salvar</button>
      <button @click="close">Cancelar</button>
    </div>
  </div>
</template>
