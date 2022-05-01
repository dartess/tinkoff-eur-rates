import fs from "fs";
import {promisify} from 'util';
import {getDb} from "./getDb.js";
import {DB_FILE} from "./constants.js";

try {
    await promisify(fs.unlink)(DB_FILE);
} catch {}
await promisify(fs.writeFile)(DB_FILE, '');
const db = await getDb();
await db.exec('CREATE TABLE rates (date int, price int)');
