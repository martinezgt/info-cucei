/**
 * @ author: brandonmdiaz
 */
const UserMdl = require('./user');

class ResetPassword {
  constructor(args) {
    this.token = args.token;
    this.created_at = args.created_at;
    this.expires = args.expires;
    this.type = args.type;
    this.active = args.active;
    this.user_id = args.user_id;
  }

  /**
   * [validEmail method used for validating an email]
   * @method validEmail
   * @param  {String}   email [a string representing the email to be tested]
   * @return {[type]}         [returns the result of the regular expression]
   */

  static validEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  /**
   * [findUser method used to find a user based on an email]
   * @method findUser
   * @param  {String}  email [a string representing the users email]
   * @return {Promise}       [returns the specefied user]
   */

  static async findUser(email) {
    this.user = await UserMdl.findUser(email);
    return this.user;
  }
}

module.exports = ResetPassword;
