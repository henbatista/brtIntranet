<script setup lang="ts">

</script>

<template>
    <div class="loading">
        <div class="loading-spinner"></div>
        <p>{{ message }}</p>
    </div>
</template>


<style scoped>
.loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
}

.loading-spinner {
    /* Adicione aqui o estilo da animação de carregamento */
}
</style>