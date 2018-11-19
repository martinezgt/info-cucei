// FIXME Los atributos usados para documentacion son en minusculas y de estos solo author es valido
/**
 * @Author: schwarze_falke
 * @Date:   2018-09-20T09:59:17-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-27T04:54:30-05:00
 */
const db = require('../db'); // for database handling

// FIXME se pueden cargar todos los modelos de golpe
const {
  UserMdl,
  ScheduleMdl,
  Subject,
  RoadMdl,
  ResMdl,
} = require('../models'); // for model handling

/**
 * Name: user.js | Type: Class | Description: User Controller | @Author: Carlos Vara
 *                                 METHODS
 * constructor()  ->  Defines the JSON responses & method bindings
 * -----------------------------------------------------------------------------
 * Getters:
 * ---> getAll(req, res)        ->  Returns a full name
 * ---> getUser(req, res)       ->  Returns a student code
 * ---> getRoads(req, res)      ->  Return an email
 * ---> getSchedule(req, res)   ->  Returns an user ID validation
 * ---> getPosts(req, res)      ->
 * -----------------------------------------------------------------------------
 * Data Handling:
 * ---> insert(req, res)        ->  Returns all database users
 * ---> del(req, res)           ->  Deletes by a condition
 * ---> save(req, res)          ->  Saves the object into database
 * ---> update(req, res)        ->  Updates the requested user
 * -----------------------------------------------------------------------------
 */

// FIXME Todos los metodos deben estar documentados
// FIXME En lugar de hacer los send de cada error, podria ser un next con error y tener un metodo manejador de errores
// FIXME Recomiendo manejar los promises con await y try-catch en lugar de then y catch

class UserCtrl {
  constructor() {
    // Binding class methods of the controller
    this.getAll = this.getAll.bind(this);
    this.getUser = this.getUser.bind(this);
    this.getRoads = this.getRoads.bind(this);
    this.getSchedule = this.getSchedule.bind(this);
    this.getPosts = this.getPosts.bind(this);
    this.insertUser = this.insertUser.bind(this);
    this.insertSchedule = this.insertSchedule.bind(this);
    this.del = this.del.bind(this);
  }

  /**
   * getAll: Returns all the data from database via user model
   * @param  {[type]} req
   * @param  {[type]} res
   * @return {[type]}     not-formatted rows (pending)
   */
  async getAll(req, res) {
    const newResponse = new ResMdl();
    try {
      await UserMdl.getAll(req.query)
        .then((data) => {
          if (data.length > 1) {
            newResponse.createResponse(data, 200, '/users', 'GET');
          } else {
            newResponse.createResponse(data, 204, '/users', 'GET');
          }
          newResponse.response.message = newResponse.createMessage();
          this.response = newResponse;
          res.status(this.response.response.status).send(this.response.response);
        });
    } catch (e) { // FIXME como ya se esta haciendo un catch en el promise, este no es necesario
      newResponse.response('There is nothing to retrieve', 500, e, 'GET');
      newResponse.response.message = newResponse.createMessage();
      this.response = newResponse;
      res.status(this.response.response.status).send(this.response.response);
    }
  }

  async getUser(req, res) {
    const newResponse = new ResMdl();
    try {
      await UserMdl.validUser(req.params.userId)
        .then((exists) => {
          if (exists) {
            UserMdl.get('*', req.params.userId, req.query)
              .then((data) => {
                if (data.length >= 1) {
                  newResponse.createResponse(data, 200, '/users', 'GET');
                } else {
                  newResponse.createResponse(data, 204, '/users', 'GET');
                }
                newResponse.response.message = newResponse.createMessage();
                this.response = newResponse;
                res.status(this.response.response.status).send(this.response.response);
              });
          } else {
            newResponse.createResponse('Nothing to show', 404, '/users', 'GET');
            newResponse.response.message = newResponse.createMessage();
            this.response = newResponse;
            res.status(this.response.response.status).send(this.response.response);
          }
        });
    } catch (e) {
      newResponse.response('There is nothing to retrieve', 500, e, 'GET');
      newResponse.response.message = newResponse.createMessage();
      this.response = newResponse;
      res.status(this.response.response.status).send(this.response.response);
    }
  }

  async getRoads(req, res) {
    const newResponse = new ResMdl();
    try {
      if (await UserMdl.validUser(req.params.userId)) {
        const condition = `stud_id = ${req.params.userId}`;
        await RoadMdl.getBuildings('subject_id', condition)
          .then(async (buildings) => {
            await RoadMdl.getRoad(buildings)
              .then((data) => {
                if (data.length >= 1) {
                  newResponse.createResponse(data, 200, '/users', 'GET');
                } else {
                  newResponse.createResponse(data, 204, '/users', 'GET');
                }
                newResponse.response.message = newResponse.createMessage();
                this.response = newResponse;
                res.status(this.response.response.status).send(this.response.response);
              });
          });
      } else {
        newResponse.createResponse('Nothing to show', 404, '/users', 'GET');
        newResponse.response.message = newResponse.createMessage();
        this.response = newResponse;
        res.status(this.response.response.status).send(this.response.response);
      }
    } catch (e) {
      newResponse.response('There is nothing to retrieve', 500, e, 'GET');
      newResponse.response.message = newResponse.createMessage();
      this.response = newResponse;
      res.status(this.response.response.status).send(this.response.response);
    }
  }

