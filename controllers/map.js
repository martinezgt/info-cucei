const { MapsMdl } = require('../models');

// FIXME Todos los metodos deben estar documentados
// FIXME En lugar de hacer los send de cada error, podria ser un next con error y tener un metodo manejador de errores
// FIXME Recomiendo manejar los promises con await y try-catch en lugar de then y catch

 class MapCtrl {
  constructor() {
    // Binding class methods of the controller
    this.get = this.get.bind(this);

    //Defines a format to give a success response at requesting
    this.okJSON = {
      status: 200,
      response: 'Ok',
      message: null,
      data: null,
    };
    //Defines a format to give a no content response at requesting
    this.noContentJSON = {
      status: 204,
      response: null,
      message: 'No Content',
      data: null,
    };
    //Defines a format to give a forbidden response at requesting
    this.forbiddenJSON = {
      status: 403,
      response: 'Forbidden',
      message: null,
      data: null,
    };

  };

  /*Validate if database does have content and returns
   *all buildings data
   */
  async get(req, res) {
   try {
     await MapsMdl.get()
      .then((data) => {
         if(data.length === 0){
            res.status(this.noContentJSON.status).send(this.noContentJSON);
          }else{
            console.log('You see all buildings');
            this.okJSON.message = 'You see all buildings';
            this.okJSON.data = data;
            res.status(this.okJSON.status).send(this.okJSON);
          }
        })
        .catch(e => console.error(`We have a error!(${e})`));
   } catch (e) {
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
      console.error(`We have a error!(${e})`);
   }
 }
}

module.exports = new MapCtrl();
