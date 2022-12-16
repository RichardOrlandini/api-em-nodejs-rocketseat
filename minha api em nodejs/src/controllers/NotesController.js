const knex = require("../database/knex/index.js"); //index da pasta knex

class NotesController {
    async create(request, response){
        const {title, description, tags, links} = request.body; 
        const {user_id } = request.params; //Id do úsuario vindo da url

        const note_id = await knex("notes").insert({  //guardando o id da nota que está sendo cadastrada
            // fazendo a criação da nota no banco.
            title,
            description,
            user_id
        });
        //Criando um objeto, inserindo o codigo da nota que esse link está vinculado, ja que não são da mesma
        // tabela, e convertendo tbm de link para url


        const linksInsert = links.map(link =>{ // Pra cada item aqui
            return {
                note_id, //pegando id da nota
                url : link // Conversão
            }
        });
        await knex("links").insert(linksInsert); // Inserindo os links no banco.




        const tagsInsert = tags.map(name =>{ // percorremos no vetor de tags, pegando o id,nome, e id_note
            return {
                note_id,    
                name,
                user_id
            } //retornamos tudo dentro da variavel de tagsInsert 
        });
        await knex("tags").insert(tagsInsert); //Inserindo o novo vetor na tabala de tags 



        response.json();
    }

    async show(request, response){
        const {id} = request.params;

        const notes = await knex("notes").where({ id }).firt(); //Mostrando apenas uma nota especificadamente.
        const tags = await knex("tags").find({ note_id : id }).orderBy("name");
        const links = await knex("links").where({note_id : id}).orderBy("created_at");


        return response.json({
            ...notes, 
            tags,
            links
        }); // Retornando a nota em formato json para o front.
    }

    async delete(request, response){
        const { id }  = request.params;

        await knex("notes").where({ id }).delete();

        return response.json();
    }

    async index(request, response){
        const { title,  user_id, tags} = request.query;

        let notes;
        if (tags){ //Se exioste tags,vai ter um  filtro baseado  nelas.
            //Precisamos converter as tags de um texto simples para um vetor.
            const filterTags = tags.split(',').map(tag => tag.trim());//Convertendo esse texto em um array,com base em uma virgula.
            notes = await knex("tags")
            .select([
                "notes.id",
                "notes.title",
                "notes.user_id",
            ])
            .where("notes.user_id", user_id)
            .whereLike("notes.title", `%${title}%`)
            .whereIn("name", filterTags) //Comparar se a tag está aqui ou não   
            .innerJoin("notes", "notes.id", "tags.note_id")
            .orderBy("notes.title") //Organizando por ordem alfabetica o titulo.
        }else{
            notes = await knex("notes")
           .where({ user_id }) //Exibir somente as notas daquele úsuario
           .whereLike("title", `%${title}%`) //O porcento significa o antes e o depois. (Assim que fazemos para buscar por valores aproximados.)
           .orderBy("title");
        }

        const userTags = await knex("tags").where({user_id});
        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);

            return {
                ...note,
                tags: noteTags
            } 
        });

        return response.json({ notesWithTags });
    }
}

module.exports = NotesController;