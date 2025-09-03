import { useAuth } from "../hooks/useAuth"
import { useNavigate } from "react-router-dom"

function Dashboard() {
    const navigate = useNavigate()
    const { logout } = useAuth()

    return (
        <div>
            <h1>Logado com sucesso!</h1>
            <button
            onClick={() => {
                logout()
                navigate("/login")
            }}
            >Sair</button>
        </div>
    )
}

export default Dashboard