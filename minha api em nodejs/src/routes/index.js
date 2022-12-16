//para não ter que toda vez ir ate o server e importar uma nova rota,
//temos o index que importa todas que vamos precisar na aplicação.


const {Router}  = require("express");
const usersRoutes = require("./users.routes");
const notesRoutes = require("./notes.routes");
const tagsRoutes = require("./tags.routes");

const routes = Router();

routes.use("/users", usersRoutes);
routes.use("/notes", notesRoutes);
routes.use("/tags", tagsRoutes);

module.exports = routes;