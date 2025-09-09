import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import GameCard from "../components/GameCard"
import clsx from "clsx"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"


function Admin() {
    
    const { averages, fetchGame, gamesAdmin } = useAuth()
    const navigate = useNavigate()


    useEffect(() => {
        fetchGame()
    }, [])

    const avgMap = Object.fromEntries(averages.map(a => [a.gameId, a.rating]))

    return (
        <section className={clsx("px-2 sm:px-4 py-6 sm:py-10 max-w-6xl mx-auto")}>
            <h1
                className={clsx(
                    "text-2xl sm:text-3xl lg:text-4xl font-semibold text-center mb-6 sm:mb-10 text-white drop-shadow"
                )}
            >
                {"Lista de Jogos (somente admin)"}
            </h1>

            <Button
                text="Adicionar novo jogo"
                className={clsx(
                    "bg-gradient-to-r from-fuchsia-800 to-violet-700 mb-6 sm:mb-10",
                    "hover:brightness-130 hover:scale-105 active:scale-95 transition-all cursor-pointer",
                    // "text-white text-lg px-10 py-2 rounded-xl font-medium shadow-md w-fit"
                    "text-white text-base sm:text-lg px-6 sm:px-10 py-2 rounded-xl font-medium shadow-md",
                    "w-full sm:w-fit text-center"
                )}
                handleClick={() => navigate("/admin/addnewgame")}
            />

            <div className={clsx(
                // "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 items-stretch"
                "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            )}>
                {gamesAdmin.map((game) => (
                    <GameCard
                        key={game.id}
                        game={game}
                        avgGame={avgMap[game.id]}
                        to={`/games/${game.id}`}
                    />
                ))}
            </div>
        </section>
    )
}

export default Admin