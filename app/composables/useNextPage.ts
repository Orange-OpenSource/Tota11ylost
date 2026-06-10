export const useNextPage = () => {
    const gameStore = useGameStore()
    const router = useRouter()

    const goToNextPage = async () => {
        const nextPage = gameStore.moveToNextPage()
        if (nextPage) {
            await router.push(nextPage)
        }
 else {
            gameStore.resetAll()
            alert('Bravo ! Tu as fini toutes les pages!')
            await router.push('./scores')
        }
    }

return { goToNextPage }
}
