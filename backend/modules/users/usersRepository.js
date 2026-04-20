import { queryDB } from "../../utils/dbQuery.js"

export const createUser = async (name, email, password) => {
    const newUser = await queryDB("insert into users(name, email, password) values (?, ?, ?);",
        [name, email, password]
    )

    return newUser[0]
}

export const findUsers = async () => {
    const users = await queryDB("select * from users;")

    return users
}

export const findUserByEmail = async (email) => {
    const user = await queryDB("select * from users where email = ?;", [email])

    return user[0]
}

export const findUserById = async (id) => {
    const user = await queryDB("select * from users where id = ?;", [id])

    return user[0]
}

export const deleteUser = async (id) => {
    await queryDB("delete from users where id = ?;", [id])

    return true
}

export const forgotPassword = async (token, expires, userId) => {
    const results = await queryDB(
        "UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE id = ?",
        [token, expires, userId]
    )

    return results[0]
}

export const findUserByToken = async (token) => {
    const user = await queryDB("select * from users where reset_token = ?;", [token])

    console.log("USER REPO: " + user)

    return user
}

export const updateUserPassword = async (password, uId) => {
    const updatedPassword = await queryDB(
        "update users set password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?",
        [password, uId]
    )

    return updatedPassword[0]
}

export const updateUser = async (body, uId) => {
    const keysReqBody = []
    const valuesReqBody = []

    for (const [field, value] of Object.entries(body)) {

        if (value !== undefined && value !== '') {
            if (field === 'password') {
                const senhaCripto = await bcrypt.hash(value, 10)
                keysReqBody.push(`${field} = ?`)
                valuesReqBody.push(senhaCripto)
            } else {
                keysReqBody.push(`${field} = ?`)
                valuesReqBody.push(value)
            }

        }
    }

    valuesReqBody.push(uId)
    const fieldsSQL = keysReqBody.join(", ")

    const query = `update users set ${fieldsSQL} where id = ?;`

    const updatedUser = await queryDB(query, valuesReqBody)
    
    return updatedUser[0]
}