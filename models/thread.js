/**
 * @Author: brandonmdiaz
 * @Date:   2018-10-09T01:15:15-05:00
 * @Last modified by:   brandonmdiaz
 * @Last modified time: 2018-10-09T01:40:18-05:00
 */



const db = require('../db');
const PostMdl = require('./post');

/**
   * [ThreadMdl model used for thread class]
   */

class ThreadMdl {
  constructor({
    thread_id, subject, created, user_code, topic_id
  }) {
    this.thread_id = thread_id;
    this.exist = 1;
    this.subject = subject;
    this.created = created;
    this.user_code = user_code;
    this.topic_id = topic_id;
  }

  required() {
    return (this.subject !== undefined
    && this.created !== undefined && this.user_code !== undefined
    && this.topic_id !== undefined);
  }

  // FIXME: los modelos no deben generar logica de base de datos
  static processRequest(data) {
    let condition = '';
    let count = 10;
    if (data.sort) {
      condition += ` ORDER BY created ${data.sort}`;
    } else {
      condition = ' ORDER BY created';
    }
    if (data.count) {
      condition += ` LIMIT ${data.count}`;
      if (data.count !== count) count = data.count;
    } else {
      condition += ` LIMIT ${count}`;
    }
    if (data.page) {
      condition += ` OFFSET ${(data.page - 1) * count} `;
    }
    return condition;
  }

  static processData(data) {
    const results = [];
    data.forEach((res) => {
      results.push(new ThreadMdl(res));
    });
    return results;
  }

  static async getAll(topicId) {
    const order = ' ORDER BY created';
    const condition = `topic_id = ${topicId}`;
    try {
      this.res = await db.get('thread', ['thread_id', 'exist', 'subject', 'created', 'user_code', 'topic_id'], condition, order);
      this.res = this.processData(this.res);
    } catch (e) {
      console.log(`Error: ${e}`);
    }
    return this.res;
  }

  static async find(data, topicId) {
    let condition;
    let order;
    if (data.q || data.page || data.count || data.sort) {
      this.condition = `topic_id = ${topicId}`;
      if (data.q) {
        this.condition += `&& subject LIKE '%${data.q}%'`;
      }
      condition = this.condition;
      order = this.processRequest(data);
    } else {
      condition = `thread_id = ${data} && topic_id = ${topicId}`;
    }
    try {
      this.response = await db.get('thread', ['thread_id', 'exist', 'subject', 'created', 'user_code', 'topic_id'], condition, order);
      this.response = this.processData(this.respose);
    } catch (e) {
      console.error(`.catch(${e})`);
    }
    return this.response;
  }

  async save() {
    const error = 1;
    delete this.thread_id;
    let data;
    if (this.required()) {
      try {
        this.data = await db.insert('thread', this);
        if (this.data === undefined) {
          data = 2;
        } else {
          data = {
            insertId: this.data.insertId,
            subject: this.subject,
            created: this.created,
          };
        }
      } catch (e) {
        console.error(`.catch(${e})`);
        return undefined;
      }
      return data;
    }
    return error;
  }

  /**
   * this functions creates a condition and then sends it to the db manager. so it can
   * modify the data given
   * @param  {integer}  threadId
   * @param  {integer}  topicId
   * @return {Object}  data     it returns the data modify
   */
  async modify(threadId, topicId) {
    const condition = `thread_id = ${threadId} && topic_id = ${topicId}`;
    const obj = {};
    obj.subject = this.subject;
    obj.created = this.created;
    try {
      this.result = await db.update('thread', obj, condition);
      if (this.result === undefined) {
        this.data = undefined;
      } else {
        this.data = {
          threadId: threadId,
          subject: this.subject,
          created: this.created,
        };
      }
    } catch (e) {
      console.error(`.catch(${e})`);
      return undefined;
    }

    return this.data;
  }

  /**
 * delete a thread with the user id
 * @param  {[type]}  id [description]
 * @return {Promise}    [description]
 */
  static async delete(id) {
    let data;
    const condition = `thread_id = ${id}`;
    const obj = {};
    obj.exist = 0;
    try {
      this.result = await db.update('thread', obj, condition);
      if (this.result === undefined) {
        data = undefined;
      } else {
        data = {
          threadId: id,
        };
      }
    } catch (e) {
      console.error(`.catch(${e})`);
    }
    return data;
  }

  /**
 * [deleteReal deletes all posts from the thread, and then deletes the thread]
 * @param  {integer}  id [description]
 * @return {}    [description]
 */
  static async deleteReal(id) {
    let data;
    await PostMdl.deleteAll(`thread_id = ${id}`).then((result) => {
      data = result;
    }).catch((e) => {
      console.error(`Error:${e}`);
    });
    const condition = `thread_id = ${id}`;
    await db.physicalDel('thread', condition).then((result) => {
      if (result === undefined) {
        data = undefined;
      } else {
        data = {
          threadId: id,
          affectedRows: result.affectedRows,
        };
      }
    }).catch((e) => {
      console.error(`.catch(${e})`);
    });
    return data;
  }
}
module.exports = ThreadMdl;
