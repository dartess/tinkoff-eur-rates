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
    return db.all('SELECT * FROM rates ORDER BY date DESC LIMIT 24');
}

const getWeek = async () => {
    const db = await getDb();
    return db.all('SELECT * FROM rates ORDER BY date DESC LIMIT 168');
}

const getMonth = async () => {
    const db = await getDb();
    return db.all('SELECT * FROM rates ORDER BY date DESC LIMIT 5208');
}

const getAll = async () => {
    const db = await getDb();
    return db.all('SELECT * FROM rates ORDER BY date DESC');
}

export {
    insert,
    getDay,
    getWeek,
    getMonth,
    getAll,
}
