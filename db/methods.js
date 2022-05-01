import {getDb} from "./getDb.js";

const insert = async (date, price) => {
    const db = await getDb();
    return db.run('INSERT INTO rates (date, price) VALUES (:date, :price)', {
        ':date': date,
        ':price': price,
    })
}

const getDay = async () => {
    const db = await getDb();
    return db.all('SELECT * FROM rates ORDER BY date ASC LIMIT 24');
}

const getWeek = async () => {
    const db = await getDb();
    return db.all('SELECT * FROM rates ORDER BY date ASC LIMIT 168');
}

export {
    insert,
    getDay,
    getWeek,
}
