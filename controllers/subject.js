/**
 * @author tyler97
 */

const { Subject } = require('../models');

// FIXME En lugar de hacer los send de cada error, podria ser un next con error
//  y tener un metodo manejador de errores
// FIXME Recomiendo manejar los promises con await y try-catch en lugar de then y catch
/**
 * [SubjectCtrl controller used for the subject model
 * this class is used to access the methods of the subject model]
 */
class SubjectCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.insert = this.insert.bind(this);
    this.getSubject = this.getSubject.bind(this);
    this.del = this.del.bind(this);
    this.update = this.update.bind(this);

    this.modifyJSON = {
      status: 201,
      response: null,
      message: 'Subject modified',
      data: null,
    };

    this.requestJSON = {
      status: 200,
      response: 'Ok',
      message: null,
      data: null,
    };

    this.forbiddenJSON = {
      status: 403,
      response: 'Forbidden',
      message: null,
      data: null,
    };
  }

  /**
 * [getAll method used to call the getAll method of the subject model class]
 * @method getAll
 * @param  {[Object]}  req [Object representing the request from client]
 * @param  {[Object]}  res [Object representing the response]
 * @return {Promise}
 */

  async getAll(req, res) {
    try {
      await Subject.getAll()
        .then((data) => {
          this.requestJSON.data = data;
          res.status(this.requestJSON.status).send(this.requestJSON);
        })
        .catch((e) => {
          console.error(`.catch(${e})`);
          res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
        });
    } catch (e) {
      console.error(`try/catch(${e})`);
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  /**
 * [getSubject method used to get a specified subject
 * using the subject model's class get method and the
 * params.nrc value]
 * @method getSubject
 * @param  {[Object]}   req [Object representing the request from client]
 * @param  {[Object]}   res [Object representing the response]
 * @return {Promise}
 */

  async getSubject(req, res) {
    try {
      await Subject.validSubject(req.params.nrc)
        .then((exists) => {
          if (exists) {
            const condition = `nrc = ${req.params.nrc}`;
            Subject.get(['nrc', 'name', 'first_day', 'sec_day', 'classroom', 'section', 'credits', 'building', 'taught_by'], condition)
              .then((data) => {
                this.requestJSON.data = data;
                res.status(this.requestJSON.status).send(this.requestJSON);
              })
              .catch((e) => {
                console.error(`.catch(${e})`);
                res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
              });
          } else {
            this.forbiddenJSON.message = 'The requested subject cannot be found';
            res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
          }
        })
        .catch((e) => {
          console.error(`.catch(${e})`);
          res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
        });
    } catch (e) {
      console.error(`try/catch(${e})`);
      this.forbiddenJSON.message = 'Oops! Something unexpected happened.';
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  /**
 * [insert method used to insert a new subject into then
 * subject table, using the subject models save method,
 * and instantiating the class with the requests body]
 * @method insert
 * @param  {[Object]}  req [Object representing the request from client]
 * @param  {[Object]}  res [Object representing the response]
 * @return {Promise}
 */

  async insert(req, res) {
    console.log(req.body);
    const newSubject = new Subject({ ...req.body });
    try {
      await newSubject.save()
        .then((data) => {
          this.info = data;
          this.modifyJSON.response = 'Created';
          this.modifyJSON.message += ' created into database';
          this.modifyJSON.data = newSubject;
          res.status(this.modifyJSON.status).send(this.modifyJSON);
        })
        .catch((e) => {
          console.error(`.catch(${e})`);
          res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
        });
    } catch (e) {
      console.error(`try/catch(${e})`);
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  /**
  * [del method used to logically delete a specified subject
  * using req.params and the subject model class]
  * @method del
  * @param  {[Object]}  req [Object representing the request from client]
  * @param  {[Object]}  res [Object representing the response]
  * @return {Promise}
  */

  async del(req, res) {
    try {
      const condition = `nrc = ${req.params.nrc}`;
      await Subject.del(condition)
        .then((data) => {
          this.modifyJSON.data = data;
          this.modifyJSON.response = 'Deleted';
          this.modifyJSON.message += ' deleted from database';
          res.status(this.modifyJSON.status).send(this.modifyJSON);
        })
        .catch((e) => {
          console.error(`.catch(${e})`);
          res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
        });
    } catch (e) {
      console.error(`try/catch(${e})`);
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }

  /**
  * [del method used to update a specfied subject using the parametros nrc,
  * and using req.body to create a subject instance]
  * @method del
  * @param  {[Object]}  req [Object representing the request from client]
  * @param  {[Object]}  res [Object representing the response]
  * @return {Promise}
  */

  async update(req, res) {
    const updateSubject = new Subject({ ...req.body });
    try {
      await updateSubject.update(req.params.nrc)
        .then((data) => {
          this.modifyJSON.response = 'Updated';
          this.modifyJSON.message += ' updated from database';
          this.modifyJSON.data = data;
          res.status(this.modifyJSON.status).send(this.modifyJSON);
        })
        .catch((e) => {
          console.error(`.catch(${e})`);
          res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
        });
    } catch (e) {
      console.error(`try/catch(${e})`);
      res.status(this.forbiddenJSON.status).send(this.forbiddenJSON);
    }
  }
}

module.exports = new SubjectCtrl();
