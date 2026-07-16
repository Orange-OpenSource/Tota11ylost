<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'

const gameStore = useGameStore()

onMounted(() => {
  gameStore.loadFromLocalStorage()
})

const deficiencies = [
  { id: 'visual', labelKey: 'filter.deficiencyVisual' },
  { id: 'physical', labelKey: 'filter.deficiencyPhysical' },
  { id: 'hearing', labelKey: 'filter.deficiencyHearing' },
  { id: 'cognitive', labelKey: 'filter.deficiencyCognitive' },
]

const handleDeficiencyChange = (deficiency: string, event: Event) => {
  const isChecked = (event.target as HTMLInputElement).checked

  if (isChecked) {
    gameStore.removeDeficiencyFromCategories(deficiency)
  }
  else {
    gameStore.addDeficiencyToCategories(deficiency)
  }
}
</script>

<template>
  <div role="group" aria-labelledby="filtersHeader">
    <p id="filtersHeader">
      {{ $t('filter.title') }}
    </p>
    <ul class="chips-container">
      <li v-for="def in deficiencies" :key="def.id" class="chip chip-filter">
        <input
          :id="def.id"
          type="checkbox"
          :name="def.id"
          :value="def.id"
          :checked="!gameStore.categoriesRestantes.includes(def.id)"
          :aria-label="$t(def.labelKey)"
          @change="(e) => handleDeficiencyChange(def.id, e)"
        >
        <label class="chip-interactive" :for="def.id">{{ $t(def.labelKey) }}<img :src="`/icons/${def.id}.svg`" :alt="$t(def.labelKey)" class="icon"></label>
      </li>
    </ul>
  </div>
</template>
