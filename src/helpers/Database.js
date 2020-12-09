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
            this.db.run(`CREATE TABLE IF NOT EXISTS points (
                id INTEGER PRIMARY KEY,
                username VARCHAR(25) NOT NULL,
                points INTEGER DEFAULT 0)`)
        });
    }

    addPoints(username, points){
        this.db.serialize(() => {
            this.db.get(`SELECT * FROM points WHERE username="${username}"`, (err, row) => {
                if (err){
                    Logger.Instance().log(`ERROR: ${err}`);
                    return;
                }
                if (row){
                    const currentPoints = row.points;
                    let amount = currentPoints + points;
                    this.db.run(`UPDATE points SET points=${amount} WHERE username="${username}"`);
                    Logger.Instance().log(`Added ${points} points to ${username}`, 1);
                } else {
                    this.db.run(`INSERT INTO points (username) VALUES ("${username}")`)
                }

            })
        });
    }

    removePoints(username, points){
        this.db.serialize(() => {
            this.db.get(`SELECT * FROM points where username="${username}"`, (err, row) => {
                if (err){
                    Logger.Instance().log(`ERROR: ${err}`);
                    return;
                }
                if (row){
                    const currentPoints = row.points;
                    let amount = ((currentPoints - points) >= 0) ? currentPoints - points : 0;
                    if (amount){
                        this.db.run(`UPDATE points SET points=${amount} WHERE username="${username}"`);
                        Logger.Instance().log(`Removed ${points} points to ${username}`, 1);
                    }
                } else {
                }
            })
        })
    }
}

module.exports = Database;