<template>
  <div
    ref="dragElement"
    class="tw-absolute tw-bg-white tw-border tw-rounded-sm tw-py-2 tw-px-4 tw-cursor-move tw-text-center"
    :style="{
      left: position.left + 'px',
      top: position.top + 'px',
    }"
    @mousedown="startDrag"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref, inject, onMounted, onUnmounted, Ref } from 'vue'

const EDGE_MARGIN = 8
const canvas = inject('canvas') as Ref<HTMLElement | null>

const props = defineProps<{
  defaultPosition: { left: number; top: number }
}>()

const emit = defineEmits(['move'])

const position = ref({ ...props.defaultPosition })
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })
const dragElement = ref<HTMLElement | null>(null)

const startDrag = (event: MouseEvent) => {
  isDragging.value = true
  if (dragElement.value && canvas.value) {
    const rect = dragElement.value.getBoundingClientRect()
    const canvasRect = canvas.value.getBoundingClientRect()
    dragOffset.value = {
      x: event.clientX - rect.left + canvasRect.left,
      y: event.clientY - rect.top + canvasRect.top,
    }
  }
  event.preventDefault()
}

const doDrag = (event: MouseEvent) => {
  if (!isDragging.value || !dragElement.value || !canvas.value) return

  const canvasRect = canvas.value.getBoundingClientRect()
  const elementRect = dragElement.value.getBoundingClientRect()

  let newLeft = event.clientX - dragOffset.value.x
  let newTop = event.clientY - dragOffset.value.y

  newLeft = Math.max(EDGE_MARGIN, Math.min(newLeft, canvasRect.width - elementRect.width - EDGE_MARGIN))
  newTop = Math.max(EDGE_MARGIN, Math.min(newTop, canvasRect.height - elementRect.height - EDGE_MARGIN))

  position.value = { left: newLeft, top: newTop }
  emit('move')
}

const stopDrag = () => {
  isDragging.value = false
}

onMounted(() => {
  document.addEventListener('mousemove', doDrag)
  document.addEventListener('mouseup', stopDrag)
})

onUnmounted(() => {
  document.removeEventListener('mousemove', doDrag)
  document.removeEventListener('mouseup', stopDrag)
})
</script>
