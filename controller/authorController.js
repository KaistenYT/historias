import Author from "../model/author.js";

export class AuthorController {
  
  static async getAllAuthors(req, res) {
    try {
      const authors = await Author.getAll();
      return res.json({
        success: true,
        data: authors
      });
    } catch (error) {
      console.error('Error al obtener los autores', error);
      return res.status(500).json({
        success: false,
        error: 'Error al obtener los autores',
        message: error.message // Incluye el mensaje de error para más detalle
      });
    }
  }

  
  static async getAuthorData() {
    try {
      const authors = await Author.getAll(); // Renombrado para consistencia
      return authors;
    } catch (error) {
      console.error('Error al obtener los autores para data', error);
      return []; // Mantén el comportamiento de devolver un array vacío en caso de error
    }
  }

  
  static async getAuthorById(req, res) {
    try {
      const author = await Author.getById(req.params.id);
      if (!author) {
        return res.status(404).json({
          success: false,
          error: 'Autor no encontrado'
        });
      }
      return res.json({
        success: true,
        data: author
      });
    } catch (error) {
      console.error('Error al obtener el autor por ID', error);
      return res.status(500).json({
        success: false,
        message: 'Error al obtener el autor',
        error: error.message
      });
    }
  }

  
  static async registerAuthor(req, res) {
    try {
      const newAuthor = await Author.create(req.body);
      return res.status(201).json({
        success: true,
        message: 'Autor creado correctamente',
        data: newAuthor
      });
    } catch (error) {
      console.error('Error al registrar el autor', error);
      return res.status(500).json({
        success: false,
        message: 'Error al registrar autor',
        error: error.message // Incluye el mensaje de error
      });
    }
  }

  static async updateAuthor(req, res) {
    try {
      const updatedAuthor = await Author.update(req.params.id, req.body); // Cambiado a updatedAuthor
      if (!updatedAuthor) { // Verificamos si updatedAuthor es null o undefined
        return res.status(404).json({
          success: false,
          error: 'Autor no encontrado'
        });
      }
      return res.json({
        success: true,
        message: 'Autor actualizado correctamente',
        data: updatedAuthor // Devolvemos los datos actualizados
      });
    } catch (error) {
      console.error('Error al actualizar el autor', error);
      return res.status(500).json({
        success: false,
        message: 'Error al actualizar autor',
        error: error.message
      });
    }
  }

  static async deleteAuthor(req, res) {
    try {
      const deletedAuthor = await Author.delete(req.params.id); // Cambiado a deletedAuthor
      if (!deletedAuthor) { // Verificamos si deletedAuthor es null o undefined
        return res.status(404).json({
          success: false,
          error: 'Autor no encontrado'
        });
      }
      return res.json({
        success: true,
        message: 'Autor eliminado correctamente',
        data: deletedAuthor  // Devolvemos los datos eliminados
      });
    } catch (error) {
      console.error('Error al eliminar el autor', error);
      return res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
}
