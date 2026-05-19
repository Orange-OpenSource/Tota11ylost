<script lang="ts">
import { useGameStore } from '../stores/gameStore'

export default defineComponent({
  setup() {
    const gameStore = useGameStore()
    const router = useRouter()

    const goToNextPage = () => {
      const nextPage = gameStore.moveToNextPage()
      if (nextPage) {
        router.push(nextPage)
      }
      else {
        gameStore.resetAll()
        alert('Bravo ! Tu as fini toutes les pages!')
        router.push('./')
      }
    }

    return { goToNextPage }
  },
})
</script>
