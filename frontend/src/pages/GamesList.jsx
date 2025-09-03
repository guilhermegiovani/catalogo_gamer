import clsx from "clsx"
import { Star } from "lucide-react"
import Button from "../components/Button"
import { useEffect } from "react"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"
// import api from "../services/api"
import { getGames, getReviewsAvgs } from "../services/routes"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import GameCard from "../components/GameCard"
import SearchGame from "../components/SearchGame"

function GamesList() {
    const { games, setGames, favoritesIdGame, favorites, averages, setAverages, setImgsGames, searchGame, isSearch } = useAuth()


    useEffect(() => {
        async function fetchGames() {
            try {
                const res = await getGames()
                setGames(res.data)
                setImgsGames(res.data.map(g => g.imagem_url))

                const resAvg = await getReviewsAvgs()
                setAverages(resAvg.data)
            } catch (err) {
                console.log(`Erro ao pegar dados: ${err}`)
            }
        }

        fetchGames()

    }, [])

    if (!games || !favorites) return <p>Carregando...</p>

    const avgMap = Object.fromEntries(averages.map(a => [a.gameId, a.nota]))

    return (
        <section className={clsx("px-4 py-10 max-w-6xl mx-auto")}>
            <h1
                className={clsx(
                    "text-3xl sm:text-4xl font-semibold text-center mb-10 text-white drop-shadow"
                )}
            >
                Lista de Jogos
            </h1>

            {<SearchGame />}

            <div
                className={clsx(
                    "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch"
                    // "flex flex-wrap justify-center gap-4"
                )}
            >
                {isSearch !== true ?
                    games.map((game) => (

                        <GameCard
                            key={game.id}
                            game={game}
                            avgGame={avgMap[game.id]}
                            isFavorite={favoritesIdGame.includes(game.id)}
                            to={`/reviews/${game.id}`}
                        />
                    )) : searchGame.map((g) => (
                        <GameCard
                            key={g.id}
                            game={g}
                            avgGame={avgMap[g.id]}
                            isFavorite={favoritesIdGame.includes(g.id)}
                            to={`/reviews/${g.id}`}
                        />
                    ))

                }
            </div>
        </section>
    )
}

export default GamesList

{/* <p className = { clsx("flex flex-col text-md font-semibold text-gray-300 line-clamp-3") } >
    Descrição: <span className="text-sm font-normal text-gray-400">{game.descricao}</span>
</p> */}

{/* <div className="flex gap-2 flex-wrap mb-1">
    <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full">{game.genero}</span>
    <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-0.5 rounded-full">{game.plataforma}</span>
</div> */}