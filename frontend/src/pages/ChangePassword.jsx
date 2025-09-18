import clsx from "clsx"
import Form from "../components/Form"
import Button from "../components/Button"
import Input from "../components/Input"
import { patchUserPassword } from "../services/routes"
import { useAuth } from "../hooks/useAuth"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"


function ChangePassword() {
    const navigate = useNavigate()
    const { userId } = useAuth()
    const [password, setPassword] = useState(null)
    const [newPassword, setNewPassword] = useState(null)
    const [confNewPassword, setConfNewPassword] = useState(null)

    // useEffect(() => {
    //     async function getUserData() {
    //         try {
    //             const user = await getUser(userId)
    //             const dataUser = user.data[0]
    //         } catch (err) {
    //             console.log(err)
    //         }
    //     }

    //     getUserData()
    // }, [])

    const handleChangePassword = async () => {
        try {
            if(!password || !newPassword || !confNewPassword) {
                toast.error("Preencha todos os campos")
                return
            }

            console.log(`Atual: ${password}`)
            console.log(`Nova: ${newPassword}`)
            console.log(`Confirmar: ${confNewPassword}`)

            const userPassword = {
                currentPassword: password,
                newPassword,
                confNewPassword
            }

            await patchUserPassword(userPassword)

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
                        textLabel={"Senha Atual: "}
                        type="password"
                        id="senha"
                        name="senha"
                        value={password}
                        required
                        handleChange={(e) => setPassword(e.target.value)}
                        classNameInput={clsx(
                            "px-4 py-2 rounded-md",
                            "bg-[#2a264f] text-white placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            "transition-all duration-200"
                        )}
                    />

                    <Input
                        textLabel={"Nova senha: "}
                        type="password"
                        id="novaSenha"
                        name="novaSenha"
                        value={newPassword}
                        required
                        handleChange={(e) => setNewPassword(e.target.value)}
                        classNameInput={clsx(
                            "px-4 py-2 rounded-md",
                            "bg-[#2a264f] text-white placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            "transition-all duration-200"
                        )}
                    />

                    <Input
                        textLabel={"Confirma nova senha: "}
                        type="password"
                        id="confNovaSenha"
                        name="confNovaSenha"
                        value={confNewPassword}
                        required
                        handleChange={(e) => setConfNewPassword(e.target.value)}
                        classNameInput={clsx(
                            "px-4 py-2 rounded-md",
                            "bg-[#2a264f] text-white placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            "transition-all duration-200"
                        )}
                    />

                <div className="w-full flex justify-center gap-5">
                    <Button
                        text="Confirmar"
                        className={clsx(
                            "w-40 lg:w-45 xl:w-50 text-white text-sm portrait:sm:text-base lg:text-base xl:text-lg font-semibold py-2 rounded-md mt-4",
                            "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                            "hover:brightness-130 transition-all duration-200",
                            "cursor-pointer"
                        )}
                        // type="submit"
                        handleClick={() => {
                            handleChangePassword(userId).then(() => {
                                toast.success("senha alterada com sucesso!")
                                // if(fileImgPerfil.name !== null && fileImgPerfil.name !== undefined) {
                                //     setImgPerfil(fileImgPerfil.name)
                                // }
                                navigate("/profile")
                            }).catch((err) => {
                                toast.error("Erro ao alterar senha!")
                                console.log(err)
                            })
                        }}
                    />
                    <Button
                        text="Cancelar"
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

export default ChangePassword