import { Route, Routes } from "react-router-dom";
import PrivateRouter from "./PrivateRoutes";
import Login from "../pages/Login"
import Dashboard from "../pages/Dashboard"
import Home from "../pages/Home"
import GamesList from "../pages/GamesList"
import Favorites from "../pages/Favorites"
import Reviews from "../pages/Reviews";
import ReviewGame from "../pages/ReviewGame";
import CreateAccount from "../pages/CreateAccount";
import Admin from "../pages/Admin";
import AdminGame from "../pages/AdminGame";
import AdminNewGame from "../pages/AdminNewGame";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import ChangePassword from "../pages/ChangePassword";
import CheckEmail from "../pages/CheckEmail";
import ResetPassword from "../pages/ResetPassword";

export default function Router() {

    return (
        <Routes>
            {/* Rotas públicas */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<CreateAccount />} />
            <Route path="/checkemail" element={<CheckEmail />} />
            <Route path="/resetpassword/:token" element={<ResetPassword />} />
            {/* <Route path={`/resetpassword/${tokenResetPassword}`} element={<ResetPassword />} /> */}
            {/* <Route path="resetpassword" element={<ResetPassword />} /> */}

            {/* Rotas privadas */}
            <Route element={<PrivateRouter />}>
                {/* Games */}
                <Route path="/games" element={<GamesList />} />
                <Route path="/games/:slug/reviews" element={<ReviewGame />} />

                {/* Favoritos */}
                <Route path="/favorites" element={<Favorites />} />

                {/* Reviews */}
                {/* <Route path="/reviews" element={<Reviews />} /> */}

                {/* Admin */}
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/addnewgame" element={<AdminNewGame />} />
                <Route path="/games/:id" element={<AdminGame />} />

                {/* Perfil */}
                <Route path="/profile" element={<Profile />} />
                <Route path="/profile/edit" element={<EditProfile />} />
                <Route path="/profile/changepassword" element={<ChangePassword />} />
            </Route>
        </Routes>
    )
}