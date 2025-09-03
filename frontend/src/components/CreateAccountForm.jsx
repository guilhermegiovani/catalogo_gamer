import clsx from "clsx"
import Button from "./Button"
import { useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"
import Form from "./Form"
import Input from "./Input"
import toast from "react-hot-toast"


function CreateAccountForm() {
    const [nome, setNome] = useState("")
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const [confSenha, setConfSenha] = useState("")
    const { handleCreateAccount } = useAuth()
    const navigate = useNavigate()

    return (
        <div className={clsx(
            "flex justify-center items-center p-4"
        )}>

            <Form handleSubmit={(e) => {
                e.preventDefault()
                if (confSenha !== senha) {
                    toast.error("As senha não coincidem!")
                    return
                }

                handleCreateAccount({ nome, email, senha })
                    .then(() => {
                        toast.success("Conta criada com sucesso! Faça login.")

                        setNome("")
                        setEmail("")
                        setSenha("")
                        setConfSenha("")

                        navigate("/login")
                    }).catch((err) => {
                        toast.error(`Erro ao criar conta, tente novamente! ${err}`)
                    })
            }}
                className={clsx(
                    "bg-[#1e1b38]",
                    "rounded-2xl shadow-lg p-8 w-full max-w-xl space-y-6",
                    "border border-[#4f46e5]/20"
                )}
            >
                <Input
                    textLabel={"Nome: "}
                    type="text"
                    id="nome"
                    name="nome"
                    value={nome}
                    handleChange={(e) => setNome(e.target.value)}
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
                    value={email}
                    handleChange={(e) => setEmail(e.target.value)}
                    required
                    classNameInput={clsx(
                        "px-4 py-2 rounded-md",
                        "bg-[#2a264f] text-white placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                        "transition-all duration-200"
                    )}
                />

                <Input
                    textLabel={"Senha: "}
                    type="password"
                    id="senha"
                    name="senha"
                    value={senha}
                    handleChange={(e) => setSenha(e.target.value)}
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
                    value={confSenha}
                    handleChange={(e) => setConfSenha(e.target.value)}
                    required
                    classNameInput={clsx(
                        "px-4 py-2 rounded-md",
                        "bg-[#2a264f] text-white placeholder:text-gray-400",
                        "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                        "transition-all duration-200"
                    )}
                />

                <Button
                    text="Criar conta"
                    className={clsx(
                        " w-50 text-white font-semibold py-2 rounded-md mt-4",
                        "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                        "hover:brightness-130 transition-all duration-200",
                        "cursor-pointer"
                    )}
                    type="submit"
                />
            </Form>

        </div>
    )
}

export default CreateAccountForm

{/* <form
                onSubmit={(e) => {
                    e.preventDefault()
                    handleCreateAccount({ nome, email, senha })
                    .then(() => navigate("/login"))
                }}
                className={clsx(
                    "bg-[#1e1b38]",
                    "rounded-2xl shadow-lg p-8 w-full max-w-xl space-y-6",
                    "border border-[#4f46e5]/20"
                )}
            >
                <h2 className="text-3xl font-semibold text-white text-center mb-10">Criar nova conta</h2>

                <div className="flex flex-col space-y-2">
                    <label htmlFor="nome" className="text-white text-md">Nome: </label>
                    <input
                        type="text"
                        id="nome"
                        name="nome"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        required
                        className={clsx(
                            "px-4 py-2 rounded-md",
                            "bg-[#2a264f] text-white placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            "transition-all duration-200"
                        )}
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label htmlFor="email" className="text-white text-md">Email: </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className={clsx(
                            "px-4 py-2 rounded-md",
                            "bg-[#2a264f] text-white placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            "transition-all duration-200"
                        )}
                    />
                </div>

                <div className="flex flex-col space-y-2">
                    <label htmlFor="senha" className="text-white text-md">Senha: </label>
                    <input
                        type="password"
                        id="senha"
                        name="senha"
                        value={senha}
                        onChange={(e) => setSenha(e.target.value)}
                        required
                        className={clsx(
                            "px-4 py-2 rounded-md",
                            "bg-[#2a264f] text-white placeholder:text-gray-400",
                            "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            "transition-all duration-200"
                        )}
                    />
                </div>

                <Button
                    text="Criar conta"
                    className={clsx(
                        " w-50 text-white font-semibold py-2 rounded-md mt-4",
                        "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                        "hover:brightness-130 transition-all duration-200",
                        "cursor-pointer"
                    )}
                    type="submit"
                />
            </form> */}