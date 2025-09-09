import { useState, useEffect } from "react"
import { AuthContext } from "./AuthContext"
import { deleteFavorites, deleteReviews, getFavorites, getGames, getReviewsAvgs, getUser, loginUser, newUser, postFavorites } from "../services/routes"
import { jwtDecode } from "jwt-decode"
import toast from "react-hot-toast"

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem("user")
        return storedUser ? JSON.parse(storedUser) : null
    })
    const [reviewId, setReviewId] = useState(0)
    const [games, setGames] = useState([])
    const [favorites, setFavorites] = useState([])
    const [favoritesIdGame, setFavoritesIdGame] = useState([])
    const [averages, setAverages] = useState([])
    const [avgsFavorites, setAvgsFavorites] = useState([])
    const [reviews, setReviews] = useState([])
    const [reviewEdit, setReviewEdit] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [reviewsData, setReviewsData] = useState([])
    const [token, setToken] = useState(() => localStorage.getItem("token") || "")
    const [isLoading, setIsLoading] = useState(true)
    const [gamesAdmin, setGamesAdmin] = useState([])
    const [imgPerfil, setImgPerfil] = useState(null)
    const [imgsGames, setImgsGames] = useState([])
    const [searchGame, setSearchGame] = useState([])
    const [isSearch, setIsSearch] = useState(false)
    const [previewImgPerfil, setPreviewImgPerfil] = useState(null)

    const storedToken = localStorage.getItem("token")
    let initialRole = ""
    let initialUserId = 0

    if (storedToken) {
        const decoded = jwtDecode(storedToken)
        initialRole = decoded.role
        initialUserId = decoded.id
    }

    const [roleUser, setRoleUser] = useState(initialRole)
    const [userId, setUserId] = useState(initialUserId)

    useEffect(() => {
        const loadUser = async () => {
            const userActive = localStorage.getItem("user")

            if (storedToken) {
                const decoded = jwtDecode(storedToken)
                setToken(storedToken)
                setRoleUser(decoded.role)
                setUserId(decoded.id)
            } else {
                setUserId(0);
                setRoleUser("");
            }

            if (userActive) {
                const parsedUser = JSON.parse(userActive)
                setUser(parsedUser)

                if (!roleUser && parsedUser.role) {
                    setRoleUser(parsedUser.role)
                }

                try {
                    const fav = await getFavorites()
                    setFavorites(fav.data)

                    const idGame = fav.data.map(fav => fav.id)
                    setFavoritesIdGame(idGame)
                } catch (err) {
                    console.log(`Erro ao pegar game e favoritos: ${err}`)
                }
            }

            setIsLoading(false)
        }

        loadUser()

    }, [])

    const handleCreateAccount = async (dados) => {
        try {
            await newUser(dados)
            console.log("Conta criada com sucesso!")
            // const { email, senha, id } = res.data.newUser
            // setUser({email, senha})
            // setUserId(id)
        } catch (err) {
            console.log(`Erro ao criar conta: ${err}`)
        }
    }

    const handleLogin = async (dados) => {
        try {
            const res = await loginUser(dados)
            const { token, userId } = res.data
            // setUserId(res.data.userId)

            localStorage.setItem("user", JSON.stringify(dados))
            localStorage.setItem("userId", userId)
            localStorage.setItem("token", token)
            setUser(dados)
            setUserId(userId)

            const fav = await getFavorites()
            setFavorites(fav.data)

            const decoded = jwtDecode(token)
            setRoleUser(decoded.role)


            // const decodedSen = jwtDecode(dados.senha)
            // console.log(decodedSen)

            const idGame = fav.data.map(fav => fav.id)
            setFavoritesIdGame(idGame)

            getProfilePhoto(userId)

            // const resAvgs = await getReviewsAvg()
            // setAvgsFavorites(resAvgs.data.filter(avg => idGame.includes(avg.id)))

            // console.log(favorites)
            toast.success("Logado com sucesso!")

        } catch (err) {

            if (err.response?.status === 404) {
                setFavorites([])
                setFavoritesIdGame([])
            } else {
                console.log(`Erro ao fazer login: ${err}`)
                toast.error("Email ou senha inválida! Tente Novamente.")
            }
        }
    }

    const logout = () => {
        setFavorites()
        localStorage.removeItem("user")
        localStorage.removeItem("token")
        console.log(userId)
        console.log(roleUser)
        setRoleUser("")
        setUser(null)
        setToken("")
        setUserId(0)
        setImgPerfil(null)
        console.log("Deslogado com sucesso")
    }

    const getFavoritesUser = async () => {
        try {
            const res = await getFavorites()
            const games = res.data
            const idGame = games.map(game => game.id)
            setFavoritesIdGame(idGame)
            console.log(idGame)
        } catch (err) {
            if (err.response?.status === 404) {
                setFavorites([])
                setFavoritesIdGame([])
            } else {
                console.log(`Erro ao buscar favoritos: ${err}`)
            }
        }
    }

    const handleFavorites = async (id) => {
        // await getFavoritesUser()

        if (favoritesIdGame.includes(id)) {
            try {
                await deleteFavorites(id)
                setFavorites(prev => prev.filter(fav => fav.id !== id))
                setFavoritesIdGame(prev => prev.filter(gameId => gameId !== id))
            } catch (err) {
                console.log(`Não foi possível tirar o jogo dos favortitos: ${err}`)
            }
        } else {
            try {
                const newFavorites = await postFavorites(id)
                setFavorites(prev => [...prev, newFavorites])
                setFavoritesIdGame(prev => [...prev, id])
            } catch (err) {
                console.log(`Não foi possível adicionar o jogo dos favortitos: ${err}`)
            }
        }

    }

    const handleEditReview = (uId, rId) => {
        const review = reviewsData.filter(r => r.idUser === uId)
        const dataRev = { comment: review[0].comment, rating: review[0].rating }
        setRating(dataRev.rating)
        setComment(dataRev.comment)
        setIsEditing(true)
        setReviewId(rId)
    }

    const deleteRev = async (revId) => {
        try {
            await deleteReviews(revId)
            setReviewsData(prev => prev.filter(r => r.id !== revId))
            console.log("Deletado com sucesso!")
        } catch (err) {
            console.log(`Erro ao deletar avaliação: ${err}`)
        }
    }

    const fetchGame = async () => {
        try {
            const res = await getGames()
            setGamesAdmin(res.data)

            const resAvg = await getReviewsAvgs()
            setAverages(resAvg.data)
        } catch (err) {
            console.log(`Erro ao pegar jogos: ${err}`)
        }
    }

    const getEditProfilePhoto = async (id) => {
        try {
            const res = await getUser(id)
            const userData = res.data[0]
            setImgPerfil(userData.profile_photo)
            
        } catch(err) {
            console.log(`Erro ao pegar os dados do usuário: ${err}`)
        }
        
    }

    const getProfilePhoto = async (id) => {
        try {
            const res = await getUser(id)
            const userData = res.data[0]
            setImgPerfil(userData.profile_photo)

            // console.log(userData)
            
        } catch(err) {
            console.log(`Erro ao pegar os dados do usuário: ${err}`)
        }
        
    }

    

    return (
        <AuthContext.Provider value={{
            user, handleLogin, logout, favorites, setFavorites, favoritesIdGame, setFavoritesIdGame, handleFavorites, getFavoritesUser, games, setGames, averages, setAverages, avgsFavorites, setAvgsFavorites, reviews, setReviews, reviewsData, setReviewsData, userId, reviewEdit, setReviewEdit, handleEditReview, isEditing, setIsEditing, rating, setRating, comment, setComment, reviewId, setReviewId, isLoading, deleteRev, handleCreateAccount, roleUser, gamesAdmin, fetchGame, imgPerfil, setImgPerfil, imgsGames, setImgsGames, searchGame, setSearchGame, isSearch, setIsSearch, previewImgPerfil, setPreviewImgPerfil, getEditProfilePhoto
        }}>
            {children}
        </AuthContext.Provider>
    )
}