/**
 * @Author: schwarze_falke
 * @Date:   2018-09-21T19:39:23-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-27T04:53:57-05:00
 */

const bcrypt = require('bcrypt');

const ThreadMdl = require('./thread');
const PostMdl = require('./post');
const db = require('../db'); // for database handling
/**
 * Name: user.js | Type: Class | Description: User Model | @Author: Carlos Vara
 *                                 METHODS
 * constructor(args)  ->  Defines all the properties of the model
 * -----------------------------------------------------------------------------
 * Getters:
 * ---> getFullName(order)      ->  Returns a full name
 * ---> getStudCode()           ->  Returns a student code
 * ---> getEmail()              ->  Return an email
 * ---> validColumns()          ->  Returns an user ID validation
 * -----------------------------------------------------------------------------
 * Processing:
 * ---> processResult(data)     ->  Processes row data from database
 * ---> processConditions(data) ->  Filters the params for the query condition
 * ---> validUser(id)           ->  Verifies the existence in database of an user
 * -----------------------------------------------------------------------------
 * Data Handling:
 * ---> getAll(condition)       ->  Returns all database users
 * ---> get(condition)          ->  Returns the requested user by params
 * ---> del(condition)          ->  Deletes by a condition
 * ---> save()                  ->  Saves the object into database
 * ---> update()                ->  Updates the requested user
 * -----------------------------------------------------------------------------
 */

class UserMdl {
  /**
   * [constructor description: Defines all the object's attributes]
   * @param {[type]} args [description: the received params for making the instance]
   */
  constructor(args) {
    // If the value of a requested arg is an undefined value, does not create a
    // field for it (this is useful for the updating method).

    // FIXME este tipo de asignacion se puede hacer this.user_code = args.user_code || null;
    if (args.user_code !== undefined) {
      this.user_code = args.user_code;
    }
    if (args.name !== undefined) {
      this.name = args.name;
    }
    if (args.middle_name !== undefined) {
      this.middle_name = args.middle_name;
    }
    if (args.flastname !== undefined) {
      this.flastname = args.flastname;
    }
    if (args.mlastname !== undefined) {
      this.mlastname = args.mlastname;
    }
    if (args.email !== undefined) {
      this.email = args.email;
    }
    if (args.password !== undefined) {
      this.password = args.password;
    }
    if (args.privilages !== undefined) {
      this.privilages = args.privilages;
    }
    this.exist = '1';
  }

  /**
 * findUser find user using an email]
 * @param  {string}  email [email to find a user]
 */
  static async findUser(email) {
    const condition = `email = '${email}'`;
    try {
      this.data = await db.get('user', '*', condition);
      this.data = this.processResult(this.data);
    } catch (e) {
      console.log(`Error en findUser: ${e}`);
      return undefined;
    }
    return this.data;
  }

  /**
   * [result description: Returns all the valids columns for the user model]
   * @type {Array}
   */
  static get validColumns() {
    return [
      'user_code',
      'name',
      'middle_name',
      'flastname',
      'mlastname',
      'email',
      'password',
      'privilages',
      'exist',
    ];
  }

