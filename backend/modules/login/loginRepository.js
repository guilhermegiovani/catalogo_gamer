import { queryDB } from "../../utils/dbQuery.js"

export const loginRepository = async (email) => {
    const results = await queryDB("select id, email, password, role from users where email = ?;", [email])

    return results[0]
}