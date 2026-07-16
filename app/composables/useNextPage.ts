export const useNextPage = () => {
    const gameStore = useGameStore()
    const router = useRouter()

    const goToNextPage = async () => {
        const currentRoute = router.currentRoute.value.path
        const nextPage = gameStore.moveToNextPage(currentRoute)
        if (nextPage) {
            await router.push(nextPage)
        }
        else {
            await router.push('./scores')
        }
    }

return { goToNextPage }
}
