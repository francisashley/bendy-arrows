// src/components/ControlBar.vue
<template>
  <div class="tw-top-0 tw-left-0 tw-right-0 tw-bg-white tw-border-b tw-px-4 tw-py-3" id="control-bar">
    <div class="tw-flex tw-items-center tw-gap-3 tw-mb-4">
      <label class="tw-text-sm tw-text-neutral-600">Select Line:</label>
      <select
        :value="selectedId || ''"
        class="tw-border tw-rounded-sm tw-px-2 tw-py-1 tw-text-sm"
        @change="handleConnectionSelect"
      >
        <option value="">Global Style</option>
        <option v-for="id in connectionIds" :key="id" :value="id">{{ id }}</option>
      </select>
    </div>

    <div class="tw-flex tw-flex-wrap tw-gap-6 tw-items-center">
      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-neutral-600">Arrow:</label>
        <select
          v-model="settings.arrowType"
          class="tw-border tw-rounded-sm tw-px-2 tw-py-1 tw-text-sm"
          @change="updateStyle"
        >
          <option value="none">None</option>
          <option value="inline">Inline</option>
          <option value="triangle">Triangle</option>
        </select>
      </div>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-neutral-600">Gap:</label>
        <input type="range" v-model.number="settings.gap" min="0" max="20" class="tw-w-32" @input="updateStyle" />
        <span class="tw-text-sm tw-text-neutral-600">{{ settings.gap }}px</span>
      </div>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-neutral-600">Thickness:</label>
        <input type="range" v-model.number="settings.thickness" min="1" max="20" class="tw-w-32" @input="updateStyle" />
        <span class="tw-text-sm tw-text-neutral-600">{{ settings.thickness }}px</span>
      </div>

      <div class="tw-flex tw-items-center tw-gap-3">
        <label class="tw-text-sm tw-text-neutral-600">Color:</label>
        <input
          type="color"
          v-model="settings.color"
          class="tw-w-8 tw-h-8 tw-rounded-sm tw-border"
          @input="updateStyle"
          @change="updateStyle"
        />
      </div>

      <div class="tw-flex tw-items-center tw-gap-6">
        <div class="tw-flex tw-items-center tw-gap-3">
          <label class="tw-text-sm tw-text-neutral-600">Source Edges:</label>
          <div class="tw-flex tw-gap-2">
            <label v-for="edge in edges" :key="edge" class="tw-flex tw-items-center tw-gap-1">
              <input
                type="checkbox"
                :checked="settings.sourceEdges.includes(edge)"
                @change="toggleEdge('source', edge)"
              />
              <span class="tw-text-sm">{{ edge[0].toUpperCase() + edge.slice(1) }}</span>
            </label>
          </div>
        </div>

        <div class="tw-flex tw-items-center tw-gap-3">
          <label class="tw-text-sm tw-text-neutral-600">Target Edges:</label>
          <div class="tw-flex tw-gap-2">
            <label v-for="edge in edges" :key="edge" class="tw-flex tw-items-center tw-gap-1">
              <input
                type="checkbox"
                :checked="settings.targetEdges.includes(edge)"
                @change="toggleEdge('target', edge)"
              />
              <span class="tw-text-sm">{{ edge[0].toUpperCase() + edge.slice(1) }}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { createArrows } from '../lib/create-arrows'
import type { ConnectionStyle, Edge } from '../lib/types'

const props = defineProps<{
  arrows: ReturnType<typeof createArrows>
}>()

const selectedId = ref<string | null>(null)
const connectionIds = ref<string[]>([])
const settings = ref<ConnectionStyle>({
  arrowType: 'triangle',
  gap: 4,
  thickness: 2,
  color: '#000000',
  cornerRadius: 0,
  sourceEdges: ['top', 'right', 'bottom', 'left'],
  targetEdges: ['left', 'right'],
})

const edges: Edge[] = ['left', 'top', 'right', 'bottom']

onMounted(() => {
  settings.value = props.arrows.getStyle()

  // Add click handler to deselect when clicking outside control bar
  document.addEventListener('click', (e) => {
    if (!e.target || !(e.target as HTMLElement).closest('#control-bar')) {
      props.arrows.selectConnection(null)
      selectedId.value = null
    }
  })
})

const updateStyle = () => {
  props.arrows.updateStyle(settings.value, selectedId.value || undefined)
}

const toggleEdge = (type: 'source' | 'target', edge: Edge) => {
  const key = type === 'source' ? 'sourceEdges' : 'targetEdges'
  const currentEdges = new Set(settings.value[key])

  if (currentEdges.has(edge)) {
    currentEdges.delete(edge)
  } else {
    currentEdges.add(edge)
  }

  settings.value = {
    ...settings.value,
    [key]: Array.from(currentEdges),
  }
  updateStyle()
}

const handleConnectionSelect = (event: Event) => {
  selectedId.value = (event.target as HTMLSelectElement).value || null
  if (selectedId.value) {
    props.arrows.selectConnection(selectedId.value)
    settings.value = props.arrows.getStyle(selectedId.value)
  } else {
    props.arrows.selectConnection(null)
    settings.value = props.arrows.getStyle()
  }
}

// Watch for selection changes
watch(
  () => props.arrows.getSelectedConnection(),
  (newId) => {
    selectedId.value = newId
    if (newId) {
      settings.value = props.arrows.getStyle(newId)
    } else {
      settings.value = props.arrows.getStyle()
    }
  },
)
</script>
