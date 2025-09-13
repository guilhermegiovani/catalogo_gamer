// import db from "../db";
import { db, isProd } from "../db.js";

/**
@param {string} query
@param {Array} Values
@returns {Promise<any>}
*/

export const queryDB = async (query, values = []) => {
    // const isProd = process.env.NODE_ENV === "production";

    if(isProd) {
        let index = 1
        const pgQuery = query.replace(/\?/g, () => `$${index++}`)

        if(!query.trim().toLowerCase().startsWith("select")) {
            const pgQueryBase = pgQuery.trim().replace(/;$/, "")
            const pgQueryWithReturn = pgQueryBase + " RETURNING id;"
            const result = await db.query(pgQueryWithReturn, values)
            console.log(pgQueryWithReturn)
            return result.rows
        } else {
            const result = await db.query(pgQuery, values)
            console.log(pgQuery)
            return result.rows
        }

    } else {
        const [rows] = await db.query(query, values)
        if(rows.insertId !== undefined) return [{ id: rows.insertId }]
        return rows
    }

}

// if(isProd) {

// } else {

// }