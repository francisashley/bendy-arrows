<template>
  <div ref="canvasRef" class="tw-relative">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, provide } from 'vue'

const canvasRef = ref<HTMLElement | null>(null)
provide('canvas', canvasRef)
</script>
