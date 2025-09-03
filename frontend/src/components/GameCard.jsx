import clsx from "clsx"
import { Star } from "lucide-react"
import Button from "../components/Button"
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid"
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline"
import { Link } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"

function GameCard({ game, isFavorite, to, avgGame }) {

    const { handleFavorites } = useAuth()

    return (
        <Link key={game.id} to={to}>
            <div
                className={clsx(
                    "relative rounded-2xl overflow-hidden shadow-md p-4 backdrop-blur-md bg-white/5 border border-white/10 transition hover:scale-[1.04] hover:border-white/20 cursor-pointer",
                    "w-full h-full flex flex-col justify-between"
                    // "hover:shadow-xl hover:bg-white/10 hover:backdrop-blur-lg transition-all duration-300"
                )}
            >

                <img
                    src={`http://localhost:8000${game.imagem_url}`}
                    alt={game.titulo}
                    className={clsx(
                        "w-full h-20 sm:h-64 bg-gradient-to-br from-[#222] to-[#111] rounded-lg mb-3 object-cover object-top"
                    )}
                    // aspect-[4/3]
                />

                <h3 className={clsx(
                    "line-clamp-1 text-base lg:text-lg font-semibold text-white mb-1"
                    )}>
                    {game.titulo}
                </h3>

                <div className="flex flex-wrap mb-1">
                    <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-1 rounded-2xl">{game.genero}</span>
                </div>

                <p className="flex items-center gap-1 font-medium mb-2">
                    <Star size={20} fill="currentColor" className="text-yellow-400 stroke-0 -mt-[1px]" /> {avgGame}
                </p>

                <p className="text-xs sm:text-sm text-gray-400">
                    Clique para mais detalhes e avaliações
                </p>

                <div>
                    <Button
                        className={clsx(
                            "absolute top-4 right-4",
                            "bg-black/50 w-6 h-6 rounded-full transition",
                            "flex justify-center items-center cursor-pointer",
                            "hover:bg-black/70 transition-colors",
                            isFavorite ? "text-red-500" : "text-zinc-400 hover:text-red-400"
                        )}
                        text={isFavorite ? <HeartSolid className="w-4 h-4 text-red-500" /> : <HeartOutline className="w-4 h-4" />}
                        handleClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            handleFavorites(game.id)
                        }}
                    />
                </div>
            </div>

        </Link>
    )
}

export default GameCard