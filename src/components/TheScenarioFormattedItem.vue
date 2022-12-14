<script setup lang="ts">
defineProps<{
  title: string
}>()
</script>

<template>
  <div class="space-y-1">
    <div class="text-subtitle-2 text-gray-500">{{ title }}</div>
    <div class="text-body-2"><slot /></div>
  </div>
</template>
