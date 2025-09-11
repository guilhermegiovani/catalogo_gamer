import clsx from "clsx"
import Button from "../components/Button"
import { useNavigate } from "react-router-dom"
import { useState } from "react"
import Input from "../components/Input"
import Form from "../components/Form"
import { useEffect } from "react"
import { postGames } from "../services/routes"
import { useAuth } from "../hooks/useAuth"


function AdminNewGame() {
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
    const { fetchGame } = useAuth()

    useEffect(() => {
        return () => {
            if (previewImg) URL.revokeObjectURL(previewImg)
            if (previewImgPaisagem) URL.revokeObjectURL(previewImgPaisagem)
        }
    }, [previewImg, previewImgPaisagem])

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

    const handleSubmitNewGame = async () => {
        try {
            const formData = new FormData()
            formData.append("title", titleGame)
            formData.append("description", descriptionGame)
            formData.append("genre", genderGame)
            formData.append("platform", platformGame)
            formData.append("studio", studioGame)

            if (fileImgGame instanceof File) {
                formData.append("img-retrato", fileImgGame)
            }

            await postGames(formData)
        } catch (err) {
            console.log(`Erro ao adicionar jogo: ${err}.`)
        }

    }

    return (
        <div className="flex justify-center w-full">
            <Form
                handleSubmit={(e) => {
                    e.preventDefault()
                    handleSubmitNewGame()
                    navigate("/admin")
                    fetchGame()
                }}
                className={clsx(
                    "bg-[#1e1b38]",
                    "rounded-2xl shadow-lg p-8 w-full max-w-xl space-y-4",
                    "border border-[#4f46e5]/20",
                    "my-5"
                )}
                enctype="multipart/form-data"
            >
                <h2 className="text-xl lg:text-2xl font-semibold text-center mb-10 text-white drop-shadow">Adicionar Jogo</h2>

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

                {/* <Input
                            textLabel="Descrição:"
                            type="text"
                            id="descricao"
                            name="descricao"
                            value={descriptionGame}
                            handleChange={(e) => setDescriptionGame(e.target.value)}
                            classNameInput={clsx(
                                "px-4 py-2 rounded-md",
                                "bg-[#2a264f] text-white placeholder:text-gray-400",
                                "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                                "transition-all duration-200"
                            )}
                        /> */}

                <label htmlFor="descricao" className={clsx(
                    "block mb-1 text-sm sm:text-base text-gray-200",
                    "landscape:sm:text-sm landscape:lg:text-lg landscape:xl:text-xl"
                )}>Descrição:</label>
                <textarea
                    name="descricao"
                    id="descricao"
                    value={descriptionGame}
                    onChange={(e) => setDescriptionGame(e.target.value)}
                    rows={4}
                    className={clsx(
                        "w-full rounded-md text-while placeholder-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                        "p-2 resize-none",
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

                <Button
                    text="Confirmar novo jogo"
                    className={clsx(
                        "w-50 text-white lg:text-lg font-semibold py-2 rounded-md mt-4",
                        "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                        "hover:brightness-130 transition-all duration-200",
                        "cursor-pointer"
                    )}
                    // handleClick={() => navigate("/admin")}
                    type="submit"
                />
            </Form>
        </div>
    )
}

export default AdminNewGame