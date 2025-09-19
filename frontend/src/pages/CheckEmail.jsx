import clsx from "clsx"
import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import Form from "../components/Form"
import toast from "react-hot-toast"
import { checkEmailUser } from "../services/routes"
import { useNavigate } from "react-router-dom"

function CheckEmail() {
    const [email, setEmail] = useState("")
    const navigate = useNavigate()

    const handleCheckEmail = async () => {
        if (!email) {
            toast.error("Preencha todos os campos")
            return
        }

        console.log("Email: " + email)
        await checkEmailUser(email)
        toast.success("Email verificado.")
    }

    return (
        <section className={clsx(
            "w-full flex justify-center items-center sm:p-4"
        )}>

            <Form
                className={clsx(
                    "bg-[#1e1b38]",
                    "rounded-2xl shadow-md sm:shadow-lg p-6 w-full max-w-xl space-y-4",
                    "landscape:sm:space-y-4 landscape:sm:shadow-md landscape:xl:space-y-6",
                    "portrait:sm:p-4",
                    "border border-[#4f46e5]/20"
                )}
                handleSubmit={(e) => {
                    e.preventDefault()
                    handleCheckEmail()
                }}
            >
                <p className="text-gray-400 italic">Coloque o mesmo email que utilizou na criação da conta!</p>

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

                <div className="flex gap-4">
                    <Button
                        text="Enviar código"
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
                    <Button
                        text="Cancelar"
                        className={clsx(
                            "w-40 text-white font-semibold p-1.5 rounded-md mt-4",
                            "bg-red-700",
                            "hover:brightness-130 transition-all duration-200",
                            "cursor-pointer lg:text-lg"
                        )}
                        handleClick={() => navigate("/login")}
                    />
                </div>
            </Form>
        </section>
    )
}

export default CheckEmail