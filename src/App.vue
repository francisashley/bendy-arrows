<template>
  <div class="tw-w-screen tw-min-h-screen tw-relative tw-flex tw-flex-col">
    <ControlBar :arrows="arrows" />
    <Canvas class="tw-flex-1">
      <Item id="a" :default-position="{ top: 48, left: 48 }" @move="arrows.updateAll()">A</Item>
      <Item id="b" :default-position="{ top: 48, left: 240 }" @move="arrows.updateAll()">B</Item>
      <Item id="c" :default-position="{ top: 144, left: 48 }" @move="arrows.updateAll()">C</Item>
      <Item id="d" :default-position="{ top: 144, left: 144 }" @move="arrows.updateAll()">D</Item>
      <Item id="e" :default-position="{ top: 144, left: 384 }" @move="arrows.updateAll()">E</Item>
      <Item :default-position="{ top: 48, left: 384 * 1.2 }" class="!tw-p-0" @move="arrows.updateAll()">
        <div id="f" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">F</div>
        <div id="g" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">G</div>
        <div id="h" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">H</div>
        <div id="i" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">I</div>
        <div id="j" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">J</div>
        <div id="k" class="tw-py-2 tw-px-4">K</div>
      </Item>
      <Item :default-position="{ top: 48, left: 384 * 2 }" class="!tw-p-0" @move="arrows.updateAll()">
        <div id="l" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">L</div>
        <div id="m" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">M</div>
        <div id="n" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">N</div>
        <div id="o" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">O</div>
        <div id="p" class="tw-py-2 tw-px-4 tw-border-b tw-border-neutral-200">P</div>
        <div id="q" class="tw-py-2 tw-px-4">Q</div>
      </Item>
    </Canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { createArrows } from './lib/create-arrows'
import ControlBar from './components/ControlBar.vue'
import Canvas from './components/Canvas.vue'
import Item from './components/Item.vue'

const arrows = createArrows({
  onClick: (id) => arrows.selectConnection(id),
})

onMounted(() => {
  arrows.setConnections([
    { source: 'a', target: 'b' },
    { source: 'a', target: 'c' },
    { source: 'b', target: 'd' },
    { source: 'b', target: 'e' },
    { source: 'f', target: 'l' },
    { source: 'g', target: 'm' },
    { source: 'h', target: 'o' },
    { source: 'j', target: 'n' },
    { source: 'i', target: 'p' },
    { source: 'k', target: 'q' },
  ])
})

onUnmounted(() => {
  arrows.destroy()
})
</script>
