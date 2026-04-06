import { queryDB } from "../../utils/dbQuery.js"

export const createUser = async (name, email, password) => {
    const newUser = await queryDB("insert into users(name, email, password) values (?, ?, ?);",
        [name, email, password]
    )

    return newUser[0]
}

export const findUserByEmail = async (email) => {
    const results = await queryDB("SELECT * FROM users WHERE email = ?;", [email])

    return results[0]

}