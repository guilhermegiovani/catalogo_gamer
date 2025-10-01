import clsx from "clsx"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { getGames } from "../services/routes"
import { useEffect, useState } from "react"
import Carrossel from "../components/Carrossel"

function Home() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [gamesImgs, setGamesImgs] = useState([])

    const getImgsGames = async () => {
        try {
            const res = await getGames()
            setGamesImgs(res.data)
        } catch (err) {
            console.log(`Erro ao pegar imagens do jogos: ${err}`)
        }
    }

    useEffect(() => {
        getImgsGames()
    }, [])

    return (
        <section className={clsx(
            "grid md:grid-cols-2 gap-15 lg:gap-30",
            "p-5 justify-around max-w-screen-xl mx-auto flex items-center"
        )}>
            <div className={clsx(
                "space-y-4 lg:space-y-6 xl:space-y-8 text-center md:text-left",
                "flex flex-col"
                )}>
                <h1 className={clsx(
                    "flex flex-col items-center md:items-start leading-tight",
                    "font-medium md:text-left text-3xl",
                    "landscape:sm:text-3xl landscape:lg:text-4xl landscape:xl:text-6xl",
                    "portrait:sm:text-4xl"
                )}>
                    <span>DESCUBRA</span>
                    <span className="text-blue-600">JOGOS INCRÍVEIS</span>
                </h1>

                <div className={clsx(
                    // "text-base md:text-lg text-gray-300 space-y-1 leading-tight"
                    "w-full text-sm md:text-md text-gray-300 leading-relaxed",
                    "landscape:lg:text-lg landscape:xl:text-xl",
                    "portrait:sm:text-base"
                )}>
                    <p>Explore, avalie e favorite seus jogos preferidos.</p>

                    <p>Uma plataforma feita para verdadeiros gamers.</p>
                </div>

                <div className="flex flex-col items-center md:items-start gap-2">
                    {user ? (
                        <Button
                            text="VER JOGOS"
                            aria-label="Entre agora e monte sua lista de favoritos!"
                            className={clsx(
                                "bg-gradient-to-r from-fuchsia-800 to-violet-700",
                                "hover:brightness-130 hover:scale-105 active:scale-95 transition-all cursor-pointer",
                                "text-white text-sm px-6 py-2 lg:text-xl lg:px-10 lg:py-3 rounded-xl",
                                "portrait:sm:text-md",
                                "font-medium shadow-md w-auto"
                            )}
                            handleClick={() => navigate("/games")}
                        />
                    ) : (
                        <Button
                            text="ENTRAR E VER JOGOS"
                            aria-label="Entre agora e monte sua lista de favoritos!"
                            className={clsx(
                                "bg-gradient-to-r from-fuchsia-800 to-violet-700",
                                "hover:brightness-130 hover:scale-105 active:scale-95 transition-all cursor-pointer",
                                "text-white text-sm px-6 py-2 lg:text-xl lg:px-10 lg:py-3 rounded-xl",
                                "portrait:sm:text-md",
                                "font-medium shadow-md w-auto"
                            )}
                            handleClick={() => navigate("/login")}
                        />

                    )}
                    <p className={clsx(
                        "text-gray-400 text-xs italic",
                        "portrait:sm:text-sm",
                        "landscape:lg:text-base"
                    )}>Crie uma conta ou faça o login para ter acesso aos jogos!</p>
                </div>
            </div>

            {/* Imagem + Carrossel (placeholder) */}
            <Carrossel items={gamesImgs} />

            {/* <div className="w-full max-w-md mx-auto sm:max-w-full">
                <Carousel items={gamesImgs} />
            </div> */}

        </section>
    )
}

export default Home