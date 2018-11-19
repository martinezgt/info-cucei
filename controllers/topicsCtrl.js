const { TopicMdl } = require('../models');
const { ResMdl } = require('../models');

class TopicCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.modify = this.modify.bind(this);
    this.delete = this.delete.bind(this);
    this.deleteAll = this.deleteAll.bind(this);
    this.modifyJSON = {
      status: 201,
      response: null,
      message: null,
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
    this.badRequestJSON = {
      status: 400,
      response: 'Bad request',
      message: null,
      data: null,
    };
    this.notFoundJSON = {
      status: 404,
      response: 'Noy found',
      message: null,
      data: null,
    };
  }

  /**
 * [getAll is a function that returns all the topics from the db or specific data
 * specified in a query. First it validates if we sent a query, if you send a
 * query it sends it to a function of topicMdl (modles/topicMdl), else it call
 * a function to get all the topics registered in the db].
 * @param  {Object}  req [description]
 * @param  {Object}  res [response sent to the browser with the data extracted,
 * a message, a status and a response]
 * @return Void funtion
 */
  async getAll(req, res) {
    const { query } = req;
    //  GET ALL
    if (Object.keys(query).length === 0 && query.constructor === Object) {
      try {
        this.data = await TopicMdl.getAll();
        if (this.data === undefined || this.data.length === 0) {
          this.notFoundJSON.message = 'you don´t have any data';
          res.status(404).send(this.notFoundJSON);
        } else {
          this.requestJSON.message = 'Data succesfully retrieve';
          this.requestJSON.data = this.data;
          res.send(this.requestJSON);
        }
      } catch (e) {
        console.error(`error!! ${e}`);
        this.badRequestJSON.message = 'Something went wrong! Monkeys working on it';
        res.status(400).send(this.badRequestJSON);
      }
      //  GET query data
    } else {
      try {
        this.data = await TopicMdl.find(query);
        if (this.data === undefined || this.data.length === 0) {
          this.notFoundJSON.message = 'you don´t have any data';
          res.status(404).send(this.notFoundJSON);
        } else {
          this.requestJSON.message = 'Data succesfully retrieve';
          this.requestJSON.data = this.data;
          res.send(this.requestJSON);
        }
      } catch (e) {
        console.error(`error!! ${e}`);
        this.notFoundJSON.message = 'Something went wrong, be careful!';
        res.status(404).send(this.notFoundJSON);
      }
    }
  }
  /**
 * [this function gets an specific data using an id]
 * @param  {Object}  req [description]
 * @param  {Object}  res [response sent to the browser with the data extracted,
 * a message, a status and a response]
 * @return Void funtion
 */

  async get(req, res) {
    const { topicId } = req.params;
    try {
      this.data = await TopicMdl.find(topicId);
      if (this.data === undefined || this.data.length === 0) {
        this.notFoundJSON.message = 'you don´t have any data';
        res.status(404).send(this.notFoundJSON);
      } else {
        this.requestJSON.message = 'Data succesfully retrieve';
        this.requestJSON.data = this.data;
        res.send(this.requestJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      this.notFoundJSON.message = 'Something went wrong, be careful!';
      res.status(404).send(this.notFoundJSON);
    }
  }

  /**
 * [the function creates an instance of the topicMdl class (models/topicMdl)
 * the it calls the save function to indicate that we want to register this
 * data to the db.]
 * @param  {Object}  req [description]
 * @param  {Object}  res [response sent to the browser with the data extracted,
 * a message, a status and a response]
 * @return Void funtion
 */
  async create(req, res) {
    const topic = new TopicMdl(req.body);
    try {
      this.response = await topic.save();
      if (this.response === undefined) {
        this.badRequestJSON.message = 'Something went wrong! Monkeys working on it';
        res.status(400).send(this.badRequestJSON);
      }
      if (this.response === 1) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      }
      const id = this.response.insertId;
      if (id > 0) {
        this.requestJSON.message = 'Data succesfully created';
        this.requestJSON.data = this.response;
        this.requestJSON.code = 201;
        res.status(201).send(this.requestJSON);
      } else {
        this.badRequestJSON.message = 'Something went wrong! Monkeys working on it';
        res.status(400).send(this.badRequestJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      this.badRequestJSON.message = 'Something went wrong! Monkeys working on it';
      res.status(400).send(this.badRequestJSON);
    }
  }

  /**
  * [modify the name of the topic.]
  * * @param  {Object}  req [description]
  * @param  {Object}  res [response sent to the browser with the data extracted,
  * a message, a status and a response]
  * @return Void funtion
  */
  async modify(req, res) {
    const topic = new TopicMdl(req.body);
    try {
      this.topicModify = await topic.modify(req.params.topicId);
      if (this.topicModify === undefined) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      } else {
        this.requestJSON.message = 'Data succesfully modified';
        this.requestJSON.data = this.topicModify;
        res.status(200).send(this.requestJSON);
      }
    } catch (e) {
      this.badRequestJSON.message = 'Something went wrong! Monkeys working on it';
      res.status(400).send(this.badRequestJSON);
    }
  }

  /**
   * [it calls a function that delete the posts, we send the id to make it easier
   * to identify]
   * @param  {Object}  req [description]
   * @param  {Object}  res [response sent to the browser with the data extracted,
   * a message, a status and a response]
   * @return Void funtion
   */
  async delete(req, res) {
    const topic = new TopicMdl(req.body);
    try {
      this.deleted = await topic.delete(req.params.topicId);
      if (this.deleted === undefined) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      }
      if (this.deleted.affectedRows === 0 || this.deleted.affectedRows === undefined) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      } else {
        this.requestJSON.message = 'Data succesfully deleted';
        this.requestJSON.data = this.deleted;
        res.status(200).send(this.requestJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      this.badRequestJSON.message = 'One field is missings or data is wrong';
      res.status(400).send(this.badRequestJSON);
    }
  }

  /**
 * [deleteAll is a function that deletes the topic, his posts and his threads.]
 * @param  {Object}  req [object than contains the id that we are sending]
 * @param  {Object}  res [response sent to the browser with the data extracted,
 * a message, a status and a response]
 * @return Void funtion
 */
  async deleteAll(req, res) {
    const topic = new TopicMdl(req.body);
    let changed = 0;
    let resultado;
    try {
      resultado = await topic.deleteAll(req.params.topicId);
    } catch (e) {
      console.error(`error!! ${e}`);
      if (resultado === 1) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        changed = 1;
        res.status(400).send(this.badRequestJSON);
      }
    }
    try {
      this.deleted = await topic.delete(req.params.topicId);
      if (this.deleted === undefined) {
        if (changed === 0) {
          this.badRequestJSON.message = 'One field is missings or data is wrong';
          changed = 1;
          res.status(400).send(this.badRequestJSON);
        }
      } else {
        this.requestJSON.message = 'Data succesfully deleted';
        this.requestJSON.data = this.deleted;
        res.status(200).send(this.requestJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      if (changed === 0) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        changed = 1;
        res.status(400).send(this.badRequestJSON);
      }
    }
  }
}
module.exports = new TopicCtrl();
