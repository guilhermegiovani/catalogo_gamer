import clsx from "clsx"
import { useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Star, PencilIcon, Trash2Icon } from "lucide-react"
import Button from "../components/Button"
import { useEffect, useState } from "react"
import { patchReviews, postReviews } from "../services/routes"
import Form from "./Form"
import Input from "./Input"
import toast from "react-hot-toast"

function ReviewForm({ refreshReviews }) {
    const { id } = useParams()
    const { games, setReviews, isEditing, setIsEditing, rating, setRating, comment, setComment, reviewId, setReviewId } = useAuth()
    const [ratingHover, setRatingHover] = useState(null)

    const game = games.find((g) => g.id === Number(id))

    useEffect(() => {
        setComment("")
        setRating(0)
        setReviewId(0)
    }, [])

    const handleSubmitReview = async () => {
        const reviewData = {
            gameId: game.id,
            note: rating,
            comment: comment
        }

        try {
            const res = await postReviews(reviewData)
            const newReview = res.data

            setReviews(prev => [...prev, {
                id: newReview.id,
                nota: newReview.note,
                comentario: newReview.comment,
                nome: newReview.userName,
                date: newReview.data_avaliacao
            }])

            // setCommentOriginal(newReview.comment)
            // console.log(newReview)
            setRating(0)
            setComment("")
            refreshReviews()
        } catch (err) {
            console.log(`Erro ao avaliar o jogo: ${err}`)
        }
    }



    const handleSubmitEditReview = async () => {
        const reviewData = {
            gameId: game.id,
            rating: rating,
            comment: comment
        }

        try {
            const res = await patchReviews(reviewId, reviewData)
            const newReview = res.data
            // console.log(newReview)

            setReviews(prev => prev.map(r =>
                r.id === newReview.id ? {
                    ...r,
                    grade: newReview.rating,
                    comment: newReview.comment,
                    date: newReview.edit_date
                } : r
            ))

            // console.log(res.data)
            // setCommentEdit(newReview.comment)
            setRating(0)
            setComment("")
            setIsEditing(false)
            refreshReviews()
        } catch (err) {
            console.log(`Erro ao avaliar o jogo: ${err}`)
        }
    }

    return (

        <Form
        handleSubmit={(e) => {
            e.preventDefault()
            if (isEditing === true) {
                handleSubmitEditReview()
                toast.success("Avaliação editada com sucesso!")
            } else {
                handleSubmitReview()
                toast.success("Avaliação postada com sucesso!")
            }

        }}
        className={"space-y-2"}
        >
            <label htmlFor="nota" className="block mb-1 text-lg xl:text-xl font-medium text-gray-200">Nota:</label>
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((index) => {

                    return (
                        <Star
                            size={20} fill="currentColor"
                            key={index}
                            onMouseEnter={() => setRatingHover(index)}
                            onMouseLeave={() => setRatingHover(null)}
                            onClick={() => setRating(index)}
                            className={clsx(
                                "cursor-pointer transition-transform duration-150",
                                "-mt-[1px]",
                                ratingHover !== null ? index <= ratingHover ? "text-yellow-400 opacity-50" : "text-white/30 fill-transparent" : index <= rating ? "text-yellow-400" : "text-white/30 fill-transparent"
                            )}
                        />
                    )
                })}
            </div>
            <Input
                type="hidden"
                name="rating"
                id="rating"
                value={rating}
            />

            <label htmlFor="comment" className="block mb-1 text-lg xl:text-xl font-medium text-gray-200">Comentário:</label>
            <textarea
                name="comment"
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className={clsx(
                    "w-full rounded-md text-gray-100 placeholder-gray-300",
                    "border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-gray-600",
                    "p-2 text-sm xl:text-base resize-none",
                    "bg-white/5 backdrop-blur-sm shadow-sm"
                )}
                placeholder="Escreva seu comentário aqui..."
            ></textarea>

            <Button
                text="Enviar comentário"
                className={clsx(
                    "w-50 text-white font-semibold py-2 rounded-md mt-4",
                    "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                    "hover:brightness-130 transition-all duration-200",
                    "cursor-pointer xl:text-lg"
                )} />
        </Form>

    )
}

export default ReviewForm

// <form
//     className="space-y-4"
//     onSubmit={(e) => {
//         e.preventDefault()
//         if (isEditing === true) {
//             handleSubmitEditReview()
//         } else {
//             handleSubmitReview()
//         }

//     }}
// >

//     <label htmlFor="nota" className="block mb-1 text-lg font-medium text-gray-200">Nota:</label>
//     <div className="flex gap-1">
//         {[1, 2, 3, 4, 5].map((index) => {

//             return (
//                 <Star
//                     size={18} fill="currentColor"
//                     key={index}
//                     onMouseEnter={() => setRatingHover(index)}
//                     onMouseLeave={() => setRatingHover(null)}
//                     onClick={() => setRating(index)}
//                     className={clsx(
//                         "cursor-pointer transition-transform duration-150",
//                         "-mt-[1px]",
//                         ratingHover !== null ? index <= ratingHover ? "text-yellow-400 opacity-50" : "text-white/30 fill-transparent" : index <= rating ? "text-yellow-400" : "text-white/30 fill-transparent"
//                     )}
//                 />
//             )
//         })}
//     </div>
//     <input
//         type="hidden"
//         name="rating"
//         value={rating}
//     />

// <label htmlFor="comment" className="block mb-1 text-lg font-medium text-gray-200">Comentário:</label>
// <textarea
//     name="comment"
//     id="comment"
//     value={comment}
//     onChange={(e) => setComment(e.target.value)}
//     rows={4}
//     className={clsx(
//         "w-full rounded-md text-gray-100 placeholder-gray-300",
//         "border border-zinc-700 focus:outline-none focus:ring-2 focus:ring-gray-600",
//         "p-2 text-sm resize-none",
//         "bg-white/5 backdrop-blur-sm shadow-sm"
//     )}
//     placeholder="Escreva seu comentário aqui..."
// ></textarea>

//     <Button
//         text="Enviar comentário"
//         className={clsx(
//             " w-50 text-white font-semibold py-2 rounded-md mt-4",
//             "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
//             "hover:brightness-130 transition-all duration-200",
//             "cursor-pointer"
//         )} />

// </form>