export const useNextPage = () => {
    const gameStore = useGameStore()
    const router = useRouter()

    const goToNextPage = async () => {
        console.log('Current page:')
        const nextPage = gameStore.moveToNextPage()
        if (nextPage) {
            await router.push(nextPage)
            console.log('Navigating to next page:', nextPage)
        }
 else {
            gameStore.resetAll()
            alert('Bravo ! Tu as fini toutes les pages!')
            await router.push('./scores')
        }
    }

return { goToNextPage }
}
