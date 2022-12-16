
require("express-async-errors"); 
 
const migrationsRun = require("./database/sqlite/migrations");
const AppError = require("./utils/AppError"); //

const express = require("express");
const routes = require("./routes")

migrationsRun();
const app = express();
app.use(express.json()); //dizendo para a api que o formato que estamos utilizando para vercionar informações é o json.
app.use(routes); // rotas da aplicação


app.use(( error, request, response, next) => { //

    if(error instanceof AppError){
        return response.status(error.statusCode).json({
            status: "error",
            message: error.message
        });
    }
    
    console.error(error);
    // Caso o erro não seja do cliente
    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
}); 

const PORT = 3333;
app.listen(PORT, () =>{ console.log(`Server is running port localhost:${PORT}`)});
