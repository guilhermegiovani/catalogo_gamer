import clsx from "clsx"
import { useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Star, PencilIcon, Trash2Icon, ThumbsUp, ThumbsDown } from "lucide-react"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import { dislikeReview, getGames, getReviewsAvgs, getReviewsByGame, likeReview, reactionsCalcReviews, reactionsReviews } from "../services/routes"
import ReviewForm from "../components/ReviewForm"
import toast from "react-hot-toast"
import Modal from "../components/Modal"
// import toast from "react-hot-toast"

function ReviewGame() {
    const { id } = useParams()
    const { games, setGames, reviewsData, setReviewsData, userId, handleEditReview, deleteRev, baseURL } = useAuth()
    const [avgGame, setAvgGame] = useState()
    const [isLoadingGame, setIsLoadingGame] = useState(true)
    const [reactions, setReactions] = useState({})
    const [reactionUser, setReactionUser] = useState({})
    const [userReactions, setUserReactions] = useState({})
    // const [reviewsIds, setReviewsIds] = useState([])
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [revId, setRevId] = useState(0)
    const [revComment, setRevComment] = useState("")

    const gameId = Number(id)

    const fetchReviews = async () => {
        if (!gameId) return
        try {
            const resGame = await getGames()
            setGames(resGame.data)
            const res = await getReviewsByGame(gameId)

            setReviewsData(res.data.reviews)

            const idRev = res.data.reviews.find(rev => rev.iduser === userId)?.id ?? null
            setRevId(idRev)

            const commentRev = res.data.reviews.find(rev => rev.iduser === userId)?.comment ?? null
            setRevComment(commentRev)

            // setReviewsIds(res.data.reviews.map(r => r.id))

            const reactionsCalc = {}
            const reactionsData = {}

            for (let review of res.data.reviews) {
                const revCalc = await reactionsCalcReviews(review.id)
                reactionsCalc[review.id] = revCalc.data

                const rev = await reactionsReviews(review.id)
                reactionsData[review.id] = rev.data.infoReactions.filter(r => r.review_id === review.id)
            }

            const revId = res.data.reviews.map(r => r.id)
            revId.map((r) => {
                const userReact = reactionsData[r].find(userR => String(userR.user_id) === String(userId))?.reaction

                setUserReactions(prev => ({
                    ...prev,
                    [r]: userReact
                }))

            })

            setReactions(reactionsCalc)

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

            setReactionUser(res.data.usersReactions)

            setUserReactions(prev => ({
                ...prev,
                [id]: "like"
            }))

        } catch (err) {
            console.log(`Erro ao dar like na review: ${err}`)
        }
    }

    const fetchDisLike = async (id) => {
        try {
            const res = await dislikeReview(id)

            setReactionUser(res.data.usersReactions)
            setUserReactions(prev => ({
                ...prev,
                [id]: "dislike"
            }))

        } catch (err) {
            console.log(`Erro ao dar dislike na review: ${err}`)
        }
    }

    useEffect(() => {
        fetchReviews()
    }, [id])

    useEffect(() => {
        const getReactions = async () => {
            const reactionsData = {}
            for (let review of reviewsData) {
                const r = await reactionsCalcReviews(review.id)
                reactionsData[review.id] = r.data
            }

            setReactions(reactionsData)
        }

        getReactions()

    }, [reactionUser]) // reactionUser

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

        <section className="space-y-10 flex flex-col justify-center lg:block">

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
                <h2 className=" text-xl xl:text-2xl font-semibold mb-5">Notas e avaliações</h2>

                <ul className="space-y-4">
                    {!reviewsData.length > 0 || !reviewsData ? <p>Nenhuma avaliação!</p> :
                        reviewsData.map((rev) => (
                            <li key={rev.id} className="lg:max-w-5xl">
                                <article
                                    className={clsx(
                                        "w-full rounded-2xl p-4",
                                        "bg-white/5 backdrop-blur-sm shadow-sm",
                                        "transition-colors"
                                    )}
                                >
                                    {rev.nickname !== "" ? (
                                        <h3 className="text-lg xl:text-xl font-semibold mb-1 text-gray-200">{rev.nickname}</h3>
                                    ) : (
                                        <h3 className="text-lg xl:text-xl font-semibold mb-1 text-gray-200">{rev.name}</h3>
                                    )
                                    }

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

                                    <div className="flex justify-between">
                                        <div className="flex gap-4 mt-5">
                                            <div className="flex gap-1">
                                                <Button
                                                    text={<ThumbsUp
                                                        size={20}
                                                        fill="currentColor"
                                                        className={clsx(
                                                            "-mt-[1px] cursor-pointer  transition duration-200",
                                                            userReactions[rev.id] === "like" ? "text-blue-500/50" : "text-white/20 hover:text-blue-500/30"
                                                        )}
                                                    />}
                                                    handleClick={() => fetchLike(rev.id)}
                                                />
                                                {/* {reactions[rev.id].likesReview !== undefined
                                                    ? <p>{reactions[rev.id].likesReview}</p>
                                                    : ""
                                                } */}
                                                <p>{reactions[rev.id]?.likesReview ?? 0}</p>

                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    text={<ThumbsDown
                                                        size={20}
                                                        fill="currentColor"
                                                        className={clsx(
                                                            "-mt-[1px] cursor-pointer transition duration-200",
                                                            userReactions[rev.id] === "dislike" ? "text-red-500/50" : "text-white/20 hover:text-red-500/30"
                                                        )}
                                                    />}
                                                    handleClick={() => fetchDisLike(rev.id)}
                                                />
                                                {/* {reactions[rev.id].dislikesReview !== undefined
                                                    ? <p>{reactions[rev.id].dislikesReview}</p>
                                                    : ""
                                                } */}
                                                <p>{reactions[rev.id]?.dislikesReview ?? 0}</p>
                                            </div>
                                        </div>

                                        {Number(rev.iduser) === Number(userId) ?
                                            <div className="flex gap-3 mt-5">
                                                <Button
                                                    text={<PencilIcon
                                                        size={20}
                                                        fill="currentColor"
                                                        className="text-white/20 -mt-[1px] cursor-pointer hover:text-blue-500/30 transition duration-200"
                                                    />}
                                                    handleClick={() => handleEditReview(userId, rev.id)}
                                                />
                                                <Button
                                                    text={<Trash2Icon
                                                        size={20}
                                                        fill="currentColor"
                                                        className="text-white/20 -mt-[1px] cursor-pointer hover:text-red-500/30 transition duration-200"
                                                    />}
                                                    handleClick={() => setIsDeleteModalOpen(true)}
                                                />
                                            </div> : ""
                                        }
                                    </div>
                                </article>
                            </li>
                        ))}
                </ul>
            </div>

            <Modal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={async () => {
                    try {
                        deleteRev(revId)
                        toast.sucess("Avaliação deletada!");
                    } catch (err) {
                        console.log(`Erro ao deletar avaliação: ${err}`);
                        toast.error("Erro ao deletar avaliação!");
                    } finally {
                        setIsDeleteModalOpen(false);
                    }
                }}
                title="Excluir Avaliação"
                message={`Tem certeza que deseja excluir sua avaliação "${revComment}"? Essa ação não pode ser desfeita.`}
            />

            <ReviewForm refreshReviews={() => fetchReviews()} />

        </section>
    )
}

export default ReviewGame