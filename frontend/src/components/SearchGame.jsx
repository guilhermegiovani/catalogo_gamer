import clsx from "clsx"
import Form from "./Form"
import Input from "./Input"
import { Search } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "../hooks/useAuth"
import { getGameSearch } from "../services/routes"


function SearchGame() {
    const { setSearchGame, setIsSearch } = useAuth()
    const [searchGameInput, setSearchGameInput] = useState("")

    if(searchGameInput) {
        setIsSearch(true)
    } else {
        setIsSearch(false)
    }

    const getSearchGame = async () => {
        try {
            const res = await getGameSearch(searchGameInput)
            setSearchGame(res.data)
        }catch(err) {
            console.log(`Erro ao pegar jogos pesquisado: ${err}`)
        }
        // setSearchGame(games.filter((g) => g.titulo.toLowerCase().includes(searchGameInput.toLowerCase())))
    }

    useEffect(() => {
        if(searchGameInput.trim() !== "") {
            getSearchGame()
            setIsSearch(true)
        } else {
            setIsSearch(false)
        }

    }, [searchGameInput])

    return (
        <Form className="relative w-full max-w-sm mb-10">
            <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
                size={20}
                onClick={() => {
                    setSearchGameInput("")
                }}
            />

            <Input
                type="text"
                value={searchGameInput}
                handleChange={(e) => {
                    setSearchGameInput(e.target.value)
                    // getSearchGame()
                }}
                classNameInput={clsx(
                    "w-full pl-10 pr-4 py-2 rounded-md",
                    "bg-[#2a264f] text-white placeholder:text-gray-400",
                    "focus:outline-none focus:ring-2 focus:ring-[#6c63ff]",
                    "transition-all duration-200"
                )}
                placeholder="Pesquisar..."
            />
        </Form>
    )
}

export default SearchGame