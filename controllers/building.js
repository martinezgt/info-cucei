/**
 * @Author: schwarze_falke
 * @Date:   2018-10-07T20:34:36-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-07T22:20:58-05:00
 */

const { BuildingMdl } = require('../models');

// FIXME Todos los metodos deben estar documentados
// FIXME En lugar de hacer los send de cada error, podria ser un next con error y tener un metodo manejador de errores
// FIXME Recomiendo manejar los promises con await y try-catch en lugar de then y catch

class BuildingCrtl {
  constructor() {
    // Binding class methods of the controller
    this.getAll = this.getAll.bind(this);
    this.getBuild = this.getBuild.bind(this);
    this.insert = this.insert.bind(this);
    this.modify = this.modify.bind(this);
    this.logDel = this.logDel.bind(this);

    // Defines a format to give a success response at requesting
    this.okJSON = {
      status: 200,
      response: 'Ok',
      message: null,
      data: null,
    };

    // Defines a format to give a create response at requesting
    this.createJSON = {
      status: 201,
      response: null,
      message: 'Building successfully',
      data: null,
    };

    // Defines a format to give a no content response at requesting
    this.noContentJSON = {
      status: 204,
      response: null,
      message: 'No Content',
      data: null,
    };

    // Defines a format to give a bad request response at requesting
    this.badRequestJSON = {
      status: 400,
      response: null,
      message: 'Bad request',
      data: null,
    };

    // Defines a format to give a forbidden response at requesting
    this.forbiddenJSON = {
      status: 403,
      response: 'Forbidden',
      message: null,
      data: null,
    };

    // Defines a format to give a not found response at requesting
    this.notFoundJSON = {
      status: 404,
      response: null,
      message: 'Not found',
      data: null,
    };
  }

  /* Validate if database does have content and returns
   * all buildings data
   */
  async getAll(req, res) {
    try {
      await BuildingMdl.getAll()
        .then((data) => {
          if (data.length === 0) {
            res.status(this.noContentJSON.status).send(this.noContentJSON);
          } else {
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

  /* Validate if a specific id building exist and
  * return data building
  */
  async getBuild(req, res) {
    try {
      await BuildingMdl.validBuilding(req.params.buildingId)
        .then((exists) => {
          if (exists) {
            BuildingMdl.get('*', req.params.buildingId)
              .then((data) => {
                this.okJSON.data = data;
                res.status(this.okJSON.status).send(this.okJSON);
              })
              .catch(e => console.error(`We have a error!(${e})`));
          } else {
            this.notFoundJSON.message = 'The requested building dont exist';
            res.status(this.notFoundJSON.status).send(this.notFoundJSON);
          }
        })
        .catch(e => console.error(`We have a error!(${e})`));
    } catch (e) {
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
      console.error(`We have a error!(${e})`);
    }
  }

  /* Insert data building if new id building dont exist
   * and send a response with result
   */
  async insert(req, res) {
    const newBuilding = new BuildingMdl({ ...req.body });
    try {
      await BuildingMdl.validBuilding(req.body.building_id)
        .then((exists) => {
          if (!exists) {
            newBuilding.save()
              .then((data) => {
                console.log(`Crated new building with id: ${req.body.building_id}`);
                this.info = data;
                this.createJSON.response = 'Created';
                this.createJSON.message = 'Created new building';
                this.createJSON.data = newBuilding;
                res.status(this.createJSON.status).send(this.createJSON);
              })
              .catch(e => console.error(`We have a error!(${e})`));
          } else {
            this.badRequestJSON.message = 'we have a building with this id';
            res.status(this.badRequestJSON.status).send(this.badRequestJSON);
          }
        })
        .catch(e => console.error(`We have a error!(${e})`));
    } catch (e) {
      res.status(this.badRequestJSON.status).send(this.badRequestJSON);
      console.error(`We have a error!(${e})`);
    }
  }

  /* Modify data a specific building
   * and send a response with result
   */
  async modify(req, res) {
    const modifyBuilding = new BuildingMdl({ ...req.body });
    try {
      await BuildingMdl.validBuilding(req.params.buildingId)
        .then((exists) => {
          if (exists) {
            modifyBuilding.update(req.params.buildingId)
              .then((data) => {
                console.log('You modify a building');
                this.okJSON.response = 'Updated';
                this.okJSON.message = 'You modify a building';
                this.okJSON.data = data;
                res.status(this.okJSON.status).send(this.okJSON);
              })
              .catch(e => console.error(`We have a error!(${e})`));
          } else {
            this.notFoundJSON.message = 'The requested building dont exist';
            res.status(this.notFoundJSON.status).send(this.notFoundJSON);
          }
        })
        .catch(e => console.error(`We have a error!(${e})`));
    } catch (e) {
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
      console.error(`We have a error!(${e})`);
    }
  }

  /* Logic detele data a specific building
   * and send a response with result
   */
  async logDel(req, res) {
    const updateBuilding = new BuildingMdl({ ...req.body });
    try {
      await BuildingMdl.validBuilding(req.params.buildingId)
        .then((exists) => {
          if (exists) {
            updateBuilding.logicalDel(req.params.buildingId)
              .then((data) => {
                console.log('You delete a building');
                this.okJSON.response = 'Deleted';
                this.okJSON.message = 'You delete a building';
                this.okJSON.data = data;
                res.status(this.okJSON.status).send(this.okJSON);
              })
              .catch(e => console.error(`We have a error!(${e})`));
          } else {
            this.notFoundJSON.message = 'The requested building dont exist';
            res.status(this.notFoundJSON.status).send(this.notFoundJSON);
          }
        })
        .catch(e => console.error(`We have a error!(${e})`));
    } catch (e) {
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
      console.error(`We have a error!(${e})`);
    }
  }
}
module.exports = new BuildingCrtl();
