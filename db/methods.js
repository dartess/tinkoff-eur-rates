import {getDb} from "./getDb.js";

const insert = async (date, price) => {
    const db = await getDb();
    return db.run('INSERT INTO rates (date, price) VALUES (:date, :price)', {
        ':date': date,
        ':price': price,
    })
}

const get = async () => {
    const db = await getDb();
    return db.all('SELECT * FROM rates ORDER BY date DESC LIMIT 24');
}

export {
    insert,
    get,
}
