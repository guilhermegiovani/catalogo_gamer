import { NavLink } from "react-router-dom"
import clsx from "clsx"
import { useAuth } from "../hooks/useAuth"
import Button from "./Button"
import { useNavigate } from "react-router-dom"
import { useEffect, useRef, useState } from "react"
// import { getUser } from "../services/routes"
import { Menu, X } from "lucide-react"

function NavBar() {

    const { user, userId, logout, roleUser, isLoading, imgPerfil, getEditProfilePhoto, baseURL } = useAuth()
    const navigate = useNavigate()
    const [isOpen, setIsOpen] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const dropdownref = useRef(null)
    const [localImg, setLocalImg] = useState(imgPerfil)

    // const getUserData = async (id) => {
    //     try {
    //         const res = await getUser(id)
    //         // setImgPerfil(res.data[0].profile_photo)
    //     } catch (err) {
    //         console.log(`Erro ao pegar os dados: ${err}`)
    //     }
    // }
    useEffect(() => {
        if (userId > 0) {
            getEditProfilePhoto(userId)
        }
    }, [userId])

    useEffect(() => {
        setLocalImg(imgPerfil)
    }, [imgPerfil])

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownref.current && !dropdownref.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        
        getEditProfilePhoto(userId)
        
        setMenuOpen(false)
        document.addEventListener("click", handleClickOutside)
        return () => document.removeEventListener("click", handleClickOutside)
    }, [])

    // console.log(imgPerfil)

    return (
        <nav className={clsx(
            "w-full flex items-center",
            "bg-transparent text-whit mb-6 px-2 lg:px-4 md:px-10"
        )}>
            <NavLink to="/" className={clsx(
                "flex flex-col leading-none text-3xl font-semibold tracking-wide",
                "landscape:sm:text-2xl landscape:lg:text-3xl landscape:xl:text-5xl"
            )}>
                <span>CATÁLOGO</span>
                <span className="text-blue-500">GAMER</span>
            </NavLink>

            <div className="flex w-full items-center justify-end text-md lg:text-lg landscape:xl:text-xl font-normal">


                <div className="hidden lg:flex items-center gap-6 lg:mr-6">
                    <NavLink to="/" className={({ isActive }) => clsx(
                        "hover:text-blue-500", isActive && "text-blue-500"
                    )}>
                        Home
                    </NavLink>

                    {user ? "" : (
                        <NavLink to="/login" className={({ isActive }) => clsx(
                            "text-blue-500", "hover:text-blue-500", isActive && "text-blue-500"
                        )}>
                            Login
                        </NavLink>
                    )}

                    {user ? (
                        <NavLink
                            to="/games"
                            className={({ isActive }) => clsx("hover:text-blue-500", isActive && "text-blue-500")}>
                            Jogos
                        </NavLink>
                    ) : ""}

                    {user ? (
                        <NavLink to="/favorites" className={({ isActive }) => clsx(
                            "hover:text-blue-500", isActive && "text-blue-500"
                        )}>
                            Favoritos
                        </NavLink>
                    ) : ""}

                    {!isLoading && roleUser === "admin" ? (
                        <NavLink to="/admin" className={({ isActive }) => clsx(
                            "hover:text-blue-500", isActive && "text-blue-500"
                        )}>
                            Admin
                        </NavLink>
                    ) : ""}

                </div>

                <Button
                    text={menuOpen ? <X size={28} /> : <Menu size={28} />}
                    className="lg:hidden mr-2 md:mr-4 p-2 cursor-pointer hover:scale(1.04)"
                    handleClick={() => setMenuOpen(prev => !prev)}
                />

                {user ? (

                    <div ref={dropdownref} className="relative">

                        <img
                            src={baseURL + localImg}
                            alt="avatar"
                            className="rounded-full shadow-sm w-10 h-10 lg:w-15 lg:h-15 cursor-pointer object-cover"
                            onClick={() => setIsOpen(!isOpen)}
                        />

                        {isOpen ? (
                            <div className="absolute space-y-2 left-1/2 -translate-x-1/2 bg-white/5 rounded-lg shadow-lg px-5 py-3 flex flex-col justify-center items-center shadow-black/50 z-10">
                                <NavLink
                                    to="/profile"
                                    className={clsx(
                                        "text-lg",
                                        "hover:text-blue-500"
                                    )}
                                    onClick={() => {
                                        setIsOpen(false)
                                    }}
                                >
                                    Perfil
                                </NavLink>

                                <NavLink
                                    className={clsx(
                                        "text-lg",
                                        "hover:text-blue-500",
                                    )}
                                    onClick={() => {
                                        logout()
                                        setIsOpen(false)
                                        return navigate("/login")
                                    }}
                                >
                                    Sair
                                </NavLink>
                            </div>
                        ) : ""}
                    </div>


                ) : ""}



                {menuOpen && (
                    <div className={clsx(
                        "absolute top-20 right-5 md:top-18 md:right-23 w-auto bg-white/5 border-t border-[#2d2d5f]", //absolute top-16 right-5 
                        "flex flex-col items-center gap-4 p-4 text-md font-normal lg:hidden z-30"
                    )}>
                        <NavLink to="/" className={({ isActive }) => clsx(
                            "hover:text-blue-500", isActive && "text-blue-500"
                        )}>
                            Home
                        </NavLink>

                        {user ? "" : (
                            <NavLink to="/login" className={({ isActive }) => clsx(
                                "text-blue-500", "hover:text-blue-500", isActive && "text-blue-500"
                            )}>
                                Login
                            </NavLink>
                        )}

                        {user ? (
                            <NavLink
                                to="/games"
                                className={({ isActive }) => clsx("hover:text-blue-500", isActive && "text-blue-500")}>
                                Jogos
                            </NavLink>
                        ) : ""}

                        {user ? (
                            <NavLink to="/favorites" className={({ isActive }) => clsx(
                                "hover:text-blue-500", isActive && "text-blue-500"
                            )}>
                                Favoritos
                            </NavLink>
                        ) : ""}

                        {!isLoading && roleUser === "admin" ? (
                            <NavLink to="/admin" className={({ isActive }) => clsx(
                                "hover:text-blue-500", isActive && "text-blue-500"
                            )}>
                                Admin
                            </NavLink>
                        ) : ""}

                        {/* {user ? (
                            <div ref={dropdownref} className="relative">
                                <img
                                    src={`http://localhost:8000${imgPerfil}`}
                                    alt="avatar"
                                    className="rounded-full shadow-sm w-10 h-10 cursor-pointer"
                                    onClick={() => setIsOpen(!isOpen)}
                                />
                                {isOpen ? (
                                    <div className="absolute left-1/2 -translate-x-1/2 bg-white/5 rounded-lg shadow-lg p-3 flex flex-col justify-center items-center shadow-black/50 z-10">
                                        <NavLink
                                            to="/profile"
                                            className={clsx(
                                                "hover:text-blue-500"
                                            )}
                                            onClick={() => {
                                                setIsOpen(false)
                                            }}
                                        >
                                            Perfil
                                        </NavLink>
                                        <NavLink
                                            className={clsx(
                                                "hover:text-blue-500",
                                            )}
                                            onClick={() => {
                                                logout()
                                                setIsOpen(false)
                                                return navigate("/login")
                                            }}
                                        >
                                            Sair
                                        </NavLink>
                                    </div>
                                ) : ""}
                            </div>
                        ) : ""} */}
                    </div>
                )}
            </div>

        </nav>
    )
}

export default NavBar