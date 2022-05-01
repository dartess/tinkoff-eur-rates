import {open} from "sqlite";
import sqlite3 from "sqlite3";
import {DB_FILE} from "./constants.js";

export function getDb() {
    return open({
        filename: DB_FILE,
        driver: sqlite3.Database
    })
}
