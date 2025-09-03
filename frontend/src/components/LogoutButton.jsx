import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Button from "./Button"


function LogoutButton() {
    const { logout } = useAuth()
    const navigate = useNavigate()

    return (
        <Button
            text="Logout"
            className="cursor-pointer hover:text-blue-500"
            onClick={() => {
                logout()
                console.log("Clicou")
                return navigate("/login")
            }}
        />
    )
}

export default LogoutButton