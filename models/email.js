/**
 * @Author: schwarze_falke
 * @Date:   2018-10-09T07:49:32-05:00
 * @Last modified by:   schwarze_falke
 * @Last modified time: 2018-10-11T02:46:50-05:00
 */
const db = require('../db'); // for database handling

/**
 * [EmailMdl model used for the email object]
 */

class EmailMdl {
  constructor(args) {
    if (args.email !== undefined) {
      this.email = args.email;
    }
    if (args.user_code !== undefined) {
      this.user_code = args.user_code;
    }
  }

  /**
 * [get method used for obtaining specified email
 * on a user id condition]
 * @method get
 * @param  {Number}  id [represents the user id]
 * @return {Promise}    [returns a specified email or emails]
 */

  static async get(id) {
    return new Promise(async (resolve, reject) => {
      this.emails = [];
      await db.get('email', '*', `WHERE user_code = ${id}`)
        .then((result) => {
          result.forEach((email) => {
            this.emails.push(email);
          });
        })
        .catch(e => reject(e));
      return resolve(this.emails);
    });
  }

  /**
   * [insert method used for inserting into the DB
   * a specified email, on a specified user]
   * @method insert
   * @param  {Number}  id        [represents the user id]
   * @param  {String}  userEmail [represents the user Email]
   * @return {Promise}           [returns a response composed of
   *                              userID and Email]
   */

  async insert(id, userEmail) {
    return new Promise(async (resolve, reject) => {
      this.information = {
        user_code: id,
        email: userEmail,
      };
      await db.insert('email', this.information)
        .then((result) => {
          this.reponse = {
            dataCreated: this.information,
            info: result,
          };
          return resolve(this.response);
        })
        .catch(e => reject(e));
    });
  }
}

module.exports = EmailMdl;
