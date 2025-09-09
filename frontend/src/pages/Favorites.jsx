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
    const avgsFavMap = Object.fromEntries(avgsFavorites.map(avg => [avg.gameId, avg.rating]))

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

                        // <Link to={`/reviews/games/${fav.id}`}>
                        //     <div
                        //         key={fav.id}
                        //         className={clsx(
                        //             "rounded-2xl overflow-hidden shadow-lg p-4 backdrop-blur-md bg-white/5 border border-white/10 transition hover:scale-[1.02] hover:border-white/20 cursor-pointer"
                        //             // "hover:shadow-xl hover:bg-white/10 hover:backdrop-blur-lg transition-all duration-300"
                        //         )}
                        //     >
                        //         <div
                        //             className={clsx(
                        //                 "h-40 bg-gradient-to-br from-[#222] to-[#111] rounded-lg mb-4"
                        //             )}
                        //         />
                        //         <h3 className={clsx("text-lg font-semibold text-white")}>
                        //             {fav.titulo}
                        //         </h3>
                        //         <p className="flex items-center gap-1 font-medium">
                        //             <Star size={20} fill="currentColor" className="text-yellow-400 stroke-0 -mt-[1px]" /> 4.5
                        //         </p>
                        //         {/* <p className={clsx("text-md text-gray-300 mb-1")}>
                        //         {fav.genero}
                        //     </p>
                        //     <p className={clsx("text-sm text-gray-300 mb-3")}>
                        //         {fav.plataforma}
                        //     </p> */}
                        //         <div className="flex gap-2 flex-wrap mb-3">
                        //             <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full">{fav.genero}</span>
                        //             <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-0.5 rounded-full">{fav.plataforma}</span>
                        //         </div>

                        //         <p className={clsx("text-sm text-gray-300 line-clamp-3")}>
                        //             {/* Descrição do jogo. Um breve texto falando sobre o jogo. */}
                        //             {fav.descricao}
                        //         </p>

                        //         <div>
                        //             <Button
                        //                 className={clsx(
                        //                     "absolute top-4 right-4",
                        //                     "bg-black/50 w-6 h-6 rounded-full transition",
                        //                     "flex justify-center items-center cursor-pointer",
                        //                     "hover:bg-black/70 transition-colors",
                        //                     favoritesIdGame.includes(fav.id) ? "text-red-500" : "text-zinc-400 hover:text-red-400"
                        //                 )}
                        //                 text={favoritesIdGame.includes(fav.id) ? <HeartSolid className="w-4 h-4 text-red-500" /> : <HeartOutline className="w-4 h-4" />}
                        //                 // text={<HeartSolid className="w-5 h-5 text-red-500 cursor-pointer" />}
                        //                 handleClick={(e) => {
                        //                     e.preventDefault()
                        //                     e.stopPropagation()
                        //                     handleFavorites(fav.id)
                        //                 }}
                        //             />
                        //         </div>
                        //     </div>
                        // </Link>
                    ))}
            </div>
        </section>
    )
}

export default Favorites