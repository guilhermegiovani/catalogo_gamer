import clsx from "clsx"
import { useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Star, PencilIcon, Trash2Icon, ThumbsUp, ThumbsDown } from "lucide-react"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import { dislikeReview, getGames, getReviewsAvgs, getReviewsByGame, likeReview, reactionsReviews } from "../services/routes"
import ReviewForm from "../components/ReviewForm"
import toast from "react-hot-toast"

function ReviewGame() {
    const { id } = useParams()
    const { games, setGames, reviewsData, setReviewsData, userId, handleEditReview, deleteRev, baseURL } = useAuth()
    const [avgGame, setAvgGame] = useState()
    const [isLoadingGame, setIsLoadingGame] = useState(true)
    const [reactions, setReactions] = useState({})

    // const [liked, setLiked] = useState(false)
    // const [likes, setLikes] = useState({})

    // const [disliked, setDisliked] = useState(false)
    // const [dislikes, setDislikes] = useState({})

    // const toggleLike = (id) => {
    //     setLikes(prev => ({
    //         ...prev,
    //         [id]: !prev[id]
    //     }))

    //     if (disliked[id]) {
    //         setDislikes(prev => ({
    //             ...prev,
    //             [id]: !prev[id]
    //         }))
    //     }


    //     // if (liked) {
    //     //     setLiked(false)
    //     //     setLike(l => l - 1)
    //     // } else {
    //     //     setLiked(true)
    //     //     setLike(l => l + 1)
    //     //     if (disliked) {
    //     //         setDisliked(false)
    //     //         setDislike(d => d - 1)
    //     //     }
    //     // }
    // }

    // const toggleDislike = (id) => {

    //     if (disliked) {
    //         setDisliked(false)
    //         setDislikes(d => d - 1)
    //     } else {
    //         setDisliked(true)
    //         setDislikes(d => d + 1)
    //         if (liked) {
    //             setLiked(false)
    //             setLikes(l => l - 1)
    //         }
    //     }
    // }

    const gameId = Number(id)

    const fetchReviews = async () => {
        if (!gameId) return
        try {
            const resGame = await getGames()
            setGames(resGame.data)
            const res = await getReviewsByGame(gameId)
           
            setReviewsData(res.data.reviews)
            console.log(res.data.reviews)

            const reactionsArray = await Promise.all(
                res.data.reviews.map((review) => {
                    console.log(review.id)
                    reactionsReviews(review.id)
                })
            )

            const reactionsData = {}
            res.data.reviews.forEach((review, index) => {
                reactionsData[review.id] = reactionsArray[index].data
            }) 
            setReactions(reactionsData)

            const resAvg = await getReviewsAvgs()
            const avg = resAvg.data.find(avg => avg.gameid === gameId)
            setAvgGame(avg)
            setIsLoadingGame(false)
        } catch (err) {
            console.log(`Erro ao pegar as avaliações do jogo: ${err}`)
            setReviewsData([])
            setAvgGame(null)
        }
    }

    const fetchLike = async (id) => {
        try {
            const res = await likeReview(id)
            const reaction = res.data.usersReactions

            setReactions(prev => ({
                ...prev,
                [id]: res.data
            }))

            console.log(reaction)
            console.log(res.data)
        } catch (err) {
            console.log(`Erro ao dar like na review: ${err}`)
        }
    }

    const fetchDisLike = async (id) => {
        try {
            const res = await dislikeReview(id)
            const reaction = res.data.usersReactions

            setReactions(prev => ({
                ...prev,
                [id]: res.data
            }))

            console.log(reaction)
            console.log(res.data)
        } catch (err) {
            console.log(`Erro ao dar dislike na review: ${err}`)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [id])

    if (isLoadingGame) {
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

                <h1 className="text-2xl xl:text-3xl font-bold">{game.title}</h1>
                {/* <p className="text-muted-foreground">{game.plataforma}</p> */}
                <div className="flex gap-2 flex-wrap text-xs xl:text-sm">
                    <span className="bg-green-500/10 text-green-400 px-2 py-0.5 rounded-2xl">{game.studio}</span>
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-2xl">{game.platform}</span>
                    <span className="bg-blue-500/10 text-blue-400 px-2 py-0.5 rounded-2xl">{game.genre}</span>
                </div>

                <p className="flex items-center gap-1 font-medium mb-3 xl:text-lg">
                    <Star size={20} fill="currentColor" className="text-yellow-400 -mt-[1px]" /> {avgGame?.rating}
                </p>

                <p className="text-sm xl:text-base text-muted-foreground">
                    {game.description}
                </p>

            </div>

            <div>
                <h2 className="text-xl xl:text-2xl font-semibold mb-5">Notas e avaliações</h2>

                <ul className="space-y-4">
                    {!reviewsData.length > 0 || !reviewsData ? <p>Nenhuma avaliação!</p> :
                        reviewsData.map((rev) => (
                            <li key={rev.id} className="max-w-5xl">
                                <article
                                    className={clsx(
                                        "w-full rounded-2xl p-4",
                                        "bg-white/5 backdrop-blur-sm shadow-sm",
                                        "transition-colors"
                                    )}
                                >
                                    <h3 className="text-lg xl:text-xl font-semibold mb-1 text-gray-200">{rev.name}</h3>

                                    <div className="flex items-center gap-3 text-sm xl:text-base mb-3 text-gray-200">
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

                                        <span className="text-muted-foreground xl:text-base">
                                            {rev.edit_date !== rev.review_date ? `editado em ${rev.edit_date}` : rev.review_date}
                                        </span>

                                    </div>

                                    <p className="text-md xl:text-lg text-muted-foreground text-gray-100">
                                        {rev.comment}
                                    </p>

                                    {Number(rev.iduser) === Number(userId) ?
                                        <div className="flex gap-3 mt-5">
                                            <Button
                                                text={<PencilIcon size={20} fill="currentColor" className="text-white/20 -mt-[1px] cursor-pointer hover:text-blue-500/30 transition duration-200" />}
                                                handleClick={() => handleEditReview(userId, rev.id)}
                                            />
                                            <Button
                                                text={<Trash2Icon size={20} fill="currentColor" className="text-white/20 -mt-[1px] cursor-pointer hover:text-red-500/30 transition duration-200" />}
                                                handleClick={() => deleteRev(rev.id)}
                                            />
                                        </div> : (
                                            <div className="flex gap-4 mt-5">
                                                <div className="flex gap-1">
                                                    <Button
                                                        text={<ThumbsUp
                                                            size={20} fill="currentColor"
                                                            className={clsx(
                                                                "text-white/20 -mt-[1px] cursor-pointer hover:text-blue-500/30 transition duration-200",
                                                                // liked ? "text-blue-500/30" : ""
                                                            )}
                                                        />}
                                                        handleClick={() => fetchLike(rev.id)}
                                                    />
                                                    <p>0</p>
                                                </div>

                                                <div className="flex gap-1">
                                                    <Button
                                                        text={<ThumbsDown
                                                            size={20} fill="currentColor"
                                                            className={clsx(
                                                                "text-white/20 -mt-[1px] cursor-pointer hover:text-red-500/30 transition duration-200",
                                                                // disliked ? "text-red-500/30" : ""
                                                            )}
                                                        />}
                                                        handleClick={() => fetchDisLike(rev.id)}
                                                    />
                                                    <p>0</p>
                                                </div>
                                            </div>
                                        )
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