import api from "./api"

// Criar novo usuário
export const newUser = (dados) => {
    return api.post("/users", dados)
}

// Pegar todos os usuários
export const getUsers = () => {
    return api.get("/users")
}

// Pegar todos os usuários
export const getUser = (id) => {
    return api.get(`users/${id}`)
}

// Editar usuários
export const patchUsers = (id, dados) => {
    return api.patch(`/users/${id}`, dados, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

// Função para logar usuário
export const loginUser = (dados) => {
    return api.post("/login", dados)
}

// Novo jogo (apenas admin)
export const postGames = (dados) => {
    return api.post("/games", dados, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

// Atualizar dados do jogo (apenas admin)
export const patchGames = (id, dados) => {
    return api.patch(`/games/${id}`, dados, {
        headers: { "Content-Type": "multipart/form-data" }
    })
}

// Função para pegar todos os jogos
export const getGames = () => {
    return api.get("/games")
}

// Função para pegar detalhes de um jogo pelo id
export const getGameById = (id) => {
    return api.get(`/games/${id}`)
}

// Função pra pegar os jogos pesquisados
export const getGameSearch = (dados) => {
    return api.get(`/games/search`, { params: { titulo: dados } })
}

// Deletar jogo (apenas admin)
export const deleteGame = (id) => {
    return api.delete(`/games/${id}`)
}

// Favoritar jogos
export const postFavorites = (gameId) => {
    return api.post("/favorites", { gameId })
}

//Função para pegar os jogos favoritos do usuário
export const getFavorites = () => {
    return api.get("/favorites")
}

// Tirar da lista de favoritos
export const deleteFavorites = (gameId) => {
    return api.delete("/favorites", { data: { gameId } })
}

// Avaliar jogos
export const postReviews = (dados) => {
    return api.post("/reviews", dados)
}

// Editar avaliação
export const patchReviews = (id, dados) => {
    return api.patch(`/reviews/${id}`, dados)
}

// Listar jogos avaliados
export const getReviewsByGame = (id) => {
    return api.get(`/reviews/game/${id}`)
}

// Listar jogos avaliados pelo usuário
export const getReviewsByUser = (id) => {
    return api.get(`/reviews/user/${id}`)
}

export const getReviewsAvgs = () => {
    return api.get(`/reviews/averages`)
}

// Deletar avaliação
export const deleteReviews = (id) => {
    return api.delete(`/reviews/${id}`)
}