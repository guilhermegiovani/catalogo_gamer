import clsx from "clsx"
import Form from "../components/Form"
import Button from "../components/Button"
import Input from "../components/Input"
import { getUser, patchUsers } from "../services/routes"
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"


function EditProfile() {
    const navigate = useNavigate()
    const { userId, setImgPerfil, getEditProfilePhoto, baseURL } = useAuth()
    const [newName, setNewName] = useState("")
    const [newUserName, setNewUserName] = useState("")
    const [newEmail, setNewEmail] = useState("")
    const [previewImgPerfil, setPreviewImgPerfil] = useState(null)
    const [fileImgPerfil, setFileImgPerfil] = useState(null)

    useEffect(() => {
        async function getUserData() {
            try {
                const user = await getUser(userId)
                const dataUser = user.data[0]

                setNewName(dataUser.name)
                setNewUserName(dataUser.nickname)
                setNewEmail(dataUser.email)
                setPreviewImgPerfil(baseURL + dataUser.profile_photo)
            } catch (err) {
                console.log(err)
            }
        }

        getUserData()
    }, [])

    useEffect(() => {
        return () => {
            if (previewImgPerfil) URL.revokeObjectURL(previewImgPerfil)
        }
    }, [previewImgPerfil])

    const handleChangeImg = (e) => {
        const selected = e.target.files[0]
        if (selected) {
            setFileImgPerfil(selected)
            setPreviewImgPerfil(URL.createObjectURL(selected))
        }
    }

    const handleSubmitEditUser = async (id) => {
        try {
            const formData = new FormData()
            formData.append("name", newName)
            formData.append("nickname", newUserName)
            formData.append("email", newEmail)

            if (fileImgPerfil instanceof File) {
                formData.append("img-profile", fileImgPerfil)
            }
            
            const res = await patchUsers(id, formData)
            
            if(res.data.userData[0].profile_photo) {
                // setImgPerfil(res.data.userData[0].profile_photo)
                getEditProfilePhoto(id)
                // console.log(id, res.data.userData[0].profile_photo)
            }

        } catch (err) {
            console.log(`Erro ao editar perfil: ${err}.`)
        }

    }

    return (
        <section className="flex justify-center w-full">
            <Form
                handleSubmit={(e) => {
                    e.preventDefault()
                }}
                className={clsx(
                    "bg-[#1e1b38] flex flex-col",
                    "rounded-2xl shadow-lg p-8 w-full max-w-xl space-y-6",
                    "border border-[#4f46e5]/20"
                )}
            >
                <Input
                    textLabel={"Nome: "}
                    type="text"
                    id="nome"
                    name="nome"
                    value={newName}
                    handleChange={(e) => setNewName(e.target.value)}
                    required
                    classNameInput={clsx(
                        "px-4 py-2 rounded-md",
                        "bg-[#2a264f] text-white placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                        "transition-all duration-200"
                    )}
                />

                <Input
                    textLabel={"Apelido: "}
                    type="text"
                    id="apelido"
                    name="apelido"
                    value={newUserName}
                    handleChange={(e) => setNewUserName(e.target.value)}
                    required
                    classNameInput={clsx(
                        "px-4 py-2 rounded-md",
                        "bg-[#2a264f] text-white placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                        "transition-all duration-200"
                    )}
                />

                <Input
                    textLabel={"Email: "}
                    type="email"
                    id="email"
                    name="email"
                    value={newEmail}
                    handleChange={(e) => setNewEmail(e.target.value)}
                    required
                    classNameInput={clsx(
                        "px-4 py-2 rounded-md",
                        "bg-[#2a264f] text-white placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                        "transition-all duration-200"
                    )}
                />

                <Input
                    textLabel="Foto perfil:"
                    classNameLabel={clsx(
                        "w-full px-4 py-2 rounded-md bg-[#2a264f] text-white text-center cursor-pointer",
                        "hover:bg-[#3a3360] transition-all duration-200",
                        "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]"
                    )}
                    type="file"
                    id="img-perfil"
                    name="img-perfil"
                    classNameInput={"hidden"}
                    handleChange={(e) => handleChangeImg(e)}
                />

                {previewImgPerfil && (
                    <div>
                        <img src={previewImgPerfil}
                            alt="Preview"
                            className="w-full h-64 object-contain rounded-md mt-4 border border-[#4f46e5]/20"
                        />

                        <Button
                            text="Remover imagem"
                            className={clsx(
                                "w-40 lg:w-50 text-white lg:text-lg font-semibold py-1.5 lg:py-2 rounded-md mt-4",
                                "bg-red-700/90",
                                "hover:brightness-130 transition-all duration-200",
                                "cursor-pointer"
                            )}
                            handleClick={() => {
                                URL.revokeObjectURL(previewImgPerfil)
                                setPreviewImgPerfil(null)
                                setFileImgPerfil(null)
                            }}
                        />
                    </div>
                )}

                {/* <Input
                        textLabel={"Senha: "}
                        type="password"
                        id="senha"
                        name="senha"
                        required
                        classNameInput={clsx(
                            "px-4 py-2 rounded-md",
                            "bg-[#2a264f] text-white placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            "transition-all duration-200"
                        )}
                    />

                    <Input
                        textLabel={"Confirmar senha: "}
                        type="password"
                        id="confSenha"
                        name="confSenha"
                        required
                        classNameInput={clsx(
                            "px-4 py-2 rounded-md",
                            "bg-[#2a264f] text-white placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            "transition-all duration-200"
                        )}
                    /> */}

                <div className="w-full flex justify-center gap-5">
                    <Button
                        text="Editar perfil"
                        className={clsx(
                            "w-40 lg:w-45 xl:w-50 text-white text-sm portrait:sm:text-base lg:text-base xl:text-lg font-semibold py-2 rounded-md mt-4",
                            "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                            "hover:brightness-130 transition-all duration-200",
                            "cursor-pointer"
                        )}
                        // type="submit"
                        handleClick={() => {
                            handleSubmitEditUser(userId).then(() => {
                                toast.success("perfil editado com sucesso!")
                                // if(fileImgPerfil.name !== null && fileImgPerfil.name !== undefined) {
                                //     setImgPerfil(fileImgPerfil.name)
                                // }
                                navigate("/profile")
                            }).catch((err) => {
                                toast.error("Erro ao editar perfil!")
                                console.log(err)
                            })
                        }}
                    />
                    <Button
                        text="Cancelar Edição"
                        className={clsx(
                            "w-40 lg:w-45 xl:w-50 text-white text-sm portrait:sm:text-base lg:text-base xl:text-lg font-semibold py-2 rounded-md mt-4",
                            "bg-red-700/90",
                            "hover:brightness-130 transition-all duration-200",
                            "cursor-pointer"
                        )}
                        handleClick={() => navigate("/profile")}
                    />
                </div>
            </Form>
        </section>
    )
}

export default EditProfile