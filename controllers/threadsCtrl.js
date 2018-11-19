const {
  ThreadMdl,
  PostMdl,
  ResMdl,
} = require('../models');

// FIXME En lugar de hacer los send de cada error, podria ser un next con error y tener un metodo manejador de errores

class ThreadCtrl {
  constructor() {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.modify = this.modify.bind(this);
    this.delete = this.delete.bind(this);
    this.getAllPosts = this.getAllPosts.bind(this);
    this.getPost = this.getPost.bind(this);
    this.createPost = this.createPost.bind(this);
    this.updatePost = this.updatePost.bind(this);
    this.deletePost = this.deletePost.bind(this);
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
 * getAll: gets all the data from the DB by calling a model, it offers you
 * two ways of retrieving the data, one by sending a query or the other
 * is getting everything.
 * @param  {Object}  req
 * @param  {Object}  res
 */
  async getAll(req, res) {
    const { query } = req;
    const { topicId } = req.params;
    //  GET All
    if (Object.keys(query).length === 0 && query.constructor === Object) {
      try {
        this.data = await ThreadMdl.getAll(topicId);
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
      //  GET query Data
    } else {
      try {
        this.data = await ThreadMdl.find(query, topicId);
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
        this.notFoundJSON.message = 'you don´t have any data';
        res.status(404).send(this.notFoundJSON);
      }
    }
  }

  /**
 * get: gets data using an specific id.
 * @param  {Object}  req
 * @param  {Object}  res
 */
  async get(req, res) {
    const { threadId } = req.params;
    try {
      this.data = await ThreadMdl.find(threadId, req.params.topicId);
      if (this.data === undefined || this.data.length === 0) {
        this.notFoundJSON.message = 'you don´t have any data';
        res.status(404).send(this.notFoundJSON);
      } else {
        this.requestJSON.message = 'Data succesfully retrieve';
        this.requestJSON.data = this.data;
        res.send(this.requestJSON);
      }
    } catch (e) {
      console.error('error!');
      this.notFoundJSON.message = 'you don´t have any data';
      res.status(404).send(this.notFoundJSON);
    }
  }

  /**
 * function that regist a data using an ORM.
 * @param  {Object}  req
 * @param  {Object}  res
 */
  async create(req, res) {
    req.body.topic_id = req.params.topicId;
    const date = new Date().toJSON().slice(0, 19).replace('T', ' ');
    req.body.created = date;
    const thread = new ThreadMdl(req.body);
    try {
      this.response = await thread.save();
      if (this.response === 1 || this.response === 2) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      }
      const id = this.response.insertId;
      if (id === undefined) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      }
      if (id > 0) {
        this.requestJSON.message = 'Data succesfully created';
        this.requestJSON.data = this.response;
        this.requestJSON.code = 201;
        res.status(201).send(this.requestJSON);
      } else {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      this.forbiddenJSON.message = 'Something went wrong! Monkeys working on it';
      res.status(403).send(this.forbiddenJSON);
    }
  }

  /**
 * modify takes a given id and modifies the date and the information of the
 * thread
 * @param  {Object}  req
 * @param  {Object}  res
 */
  async modify(req, res) {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    req.body.created = date;
    const thread = new ThreadMdl(req.body);
    try {
      this.data = await thread.modify(req.params.threadId, req.params.topicId);
      if (this.data === undefined) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      } else {
        this.modifyJSON.message = 'Data succesfully modified';
        this.modifyJSON.data = this.data;
        res.status(201).send(this.modifyJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      this.forbiddenJSON.message = 'Something went wrong! Monkeys working on it';
      res.status(403).send(this.forbiddenJSON);
    }
  }

  /**
 * delete one thread using his id.
 * @param  {Object}  req
 * @param  {Object}  res
 */
  async delete(req, res) {
    try {
      this.data = await ThreadMdl.deleteReal(req.params.threadId);
      if (this.data === undefined) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      } else if (this.data.affectedRows === 0) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      } else {
        this.requestJSON.message = 'Data succesfully deleted';
        this.requestJSON.data = this.data;
        res.status(200).send(this.requestJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      this.forbiddenJSON.message = 'Something went wrong! Monkeys working on it';
      res.status(403).send(this.forbiddenJSON);
    }
  }

  /**
  * getAll: gets all the data from the DB by calling a model, it offers you
  * two ways of retrieving the data, one by sending a query or the other
  * is getting everything.
  * @param  {Object}  req
  * @param  {Object}  res
  */
  async getAllPosts(req, res) {
    const { query } = req;
    const { threadId } = req.params;
    //  GET All
    if (Object.keys(query).length === 0 && query.constructor === Object) {
      try {
        this.data = await PostMdl.getAll(threadId);
        if (this.data === undefined || this.data.length === 0) {
          this.notFoundJSON.message = 'you don´t have any data';
          res.status(404).send(this.notFoundJSON);
        } else {
          const message = 'Data succesfully retrieve';
          this.requestJSON.message = message;
          this.requestJSON.data = this.data;
          res.send(this.requestJSON);
        }
      } catch (e) {
        console.error(`error!! ${e}`);
        this.badRequestJSON.message = 'Something went wrong! Monkeys working on it';
        res.status(400).send(this.badRequestJSON);
      }
      //  GET query Data
    } else {
      try {
        this.data = await PostMdl.find(query, threadId);
        if (this.data === undefined || this.data.length === 0) {
          this.notFoundJSON.message = 'you don´t have any data';
          res.status(404).send(this.notFoundJSON);
        } else {
          const message = 'Data succesfully retrieve';
          this.requestJSON.message = message;
          this.requestJSON.data = this.data;
          res.send(this.requestJSON);
        }
      } catch (e) {
        console.error(`error!! ${e}`);
        this.badRequestJSON.message = 'Something went wrong! Monkeys working on it';
        res.status(400).send(this.badRequestJSON);
      }
    }
  }

  /**
 * get: gets data using an specific id.
 * @param  {Object}  req
 * @param  {Object}  res
 */
  async getPost(req, res) {
    const { postId } = req.params;
    let data;
    try {
      data = await PostMdl.find(postId, req.params.threadId);
    } catch (e) {
      this.notFoundJSON.message = 'you don´t have any data';
      res.status(404).send(this.notFoundJSON);
    }
    if (data === undefined || data.length === 0) {
      this.notFoundJSON.message = 'you don´t have any data';
      res.status(404).send(this.notFoundJSON);
    } else {
      this.requestJSON.message = 'Data succesfully retrieve';
      this.requestJSON.data = data;
      res.send(this.requestJSON);
    }
  }

  /**
  * function that regist a data using an ORM.
  * @param  {Object}  req
  * @param  {Object}  res
  */
  async createPost(req, res) {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    req.body.date = date;
    req.body.thread_id = req.params.threadId;
    const post = new PostMdl(req.body);
    try {
      this.data = await post.save();
      if (this.data === undefined) {
        this.badRequestJSON.message = 'Something went wrong! Maybe thread does not exist';
        this.badRequestJSON.data = this.data;
        res.status(400).send(this.badRequestJSON);
      }
      const id = this.data.insertId;
      if (this.data === 1 || id === undefined) {
        this.badRequestJSON.message = 'One field is missings.';
        this.badRequestJSON.data = this.data;
        res.status(400).send(this.badRequestJSON);
      } else if (id > 0) {
        this.requestJSON.message = 'Data succesfully created';
        this.requestJSON.data = this.data;
        this.requestJSON.code = 201;
        res.status(201).send(this.requestJSON);
      } else {
        this.badRequestJSON.message = 'Nothing was saved';
        this.badRequestJSON.data = this.data;
        res.status(400).send(this.badRequestJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      this.forbiddenJSON.message = 'Something went wrong! Monkeys working on it';
      res.status(403).send(this.forbiddenJSON);
    }
  }

  /**
 * modify takes a given id and modifies the date and the information of the
 * thread
 * @param  {Object}  req
 * @param  {Object}  res
 */
  async updatePost(req, res) {
    const date = new Date().toISOString().slice(0, 19).replace('T', ' ');
    req.body.date = date;
    const post = new PostMdl(req.body);
    try {
      this.data = await post.modify(req.params.postId, req.params.threadId);
      if (this.data === undefined) {
        this.badRequestJSON.message = 'One field is missings or data is wrong';
        res.status(400).send(this.badRequestJSON);
      } else {
        this.requestJSON.message = 'Data succesfully modified';
        this.requestJSON.data = this.data;
        res.status(200).send(this.requestJSON);
      }
    } catch (e) {
      this.badRequestJSON.message = 'One field is missings or data is wrong';
      res.status(400).send(this.badRequestJSON);
    }
  }

  /**
  * delete one thread using his id.
  * @param  {Object}  req
  * @param  {Object}  res
  */
  async deletePost(req, res) {
    const post = new PostMdl(req.body);
    try {
      this.data = await post.delete(req.params.postId);
      if (this.data === undefined) {
        this.badRequestJSON.message = 'Something went wrong! Check the id';
        res.status(400).send(this.badRequestJSON);
      } else if (this.data.affectedRows === 0) {
        this.badRequestJSON.message = 'Something went wrong! Check the id';
        res.status(400).send(this.badRequestJSON);
      } else {
        this.requestJSON.message = 'Data succesfully deleted';
        this.requestJSON.data = this.data;
        res.status(200).send(this.requestJSON);
      }
    } catch (e) {
      console.error(`error!! ${e}`);
      this.forbiddenJSON.message = 'Something went wrong! Monkeys working on it';
      res.status(403).send(this.forbiddenJSON);
    }
  }
}
module.exports = new ThreadCtrl();