  async getSchedule(req, res) {
    const newResponse = new ResMdl();
    try {
      if (await UserMdl.validUser(req.params.userId)) {
        const condition = `stud_id = ${req.params.userId}`;
        await ScheduleMdl.get('subject_id', condition)
          .then((data) => {
            if (data.length >= 1) {
              newResponse.createResponse(data, 200, '/users', 'GET');
            } else {
              newResponse.createResponse(data, 204, '/users', 'GET');
            }
            newResponse.response.message = newResponse.createMessage();
            this.response = newResponse;
            res.status(this.response.response.status).send(this.response.response);
          });
      } else {
        newResponse.createResponse('Nothing to show', 404, '/users', 'GET');
        newResponse.response.message = newResponse.createMessage();
        this.response = newResponse;
        res.status(this.response.response.status).send(this.response.response);
      }
    } catch (e) {
      newResponse.response('There is nothing to retrieve', 500, e, 'GET');
      newResponse.response.message = newResponse.createMessage();
      this.response = newResponse;
      res.status(this.response.response.status).send(this.response.response);
    }
  }

  async getPosts(req, res) {
    const newResponse = new ResMdl();
    try {
      const condition = `user_code = ${req.params.userId}`;
      await db.get('post', '*', condition)
        .then((data) => {
          this.requestJSON.data = data;
          res.status(this.requestJSON.status).send(this.requestJSON);
        })
        .catch(e => console.error(`.catch(${e})`));
    } catch (e) {
      console.error(`try/catch(${e})`);
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  async insertUser(req, res) {
    const newResponse = new ResMdl();
    const newUser = new UserMdl({ ...req.body });
    try {
      await newUser.save()
        .then((data) => {
          this.info = data;
          this.modifyJSON.response = 'Created';
          this.modifyJSON.message = 'User successfully created into database';
          this.modifyJSON.data = newUser;
          res.status(this.modifyJSON.status).send(this.modifyJSON);
        })
        .catch(e => console.error(`.catch(${e})`));
    } catch (e) {
      console.error(`try/catch(${e})`);
      this.forbiddenJSON.data = e;
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  async insertSchedule(req, res) {
    const newResponse = new ResMdl();
    try {
      await UserMdl.validUser(req.params.userId)
        .then(async (exists) => {
          if (exists) {
            await Subject.createRelation(req.params.userId, req.body.nrc)
              .then((results) => {
                this.modifyJSON.response = 'Created';
                this.modifyJSON.message = `New subject on user ${req.params.userId} schedule successfully created`;
                this.modifyJSON.data = results;
                res.status(this.modifyJSON.status).send(this.modifyJSON);
              })
              .catch(e => console.error(`.catch(${e})`));
          }
        });
    } catch (e) {
      console.error(`try/catch(${e})`);
      this.forbiddenJSON.data = e;
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  async del(req, res) {
    const newResponse = new ResMdl();
    try {
      await UserMdl.del(req.params.userId, req.query)
        .then((data) => {
          this.modifyJSON.data = data;
          this.modifyJSON.response = 'Deleted';
          this.modifyJSON.message = 'User successfully deleted from database';
          res.status(this.modifyJSON.status).send(this.modifyJSON);
        })
        .catch(e => console.error(`.catch(${e})`));
    } catch (e) {
      console.error(`try/catch(${e})`);
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  async updatePUT(req, res) {
    const newResponse = new ResMdl();
    const updateUser = new UserMdl({ ...req.body });
    try {
      await updateUser.update(req.params.userId)
        .then((data) => {
          const dataJSON = {
            status: 201,
            response: 'Updated',
            message: 'User successfully updated from database',
            data: updateUser,
            modified: data,
          };
          res.status(dataJSON.status).send(dataJSON);
        })
        .catch(e => console.error(`.catch(${e})`));
    } catch (e) {
      console.error(`try/catch(${e})`);
      // FIXME En lugar de hacer los send de cada error, podria ser un next con error y tener un metodo manejador de errores
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  async updatePATCH(req, res) {
    const newResponse = new ResMdl();
    const updateUser = new UserMdl({ ...req.body });
    try {
      await updateUser.update(req.params.userId)
        .then((data) => {
          const dataJSON = {
            status: 201,
            response: 'Updated',
            message: 'User successfully updated from database',
            data: updateUser,
            modified: data,
          };
          res.status(dataJSON.status).send(dataJSON);
        })
        .catch(e => console.error(`.catch(${e})`));
    } catch (e) {
      console.error(`try/catch(${e})`);
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }
}

module.exports = new UserCtrl();
