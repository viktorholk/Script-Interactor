const Logger    = require('./Logger');
const fs        = require('fs');
let sqlite3     = require('sqlite3').verbose();

class Database {
    static _INSTANCE = null;
    static Instance(){
        if (this._INSTANCE === null){
            this._INSTANCE = new Api();
        }
        return this._INSTANCE;
    }

    DATABASE_NAME = 'db.sqlite3';

    constructor(){
        this.db = new sqlite3.Database(this.DATABASE_NAME, (err) => {
            if (err){
                Logger.Instance().log(err, 3);
                return;
            }
            Logger.Instance().log('Opened database')
        });

        // Tables
        this.db.serialize(() => {
            this.db.run(`CREATE TABLE points (
                id INTEGER PRIMARY KEY,
                username VARCHAR(25) NOT NULL,
                points INTEGER DEFAULT 0)`)
        })
    }
}

module.exports = Database;