  async canDo(method, url, data) {
    let can = false; // Variable para definir permisos de ADMIN
    let ret = false; // Es la variable que se retorna, si tienes permisos
    // Cambiala a ture, en caso de no tener permisos se cambia a false
    if (this.privilages === 'ADMIN') {
      can = true;
    }
    switch (method) {
      case 'GET':
        switch (url) {
          case '/users':
            if (data.userId) {
              if (Number(this.user_code) === Number(data.userId)) {
                ret = true;
              }
            } else if (can) {
              ret = true;
            } else {
              ret = false;
            }
            break;
          case '/building':
            ret = true;
            break;
          case '/subject':
            ret = true;
            break;
          case '/topics':
            ret = true;
            break;
          default:
        }
        break;
      case 'DELETE':
        switch (url) {
          case '/users':
            if (data.userId) {
              if (Number(this.user_code) === Number(data.userId)) {
                ret = true;
              }
            } else {
              ret = false;
            }
            break;
          case '/building':
            if (can) {
              ret = true;
            } else {
              ret = false;
            }
            break;
          case '/subject':
            if (can) {
              ret = true;
            } else {
              ret = false;
            }
            break;
          case '/topics':
            ret = true;
            if (data.topicId && data.threadId && data.postId) {
              // Ruta --> '/:topicId/threads/:threadId/posts/:postId'
              const userPostId = await PostMdl.getUserOfPost(data.postId);
              if (this.user_code === userPostId) {
                ret = true;
              } else {
                ret = false;
              }
            } else if (data.topicId && data.threadId) {
              // Ruta --> '/:topicId/threads/:threadId'
              const userThreadId = await ThreadMdl.getUserOfThread(data.threadId);
              if (this.user_code === userThreadId) {
                ret = true;
              } else {
                ret = false;
              }
            } else if (data.topicId) {
            // Ruta --> '/:topicId'
              ret = false;
            } else {
            // Ruta --> '/forum'
              ret = false;
            }
            break;
          default:
        }
        break;
      case 'POST':
        switch (url) {
          case '/users':
            if (data.userId) {
              if (Number(this.user_code) === Number(data.userId)) {
                ret = true;
              }
            } else {
              ret = false;
            }
            break;
          case '/building':
            if (can) {
              ret = true;
            } else {
              ret = false;
            }
            break;
          case '/subject':
            if (can) {
              ret = true;
            } else {
              ret = false;
            }
            break;
          case '/topics':
            ret = true;
            if (data.topicId && data.threadId && data.postId) {
              // Ruta --> '/:topicId/threads/:threadId/posts/:postId'
              ret = true;
            } else if (data.topicId && data.threadId) {
              // Ruta --> '/:topicId/threads/:threadId'
              ret = true;
            } else if (data.topicId) {
              // Ruta --> '/:topicId'
              ret = false;
            } else {
              // Ruta --> '/forum'
              ret = false;
            }
            break;
          default:
        }
        break;
      case 'PUT':
        switch (url) {
          case '/users':
            if (data.userId) {
              if (Number(this.user_code) === Number(data.userId)) {
                ret = true;
              }
            } else {
              ret = false;
            }
            break;
          case '/building':
            if (can) {
              ret = true;
            } else {
              ret = false;
            }
            break;
          case '/subject':
            if (can) {
              ret = true;
            } else {
              ret = false;
            }
            break;
          case '/topics':
            ret = true;
            if (data.topicId && data.threadId && data.postId) {
              // Ruta --> '/:topicId/threads/:threadId/posts/:postId'
              const userPostId = await PostMdl.getUserOfPost(data.postId);
              if (this.user_code === userPostId) {
                ret = true;
              } else {
                ret = false;
              }
            } else if (data.topicId && data.threadId) {
              // Ruta --> '/:topicId/threads/:threadId'
              const userThreadId = await ThreadMdl.getUserOfThread(data.threadId);
              if (this.user_code === userThreadId) {
                ret = true;
              } else {
                ret = false;
              }
            } else if (data.topicId) {
              // Ruta --> '/:topicId'
              ret = false;
            } else {
              // Ruta --> '/forum'
              ret = false;
            }
            break;
          default:
        }
        break;
      case 'PATCH':
        switch (url) {
          case '/users':
            if (data.userId) {
              if (Number(this.user_code) === Number(data.userId)) {
                ret = true;
              }
            } else {
              ret = false;
            }
            break;
          case '/building':
            if (can) {
              ret = true;
            } else {
              ret = false;
            }
            break;
          default:
        }
        break;
      default:
    }
    return ret;
  }

  /**
   * [processResult description: Processes all the raw data and return the
   * requested data in a formatted way]
   * @param  {[type]} data [description: the returned data row from database]
   * @return {[type]}      [description: the formatted data]
   */
  static processResult(data) {
    this.result = [];
    data.forEach((res) => {
      this.result.push(new UserMdl(res));
    });
    return this.result;
  }

