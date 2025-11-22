<script setup>

const props = defineProps({
    placeholder: {
        type: String,
        default: 'Digite aqui'
    }

});

</script>

<template>
    <input type="text" :placeholder="props.placeholder">
</template>

<style scoped>
@import '@/assets/sass/about/_inputForm.scss';
</style>