const db = require('../db');

class PostMdl {
  constructor({
    post_id, content, user_code, thread_id, date
  }) {
    this.post_id = post_id;
    this.content = content;
    this.exist = 1;
    this.user_code = user_code;
    this.thread_id = thread_id;
    this.date = date;
  }

  /**
 * [required function cheks that the not null data is defined]
 * @return {Boolean} [if all any data is undefined it returns a true, else false]
 */
  required() {
    return (this.content !== undefined
    && this.exist !== undefined && this.user_code !== undefined
    && this.thread_id !== undefined && this.date !== undefined);
  }

  /**
 * [checks the way it is sorted and concatenate it to the string ]
 * @param  {string} data [The way it will be ordered]
 * @return {string}      [A sql order that describe if it is ordered asc or desc]
 */
  static processRequest(data) {
    let condition = '';
    if (data.sort) {
      condition += ` ORDER BY date ${data.sort}`;
    } else {
      condition += ' ORDER BY date';
    }
    return condition;
  }

  /**
   * [Takes the data sent and transform it to an object]
   * @param  {Json} data [information required to make an Object]
   * @return {Object}     return a PostMdl object
   */
  static processData(data) {
    const results = [];
    data.forEach((res) => {
      results.push(new PostMdl(res));
    });
    return results;
  }

  /**
   * [getAll description]
   * @param  {[type]}  threadId [description]
   * @return {Promise}          [description]
   */
  static async getAll(threadId) {
    const order = ' ORDER BY date';
    let res;
    const condition = `thread_id = ${threadId}`;
    await db.get('post', ['post_id', 'content', 'exist', 'user_code', 'thread_id', 'exist', 'date'], condition, order).then((results) => {
      res = this.processData(results);
    }).catch((e) => {
      console.log(`Error: ${e}`);
    });
    return res;
  }

  /**
   * [find method used for obtaining a specefied thread
   * on specefied conditions]
   * @method find
   * @param  {[Object]}  data     [an object that represents the specified conditions]
   * @param  {Number}  threadId [represents threadId]
   * @return {Promise}          [description]
   */

  static async find(data, threadId) {
    let condition;
    let order;
    let response;
    if (data.q || data.sort) {
      this.condition = `thread_id = ${threadId}`;
      if (data.q) {
        this.condition += `&& content LIKE '%${data.q}%'`;
      }
      condition = this.condition;
      order = this.processRequest(data);
    } else {
      condition = ` post_id = ${data} && thread_id = ${threadId}`;
    }
    await db.get('post', ['post_id', 'content', 'exist', 'user_code', 'thread_id', 'exist', 'date'], condition, order).then((result) => {
      response = this.processData(result);
    }).catch((e) => {
      console.error(`.catch(${e})`);
    });
    return response;
  }

  /**
   * the function first deletes the post_id because it isnt gonna be used
   * then it checks if all the variables needed to save a post are set, if
   * they are set it calls a function to save in the db, if they are not set
   * it retuns a number 1
   * @return {Promise} [description]
   */
  async save() {
    delete this.post_id;
    if (this.required()) {
      try {
        this.data = await db.insert('post', this);
        if (!(this.data === undefined)) {
          this.data = {
            insertId: this.data.insertId,
            content: this.content,
            date: this.date,
          };
        }
      } catch (e) {
        console.error(`.catch(${e})`);
      }
      return this.data;
    }
    return 1;
  }

  /**
 * function that receives a post id and a thread id to modify an specific post,
 * it modifies the content and the date.
 * @param  {string}  postId   [the post where you are going to modify]
 * @param  {string}  threadId [the thread were the id is being modify]
 * @return {Promise}          [Returns an object in form of a promese
 * the object contains the data modified.]
 */
  async modify(postId, threadId) {
    const condition = `post_id = ${postId} && thread_id = ${threadId}`;
    const obj = {};
    obj.content = this.content;
    obj.date = this.date;
    try {
      this.data = await db.update('post', obj, condition);
      if (!(this.data === undefined)) {
        this.data = {
          postId: postId,
          content: this.content,
          date: this.date,
        };
      }
    } catch (e) {
      console.error(`.catch(${e})`);
    }
    return this.data;
  }

  /**
   * funtion used to delete one post, it receives an id to identified the post
   * to be deleted, then it calls a db function to delete it.
   * @param  {[string]}  id [id of the post you are planing to delete]
   * @return {data}    [description]
   */
  async delete(id) {
    const condition = `post_id = ${id}`;
    try {
      this.data = await db.physicalDel('post', condition);
      if (!(this.data === undefined)) {
        this.data = {
          threadId: id,
        };
      }
    } catch (e) {
      console.error(`.catch(${e})`);
    }
    return this.data;
  }

  /**
  * [deleteAll is a function used to delete all posts from one thread, this
  * function is used when you delete a thread. it receives a condition and then
  * it calls the delete function from the db]
  * @param  {[string]}  condition [the thread id formated to use it as a sql
  * condition]
  * @return {Promise}           [description]
  */
  static async deleteAll(condition) {
    try {
      this.result = await db.physicalDel('post', condition);
    } catch (e) {
      console.error(`.catch(${e})`);
    }
    return this.result;
  }

  static async getUserOfPost(postId) {
    try {
      this.post = await db.get('post', ['user_code'], `post_id = ${postId}`);
      this.post = this.processData(this.post);
      this.userCode = this.post.userCode;
    } catch (e) {
      console.error(`.catch(${e})`);
    }
    return this.userCode;
  }
}
module.exports = PostMdl;
