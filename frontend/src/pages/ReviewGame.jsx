import clsx from "clsx"
import { useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Star, PencilIcon, Trash2Icon } from "lucide-react"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import { getGames, getReviewsByGame } from "../services/routes"
import ReviewForm from "../components/ReviewForm"
import toast from "react-hot-toast"

function ReviewGame() {
    const { id } = useParams()
    const { games, setGames, averages, reviewsData, setReviewsData, userId, handleEditReview, deleteRev, baseURL, isLoading, setIsLoading } = useAuth()
    const [avgGame, setAvgGame] = useState()

    // const game = games.find((g) => g.id === Number(id))
    const gameId = Number(id)
    // const gameId = game?.id

    const fetchReviews = async () => {
        try {
            const res = await getReviewsByGame(game.id)
            setReviewsData(res.data.reviews)
            // console.log(res.data.reviews)
            // console.log(userId)

            const avg = averages.filter(avg => avg.gameId === game.id)
            // console.log(avg)
            setAvgGame(avg[0])
        } catch (err) {
            console.log(`Erro ao pegar as avaliações do jogo: ${err}`)
            setReviewsData([])
            setAvgGame(null)
        }
    }

    useEffect(() => {
        // let mounded = true

        // const init = async () => {
        //     setIsLoading(true)

        //     try {
        //         let localGames = games
        //         if (!localGames || localGames.length === 0) {
        //             const res = await getGames()
        //             localGames = res.data

        //             if (mounded) setGames(localGames)
        //         }

        //         const found = localGames.fing(g => g.id === gameId)
        //         if (!found) {
        //             if (mounded) {
        //                 setIsLoading(false)
        //                 setReviewsData([])
        //                 setAvgGame(null)
        //             }

        //             return
        //         }

        //         await fetchReviews(found.id)
        //     } catch (err) {
        //         console.log(`Erro ao inicializar review: ${err}`)
        //     } finally {
        //         if (mounded) setIsLoading(false)
        //     }
        // }

        // init()
        // return () => { mounded = false }
        // setReviewsData([])
        // setAvgGame([])
        const init = async() => {
            await fetchReviews(id)

        }
        init()
    }, [id])

    // const deleteRev = async (revId) => {
    //     try {
    //         await deleteReviews(revId)
    //         setReviewsData(prev => prev.filter(r => r.id !== revId))
    //         console.log("Deletado com sucesso!")
    //     } catch (err) {
    //         console.log(`Erro ao deletar avaliação: ${err}`)
    //     }
    // }

    // const handleEditReview = (rat, comment) => {}

    // if (games.length === 0) {
    //     return <p className="text-white">Carregando...</p>
    // }

    if (isLoading) {
        return (
            <section className="w-full flex justify-center items-start min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </section>
        )
    }

    const game = games.find((g) => g.id === gameId)

    if (!game) return <p className="text-white">Jogo não encontrado.</p>

    return (

        <section className="space-y-10">

            <div className="space-y-2">
                <img
                    src={baseURL + game.img_landscape}
                    alt={game.title}
                    className="max-w-xl h-64 md:h-80 lg:h-96 object-contain rounded-xl border border-[#4f46e5]/30 shadow-md"
                />

                <h1 className="text-2xl font-bold">{game.title}</h1>
                {/* <p className="text-muted-foreground">{game.plataforma}</p> */}
                <div className="flex gap-2 flex-wrap">
                    <span className="bg-green-500/10 text-green-400 text-xs px-2 py-0.5 rounded-2xl">{game.studio}</span>
                    <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-0.5 rounded-2xl">{game.platform}</span>
                    <span className="bg-blue-500/10 text-blue-400 text-xs px-2 py-0.5 rounded-2xl">{game.genre}</span>
                </div>

                <p className="flex items-center gap-1 font-medium mb-3">
                    <Star size={20} fill="currentColor" className="text-yellow-400 -mt-[1px]" /> {avgGame?.rating}
                </p>

                <p className="text-sm text-muted-foreground">
                    {game.description}
                </p>

            </div>

            <div>
                <h2 className="text-xl font-semibold mb-5">Notas e avaliações</h2>

                <ul className="space-y-4">
                    {!reviewsData.length > 0 ? <p>Nenhuma avaliação!</p> :
                        reviewsData.map((rev) => (
                            <li key={rev.id}>
                                <article
                                    className={clsx(
                                        "w-full rounded-2xl p-4",
                                        "bg-white/5 backdrop-blur-sm shadow-sm",
                                        "transition-colors"
                                    )}
                                >
                                    <h3 className="text-lg font-semibold mb-1 text-gray-200">{rev.name}</h3>

                                    <div className="flex items-center gap-3 text-sm mb-3 text-gray-200">
                                        <span className="flex items-center gap-1">
                                            <Star size={18} fill="currentColor" className="text-yellow-400 -mt-[1px]" /> {rev.rating}
                                        </span>

                                        {/* {revEdit !== true ? (
                                            <span className="text-muted-foreground">
                                                {rev.data_avaliacao}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground">
                                                editado {rev.data_edicao}
                                            </span>
                                        )} */}

                                        <span className="text-muted-foreground">
                                            {rev.edit_date !== rev.review_date ? `editado em ${rev.edit_date}` : rev.review_date}
                                        </span>

                                    </div>

                                    <p className="text-md text-muted-foreground text-gray-100">
                                        {rev.comment}
                                    </p>

                                    {rev.idUser === userId ?
                                        <div className="flex gap-3 mt-5">
                                            <Button
                                                text={<PencilIcon size={20} fill="currentColor" className="text-white/20 -mt-[1px] cursor-pointer hover:text-blue-500/30 transition duration-200" />}
                                                handleClick={() => handleEditReview(userId, rev.id)}
                                            />
                                            <Button
                                                text={<Trash2Icon size={20} fill="currentColor" className="text-white/20 -mt-[1px] cursor-pointer hover:text-red-500/30 transition duration-200" />}
                                                handleClick={() => deleteRev(rev.id)}
                                            />
                                        </div> : ""
                                    }
                                </article>
                            </li>
                        ))}
                </ul>
            </div>

            <ReviewForm refreshReviews={() => fetchReviews()} />

            {/* <form
                className="space-y-4"
                onSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitReview()
                }}
            >

                <label htmlFor="nota" className="block mb-1 text-lg font-medium text-gray-200">Nota:</label>
                <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map((index) => {
                        // const filled = ratingHover !== null ? index <= ratingHover : index <= rating

                        return (
                            <Star
                                size={18} fill="currentColor"
                                key={index}
                                onMouseEnter={() => setRatingHover(index)}
                                onMouseLeave={() => setRatingHover(null)}
                                onClick={() => setRating(index)}
                                className={clsx(
                                    "cursor-pointer transition-transform duration-150",
                                    "-mt-[1px]",
                                    ratingHover !== null
                                        ? index <= ratingHover
                                            ? "text-yellow-400 opacity-50"
                                            : "text-white/30 fill-transparent"
                                        : index <= rating
                                            ? "text-yellow-400"
                                            : "text-white/30 fill-transparent"
                                )}
                            />
                        )
                    })}
                </div>
                <input
                    type="hidden"
                    name="rating"
                    value={rating}
                />

                <label htmlFor="comment" className="block mb-1 text-lg font-medium text-gray-200">Comentário:</label>
                <textarea
                    name="comment"
                    id="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={4}
                    className={clsx(
                        "w-full rounded-md text-gray-100 placeholder-gray-300",
                        "border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-gray-600",
                        "p-2 text-sm resize-none",
                        "bg-white/5 backdrop-blur-sm shadow-sm"
                    )}
                    placeholder="Escreva seu comentário aqui..."
                ></textarea>

                <Button text="Enviar comentário" className={clsx(
                    " w-50 text-white font-semibold py-2 rounded-md mt-4",
                    "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                    "hover:brightness-130 transition-all duration-200",
                    "cursor-pointer"
                )} />

            </form> */}
        </section>
    )
}

export default ReviewGame