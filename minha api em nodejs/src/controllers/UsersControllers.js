
const { hash, compare} = require("bcryptjs"); // função que gera a criptografia
const AppError = require("../utils/AppError");  //Chamando a classe de erro
const sqliteConnection = require("../database/sqlite");

class  UsersCrontrollers {
   async create(request, response){
      const database = await sqliteConnection(); //Conexão com o banco
         const {name, email, password} = request.body;  //parãmetros na requisição

         const chekUsersExists = await database.get("SELECT * FROM users WHERE email = (?)", [email]) // buscando os úsuarios pelo e-mail informado no corpo da requisição, logo acim

         if (chekUsersExists){ //Se esse úsuario existe, eu vou executar uma excessão.
            throw new AppError("Este e-mail já está em uso. ");
         }

        
        const hashedPassword = await  hash(password, 8);//fazendo a criptografagem da senha. 1 pârametro e a senha e o segundo e a complexidade, escolhemos 8

        await database.run( 
            "INSERT INTO users (name, email, password) VALUES (? ,? ,?)", 
            [ name, email, hashedPassword ]
            ); //insera na tabela de usúario, esse nome,email e senha criptografada

        return response.status(201).json();  // devolvendo atráves de um json
    }

   async update(request, response){
     const {name, email, old_password} = request.body; //Pegando da requisição do corpo da pagina.
     const {id} = request.params;  // Pegando o parâmeto da requisição acima  

     const database = await sqliteConnection();
     const user = await database.get("SELECT * FROM users WHERE id = (?)", [id])

     if (!user){ // se o usúario não existir
        throw new AppError("Usúario não encontrado");
     }

     const UsersWithUpdatedEmail = await database.get("SELECT * FROM users WHERE email = (?)", [email]);

     if (UsersWithUpdatedEmail && UsersWithUpdatedEmail.id !== user.id){
        throw new AppError("Este e-mail já está em uso!");
     }

     user.name = name ?? user.name; // se existir contéudo dentro de name, então
     user.email = email ?? user.email;

     if(password && !old_password){
        throw new AppError("Você precisa informar a senha antiga para definir a nova senha");
     }

     if(password && old_password){
        const checkOldPassword = await compare(old_password, password);

        if(!checkOldPassword){
            throw new AppError("A senha antiga não confere. ");
        }

        user.password = await hash(password, 8);
     }

     await database.run(`
        UPDATE users SET
        name  = ?,
        email = ?,
        password = ?,
        updated_at = DATETIME('now') 
        WHERE id = ?`,
        [user.name , user.email , user.password, id]
     );

     return response.status(200).json();
   }
}

module.exports = UsersCrontrollers;


/*

Escrever o codigo no formato query buildr



*/