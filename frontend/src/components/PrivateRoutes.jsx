import { useAuth } from "../hooks/useAuth"
import { Navigate, Outlet } from "react-router-dom"

function PrivateRouter() {
    const { user, isLoading } = useAuth()

    if(isLoading) return null

    if(!user) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />
}

export default PrivateRouter