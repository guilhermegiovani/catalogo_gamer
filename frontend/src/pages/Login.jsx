import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
// import api from "../services/api"
import Button from "../components/Button"
import clsx from "clsx"
import { Link } from "react-router-dom"
import Input from "../components/Input"
import Form from "../components/Form"
import toast from "react-hot-toast"

function Login() {
    const [email, setEmail] = useState("")
    const [senha, setSenha] = useState("")
    const navigate = useNavigate()
    const { handleLogin } = useAuth()

    // const handleSubmit = (e) => {
    //     e.preventDefault()

    //     console.log(email, senha)
    //     try {
    //         setUser({email, senha})
    //         loginUser({email, senha})
    //         return navigate("/games")
    //     } catch (err) {
    //         console.log(`Erro ao fazer login: ${err}`)
    //         console.log(email, senha)
    //         return navigate("/login")
    //     }
    // }

    return (

        <div className={clsx(
            "w-full flex justify-center items-center sm:p-4"
        )}>
            <div className={clsx(
                "bg-[#1e1b38]",
                "rounded-2xl shadow-md sm:shadow-lg w-full p-6 max-w-xl lg:max-w-2xl space-y-6",
                "landscape:sm:space-y-4 landscape:sm:p-4 landscape:lg:p-5 landscape:xl:p-10",
                "flex flex-col items-center",
                "border border-[#4f46e5]/20"
            )}>

                <Form handleSubmit={(e) => {
                    e.preventDefault()
                    handleLogin({ email, senha })
                        .then(() => {
                            toast.success("Logado com sucesso!")
                            navigate("/games")
                        }).catch(() => {
                            toast.error("Falha ao logar!")
                        })
                }}
                    className={clsx(
                        "bg-[#1e1b38]",
                        "rounded-2xl shadow-md sm:shadow-lg p-4 w-full max-w-xl space-y-4",
                        "landscape:sm:space-y-4 landscape:sm:shadow-md landscape:xl:space-y-6",
                        "portrait:sm:p-4",
                        "border border-[#4f46e5]/20"
                    )}
                >
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
                            "text-xs sm:text-sm",
                            "landscape:sm:text-xs landscape:lg:text-base landscape:xl:text-lg"
                            // "bg-[#2a264f] text-white placeholder:text-gray-400",
                            // "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                            // "transition-all duration-200"
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
                            "text-xs sm:text-sm",
                            "landscape:sm:text-xs landscape:lg:text-base landscape:xl:text-lg"
                        )}
                    />

                    <Button
                        text="Login"
                        className={clsx(
                            "w-30 sm:w-35 text-white font-semibold p-1.5 rounded-md mt-2 sm:mt-4",
                            "text-sm",
                            "landscape:sm:text-sm landscape:sm:w-35",
                            "landscape:lg:text-base landscape:lg:w-40",
                            "landscape:xl:text-lg landscape:xl:w-50",
                            "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                            "hover:brightness-130 transition-all duration-200",
                            "cursor-pointer"
                        )}
                        type="submit"
                    />
                </Form>



                <p className={clsx(
                    "text-center text-gray-300 text-sm xl:text-base"
                )}>
                    Não tem uma conta?{" "}
                    <Link
                        to="/register"
                        className="text-[#6c63ff] hover:underline hover:text-[#8b84ff] transition-colors">
                        Crie uma agora!
                    </Link>
                </p>
            </div>

        </div>
    )

}

export default Login

{/* <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        handleLogin({ email, senha })
                            .then(() => navigate("/games"))
                    }}
                    className={clsx(
                        "bg-[#1e1b38]",
                        "rounded-2xl shadow-lg p-8 w-full max-w-xl space-y-6",
                        "border border-[#4f46e5]/20"
                    )}
                >
                    <h2 className="text-3xl font-semibold text-white text-center mb-10">Login</h2>
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
                        text="Login"
                        className={clsx(
                            " w-50 text-white font-semibold py-2 rounded-md mt-4",
                            "bg-gradient-to-r from-[#3c0b8d] to-[#491a9d]",
                            "hover:brightness-130 transition-all duration-200",
                            "cursor-pointer"
                        )}
                        type="submit"
                    />
                </form> */}