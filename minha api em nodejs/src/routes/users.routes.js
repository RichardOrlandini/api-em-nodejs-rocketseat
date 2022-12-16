// responsabilidade de conhecer as rotas do úsuario.


const {Router} = require("express");

const UsersCrontrollers = require("../controllers/UsersControllers")

const usersRoutes = Router();

const usersControllers = new UsersCrontrollers();

usersRoutes.post("/", usersControllers.create);
usersRoutes.put("/:id", usersControllers.update);

module.exports = usersRoutes;

