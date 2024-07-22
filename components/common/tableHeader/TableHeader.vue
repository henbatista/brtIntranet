<script setup lang="ts">
defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  src: {
    type: String,
    required: true,
  },
});
</script>

<template>
  <div class="container">
    <div class="icon-container">
      <img
        :src="src"
        alt="Ícone de envio"
        class="icon-image"
      />
    </div>
    <div class="text-container">
      <h1 class="title">{{ title }}</h1>
      <p class="description">
        {{ description }}
      </p>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.container {
  @apply flex items-center sm:flex-auto mb-10;
}
.icon-container {
  @apply flex items-center;
}
.icon-image {
  @apply w-10 h-10 mr-2 mix-blend-darken;
}
.text-container {}
.title {
  @apply text-2xl font-semibold text-slate-900 -mb-0;
}
.description {
  @apply text-[13px] text-gray-700;
}
</style>