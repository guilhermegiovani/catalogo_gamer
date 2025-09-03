import clsx from "clsx"
import Form from "./Form"
import Input from "./Input"
import Button from "./Button"
import { useEffect } from "react"
import { useAuth } from "../hooks/useAuth"
import { useParams } from "react-router-dom"
// import { useState } from "react"
// import { patchGames } from "../services/routes"


function EditAdminGame({ form }) {
    const { id } = useParams()
    const { isLoading, gamesAdmin, fetchGame } = useAuth()
    const {
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
    } = form

    // const [isEditingGame, setIsEditingGame] = useState(false)
    // const navigate = useNavigate()

    // const [fileImgGame, setFileImgGame] = useState(null)
    // const [previewImg, setPreviewImg] = useState(null)

    // const [fileImgGamePaisagem, setFileImgGamePaisagem] = useState(null)
    // const [previewImgPaisagem, setPreviewImgPaisagem] = useState(null)

    // const [titleGame, setTitleGame] = useState("")
    // const [descriptionGame, setDescriptionGame] = useState("")
    // const [genderGame, setGenderGame] = useState("")
    // const [platformGame, setPlatformGame] = useState("")
    // const [studioGame, setStudioGame] = useState("")

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

    if (!isLoading && !game) {
        // console.log("Jogo não encontrada.")
        return <p>Jogo não encontrado</p>
    }

    const handleChangeImg = (e) => {
        const selected = e.target.files[0]
        if (selected) {
            setFileImgGame(selected)
            setPreviewImg(URL.createObjectURL(selected))
        }
    }

    const handleChangeImgPaisagem = (e) => {
        const selected = e.target.files[0]
        if (selected) {
            setFileImgGamePaisagem(selected)
            setPreviewImgPaisagem(URL.createObjectURL(selected))
        }
    }

    return (
        <Form
            // handleSubmit={(e) => {
            //     e.preventDefault()

            //     setIsEditingGame(false)
            //     handleSubmitEditGame(game.id, gameData)
            // }}
            className={clsx(
                "bg-[#1e1b38]",
                "rounded-2xl shadow-lg p-8 w-full max-w-xl space-y-4",
                "border border-[#4f46e5]/20",
                "my-5"
            )}
            enctype="multipart/form-data"
        >
            <h2 className="text-xl font-semibold text-center mb-10 text-white drop-shadow">Editar Jogo</h2>

            <Input
                textLabel="Título:"
                type="text"
                id="titulo"
                name="titulo"
                value={titleGame}
                handleChange={(e) => setTitleGame(e.target.value)}
                classNameInput={clsx(
                    "px-4 py-2 rounded-md",
                    "bg-[#2a264f] text-white placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                    "transition-all duration-200"
                )}
                placeholder="Título do jogo..."
            />

            <label htmlFor="descricao" className="block mb-1 text-lg font-medium text-gray-200">Descrição:</label>
            <textarea
                name="descricao"
                id="descricao"
                value={descriptionGame}
                onChange={(e) => setDescriptionGame(e.target.value)}
                rows={4}
                className={clsx(
                    "w-full rounded-md text-while placeholder-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                    "p-2 text-sm resize-none",
                    "bg-[#2a264f]"
                )}
                placeholder="Descrição do jogo..."
            ></textarea>

            <Input
                textLabel="Gênero:"
                type="text"
                id="genero"
                name="genero"
                value={genderGame}
                handleChange={(e) => setGenderGame(e.target.value)}
                classNameInput={clsx(
                    "px-4 py-2 rounded-md",
                    "bg-[#2a264f] text-white placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                    "transition-all duration-200"
                )}
                placeholder="Gênero do jogo..."
            />

            <Input
                textLabel="Plataforma:"
                type="text"
                id="plataforma"
                name="plataforma"
                value={platformGame}
                handleChange={(e) => setPlatformGame(e.target.value)}
                classNameInput={clsx(
                    "px-4 py-2 rounded-md",
                    "bg-[#2a264f] text-white placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                    "transition-all duration-200"
                )}
                placeholder="Plataforma do jogo..."
            />

            <Input
                textLabel="Estúdio:"
                type="text"
                id="estudio"
                name="estudio"
                value={studioGame}
                handleChange={(e) => setStudioGame(e.target.value)}
                classNameInput={clsx(
                    "px-4 py-2 rounded-md",
                    "bg-[#2a264f] text-white placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                    "transition-all duration-200"
                )}
                placeholder="Estúdio do jogo..."
            />

            <Input
                textLabel="Imagem do jogo (retrato):"
                classNameLabel={clsx(
                    "w-full px-4 py-2 rounded-md bg-[#2a264f] text-white text-center cursor-pointer",
                    "hover:bg-[#3a3360] transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
                )}
                type="file"
                id="img-retrato"
                name="img-retrato"
                classNameInput={"hidden"}
                handleChange={(e) => handleChangeImg(e)}
            />

            {previewImg && (
                <div>
                    <img src={previewImg}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-md mt-4 border border-[#4f46e5]/20"
                    />

                    <Button
                        text="Remover imagem"
                        className={clsx(
                            " w-40 text-white font-semibold py-2 rounded-md mt-4",
                            "bg-red-700/90",
                            "hover:brightness-130 transition-all duration-200",
                            "cursor-pointer"
                        )}
                        handleClick={() => {
                            console.log(fileImgGame)
                            URL.revokeObjectURL(previewImg)
                            setPreviewImg(null)
                            setFileImgGame(null)
                        }}
                    />
                </div>
            )}

            <Input
                textLabel="Imagem do jogo (paisagem):"
                classNameLabel={clsx(
                    "w-full px-4 py-2 rounded-md bg-[#2a264f] text-white text-center cursor-pointer",
                    "hover:bg-[#3a3360] transition-all duration-200",
                    "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
                )}
                type="file"
                id="img-paisagem"
                name="img-paisagem"
                classNameInput={"hidden"}
                handleChange={(e) => handleChangeImgPaisagem(e)}
            />


            {previewImgPaisagem && (
                <div>
                    <img src={previewImgPaisagem}
                        alt="Preview"
                        className="w-full h-64 object-contain rounded-md mt-4 border border-[#4f46e5]/20"
                    />

                    <Button
                        text="Remover imagem"
                        className={clsx(
                            " w-40 text-white font-semibold py-2 rounded-md mt-4",
                            "bg-red-700/90",
                            "hover:brightness-130 transition-all duration-200",
                            "cursor-pointer"
                        )}
                        handleClick={() => {
                            console.log(fileImgGamePaisagem)
                            URL.revokeObjectURL(previewImgPaisagem)
                            setPreviewImgPaisagem(null)
                            setFileImgGamePaisagem(null)
                        }}
                    />
                </div>
            )}

        </Form>
    )
}

export default EditAdminGame