<script setup lang="ts">
import { useGameStore } from '../stores/gameStore'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const gameStore = useGameStore()

onMounted(() => {
  gameStore.loadFromLocalStorage()
})

const deficiencies = [
  { id: 'visual', label: t('filter.deficiencyVisual') },
  { id: 'physical', label: t('filter.deficiencyPhysical') },
  { id: 'hearing', label: t('filter.deficiencyHearing') },
  { id: 'cognitive', label: t('filter.deficiencyCognitive') },
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
    <h4 id="filtersHeader">
      Filtrer votre deficience :
    </h4>
    <ul class="chips-container">
      <li v-for="def in deficiencies" :key="def.id" class="chip chip-filter">
        <input
          :id="def.id"
          type="checkbox"
          :name="def.id"
          :value="def.id"
          :checked="!gameStore.categoriesRestantes.includes(def.id)"
          :aria-label="def.label"
          @change="(e) => handleDeficiencyChange(def.id, e)"
        >
        <label class="chip-interactive" :for="def.id">{{ def.label }}</label>
      </li>
    </ul>
  </div>
</template>
