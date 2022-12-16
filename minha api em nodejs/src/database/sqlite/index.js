const sqlite3 = require("sqlite3");
const sqlite = require("sqlite");
const path = require("path"); 

async function sqliteConnection(){
    const database = await sqlite.open({
        filename: path.resolve(__dirname, "..", "databse.db"),
        driver: sqlite3.Database //colocamos o driver que vamos utilizar.
    });
    return database;
}

module.exports = sqliteConnection;

//file name : dizemos onde o arquivo fica salvo.
//path.resolve(Função que faz funcionar nos outros sistemas)
//__dirname = pega de forma automatica onde estamos no projeto

