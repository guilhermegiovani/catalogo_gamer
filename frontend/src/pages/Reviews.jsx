import clsx from "clsx";
import { Star } from "lucide-react"
import Button from "../components/Button"
import { useAuth } from "../hooks/useAuth"
import { Link } from "react-router-dom";

function Reviews() {

    const { games } = useAuth()

    return (
        <section className="space-y-6">
            <h1 className="w-full flex justify-center text-2xl font-bold">Jogos Avaliados</h1>

            {/* <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                    <li key={game.id}>
                        <article
                            className={clsx(
                                "rounded-2xl p-4 h-full",
                                "bg-white/5 backdrop-blur-sm shadow-md",
                                "border border-zinc-700",
                                "flex flex-col justify-between"
                            )}
                        >
                            <div className="space-y-1">
                                <h2 className="text-lg font-semibold text-gray-100">{game.titulo}</h2>
                                <p className="text-sm text-muted-foreground">{game.plataforma}</p>

                                <p className="flex items-center gap-1 text-sm font-medium mt-2 text-gray-200">
                                    <Star size={18} fill="currentColor" className="text-yellow-400 -mt-[1px]" /> 4.5
                                </p>
                            </div>

                            <Button
                                text="Ver avaliações"
                                className={clsx(
                                    "mt-4 text-sm font-medium text-white py-2 rounded-md",
                                    "bg-gradient-to-r from-purple-700 to-purple-900",
                                    "hover:brightness-110 transition cursor-pointer"
                                )}
                            />
                        </article>
                    </li>
                ))}
            </ul> */}

            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {games.map((game) => (
                    <li key={game.id}>
                        <Link>
                            <article
                                className={clsx(
                                    "rounded-2xl p-4 h-full",
                                    "bg-white/5 backdrop-blur-sm shadow-md",
                                    "border border-zinc-700",
                                    "flex flex-col justify-between",
                                    "transition hover:scale-[1.02] hover:border-white/20"
                                )}
                            >
                                <div className="space-y-2 mb-1">
                                    <h2 className="text-lg font-semibold text-gray-100">{game.titulo}</h2>
                                    <div className="flex flex-wrap gap-2">
                                        <span
                                            className={clsx(
                                                "bg-purple-500/10 text-purple-400 text-xs px-2 py-0.5 rounded-full"
                                            )}
                                        >
                                            {game.plataforma}
                                        </span>
                                        <span
                                            className={clsx(
                                                "bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-full"
                                            )}
                                        >
                                            {game.genero}
                                        </span>
                                    </div>
                                    <p className="flex items-center gap-1 text-sm font-medium mt-2 text-gray-200">
                                        <Star size={18} fill="currentColor" className="text-yellow-400 -mt-[1px]" /> 4.5
                                    </p>
                                </div>

                                <p className=" w-full flex justify-center text-xs text-muted-foreground mt-3">Clique para ver mais detalhes e avaliações</p>

                                {/* <Button
                                    text="Ver avaliações"
                                    className={clsx(
                                        "mt-4 text-sm font-medium text-white py-2 rounded-md",
                                        "bg-gradient-to-r from-purple-700 to-purple-900",
                                        "hover:brightness-110 transition"
                                    )}
                                /> */}
                            </article>
                        </Link>
                    </li>
                ))}
            </ul>

        </section>
    )

}

export default Reviews