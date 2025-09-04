// import Button from "../components/Button"
// import clsx from "clsx"


// function Profile() {

//     return (
//         <section>

//             <header>
//                 <h1>Foto perfil</h1>
//                 <h2>Nome Usuario</h2>
//                 <h3>{"Apelido(caso tenha)"}</h3>
//             </header>

//             <div>
//                 <Button text="Editar perfil" />
//             </div>

//             <article>

//                 <div>
//                     <h3>Info básica</h3>

//                     <span>
//                         <p>name</p>
//                         <p>Guilherme</p>
//                     </span>

//                     <span>
//                         <p>email</p>
//                         <p>Guilherme@email.com</p>
//                     </span>

//                     <span>
//                         <p>Membro desde</p>
//                         <p>{"data(caso tenha)"}</p>
//                     </span>
//                 </div>

//                 <div>
//                     <h3>Meus favoritos</h3>

//                     <span>{/* map dos favoritos */}</span>
//                 </div>

//                 <div>
//                     <h3>Minha reviews</h3>
//                     <span>
//                         {/* map reviews */}
//                     </span>
//                 </div>

//             </article>

//         </section>
//     )
// }

// export default Profile

import Button from "../components/Button"
import clsx from "clsx"
// import img from "../rainbow-six-siege.png"
import { useAuth } from "../hooks/useAuth"
import { getFavorites, getReviewsByUser, getUser } from "../services/routes"
import { useEffect, useState } from "react"
import { Star } from "lucide-react"
import { Link, useNavigate } from "react-router-dom"
import Input from "../components/Input"

function Profile() {
    const navigate = useNavigate()
    const { userId } = useAuth()
    const [profileUser, setProfileUser] = useState([])
    const [favUser, setFavUser] = useState([])
    const [revUser, setRevUser] = useState([])

    // console.log(userId)
    async function fetchUserData() {
        try {
            const resUser = await getUser(userId)
            // const user = resUser.data.filter(u => u.id === userId)
            setProfileUser(resUser.data)

            const resFav = await getFavorites()
            setFavUser(resFav.data)

            const resRev = await getReviewsByUser(userId)
            setRevUser(resRev.data)
        } catch (err) {
            console.log(`Erro ao pegar os usuários: ${err}`)
        }
    }

    useEffect(() => {
        fetchUserData()
    }, [])

    return (
        <section className="min-h-screen w-full flex justify-center py-12 px-4 text-gray-100">
            <div className="w-full max-w-3xl text-center space-y-10">

                {/* Cabeçalho */}
                <div className="flex flex-col items-center space-y-3">
                    <div className="relative w-28 h-28 lg:w-32 lg:h-32 rounded-full border-4 border-violet-500 shadow-[0_0_25px_rgba(139,92,246,0.6)] overflow-hidden">
                        {/* Aqui entra a imagem do usuário */}
                        <span className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                            <img
                                src={`http://localhost:8000${profileUser.foto_perfil}`}
                                alt="foto_perfil"
                            />

                        </span>
                        {/* <Input
                            type="file"
                            name="foto"
                            id="foto"
                            accept="image/*"
                            classNameInput="hidden cursor-pointer"
                            handleChange={(e) => handleFileChange(e)}
                        /> */}
                    </div>
                    <h1 className="text-xl lg:text-3xl font-bold">{profileUser.nome}</h1>
                    <h3 className="text-gray-400 text-base lg:text-lg">{profileUser.apelido}</h3>

                    <Button
                        text="EDITAR PERFIL"
                        className={clsx(
                            "mt-4 px-6 py-2 bg-violet-700 hover:bg-violet-600",
                            "text-white font-medium rounded-xl shadow-lg",
                            "cursor-pointer transition-all duration-200",
                            "text-xs lg:text-lg"
                        )}
                        handleClick={() => navigate("/profile/edit")}
                    />
                </div>

                <article className="space-y-6">
                    {/* Info Básica */}
                    <div className="text-left space-y-6 border-2 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)] p-4">
                        <h3 className="text-2xl lg:text-3xl font-semibold">Info Básica</h3>
                        <div className="space-y-3">
                            <div className="flex justify-between text-gray-300 text-sm lg:text-lg">
                                <span>Nome:</span>
                                <span className="font-medium text-white">{profileUser.nome}</span>
                            </div>
                            <div className="flex justify-between text-gray-300 text-sm lg:text-lg">
                                <span>Email:</span>
                                <span className="font-medium text-white">{profileUser.email}</span>
                            </div>
                            <div className="flex justify-between text-gray-300 text-sm lg:text-lg">
                                <span>Membro desde</span>
                                <span className="font-medium text-white">Nov 25, 2021</span>
                            </div>
                        </div>
                    </div>
                    {/* Favoritos */}
                    <div className="text-left space-y-4 border-2 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)] p-5">
                        <h3 className="text-2xl lg:text-3xl font-semibold">Meus Favoritos</h3>
                        <div className="flex flex-wrap justify-center gap-4">
                            {/* Exemplo de cards */}
                            {/* <div className="w-24 h-32 bg-gray-700 rounded-lg"></div>
                            <div className="w-24 h-32 bg-gray-700 rounded-lg"></div>
                            <div className="w-24 h-32 bg-gray-700 rounded-lg"></div> */}
                            {favUser.map((fav) => (
                                <div key={fav.id} className="w-20 sm:w-24 lg:w-30 bg-gray-700 rounded-lg">
                                    <Link to={`/reviews/${fav.id}`}>
                                        <img
                                            className="hover:scale-[1.04] cursor-pointer transition duration-400"
                                            src={`http://localhost:8000${fav.imagem_url}`}
                                            alt={fav.titulo}
                                        />
                                    </Link>
                                </div>
                            ))

                            }
                        </div>
                    </div>
                    {/* Reviews */}
                    <div className="text-left space-y-4 border-2 border-violet-500 shadow-[0_0_10px_rgba(139,92,246,0.6)] p-5">

                        <h3 className="text-2xl lg:text-3xl font-semibold">Minhas Reviews</h3>

                        {revUser.map((rev) => (
                            <div key={rev.id} className="bg-[#1c1233] rounded-xl p-4 shadow-md space-y-2">
                                <p className="text-gray-200 text-base lg:text-xl">{rev.titulo}</p>
                                <div className="flex gap-1 items-center text-md lg:text-base">
                                    <Star size={18} fill="currentColor" className="text-yellow-400 -mt-[1px]" /> {rev.nota}
                                </div>
                                {/* <div className="flex text-yellow-400">★★★★☆</div> */}
                                <p className="text-gray-200 text-sm lg:text-base">{rev.comentario}</p>
                            </div>
                        ))

                        }
                        {/* <div className="bg-[#1c1233] rounded-xl p-4 shadow-md space-y-2">
                            <div className="flex text-yellow-400">★★★★★</div>
                            <p className="text-gray-200 text-md">Amazing gameplay, story, and graphics!</p>
                        </div>
                        <div className="bg-[#1c1233] rounded-xl p-4 shadow-md space-y-2">
                            <div className="flex text-yellow-400">★★★★☆</div>
                            <p className="text-gray-200 text-md">Bom, mas poderia melhorar o desempenho.</p>
                        </div> */}

                    </div>
                </article>

            </div>
        </section>
    )
}

export default Profile
