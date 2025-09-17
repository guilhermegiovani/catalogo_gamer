import clsx from "clsx"
import { useEffect, useState } from "react"
// import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
// import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"
// import { Star } from "lucide-react"
// import Button from "../components/Button"
import { useAuth } from "../hooks/useAuth"
import { getFavorites, getReviewsAvgs } from "../services/routes"
// import { Link } from "react-router-dom"
import GameCard from "../components/GameCard"

function Favorites() {
    const { favorites, setFavorites, favoritesIdGame, setFavoritesIdGame, avgsFavorites, setAvgsFavorites } = useAuth()

    const [isLoadingFavorite, setIsLoadingFavorite] = useState(true)

    useEffect(() => {
        async function fetchFavorites() {
            try {
                const res = await getFavorites()
                const games = res.data
                const idGame = games.map(game => game.id)
                setFavorites(res.data)
                setFavoritesIdGame(idGame)

                const resAvgs = await getReviewsAvgs()
                setAvgsFavorites(resAvgs.data.filter(avg => idGame.includes(avg.gameId)))
                
            } catch (err) {
                console.log(`Erro ao pegar dados: ${err}`)
            } finally {
                setIsLoadingFavorite(false)
            }
        }

        fetchFavorites()

    }, [])

    if (isLoadingFavorite) {
        return (
            <section className="w-full flex justify-center items-start min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </section>
        )
    }

    // if(!avgsFavorites) return <p>Carregando...</p>
    const avgsFavMap = Object.fromEntries(avgsFavorites.map(avg => [avg.gameid, avg.rating]))

    return (
        <section className={clsx("px-4 py-10 max-w-6xl mx-auto")}>
            <h1
                className={clsx(
                    "text-3xl sm:text-4xl font-semibold text-center mb-10 text-white drop-shadow"
                )}
            >
                Favoritos
            </h1>

            <div
                className={clsx(
                    favorites.length > 0
                        ? "grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        : "flex justify-center"

                )}
            >
                {favorites.length === 0 ?
                    <p>Nenhum jogo adicionado aos favoritos.</p> :
                    favorites.map((fav) => (
                        <GameCard
                            key={fav.id}
                            game={fav}
                            avgGame={avgsFavMap[fav.id]}
                            isFavorite={favoritesIdGame.includes(fav.id)}
                            to={`/reviews/${fav.id}`}
                        />
                    ))}
            </div>
        </section>
    )
}

export default Favorites