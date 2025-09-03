import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import { Star } from "lucide-react"
import { useEffect, useState } from "react"
import { deleteGame, patchGames } from "../services/routes"
import Button from "../components/Button"
import clsx from "clsx"
import toast from "react-hot-toast"
import Form from "../components/Form"
import Input from "../components/Input"
import EditAdminGame from "../components/EditAdminGame"

function AdminGame() {
    const { id } = useParams()
    const { isLoading, gamesAdmin, fetchGame, averages } = useAuth()
    const [isEditingGame, setIsEditingGame] = useState(false)
    const navigate = useNavigate()

    const [fileImgGame, setFileImgGame] = useState(null)
    const [previewImg, setPreviewImg] = useState(null)

    const [fileImgGamePaisagem, setFileImgGamePaisagem] = useState(null)
    const [previewImgPaisagem, setPreviewImgPaisagem] = useState(null)

    const [titleGame, setTitleGame] = useState("")
    const [descriptionGame, setDescriptionGame] = useState("")
    const [genderGame, setGenderGame] = useState("")
    const [platformGame, setPlatformGame] = useState("")
    const [studioGame, setStudioGame] = useState("")

    useEffect(() => {
        // async function getGame() {
        //     try {
        //         const res = await getGames()
        //         setGamesAdmin(res.data)

        //         const resAvg = await getReviewsAvgs()
        //         setAvgGamesAdmin(resAvg.data)
        //     } catch (err) {
        //         console.log(`Erro ao pegar os jogos: ${err}`)
        //     }
        // }

        // getGame()
        fetchGame()
    }, [])

    useEffect(() => {
        return () => {
            if (previewImg) URL.revokeObjectURL(previewImg)
            if (previewImgPaisagem) URL.revokeObjectURL(previewImgPaisagem)
        }
    }, [previewImg, previewImgPaisagem])

    if (!gamesAdmin.length) return <p>Carregando...</p>;

    const game = gamesAdmin.find(game => game.id === Number(id))

    const avgGame = averages.filter(avg => avg.gameId === Number(id))

    if (!isLoading && !game) {
        // console.log("Jogo não encontrada.")
        return <p>Jogo não encontrado</p>
    }

    // const handleChangeImg = (e) => {
    //     const selected = e.target.files[0]
    //     if (selected) {
    //         setFileImgGame(selected)
    //         setPreviewImg(URL.createObjectURL(selected))
    //     }
    // }

    // const handleChangeImgPaisagem = (e) => {
    //     const selected = e.target.files[0]
    //     if (selected) {
    //         setFileImgGamePaisagem(selected)
    //         setPreviewImgPaisagem(URL.createObjectURL(selected))
    //     }
    // }

    const handleSubmitEditGame = async (id) => {
        try {
            const formData = new FormData()
            formData.append("titulo", titleGame)
            formData.append("descricao", descriptionGame)
            formData.append("genero", genderGame)
            formData.append("plataforma", platformGame)
            formData.append("estudio", studioGame)

            if (fileImgGame instanceof File) {
                formData.append("img-retrato", fileImgGame)
                console.log(fileImgGame)
            }

            if (fileImgGamePaisagem instanceof File) {
                formData.append("img-paisagem", fileImgGamePaisagem)
                console.log(fileImgGamePaisagem)
            }

            await patchGames(id, formData)
        } catch (err) {
            console.log(`Erro ao editar jogo: ${err}.`)
        }

    }

    // console.log(game.imagem_paisagem)
    // console.log(game.imagem_url)
    // console.log(game)

    return (
        <section className="space-y-5 min-h-screen mt-5 sm:mt-0">

            <div className={clsx(
                "space-y-2"
                )}>
                <div className="w-full flex flex justify-center sm:justify-start">
                    <img
                        src={`http://localhost:8000${game.imagem_paisagem}`}
                        alt={game.titleGame}
                        className={clsx(
                            "max-w-xl h-58 md:h-80 lg:h-96 rounded-xl border border-[#4f46e5]/30 shadow-md",
                            "portrait:sm:h-64"
                        )}
                    />
                </div>

                <h1 className="text-xl sm:text-2xl font-bold">{game.titulo}</h1>
                {/* <p className="text-muted-foreground">{game.plataforma}</p> */}
                <div className="flex gap-2 flex-wrap">
                    <span className="bg-green-500/10 text-green-400 text-center text-xs sm:text-sm px-2 py-0.5 rounded-full">{game.estudio}</span>
                    <span className="bg-purple-500/10 text-purple-400 text-center text-xs sm:text-sm px-2 py-0.5 rounded-full">{game.plataforma}</span>
                    <span className="bg-blue-500/10 text-blue-400 text-center text-xs sm:text-sm px-2 py-0.5 rounded-full">{game.genero}</span>
                </div>

                <p className="flex items-center gap-1 font-medium mb-3">
                    <Star size={20} fill="currentColor" className="text-yellow-400 -mt-[1px]" /> {avgGame[0]?.nota}
                </p>

                <p className="text-sm text-muted-foreground">
                    {game.descricao}
                </p>

            </div>

            {
                isEditingGame === true ? (
                    <EditAdminGame
                        form={{
                            fileImgGame,
                            setFileImgGame,
                            previewImg,
                            setPreviewImg,
                            fileImgGamePaisagem,
                            setFileImgGamePaisagem,
                            previewImgPaisagem,
                            setPreviewImgPaisagem,
                            titleGame,
                            setTitleGame,
                            descriptionGame,
                            setDescriptionGame,
                            genderGame,
                            setGenderGame,
                            platformGame,
                            setPlatformGame,
                            studioGame,
                            setStudioGame
                        }}
                    />

                ) : ""
            }

            <div className="flex justify-center sm:justify-start gap-5">
                <Button
                    text={isEditingGame === true ? "Concluir edição" : "Editar jogo"}
                    className={clsx(
                        " w-40 text-white font-semibold py-2 rounded-md mt-4",
                        "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                        "hover:brightness-130 transition-all duration-200",
                        "cursor-pointer"
                    )}
                    handleClick={(e) => {
                        e.preventDefault()

                        if (isEditingGame === false) {
                            setIsEditingGame(true)
                            setTitleGame(game.titulo)
                            setDescriptionGame(game.descricao)
                            setGenderGame(game.genero)
                            setPlatformGame(game.plataforma)
                            setStudioGame(game.estudio)
                            setFileImgGame(game.imagem_url)
                            setPreviewImg(`http://localhost:8000${game.imagem_url}`)
                            setFileImgGamePaisagem(game.imagem_paisagem)
                            setPreviewImgPaisagem(`http://localhost:8000${game.imagem_paisagem}`)
                        } else {
                            handleSubmitEditGame(game.id).then(() => {
                                fetchGame()
                                toast.success("Jogo editado com sucesso!")
                            }).catch((err) => {
                                toast.error("Erro ao editar jogo!")
                                console.log(err)
                            })

                            setIsEditingGame(false)
                        }
                    }}
                />

                <Button
                    text={isEditingGame === true ? "Cancelar edição" : "Deletar jogo"}
                    className={clsx(
                        " w-40 text-white font-semibold py-2 rounded-md mt-4",
                        // "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                        "bg-red-700/90",
                        "hover:brightness-130 transition-all duration-200",
                        "cursor-pointer"
                    )}
                    handleClick={async () => {
                        if (isEditingGame === true) {
                            setIsEditingGame(false)
                        } else {
                            await deleteGame(game.id).then(() => {
                                toast.success("Jogo deletado com sucesso!")
                                navigate("/admin")
                            }).catch((err) => {
                                console.log(`Erro ao deletar jogo: ${err}`)
                            })
                        }

                    }}
                />
            </div>
        </section>
    )
}

export default AdminGame