  /**
   * [processConditions description: Processes the params received from the req
   * and evaluates if all the req.params have valid names. Also evaluates which
   * columns have undefined values]
   * @param  {[type]} data [description: The req.params]
   * @return {[type]}      [description: A formatted string with the condition
   *                       for the query database]
   */
  static processConditions(data) {
    this.querySentence = '';
    const columns = UserMdl.validColumns;
    columns.forEach((column) => {
      if (data[column] !== undefined) {
        this.querySentence += `${column} = '${data[column]}' && `;
      }
    });
    if (this.querySentence.length < 1) {
      return '';
    }
    // if there are not more columns to evaluate, delete the last '&&' operator
    // from the query condition
    return this.querySentence.slice(0, -4);
  }

  /**
   * [validUser description: Validates if there's a user with the given ID]
   * @param  {[type]}  id [description: ID to evaluate]
   * @return {Promise}    [description: Makes a query to database and returns
   *                      the resulting data length; if the user exists, the
   *                      length must be greater than 1, if it's not, it will
   *                      the user does not exist]
   */
  static async validUser(id) {
    await db.get('user', 'user_code', `user_code = ${id}`)
      .then((results) => {
        this.result = results.length;
      })
      .catch(e => console.error(`.catch(${e})`));
    return this.result;
  }

  /**
   * [getAll description: Returns all users from database]
   * @param  {[type]}  condition [description: Specifies the conditions for the
   *                              requested users to search.]
   * @return {Promise}           [description: Returns all the users, or all the
   *                              requested users ]
   */
  static async getAll(condition) {
    let queryCondition = '';
    if (condition) {
      queryCondition = UserMdl.processConditions(condition);
    }
    await db.get('user', '*', queryCondition)
      .then((results) => {
        this.result = results;
      })
      .catch(e => console.error(`.catch(${e})`));
    return this.result;
  }

  /**
   * [get description: Returns an specific user from the database given certain
   * conditions or not.]
   * @param  {[type]}  columns   [description: Specifies which columns return]
   * @param  {[type]}  id        [description: Specifies the user's ID]
   * @param  {[type]}  condition [description: Specifies a condition if it exists]
   * @return {Promise}           [description: Return the requested data]
   */
  static async get(columns, id, condition) {
    let queryCondition = `user_code = ${id}`;
    if (condition) {
      if (condition.length > 1) {
        queryCondition += ` && ${UserMdl.processConditions(condition)}`;
      }
    }
    await db.get('user', columns, queryCondition)
      .then((results) => {
        this.result = results;
      })
      .catch(e => console.error(`.catch(${e})`));
    return this.result;
  }

  static async del(id, condition) {
    let queryCondition = `user_code = ${id}`;
    if (condition.length > 1) {
      queryCondition = UserMdl.processConditions(condition);
    }
    await db.logicalDel('user', queryCondition)
      .then((results) => {
        this.result = results;
        return this.result;
      })
      .catch(e => console.error(`.catch(${e})`));
    return this.result;
  }

  async save() {
    try {
      this.password = await bcrypt.hash(this.password, process.env.SECRET);
      this.result = await db.insert('user', this);
    } catch (e) {
      console.log(`${e}`);
    }
    return this.result;
  }

  async update(id) {
    const condition = `user_code = ${id}`;
    await db.update('user', this, condition)
      .then((results) => {
        this.result = results;
        return this.result;
      })
      .catch(e => console.error(`.catch(${e}})`));
    return this.result;
  }

  /**
   * Returns the user name formatted in a specific way
   * @param  {[type]} order param for set the name format
   * @return {[type]}       [description]
   */
  getFullName(order) {
    let name = '';
    switch (order) {
      case 1: // first lastnames, then names
        name += this.flastname + this.mlastname + this.name + this.middle_name;
        break;
      case 2: // first father's lastname, then first name
        name += this.flastname + this.mlastname;
        break;
      case 3: // first first name, then father's lastname
        name += this.name + this.flastname;
        break;
      case 4: // only returns first name
        name += this.name;
        break;
      default: // full name starting with the first name
        name += this.name + this.middle_name + this.flastname + this.mlastname;
    }
    return name;
  }

  /**
   * [getStudCode description]
   * @return {[type]} returns the user's identifier (primary key)
   */
  getStudCode() { return this.user_code; }

  /**
   * [getEmail description]
   * @return {[type]} returns the user's email
   */
  getEmail() { return this.email; }
}
module.exports = UserMdl;
